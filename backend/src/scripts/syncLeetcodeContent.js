const { PrismaClient } = require('@prisma/client');
const axios = require('axios');

const prisma = new PrismaClient();

const QUERY = `
query questionData($titleSlug: String!) {
  question(titleSlug: $titleSlug) {
    content
    hints
    exampleTestcaseList
    metaData
    stats
    companyTagStats
    codeSnippets {
      lang
      langSlug
      code
    }
  }
}
`;

async function fetchQuestionData(slug) {
    try {
        const response = await axios.post('https://leetcode.com/graphql', {
            query: QUERY,
            variables: { titleSlug: slug }
        }, {
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Referer': `https://leetcode.com/problems/${slug}/`
            }
        });
        
        if (response.data.errors) {
            console.error(`GQL errors for ${slug}:`, JSON.stringify(response.data.errors));
        }
        return response.data.data.question;
    } catch (e) {
        console.error(`Failed to fetch content for ${slug}:`, e.message);
        if (e.response) {
            console.error('Response data:', JSON.stringify(e.response.data));
        }
        return null;
    }
}

async function processPhase(phaseSize) {
    const problems = await prisma.problem.findMany({
        where: {
            OR: [
                { problem_statement: null },
                { codeSnippets: null },
                { companyTags: null }
            ]
        },
        take: phaseSize
    });

    if (problems.length === 0) {
        return 0; // All done!
    }

    console.log(`\n--- Starting Phase: Processing ${problems.length} problems ---`);
    let processed = 0;

    for (const p of problems) {
        process.stdout.write(`Syncing [${p.slug}]... `);
        
        const data = await fetchQuestionData(p.slug);
        
        if (data) {
            if (data.content) {
                try {
                    await prisma.problem.update({
                        where: { id: p.id },
                        data: {
                            problem_statement: data.content,
                            examples: JSON.stringify(data.exampleTestcaseList || []),
                            thinking_guide: JSON.stringify({ hints: data.hints || [] }),
                            companyTags: data.companyTagStats || null,
                            codeSnippets: data.codeSnippets ? JSON.stringify(data.codeSnippets) : null
                        }
                    });
                    console.log('✅ Success');
                    processed++;
                } catch (err) {
                    console.log('❌ DB Update Failed');
                }
            } else {
                // Premium or hidden content but we might still have stats
                console.log('⚠️ No content found (Premium?)');
                await prisma.problem.update({
                    where: { id: p.id },
                    data: {
                        problem_statement: 'Content is premium or hidden. Please connect your active LeetCode session sequence.',
                        companyTags: data.companyTagStats || null
                    }
                });
                processed++;
            }
        } else {
            // Hard fail, mark to skip
            await prisma.problem.update({
                where: { id: p.id },
                data: { acceptanceRate: -1 } 
            });
            processed++;
        }
        
        // Anti-ban delay: Sleep for 1.5 seconds between requests
        await new Promise(resolve => setTimeout(resolve, 1500));
    }
    
    return processed;
}

async function main() {
    console.log("Starting Autonomous LeetCode Content Daemon...");
    
    let phaseCount = 1;
    const PHASE_SIZE = 50;
    
    while (true) {
        console.log(`\n🚀 Commencing Phase ${phaseCount}...`);
        
        const processed = await processPhase(PHASE_SIZE);
        
        if (processed === 0) {
            console.log("\n🎉 All 3800+ problems have been fully synced! The daemon is exiting.");
            break;
        }
        
        console.log(`Phase ${phaseCount} complete. Taking a 5-second breather before the next phase...`);
        await new Promise(resolve => setTimeout(resolve, 5000));
        phaseCount++;
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
