const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { getPatternForSlug } = require('./src/utils/patternMapper');

// PRODUCTION CONFIG
const PRODUCTION_DB_URL = 'postgresql://postgres:2006ReddyJaswanth@algoscope-db.cnq6cekgy2oh.eu-north-1.rds.amazonaws.com:5432/algoscope';
const LEETCODE_API_URL = 'https://leetcode.com/api/problems/all/';

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: PRODUCTION_DB_URL,
        },
    },
});

const ensureString = (val) => {
    if (val === null || val === undefined) return null;
    if (typeof val === 'string') return val;
    return JSON.stringify(val);
};

async function run() {
    console.log('🌐 [AWS PRODUCTION] Starting Master Sync to RDS...');
    try {
        console.log('🚀 Fetching Master Catalog from LeetCode API...');
        const response = await axios.get(LEETCODE_API_URL);
        const allProblems = response.data.stat_status_pairs;
        console.log(`📦 Found ${allProblems.length} problems in catalog.`);

        // 🔍 Index local metadata for rich enhancement
        const metaFiles = fs.readdirSync(__dirname).filter(f => f.endsWith('_meta.json'));
        const metaLookup = {}; 
        
        for (const metaFile of metaFiles) {
            try {
                const meta = JSON.parse(fs.readFileSync(path.join(__dirname, metaFile), 'utf8'));
                if (meta.slug) metaLookup[meta.slug] = meta;
                if (meta.slug) metaLookup[meta.slug.replace(/-/g, '_')] = meta;
            } catch (err) {
                console.warn(`⚠️ Could not parse meta file ${metaFile}:`, err.message);
            }
        }

        const curatedPath = path.join(__dirname, '../frontend/src/data/problems.json');
        if (fs.existsSync(curatedPath)) {
            const curated = JSON.parse(fs.readFileSync(curatedPath, 'utf8'));
            for (const p of curated) {
                if (p.slug) metaLookup[p.slug] = { ...p, ...metaLookup[p.slug] };
            }
        }

        console.log(`🚀 Ingesting into AWS RDS...`);

        let count = 0;
        for (const entry of allProblems) {
            const stat = entry.stat;
            const slug = stat.question__title_slug;
            const title = stat.question__title;
            const level = entry.difficulty.level; // 1: Easy, 2: Medium, 3: Hard
            const difficulty = level === 1 ? 'Easy' : (level === 2 ? 'Medium' : 'Hard');

            const metaData = metaLookup[slug] || {};
            
            const data = {
                title: metaData.title || title,
                slug: slug,
                difficulty: metaData.difficulty || difficulty,
                algorithmType: metaData.algorithmType || getPatternForSlug(slug),
                status: metaData.status || (metaData.labConfig ? 'complete' : 'draft'),
                tags: ensureString(metaData.tags),
                primaryPattern: metaData.primaryPattern || getPatternForSlug(slug),
                shortPatternReason: metaData.shortPatternReason,
                time_complexity: metaData.time_efficiency || metaData.time_complexity,
                space_complexity: metaData.space_效率 || metaData.space_complexity,
                problem_statement: metaData.problem_statement,
                labConfig: ensureString(metaData.labConfig),
                constraints: ensureString(metaData.constraints),
                edgeCases: ensureString(metaData.edgeCases),
                examples: ensureString(metaData.examples),
                thinking_guide: ensureString(metaData.thinking_guide),
                complexity: ensureString(metaData.complexity),
                brute_force_explanation: metaData.brute_force_explanation,
                brute_force_steps: ensureString(metaData.brute_force_steps),
                optimal_explanation: metaData.optimal_explanation,
                optimal_steps: ensureString(metaData.optimal_steps),
                optimal_variants: ensureString(metaData.optimal_variants),
                structuredExamples: ensureString(metaData.structuredExamples),
                companyTags: ensureString(metaData.companyTags),
                codeSnippets: ensureString(metaData.codeSnippets),
                patternSignals: ensureString(metaData.patternSignals),
                secondaryPatterns: ensureString(metaData.secondaryPatterns)
            };

            try {
                await prisma.problem.upsert({
                    where: { slug: slug },
                    update: data,
                    create: data
                });
                count++;
                if (count % 100 === 0) console.log(`✅ [AWS] Progress: ${count}/${allProblems.length} synced...`);
            } catch (err) {
                console.error(`❌ [AWS] Failed on: ${slug}`, err.message);
            }
        }

        console.log(`\n🎉 AWS PRODUCTION SYNC COMPLETE!`);
        console.log(`📊 Total Upserted: ${count} problems.`);
        
    } catch (err) {
        console.error('🔴 CRITICAL AWS RDS ERROR:', err.message);
        if (err.message.includes('ETIMEDOUT') || err.message.includes('Connection refused')) {
            console.error('👉 TIP: Ensure your IP is whitelisted in the AWS RDS Security Group.');
        }
    } finally {
        await prisma.$disconnect();
    }
}

run();
