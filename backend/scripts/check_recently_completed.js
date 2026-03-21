const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const problems = await prisma.problem.findMany({
        where: { status: 'complete' },
        take: 5,
        orderBy: { id: 'desc' }
    });
    
    console.log(`Found ${problems.length} complete problems.\n`);
    
    problems.forEach(p => {
        console.log(`Slug: ${p.slug}`);
        console.log(`Hints (TG): ${p.thinking_guide?.substring(0, 50)}...`);
        console.log(`Optimal Variants: ${p.optimal_variants?.substring(0, 50)}...`);
        console.log(`Complexity: ${p.complexity}`);
        console.log(`Lab Config: ${p.labConfig?.substring(0, 50)}...`);
        console.log('---');
    });
    
    await prisma.$disconnect();
}

main();
