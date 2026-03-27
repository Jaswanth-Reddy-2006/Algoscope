const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const prisma = new PrismaClient();

async function checkLongest() {
    try {
        const problem = await prisma.problem.findFirst({
            where: { slug: 'longest-substring-without-repeating-characters' }
        });
        fs.writeFileSync('longest_sub_meta.json', JSON.stringify(problem, null, 2));
    } catch (error) {
        console.error("Error fetching Longest Substring:", error);
    } finally {
        await prisma.$disconnect();
    }
}

checkLongest();
