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

    return response.data.data?.question || null;
  } catch (err) {
    return null;
  }
}

async function processBatch(batch) {
  return Promise.all(batch.map(async (p) => {
    const details = await getLeetCodeProblemDetails(p.slug);
    if (details && details.content) {
      await prisma.problem.update({
        where: { id: p.id },
        data: {
          problem_statement: details.content,
          codeSnippets: JSON.stringify(details.codeSnippets || [])
        }
      });
      return { slug: p.slug, success: true };
    }
    return { slug: p.slug, success: false };
  }));
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

    const BATCH_SIZE = 10;
    for (let i = 0; i < problems.length; i += BATCH_SIZE) {
      const batch = problems.slice(i, i + BATCH_SIZE);
      console.log(`[${i}/${problems.length}] Processing batch of ${batch.length}...`);
      
      const results = await processBatch(batch);
      const successCount = results.filter(r => r.success).length;
      console.log(`Batch finished. Success: ${successCount}/${batch.length}`);
      
      // Delay between batches to avoid rate limits
      await new Promise(r => setTimeout(r, 1000));
    }

    console.log('🎉 Restoration complete!');
  } catch (err) {
    console.error('Critical error:', err.message);
  } finally {
    await prisma.$disconnect();
  }
}

run();
