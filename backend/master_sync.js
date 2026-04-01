const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { getPatternForSlug } = require('./src/utils/patternMapper');

const prisma = new PrismaClient();
const LEETCODE_API_URL = 'https://leetcode.com/api/problems/all/';

// Helper to stringify objects/arrays for the Prisma String column
const ensureString = (val) => {
    if (val === null || val === undefined) return null;
    if (typeof val === 'string') return val;
    return JSON.stringify(val);
};

async function run() {
    try {
        console.log('🚀 Fetching Master Catalog from LeetCode API...');
        const response = await axios.get(LEETCODE_API_URL);
        const allProblems = response.data.stat_status_pairs;
        console.log(`📦 Found ${allProblems.length} problems in catalog.`);

        // 🔍 Index all meta files in the current folder for fast lookup
        const metaFiles = fs.readdirSync(__dirname).filter(f => f.endsWith('_meta.json'));
        const metaLookup = {}; 
        
        for (const metaFile of metaFiles) {
            try {
                const meta = JSON.parse(fs.readFileSync(path.join(__dirname, metaFile), 'utf8'));
                if (meta.slug) metaLookup[meta.slug] = meta;
                // Also handle common slug variations (hyphen to underscore)
                if (meta.slug) metaLookup[meta.slug.replace(/-/g, '_')] = meta;
            } catch (err) {
                console.warn(`⚠️ Could not parse meta file ${metaFile}:`, err.message);
            }
        }

        // Also index existing curated problems from frontend if they exist
        const curatedPath = path.join(__dirname, '../frontend/src/data/problems.json');
        if (fs.existsSync(curatedPath)) {
            const curated = JSON.parse(fs.readFileSync(curatedPath, 'utf8'));
            for (const p of curated) {
                if (p.slug) metaLookup[p.slug] = { ...p, ...metaLookup[p.slug] };
            }
        }

        console.log(`🚀 Starting Master Restoration for ${allProblems.length} problems...`);

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
                status: metaData.status || 'draft',
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
                if (count % 100 === 0) console.log(`✅ Progress: ${count}/${allProblems.length} synced...`);
            } catch (err) {
                console.error(`❌ Failed on: ${title} (${slug})`, err.message);
            }
        }

        console.log(`\n🎉 MASTER RESTORATION COMPLETE!`);
        console.log(`📊 Total Upserted: ${count} problems.`);
        
    } catch (err) {
        console.error('CRITICAL ERROR:', err.message);
    } finally {
        await prisma.$disconnect();
    }
}

run();
