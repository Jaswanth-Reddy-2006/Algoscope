const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const total = await prisma.problem.count();
    const withStatement = await prisma.problem.count({ where: { NOT: { problem_statement: null } } });
    const complete = await prisma.problem.count({ where: { status: 'complete' } });
    const failed = await prisma.problem.count({ where: { status: 'failed' } });
    const synthesizing = await prisma.problem.count({ where: { status: 'synthesizing' } });
    const missingStatement = total - withStatement;
    const pendingSynthesis = withStatement - complete - failed;

    console.log(`Total Problems: ${total}`);
    console.log(`With Statement: ${withStatement}`);
    console.log(`Missing Statement: ${missingStatement}`);
    console.log(`Status Complete: ${complete}`);
    console.log(`Status Failed: ${failed}`);
    console.log(`Status Synthesizing: ${synthesizing}`);
    console.log(`Pending Synthesis: ${pendingSynthesis}`);

    await prisma.$disconnect();
}

main();
