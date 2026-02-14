export type MonotonicStackState = {
    array: number[]
    stack: number[] // indices
    currentIndex: number
    result: number[]
    conditionMet: boolean
    explanation: string
    phase: 'scan' | 'compare' | 'pop' | 'push' | 'finished'
    activeComparison?: { stackIdx: number, currentIdx: number }
}

export function runMonotonicStack(
    array: number[],
    mode: string // next_greater, next_smaller, prev_greater, prev_smaller
): MonotonicStackState[] {
    const n = array.length
    const result = new Array(n).fill(-1)
    const stack: number[] = [] // indices
    const states: MonotonicStackState[] = []

    // Helper to push state
    const pushState = (
        currIdx: number,
        phase: MonotonicStackState['phase'],
        expl: string,
        comp?: { stackIdx: number, currentIdx: number }
    ) => {
        states.push({
            array: [...array],
            stack: [...stack],
            currentIndex: currIdx,
            result: [...result],
            conditionMet: phase === 'pop',
            explanation: expl,
            phase,
            activeComparison: comp
        })
    }

    // const isNext = mode.startsWith('next')
    const isGreater = mode.includes('greater') || mode === 'daily_temperatures'

    // For 'next' problems, we usually iterate right to left OR iterate left to right and pop.
    // Standard approach: Iterate Left to Right.
    // Monotonic Decreasing Stack finds Next Greater Element.
    // Monotonic Increasing Stack finds Next Smaller Element.

    for (let i = 0; i < n; i++) {
        pushState(i, 'scan', `Processing index ${i} (Value: ${array[i]})`)

        while (stack.length > 0) {
            const topIdx = stack[stack.length - 1]
            const topVal = array[topIdx]
            const currVal = array[i]

            pushState(i, 'compare', `Comparing current ${currVal} with stack top ${topVal} (Index ${topIdx})`, { stackIdx: topIdx, currentIdx: i })

            const shouldPop = isGreater ? currVal > topVal : currVal < topVal

            if (shouldPop) {
                // Found the next greater/smaller for topIdx
                result[topIdx] = currVal // Or index i depending on problem, usually value for basic NGE
                // For daily temperatures, result is i - topIdx
                if (mode === 'daily_temperatures') {
                    result[topIdx] = i - topIdx
                }

                stack.pop()
                pushState(i, 'pop', `Condition met! ${currVal} is ${isGreater ? 'greater' : 'smaller'} than ${topVal}. Pop index ${topIdx}. Updated result for ${topIdx}.`)
            } else {
                pushState(i, 'compare', `Condition not met. ${currVal} is not ${isGreater ? 'greater' : 'smaller'} than ${topVal}. Stop popping.`)
                break
            }
        }

        stack.push(i)
        pushState(i, 'push', `Push index ${i} to stack.`)
    }

    // Remaining items in stack have no next greater/smaller
    pushState(n, 'finished', "Traversal complete. Remaining items in stack have no next match.")

    return states
}
