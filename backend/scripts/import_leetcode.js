const axios = require('axios');
const { PrismaClient } = require('@prisma/client');
const { getPatternForSlug } = require('../src/utils/patternMapper');
const prisma = new PrismaClient();

const DATA_URL = 'https://raw.githubusercontent.com/noworneverev/leetcode-api/main/data/leetcode_questions.json';

async function importLeetCode() {
    console.log("🚀 Starting LeetCode bulk import...");
    
    try {
        console.log(`📥 Downloading dataset from: ${DATA_URL}`);
        const response = await axios.get(DATA_URL);
        const data = response.data;
        
        if (!Array.isArray(data)) {
            throw new Error("Invalid data format: Expected an array.");
        }
        
        console.log(`✅ Downloaded ${data.length} potential questions.`);
        
        let upsertedCount = 0;
        
        // Batching to avoid overwhelming the DB/Memory
        const BATCH_SIZE = 50; // Smaller batch size for safety
        for (let i = 0; i < data.length; i += BATCH_SIZE) {
            const batch = data.slice(i, i + BATCH_SIZE);
            console.log(`🔄 Processing batch ${Math.floor(i / BATCH_SIZE) + 1} of ${Math.ceil(data.length / BATCH_SIZE)}...`);
            
            await Promise.all(batch.map(async (item) => {
                const question = item.data?.question;
                if (!question) return;
                
                let slug = question.titleSlug;
                if (!slug && question.url) {
                    const match = question.url.match(/\/problems\/([^/]+)\//);
                    if (match) slug = match[1];
                }
                if (!slug && question.title) {
                    slug = question.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]/g, '');
                }

                if (!slug) return;
                
                const pattern = getPatternForSlug(slug);
                
                let acceptanceRate = null;
                try {
                    // stats is sometimes an object, sometimes a stringified JSON
                    const stats = typeof question.stats === 'string' ? JSON.parse(question.stats) : question.stats;
                    if (stats && stats.acRate) {
                        acceptanceRate = parseFloat(stats.acRate.replace('%', ''));
                    }
                } catch (e) {
                    // Ignore stats parsing errors
                }

                const tags = question.topicTags ? JSON.stringify(question.topicTags.map(t => t.name)) : null;
                const codeSnippets = question.codeSnippets ? JSON.stringify(question.codeSnippets) : null;

                try {
                    await prisma.problem.upsert({
                        where: { slug: slug },
                        update: {
                            title: question.title,
                            difficulty: question.difficulty,
                            problem_statement: question.content,
                            tags: tags,
                            acceptanceRate: acceptanceRate,
                            codeSnippets: codeSnippets,
                            algorithmType: pattern,
                            primaryPattern: pattern
                        },
                        create: {
                            slug: slug,
                            title: question.title,
                            difficulty: question.difficulty,
                            problem_statement: question.content,
                            tags: tags,
                            acceptanceRate: acceptanceRate,
                            codeSnippets: codeSnippets,
                            algorithmType: pattern,
                            primaryPattern: pattern
                        }
                    });
                    upsertedCount++;
                } catch (err) {
                    console.error(`❌ Failed to upsert ${slug}:`, err.message);
                }
            }));
        }
        
        console.log(`\n🎉 Import Complete!`);
        console.log(`📊 Total processed: ${data.length}`);
        console.log(`✅ Successfully upserted: ${upsertedCount}`);
        
    } catch (error) {
        console.error("💥 Import failed:", error.message);
    } finally {
        await prisma.$disconnect();
    }
}

importLeetCode();
