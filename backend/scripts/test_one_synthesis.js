const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const PROMPT_TEMPLATE = `
You are an expert Algoscope Algorithm Architect. Your job is to transform raw LeetCode problem data into structured, cognitive learning metadata.

PROBLEM:
Title: {title}
Difficulty: {difficulty}
Statement: {statement}
Hints: {hints}

INSTRUCTIONS:
Generate a valid JSON object with the following fields:
1. "brute_force_explanation": A concise string explaining the intuitive but inefficient way to solve this. Focus on state management. NEVER leave this as empty.
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
5. "complexity": { "brute": { "time": "string", "space": "string" } }
6. "lab_config": {
    "parameters": [],
    "randomizer_logic": "string"
},
7. "structured_examples": []

RESPONSE MUST BE PURE JSON. NO MARKDOWN.
`;

async function testOne() {
    const problem = await prisma.problem.findUnique({ where: { slug: 'two-sum' } });
    console.log('Synthesizing two-sum...');
    
    const prompt = PROMPT_TEMPLATE
        .replace('{title}', problem.title)
        .replace('{difficulty}', problem.difficulty)
        .replace('{statement}', problem.problem_statement)
        .replace('{hints}', "");

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text();
        text = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const data = JSON.parse(text);
        
        console.log('Generated Data:', JSON.stringify(data, null, 2));
        
        await prisma.problem.update({
            where: { id: problem.id },
            data: {
                status: 'complete',
                optimal_variants: JSON.stringify(data.optimal_variants),
                thinking_guide: JSON.stringify(data.thinking_guide)
            }
        });
        console.log('Update Successful');
    } catch (e) {
        console.error('Failed:', e);
    }
    await prisma.$disconnect();
}

testOne();
