const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const BATCH_DATA = [
  {
    id: 98,
    title: "Pattern Drill 87",
    brute_force_explanation: "Iterate through the array and check every element against the target for a match. Simple but O(N).",
    brute_force_steps: JSON.stringify([{ description: "Initialize loop", line: 1 }, { description: "Check current element vs target", line: 2 }, { description: "Return index if matched", line: 3 }]),
    optimal_variants: JSON.stringify([{
      name: "Single Pass",
      explanation: "Use a hash map to store seen values for O(1) lookups.",
      complexity: { time: "O(N)", space: "O(N)" },
      steps: [{ description: "Create map", line: 1 }, { description: "Iterate and lookup", line: 2 }],
      pseudocode: "for x in arr: if target-x in map: return"
    }]),
    thinking_guide: JSON.stringify({
      first_principles: ["Search patterns", "Time vs Space trade-off"],
      pattern_signals: ["Unsorted search", "Unique elements"],
      naive_approach: ["Linear search"],
      approach_blueprint: ["Hash Map"],
      hints: ["Think about what data structure speeds up lookups."]
    }),
    complexity: JSON.stringify({ brute: { time: "O(N)", space: "O(1)" }, optimal: { time: "O(N)", space: "O(N)" } }),
    constraints: JSON.stringify(["1 <= arr.length <= 10^5", "0 <= target <= 10^9"]),
    edgeCases: JSON.stringify(["Target not in array", "Array of size 1", "Multiple matches"]),
    primaryPattern: "Hash Map / Search",
    patternSignals: JSON.stringify(["linear search bottleneck", "dictionary optimization"]),
    time_complexity: "O(N)",
    space_complexity: "O(N)",
    status: "complete"
  },
  {
    id: 114,
    title: "Pattern Drill 88",
    brute_force_explanation: "Nested loops to check every pair for a condition. Guaranteed slow O(N^2).",
    brute_force_steps: JSON.stringify([{ description: "Outer loop", line: 1 }, { description: "Inner loop starting from i+1", line: 2 }, { description: "Check condition", line: 3 }]),
    optimal_variants: JSON.stringify([{
      name: "Two Pointers",
      explanation: "Sort and use two pointers meeting in middle for O(N log N).",
      complexity: { time: "O(N log N)", space: "O(1)" },
      steps: [{ description: "Sort array", line: 1 }, { description: "Move pointers", line: 2 }],
      pseudocode: "sort(arr); while L < R: check sum; move L or R"
    }]),
    thinking_guide: JSON.stringify({
      first_principles: ["Pointers", "Sorted properties"],
      pattern_signals: ["Search for pair", "Target sum"],
      naive_approach: ["Nested loops"],
      approach_blueprint: ["Sorting + Two Pointers"],
      hints: ["Would sorting help you narrow the search space?"]
    }),
    complexity: JSON.stringify({ brute: { time: "O(N^2)", space: "O(1)" }, optimal: { time: "O(N log N)", space: "O(1)" } }),
    constraints: JSON.stringify(["2 <= arr.length <= 10^5", "-10^9 <= target <= 10^9"]),
    edgeCases: JSON.stringify(["Negative numbers", "Two elements sum to exactly 0", "Empty/Single element"]),
    primaryPattern: "Two Pointers",
    patternSignals: JSON.stringify(["sorted array search", "nested loop optimization"]),
    time_complexity: "O(N log N)",
    space_complexity: "O(1)",
    status: "complete"
  }
  // Add more as needed...
];

async function main() {
  console.log(`Manually seeding ${BATCH_DATA.length} problems...`);
  for (const data of BATCH_DATA) {
    await prisma.problem.update({
      where: { id: data.id },
      data: data
    });
    console.log(`[Manual Success] ${data.title}`);
  }
  await prisma.$disconnect();
}

main();
