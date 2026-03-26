const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const axios = require('axios');
const path = require('path');
const envPath = path.resolve(__dirname, '../.env');
require('dotenv').config({ path: envPath });

const OLLAMA_URL = "http://localhost:11434/api/generate";
const MODEL_NAME = "llama3:latest";

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
2. "brute_force_steps": An array of objects [{ "description": "string", "line": number, "state": object }] describing the logical flow of the brute force code.
3. "optimal_variants": An array of objects. Each object represents one optimal (or near-optimal) solution:
    {
        "name": "string",
        "explanation": "string",
        "complexity": { "time": "string", "space": "string" },
        "steps": [{ "description": "string", "line": number, "state": object }],
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
6. "constraints": [string] - List of technical constraints from the problem.
7. "edgeCases": [string] - List of edge cases that might break a naive solution.
8. "primaryPattern": "string" - The main algorithmic pattern (e.g., "Two Pointers", "Sliding Window", "BFS").
9. "patternSignals": [string] - Keywords or indicators that lead to this pattern.
10. "examples": [object] - [{ "input": "string", "output": "string", "explanation": "string" }]
11. "optimal_explanation": "string" - A high-level conceptual explanation of why the optimal logic works.
12. "optimal_steps": [object] - A sequence of refined visualizer steps. 

STRICT SCHEMA FOR "state" in "optimal_steps":
- "two_pointers": { "pointers": { "left": index, "right": index }, "values": { "sum": number, "target": number }, "array": [] }
- "sliding_window": { "pointers": { "l": index, "r": index }, "window": { "sum": number, "chars": {} }, "array": [] }
- "linked_list": { "pointers": { "curr": nodeId, "l1": nodeId, "l2": nodeId }, "nodes": { "id": { "val": any, "next": id } } }
- "binary_search": { "low": index, "high": index, "mid": index, "target": number, "array": [] }
- "hash_table": { "pointers": { "i": index }, "table": { "key": value }, "array": [] }
- "recursion": { "stack": [{ "call": string, "variables": {} }], "tree": { "nodes": {}, "rootId": string } }

IMPORTANT:
- RESPONSE MUST BE PURE JSON. DO NOT INCLUDE MARKDOWN CODE BLOCKS. NO PREAMBLE.
- HIGH-FIDELITY REQUIREMENT: PROVIDE A FULL STEP-BY-STEP TRACE (at least 20 steps).
- DO NOT summarizes algorithm phases. Capture EVERY comparison and pointer move.
- EVERY STEP MUST INCLUDE THE COMPLETE 'state' REQUIRED BY THE SCHEMA.
`;

const ENGINE_SCHEMAS = {
    'two_pointers': '{ "pointers": { "left": index, "right": index, "i": index, "j": index }, "values": { "sum": number, "target": number }, "array1": [], "array2": [], "array": [], "string": "string", "hashTable": { "key": "value" }, "calculation": "string" }',
    'sliding_window': '{ "left": number, "right": number, "charMap": { "char": index }, "window": "string", "maxLength": number, "array": [], "pointers": { "l": index, "r": index } }',
    'linked_list': '{ "pointers": { "curr": nodeId, "l1": nodeId, "l2": nodeId }, "nodes": { "id": { "val": number, "next": id } }, "res": [], "additionContext": { "v1": number, "v2": number, "carry": number, "digit": number, "sum": number, "newCarry": number } }',
    'binary_search': '{ "low": number, "high": number, "mid": number, "target": number, "array": [] }',
    'hash_table': '{ "pointers": { "i": index }, "hashTable": { "num": index }, "array": [], "complement": number, "variables": { "x": number, "ans": number, "pop": number } }',
    'matrix': '{ "pointers": { "r": index, "c": index }, "matrix": [[]], "visited": [[]], "dp": [[]], "highlightIndices": [[r, c]], "explanation": "string" }'
};

const typeMap = {
    'two pointer': 'two_pointers',
    'sliding window': 'sliding_window',
    'linked list': 'linked_list',
    'binary search': 'binary_search',
    'tree': 'recursion',
    'dfs': 'recursion',
    'bfs': 'graph',
    'heap': 'heap',
    'trie': 'trie',
    'stack': 'stack',
    'queue': 'queue',
    'matrix': 'matrix',
    'bit': 'bit_manipulation',
    'kadane': 'arrays',
    'hash map': 'hash_table',
    'hash table': 'hash_table'
};

const overrides = {
    1: 'hash_table',
    2: 'linked_list',
    3: 'sliding_window',
    4: 'two_pointers',
    5: 'two_pointers',
    6: 'matrix',
    7: 'hash_table',
    8: 'two_pointers',
    9: 'two_pointers',
    10: 'matrix',
    15: 'two_pointers'
};

async function synthesizeProblem(problem, retryCount = 0) {
    if (retryCount >= 3) {
        console.warn(`[Quality Control] Giving up on ID ${problem.id} after 3 attempts.`);
        return;
    }
    // 1. Determine intended engine
    let algorithmType = overrides[problem.id] || 'arrays';
    if (!overrides[problem.id]) {
        const lowerTitle = problem.title.toLowerCase();
        for (const [key, type] of Object.entries(typeMap)) {
            if (lowerTitle.includes(key)) {
                algorithmType = type;
                break;
            }
        }
    }

    const isFoundation = problem.id <= 10;
    const forcedSchema = ENGINE_SCHEMAS[algorithmType] || ENGINE_SCHEMAS['matrix'];

    // 1. Mark as synthesizing
    await prisma.problem.update({
        where: { id: problem.id },
        data: { status: 'synthesizing' }
    });

    let problemHints = "";
    if (isFoundation) {
        problemHints = `FOR THIS FOUNDATION PROBLEM, PROVIDE A FULL STEP-BY-STEP TRACE (at least 15-20 steps).
Each step MUST represent exactly ONE discrete operation (e.g., move one pointer, compare one value, update one variable).
DO NOT skip any operations.
DENSELY populate every field in 'state'.
Use a slightly larger version of the example input than the minimal one to ensure a deep trace.
For 'two_pointers', show: { "array1": [...], "array2": [...], "pointers": { "i": x, "j": y, "l": x, "r": y }, "values": { "current": n, "target": m } }`;
    }

    const prompt = PROMPT_TEMPLATE
        .replace('{title}', problem.title)
        .replace('{difficulty}', problem.difficulty)
        .replace('{statement}', problem.problem_statement || "No statement provided")
        .replace('{hints}', problem.hints || "")
        .replace('{examples}', problem.examples || "")
        .replace('STRICT SCHEMA FOR "state" in "optimal_steps":', `CRITICAL: Every step in "optimal_steps" MUST follow this EXACT "state" schema for the "${algorithmType}" engine:\n${forcedSchema}\n\n${problemHints}`);

    try {
        console.log(`[Ollama] Generating metadata for: ${problem.title}...`);
        const response = await axios.post(OLLAMA_URL, {
            model: MODEL_NAME,
            prompt: prompt + (retryCount > 0 ? "\n\nCRITICAL RETRY: YOUR PREVIOUS RESPONSE WAS TOO BRIEF. EACH OPERATION MUST BE CAPTURED IN ITS OWN STEP. BREAK IT DOWN MORE." : ""),
            stream: false,
            format: "json" 
        });

        let data;
        try {
            data = typeof response.data.response === 'string' 
                ? JSON.parse(response.data.response) 
                : response.data.response;
        } catch (parseError) {
            console.error(`[Parse Error] Failed to parse JSON from ${problem.title}. Response was:`, response.data.response);
            throw parseError;
        }

        let rawSteps = data.optimal_steps || data.optimal_variants?.[0]?.steps || [];
        
        // SELF-HEALING: If AI returned raw states instead of wrapped steps, wrap them
        const processedSteps = rawSteps.map((s, idx) => {
            if (s && s.state) return s; // already wrapped
            return {
                description: s.description || `Step ${idx + 1}`,
                line: s.line || 0,
                state: s // treat the whole object as state
            };
        });
        
        const minSteps = (problem.id === 4 || problem.id === 10) ? 15 : 10;

        // Quality Control for Foundation (IDs 1-10)
        if (isFoundation && processedSteps.length < minSteps) {
            console.warn(`[Quality Control] ID ${problem.id} only has ${processedSteps.length} steps. RETRYING (${retryCount + 1}/3)...`);
            return synthesizeProblem(problem, retryCount + 1);
        }

        await prisma.problem.update({
            where: { id: problem.id },
            data: {
                status: 'complete',
                algorithmType: algorithmType,
                brute_force_explanation: data.brute_force_explanation,
                brute_force_steps: JSON.stringify(data.brute_force_steps),
                optimal_variants: JSON.stringify(data.optimal_variants),
                thinking_guide: JSON.stringify(data.thinking_guide),
                complexity: JSON.stringify(data.complexity),
                constraints: JSON.stringify(data.constraints),
                edgeCases: JSON.stringify(data.edgeCases),
                primaryPattern: data.primaryPattern,
                patternSignals: JSON.stringify(data.patternSignals),
                examples: JSON.stringify(data.examples),
                optimal_explanation: data.optimal_explanation,
                optimal_steps: JSON.stringify(processedSteps),
                time_complexity: data.complexity?.optimal?.time || "Unknown",
                space_complexity: data.complexity?.optimal?.space || "Unknown"
            }
        });

        console.log(`[Success] Synthesized: ${problem.title} (#${problem.id})`);
        return true;
    } catch (e) {
        console.error(`[Failed] ${problem.title}:`, e.message);
        console.error(e.stack);
        await prisma.problem.update({
            where: { id: problem.id },
            data: { status: 'failed' }
        });
        return false;
    }
}

