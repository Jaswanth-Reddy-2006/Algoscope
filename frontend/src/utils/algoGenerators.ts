import { Step } from '../types'

/**
 * TWO SUM: BRUTE FORCE (O(N^2))
 */
export const generateTwoSumBrute = (nums: number[], target: number): Step[] => {
    const steps: Step[] = []

    for (let i = 0; i < nums.length; i++) {
        for (let j = i + 1; j < nums.length; j++) {
            const currentSum = nums[i] + nums[j]
            const isMatch = currentSum === target

            steps.push({
                step: steps.length,
                description: `Checking pair at indices ${i} and ${j} (${nums[i]} + ${nums[j]} = ${currentSum})`,
                state: {
                    array: nums,
                    pointers: { i, j },
                    explanation: isMatch
                        ? `Match found! ${nums[i]} + ${nums[j]} = ${target}`
                        : `${nums[i]} + ${nums[j]} = ${currentSum}. Still looking...`,
                    found: isMatch,
                    phase: isMatch ? 'found' : 'searching',
                    highlightIndices: isMatch ? [i, j] : [],
                    finalAnswer: isMatch ? [i, j] : undefined
                }
            })

            if (isMatch) return steps
        }
    }

    steps.push({
        step: steps.length,
        description: "Exhausted all pairs. No solution found.",
        state: {
            array: nums,
            explanation: "No two numbers sum up to the target.",
            phase: 'not_found'
        }
    })
    return steps
}

/**
 * TWO SUM: OPTIMAL HASHMAP (O(N))
 */
export const generateTwoSumHashMap = (nums: number[], target: number): Step[] => {
    const steps: Step[] = []
    const map: Record<number, number> = {}

    for (let i = 0; i < nums.length; i++) {
        const val = nums[i]
        const complement = target - val
        const complementIdx = map[complement]
        const isMatch = complementIdx !== undefined

        const stepDesc = `Processing ${val} at index ${i}. Target complement is ${complement}.`

        steps.push({
            step: steps.length,
            description: stepDesc,
            state: {
                array: nums,
                pointers: { i },
                mapState: { ...map },
                explanation: isMatch
                    ? `Found complement ${complement} in hash map at index ${complementIdx}!`
                    : `Complement ${complement} not in map. Adding ${val} to map.`,
                phase: isMatch ? 'found' : 'searching',
                highlightIndices: isMatch ? [complementIdx, i] : [i],
                finalAnswer: isMatch ? [complementIdx, i] : undefined
            }
        })

        if (isMatch) return steps
        map[val] = i
    }

    return steps
}

/**
 * SLIDING WINDOW: MAX SUM SUBARRAY BRUTE (DEMO)
 */
export const generateSlidingWindowMaxSumBrute = (_input: any): Step[] => {
    // Placeholder for standardization
    return []
}

/**
 * SLIDING WINDOW: MAX SUM SUBARRAY OPTIMAL (DEMO)
 */
export const generateSlidingWindowMaxSumOptimal = (_input: any): Step[] => {
    // Placeholder for standardization
    return []
}

/**
 * BINARY SEARCH (O(log N))
 */
export const generateBinarySearch = (nums: number[], target: number): Step[] => {
    const steps: Step[] = []
    let left = 0
    let right = nums.length - 1

    steps.push({
        step: 0,
        description: `Starting Binary Search for ${target}. Range: [${left}, ${right}]`,
        state: { array: nums, pointers: { left, right }, phase: 'init' }
    })

    while (left <= right) {
        const mid = Math.floor((left + right) / 2)
        const val = nums[mid]
        const isMatch = val === target

        steps.push({
            step: steps.length,
            description: `Checking middle element at index ${mid} (${val})`,
            state: {
                array: nums,
                pointers: { left, right, mid },
                explanation: isMatch ? `Found target ${target} at index ${mid}!` : (val < target ? `${val} < ${target}, searching right half.` : `${val} > ${target}, searching left half.`),
                phase: isMatch ? 'found' : 'searching',
                highlightIndices: [mid]
            }
        })

        if (isMatch) return steps

        if (val < target) {
            left = mid + 1
        } else {
            right = mid - 1
        }
    }

    steps.push({
        step: steps.length,
        description: `Target ${target} not found in array.`,
        state: { array: nums, phase: 'not_found' }
    })
    return steps
}

/**
 * MAXIMUM SUBARRAY: KADANE (O(N))
 */
export const generateMaximumSubarrayKadane = (nums: number[]): Step[] => {
    const steps: Step[] = []
    let maxSoFar = -Infinity
    let currentMax = 0
    let start = 0
    let end = 0
    let tempStart = 0

    for (let i = 0; i < nums.length; i++) {
        currentMax += nums[i]

        const shouldReset = nums[i] > currentMax
        if (shouldReset) {
            currentMax = nums[i]
            tempStart = i
        }

        const isNewMax = currentMax > maxSoFar
        if (isNewMax) {
            maxSoFar = currentMax
            start = tempStart
            end = i
        }

        steps.push({
            step: steps.length,
            description: `Element ${nums[i]} at index ${i}. Max so far: ${maxSoFar}`,
            state: {
                array: nums,
                pointers: { i },
                windowRange: [start, end],
                customState: { currentMax, maxSoFar },
                explanation: `Current Sum: ${currentMax}, Global Max: ${maxSoFar}`,
                highlightIndices: Array.from({ length: end - start + 1 }, (_, k) => start + k)
            }
        })
    }
    return steps
}

/**
 * GENERIC FALLBACK GENERATOR
 */
export const generateFallbackSteps = (items: any[]): Step[] => {
    return items.map((_, i) => ({
        step: i,
        description: `Processing element at index ${i}...`,
        state: {
            array: items as number[],
            pointers: { curr: i },
            explanation: `Processing element at index ${i}...`
        }
    }))
}
