
export interface BruteForceState {
    i: number
    j: number
    array: number[]
    currentSum?: number
    area?: number
    conditionMet: boolean
    explanation: string
    step: number
}

export function generateTwoPointerBruteForce(
    initialArray: number[],
    mode: string,
    target: number = 0
): BruteForceState[] {
    const array = [...initialArray]
    let step = 0
    const states: BruteForceState[] = []

    if (mode === 'two_sum_sorted') {
        for (let i = 0; i < array.length; i++) {
            for (let j = i + 1; j < array.length; j++) {
                const sum = array[i] + array[j]
                states.push({
                    i,
                    j,
                    array: [...array],
                    currentSum: sum,
                    conditionMet: sum === target,
                    explanation: `Checking pair (${array[i]}, ${array[j]}). Sum: ${sum}`,
                    step: step++
                })
                if (sum === target) return states
            }
        }
    } else if (mode === 'container_most_water') {
        let maxArea = 0
        for (let i = 0; i < array.length; i++) {
            for (let j = i + 1; j < array.length; j++) {
                const h = Math.min(array[i], array[j])
                const area = h * (j - i)
                maxArea = Math.max(maxArea, area)

                states.push({
                    i,
                    j,
                    array: [...array],
                    area,
                    conditionMet: false, // We don't stop early for container
                    explanation: `Height: ${h}, Width: ${j - i}, Area: ${area}. Max: ${maxArea}`,
                    step: step++
                })
            }
        }
        // Push final state
        states.push({
            i: -1, j: -1, array: [...array], area: maxArea,
            conditionMet: true, explanation: `Max Area found: ${maxArea}`, step: step++
        })
    } else {
        // Default generic placeholder for other modes
        states.push({
            i: 0, j: 1, array: [...array],
            conditionMet: false, explanation: "Brute force specific logic coming soon for this sub-pattern", step: 0
        })
    }

    return states
}
