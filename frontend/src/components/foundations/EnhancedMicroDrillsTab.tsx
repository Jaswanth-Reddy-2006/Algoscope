import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
    Trophy, Target, Zap, CheckCircle, XCircle, RotateCcw,
    TrendingUp, Flame
} from 'lucide-react'
import { useStore } from '../../store/useStore'
import { FoundationModule } from '../../types/foundation'

type SubPattern = 'fixed_window' | 'variable_window' | 'at_most_k' | 'exact_k'
type DrillType =
    | 'movement_prediction'
    | 'invariant_id'
    | 'fill_missing'
    | 'brute_vs_optimal'
    | 'detect_bug'
    | 'complexity'
    | 'count_contribution'
    | 'edge_case_trap'
    | 'pattern_conversion'
    | 'manual_simulation'

interface DrillQuestion {
    type: DrillType
    question: string
    options?: string[]
    correctAnswer: string | number
    explanation: string
    difficulty: 1 | 2 | 3
    category: 'invariant' | 'movement' | 'complexity' | 'edge_case' | 'code'
}

interface Props {
    moduleId?: string
    module: FoundationModule
    activeSubPatternId: string | null
    setActiveSubPatternId: (id: string | null) => void
}

// Generate drills for Fixed Window
const FIXED_WINDOW_DRILLS: DrillQuestion[] = [
    {
        type: 'movement_prediction',
        question: 'Array: [2, 5, 1, 8, 2], K=3. Current: left=0, right=2, sum=8. After moving right to index 3, what is the new sum?',
        options: ['12', '13', '14', '15'],
        correctAnswer: '14',
        explanation: 'New sum = old sum - arr[left] + arr[right+1] = 8 - 2 + 8 = 14. Then left moves to 1.',
        difficulty: 1,
        category: 'movement'
    },
    {
        type: 'invariant_id',
        question: 'Which invariant MUST hold for fixed window?',
        options: [
            'sum >= target',
            'right - left + 1 === K',
            'distinct_count <= K',
            'left < right'
        ],
        correctAnswer: 'right - left + 1 === K',
        explanation: 'Fixed window maintains constant size K. The invariant "right - left + 1 === K" ensures this.',
        difficulty: 1,
        category: 'invariant'
    },
    {
        type: 'fill_missing',
        question: 'Fill the blank:\nfor right in range(len(arr)):\n    sum += arr[right]\n    if right >= k:\n        sum -= _______',
        options: ['arr[left]', 'arr[right - k]', 'arr[right]', 'arr[k]'],
        correctAnswer: 'arr[right - k]',
        explanation: 'We remove the element that is K positions behind right. That element is arr[right - k].',
        difficulty: 2,
        category: 'code'
    },
    {
        type: 'brute_vs_optimal',
        question: 'Given N=100,000 and K=500, which will TLE (Time Limit Exceeded)?',
        options: [
            'Brute Force O(N×K)',
            'Sliding Window O(N)',
            'Both',
            'Neither'
        ],
        correctAnswer: 'Brute Force O(N×K)',
        explanation: 'Brute force: 100,000 × 500 = 50 million operations. Sliding window: 100,000 operations. Brute force will TLE.',
        difficulty: 1,
        category: 'complexity'
    },
    {
        type: 'detect_bug',
        question: 'Find the bug:\nfor i in range(len(arr) - k):\n    window_sum = sum(arr[i:i+k])\n    max_sum = max(max_sum, window_sum)',
        options: [
            'Line 1: range should be (len(arr) - k + 1)',
            'Line 2: sum calculation is wrong',
            'Line 3: max comparison is wrong',
            'No bug'
        ],
        correctAnswer: 'Line 1: range should be (len(arr) - k + 1)',
        explanation: 'range(len(arr) - k) misses the last valid window. Should be range(len(arr) - k + 1).',
        difficulty: 2,
        category: 'code'
    },
    {
        type: 'complexity',
        question: 'What is the time complexity of fixed window sliding window?',
        options: ['O(N²)', 'O(N×K)', 'O(N)', 'O(K)'],
        correctAnswer: 'O(N)',
        explanation: 'Each element is added once and removed once. Total: O(N) operations.',
        difficulty: 1,
        category: 'complexity'
    },
    {
        type: 'edge_case_trap',
        question: 'Input: arr=[1, 2], K=5. What happens?',
        options: [
            'Returns 0',
            'Returns 3',
            'Throws error',
            'No valid window exists'
        ],
        correctAnswer: 'No valid window exists',
        explanation: 'K > array length. Cannot form a window of size 5 from array of length 2.',
        difficulty: 1,
        category: 'edge_case'
    },
    {
        type: 'pattern_conversion',
        question: 'Problem: "Find maximum sum of any subarray of size K". Which pattern?',
        options: ['Fixed Window', 'Variable Window', 'At Most K', 'Exact K'],
        correctAnswer: 'Fixed Window',
        explanation: 'Key phrase: "of size K" → Fixed window size → Fixed Window pattern.',
        difficulty: 1,
        category: 'invariant'
    },
    {
        type: 'movement_prediction',
        question: 'Array: [3, 1, 4, 2, 5], K=3. At step 3 (right=2), what is left pointer?',
        options: ['0', '1', '2', '3'],
        correctAnswer: '0',
        explanation: 'Window forms when right >= K-1. At right=2, window is [0,2], so left=0.',
        difficulty: 2,
        category: 'movement'
    },
    {
        type: 'fill_missing',
        question: 'Complete: if right - left + 1 == k:\n    max_sum = max(max_sum, window_sum)\n    window_sum -= _______\n    left += 1',
        options: ['arr[left]', 'arr[right]', 'arr[left-1]', 'arr[right+1]'],
        correctAnswer: 'arr[left]',
        explanation: 'Before moving left pointer, remove the element it currently points to: arr[left].',
        difficulty: 1,
        category: 'code'
    },
    {
        type: 'edge_case_trap',
        question: 'What if K=0?',
        options: [
            'Window of size 0 is valid',
            'Return empty array',
            'Invalid input - validate K >= 1',
            'Return 0'
        ],
        correctAnswer: 'Invalid input - validate K >= 1',
        explanation: 'K=0 means empty window, which is meaningless. Always validate K >= 1.',
        difficulty: 1,
        category: 'edge_case'
    },
    {
        type: 'complexity',
        question: 'Why is sliding window O(N) and not O(N×K)?',
        options: [
            'We use a hash map',
            'Each element added/removed exactly once',
            'We skip elements',
            'We use binary search'
        ],
        correctAnswer: 'Each element added/removed exactly once',
        explanation: 'Each element enters window once (when right moves) and exits once (when left moves). Total: 2N operations = O(N).',
        difficulty: 2,
        category: 'complexity'
    }
]

