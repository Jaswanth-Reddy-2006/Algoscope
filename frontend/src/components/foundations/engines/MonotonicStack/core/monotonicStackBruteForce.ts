export type BruteForceStackState = {
    array: number[]
    i: number
    j: number
    result: number[]
    found: boolean
    explanation: string
    step: number
}

export function runMonotonicStackBruteForce(
    array: number[],
    mode: string
): BruteForceStackState[] {
    const n = array.length
    const result = new Array(n).fill(-1)
    const states: BruteForceStackState[] = []
    let step = 0

    const isGreater = mode.includes('greater') || mode === 'daily_temperatures'

    for (let i = 0; i < n; i++) {
        // let foundForI = false
        // Search to the right
        for (let j = i + 1; j < n; j++) {
            step++
            states.push({
                array: [...array],
                i,
                j,
                result: [...result],
                found: false,
                explanation: `Comparing ${array[i]} with ${array[j]}.`,
                step
            })

            const condition = isGreater ? array[j] > array[i] : array[j] < array[i]

            if (condition) {
                result[i] = array[j]
                if (mode === 'daily_temperatures') {
                    result[i] = j - i
                }
                // foundForI = true
                states.push({
                    array: [...array],
                    i,
                    j,
                    result: [...result],
                    found: true,
                    explanation: `Found next ${isGreater ? 'greater' : 'smaller'}: ${array[j]}.`,
                    step
                })
                break
            }
        }
    }

    return states
}
