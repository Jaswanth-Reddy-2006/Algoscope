const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

async function testOne() {
    console.log("Using API Key:", process.env.GEMINI_API_KEY ? "EXISTS" : "MISSING");
    const p = await prisma.problem.findFirst({
        where: { slug: 'two-sum' }
    });
    
    if (!p) {
        console.log("Problem not found");
        return;
    }

    console.log("Synthesizing:", p.slug);
    const PROMPT_TEMPLATE = `
You are an expert Algoscope Algorithm Architect. Your job is to transform raw LeetCode problem data into structured, cognitive learning metadata.

PROBLEM:
Title: ${p.title}
Difficulty: ${p.difficulty}
Statement: ${p.problem_statement}
Hints: ${p.hints || '[]'}

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
4. "thinking_guide": An object with:
    - "first_principles": [string]
    - "pattern_signals": [string]
    - "naive_approach": [string]
    - "approach_blueprint": [string]
    - "hints": [string]
5. "complexity": { "brute": { "time": "string", "space": "string" } }
6. "lab_config": {
    "parameters": [
        {
            "name": "string",
            "label": "string",
            "type": "array" | "number" | "string",
            "defaultValue": any,
            "description": "string"
        }
    ],
    "randomizer_logic": "string"
},
7. "structured_examples": [
    {
        "input": { "paramName": "value" },
        "output": "string",
        "explanation": "string"
    }
]

RESPONSE MUST BE PURE JSON. NO MARKDOWN. NO CODE BLOCKS.
NO EMPTY BRACKETS [] OR NULLS.
`;

    try {
        const result = await model.generateContent(PROMPT_TEMPLATE);
        const response = await result.response;
        let text = response.text();
        text = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const data = JSON.parse(text);
        
        console.log("SYNTHESIS SUCCESSFUL!");
        console.log("Data keys:", Object.keys(data));
        
        const firstOptimal = data.optimal_variants?.[0] || {};
        
        await prisma.problem.update({
            where: { id: p.id },
            data: {
                brute_force_explanation: data.brute_force_explanation,
                optimal_explanation: firstOptimal.explanation || "",
                brute_force_steps: JSON.stringify(data.brute_force_steps),
                optimal_steps: JSON.stringify(firstOptimal.steps || []),
                thinking_guide: JSON.stringify(data.thinking_guide),
                complexity: JSON.stringify({
                    brute: data.complexity?.brute,
                    optimal: firstOptimal.complexity
                }),
                labConfig: JSON.stringify(data.lab_config),
                structuredExamples: JSON.stringify(data.structured_examples),
                optimal_variants: JSON.stringify(data.optimal_variants),
                status: 'complete',
                time_complexity: firstOptimal.complexity?.time || 'O(N)',
                space_complexity: firstOptimal.complexity?.space || 'O(1)'
            }
        });
        console.log("DATABASE UPDATED!");
    } catch (e) {
        console.error("SYNTHESIS FAILED:", e.message);
    } finally {
        await prisma.$disconnect();
    }
}

testOne();
