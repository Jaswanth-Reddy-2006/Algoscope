import { Step } from '../types'
import {
    generateTwoSumBrute,
    generateTwoSumHashMap,
    generateSlidingWindowMaxSumBrute,
    generateSlidingWindowMaxSumOptimal,
    generateBinarySearch,
    generateMaximumSubarrayKadane
} from '../utils/algoGenerators'

export type StrategyFunction = (input: any, target?: any) => Step[]

export interface StrategyPair {
    brute: StrategyFunction
    optimal: StrategyFunction
}

export const problemStrategyRegistry: Record<string, StrategyPair> = {
    "two-sum": {
        brute: (input) => generateTwoSumBrute(input.nums, input.target),
        optimal: (input) => generateTwoSumHashMap(input.nums, input.target)
    },
    "maximum-subarray": {
        brute: (input) => generateMaximumSubarrayKadane(input.nums), // Demo uses kadane for simplicity or can use a separate brute
        optimal: (input) => generateMaximumSubarrayKadane(input.nums)
    },
    "binary-search": {
        brute: (input) => generateBinarySearch(input.nums, input.target),
        optimal: (input) => generateBinarySearch(input.nums, input.target)
    },
    "longest-substring-without-repeating-characters": {
        brute: (input) => generateSlidingWindowMaxSumBrute(input),
        optimal: (input) => generateSlidingWindowMaxSumOptimal(input)
    }
}

/**
 * Safely retrieves a strategy pair for a given problem slug.
 */
export const getStrategyForProblem = (slug: string): StrategyPair => {
    return problemStrategyRegistry[slug] || {
        brute: () => [],
        optimal: () => []
    }
}
