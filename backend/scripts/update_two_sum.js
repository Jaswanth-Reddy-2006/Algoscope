const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function updateTwoSum() {
    try {
        const labConfig = {
            parameters: [
                {
                    name: "nums",
                    label: "Nums",
                    type: "array",
                    defaultValue: "[2, 7, 11, 15]"
                },
                {
                    name: "target",
                    label: "Target",
                    type: "number",
                    defaultValue: "9"
                }
            ],
            leetcode: "https://leetcode.com/problems/two-sum/",
            visualgo: "https://visualgo.net/en/sorting",
            techiedelight: "https://www.techiedelight.com/two-sum-problem/"
        };

        const companyTags = JSON.stringify([
            { slug: "amazon", name: "Amazon" },
            { slug: "google", name: "Google" },
            { slug: "facebook", name: "Facebook" },
            { slug: "microsoft", name: "Microsoft" },
            { slug: "apple", name: "Apple" }
        ]);

        const structuredExamples = JSON.stringify([
            {
                input: { nums: [2, 7, 11, 15], target: 9 },
                output: [0, 1],
                explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]."
            },
            {
                input: { nums: [3, 2, 4], target: 6 },
                output: [1, 2],
                explanation: "Because nums[1] + nums[2] == 6, we return [1, 2]."
            }
        ]);

        const updated = await prisma.problem.update({
            where: { slug: 'two-sum' },
            data: {
                labConfig: JSON.stringify(labConfig),
                companyTags: companyTags,
                structuredExamples: structuredExamples,
                codeSnippets: JSON.stringify([]),
                status: "complete"
            }
        });

        console.log("Two Sum updated successfully!");
    } catch (error) {
        console.error("Error updating Two Sum:", error);
    } finally {
        await prisma.$disconnect();
    }
}

updateTwoSum();
