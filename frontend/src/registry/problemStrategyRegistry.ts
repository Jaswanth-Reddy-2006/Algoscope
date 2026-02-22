import { Step } from '../types'
import {
    generateTwoSumBrute,
    generateTwoSumHashMap,
    generateSlidingWindowMaxSumBrute,
    generateSlidingWindowMaxSumOptimal,
    generateBinarySearch,
    generateMaximumSubarrayKadane,
    generateAddTwoNumbersOptimal,
    generateAddTwoNumbersBrute,
    generateContainerWithMostWater,
    generateLongestPalindromeExpand,
    generateZigzagSteps,
    generateReverseInteger,
    generatePalindromeNumber,
    generateAtoI,
    generate3Sum,
    generateValidParentheses,
    generateMergeTwoSortedLists,
    generateValidPalindrome,
    generateMoveZeroes,
    generateSearchInRotatedArray,
    generateRotateImage,
    generateMedianTwoSortedArrays,
    generateGroupAnagrams,
    generatePermutations,
    generateRegExpMatching
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
    },
    "add-two-numbers": {
        brute: (input) => generateAddTwoNumbersBrute(input.l1, input.l2),
        optimal: (input) => generateAddTwoNumbersOptimal(input.l1, input.l2)
    },
    "container-with-most-water": {
        brute: (input) => generateContainerWithMostWater(input.nums),
        optimal: (input) => generateContainerWithMostWater(input.nums)
    },
    "longest-palindromic-substring": {
        brute: (input) => generateLongestPalindromeExpand(input),
        optimal: (input) => generateLongestPalindromeExpand(input)
    },
    "zigzag-conversion": {
        brute: (input) => generateZigzagSteps(input.s || input, parseInt(input.target || 3)),
        optimal: (input) => generateZigzagSteps(input.s || input, parseInt(input.target || 3))
    },
    "reverse-integer": {
        brute: (input) => generateReverseInteger(Number(input)),
        optimal: (input) => generateReverseInteger(Number(input))
    },
    "palindrome-number": {
        brute: (input) => generatePalindromeNumber(Number(input)),
        optimal: (input) => generatePalindromeNumber(Number(input))
    },
    "string-to-integer-atoi": {
        brute: (input) => generateAtoI(String(input)),
        optimal: (input) => generateAtoI(String(input))
    },
    "3sum": {
        brute: (input) => generate3Sum(input.nums || []),
        optimal: (input) => generate3Sum(input.nums || [])
    },
    "valid-parentheses": {
        brute: (input) => generateValidParentheses(String(input)),
        optimal: (input) => generateValidParentheses(String(input))
    },
    "merge-two-sorted-lists": {
        brute: (input) => generateMergeTwoSortedLists(input.l1 || [], input.l2 || []),
        optimal: (input) => generateMergeTwoSortedLists(input.l1 || [], input.l2 || [])
    },
    "valid-palindrome": {
        brute: (input) => generateValidPalindrome(String(input)),
        optimal: (input) => generateValidPalindrome(String(input))
    },
    "move-zeroes": {
        brute: (input) => generateMoveZeroes(input.nums || []),
        optimal: (input) => generateMoveZeroes(input.nums || [])
    },
    "median-of-two-sorted-arrays": {
        brute: (input) => generateMedianTwoSortedArrays(input.nums1 || [], input.nums2 || []),
        optimal: (input) => generateMedianTwoSortedArrays(input.nums1 || [], input.nums2 || [])
    },
    "search-in-rotated-sorted-array": {
        brute: (input) => generateSearchInRotatedArray(input.nums || [], Number(input.target || 0)),
        optimal: (input) => generateSearchInRotatedArray(input.nums || [], Number(input.target || 0))
    },
    "rotate-image": {
        brute: (input) => generateRotateImage(input.matrix || []),
        optimal: (input) => generateRotateImage(input.matrix || [])
    },
    "group-anagrams": {
        brute: (input) => generateGroupAnagrams(input.strs || []),
        optimal: (input) => generateGroupAnagrams(input.strs || [])
    },
    "permutations": {
        brute: (input) => generatePermutations(input.nums || []),
        optimal: (input) => generatePermutations(input.nums || [])
    },
    "regular-expression-matching": {
        brute: (input) => generateRegExpMatching(String(input.s || ""), String(input.p || "")),
        optimal: (input) => generateRegExpMatching(String(input.s || ""), String(input.p || ""))
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
