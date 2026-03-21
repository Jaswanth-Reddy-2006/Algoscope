const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
    try {
        const p = await prisma.problem.findUnique({
            where: { slug: 'h-index' }
        });
        console.log('Statement Length:', p.problem_statement?.length);
        console.log('Statement Content:', p.problem_statement);
    } catch (error) {
        console.error('Check failed:', error);
    } finally {
        await prisma.$disconnect();
    }
}

check();
