import { Step } from '../types'
import {
    generateTwoSumBrute,
    generateTwoSumHashMap,
    generateTwoSumPointers,
    generateLongestSubstringBrute,
    generateLongestSubstringOptimal,
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
    generatePermutationsTree,
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
    generateProductExceptSelf,
    generateIntegerToRoman,
    generateLongestCommonPrefix,
    generateTrappingRainWater,
    generateNextPermutation,
    generateCombinationSum,
    generateLetterCombinations,
    generateGenerateParentheses,
    generateSearchRange,
    generateFibonacciTree,
    generate3SumClosest,
    generate3SumBrute,
    generate4Sum,
    generate4SumBrute,
    generateBestTimeToBuyAndSellStock,
    generateCartesianProduct
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
        brute: (input) => generateLongestSubstringBrute(input.s || input),
        optimal: (input) => generateLongestSubstringOptimal(input.s || input)
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
        brute: (input) => generateLongestPalindromeExpand(input.s || input),
        optimal: (input) => generateLongestPalindromeExpand(input.s || input)
    },
    "zigzag-conversion": {
        brute: (input) => generateZigzagSteps(input.s || input, Number(input.numRows || 3)),
        optimal: (input) => generateZigzagSteps(input.s || input, Number(input.numRows || 3))
    },
    "reverse-integer": {
        brute: (input) => generateReverseInteger(Number(input.x !== undefined ? input.x : input)),
        optimal: (input) => generateReverseInteger(Number(input.x !== undefined ? input.x : input))
    },
    "palindrome-number": {
        brute: (input) => generatePalindromeNumber(Number(input.x !== undefined ? input.x : input)),
        optimal: (input) => generatePalindromeNumber(Number(input.x !== undefined ? input.x : input))
    },
    "string-to-integer-atoi": {
        brute: (input) => generateAtoI(String(input.s || input)),
        optimal: (input) => generateAtoI(String(input.s || input))
    },
    "3sum": {
        brute: (input) => generate3SumBrute(input.nums || [], Number(input.target || 0)),
        optimal: (input) => generate3Sum(input.nums || [], Number(input.target || 0))
    },
    "3sum-closest": {
        brute: (input) => generate3SumClosest(input.nums || [], Number(input.target || 0)),
        optimal: (input) => generate3SumClosest(input.nums || [], Number(input.target || 0))
    },
    "4sum": {
        brute: (input) => generate4SumBrute(input.nums || [], Number(input.target || 0)),
        optimal: (input) => generate4Sum(input.nums || [], Number(input.target || 0))
    },
    "best-time-to-buy-and-sell-stock": {
        brute: (input) => generateBestTimeToBuyAndSellStock(input.prices || []),
        optimal: (input) => generateBestTimeToBuyAndSellStock(input.prices || [])
    },
    "cartesian-product": {
        brute: (input) => generateCartesianProduct(input.arrays || []),
        optimal: (input) => generateCartesianProduct(input.arrays || [])
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
        brute: (input) => generatePermutationsTree(input.nums || []),
        optimal: (input) => generatePermutationsTree(input.nums || [])
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
    "integer-to-roman": {
        brute: (input) => generateIntegerToRoman(Number(input.num || input)),
        optimal: (input) => generateIntegerToRoman(Number(input.num || input))
    },
    "longest-common-prefix": {
        brute: (input) => generateLongestCommonPrefix(input.strs || input || []),
        optimal: (input) => generateLongestCommonPrefix(input.strs || input || [])
    },
    "trapping-rain-water": {
        brute: (input) => generateTrappingRainWater(input.height || input || []),
        optimal: (input) => generateTrappingRainWater(input.height || input || [])
    },
    "next-permutation": {
        brute: (input) => generateNextPermutation(input.nums || input || []),
        optimal: (input) => generateNextPermutation(input.nums || input || [])
    },
    "combination-sum": {
        brute: (input) => generateCombinationSum(input.candidates || [], Number(input.target || 0)),
        optimal: (input) => generateCombinationSum(input.candidates || [], Number(input.target || 0))
    },
    "letter-combinations-of-a-phone-number": {
        brute: (input) => generateLetterCombinations(String(input.digits || input || "")),
        optimal: (input) => generateLetterCombinations(String(input.digits || input || ""))
    },
    "generate-parentheses": {
        brute: (input) => generateGenerateParentheses(Number(input.n || input)),
        optimal: (input) => generateGenerateParentheses(Number(input.n || input))
    },
    "find-first-and-last-position-of-element-in-sorted-array": {
        brute: (input) => generateSearchRange(input.nums || [], Number(input.target || 0)),
        optimal: (input) => generateSearchRange(input.nums || [], Number(input.target || 0))
    },
    "fibonacci-number": {
        brute: (input) => generateFibonacciTree(Number(input.n || input || 5)),
        optimal: (input) => generateFibonacciTree(Number(input.n || input || 5))
    },
    "product-of-array-except-self": {
        brute: (input) => generateProductExceptSelf(input.nums || input || []),
        optimal: (input) => generateProductExceptSelf(input.nums || input || [])
    }
}

/**
 * Generates a dynamic fallback visualization for unmapped LeetCode problems.
 */
const generateUniversalFallback = (input: any, mode: string, type?: string): Step[] => {
    let arrayData: any[] = []
    let matrixData: any[][] | undefined = undefined
    let stackData: any[] | undefined = undefined
    let treeData: any | undefined = undefined

    // Sniff the parsed input structure
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

    // Specialized initial state based on type
    if (type === 'stack' || type === 'queue') {
        stackData = [...arrayData]
        arrayData = []
    } else if (type === 'trees' || type === 'tree') {
        treeData = { val: arrayData[0] || 'Root', left: null, right: null }
        arrayData = []
    } else if (type === 'linked_lists' || type === 'linked_list') {
        // Handled as array for simplicity in visualization usually, but we could add a flag
    }

    return [
        {
            step: 0,
            description: `Initializing ${mode} (${type || 'General'}) Environment...`,
            state: {
                array: arrayData.length > 0 ? arrayData : undefined,
                matrix: matrixData,
                stack: stackData,
                tree: treeData,
                explanation: `Success: Instantiated ${type || 'standard'} data structures. Dynamic trace engine is active.`,
                phase: 'init'
            }
        },
        {
            step: 1,
            description: `Algorithm Execution Pending`,
            state: {
                array: arrayData.length > 0 ? arrayData : undefined,
                matrix: matrixData,
                stack: stackData,
                tree: treeData,
                explanation: `Step-by-step logic for this ${type || 'problem'} is being synthesized in real-time. Analyze the structure for insights!`,
                phase: 'searching'
            }
        }
    ]
}

/**
 * Safely retrieves a strategy pair for a given problem slug.
 */
export const getStrategyForProblem = (slug: string, type?: string): StrategyPair => {
    return problemStrategyRegistry[slug] || {
        brute: (input) => generateUniversalFallback(input, 'Brute Force', type),
        optimal: (input) => generateUniversalFallback(input, 'Optimal', type)
    }
}
