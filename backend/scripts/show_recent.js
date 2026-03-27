const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function showRecent() {
    try {
        const problems = await prisma.problem.findMany({
            take: 10,
            orderBy: { id: 'asc' }
        });
        
        problems.forEach(p => {
            console.log(`ID: ${p.id} | Slug: ${p.slug} | Status: ${p.status} | Algo: ${p.algorithmType}`);
        });
    } finally {
        await prisma.$disconnect();
    }
}

showRecent();
