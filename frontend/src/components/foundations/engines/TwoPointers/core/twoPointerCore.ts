export type TwoPointerState = {
    left: number | null
    right: number | null
    slow?: number | null
    fast?: number | null
    mid?: number | null // For DNF
    pivotIndex?: number
    array: number[]
    swapIndices?: [number, number]
    conditionMet: boolean
    explanation: string
    currentSum?: number
    target?: number
    hasCycle?: boolean
    area?: number // For Container
}

export function runTwoPointers(
    initialArray: number[],
    mode: string,
    target: number = 0
): TwoPointerState[] {
    const array = [...initialArray]

    switch (mode) {
        case 'two_sum_sorted':
            return runTwoSumSorted(array, target)
        case 'container_most_water':
            return runContainerMostWater(array)
        case 'palindrome_check':
            return runPalindromeCheck(array)
        case 'move_zeroes':
            return runMoveZeroes(array)
        case 'remove_duplicates':
            return runRemoveDuplicates(array)
        case 'partition_array':
            return runPartition(array, target)
        case 'cycle_detection':
            return runFastSlowCycle(array)
        case 'linked_list_mid':
            return runLinkedListMid(array)
        case 'happy_number':
            return runHappyNumber(target || 19)
        case 'dnf_partition':
            return runDNF(array)
        default:
            return []
    }
}

export function runTwoSumSorted(arr: number[], target: number): TwoPointerState[] {
    let left = 0, right = arr.length - 1
    const states: TwoPointerState[] = []
    while (left < right) {
        const sum = arr[left] + arr[right]
        states.push({ left, right, array: [...arr], conditionMet: sum === target, currentSum: sum, target, explanation: `Sum: ${arr[left]} + ${arr[right]} = ${sum}. Target: ${target}.` })
        if (sum === target) return states
        if (sum < target) left++; else right--
    }
    return states
}

export function runContainerMostWater(arr: number[]): TwoPointerState[] {
    let l = 0, r = arr.length - 1, maxA = 0
    const states: TwoPointerState[] = []
    while (l < r) {
        const h = Math.min(arr[l], arr[r])
        const area = h * (r - l)
        maxA = Math.max(maxA, area)
        states.push({ left: l, right: r, array: [...arr], conditionMet: true, area, explanation: `Height: min(${arr[l]}, ${arr[r]}) = ${h}. Width: ${r - l}. Area: ${area}. Max: ${maxA}.` })
        if (arr[l] < arr[r]) l++; else r--
    }
    return states
}

function runPalindromeCheck(arr: number[]): TwoPointerState[] {
    let l = 0, r = arr.length - 1
    const states: TwoPointerState[] = []
    while (l < r) {
        const match = arr[l] === arr[r]
        states.push({ left: l, right: r, array: [...arr], conditionMet: match, explanation: `Comparing arr[${l}] (${arr[l]}) and arr[${r}] (${arr[r]}). Match: ${match}` })
        if (!match) break
        l++; r--
    }
    return states
}

function runMoveZeroes(arr: number[]): TwoPointerState[] {
    let slow = 0, states: TwoPointerState[] = []
    for (let fast = 0; fast < arr.length; fast++) {
        states.push({ left: slow, right: fast, array: [...arr], conditionMet: false, explanation: `Scanning ${arr[fast]}.` })
        if (arr[fast] !== 0) {
            if (slow !== fast) {
                states.push({ left: slow, right: fast, array: [...arr], conditionMet: true, swapIndices: [slow, fast], explanation: `Swap non-zero ${arr[fast]} to index ${slow}.` })
                const t = arr[slow]; arr[slow] = arr[fast]; arr[fast] = t
            }
            slow++
        }
    }
    return states
}

