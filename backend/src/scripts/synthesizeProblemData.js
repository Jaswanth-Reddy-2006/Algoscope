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
1. "brute_force_explanation": A concise string explaining the intuitive but inefficient way to solve this. Focus on state management.
2. "brute_force_steps": An array of objects [{ "description": "string", "line": number }] describing the logical flow of the brute force code.
3. "optimal_variants": An array of objects. Each object represents one optimal (or near-optimal) solution:
    {
        "name": "string" (e.g., "Two Pointers", "Hash Map", "Dynamic Programming"),
        "explanation": "string" (Key insight and why it's optimal),
        "complexity": { "time": "string", "space": "string" },
        "steps": [{ "description": "string", "line": number }],
        "pseudocode": "string"
    }
    IMPORTANT: Provide at least one optimal variant. If there are multiple distinct optimal approaches, provide all of them.
4. "thinking_guide": An object with:
    - "first_principles": [string] (Core concepts needed)
    - "pattern_signals": [string] (How to recognize this problem type)
    - "naive_approach": [string] (The brute force steps summarized)
    - "approach_blueprint": [string] (The optimal blueprint summary)
    - "hints": [string] (Provide 3 progressive hints. Use existing hints as a base.)
5. "complexity_summary": { 
    "brute": { "time": "string", "space": "string" },
    "optimal": { "time": "string", "space": "string" }
  }
6. "lab_config": {
    "parameters": [
        {
            "name": "string",
            "label": "string",
            "type": "array" | "number" | "string" | "matrix",
            "defaultValue": any,
            "description": "string"
        }
    ],
    "randomizer_logic": "string"
},
7. "structured_examples": [
    {
        "input": { "params": "values" },
        "output": "string",
        "explanation": "string"
    }
] (Provide exactly 3 diverse examples)
8. "metadata": {
    "constraints": [string],
    "edgeCases": [string],
    "patternSignals": [string],
    "primaryPattern": "string",
    "secondaryPatterns": [string],
    "shortPatternReason": "string",
    "simpleExplanation": "string",
    "intuition": "string",
    "scenarios": [string],
    "efficiencyGain": "string"
}

RESPONSE MUST BE PURE JSON. NO MARKDOWN. NO CODE BLOCKS.
NO EMPTY BRACKETS [] OR NULLS. ALL FIELDS ARE REQUIRED.
`;

async function synthesize(problem) {
    if (!process.env.GEMINI_API_KEY) {
        throw new Error("GEMINI_API_KEY missing in .env");
    }

    let hintsText = "";
    try {
        const tg = typeof problem.thinking_guide === 'string' ? JSON.parse(problem.thinking_guide || '{}') : (problem.thinking_guide || {});
        hintsText = Array.isArray(tg.hints) ? tg.hints.join('\n') : "";
    } catch (e) {}

    const prompt = PROMPT_TEMPLATE
        .replace('{title}', problem.title)
        .replace('{difficulty}', problem.difficulty)
        .replace('{statement}', (problem.problem_statement || "").substring(0, 2000))
        .replace('{hints}', hintsText);

    let attempts = 0;
    
    // Mark as synthesizing so we know what's in flight
    await prisma.problem.update({
        where: { id: problem.id },
        data: { status: 'synthesizing' }
    });

    console.log(`\nSynthesizing [${problem.title}] (${problem.slug})...`);

    while (attempts < 3) {
        try {
            const result = await model.generateContent(prompt);
            const response = await result.response;
            let text = response.text();
            
            text = text.replace(/```json/g, '').replace(/```/g, '').trim();
            const data = JSON.parse(text);
            
            const firstOptimal = data.optimal_variants?.[0] || {};
            const meta = data.metadata || {};
            
            await prisma.problem.update({
                where: { id: problem.id },
                data: {
                    brute_force_explanation: data.brute_force_explanation,
                    optimal_explanation: firstOptimal.explanation || "",
                    brute_force_steps: JSON.stringify(data.brute_force_steps),
                    optimal_steps: JSON.stringify(firstOptimal.steps || []),
                    thinking_guide: JSON.stringify(data.thinking_guide),
                    complexity: JSON.stringify({
                        brute: data.complexity_summary?.brute,
                        optimal: data.complexity_summary?.optimal || firstOptimal.complexity
                    }),
                    labConfig: JSON.stringify(data.lab_config),
                    structuredExamples: JSON.stringify(data.structured_examples),
                    optimal_variants: JSON.stringify(data.optimal_variants),
                    
                    // Metadata fields
                    constraints: JSON.stringify(meta.constraints || []),
                    edgeCases: JSON.stringify(meta.edgeCases || []),
                    patternSignals: JSON.stringify(meta.patternSignals || []),
                    primaryPattern: meta.primaryPattern || "",
                    secondaryPatterns: JSON.stringify(meta.secondaryPatterns || []),
                    shortPatternReason: meta.shortPatternReason || "",
                    // Note: If you have additional columns like simpleExplanation, add them here
                    // Based on schema.prisma, some of these might need to be stored in thinking_guide if no separate column exists
                    // But I see them in schema.prisma as String?
                    
                    status: 'complete',
                    time_complexity: firstOptimal.complexity?.time || 'O(N)',
                    space_complexity: firstOptimal.complexity?.space || 'O(1)'
                }
            });
            
            return true;
        } catch (e) {
            if (e.message.indexOf('429') !== -1 || e.message.indexOf('quota') !== -1) {
                attempts++;
                const delay = attempts * 60000;
                console.log(`\n[429 Rate Limit] Retrying ${problem.slug} in ${delay/1000}s...`);
                await new Promise(resolve => setTimeout(resolve, delay));
            } else {
                console.error(`\n[Error] Synthesis failed for ${problem.slug}: ${e.message}`);
                await prisma.problem.update({
                    where: { id: problem.id },
                    data: { status: 'failed' }
                });
                return false;
            }
        }
    }
    return false;
}

async function main() {
    console.log("Starting Algoscope Intelligence Engine (AI Synthesis)...");
    
    while (true) {
        const problems = await prisma.problem.findMany({
            where: {
                status: { notIn: ['complete', 'failed'] },
                problem_statement: { not: null }
            },
            take: 1
        });

        // Shuffle problems to avoid getting stuck on the same ones
        problems.sort(() => Math.random() - 0.5);

        if (problems.length === 0) {
            console.log("🎉 All problems have been synthesized!");
            break;
        }

        console.log(`\n--- Processing Batch of ${problems.length} problems ---`);
        
        for (const p of problems) {
            process.stdout.write(`Synthesizing [${p.slug}]... `);
            const success = await synthesize(p);
            if (success) {
                console.log("✨ Done");
            }
            // Throttle heavily to avoid 429 Too Many Requests (approx 2 RPM)
            await new Promise(resolve => setTimeout(resolve, 30000));
        }
    }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
