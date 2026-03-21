const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const p = await prisma.problem.findFirst({
        where: { NOT: { examples: null } },
        select: { examples: true, title: true }
    });
    console.log(`Problem: ${p.title}`);
    console.log(`Examples Raw: ${p.examples}`);
    try {
        const parsed = JSON.parse(p.examples);
        console.log(`Parsed length: ${parsed.length}`);
        console.log(`Example 0: ${parsed[0]}`);
    } catch (e) {
        console.log("Failed to parse examples JSON");
    }
    await prisma.$disconnect();
}

main();