// Variable Window drills
const VARIABLE_WINDOW_DRILLS: DrillQuestion[] = [
    {
        type: 'invariant_id',
        question: 'Variable window core logic:',
        options: [
            'Maintain fixed size',
            'Expand until invalid, then shrink',
            'Always expand',
            'Binary search for window'
        ],
        correctAnswer: 'Expand until invalid, then shrink',
        explanation: 'Variable window expands (right++) until constraint violated, then shrinks (left++) until valid again.',
        difficulty: 1,
        category: 'invariant'
    },
    {
        type: 'movement_prediction',
        question: 'Array: [2, 3, 1, 2], target sum >= 5. At right=1 (sum=5), what happens next?',
        options: [
            'Shrink window (left++)',
            'Expand window (right++)',
            'Both shrink and expand',
            'Stop'
        ],
        correctAnswer: 'Shrink window (left++)',
        explanation: 'Sum >= target is satisfied. Try to minimize length by shrinking: left++ while still valid.',
        difficulty: 2,
        category: 'movement'
    },
    {
        type: 'fill_missing',
        question: 'Complete:\nfor right in range(len(arr)):\n    sum += arr[right]\n    while _______:\n        min_len = min(min_len, right - left + 1)\n        sum -= arr[left]\n        left += 1',
        options: ['sum < target', 'sum >= target', 'left < right', 'right < len(arr)'],
        correctAnswer: 'sum >= target',
        explanation: 'Shrink window WHILE constraint is satisfied (sum >= target) to find minimum length.',
        difficulty: 2,
        category: 'code'
    },
    {
        type: 'edge_case_trap',
        question: 'Array: [4, -10, 5], target sum >= 0. Why does variable window fail?',
        options: [
            'Array too small',
            'Negative numbers break monotonicity',
            'Target is 0',
            'No failure'
        ],
        correctAnswer: 'Negative numbers break monotonicity',
        explanation: 'Removing -10 INCREASES sum, violating assumption that shrinking reduces sum. Non-monotonic!',
        difficulty: 3,
        category: 'edge_case'
    },
    {
        type: 'complexity',
        question: 'Time complexity of variable window with while loop?',
        options: ['O(N²)', 'O(N)', 'O(N log N)', 'O(K)'],
        correctAnswer: 'O(N)',
        explanation: 'Both left and right move at most N times total. Amortized O(N).',
        difficulty: 2,
        category: 'complexity'
    },
    {
        type: 'detect_bug',
        question: 'Find bug:\nwhile sum >= target:\n    min_len = min(min_len, right - left)\n    sum -= arr[left]\n    left += 1',
        options: [
            'Line 2: should be (right - left + 1)',
            'Line 3: wrong element removed',
            'Line 4: should be left += 2',
            'No bug'
        ],
        correctAnswer: 'Line 2: should be (right - left + 1)',
        explanation: 'Window length is right - left + 1 (inclusive). Missing the +1.',
        difficulty: 2,
        category: 'code'
    },
    {
        type: 'pattern_conversion',
        question: 'Problem: "Minimum length subarray with sum >= K". Which pattern?',
        options: ['Fixed Window', 'Variable Window', 'At Most K', 'Exact K'],
        correctAnswer: 'Variable Window',
        explanation: 'Key: "minimum length" with a constraint → Variable window that shrinks to minimize.',
        difficulty: 1,
        category: 'invariant'
    },
    {
        type: 'edge_case_trap',
        question: 'What if no subarray satisfies the constraint?',
        options: [
            'Return 0',
            'Return -1',
            'Return Infinity',
            'Depends on problem'
        ],
        correctAnswer: 'Depends on problem',
        explanation: 'Convention varies: some return 0, others return -1 or Infinity. Check problem requirements.',
        difficulty: 1,
        category: 'edge_case'
    },
    {
        type: 'movement_prediction',
        question: 'When does left pointer move in variable window?',
        options: [
            'Every iteration',
            'When constraint violated',
            'When constraint satisfied',
            'Never'
        ],
        correctAnswer: 'When constraint satisfied',
        explanation: 'Left moves (shrinks) WHILE constraint is satisfied to find minimum valid window.',
        difficulty: 1,
        category: 'movement'
    },
    {
        type: 'complexity',
        question: 'Why doesn\'t the while loop make it O(N²)?',
        options: [
            'While loop rarely executes',
            'Each element removed at most once',
            'We use memoization',
            'It does make it O(N²)'
        ],
        correctAnswer: 'Each element removed at most once',
        explanation: 'Left pointer moves at most N times total across ALL iterations. Amortized O(1) per outer loop.',
        difficulty: 3,
        category: 'complexity'
    },
    {
        type: 'fill_missing',
        question: 'Initialize min_len to:',
        options: ['0', '1', 'float("inf")', 'len(arr)'],
        correctAnswer: 'float("inf")',
        explanation: 'Start with infinity so any valid length will be smaller. Return 0 if min_len stays infinity.',
        difficulty: 1,
        category: 'code'
    },
    {
        type: 'edge_case_trap',
        question: 'Array: [1, 1, 1, 1], target >= 0. What happens?',
        options: [
            'Window never shrinks',
            'Window never expands',
            'Normal operation',
            'Infinite loop'
        ],
        correctAnswer: 'Window never shrinks',
        explanation: 'All elements satisfy constraint, so left never moves. Degenerates to expanding window.',
        difficulty: 2,
        category: 'edge_case'
    }
]

