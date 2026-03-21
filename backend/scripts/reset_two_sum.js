const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    await prisma.problem.update({
        where: { slug: 'two-sum' },
        data: { status: 'pending', structuredExamples: null }
    });
    console.log("Reset Two Sum status to pending.");
    await prisma.$disconnect();
}

main();
