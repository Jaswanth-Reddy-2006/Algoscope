const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
    const completed = await prisma.problem.findMany({
        where: { status: 'complete' },
        take: 5
    });
    console.log("COMPLETED PROBLEMS:", completed.length);
    if (completed.length > 0) {
        console.log(JSON.stringify(completed.map(p => ({ id: p.id, slug: p.slug, title: p.title })), null, 2));
    }
    await prisma.$disconnect();
}

check();
