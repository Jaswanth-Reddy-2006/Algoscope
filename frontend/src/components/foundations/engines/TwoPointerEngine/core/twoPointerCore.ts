export type TwoPointerState = {
    left: number | null
    right: number | null
    slow?: number | null // For Fast & Slow
    fast?: number | null // For Fast & Slow
    pivotIndex?: number // For Partition
    array: number[]
    swapIndices?: [number, number] // Indices being swapped
    conditionMet: boolean
    explanation: string
    currentSum?: number // For Two Sum
    target?: number // For Two Sum
    hasCycle?: boolean // For Cycle Detection
}

export function runTwoPointers(
    initialArray: number[],
    mode: string,
    target: number = 0
): TwoPointerState[] {
    // Clone array to avoid mutation during simulation
    const array = [...initialArray]

    switch (mode) {
        case 'opposite_direction':
            return runTwoSumSorted(array, target)
        case 'same_direction':
            return runMoveZeroes(array)
        case 'fast_slow':
            return runFastSlowCycle(array)
        case 'partition':
            return runPartition(array)
        default:
            return []
    }
}

function runTwoSumSorted(arr: number[], target: number): TwoPointerState[] {
    let left = 0
    let right = arr.length - 1
    const states: TwoPointerState[] = []

    while (left < right) {
        const sum = arr[left] + arr[right]

        states.push({
            left,
            right,
            array: [...arr],
            conditionMet: sum === target,
            currentSum: sum,
            target,
            explanation: `Sum: ${arr[left]} + ${arr[right]} = ${sum}. Target: ${target}.`
        })

        if (sum === target) {
            states.push({
                left,
                right,
                array: [...arr],
                conditionMet: true,
                currentSum: sum,
                target,
                explanation: `FOUND! ${arr[left]} + ${arr[right]} = ${target}.`
            })
            return states
        } else if (sum < target) {
            states.push({
                left,
                right,
                array: [...arr],
                conditionMet: false,
                currentSum: sum,
                target,
                explanation: `${sum} < ${target}. Too small. Moving Left pointer to increase sum.`
            })
            left++
        } else {
            states.push({
                left,
                right,
                array: [...arr],
                conditionMet: false,
                currentSum: sum,
                target,
                explanation: `${sum} > ${target}. Too large. Moving Right pointer to decrease sum.`
            })
            right--
        }
    }

    return states
}

function runMoveZeroes(arr: number[]): TwoPointerState[] {
    let left = 0 // Position to place non-zero
    const states: TwoPointerState[] = []

    for (let right = 0; right < arr.length; right++) {
        states.push({
            left,
            right,
            array: [...arr],
            conditionMet: false,
            explanation: `Scanning index ${right}. Value: ${arr[right]}.`
        })

        if (arr[right] !== 0) {
            if (right !== left) {
                states.push({
                    left,
                    right,
                    array: [...arr],
                    conditionMet: true,
                    swapIndices: [left, right],
                    explanation: `Found non-zero ${arr[right]}. Swap with ${arr[left]} (Zero zone boundary).`
                })

                // Perform swap
                const temp = arr[left]
                arr[left] = arr[right]
                arr[right] = temp

                states.push({
                    left,
                    right,
                    array: [...arr],
                    conditionMet: true,
                    explanation: `Swapped. Boundary moves right.`
                })
            } else {
                states.push({
                    left,
                    right,
                    array: [...arr],
                    conditionMet: true,
                    explanation: `Non-zero at correct position. Boundary moves.`
                })
            }
            left++
        } else {
            states.push({
                left,
                right,
                array: [...arr],
                conditionMet: false,
                explanation: `Found Zero. Expand zero zone.`
            })
        }
    }
    return states
}

function runPartition(arr: number[]): TwoPointerState[] {
    // Lomuto Partition Scheme
    // right is pivot
    const pivotIndex = arr.length - 1
    const pivot = arr[pivotIndex]
    let left = 0 // i: index of smaller element
    const states: TwoPointerState[] = []

    states.push({
        left: 0,
        right: 0,
        pivotIndex,
        array: [...arr],
        conditionMet: false,
        explanation: `Partitioning around Pivot: ${pivot}. 'Left' tracks boundary of smaller elements.`
    })

    for (let right = 0; right < arr.length - 1; right++) { // j: scanner
        states.push({
            left,
            right,
            pivotIndex,
            array: [...arr],
            conditionMet: arr[right] < pivot,
            explanation: `Comparing ${arr[right]} with Pivot ${pivot}.`
        })

        if (arr[right] < pivot) {
            states.push({
                left,
                right,
                pivotIndex,
                array: [...arr],
                conditionMet: true,
                swapIndices: [left, right],
                explanation: `${arr[right]} < ${pivot}. Swap into 'smaller' zone.`
            })

            const temp = arr[left]
            arr[left] = arr[right]
            arr[right] = temp

            states.push({
                left,
                right,
                pivotIndex,
                array: [...arr],
                conditionMet: true,
                explanation: `Swapped. Increment 'Left' boundary.`
            })
            left++
        }
    }

    // Final swap
    states.push({
        left,
        right: pivotIndex,
        pivotIndex,
        array: [...arr],
        conditionMet: true,
        swapIndices: [left, pivotIndex],
        explanation: `Process complete. Swap Pivot ${pivot} into correct sorted position.`
    })

    const temp = arr[left]
    arr[left] = arr[pivotIndex]
    arr[pivotIndex] = temp

    states.push({
        left,
        right: left,
        pivotIndex: left,
        array: [...arr],
        conditionMet: true,
        explanation: `Partition Complete. Pivot is now at index ${left}.`
    })

    return states
}

function runFastSlowCycle(arr: number[]): TwoPointerState[] {
    let slow = 0
    let fast = 0
    const states: TwoPointerState[] = []

    // Initial state
    states.push({
        left: null,
        right: null,
        slow,
        fast,
        array: [...arr],
        conditionMet: false,
        explanation: "Tortoise (Slow) and Hare (Fast) start at the beginning. Relative speed: 1 step/iter."
    })

    // Circular traversal simulation
    let steps = 0
    const maxSteps = 30

    while (steps < maxSteps) {
        slow = (slow + 1) % arr.length
        fast = (fast + 2) % arr.length

        steps++

        const met = slow === fast
        states.push({
            left: null,
            right: null,
            slow,
            fast,
            array: [...arr],
            conditionMet: met,
            hasCycle: met,
            explanation: met
                ? `MATCH! Hare catch up to Tortoise at index ${slow}. Cycle confirmed.`
                : `Slow moves to ${slow}, Fast jumps to ${fast}. Gap closing...`
        })

        if (met) break
    }

    return states
}

