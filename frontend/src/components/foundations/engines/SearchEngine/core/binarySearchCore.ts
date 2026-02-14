export type BinarySearchState = {
    low: number
    high: number
    mid?: number
    array: number[]
    target: number
    foundIndex?: number
    conditionMet: boolean
    explanation: string
    activeRange: [number, number] // [low, high] for visualization
    phase: 'calculate_mid' | 'compare' | 'eliminate' | 'found' | 'not_found'
}

export function runBinarySearch(
    initialArray: number[],
    mode: string,
    target: number
): BinarySearchState[] {
    const array = [...initialArray] // Sorted array

    switch (mode) {
        case 'standard':
            return runStandardSearch(array, target)
        case 'lower_bound':
            return runLowerBound(array, target)
        case 'upper_bound':
            return runUpperBound(array, target)
        default:
            return runStandardSearch(array, target)
    }
}

function runStandardSearch(arr: number[], target: number): BinarySearchState[] {
    let low = 0
    let high = arr.length - 1
    const states: BinarySearchState[] = []

    while (low <= high) {
        // State: Range Active
        states.push({
            low,
            high,
            array: arr,
            target,
            conditionMet: false,
            activeRange: [low, high],
            phase: 'calculate_mid',
            explanation: `Searching range [${low}, ${high}].`
        })

        const mid = Math.floor(low + (high - low) / 2)
        const midVal = arr[mid]

        // State: Mid Calculated
        states.push({
            low,
            high,
            mid,
            array: arr,
            target,
            conditionMet: false,
            activeRange: [low, high],
            phase: 'compare',
            explanation: `Mid Index: ${mid}, Value: ${midVal}. Comparing with Target ${target}.`
        })

        if (midVal === target) {
            states.push({
                low,
                high,
                mid,
                array: arr,
                target,
                foundIndex: mid,
                conditionMet: true,
                activeRange: [low, high],
                phase: 'found',
                explanation: `Found Target ${target} at index ${mid}!`
            })
            return states
        } else if (midVal < target) {
            states.push({
                low,
                high,
                mid,
                array: arr,
                target,
                conditionMet: false,
                activeRange: [low, high],
                phase: 'eliminate',
                explanation: `${midVal} < ${target}. Target is in right half. Eliminate [${low}...${mid}].`
            })
            low = mid + 1
        } else {
            states.push({
                low,
                high,
                mid,
                array: arr,
                target,
                conditionMet: false,
                activeRange: [low, high],
                phase: 'eliminate',
                explanation: `${midVal} > ${target}. Target is in left half. Eliminate [${mid}...${high}].`
            })
            high = mid - 1
        }
    }

    states.push({
        low,
        high,
        array: arr,
        target,
        conditionMet: false,
        activeRange: [low, high], // Crossed
        phase: 'not_found',
        explanation: `Low (${low}) > High (${high}). Target not found.`
    })

    return states
}

function runLowerBound(arr: number[], target: number): BinarySearchState[] {
    let low = 0
    let high = arr.length // Bounds are [0, N]
    const states: BinarySearchState[] = []
    let ans = arr.length

    while (low < high) {
        states.push({
            low,
            high,
            array: arr,
            target,
            conditionMet: false,
            activeRange: [low, high],
            phase: 'calculate_mid',
            explanation: `Lower Bound Search: Finding first element >= ${target} in [${low}, ${high}).`
        })

        const mid = Math.floor(low + (high - low) / 2)
        const midVal = arr[mid]

        states.push({
            low,
            high,
            mid,
            array: arr,
            target,
            conditionMet: false,
            activeRange: [low, high],
            phase: 'compare',
            explanation: `Mid ${mid} (${midVal}) compare with ${target}.`
        })

        if (midVal >= target) {
            ans = mid
            states.push({
                low,
                high,
                mid,
                array: arr,
                target,
                conditionMet: true, // Candidate found
                activeRange: [low, high],
                phase: 'eliminate',
                explanation: `${midVal} >= ${target}. Possible answer. Try left half for smaller index.`
            })
            high = mid
        } else {
            states.push({
                low,
                high,
                mid,
                array: arr,
                target,
                conditionMet: false,
                activeRange: [low, high],
                phase: 'eliminate',
                explanation: `${midVal} < ${target}. Too small. Answer must be to the right.`
            })
            low = mid + 1
        }
    }

    states.push({
        low,
        high,
        array: arr,
        target,
        foundIndex: ans,
        conditionMet: true,
        activeRange: [low, high],
        phase: 'found',
        explanation: `Lower Bound is index ${ans}. (Value: ${arr[ans] ?? 'End'}).`
    })

    return states
}

function runUpperBound(arr: number[], target: number): BinarySearchState[] {
    let low = 0
    let high = arr.length
    const states: BinarySearchState[] = []
    let ans = arr.length

    while (low < high) {
        states.push({
            low,
            high,
            array: arr,
            target,
            conditionMet: false,
            activeRange: [low, high],
            phase: 'calculate_mid',
            explanation: `Upper Bound Search: Finding first element > ${target} in [${low}, ${high}).`
        })

        const mid = Math.floor(low + (high - low) / 2)
        const midVal = arr[mid]

        states.push({
            low,
            high,
            mid,
            array: arr,
            target,
            conditionMet: false,
            activeRange: [low, high],
            phase: 'compare',
            explanation: `Mid ${mid} (${midVal}) compare with ${target}.`
        })

        if (midVal > target) {
            ans = mid
            states.push({
                low,
                high,
                mid,
                array: arr,
                target,
                conditionMet: true,
                activeRange: [low, high],
                phase: 'eliminate',
                explanation: `${midVal} > ${target}. Possible answer. Try left half.`
            })
            high = mid
        } else {
            states.push({
                low,
                high,
                mid,
                array: arr,
                target,
                conditionMet: false,
                activeRange: [low, high],
                phase: 'eliminate',
                explanation: `${midVal} <= ${target}. Too small/equal. Answer must be to the right.`
            })
            low = mid + 1
        }
    }

    states.push({
        low,
        high,
        array: arr,
        target,
        foundIndex: ans,
        conditionMet: true,
        activeRange: [low, high],
        phase: 'found',
        explanation: `Upper Bound is index ${ans}. (Value: ${arr[ans] ?? 'End'}).`
    })

    return states
}
