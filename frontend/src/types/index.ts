import React from 'react';

export type AlgorithmType = 'two_pointer' | 'two_pointers' | 'sliding_window' | 'stack' | 'linked_list' | 'tree' | 'graph' | 'binary_search' | 'array' | 'recursion' | 'dynamic_programming' | 'string' | 'math' | 'hash_table';

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
        stack?: any[];
        result?: any[];
        found?: boolean;
        calculation?: string | React.ReactNode;
        explanation?: string;
        highlightIndices?: any[];
        phase?: 'init' | 'searching' | 'comparing' | 'found' | 'not_found' | 'lookup';
        finalAnswer?: any;
        string?: string;
        customState?: Record<string, any>;
        tree?: any;
    };
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
