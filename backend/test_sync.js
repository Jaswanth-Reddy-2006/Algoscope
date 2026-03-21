const { PrismaClient } = require('@prisma/client');
const axios = require('axios');

const prisma = new PrismaClient();

const QUERY = `
query questionData($titleSlug: String!) {
  question(titleSlug: $titleSlug) {
    content
    hints
    exampleTestcaseList
    metaData
    stats
    companyTagStats
    codeSnippets {
      lang
      langSlug
      code
    }
  }
}
`;

async function fetchQuestionData(slug) {
    try {
        const response = await axios.post('https://leetcode.com/graphql', {
            query: QUERY,
            variables: { titleSlug: slug }
        }, {
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Referer': `https://leetcode.com/problems/${slug}/`
            }
        });
        
        return response.data.data.question;
    } catch (e) {
        console.error(`Failed to fetch content for ${slug}:`, e.message);
        return null;
    }
}

async function main() {
    const slug = 'implement-trie';
    console.log(`Syncing [${slug}]... `);
    
    const data = await fetchQuestionData(slug);
    
    if (data && data.content) {
        console.log('✅ Success! Content length:', data.content.length);
        console.log('Updating database...');
        await prisma.problem.update({
            where: { slug: slug },
            data: {
                problem_statement: data.content,
                examples: JSON.stringify(data.exampleTestcaseList || []),
                thinking_guide: JSON.stringify({ hints: data.hints || [] }),
                acceptanceRate: data.stats ? parseFloat(JSON.parse(data.stats).acRate.replace('%', '')) : null,
                companyTags: data.companyTagStats || null,
                codeSnippets: data.codeSnippets ? JSON.stringify(data.codeSnippets) : null
            }
        });
        console.log('Database updated.');
    } else {
        console.log('❌ Failed to get content. Data:', JSON.stringify(data, null, 2));
    }
}

main().catch(console.error).finally(() => prisma.$disconnect());
