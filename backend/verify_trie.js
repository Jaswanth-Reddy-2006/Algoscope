const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
    try {
        const p = await prisma.problem.findUnique({
            where: { slug: 'implement-trie' }
        });
        const content = p.problem_statement || '';
        const placeholders = [
            'Content is premium or hidden',
            'Please connect your active LeetCode session sequence',
            'Full description tracking arriving soon',
            'Standard LeetCode problem:',
            'Practice your',
            'skills with this scenario'
        ];
        
        console.log('slug:', p.slug);
        placeholders.forEach(ph => {
            console.log(`Contains "${ph}":`, content.includes(ph));
        });

    } catch (error) {
        console.error('Check failed:', error);
    } finally {
        await prisma.$disconnect();
    }
}

check();
