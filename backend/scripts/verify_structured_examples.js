const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const p = await prisma.problem.findUnique({
        where: { slug: 'two-sum' },
        select: { structuredExamples: true, title: true }
    });
    console.log(`Problem: ${p.title}`);
    console.log(`Structured Examples: ${p.structuredExamples}`);
    await prisma.$disconnect();
}

main();
