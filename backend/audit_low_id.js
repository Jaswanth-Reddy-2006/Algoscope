const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function audit() {
    try {
        const broken = await prisma.problem.findMany({
            where: {
                OR: [
                    { problem_statement: { contains: 'premium' } },
                    { problem_statement: { contains: 'hidden' } },
                    { problem_statement: { contains: 'arriving soon' } },
                    { problem_statement: { contains: 'Standard LeetCode problem' } }
                ]
            },
            select: { id: true, slug: true, title: true, problem_statement: true }
        });

        console.log('Total broken/placeholder problems:', broken.length);
        
        // Let's check some known free problem slugs if they are in this list
        const commonFreeSlugs = ['two-sum', 'add-two-numbers', 'longest-substring-without-repeating-characters', 'median-of-two-sorted-arrays', 'longest-palindromic-substring'];
        const missingCommon = broken.filter(p => commonFreeSlugs.includes(p.slug));
        console.log('Missing common free problems:', missingCommon.map(p => p.slug));

        // Check for problems with low IDs that might be free
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
