export type FoundationFamily = 'Data Structures' | 'Core Patterns' | 'Advanced Patterns'
export type FoundationDifficulty = 'Novice' | 'Adept' | 'Expert' | 'Master'
export type VisualizerType = 'array' | 'string' | 'hash_map' | 'stack' | 'queue' | 'linked_list' | 'binary_tree' | 'bst' | 'heap' | 'matrix' | 'prefix_sum' | 'bit_manipulation' | 'set' | 'deque' | 'trie' | 'union_find' | 'graph' | 'recursion' | 'formula' | 'two_pointer' | 'sliding_window'
export type SubPatternId = 'fixed_window' | 'variable_window' | 'at_most_k' | 'exact_k' | 'opposite_direction' | 'same_direction' | 'fast_slow' | 'partition'

export interface MentalModel {
    analogy: string
    analogyImage: string
    realWorldExample: string
    coreInsight: string
    problemStatement?: {
        definition: string
        returnValue: string
        constraints: string[]
    }
    efficiencyComparison?: {
        bruteForce: string
        optimal: string
        gain: string
    }
}

export interface efficiencyRecord {
    operation: string
    time: string
    space: string
}

export interface Operation {
    name: string
    description: string
    efficiency: string
}

export interface MicroDrill {
    question: string
    options: string[]
    correctAnswer: string
    explanation?: string
}

export interface RecognitionChallenge {
    problem: string
    correctPattern: string
    options: string[]
    explanation: string
    signals: string[]
}

export interface SubPattern {
    id: string
    title: string
    description?: string
    signals: string[]
    invariant: string
    formula: string
    mistakes: string[]
    whenNotToUse?: string[]
    visualizerId?: string
    drills: MicroDrill[]
    edgeCases: EdgeCase[]
    templates: {
        python: { bruteForce: string; optimal: string }
        java: { bruteForce: string; optimal: string }
        cpp: { bruteForce: string; optimal: string }
        javascript: { bruteForce: string; optimal: string }
    }
}

export interface EdgeCase {
    title: string
    description: string
    whyItBreaks: string
    howToFix: string
    interactive?: {
        type: 'slider' | 'toggle' | 'array'
        defaultValue: any
        options?: any[]
    }
    visualExample?: {
        array: number[]
        k?: number
        message: string
    }
}

export interface ProgressionLevel {
    title: string
    description: string
    concepts: { title: string; explanation: string; visualId?: string }[]
    problems: number[] // IDs from problems.json
}

export interface Comparison {
    targetId: string
    title: string
    metrics: { label: string; values: { [key: string]: string } }[]
    tradeoff: string
}

export interface InterviewSim {
    commonMistakes: { title: string; explanation: string; warning: string }[]
    constraints: string[]
    practiceProblems: number[]
}

export interface DependencyNode {
    id: string
    label: string
    type: 'root' | 'pattern'
}

export interface DependencyEdge {
    from: string
    to: string
    label: string
}

export interface DependencyGraph {
    nodes: DependencyNode[]
    edges: DependencyEdge[]
}

export interface FoundationModule {
    id: string
    title: string
    family: FoundationFamily
    difficulty: FoundationDifficulty
    description: string
    definition: string
    hero: {
        analogy: string
        analogyImage?: string
        realWorldExample: string
        whenToUse: string[]
        quickefficiency: efficiencyRecord[]
    }

    // Core content
    whatProblemItSolves: string
    internalWorking: string
    memoryRepresentation: string
    staticVsDynamic?: string

    // New Progression System
    progression: {
        fundamentals: ProgressionLevel
        patterns: ProgressionLevel
        advanced: ProgressionLevel
    }

    // Interactive & Visual Mapping
    visualizerType: VisualizerType
    visualizerId?: string
    patternMapping: {
        relatedPatterns: { id: string; label: string; reason: string }[]
        dependencyGraph: DependencyGraph
    }

    // Comparison & Side-by-side
    comparisons: Comparison[]

    // Specialized Logic
    deepDive?: { // Keeping for backward compatibility or internal technical specs
        foundation: string
        engine: string
        storage: string
        visualization: {
            type: string
            layers: { name: string; description: string }[]
        }
    }

    // Legacy/Existing fields (refactoring slowly)
    mentalModel?: MentalModel
    timeefficiency: efficiencyRecord[]
    recognitionSignals: string[]
    formulaPattern: string
    commonMistakes: string[]
    subPatterns: SubPattern[]
    edgeCases: EdgeCase[]
    microDrills: MicroDrill[]
    recognitionChallenges: RecognitionChallenge[]

    interviewSim?: InterviewSim
}

export interface FoundationCategory {
    id: string
    title: string
    description: string
    icon: string // Lucide icon name
    modules: FoundationModule[]
}
