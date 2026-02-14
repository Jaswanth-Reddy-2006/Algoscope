export type FoundationFamily = 'Data Structures' | 'Core Patterns' | 'Advanced Patterns'
export type FoundationDifficulty = 'Novice' | 'Adept' | 'Expert' | 'Master'
export type VisualizerType = 'array' | 'string' | 'hash_map' | 'stack' | 'queue' | 'linked_list' | 'tree' | 'graph' | 'recursion' | 'formula' | 'two_pointer' | 'sliding_window'
export type SubPatternId = 'fixed_window' | 'variable_window' | 'at_most_k' | 'exact_k' | 'opposite_direction' | 'same_direction' | 'fast_slow' | 'partition'

export interface ComplexityRecord {
    operation: string
    time: string
    space: string
}

export interface Operation {
    name: string
    description: string
    complexity: string
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

export interface MentalModel {
    analogy: string
    analogyImage?: string
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
        gain: string // e.g. "85%"
    }
}

export interface FoundationModule {
    id: string
    title: string
    family: FoundationFamily
    difficulty: FoundationDifficulty
    description: string
    definition: string
    mentalModel?: MentalModel
    whatItIs: string
    coreInvariant: string

    // Technical Specs
    timeComplexity: ComplexityRecord[]

    // Pattern Specifics
    recognitionSignals: string[]
    formulaPattern: string
    commonMistakes: string[]
    subPatterns: SubPattern[]

    whenNotToUse?: string

    // required for Phase 1
    edgeCases: EdgeCase[]

    // Visualizer
    visualizerType: VisualizerType
    visualizerId?: string

    // Drills
    microDrills: MicroDrill[]

    // Interactive Recognition
    recognitionChallenges: RecognitionChallenge[]

    // Relationships
    prerequisites?: string[]
}

export interface FoundationCategory {
    id: string
    title: string
    description: string
    icon: string // Lucide icon name
    modules: FoundationModule[]
}
