export type AlgorithmType = 'two_pointer' | 'two_pointers' | 'sliding_window' | 'stack' | 'linked_list' | 'tree' | 'graph' | 'binary_search' | 'array' | 'recursion' | 'dynamic_programming' | 'string' | 'math' | 'hash_table'

export interface Step {
    step: number
    description: string
    activeLine?: number
    state: {
        array?: any[]                    // Main array to visualize (numbers or strings)
        array1?: any[]                   // First array for problems with dual arrays
        array2?: any[]                   // Second array for problems with dual arrays
        matrix?: any[][]                 // For 2D / Grid visualizations
        pointers?: Record<string, number | null> // Map of pointer names to indices (e.g., { left: 0, right: 5 })
        windowRange?: [number, number]    // [start, end] for sliding window
        mapState?: Record<string, any>    // For HashMap visualizations
        stack?: any[]                    // For Monotonic Stack
        result?: any[]                   // For storing results at each index
        found?: boolean                  // Whether the solution was found in this step
        calculation?: string | React.ReactNode // Dynamic calculation text or JSX
        explanation?: string             // Step-specific text
        highlightIndices?: any[]         // Indices to glow or highlight (can be index or [r, c])
        phase?: 'init' | 'searching' | 'comparing' | 'found' | 'not_found' | 'lookup'
        finalAnswer?: any                // Final result for SuccessSummary
        string?: string                  // For string-based visualizations
        customState?: Record<string, any> // Catch-all for unique engine needs
        tree?: any                       // For future tree/recursion visualizations
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
    efficiency: {
        brute: {
            time: string
            space: string
        }
        optimal: {
            time: string
            space: string
        }
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
    time_efficiency?: string
    space_efficiency?: string
    strategyShift?: string
    naiveApproach?: string
    optimalApproach?: string
    simpleExplanation?: string
    intuition?: string
    scenarios?: string[]
    efficiencyGain?: string
    pseudocode?: {
        brute: string
        optimal: string
    }
    external_links?: {
        leetcode: string
    }
    real_time_applications?: {
        title: string
        description: string
    }[]
    input_settings?: {
        input1: { label: string; placeholder: string }
        input2: { label: string; placeholder: string }
    }
    target?: any
    input?: any
}
