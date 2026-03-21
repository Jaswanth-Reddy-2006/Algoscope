const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const fs = require('fs');

async function check() {
    const slug = 'add-two-numbers';
    const p = await prisma.problem.findUnique({ where: { slug } });
    fs.writeFileSync('db_final.json', JSON.stringify(p, null, 2), 'utf8');
    console.log("Written to db_final.json");
}

check().finally(() => prisma.$disconnect());
