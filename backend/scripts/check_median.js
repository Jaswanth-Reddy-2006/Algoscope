const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const prisma = new PrismaClient();

async function checkMedian() {
    try {
        const problem = await prisma.problem.findFirst({
            where: { slug: 'median-of-two-sorted-arrays' }
        });
        fs.writeFileSync('median_meta.json', JSON.stringify(problem, null, 2));
    } catch (error) {
        console.error("Error fetching Median:", error);
    } finally {
        await prisma.$disconnect();
    }
}

checkMedian();
