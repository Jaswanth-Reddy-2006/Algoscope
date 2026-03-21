const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function verify() {
    try {
        const count = await prisma.problem.count();
        console.log("Total problems in DB:", count);
        
        const sample = await prisma.problem.findFirst({
            where: { slug: 'two-sum' }
        });
        console.log("Sample (two-sum):", JSON.stringify(sample, null, 2));
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}
verify();
