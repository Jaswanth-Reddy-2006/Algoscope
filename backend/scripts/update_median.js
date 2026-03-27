const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function updateMedian() {
    try {
        const labConfig = {
            parameters: [
                {
                    name: "nums1",
                    label: "Array 1",
                    type: "array",
                    defaultValue: "[1, 3]"
                },
                {
                    name: "nums2",
                    label: "Array 2",
                    type: "array",
                    defaultValue: "[2]"
                }
            ],
            leetcode: "https://leetcode.com/problems/median-of-two-sorted-arrays/"
        };

        const structuredExamples = JSON.stringify([
            {
                input: { nums1: [1, 3], nums2: [2] },
                output: 2.0,
                explanation: "Merged array is [1, 2, 3], and the median is 2."
            },
            {
                input: { nums1: [1, 2], nums2: [3, 4] },
                output: 2.5,
                explanation: "Merged array is [1, 2, 3, 4], and the median is (2 + 3) / 2 = 2.5."
            }
        ]);

        const updated = await prisma.problem.update({
            where: { slug: 'median-of-two-sorted-arrays' },
            data: {
                labConfig: JSON.stringify(labConfig),
                structuredExamples: structuredExamples,
                codeSnippets: JSON.stringify([]),
                status: "complete"
            }
        });

        console.log("Median updated successfully!");
    } catch (error) {
        console.error("Error updating Median:", error);
    } finally {
        await prisma.$disconnect();
    }
}

updateMedian();
