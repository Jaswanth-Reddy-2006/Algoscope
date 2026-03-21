const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const totalWithExamples = await prisma.problem.count({ where: { NOT: { examples: null } } });
    const totalWithoutExamples = await prisma.problem.count({ where: { examples: null } });
    console.log(`With Examples: ${totalWithExamples}`);
    console.log(`Without Examples: ${totalWithoutExamples}`);
    await prisma.$disconnect();
}

main();
