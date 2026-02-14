import { PatternEngine } from '../../../types/engine'
import { runSlidingWindow, WindowState } from './SlidingWindowEngine/core/slidingWindowCore'
import SlidingWindowCanvas from './SlidingWindowEngine/visual/SlidingWindowCanvas'

interface SlidingWindowConfig {
    mode: string
    edgeCase?: string
}

export const SlidingWindowPattern: PatternEngine<WindowState, SlidingWindowConfig> = {
    id: 'sliding_window',

    generateInput: (config) => {
        // Handle Edge Cases
        if (config.edgeCase === 'Empty Input') return []
        if (config.edgeCase === 'Window > Array') return [1, 2, 3]
        if (config.edgeCase === 'Negative numbers') return [5, -2, 3, -1, 4, -5, 2]

        const size = 12
        if (config.mode === 'at_most_k' || config.mode === 'exact_k') {
            return Array.from({ length: size }, () => Math.floor(Math.random() * 5) + 1)
        }
        return Array.from({ length: size }, () => Math.floor(Math.random() * 20) + 1)
    },

    generateSteps: (input, config) => {
        if (!input || input.length === 0) return []

        // Determine K/Target based on mode
        let k = 3
        if (config.mode === 'variable_window') k = 15 // Target sum
        if (config.mode === 'at_most_k' || config.mode === 'exact_k') k = 3 // Max distinct
        if (config.mode === 'fixed_window') k = 4 // Window size

        // Override K for Window > Array edge case
        if (config.edgeCase === 'Window > Array') k = 4

        return runSlidingWindow(input, config.mode, k)
    },

    getComplexity: (_input, _config) => {
        return {
            time: 'O(N)',
            space: 'O(1)' // Simplified, technically O(K) for distinct
        }
    },

    VisualizerComponent: ({ state, config, input }) => {
        return <SlidingWindowCanvas array={input} state={state} mode={config.mode} />
    }
}
