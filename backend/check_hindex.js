const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
    try {
        const p = await prisma.problem.findUnique({
            where: { slug: 'h-index' }
        });
        console.log(JSON.stringify(p, null, 2));
    } catch (error) {
        console.error('Check failed:', error);
    } finally {
        await prisma.$disconnect();
    }
}

check();
