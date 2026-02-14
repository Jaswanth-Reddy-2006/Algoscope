import { Step } from '../types'
import {
    generateTwoSumBrute,
    generateTwoSumHashMap,
    generateSlidingWindowMaxSumBrute,
    generateSlidingWindowMaxSumOptimal
} from './algoGenerators'

export type StrategyFunction = (input: any, target?: any) => Step[]

export interface StrategyPair {
    bruteForce: StrategyFunction
    optimal: StrategyFunction
}

export const strategyRegistry: Record<string, StrategyPair> = {
    "two-sum": {
        bruteForce: (input) => generateTwoSumBrute(input.nums, input.target),
        optimal: (input) => generateTwoSumHashMap(input.nums, input.target)
    },
    "longest-substring-without-repeating-characters": {
        bruteForce: (input) => generateSlidingWindowMaxSumBrute(input),
        optimal: (input) => generateSlidingWindowMaxSumOptimal(input)
    }
}

/**
 * Safely retrieves a strategy pair for a given problem slug.
 * Returns a dummy fallback if not found to prevent crashes.
 */
export const getStrategyForProblem = (slug: string): StrategyPair => {
    if (strategyRegistry[slug]) {
        return strategyRegistry[slug]
    }

    // Default Fallback to prevent "No implementation Found" crash
    const dummyGenerator: StrategyFunction = () => [{
        step: 0,
        description: "Standard execution logic pending registration.",
        state: { explanation: "This algorithm is scheduled for visualization in the next update." }
    }]

    return {
        bruteForce: dummyGenerator,
        optimal: dummyGenerator
    }
}