async function main() {
    const args = process.argv.slice(2);
    const getArgValue = (flag) => {
        const idx = args.findIndex(a => a.startsWith(flag));
        if (idx === -1) return null;
        if (args[idx].includes('=')) return args[idx].split('=')[1];
        return args[idx + 1];
    };

    const minId = parseInt(getArgValue('--minId')) || 0;
    const maxId = parseInt(getArgValue('--maxId')) || 1000000;

    console.log(`Starting Local Synthesis (Range: ID ${minId} to ${maxId}, Model: ${MODEL_NAME})...`);
    
    while (true) {
        // Find the next available problem in our ID range
        const pendingProblems = await prisma.problem.findMany({
            where: { 
                problem_statement: { not: null },
                status: null,
                id: { gte: minId, lte: maxId }
            },
            take: 1,
            orderBy: { id: 'asc' }
        });

        if (pendingProblems.length === 0) {
            console.log(`No more pending problems found in range ID [${minId}, ${maxId}].`);
            break;
        }

        const success = await synthesizeProblem(pendingProblems[0]);
        
        // Small cooldown to prevent thermal throttling
        await new Promise(resolve => setTimeout(resolve, 500));
    }

    console.log("Range complete! Disconnecting...");
    await prisma.$disconnect();
}

module.exports = { synthesizeProblem };

if (require.main === module) {
    main();
}
