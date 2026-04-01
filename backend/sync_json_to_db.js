const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();
const JSON_PATH = path.join(__dirname, '../frontend/src/data/problems.json');

// Helper to stringify objects/arrays for the Prisma String column
const ensureString = (val) => {
    if (val === null || val === undefined) return null;
    if (typeof val === 'string') return val;
    return JSON.stringify(val);
};

async function run() {
    try {
        if (!fs.existsSync(JSON_PATH)) {
            console.error(`ERROR: Main problems file not found at ${JSON_PATH}`);
            return;
        }

        // 🔍 Index all meta files in the current folder for fast lookup
        const metaFiles = fs.readdirSync(__dirname).filter(f => f.endsWith('_meta.json'));
        const metaLookup = {}; // Map by slug or ID
        
        for (const metaFile of metaFiles) {
            try {
                const meta = JSON.parse(fs.readFileSync(path.join(__dirname, metaFile), 'utf8'));
                if (meta.slug) metaLookup[meta.slug] = meta;
                if (meta.id) metaLookup[String(meta.id)] = meta;
                // Also handle common slug variations (hyphen to underscore)
                if (meta.slug) metaLookup[meta.slug.replace(/-/g, '_')] = meta;
            } catch (err) {
                console.warn(`⚠️ Could not parse meta file ${metaFile}:`, err.message);
            }
        }

        const problems = JSON.parse(fs.readFileSync(JSON_PATH, 'utf8'));
        console.log(`🚀 Starting Exhaustive Sync for ${problems.length} problems...`);

        for (const p of problems) {
            // Find meta by slug, ID, or slug variation
            const metaData = metaLookup[p.slug] || 
                           metaLookup[String(p.id)] || 
                           metaLookup[p.slug.replace(/-/g, '_')] || 
                           metaLookup[p.slug.split('-')[0]] || // case for longest_sub_meta.json?
                           {};

            if (Object.keys(metaData).length > 0) {
                console.log(`   📦 Merging rich discovery data for: ${p.title}`);
            }

            // Merge: Meta file takes priority for rich content
            const problem = { ...p, ...metaData };

            const data = {
                title: problem.title,
                slug: problem.slug,
                difficulty: problem.difficulty,
                algorithmType: problem.algorithmType,
                status: problem.status,
                tags: ensureString(problem.tags),
                primaryPattern: problem.primaryPattern,
                shortPatternReason: problem.shortPatternReason,
                time_complexity: problem.time_efficiency || problem.time_complexity,
                space_complexity: problem.space_efficiency || problem.space_complexity,
                problem_statement: problem.problem_statement,
                labConfig: ensureString(problem.labConfig),
                constraints: ensureString(problem.constraints),
                edgeCases: ensureString(problem.edgeCases),
                examples: ensureString(problem.examples),
                thinking_guide: ensureString(problem.thinking_guide),
                complexity: ensureString(problem.complexity),
                brute_force_explanation: problem.brute_force_explanation,
                brute_force_steps: ensureString(problem.brute_force_steps),
                optimal_explanation: problem.optimal_explanation,
                optimal_steps: ensureString(problem.optimal_steps),
                optimal_variants: ensureString(problem.optimal_variants),
                structuredExamples: ensureString(problem.structuredExamples),
                companyTags: ensureString(problem.companyTags),
                codeSnippets: ensureString(problem.codeSnippets),
                patternSignals: ensureString(problem.patternSignals),
                secondaryPatterns: ensureString(problem.secondaryPatterns)
                // Note: acceptanceRate is skipped as it might not be in the current DB schema
            };

            try {
                await prisma.problem.upsert({
                    where: { slug: p.slug },
                    update: data,
                    create: {
                        ...data
                        // Note: id is handled by autoincrement
                    }
                });
            } catch (upsertError) {
                console.error(`❌ Failed on problem: ${p.title} (${p.slug})`);
                console.error('Error Details:', upsertError.message);
                // We continue despite errors to sync as much as possible
            }
        }
        console.log('✅ Exhaustive Sync completed.');
    } catch (e) {
        console.error('❌ Sync failed!');
        console.error(e.message);
    } finally {
        await prisma.$disconnect();
    }
}

run();
