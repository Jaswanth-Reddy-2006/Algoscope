const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
    try {
        const problems = await prisma.problem.findMany({
            where: { slug: { startsWith: 'h-' } },
            select: { slug: true, title: true }
        });
        console.log(problems);
    } catch (error) {
        console.error('Check failed:', error);
    } finally {
        await prisma.$disconnect();
    }
}

check();
