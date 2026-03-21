const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const missingStatement = await prisma.problem.count({ where: { problem_statement: null } });
    
    console.log(`Missing Statement: ${missingStatement}`);

    await prisma.$disconnect();
}

main();
