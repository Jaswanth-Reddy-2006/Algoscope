const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const prisma = new PrismaClient();

async function checkTwoSum() {
    try {
        const problem = await prisma.problem.findFirst({
            where: { slug: 'two-sum' }
        });
        fs.writeFileSync('two_sum_meta.json', JSON.stringify(problem, null, 2));
    } catch (error) {
        console.error("Error fetching Two Sum:", error);
    } finally {
        await prisma.$disconnect();
    }
}

checkTwoSum();
