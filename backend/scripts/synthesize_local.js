const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const axios = require('axios');
const path = require('path');
const envPath = path.resolve(__dirname, '../.env');
require('dotenv').config({ path: envPath });

const OLLAMA_URL = "http://localhost:11434/api/generate";
const MODEL_NAME = "llama3:latest";

const PROMPT_TEMPLATE = `
You are an expert Algoscope Algorithm Architect. Your job is to transform raw LeetCode problem data into structured, cognitive learning metadata for a massive library of 3,900+ problems.

PROBLEM:
Title: {title}
Difficulty: {difficulty}
Statement: {statement}
Hints: {hints}

INSTRUCTIONS:
Generate a valid JSON object. The "optimal_steps" must provide a COMPLETE ANIMATION.
Every single pointer movement, comparison, or state change MUST be its own discrete step.

ENGINE-SPECIFIC STATE REQUIREMENTS:
1. Two Pointers: { "pointers": { "l", "r", "i", "j" }, "highlightIndices": [index], "array": [], "calculation": "string" }
2. Sliding Window: { "pointers": { "l", "r" }, "window": { "sum", "chars" }, "highlightIndices": [index], "array": [] }
3. Matrix / DP: { "matrix": [[]], "rowLabels": [], "colLabels": [], "highlightIndices": [[r, c]], "explanation": "string" }
4. Recursion / Tree: { "tree": { "nodes": {}, "rootId": "id", "activeNodeId": "id" }, "customState": {} }
5. Hash Table: { "hashTable": {}, "pointers": { "i" }, "array": [], "calculation": "string" }
6. Heap / Priority Queue: { "heap": [], "action": "push|pop|peek", "highlightIndices": [index] }
7. Trie: { "trie": { "nodes": {}, "rootId": "root" }, "pointers": { "nodeId": "id" }, "string": "" }

FIELDS TO GENERATE:
1. "brute_force_explanation": Insight into the naive approach inefficiency.
2. "brute_force_steps": 10-15 steps showing the naive flow.
3. "optimal_variants": [{ "name", "explanation", "complexity": { "time", "space" }, "steps", "pseudocode" }]
4. "thinking_guide": { "first_principles", "pattern_signals", "naive_approach", "approach_blueprint", "hints" }
5. "optimal_explanation": Conceptual deep-dive.
6. "optimal_steps": [20-30 DETAILED STEPS FOR ANIMATION]

STRICT: RESPONSE MUST BE PURE JSON. NO MARKDOWN. NO PREAMBLE.
`;

const ENGINE_SCHEMAS = {
    'two_pointers': '{ "pointers": { "left": index, "right": index, "i": index, "j": index }, "values": { "sum": number, "target": number }, "array": [], "highlightIndices": [index], "calculation": "string" }',
    'sliding_window': '{ "pointers": { "l": index, "r": index }, "window": { "sum": number, "chars": {} }, "array": [], "highlightIndices": [index], "maxLength": number }',
    'linked_list': '{ "pointers": { "curr": nodeId, "l1": nodeId, "l2": nodeId }, "nodes": { "id": { "val": number, "next": id } }, "highlightIndices": [nodeId] }',
    'binary_search': '{ "low": number, "high": number, "mid": number, "target": number, "array": [], "highlightIndices": [mid] }',
    'hash_table': '{ "pointers": { "i": index }, "hashTable": { "key": "value" }, "array": [], "complement": number, "calculation": "string" }',
    'matrix': '{ "pointers": { "r": index, "c": index }, "matrix": [[]], "rowLabels": [], "colLabels": [], "highlightIndices": [[r, c]], "explanation": "string" }',
    'recursion': '{ "tree": { "nodes": {}, "rootId": "root", "activeNodeId": "id" }, "customState": { "var": val } }',
    'heap': '{ "heap": [], "highlightIndices": [index], "action": "string" }',
    'trie': '{ "trie": { "nodes": {}, "rootId": "root" }, "pointers": { "nodeId": "id" }, "string": "abc" }'
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
                OR: [
                    { status: null },
                    { status: 'draft' },
                    { status: 'pending' },
                    { status: 'failed' },
                    { status: '' }
                ],
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
