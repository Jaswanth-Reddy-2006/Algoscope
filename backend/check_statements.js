const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
    try {
        const problems = await prisma.problem.findMany({
            where: {
                NOT: {
                    OR: [
                        { problem_statement: { contains: 'premium' } },
                        { problem_statement: { contains: 'hidden' } },
                        { problem_statement: { contains: 'active leetcode session' } }
                    ]
                }
            },
            take: 5,
            select: {
                slug: true,
                problem_statement: true
            }
        });
        
        problems.forEach(p => {
            console.log('Slug:', p.slug);
            console.log('Statement:', p.problem_statement ? p.problem_statement.substring(0, 200) + '...' : 'NULL');
            console.log('---');
        });
    } catch (error) {
        console.error('Check failed:', error);
    } finally {
        await prisma.$disconnect();
    }
}

check();
