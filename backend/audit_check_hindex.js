const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
    try {
        const p = await prisma.problem.findUnique({
            where: { slug: 'h-index' }
        });
        const s = p.problem_statement || '';
        const placeholders = [
            'Content is premium or hidden',
            'Please connect your active LeetCode session sequence',
            'Full description tracking arriving soon',
            'Standard LeetCode problem:',
            'Practice your skills with this scenario'
        ];

        console.log('Slug:', p.slug);
        placeholders.forEach(ph => {
            if (s.includes(ph)) {
                console.log('MATCHED:', ph);
            }
        });

    } catch (error) {
        console.error('Check failed:', error);
    } finally {
        await prisma.$disconnect();
    }
}

check();
