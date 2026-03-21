const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log("Resetting 'synthesizing' status to 'new'...");
    const result = await prisma.problem.updateMany({
        where: { status: 'synthesizing' },
        data: { status: 'new' }
    });
    console.log(`Reset ${result.count} problems.`);
    await prisma.$disconnect();
}

main();
