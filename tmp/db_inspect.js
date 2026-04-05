const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
    try {
        console.log("Querying database to check problem data...");
        const count = await prisma.problem.count();
        console.log("Total Problems in DB:", count);
        
        const sample = await prisma.problem.findFirst({
            where: {
                problem_statement: { not: null }
            }
        });
        
        if (sample) {
            console.log("Sample curated problem found:", sample.title);
            console.log("Problem Statement Length:", sample.problem_statement.length);
        } else {
            console.log("No problems with descriptions found in DB!");
        }
        
    } catch (err) {
        console.error("DB Check Error:", err.message);
    } finally {
        await prisma.$disconnect();
    }
}

check();
