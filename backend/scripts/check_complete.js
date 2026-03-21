const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const completed = await prisma.problem.findMany({
        where: { status: 'complete' },
        select: { slug: true, title: true }
    });
    console.log(`Completed Problems: ${completed.length}`);
    completed.forEach(p => console.log(`- ${p.title} (${p.slug})`));

    await prisma.$disconnect();
}

main();
