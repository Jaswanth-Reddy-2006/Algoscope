const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();
const JSON_PATH = path.join(__dirname, '../frontend/src/data/problems.json');

async function run() {
    try {
        const problems = JSON.parse(fs.readFileSync(JSON_PATH, 'utf8'));
        console.log(`Syncing ${problems.length} problems from frontend JSON to database...`);

        for (const p of problems) {
            // Find if exists by slug (slug is unique)
            const existing = await prisma.problem.findUnique({
                where: { slug: p.slug }
            });

            const data = {
                title: p.title,
                slug: p.slug,
                difficulty: p.difficulty,
                algorithmType: p.algorithmType,
                status: p.status,
                tags: JSON.stringify(p.tags || []),
                primaryPattern: p.primaryPattern,
                shortPatternReason: p.shortPatternReason,
                time_complexity: p.time_efficiency,
                space_complexity: p.space_efficiency,
                problem_statement: p.problem_statement,
                labConfig: p.labConfig ? JSON.stringify(p.labConfig) : null,
                constraints: JSON.stringify(p.constraints || []),
                edgeCases: JSON.stringify(p.edgeCases || []),
                thinking_guide: JSON.stringify(p.thinking_guide || {}),
                complexity: JSON.stringify(p.complexity || {})
            };

            if (existing) {
                // If it's one of the ones we just updated, or generally update all to be safe
                if (p.id === 509 || p.id === 46 || p.id < 50) {
                   await prisma.problem.update({
                        where: { slug: p.slug },
                        data: data
                    });
                }
            } else {
                await prisma.problem.create({
                    data: {
                        id: p.id,
                        ...data
                    }
                });
                console.log(`Created new problem: ${p.title} (ID: ${p.id})`);
            }
        }
        console.log('Sync completed.');
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

run();
