// ContributionLogic removed as we inline the explanation now

export type WindowState = {
    left: number
    right: number
    windowSize: number
    conditionMet: boolean
    currentValue?: number
    currentContribution?: number
    totalContribution?: number
    explanation: string
}

export function runSlidingWindow(
    array: number[],
    mode: string,
    k: number = 3
): WindowState[] {
    switch (mode) {
        case 'fixed_window':
            return fixedWindowModel(array, k)
        case 'variable_window':
            return variableWindowModel(array, k)
        case 'at_most_k':
            return atMostKModel(array, k)
        case 'exact_k':
            return exactKModel(array, k)
        default:
            return []
    }
}

function fixedWindowModel(arr: number[], k: number): WindowState[] {
    let left = 0
    const states: WindowState[] = []
    let currentSum = 0

    for (let right = 0; right < arr.length; right++) {
        currentSum += arr[right]

        if (right - left + 1 === k) {
            states.push({
                left,
                right,
                windowSize: k,
                conditionMet: true,
                currentValue: currentSum,
                explanation: `Window size reached ${k}. Current Sum: ${currentSum}.`
            })
            currentSum -= arr[left]
            left++
        } else {
            states.push({
                left,
                right,
                windowSize: right - left + 1,
                conditionMet: false,
                currentValue: currentSum,
                explanation: `Expanding to reach size ${k}...`
            })
        }
    }
    return states
}

function variableWindowModel(arr: number[], target: number): WindowState[] {
    let left = 0
    let sum = 0
    const states: WindowState[] = []
    let minLength = Infinity

    for (let right = 0; right < arr.length; right++) {
        sum += arr[right]

        // Expansion state
        states.push({
            left,
            right,
            windowSize: right - left + 1,
            conditionMet: sum >= target,
            currentValue: sum,
            explanation: `Added ${arr[right]}. Sum: ${sum}. Target: ${target}.`
        })

        // Valid window found (Sum >= Target), try to shrink
        while (sum >= target) {
            minLength = Math.min(minLength, right - left + 1)

            states.push({
                left,
                right,
                windowSize: right - left + 1,
                conditionMet: true,
                currentValue: sum,
                explanation: `Sum ${sum} >= ${target}. Valid window found (Length: ${right - left + 1}). Shrinking...`
            })

            sum -= arr[left]
            left++
        }

        // After shrinking, we might be invalid again
        if (left <= right + 1) { // +1 because left can go past right if window size becomes 0
            states.push({
                left,
                right,
                windowSize: right - left + 1,
                conditionMet: false,
                currentValue: sum,
                explanation: `Sum ${sum} < ${target}. Need more elements.`
            })
        }
    }
    return states
}

function atMostKModel(arr: number[], k: number): WindowState[] {
    let left = 0
    const states: WindowState[] = []
    let totalSubarrays = 0
    const freqMap = new Map<number, number>()

    for (let right = 0; right < arr.length; right++) {
        const num = arr[right]
        freqMap.set(num, (freqMap.get(num) || 0) + 1)

        // Expansion state
        states.push({
            left,
            right,
            windowSize: right - left + 1,
            conditionMet: freqMap.size <= k,
            currentValue: freqMap.size,
            explanation: `Added ${num}. Distinct count: ${freqMap.size}.`
        })

        // Shrink if distinct > k
        while (freqMap.size > k) {
            const leftNum = arr[left]
            freqMap.set(leftNum, freqMap.get(leftNum)! - 1)
            if (freqMap.get(leftNum) === 0) {
                freqMap.delete(leftNum)
            }

            states.push({
                left,
                right,
                windowSize: right - left + 1,
                conditionMet: freqMap.size <= k,
                currentValue: freqMap.size,
                explanation: `Distinct ${freqMap.size + 1} > ${k}. Shrinking... Removed ${leftNum}.`
            })
            left++
        }

        // Now valid
        const count = right - left + 1
        totalSubarrays += count

        states.push({
            left,
            right,
            windowSize: right - left + 1,
            conditionMet: true,
            currentValue: freqMap.size,
            currentContribution: count,
            totalContribution: totalSubarrays,
            explanation: `Valid window [${left}...${right}]. Contains ${freqMap.size} distinct. Adds +${count} subarrays.`
        })
    }
    return states
}

function exactKModel(arr: number[], k: number): WindowState[] {
    const statesK = atMostKModel(arr, k)
    const statesKMinus1 = atMostKModel(arr, k - 1)

    // Map contributions from K-1 model for O(1) lookup
    const contributionsKMinus1 = new Map<number, number>()
    statesKMinus1.forEach(s => {
        if (s.currentContribution !== undefined) {
            contributionsKMinus1.set(s.right, s.currentContribution)
        }
    })

    let totalExact = 0

    return statesK.map(state => {
        // If this is a contribution state (end of a window expansion/shrink cycle)
        if (state.currentContribution !== undefined) {
            const countK = state.currentContribution
            const countKMinus1 = contributionsKMinus1.get(state.right) || 0
            const netCount = countK - countKMinus1

            totalExact += netCount

            return {
                ...state,
                currentContribution: netCount,
                totalContribution: totalExact,
                explanation: `AtMost(${k}): ${countK} - AtMost(${k - 1}): ${countKMinus1} = ${netCount} Exact subarrays.`
            }
        }

        // For intermediate states, purely visualize the AtMost(K) process
        return {
            ...state,
            explanation: state.explanation + ` (Simulating AtMost(${k}))...`
        }
    })
}
