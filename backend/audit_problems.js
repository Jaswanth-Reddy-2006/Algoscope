const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function audit() {
    try {
        const total = await prisma.problem.count();
        const premium = await prisma.problem.findMany({
            where: {
                OR: [
                    { problem_statement: { contains: 'premium' } },
                    { problem_statement: { contains: 'hidden' } },
                    { problem_statement: { contains: 'active leetcode session' } }
                ]
            },
            select: {
                slug: true,
                problem_statement: true
            }
        });

        console.log('Total problems in database:', total);
        console.log('Problems with premium/hidden content:', premium.length);
        
        if (premium.length > 0) {
            console.log('\nFirst 20 slugs with premium content:');
            console.log(premium.slice(0, 20).map(p => p.slug).join(', '));
            
            console.log('\nExample problem statement snippet:');
            console.log(premium[0].problem_statement?.substring(0, 100) + '...');
        }

        const missingStatement = await prisma.problem.count({
            where: {
                OR: [
                    { problem_statement: null },
                    { problem_statement: '' }
                ]
            }
        });
        console.log('Problems with null or empty statement:', missingStatement);

    } catch (error) {
        console.error('Audit failed:', error);
    } finally {
        await prisma.$disconnect();
    }
}

audit();
