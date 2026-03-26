const { PrismaClient } = require('@prisma/client');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const prisma = new PrismaClient();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

const PROMPT_TEMPLATE = `
You are an expert Algoscope Algorithm Architect. Your job is to transform raw LeetCode problem data into structured, cognitive learning metadata.

PROBLEM:
Title: {title}
Difficulty: {difficulty}
Statement: {statement}
Hints: {hints}

INSTRUCTIONS:
Generate a valid JSON object with the following fields:
1. "brute_force_explanation": A concise string explaining the intuitive but inefficient way to solve this.
2. "brute_force_steps": An array of objects [{ "description": "string", "line": number, "state": object }] describing the flow.
3. "optimal_variants": [{ "name": "string", "explanation": "string", "complexity": { "time": "string", "space": "string" }, "steps": [{ "description": "string", "state": object }], "pseudocode": "string" }]
4. "thinking_guide": { "first_principles": [], "pattern_signals": [], "naive_approach": [], "approach_blueprint": [], "hints": [] }
5. "lab_config": { "parameters": [{ "name": "string", "type": "string", "defaultValue": any }], "randomizer_logic": "string" }
6. "metadata": { "primaryPattern": "string", "scenarios": [], "intuition": "string" }

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
