const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
    try {
        const p = await prisma.problem.findUnique({
            where: { slug: 'implement-trie' }
        });
        console.log('Slug:', p.slug);
        console.log('Length:', p.problem_statement?.length);
        console.log('Sample:', p.problem_statement?.substring(0, 100));
    } catch (error) {
        console.error('Check failed:', error);
    } finally {
        await prisma.$disconnect();
    }
}

check();
