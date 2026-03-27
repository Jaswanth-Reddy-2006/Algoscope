const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const prisma = new PrismaClient();

async function checkAddTwo() {
    try {
        const problem = await prisma.problem.findFirst({
            where: { slug: 'add-two-numbers' }
        });
        fs.writeFileSync('add_two_meta.json', JSON.stringify(problem, null, 2));
    } catch (error) {
        console.error("Error fetching Add Two Numbers:", error);
    } finally {
        await prisma.$disconnect();
    }
}

checkAddTwo();
