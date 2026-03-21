const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function audit() {
    try {
        const total = await prisma.problem.count();
        const premium = await prisma.problem.findMany({
            where: {
                OR: [
                    { problem_statement: { contains: 'premium' } },
                    { problem_statement: { contains: 'hidden' } }
                ]
            },
            select: { slug: true }
        });

        console.log('Total problems:', total);
        console.log('Premium/Hidden message count:', premium.length);
        
        // Check for very short statements (potential placeholders)
        const shortStatements = await prisma.problem.findMany({
            where: {
                NOT: {
                    OR: [
                        { problem_statement: { contains: 'premium' } },
                        { problem_statement: { contains: 'hidden' } }
                    ]
                },
                AND: [
                    { problem_statement: { not: null } },
                    { problem_statement: { not: '' } }
                ]
            },
            select: { slug: true, problem_statement: true }
        });

        const placeholders = shortStatements.filter(p => p.problem_statement.length < 100);
        console.log('Problems with very short statements (<100 chars):', placeholders.length);
        if (placeholders.length > 0) {
            console.log('Sample short statement slugs:', placeholders.slice(0, 10).map(p => p.slug).join(', '));
            console.log('Sample content:', placeholders[0].problem_statement);
        }

        // List 50 premium slugs to check manually
        console.log('\nSample 50 premium slugs:');
        console.log(premium.slice(0, 50).map(p => p.slug).join(', '));

    } catch (error) {
        console.error('Audit failed:', error);
    } finally {
        await prisma.$disconnect();
    }
}

audit();
