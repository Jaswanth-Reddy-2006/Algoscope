const { PrismaClient } = require('@prisma/client');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const prisma = new PrismaClient();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

const PROMPT_TEMPLATE = `
You are an expert Algoscope Algorithm Architect. Your job is to transform raw LeetCode problem data into structured, cognitive learning metadata for 3,900+ problems.

PROBLEM:
Title: {title}
Difficulty: {difficulty}
Statement: {statement}
Hints: {hints}

INSTRUCTIONS:
Generate a valid JSON object. The "steps" in both brute_force and optimal_variants must be HIGH-FIDELITY. 
Each step's "state" object must be compatible with Algoscope React Engines.

ENGINE-SPECIFIC STATE REQUIREMENTS:
1. Two Pointers / Sliding Window: Use "pointers" (e.g., { l, r, i, j }) and "highlightIndices" (array of indices to glow).
2. Matrix / DP: Use "matrix" (2D array), "rowLabels", "colLabels", and "highlightIndices" ([row, col] pairs).
3. Recursion / Tree: Use "tree" (nested { val, left, right, active: bool, result: any }).
4. Linked List: Use "array" (representing nodes) and "pointers".
5. Hash Table: Use "hashTable" (Record<string, any>).
6. General: Use "explanation" (detailed logic for this specific step) and "phase" ('init', 'searching', 'found', 'not_found').

FIELDS TO GENERATE:
1. "brute_force_explanation": Deep insight into the inefficiency.
2. "brute_force_steps": 10-15 steps showing the naive flow.
3. "optimal_variants": [{ 
    "name": "Strategy Name", 
    "explanation": "Deep intuition", 
    "complexity": { "time": "O(?)", "space": "O(?)" }, 
    "steps": [12-20 detailed steps focusing on the 'Aha!' moment], 
    "pseudocode": "Clean code" 
   }]
4. "thinking_guide": { "first_principles": [], "pattern_signals": [], "naive_approach": [], "approach_blueprint": [], "hints": [] }
5. "lab_config": { "parameters": [{ "name": "string", "type": "string", "defaultValue": any }], "randomizer_logic": "string" }
6. "metadata": { "primaryPattern": "string", "scenarios": [], "intuition": "string" }

CRITICAL: 
- ALWAYS include "highlightIndices" to make the UI feel alive.
- Brute force must show the nested loops visually.
- Optimal must show the logic that avoids work.

RESPONSE MUST BE PURE JSON. NO MARKDOWN.
`;

async function synthesize(problem) {
    if (!process.env.GEMINI_API_KEY) throw new Error("GEMINI_API_KEY missing");

    const prompt = PROMPT_TEMPLATE
        .replace('{title}', problem.title)
        .replace('{difficulty}', problem.difficulty)
        .replace('{statement}', (problem.problem_statement || "").substring(0, 1500))
        .replace('{hints}', "");

    await prisma.problem.update({ where: { id: problem.id }, data: { status: 'synthesizing' } });

    try {
        const result = await model.generateContent(prompt);
        const text = (await result.response).text().replace(/```json/g, '').replace(/```/g, '').trim();
        const data = JSON.parse(text);
        
        const firstOpt = data.optimal_variants?.[0] || {};
        
        await prisma.problem.update({
            where: { id: problem.id },
            data: {
                brute_force_explanation: data.brute_force_explanation,
                brute_force_steps: JSON.stringify(data.brute_force_steps || []),
                optimal_explanation: firstOpt.explanation || "",
                optimal_steps: JSON.stringify(firstOpt.steps || []),
                thinking_guide: JSON.stringify(data.thinking_guide || {}),
                labConfig: JSON.stringify(data.lab_config || {}),
                optimal_variants: JSON.stringify(data.optimal_variants || []),
                primaryPattern: data.metadata?.primaryPattern || problem.primaryPattern,
                status: 'complete',
                time_complexity: firstOpt.complexity?.time || 'O(N)',
                space_complexity: firstOpt.complexity?.space || 'O(1)'
            }
        });
        return true;
    } catch (e) {
        console.error(`\n[Error] ${problem.slug}: ${e.message}`);
        await prisma.problem.update({ where: { id: problem.id }, data: { status: 'failed' } });
        return false;
    }
}

async function main() {
    console.log("🚀 Starting AI Synthesis Daemon...");
    while (true) {
        const problems = await prisma.problem.findMany({
            where: { status: { notIn: ['complete', 'failed', 'synthesizing'] }, problem_statement: { not: null } },
            take: 3,
            orderBy: { id: 'asc' }
        });

        if (problems.length === 0) {
            console.log("🎉 All caught up!");
            break;
        }

        console.log(`\n--- Processing Batch [${problems.map(p => p.slug).join(', ')}] ---`);
        await Promise.all(problems.map(p => synthesize(p)));
        
        console.log("Taking a 15s breather to avoid 429...");
        await new Promise(r => setTimeout(r, 15000));
    }
}

main().catch(console.error).finally(() => prisma.$disconnect());
