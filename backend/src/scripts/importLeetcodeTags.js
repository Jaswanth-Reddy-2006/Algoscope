const { PrismaClient } = require('@prisma/client');
const axios = require('axios');

const prisma = new PrismaClient();

const QUERY = `
query problemsetQuestionList($categorySlug: String, $limit: Int, $skip: Int, $filters: QuestionListFilterInput) {
  problemsetQuestionList: questionList(
    categorySlug: $categorySlug
    limit: $limit
    skip: $skip
    filters: $filters
  ) {
    total: totalNum
    questions: data {
      titleSlug
      topicTags {
        name
        slug
      }
    }
  }
}
`;

async function fetchTagsForBatch(skip, limit) {
    const variables = {
        categorySlug: "",
        skip: skip,
        limit: limit,
        filters: {}
    };

    try {
        const response = await axios.post('https://leetcode.com/graphql', {
            query: QUERY,
            variables: variables
        }, {
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Referer': 'https://leetcode.com/problemset/all/'
            }
        });
        
        return response.data.data.problemsetQuestionList.questions;
    } catch (e) {
        console.error(`Failed to fetch batch skip=${skip}:`, e.message);
        return [];
    }
}

async function main() {
    console.log("Starting GraphQL Tag Sync...");
    
    const limit = 100;
    const totalEstimate = 3850;
    
    let processed = 0;
    let updated = 0;

    for (let skip = 0; skip < totalEstimate; skip += limit) {
        console.log(`Fetching batch ${skip} to ${skip + limit}...`);
        
        const questions = await fetchTagsForBatch(skip, limit);
        if (questions.length === 0) break; // Finished or error

        for (const q of questions) {
            const slug = q.titleSlug;
            const tagNames = q.topicTags.map(t => t.name);

            try {
                // Only update if it exists
                await prisma.problem.update({
                    where: { slug: slug },
                    data: {
                        tags: JSON.stringify(tagNames)
                    }
                });
                updated++;
            } catch (err) {
                // Problem might not exist if it was added to Leetcode after our previous sync,
                // or Prisma throws error if not found. Ignore.
            }
        }
        
        processed += questions.length;
        
        // Brief delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));
    }

    console.log(`✅ Tag Sync Complete! Processed: ${processed}, Updated in DB: ${updated}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
