const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
    const p = await prisma.problem.findUnique({ where: { slug: 'two-sum' }});
    console.log("Two Sum Examples:", p.examples);
    
    const p2 = await prisma.problem.findUnique({ where: { slug: 'add-two-numbers' }});
    console.log("Add Two Numbers Examples:", p2.examples);
    
    await prisma.$disconnect();
}
run();
