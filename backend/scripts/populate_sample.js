const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log("Populating Two Sum with sample high-density data...");
    
    const problem = await prisma.problem.findUnique({ where: { slug: 'two-sum' } });
    if (!problem) return console.error("Two Sum not found");

    const data = {
        brute_force_explanation: "Check every possible pair of elements in the array and see if they sum up to the target. This requires a nested loop (O(N²)).",
        optimal_explanation: "Use a Hash Map to store elements we've already seen. For each element 'x', check if 'target - x' exists in the map. This is O(N) time and space.",
        brute_force_steps: JSON.stringify([
            { description: "Initialize variables", line: 1 },
            { description: "Loop through each index i", line: 2 },
            { description: "Loop through each index j > i", line: 3 },
            { description: "Check if nums[i] + nums[j] == target", line: 4 },
            { description: "Return [i, j] if found", line: 5 }
        ]),
        optimal_steps: JSON.stringify([
            { description: "Initialize an empty hash map", line: 1 },
            { description: "Iterate through the array", line: 2 },
            { description: "Calculate complement = target - nums[i]", line: 3 },
            { description: "If complement in map, return [map[complement], i]", line: 4 },
            { description: "Otherwise, add nums[i] to map", line: 5 }
        ]),
        thinking_guide: JSON.stringify({
            first_principles: ["Hashing", "Complementary Search"],
            pattern_signals: ["Sum target", "Avoid nested loops", "Unordered lookups"],
            naive_approach: ["Two nested loops"],
            approach_blueprint: ["Hash Map for O(1) lookups"],
            hints: [
                "Could you find the target if you knew exactly what number you were looking for?",
                "Is there a way to remember numbers we've already seen?",
                "What if we use a Hash Map to store indices?"
            ]
        }),
        complexity: JSON.stringify({
            brute: { time: "O(N²)", space: "O(1)" },
            optimal: { time: "O(N)", space: "O(N)" }
        }),
        constraints: JSON.stringify([
            "2 <= nums.length <= 10^4",
            "-10^9 <= nums[i] <= 10^9",
            "-10^9 <= target <= 10^9",
            "Exactly one solution exists"
        ]),
        edgeCases: JSON.stringify([
            "Empty or small arrays",
            "Negative numbers",
            "Large target values",
            "Duplicate elements in array"
        ]),
        patternSignals: JSON.stringify(["Sum Target", "Array Lookup"]),
        primaryPattern: "Hash Map / Two Sum",
        shortPatternReason: "O(1) lookup of complements avoids O(N²) search.",
        status: 'complete',
        time_complexity: 'O(N)',
        space_complexity: 'O(N)'
    };

    await prisma.problem.update({
        where: { id: problem.id },
        data: data
    });

    console.log("Two Sum populated successfully!");
    await prisma.$disconnect();
}

main();
