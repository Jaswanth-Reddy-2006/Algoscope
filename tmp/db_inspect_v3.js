const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
    try {
        const sample = await prisma.problem.findFirst({
            where: {
                slug: { not: { in: ['two-sum', 'add-two-numbers', 'longest-substring-without-repeating-characters'] } }
            }
        });
        
        if (sample) {
            console.log("Title:", sample.title);
            console.log("Statement:", sample.problem_statement);
        } else {
            console.log("No non-core problems found!");
        }
        
    } catch (err) {
        console.error("DB Check Error:", err.message);
    } finally {
        await prisma.$disconnect();
    }
}

check();
