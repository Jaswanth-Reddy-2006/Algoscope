import React from 'react';

export type AlgorithmType =
    | 'two_pointer'
    | 'two_pointers'
    | 'sliding_window'
    | 'stack'
    | 'queue'
    | 'deque'
    | 'linked_list'
    | 'tree'
    | 'binary_tree'
    | 'bst'
    | 'heap'
    | 'trie'
    | 'graph'
    | 'union_find'
    | 'matrix'
    | 'binary_search'
    | 'array'
    | 'arrays'
    | 'recursion'
    | 'backtracking'
    | 'dynamic_programming'
    | 'string'
    | 'math'
    | 'hash_table'
    | 'hash_map'
    | 'bit_manipulation'
    | 'prefix_sum'
    | 'set'
    | 'sorting'
    | 'union_find_structure'
    | 'recursion_tree';

export interface Step {
    step: number;
    description: string;
    activeLine?: number;
    state: {
        array?: any[];
        array1?: any[];
        array2?: any[];
        matrix?: any[][];
        intervals?: any[][];
        pointers?: Record<string, number | null>;
        windowRange?: [number, number];
        mapState?: Record<string, any>;
        hashTable?: Record<string, any>;
        table?: Record<string, any>;
        window?: Record<string, any>;
        values?: Record<string, any>;
        additionContext?: Record<string, any>;
        nodes?: Record<string, any>;
        v1?: number;
        v2?: number;
        val1?: number;
        val2?: number;
        oldCarry?: number;
        newCarry?: number;
        digit?: number;
        sum?: number;
        l?: number;
        r?: number;
        i?: number;
        j?: number;
        start?: number;
        end?: number;
        start_pointer?: number;
        end_pointer?: number;
        left?: number;
        right?: number;
        swapIndices?: number[];
        pivotIndex?: number;
        sortedIndices?: number[];
        parent?: number[];
        rank?: number[];
        mergeIndices?: number[];
        stack?: any[];
        result?: any[];
        found?: boolean;
        calculation?: string | React.ReactNode;
        explanation?: string;
        highlightIndices?: any[];
        phase?: 'init' | 'searching' | 'comparing' | 'found' | 'not_found' | 'lookup';
        finalAnswer?: any;
        string?: string | any[];
        target?: number;
        low?: number;
        high?: number;
        mid?: number;
        customState?: Record<string, any>;
        tree?: {
            nodes: Record<string, RecursionNode>;
            rootId: string;
            activeNodeId?: string;
            lastAddedNodeId?: string;
        };
    };
}

export interface RecursionNode {
    id: string;
    label: string;
    description?: string;
    params?: Record<string, any>;
    result?: any;
    children: string[];
    parentId?: string;
    status: 'pending' | 'active' | 'completed' | 'pruned' | 'returning';
    depth: number;
}

export interface OptimalVariant {
    name: string;
    explanation: string;
    steps: Step[];
    complexity: {
        time: string;
        space: string;
    };
    pseudocode?: string;
}

export interface Problem {
    id: number;
    title: string;
    slug: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    algorithmType: AlgorithmType;
    status: 'complete' | 'synthesizing' | 'coming_soon' | 'new' | 'practiced' | 'strong' | 'failed';
    tags: string[];
    problem_statement: string;
    constraints: string[];
    examples: any[];
    brute_force_explanation: string;
    optimal_explanation: string;
    brute_force_steps: Step[];
    optimal_steps: Step[];
    complexity?: string;
    time_complexity?: string;
    space_complexity?: string;
    efficiency?: {
        brute: { time: string; space: string };
        optimal: { time: string; space: string };
    };
    thinking_guide?: {
        first_principles: string[];
        pattern_signals: string[];
        naive_approach: string[];
        approach_blueprint: string[];
        hints: string[];
    };
    optimal_variants?: any;
    structuredExamples?: any;
    primaryPattern?: string;
    subPattern?: string;
    patternLevel?: 'foundation' | 'core_patterns' | 'advanced_patterns';
    shortPatternReason?: string;
    edgeCases?: string[];
    patternSignals?: string[];
    secondaryPatterns?: string[];
    time_efficiency?: string;
    space_efficiency?: string;
    strategyShift?: string;
    naiveApproach?: string;
    optimalApproach?: string;
    simpleExplanation?: string;
    intuition?: string;
    scenarios?: string[];
    efficiencyGain?: string;
    pseudocode?: {
        brute: string;
        optimal: string;
    };
    external_links?: Record<string, string>;
    real_time_applications?: {
        title: string;
        description: string;
    }[];
    input_settings?: {
        input1: { label: string; placeholder: string };
        input2: { label: string; placeholder: string };
    };
    input?: any;
    companyTags?: string;
    codeSnippets?: string;
    labConfig?: any;
}
