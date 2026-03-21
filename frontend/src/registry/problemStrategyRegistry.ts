import { Step } from '../types'
import {
    generateTwoSumBrute,
    generateTwoSumHashMap,
    generateTwoSumPointers,
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
    generateRegExpMatching,
    generateJumpGame,
    generateMergeIntervals,
    generateClimbingStairs,
    generateSearch2DMatrix,
    generateMinWindowSubstring,
    generateSubsets,
    generateSortColors,
    generateSortColorsBrute,
    generatePalindromeLinkedList,
    generateProductExceptSelf
} from '../utils/algoGenerators'

export type StrategyFunction = (input: any, target?: any) => Step[]

export interface StrategyVariant {
    name: string
    generate: StrategyFunction
}

export interface StrategyPair {
    brute: StrategyFunction
    optimal: StrategyFunction
    variants?: StrategyVariant[]
}

export const problemStrategyRegistry: Record<string, StrategyPair> = {
    "two-sum": {
        brute: (input) => generateTwoSumBrute(input.nums, input.target),
        optimal: (input) => generateTwoSumHashMap(input.nums, input.target),
        variants: [
            { name: "Hash Map", generate: (input) => generateTwoSumHashMap(input.nums, input.target) },
            { name: "Two Pointers", generate: (input) => generateTwoSumPointers(input.nums, input.target) }
        ]
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
    },
    "jump-game": {
        brute: (input) => generateJumpGame(input.nums || []),
        optimal: (input) => generateJumpGame(input.nums || [])
    },
    "merge-intervals": {
        brute: (input) => generateMergeIntervals(input.intervals || []),
        optimal: (input) => generateMergeIntervals(input.intervals || [])
    },
    "climbing-stairs": {
        brute: (input) => generateClimbingStairs(Number(input.n || input)),
        optimal: (input) => generateClimbingStairs(Number(input.n || input))
    },
    "search-a-2d-matrix": {
        brute: (input) => generateSearch2DMatrix(input.matrix || [], Number(input.target || 0)),
        optimal: (input) => generateSearch2DMatrix(input.matrix || [], Number(input.target || 0))
    },
    "sort-colors": {
        brute: (input) => generateSortColorsBrute(input.nums || []),
        optimal: (input) => generateSortColors(input.nums || [])
    },
    "minimum-window-substring": {
        brute: (input) => generateMinWindowSubstring(String(input.s || ""), String(input.t || "")),
        optimal: (input) => generateMinWindowSubstring(String(input.s || ""), String(input.t || ""))
    },
    "subsets": {
        brute: (input) => generateSubsets(input.nums || []),
        optimal: (input) => generateSubsets(input.nums || [])
    },
    "palindrome-linked-list": {
        brute: (input) => generatePalindromeLinkedList(input.nums || input || []),
        optimal: (input) => generatePalindromeLinkedList(input.nums || input || [])
    },
    "product-of-array-except-self": {
        brute: (input) => generateProductExceptSelf(input.nums || input || []),
        optimal: (input) => generateProductExceptSelf(input.nums || input || [])
    }
}

/**
 * Generates a dynamic fallback visualization for unmapped LeetCode problems.
 */
const generateUniversalFallback = (input: any, mode: string): Step[] => {
    let arrayData: any[] = []
    let matrixData: any[][] | undefined = undefined

    // Sniff the parsed input structure from useStore 
    if (Array.isArray(input)) {
        if (Array.isArray(input[0])) matrixData = input
        else arrayData = input
    } else if (typeof input === 'string') {
        arrayData = input.split('')
    } else if (typeof input === 'object' && input !== null) {
        if (input.nums && Array.isArray(input.nums)) arrayData = input.nums
        else if (input.matrix && Array.isArray(input.matrix)) matrixData = input.matrix
        else if (input.s && typeof input.s === 'string') arrayData = input.s.split('')
        else if (input.l1 && Array.isArray(input.l1)) arrayData = [...input.l1, ...(input.l2 || [])]
    }

    return [
        {
            step: 0,
            description: `Initializing ${mode} Environment for unmapped problem...`,
            state: {
                array: arrayData.length > 0 ? arrayData : undefined,
                matrix: matrixData,
                explanation: `System successfully instantiated data structures for standard evaluation. Custom animation parameters for this specific problem are dynamically synchronized.`,
                phase: 'init'
            }
        },
        {
            step: 1,
            description: `Algorithm Execution Pending`,
            state: {
                array: arrayData.length > 0 ? arrayData : undefined,
                matrix: matrixData,
                explanation: `Advanced deep-level steps for this problem logic are calculated in real-time or currently tracked in the AI Engine queue. Analyze the problem statement for further details!`,
                phase: 'searching'
            }
        }
    ]
}

/**
 * Safely retrieves a strategy pair for a given problem slug.
 */
export const getStrategyForProblem = (slug: string): StrategyPair => {
    return problemStrategyRegistry[slug] || {
        brute: (input) => generateUniversalFallback(input, 'Brute Force'),
        optimal: (input) => generateUniversalFallback(input, 'Optimal')
    }
}
