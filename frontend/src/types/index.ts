export type AlgorithmType = 'two_pointer' | 'two_pointers' | 'sliding_window' | 'stack' | 'linked_list' | 'tree' | 'graph' | 'binary_search' | 'array' | 'recursion' | 'dynamic_programming' | 'string'

export interface Step {
    step: number
    description: string
    activeLine?: number
    state: {
        array?: number[]           // Main array to visualize
        pointers?: Record<string, number> // Map of pointer names to indices (e.g., { left: 0, right: 5 })
        windowRange?: [number, number]    // [start, end] for sliding window
        mapState?: Record<string, any>    // For HashMap visualizations
        stack?: any[]                    // For Monotonic Stack
        result?: any[]                   // For storing results at each index
        found?: boolean                  // Whether the solution was found in this step
        explanation?: string             // Step-specific text
        highlightIndices?: number[]      // Indices to glow or highlight
        phase?: 'init' | 'searching' | 'comparing' | 'found' | 'not_found'
        finalAnswer?: any                // Final result for SuccessSummary
        customState?: Record<string, any> // Catch-all for unique engine needs
    }
}

export interface Problem {
    id: number
    title: string
    slug: string
    difficulty: 'Easy' | 'Medium' | 'Hard'
    algorithmType: AlgorithmType
    status: 'complete' | 'coming_soon' | 'new' | 'practiced' | 'strong'
    tags: string[]
    problem_statement: string
    constraints: string[]
    examples: any[]
    brute_force_explanation: string
    optimal_explanation: string
    brute_force_steps: Step[]
    optimal_steps: Step[]
    complexity: {
        brute: string
        optimal: string
        space: string
    }
    thinking_guide?: {
        first_principles: string[]
        pattern_signals: string[]
        naive_approach: string[]
        approach_blueprint: string[]
    }
    // Pattern & Metadata (Phase 13 & 14)
    primaryPattern?: string
    subPattern?: string
    patternLevel?: 'foundation' | 'core_patterns' | 'advanced_patterns'
    secondaryPatterns?: string[]
    shortPatternReason?: string
    patternSignals?: string[]
    edgeCases?: string[]
    time_complexity?: string
    space_complexity?: string
    strategyShift?: string
    naiveApproach?: string
    optimalApproach?: string
    simpleExplanation?: string
}
