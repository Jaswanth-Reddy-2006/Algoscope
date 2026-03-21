const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function audit() {
    try {
        const problems = await prisma.problem.findMany({
            select: { id: true, slug: true, title: true, problem_statement: true }
        });

        const placeholders = [
            'Content is premium or hidden',
            'Please connect your active LeetCode session sequence',
            'Full description tracking arriving soon',
            'Standard LeetCode problem:',
            'Practice your skills with this scenario'
        ];

        const broken = problems.filter(p => {
            const s = p.problem_statement || '';
            return placeholders.some(ph => s.includes(ph));
        });

        console.log('Total problems in database:', problems.length);
        console.log('Truly broken/placeholder problems:', broken.length);

        const premiumMessageCount = broken.filter(p => p.problem_statement.includes('Content is premium or hidden')).length;
        const arrivingSoonCount = broken.filter(p => p.problem_statement.includes('Full description tracking arriving soon')).length;
        const standardPlaceholderCount = broken.filter(p => p.problem_statement.includes('Standard LeetCode problem:')).length;

        console.log('Premium/Hidden message count:', premiumMessageCount);
        console.log('Arriving Soon count:', arrivingSoonCount);
        console.log('Standard Placeholder count:', standardPlaceholderCount);

        const lowIdBroken = broken.filter(p => p.id < 500);
        console.log('Broken problems with ID < 500:', lowIdBroken.length);
        if (lowIdBroken.length > 0) {
            console.log('Sample low ID broken slugs:', lowIdBroken.slice(0, 20).map(p => `${p.id}: ${p.slug}`).join(', '));
        }

    } catch (error) {
        console.error('Audit failed:', error);
    } finally {
        await prisma.$disconnect();
    }
}

audit();
