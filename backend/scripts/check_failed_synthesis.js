const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const failedCount = await prisma.problem.count({ where: { status: 'failed' } });
    const successCount = await prisma.problem.count({ where: { status: 'complete' } });
    console.log(`Failed: ${failedCount}`);
    console.log(`Complete: ${successCount}`);
    await prisma.$disconnect();
}

main();
