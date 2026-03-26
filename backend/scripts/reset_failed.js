const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log("Resetting all 'failed' and 'synthesizing' statuses to null...");
    
    const result = await prisma.problem.updateMany({
        where: {
            status: { in: ['failed', 'synthesizing'] }
        },
        data: {
            status: null
        }
    });
    
    console.log(`Successfully reset ${result.count} problems.`);
    await prisma.$disconnect();
}

main();
