import React from 'react'

export interface Complexity {
    time: string
    space: string
}

/**
 * Universal interface for all Pattern Engines.
 * Ensures consistent behavior across Sliding Window, Two Pointers, etc.
 */
export interface PatternEngine<TState = any, TConfig = any> {
    /**
     * Unique identifier for the engine (e.g., 'sliding_window')
     */
    id: string

    /**
     * Generates the initial input data (e.g., random array) based on config.
     */
    generateInput: (config: TConfig) => any

    /**
     * Generates the step-by-step visualization states.
     * @param input The raw input data (e.g., array, string)
     * @param config Configuration including mode (fixed/variable) and params (k, target)
     */
    generateSteps: (input: any, config: TConfig) => TState[]

    /**
     * Returns the Time & Space complexity for the given configuration.
     */
    getComplexity: (input: any, config: TConfig) => Complexity

    /**
     * The React Component that renders the visualization.
     * Should accept { state: TState, config: TConfig, input: any }
     */
    VisualizerComponent: React.FC<{ state: TState, config: TConfig, input: any }>
}