// At Most K drills
const AT_MOST_K_DRILLS: DrillQuestion[] = [
    {
        type: 'count_contribution',
        question: 'At Most K: If left=2 and right=5, how many new subarrays are added?',
        options: ['2', '3', '4', '5'],
        correctAnswer: '4',
        explanation: 'Formula: right - left + 1 = 5 - 2 + 1 = 4 new subarrays ending at right.',
        difficulty: 1,
        category: 'invariant'
    },
    {
        type: 'invariant_id',
        question: 'At Most K invariant:',
        options: [
            'distinct_count === K',
            'distinct_count <= K',
            'distinct_count >= K',
            'window_size === K'
        ],
        correctAnswer: 'distinct_count <= K',
        explanation: 'At Most K maintains at most K distinct elements. Shrink when distinct_count > K.',
        difficulty: 1,
        category: 'invariant'
    },
    {
        type: 'fill_missing',
        question: 'Complete:\nfor right in range(len(arr)):\n    freq[arr[right]] += 1\n    while len(freq) > k:\n        freq[arr[left]] -= 1\n        if freq[arr[left]] == 0:\n            _______\n        left += 1\n    count += _______',
        options: [
            'del freq[arr[left]], right - left + 1',
            'freq.pop(arr[left]), left',
            'del freq[arr[left]], right',
            'freq[arr[left]] = 0, right - left'
        ],
        correctAnswer: 'del freq[arr[left]], right - left + 1',
        explanation: 'Remove key when count reaches 0. Add (right - left + 1) subarrays ending at right.',
        difficulty: 2,
        category: 'code'
    },
    {
        type: 'pattern_conversion',
        question: 'Problem: "Count subarrays with at most K distinct integers". Which pattern?',
        options: ['Fixed Window', 'Variable Window', 'At Most K', 'Exact K'],
        correctAnswer: 'At Most K',
        explanation: 'Key phrase: "at most K distinct" → At Most K pattern.',
        difficulty: 1,
        category: 'invariant'
    },
    {
        type: 'edge_case_trap',
        question: 'What if K=0?',
        options: [
            'Return N*(N+1)/2',
            'Return 0',
            'Return N',
            'Undefined'
        ],
        correctAnswer: 'Return 0',
        explanation: 'K=0 means 0 distinct elements allowed. No valid subarrays exist.',
        difficulty: 1,
        category: 'edge_case'
    },
    {
        type: 'complexity',
        question: 'Time complexity of At Most K pattern?',
        options: ['O(N²)', 'O(N×K)', 'O(N)', 'O(N log N)'],
        correctAnswer: 'O(N)',
        explanation: 'Each element added/removed once. HashMap operations are O(1). Total: O(N).',
        difficulty: 1,
        category: 'complexity'
    },
    {
        type: 'count_contribution',
        question: 'Why do we add (right - left + 1) instead of just 1?',
        options: [
            'Counts all subarrays ending at right',
            'Counts window size',
            'Counts distinct elements',
            'Bug in formula'
        ],
        correctAnswer: 'Counts all subarrays ending at right',
        explanation: 'All subarrays from [left, right], [left+1, right], ..., [right, right] are valid. Count: right - left + 1.',
        difficulty: 2,
        category: 'invariant'
    },
    {
        type: 'edge_case_trap',
        question: 'Array: [1, 1, 1, 1], K=1. Result?',
        options: ['4', '10', '16', '1'],
        correctAnswer: '10',
        explanation: 'All subarrays valid (1 distinct element). Formula: N*(N+1)/2 = 4*5/2 = 10.',
        difficulty: 2,
        category: 'edge_case'
    },
    {
        type: 'detect_bug',
        question: 'Find bug:\ncount += right - left',
        options: [
            'Should be (right - left + 1)',
            'Should be (right - left - 1)',
            'Should be (left - right + 1)',
            'No bug'
        ],
        correctAnswer: 'Should be (right - left + 1)',
        explanation: 'Missing +1. Window length is right - left + 1 (inclusive indices).',
        difficulty: 1,
        category: 'code'
    },
    {
        type: 'complexity',
        question: 'Space complexity of At Most K?',
        options: ['O(1)', 'O(K)', 'O(N)', 'O(N×K)'],
        correctAnswer: 'O(K)',
        explanation: 'HashMap stores at most K distinct elements. Space: O(K).',
        difficulty: 2,
        category: 'complexity'
    },
    {
        type: 'movement_prediction',
        question: 'When does left pointer move?',
        options: [
            'Every iteration',
            'When distinct_count > K',
            'When right moves',
            'Never'
        ],
        correctAnswer: 'When distinct_count > K',
        explanation: 'Left moves (shrinks) WHILE we have too many distinct elements (> K).',
        difficulty: 1,
        category: 'movement'
    },
    {
        type: 'edge_case_trap',
        question: 'Large N (10^5). What risk?',
        options: [
            'TLE',
            'Integer overflow',
            'Stack overflow',
            'No risk'
        ],
        correctAnswer: 'Integer overflow',
        explanation: 'Count can reach N*(N+1)/2 ≈ 5 billion for N=100,000. Exceeds int32. Use long/int64.',
        difficulty: 2,
        category: 'edge_case'
    }
]

