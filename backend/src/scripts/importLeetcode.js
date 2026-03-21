const { PrismaClient } = require('@prisma/client');
const axios = require('axios');

const prisma = new PrismaClient();

// Basic mapping function to assign our platform's algorithmTypes based on problem data
function determineAlgorithmType(stat) {
    const title = stat.question__title.toLowerCase();
    
    // Basic heuristic mapping
    if (title.includes('tree') || title.includes('bst')) return 'dfs';
    if (title.includes('list') || title.includes('node')) return 'linked_lists';
    if (title.includes('sort')) return 'arrays';
    if (title.includes('array')) return 'arrays';
    if (title.includes('string')) return 'strings';
    if (title.includes('matrix') || title.includes('grid')) return 'matrices';
    if (title.includes('window')) return 'sliding_window';
    if (title.includes('pointer')) return 'two_pointers';
    if (title.includes('path') || title.includes('graph')) return 'bfs';
    if (title.includes('search')) return 'binary_search';
    
    return 'arrays'; // Default fallback
}

// Difficulty mapping from Leetcode Integer to String
function getDifficultyString(level) {
    switch(level) {
        case 1: return 'Easy';
        case 2: return 'Medium';
        case 3: return 'Hard';
        default: return 'Medium';
    }
}

async function main() {
    console.log("Fetching all problems from LeetCode API...");
    try {
        const response = await axios.get('https://leetcode.com/api/problems/all/', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'application/json',
                'Referer': 'https://leetcode.com/problemset/all/'
            }
        });

        const data = response.data;
        if (!data || !data.stat_status_pairs) {
            console.error("Failed to parse LeetCode API response.");
            return;
        }

        const pairs = data.stat_status_pairs;
        console.log(`Found ${pairs.length} total problems.`);

        let successCount = 0;
        let skippedCount = 0;
        let errorCount = 0;

        // Note: Prisma operations in bulk can be slow, using a transaction or batching is better, 
        // but since we want upsert (to not break foreign keys or existing solved stats), loop is okay but might take a minute.
        
        console.log("Beginning database ingestion. This may take a moment...");
        
        // Prepare data for createMany/upsert
        for (const pair of pairs) {
            const stat = pair.stat;
            const difficultyLevel = pair.difficulty.level; // 1: Easy, 2: Medium, 3: Hard
            const isPremium = pair.paid_only;
            
            // Exclude paid only if we only want free? "If possible add the premium things also". Yes!
            
            const questionId = stat.frontend_question_id; // Using frontend ID so it matches perfectly
            
            try {
                await prisma.problem.upsert({
                    where: { slug: stat.question__title_slug },
                    update: {
                        id: questionId,
                        title: stat.question__title,
                        difficulty: getDifficultyString(difficultyLevel),
                        // Only update algorithmType if it's currently null or empty, to preserve manual curations
                    },
                    create: {
                        id: questionId,
                        slug: stat.question__title_slug,
                        title: stat.question__title,
                        difficulty: getDifficultyString(difficultyLevel),
                        algorithmType: determineAlgorithmType(stat),
                        status: isPremium ? 'premium' : 'free',
                        problem_statement: 'Full description tracking arriving soon. (Imported from LeetCode)',
                        brute_force_steps: '[]',
                        optimal_steps: '[]',
                        complexity: '{}',
                        tags: '[]',
                        constraints: '[]',
                        examples: '[]',
                        patternSignals: '[]',
                        edgeCases: '[]',
                        thinking_guide: '{}',
                        secondaryPatterns: '[]'
                    }
                });
                successCount++;
                if (successCount % 500 === 0) {
                    console.log(`Ingested ${successCount} problems...`);
                }
            } catch (innerErr) {
                // If it fails on ID conflict (some old IDs might conflict), we can skip tracking
                // console.error(`Failed to upsert ${stat.question__title_slug}: ` + innerErr.message);
                errorCount++;
            }
        }

        console.log(`✅ Ingestion Complete!`);
        console.log(`Successfully imported/updated: ${successCount}`);
        console.log(`Errors: ${errorCount}`);

    } catch (err) {
        console.error("Script execution failed:", err.message);
    }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
