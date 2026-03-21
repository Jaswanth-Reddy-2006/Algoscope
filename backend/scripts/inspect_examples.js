const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const p = await prisma.problem.findUnique({
        where: { slug: 'two-sum' },
        select: { examples: true, problem_statement: true }
    });
    console.log("EXAMPLES:", p.examples);
    console.log("STATEMENT (first 500 chars):", p.problem_statement?.substring(0, 500));
    await prisma.$disconnect();
}

main();
