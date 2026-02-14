export interface SlidingWindowState {
    left: number
    right: number
    currentWindow: number[]
    outgoing: number | null
    incoming: number | null
    currentSum: number
    operationCount: number
    step: number
    isInitializing: boolean
}

export function generateSlidingWindowStates(
    array: number[],
    windowSize: number
): SlidingWindowState[] {
    if (array.length === 0 || windowSize <= 0 || windowSize > array.length) {
        return []
    }

    const states: SlidingWindowState[] = []
    let sum = 0
    let ops = 0

    // Phase 1: Initialize first window
    for (let i = 0; i < windowSize; i++) {
        sum += array[i]
        ops++

        states.push({
            left: 0,
            right: i,
            currentWindow: array.slice(0, i + 1),
            outgoing: null,
            incoming: array[i],
            currentSum: sum,
            operationCount: ops,
            step: states.length,
            isInitializing: true
        })
    }

    // Phase 2: Slide window (reuse overlap)
    for (let i = windowSize; i < array.length; i++) {
        const outgoing = array[i - windowSize]
        const incoming = array[i]

        sum = sum - outgoing + incoming
        ops += 2 // subtract + add operations

        states.push({
            left: i - windowSize + 1,
            right: i,
            currentWindow: array.slice(i - windowSize + 1, i + 1),
            outgoing,
            incoming,
            currentSum: sum,
            operationCount: ops,
            step: states.length,
            isInitializing: false
        })
    }

    return states
}
