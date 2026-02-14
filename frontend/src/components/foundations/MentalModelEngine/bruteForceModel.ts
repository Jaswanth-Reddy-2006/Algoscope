export interface BruteForceState {
    outerIndex: number
    innerIndex: number
    currentWindow: number[]
    recalculatedElements: number[]
    currentSum: number
    operationCount: number
    step: number
}

export function generateBruteForceStates(
    array: number[],
    windowSize: number
): BruteForceState[] {
    if (array.length === 0 || windowSize <= 0 || windowSize > array.length) {
        return []
    }

    const states: BruteForceState[] = []
    let totalOps = 0

    // For each possible window position
    for (let i = 0; i <= array.length - windowSize; i++) {
        // Recalculate entire window from scratch (nested loop)
        let sum = 0
        const recalculated: number[] = []

        for (let j = i; j < i + windowSize; j++) {
            sum += array[j]
            totalOps++
            recalculated.push(array[j])

            states.push({
                outerIndex: i,
                innerIndex: j,
                currentWindow: array.slice(i, i + windowSize),
                recalculatedElements: [...recalculated],
                currentSum: sum,
                operationCount: totalOps,
                step: states.length
            })
        }
    }

    return states
}
