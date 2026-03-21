const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const total = await prisma.problem.count();
    const withSnippets = await prisma.problem.count({ where: { NOT: { codeSnippets: null } } });
    const withTags = await prisma.problem.count({ where: { NOT: { companyTags: null } } });
    const completed = await prisma.problem.count({ where: { status: 'complete' } });
    
    console.log(`Total: ${total}`);
    console.log(`With Snippets: ${withSnippets}`);
    console.log(`With Tags: ${withTags}`);
    console.log(`Status Complete: ${completed}`);

    if (withSnippets < total) {
        const sample = await prisma.problem.findFirst({ where: { codeSnippets: null } });
        console.log(`Example missing snippets: ${sample?.title} (${sample?.slug})`);
    }

    await prisma.$disconnect();
}

main();
