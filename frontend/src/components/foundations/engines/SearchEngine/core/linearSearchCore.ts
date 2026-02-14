export interface LinearSearchState {
    array: number[]
    target: number
    currentIndex: number
    foundIndex: number | null
    phase: 'searching' | 'found' | 'not_found'
    explanation: string
    step: number // Operation count
}

export function runLinearSearch(array: number[], target: number): LinearSearchState[] {
    const states: LinearSearchState[] = []
    let step = 0

    for (let i = 0; i < array.length; i++) {
        step++ // Comparison
        states.push({
            array: [...array],
            target,
            currentIndex: i,
            foundIndex: null,
            phase: 'searching',
            explanation: `Comparing index ${i} (Value: ${array[i]}) with target ${target}`,
            step
        })

        if (array[i] === target) {
            states.push({
                array: [...array],
                target,
                currentIndex: i,
                foundIndex: i,
                phase: 'found',
                explanation: `Found target ${target} at index ${i}!`,
                step
            })
            return states
        }
    }

    states.push({
        array: [...array],
        target,
        currentIndex: array.length,
        foundIndex: null,
        phase: 'not_found',
        explanation: `Target ${target} not found in array.`,
        step
    })

    return states
}