// Exact K drills
const EXACT_K_DRILLS: DrillQuestion[] = [
    {
        type: 'invariant_id',
        question: 'Exact K formula:',
        options: [
            'at_most(K)',
            'at_most(K) - at_most(K-1)',
            'at_most(K) + at_most(K-1)',
            'at_most(K) * at_most(K-1)'
        ],
        correctAnswer: 'at_most(K) - at_most(K-1)',
        explanation: 'Exact K = (at most K) - (at most K-1). Subtracts subarrays with fewer than K distinct.',
        difficulty: 1,
        category: 'invariant'
    },
    {
        type: 'pattern_conversion',
        question: 'Problem: "Count subarrays with exactly K distinct integers". Which pattern?',
        options: ['Fixed Window', 'Variable Window', 'At Most K', 'Exact K'],
        correctAnswer: 'Exact K',
        explanation: 'Key word: "exactly K" → Use Exact K identity: at_most(K) - at_most(K-1).',
        difficulty: 1,
        category: 'invariant'
    },
    {
        type: 'detect_bug',
        question: 'Find bug:\ndef exact_k(arr, k):\n    return at_most_k(arr, k)',
        options: [
            'Missing subtraction: - at_most_k(arr, k-1)',
            'Wrong function call',
            'Should use k+1',
            'No bug'
        ],
        correctAnswer: 'Missing subtraction: - at_most_k(arr, k-1)',
        explanation: 'Exact K requires subtraction: at_most(k) - at_most(k-1). Missing the second term.',
        difficulty: 1,
        category: 'code'
    },
    {
        type: 'edge_case_trap',
        question: 'Array: [1, 1, 1], K=2. Result?',
        options: ['0', '3', '6', 'Error'],
        correctAnswer: '0',
        explanation: 'Array has only 1 distinct element. Cannot form subarrays with exactly 2 distinct. Return 0.',
        difficulty: 1,
        category: 'edge_case'
    },
    {
        type: 'complexity',
        question: 'Time complexity of Exact K?',
        options: ['O(N)', 'O(N²)', 'O(2N) = O(N)', 'O(N log N)'],
        correctAnswer: 'O(2N) = O(N)',
        explanation: 'Calls at_most() twice, each O(N). Total: O(2N) = O(N).',
        difficulty: 2,
        category: 'complexity'
    },
    {
        type: 'fill_missing',
        question: 'Complete:\ndef exact_k(arr, k):\n    return _______ - _______',
        options: [
            'at_most(k), at_most(k-1)',
            'at_most(k+1), at_most(k)',
            'at_most(k), at_most(k+1)',
            'at_least(k), at_most(k)'
        ],
        correctAnswer: 'at_most(k), at_most(k-1)',
        explanation: 'Identity: exact_k = at_most(k) - at_most(k-1).',
        difficulty: 1,
        category: 'code'
    },
    {
        type: 'edge_case_trap',
        question: 'What if K=1?',
        options: [
            'Return 0',
            'Return at_most(1) - at_most(0)',
            'Return at_most(1)',
            'Error'
        ],
        correctAnswer: 'Return at_most(1) - at_most(0)',
        explanation: 'Formula still works: at_most(0) = 0, so exact_k(1) = at_most(1).',
        difficulty: 2,
        category: 'edge_case'
    },
    {
        type: 'invariant_id',
        question: 'Why does the identity work?',
        options: [
            'Mathematical coincidence',
            'Inclusion-exclusion principle',
            'Dynamic programming',
            'Greedy algorithm'
        ],
        correctAnswer: 'Inclusion-exclusion principle',
        explanation: 'at_most(K) includes subarrays with <K distinct. Subtracting at_most(K-1) removes them, leaving exactly K.',
        difficulty: 3,
        category: 'invariant'
    },
    {
        type: 'complexity',
        question: 'Space complexity of Exact K?',
        options: ['O(1)', 'O(K)', 'O(2K) = O(K)', 'O(N)'],
        correctAnswer: 'O(2K) = O(K)',
        explanation: 'Two at_most() calls, each using O(K) space for HashMap. Total: O(2K) = O(K).',
        difficulty: 2,
        category: 'complexity'
    },
    {
        type: 'detect_bug',
        question: 'What if we use at_most(k) + at_most(k-1)?',
        options: [
            'Correct',
            'Double counts subarrays',
            'Misses some subarrays',
            'Depends on input'
        ],
        correctAnswer: 'Double counts subarrays',
        explanation: 'Addition would count subarrays with <K distinct twice. Must subtract, not add.',
        difficulty: 2,
        category: 'code'
    },
    {
        type: 'edge_case_trap',
        question: 'K > number of distinct elements in array. Result?',
        options: ['0', 'N*(N+1)/2', 'Error', 'Undefined'],
        correctAnswer: '0',
        explanation: 'Impossible to have K distinct when array has fewer. at_most(K) = at_most(K-1), so difference = 0.',
        difficulty: 2,
        category: 'edge_case'
    },
    {
        type: 'pattern_conversion',
        question: 'Problem: "Longest substring with exactly K distinct characters". Pattern?',
        options: ['Fixed Window', 'Variable Window', 'At Most K', 'Exact K'],
        correctAnswer: 'Exact K',
        explanation: 'Key: "exactly K distinct" → Exact K pattern. Note: "longest" requires modification of standard count approach.',
        difficulty: 2,
        category: 'invariant'
    }
]

