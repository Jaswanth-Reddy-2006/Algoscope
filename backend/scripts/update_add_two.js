const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function updateAddTwo() {
    try {
        const labConfig = {
            parameters: [
                {
                    name: "l1",
                    label: "List 1",
                    type: "array",
                    defaultValue: "[2, 4, 3]"
                },
                {
                    name: "l2",
                    label: "List 2",
                    type: "array",
                    defaultValue: "[5, 6, 4]"
                }
            ],
            leetcode: "https://leetcode.com/problems/add-two-numbers/",
            geeksforgeeks: "https://www.geeksforgeeks.org/add-two-numbers-represented-by-linked-lists/",
            youtube: "https://www.youtube.com/watch?v=wgHm1nJnvQE"
        };

        const structuredExamples = JSON.stringify([
            {
                input: { l1: [2, 4, 3], l2: [5, 6, 4] },
                output: [7, 0, 8],
                explanation: "342 + 465 = 807."
            },
            {
                input: { l1: [0], l2: [0] },
                output: [0],
                explanation: "0 + 0 = 0."
            }
        ]);

        const updated = await prisma.problem.update({
            where: { slug: 'add-two-numbers' },
            data: {
                labConfig: JSON.stringify(labConfig),
                structuredExamples: structuredExamples,
                codeSnippets: JSON.stringify([]),
                status: "complete"
            }
        });

        console.log("Add Two Numbers updated successfully!");
    } catch (error) {
        console.error("Error updating Add Two Numbers:", error);
    } finally {
        await prisma.$disconnect();
    }
}

updateAddTwo();
