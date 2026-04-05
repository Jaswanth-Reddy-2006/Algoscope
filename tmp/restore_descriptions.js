const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const axios = require('axios');

async function getLeetCodeProblemDetails(slug) {
  const query = `
    query getProblemDetails($titleSlug: String!) {
      question(titleSlug: $titleSlug) {
        content
        stats
        hints
        sampleTestCase
        exampleTestcases
        codeSnippets {
          lang
          langSlug
          code
        }
      }
    }
  `;

  try {
    const response = await axios.post('https://leetcode.com/graphql', {
      query: query,
      variables: { titleSlug: slug }
    }, {
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0'
      }
    });

    return response.data.data.question;
  } catch (err) {
    console.error(`Failed to fetch ${slug}:`, err.message);
    return null;
  }
}

async function run() {
  try {
    const problems = await prisma.problem.findMany({
      where: {
        OR: [
          { problem_statement: { contains: 'tracking arriving soon' } },
          { problem_statement: null }
        ]
      },
      select: { id: true, slug: true, title: true }
    });

    console.log(`Found ${problems.length} problems to restore.`);

    let count = 0;
    for (const p of problems) {
      console.log(`[${count+1}/${problems.length}] Restoring: ${p.title} (${p.slug})`);
      const details = await getLeetCodeProblemDetails(p.slug);
      
      if (details && details.content) {
        await prisma.problem.update({
          where: { id: p.id },
          data: {
            problem_statement: details.content,
            codeSnippets: JSON.stringify(details.codeSnippets || [])
          }
        });
        console.log(`✅ Restored ${p.slug}`);
      } else {
        console.log(`❌ No content for ${p.slug}`);
      }

      count++;
      // Rate limiting: slightly wait to avoid blocking
      await new Promise(r => setTimeout(r, 500));
    }

    console.log('🎉 Restoration complete!');
  } catch (err) {
    console.error('Critical error:', err.message);
  } finally {
    await prisma.$disconnect();
  }
}

run();
