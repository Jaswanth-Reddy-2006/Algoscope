const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const p = await prisma.problem.findUnique({
        where: { slug: 'two-sum' },
        select: { status: true, title: true }
    });
    console.log(`Problem: ${p.title}`);
    console.log(`Status: ${p.status}`);
    await prisma.$disconnect();
}

main();
