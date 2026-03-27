const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function updateTwoSumSnippets() {
    try {
        const codeSnippets = [
            {
                lang: "JavaScript",
                code: "function twoSum(nums, target) {\n    const map = new Map();\n    for (let i = 0; i < nums.length; i++) {\n        const complement = target - nums[i];\n        if (map.has(complement)) {\n            return [map.get(complement), i];\n        }\n        map.set(nums[i], i);\n    }\n    return [];\n}"
            },
            {
                lang: "Python",
                code: "class Solution:\n    def twoSum(self, nums: List[int], target: int) -> List[int]:\n        prevMap = {} # val -> index\n        \n        for i, n in enumerate(nums):\n            diff = target - n\n            if diff in prevMap:\n                return [prevMap[diff], i]\n            prevMap[n] = i\n        return"
            }
        ];

        await prisma.problem.update({
            where: { slug: 'two-sum' },
            data: {
                codeSnippets: JSON.stringify(codeSnippets)
            }
        });

        console.log("Two Sum snippets updated successfully!");
    } finally {
        await prisma.$disconnect();
    }
}

updateTwoSumSnippets();