function runRemoveDuplicates(arr: number[]): TwoPointerState[] {
    if (arr.length === 0) return []
    let slow = 0, states: TwoPointerState[] = []
    for (let fast = 1; fast < arr.length; fast++) {
        states.push({ left: slow, right: fast, array: [...arr], conditionMet: arr[slow] === arr[fast], explanation: `Compare unique [${slow}] with current [${fast}].` })
        if (arr[fast] !== arr[slow]) {
            slow++; arr[slow] = arr[fast]
            states.push({ left: slow, right: fast, array: [...arr], conditionMet: true, explanation: `New unique found. Move slow and update.` })
        }
    }
    return states
}

function runPartition(arr: number[], k: number): TwoPointerState[] {
    let slow = 0, states: TwoPointerState[] = []
    for (let fast = 0; fast < arr.length; fast++) {
        states.push({ left: slow, right: fast, array: [...arr], conditionMet: arr[fast] < k, explanation: `Compare ${arr[fast]} < ${k}.` })
        if (arr[fast] < k) {
            const t = arr[slow]; arr[slow] = arr[fast]; arr[fast] = t
            states.push({ left: slow, right: fast, array: [...arr], conditionMet: true, swapIndices: [slow, fast], explanation: `Swap into left partition.` })
            slow++
        }
    }
    return states
}

function runFastSlowCycle(arr: number[]): TwoPointerState[] {
    let slow = 0, fast = 0, states: TwoPointerState[] = []
    for (let i = 0; i < 20; i++) {
        slow = (slow + 1) % arr.length
        fast = (fast + 2) % arr.length
        const met = slow === fast
        states.push({ left: null, right: null, slow, fast, array: [...arr], conditionMet: met, hasCycle: met, explanation: met ? "Collision detected!" : `Gap closing...` })
        if (met) break
    }
    return states
}

function runLinkedListMid(arr: number[]): TwoPointerState[] {
    let slow = 0, fast = 0, states: TwoPointerState[] = []
    while (fast < arr.length - 1 && fast + 1 < arr.length - 1) {
        slow++; fast += 2
        states.push({ left: null, right: null, slow, fast, array: [...arr], conditionMet: false, explanation: `Slow at ${slow}, Fast at ${fast}.` })
    }
    states.push({ left: null, right: null, slow, fast, array: [...arr], conditionMet: true, explanation: `Fast reached end. Slow is at middle index ${slow}.` })
    return states
}

function runHappyNumber(n: number): TwoPointerState[] {
    const getNext = (m: number) => m.toString().split('').reduce((a, b) => a + Math.pow(parseInt(b), 2), 0)
    let slow = n, fast = getNext(n), states: TwoPointerState[] = []
    while (fast !== 1 && slow !== fast) {
        states.push({ left: null, right: null, slow: 0, fast: 0, array: [slow, fast], conditionMet: false, explanation: `Current: ${slow}, Fast: ${fast}` })
        slow = getNext(slow); fast = getNext(getNext(fast))
    }
    states.push({ left: null, right: null, slow: 0, fast: 0, array: [slow, fast], conditionMet: fast === 1, explanation: fast === 1 ? "HAPPY!" : "CYCLE DETECTED" })
    return states
}

function runDNF(arr: number[]): TwoPointerState[] {
    let l = 0, m = 0, r = arr.length - 1, states: TwoPointerState[] = []
    while (m <= r) {
        states.push({ left: l, right: r, mid: m, array: [...arr], conditionMet: false, explanation: `Evaluating arr[${m}] = ${arr[m]}` })
        if (arr[m] === 0) {
            const t = arr[l]; arr[l] = arr[m]; arr[m] = t
            states.push({ left: l, right: r, mid: m, array: [...arr], conditionMet: true, swapIndices: [l, m], explanation: "Found 0, swap to left." })
            l++; m++
        } else if (arr[m] === 1) {
            m++
        } else {
            const t = arr[m]; arr[m] = arr[r]; arr[r] = t
            states.push({ left: l, right: r, mid: m, array: [...arr], conditionMet: true, swapIndices: [m, r], explanation: "Found 2, swap to right." })
            r--
        }
    }
    return states
}
