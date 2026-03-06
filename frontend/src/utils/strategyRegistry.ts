import { Step } from '../types'
import {
    generateTwoSumBrute,
    generateTwoSumPointers,
    generateSlidingWindowMaxSumBrute,
    generateSlidingWindowMaxSumOptimal,
    generate3Sum,
    generateContainerWithMostWater,
    generateValidPalindrome,
    generateMoveZeroes,
    generateSortColors,
    generateSortColorsBrute
} from './algoGenerators'

export type StrategyFunction = (input: any, target?: any) => Step[]

export interface StrategyPair {
    bruteForce: StrategyFunction
    optimal: StrategyFunction
}

export const strategyRegistry: Record<string, StrategyPair> = {
    "two-sum": {
        bruteForce: (input) => generateTwoSumBrute(input.nums || input.input1, input.target || input.input2),
        optimal: (input) => generateTwoSumPointers(input.nums || input.input1, input.target || input.input2)
    },
    "longest-substring-without-repeating-characters": {
        bruteForce: (input) => generateSlidingWindowMaxSumBrute(input),
        optimal: (input) => generateSlidingWindowMaxSumOptimal(input)
    },
    "3sum": {
        bruteForce: (input) => generate3Sum(input.nums || input.input1, input.target || input.input2),
        optimal: (input) => generate3Sum(input.nums || input.input1, input.target || input.input2)
    },
    "container-with-most-water": {
        bruteForce: (input) => generateContainerWithMostWater(input.heights || input.input1),
        optimal: (input) => generateContainerWithMostWater(input.heights || input.input1)
    },
    "valid-palindrome": {
        bruteForce: (input) => generateValidPalindrome(input.s || input.input1),
        optimal: (input) => generateValidPalindrome(input.s || input.input1)
    },
    "move-zeroes": {
        bruteForce: (input) => generateMoveZeroes(input.nums || input.input1),
        optimal: (input) => generateMoveZeroes(input.nums || input.input1)
    },
    "sort-colors": {
        bruteForce: (input) => generateSortColorsBrute(input.nums || input.input1),
        optimal: (input) => generateSortColors(input.nums || input.input1)
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
