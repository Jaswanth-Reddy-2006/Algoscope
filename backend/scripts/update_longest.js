const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function updateLongest() {
    try {
        const labConfig = {
            parameters: [
                {
                    name: "s",
                    label: "String",
                    type: "string",
                    defaultValue: "abcabcbb"
                }
            ],
            leetcode: "https://leetcode.com/problems/longest-substring-without-repeating-characters/"
        };

        const structuredExamples = JSON.stringify([
            {
                input: { s: "abcabcbb" },
                output: 3,
                explanation: "The answer is 'abc', with the length of 3."
            },
            {
                input: { s: "bbbbb" },
                output: 1,
                explanation: "The answer is 'b', with the length of 1."
            }
        ]);

        const updated = await prisma.problem.update({
            where: { slug: 'longest-substring-without-repeating-characters' },
            data: {
                labConfig: JSON.stringify(labConfig),
                structuredExamples: structuredExamples,
                codeSnippets: JSON.stringify([]),
                status: "complete"
            }
        });

        console.log("Longest Substring updated successfully!");
    } catch (error) {
        console.error("Error updating Longest Substring:", error);
    } finally {
        await prisma.$disconnect();
    }
}

updateLongest();
