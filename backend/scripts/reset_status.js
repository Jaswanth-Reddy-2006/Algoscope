const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const result = await prisma.problem.updateMany({
        data: { status: 'pending' }
    });
    console.log(`Reset ${result.count} problems to pending.`);
    await prisma.$disconnect();
}

main();
