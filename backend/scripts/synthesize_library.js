const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const path = require('path');
const envPath = path.resolve(__dirname, '../.env');
require('dotenv').config({ path: envPath });

if (!process.env.GEMINI_API_KEY) {
    console.error("CRITICAL ERROR: GEMINI_API_KEY is not defined in .env");
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro-latest" });

const PROMPT_TEMPLATE = `
You are an expert Algoscope Algorithm Architect. Your job is to transform raw LeetCode problem data into structured, cognitive learning metadata.

PROBLEM:
Title: {title}
Difficulty: {difficulty}
Statement: {statement}
Hints: {hints}

INSTRUCTIONS:
Generate a valid JSON object with the following fields:
1. "brute_force_explanation": A concise string explaining the intuitive but inefficient way to solve this. Focus on state management.
2. "brute_force_steps": An array of objects [{ "description": "string", "line": number }] describing the logical flow of the brute force code.
3. "optimal_variants": An array of objects. Each object represents one optimal (or near-optimal) solution:
    {
        "name": "string",
        "explanation": "string",
        "complexity": { "time": "string", "space": "string" },
        "steps": [{ "description": "string", "line": number }],
        "pseudocode": "string"
    }
4. "thinking_guide": {
    "first_principles": [string],
    "pattern_signals": [string],
    "naive_approach": [string],
    "approach_blueprint": [string],
    "hints": [string]
}
5. "complexity": { "brute": { "time": "string", "space": "string" }, "optimal": { "time": "string", "space": "string" } }
6. "constraints": [string] - List of technical constraints from the problem (e.g., "1 <= nums.length <= 10^4").
7. "edgeCases": [string] - List of edge cases that might break a naive solution (e.g., "Empty array", "Duplicate values", "Extreme constraints").
8. "primaryPattern": "string" - The main algorithmic pattern (e.g., "Two Pointers", "Sliding Window", "BFS").
9. "patternSignals": [string] - Keywords or indicators that lead to this pattern.

RESPONSE MUST BE PURE JSON. NO MARKDOWN.
`;

async function synthesizeProblem(problem) {
    const prompt = PROMPT_TEMPLATE
        .replace('{title}', problem.title)
        .replace('{difficulty}', problem.difficulty)
        .replace('{statement}', problem.problem_statement || "No statement provided")
        .replace('{hints}', "");

    let retryCount = 0;
    const MAX_RETRIES = 3;

    while (retryCount < MAX_RETRIES) {
        try {
            const result = await model.generateContent(prompt);
            const response = await result.response;
            let text = response.text();
            
            // Clean markdown JSON if present
            text = text.replace(/```json/g, '').replace(/```/g, '').trim();
            const data = JSON.parse(text);

            await prisma.problem.update({
                where: { id: problem.id },
                data: {
                    status: 'complete',
                    brute_force_explanation: data.brute_force_explanation,
                    brute_force_steps: JSON.stringify(data.brute_force_steps),
                    optimal_variants: JSON.stringify(data.optimal_variants),
                    thinking_guide: JSON.stringify(data.thinking_guide),
                    complexity: JSON.stringify(data.complexity),
                    constraints: JSON.stringify(data.constraints),
                    edgeCases: JSON.stringify(data.edgeCases),
                    primaryPattern: data.primaryPattern,
                    patternSignals: JSON.stringify(data.patternSignals),
                    time_complexity: data.complexity?.optimal?.time || "Unknown",
                    space_complexity: data.complexity?.optimal?.space || "Unknown"
                }
            });
            console.log(`[Success] Synthesized: ${problem.title} (#${problem.id})`);
            return true;
        } catch (e) {
            // Check for rate limit (429) errors
            if (e.message.includes('429') || e.message.includes('Resource has been exhausted') || e.message.includes('RetryInfo')) {
                retryCount++;
                const delay = Math.pow(2, retryCount) * 10000; // Exponential backoff: 20s, 40s, 80s
                console.warn(`[Rate Limit] ${problem.title}: Retrying in ${delay/1000}s... (Attempt ${retryCount}/${MAX_RETRIES})`);
                await new Promise(resolve => setTimeout(resolve, delay));
                continue;
            }

            console.error(`[Failed] ${problem.title}:`, e.message);
            await prisma.problem.update({
                where: { id: problem.id },
                data: { status: 'failed' }
            });
            return false;
        }
    }
    
    // If we're here, we exhausted retries
    console.error(`[Exhausted] ${problem.title}: Failed after ${MAX_RETRIES} retries.`);
    await prisma.problem.update({
        where: { id: problem.id },
        data: { status: 'failed' }
    });
    return false;
}

async function main() {
    console.log("Starting Library Synthesis Daemon...");
    
    // Batch size to avoid overwhelming API and rate limits
    const BATCH_SIZE = 1; 
    
    while (true) {
        const pendingProblems = await prisma.problem.findMany({
            where: { 
                problem_statement: { not: null },
                OR: [
                    { status: null },
                    { status: { notIn: ['complete', 'failed', 'synthesizing'] } }
                ]
            },
            take: BATCH_SIZE
        });

        if (pendingProblems.length === 0) {
            console.log("No more pending problems found. Synthesis complete!");
            break;
        }

        console.log(`\nProcessing problem: ${pendingProblems[0].title}...`);
        
        await prisma.problem.update({
            where: { id: pendingProblems[0].id },
            data: { status: 'synthesizing' }
        });

        const success = await synthesizeProblem(pendingProblems[0]);
        console.log(`Summary: ${success ? 'Succeeded' : 'Failed'}.`);

        // Slightly faster delay (30s = 2 requests per minute)
        console.log("Waiting 30s for next request...");
        await new Promise(resolve => setTimeout(resolve, 30000));
    }

    await prisma.$disconnect();
}

main();
