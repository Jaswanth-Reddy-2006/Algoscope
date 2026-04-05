const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
    try {
        const countWithStatement = await prisma.problem.count({
            where: {
                NOT: {
                    problem_statement: null
                }
            }
        });
        console.log("Problems with statements:", countWithStatement);
        
        const countEmptyStatement = await prisma.problem.count({
            where: {
                problem_statement: ""
            }
        });
        console.log("Problems with empty string statements:", countEmptyStatement);

        const countNullStatement = await prisma.problem.count({
            where: {
                problem_statement: null
            }
        });
        console.log("Problems with null statements:", countNullStatement);
        
    } catch (err) {
        console.error("DB Check Error:", err.message);
    } finally {
        await prisma.$disconnect();
    }
}

check();
