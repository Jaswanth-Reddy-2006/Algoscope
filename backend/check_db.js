const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
    try {
        const count = await prisma.problem.count();
        console.log('Problem count:', count);
        const fib = await prisma.problem.findUnique({ where: { slug: 'fibonacci-number' } });
        console.log('Fibonacci (509) in DB:', fib ? 'Yes' : 'No');
        if (fib) console.log('Fib labConfig:', fib.labConfig);
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

run();
