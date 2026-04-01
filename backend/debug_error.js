const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function debug() {
    try {
        const data = {
            title: "Two Sum",
            slug: "two-sum",
            difficulty: "Easy",
            algorithmType: "hash_table",
            status: "complete",
            tags: "[\"Array\",\"Hash Table\"]",
            primaryPattern: "Hash Table",
            shortPatternReason: "Requires finding a pair with a specific sum.",
            time_complexity: "O(n)",
            space_complexity: "O(n)",
            problem_statement: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
            labConfig: "{}",
            constraints: "[]",
            edgeCases: "[]",
            examples: "[]",
            thinking_guide: "{}",
            complexity: "{}",
            brute_force_explanation: "Brute force solution involves iterating through the array...",
            brute_force_steps: "[]",
            optimal_explanation: "The optimal solution uses a hash table...",
            optimal_steps: "[]",
            optimal_variants: "[]",
            structuredExamples: "[]",
            companyTags: "[]",
            codeSnippets: "[]",
            patternSignals: "[]",
            secondaryPatterns: "[]",
            acceptanceRate: null
        };

        await prisma.problem.upsert({
            where: { slug: 'two-sum' },
            update: data,
            create: { id: 1, ...data }
        });
        console.log("SUCCESS");
    } catch (e) {
        fs.writeFileSync('full_error.json', JSON.stringify({
            message: e.message,
            name: e.name,
            code: e.code,
            clientVersion: e.clientVersion,
            stack: e.stack
        }, null, 2));
        console.error("FAILED - Error written to full_error.json");
    } finally {
        await prisma.$disconnect();
    }
}

debug();