const ALL_DRILLS: Record<SubPattern, DrillQuestion[]> = {
    fixed_window: FIXED_WINDOW_DRILLS,
    variable_window: VARIABLE_WINDOW_DRILLS,
    at_most_k: AT_MOST_K_DRILLS,
    exact_k: EXACT_K_DRILLS
}

interface DrillState {
    currentDrill: number
    score: number
    correctAnswers: number
    wrongByCategory: Record<string, number>
    timePerDrill: number[]
    startTime: number
    streak: number
    achievements: string[]
}
export const EnhancedMicroDrillsTab: React.FC<Props> = ({ moduleId, module, activeSubPatternId, setActiveSubPatternId }) => {
    const { drillProgress, saveDrillProgress } = useStore()
    const selectedPattern = activeSubPatternId || 'fixed_window' as any

    // Define handleReset here so it's available in the effect
    const handleReset = () => {
        setDrillState({
            currentDrill: 0,
            score: 0,
            correctAnswers: 0,
            wrongByCategory: {},
            timePerDrill: [],
            startTime: Date.now(),
            streak: 0,
            achievements: []
        })
        setSelectedAnswer(null)
        setShowFeedback(false)
        setIsComplete(false)
    }

    const drills = useMemo(() => {
        // First try to get drills from the module data (foundations.json)
        const subPatternData = module.subPatterns.find((s: any) => s.id === selectedPattern)
        if (subPatternData?.drills && subPatternData.drills.length > 0) {
            return subPatternData.drills as any[] // Using any for compatibility with local DrillQuestion type
        }
        // Fallback to hardcoded drills
        return (ALL_DRILLS as any)[selectedPattern] || []
    }, [module, selectedPattern])

    const [drillState, setDrillState] = useState<DrillState>({
        currentDrill: 0,
        score: 0,
        correctAnswers: 0,
        wrongByCategory: {},
        timePerDrill: [],
        startTime: Date.now(),
        streak: 0,
        achievements: []
    })
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
    const [showFeedback, setShowFeedback] = useState(false)
    const [isComplete, setIsComplete] = useState(false)

    // Sync with store progress
    useEffect(() => {
        if (!moduleId) return

        const moduleProgress = drillProgress[moduleId] || {}
        const progress = moduleProgress[selectedPattern]

        if (progress) {
            const answeredCount = progress.answeredIds.length
            setDrillState(prev => ({
                ...prev,
                currentDrill: Math.min(answeredCount, drills.length - 1),
                score: progress.score,
                correctAnswers: Math.round((progress.accuracy / 100) * answeredCount)
            }))
            if (answeredCount >= drills.length) {
                setIsComplete(true)
            }
        }
    }, [selectedPattern, drillProgress, moduleId, drills.length])

    const currentQuestion = drills[drillState.currentDrill]

    const handleAnswer = (answer: string) => {
        setSelectedAnswer(answer)
        setShowFeedback(true)

        const isCorrect = answer === currentQuestion.correctAnswer
        const timeTaken = Date.now() - drillState.startTime

        // Save to global store
        const questionId = `${selectedPattern}_${drillState.currentDrill}`
        if (moduleId) {
            saveDrillProgress(moduleId, selectedPattern, questionId, isCorrect)
        }

        setDrillState(prev => ({
            ...prev,
            score: prev.score + (isCorrect ? 1 : 0),
            correctAnswers: prev.correctAnswers + (isCorrect ? 1 : 0),
            wrongByCategory: isCorrect ? prev.wrongByCategory : {
                ...prev.wrongByCategory,
                [currentQuestion.category]: (prev.wrongByCategory[currentQuestion.category] || 0) + 1
            },
            timePerDrill: [...prev.timePerDrill, timeTaken],
            streak: isCorrect ? prev.streak + 1 : 0
        }))

        // Check for achievements
        if (isCorrect && drillState.streak + 1 === 5) {
            setDrillState(prev => ({
                ...prev,
                achievements: [...prev.achievements, 'Flame']
            }))
        }
    }

    const handleNext = () => {
        if (drillState.currentDrill + 1 >= drills.length) {
            setIsComplete(true)
        } else {
            setDrillState(prev => ({
                ...prev,
                currentDrill: prev.currentDrill + 1,
                startTime: Date.now()
            }))
            setSelectedAnswer(null)
            setShowFeedback(false)
        }
    }

    const handlePatternChange = (pattern: SubPattern) => {
        setActiveSubPatternId(pattern)
        handleReset()
    }

    if (isComplete) {
        const accuracy = Math.round((drillState.correctAnswers / drills.length) * 100)
        const avgTime = Math.round(drillState.timePerDrill.reduce((a, b) => a + b, 0) / drillState.timePerDrill.length / 1000)

        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-4xl mx-auto space-y-8 py-12"
            >
                <div className="text-center">
                    <Trophy size={64} className="text-yellow-400 mx-auto mb-6" />
                    <h2 className="text-3xl font-bold text-white mb-2">Drill Complete!</h2>
                    <p className="text-white/60">You've completed all {drills.length} drills for {selectedPattern.replace('_', ' ')}</p>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div className="p-6 rounded-2xl bg-green-500/10 border border-green-500/20">
                        <div className="text-sm text-green-400 mb-2">Accuracy</div>
                        <div className="text-4xl font-bold text-green-400">{accuracy}%</div>
                        <div className="text-xs text-white/40 mt-1">{drillState.correctAnswers}/{drills.length} correct</div>
                    </div>
                    <div className="p-6 rounded-2xl bg-blue-500/10 border border-blue-500/20">
                        <div className="text-sm text-blue-400 mb-2">Avg Time</div>
                        <div className="text-4xl font-bold text-blue-400">{avgTime}s</div>
                        <div className="text-xs text-white/40 mt-1">per drill</div>
                    </div>
                </div>

                <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                    <h3 className="text-lg font-bold text-white mb-4">Pattern Mastery Breakdown</h3>
                    <div className="space-y-3">
                        {['invariant', 'movement', 'complexity', 'edge_case', 'code'].map(cat => {
                            const wrong = drillState.wrongByCategory[cat] || 0
                            const total = drills.filter((d: DrillQuestion) => d.category === cat).length
                            const correct = total - wrong
                            const percent = total > 0 ? Math.round((correct / total) * 100) : 100

                            return (
                                <div key={cat}>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-white/70 capitalize">{cat.replace('_', ' ')}</span>
                                        <span className="text-white/40">{percent}%</span>
                                    </div>
                                    <div className="h-2 rounded-full bg-black/40 overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-accent-blue to-purple-500"
                                            style={{ width: `${percent}%` }}
                                        />
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {drillState.achievements.length > 0 && (
                    <div className="p-6 rounded-2xl bg-yellow-500/10 border border-yellow-500/20">
                        <h3 className="text-lg font-bold text-white mb-4">Achievements Unlocked</h3>
                        <div className="flex gap-4">
                            {drillState.achievements.includes('Flame') && (
                                <div className="flex items-center gap-2">
                                    <Flame size={24} className="text-orange-400" />
                                    <div>
                                        <div className="text-sm font-bold text-white">On Fire!</div>
                                        <div className="text-xs text-white/60">5 correct in a row</div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                <div className="flex gap-4 justify-center">
                    <button
                        onClick={handleReset}
                        className="px-6 py-3 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 text-white font-medium transition-colors flex items-center gap-2"
                    >
                        <RotateCcw size={16} />
                        Retry
                    </button>
                    <button
                        onClick={() => {
                            const patterns: SubPattern[] = ['fixed_window', 'variable_window', 'at_most_k', 'exact_k']
                            const currentIndex = patterns.indexOf(selectedPattern)
                            const nextPattern = patterns[(currentIndex + 1) % patterns.length]
                            handlePatternChange(nextPattern)
                        }}
                        className="px-6 py-3 rounded-lg bg-accent-blue/20 hover:bg-accent-blue/30 border border-accent-blue/30 text-accent-blue font-medium transition-colors"
                    >
                        Next Sub-Pattern
                    </button>
                </div>
            </motion.div>
        )
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="text-center space-y-3">
                <h2 className="text-3xl font-bold text-white">Cognitive Gym</h2>
                <p className="text-white/60 max-w-2xl mx-auto">
                    Master sliding window through varied drills. Test your understanding across all dimensions.
                </p>
            </div>

            {/* Sub-Pattern Selector */}
            <div className="flex flex-wrap gap-2 justify-center">
                {(Object.keys(ALL_DRILLS) as SubPattern[]).map(pattern => (
                    <button
                        key={pattern}
                        onClick={() => handlePatternChange(pattern)}
                        className={`
                            px-4 py-2 rounded-lg text-sm font-medium transition-colors
                            ${selectedPattern === pattern
                                ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                                : 'bg-white/5 text-white/70 border border-white/10 hover:bg-white/10'
                            }
                        `}
                    >
                        {pattern.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                    </button>
                ))}
            </div>

            {/* Progress Bar */}
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between text-sm mb-2">
                    <span className="text-white/70">Progress</span>
                    <span className="text-white/40">{drillState.currentDrill + 1} / {drills.length}</span>
                </div>
                <div className="h-2 rounded-full bg-black/40 overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
                        style={{ width: `${((drillState.currentDrill + 1) / drills.length) * 100}%` }}
                    />
                </div>
            </div>

            {/* Stats */}
            <div className="max-w-4xl mx-auto grid grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                    <div className="flex items-center gap-2 mb-1">
                        <Target size={14} className="text-green-400" />
                        <span className="text-xs text-white/60">Score</span>
                    </div>
                    <div className="text-2xl font-bold text-green-400">{drillState.score}/{drills.length}</div>
                </div>
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                    <div className="flex items-center gap-2 mb-1">
                        <TrendingUp size={14} className="text-blue-400" />
                        <span className="text-xs text-white/60">Accuracy</span>
                    </div>
                    <div className="text-2xl font-bold text-blue-400">
                        {drillState.currentDrill > 0 ? Math.round((drillState.correctAnswers / drillState.currentDrill) * 100) : 0}%
                    </div>
                </div>
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                    <div className="flex items-center gap-2 mb-1">
                        <Flame size={14} className="text-orange-400" />
                        <span className="text-xs text-white/60">Streak</span>
                    </div>
                    <div className="text-2xl font-bold text-orange-400">{drillState.streak}</div>
                </div>
            </div>

            {/* Question */}
            <div className="max-w-4xl mx-auto">
                <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/5">
                    <div className="flex items-center gap-2 mb-4">
                        <div className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-widest ${currentQuestion.difficulty === 1 ? 'bg-green-500/20 text-green-400' :
                            currentQuestion.difficulty === 2 ? 'bg-yellow-500/20 text-yellow-400' :
                                'bg-red-500/20 text-red-400'
                            }`}>
                            {currentQuestion.difficulty === 1 ? 'Easy' : currentQuestion.difficulty === 2 ? 'Medium' : 'Hard'}
                        </div>
                        <div className="px-2 py-1 rounded bg-white/5 text-xs uppercase tracking-widest text-white/40">
                            {currentQuestion.type.replace('_', ' ')}
                        </div>
                    </div>

                    <p className="text-lg text-white mb-6 whitespace-pre-line">{currentQuestion.question}</p>

                    <div className="space-y-3">
                        {currentQuestion.options?.map((option: string, idx: number) => (
                            <button
                                key={idx}
                                onClick={() => !showFeedback && handleAnswer(option)}
                                disabled={showFeedback}
                                className={`
                                    w-full p-4 rounded-xl text-left transition-all
                                    ${showFeedback
                                        ? option === currentQuestion.correctAnswer
                                            ? 'bg-green-500/20 border-2 border-green-500/50 text-green-400'
                                            : option === selectedAnswer
                                                ? 'bg-red-500/20 border-2 border-red-500/50 text-red-400'
                                                : 'bg-white/5 border border-white/10 text-white/40'
                                        : selectedAnswer === option
                                            ? 'bg-purple-500/20 border-2 border-purple-500/50 text-white'
                                            : 'bg-white/5 border border-white/10 text-white hover:bg-white/10'
                                    }
                                `}
                            >
                                <div className="flex items-center gap-3">
                                    {showFeedback && option === currentQuestion.correctAnswer && (
                                        <CheckCircle size={20} className="text-green-400 flex-shrink-0" />
                                    )}
                                    {showFeedback && option === selectedAnswer && option !== currentQuestion.correctAnswer && (
                                        <XCircle size={20} className="text-red-400 flex-shrink-0" />
                                    )}
                                    <span className="flex-1">{option}</span>
                                </div>
                            </button>
                        ))}
                    </div>

                    {showFeedback && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-6 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20"
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <Zap size={16} className="text-blue-400" />
                                <span className="text-sm font-bold text-blue-400">Explanation</span>
                            </div>
                            <p className="text-sm text-white/70">{currentQuestion.explanation}</p>
                        </motion.div>
                    )}

                    {showFeedback && (
                        <button
                            onClick={handleNext}
                            className="mt-6 w-full px-6 py-3 rounded-lg bg-accent-blue/20 hover:bg-accent-blue/30 border border-accent-blue/30 text-accent-blue font-medium transition-colors"
                        >
                            {drillState.currentDrill + 1 >= drills.length ? 'View Results' : 'Next Question'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}
