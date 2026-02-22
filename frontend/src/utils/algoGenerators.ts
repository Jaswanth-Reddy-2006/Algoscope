import { Step } from '../types'

/**
 * TWO SUM: TWO POINTERS (O(N log N) including sort, or O(N) if already sorted)
 */
export const generateTwoSumPointers = (nums: number[], target: number): Step[] => {
    const steps: Step[] = []

    // Create a version of the array with original indices to track them after sorting
    const indexedNums = nums.map((val, idx) => ({ val, idx }))
    indexedNums.sort((a, b) => a.val - b.val)
    const sortedVals = indexedNums.map(item => item.val)

    steps.push({
        step: 0,
        description: "Starting Two Pointers on sorted array.",
        state: {
            array: sortedVals,
            pointers: { l: 0, r: sortedVals.length - 1 },
            explanation: "Sorted the array to enable Two Pointers logic. Placed pointers at start and end.",
            phase: 'init'
        }
    })

    let l = 0, r = sortedVals.length - 1
    while (l < r) {
        const sum = sortedVals[l] + sortedVals[r]
        const isMatch = sum === target

        steps.push({
            step: steps.length,
            description: `Checking L=${l}, R=${r} (${sortedVals[l]} + ${sortedVals[r]} = ${sum})`,
            state: {
                array: sortedVals,
                pointers: { l, r },
                explanation: isMatch
                    ? `Match found! ${sortedVals[l]} + ${sortedVals[r]} = ${target}`
                    : (sum < target
                        ? `${sum} < ${target}. Need larger sum, moving Left pointer.`
                        : `${sum} > ${target}. Need smaller sum, moving Right pointer.`),
                phase: isMatch ? 'found' : 'searching',
                highlightIndices: [l, r],
                finalAnswer: isMatch ? [indexedNums[l].idx, indexedNums[r].idx] : undefined,
                customState: { sum, target }
            }
        })

        if (isMatch) return steps
        if (sum < target) l++; else r--
    }

    steps.push({
        step: steps.length,
        description: "No solution found.",
        state: {
            array: sortedVals,
            explanation: "Exhausted all possible pairs.",
            phase: 'not_found'
        }
    })
    return steps
}

/**
 * TWO SUM: BRUTE FORCE (O(N^2))
 */
export const generateTwoSumBrute = (nums: number[], target: number): Step[] => {
    const steps: Step[] = []

    for (let i = 0; i < nums.length; i++) {
        for (let j = i + 1; j < nums.length; j++) {
            const currentSum = nums[i] + nums[j]
            const isMatch = currentSum === target

            steps.push({
                step: steps.length,
                description: `Checking pair at indices ${i} and ${j} (${nums[i]} + ${nums[j]} = ${currentSum})`,
                state: {
                    array: nums,
                    pointers: { i, j },
                    explanation: isMatch
                        ? `Match found! ${nums[i]} + ${nums[j]} = ${target}`
                        : `${nums[i]} + ${nums[j]} = ${currentSum}. Still looking...`,
                    found: isMatch,
                    phase: isMatch ? 'found' : 'searching',
                    highlightIndices: [i, j],
                    finalAnswer: isMatch ? [i, j] : undefined,
                    customState: { sum: currentSum, target }
                }
            })

            if (isMatch) return steps
        }
    }

    steps.push({
        step: steps.length,
        description: "Exhausted all pairs. No solution found.",
        state: {
            array: nums,
            explanation: "No two numbers sum up to the target.",
            phase: 'not_found'
        }
    })
    return steps
}

/**
 * TWO SUM: OPTIMAL HASHMAP (O(N))
 */
export const generateTwoSumHashMap = (nums: number[], target: number): Step[] => {
    const steps: Step[] = []
    const map: Record<number, number> = {}

    for (let i = 0; i < nums.length; i++) {
        const val = nums[i]
        const complement = target - val
        const complementIdx = map[complement]
        const isMatch = complementIdx !== undefined

        const stepDesc = `Processing ${val} at index ${i}. Target complement is ${complement}.`

        steps.push({
            step: steps.length,
            description: stepDesc,
            state: {
                array: nums,
                pointers: { i },
                mapState: { ...map },
                explanation: isMatch
                    ? `Found complement ${complement} in hash map at index ${complementIdx}!`
                    : `Complement ${complement} not in map. Adding ${val} to map.`,
                phase: isMatch ? 'found' : 'searching',
                highlightIndices: isMatch ? [complementIdx, i] : [i],
                finalAnswer: isMatch ? [complementIdx, i] : undefined
            }
        })

        if (isMatch) return steps
        map[val] = i
    }

    return steps
}

/**
 * SLIDING WINDOW: MAX SUM SUBARRAY BRUTE (DEMO)
 */
export const generateSlidingWindowMaxSumBrute = (_input: any): Step[] => {
    // Placeholder for standardization
    return []
}

/**
 * SLIDING WINDOW: MAX SUM SUBARRAY OPTIMAL (DEMO)
 */
export const generateSlidingWindowMaxSumOptimal = (_input: any): Step[] => {
    // Placeholder for standardization
    return []
}

/**
 * BINARY SEARCH (O(log N))
 */
export const generateBinarySearch = (nums: number[], target: number): Step[] => {
    const steps: Step[] = []
    let left = 0
    let right = nums.length - 1

    steps.push({
        step: 0,
        description: `Starting Binary Search for ${target}. Range: [${left}, ${right}]`,
        state: { array: nums, pointers: { left, right }, phase: 'init' }
    })

    while (left <= right) {
        const mid = Math.floor((left + right) / 2)
        const val = nums[mid]
        const isMatch = val === target

        steps.push({
            step: steps.length,
            description: `Checking middle element at index ${mid} (${val})`,
            state: {
                array: nums,
                pointers: { left, right, mid },
                explanation: isMatch ? `Found target ${target} at index ${mid}!` : (val < target ? `${val} < ${target}, searching right half.` : `${val} > ${target}, searching left half.`),
                phase: isMatch ? 'found' : 'searching',
                highlightIndices: [mid]
            }
        })

        if (isMatch) return steps

        if (val < target) {
            left = mid + 1
        } else {
            right = mid - 1
        }
    }

    steps.push({
        step: steps.length,
        description: `Target ${target} not found in array.`,
        state: { array: nums, phase: 'not_found' }
    })
    return steps
}

/**
 * MAXIMUM SUBARRAY: KADANE (O(N))
 */
export const generateMaximumSubarrayKadane = (nums: number[]): Step[] => {
    const steps: Step[] = []
    let maxSoFar = -Infinity
    let currentMax = 0
    let start = 0
    let end = 0
    let tempStart = 0

    for (let i = 0; i < nums.length; i++) {
        currentMax += nums[i]

        const shouldReset = nums[i] > currentMax
        if (shouldReset) {
            currentMax = nums[i]
            tempStart = i
        }

        const isNewMax = currentMax > maxSoFar
        if (isNewMax) {
            maxSoFar = currentMax
            start = tempStart
            end = i
        }

        steps.push({
            step: steps.length,
            description: `Element ${nums[i]} at index ${i}. Max so far: ${maxSoFar}`,
            state: {
                array: nums,
                pointers: { i },
                windowRange: [start, end],
                customState: { currentMax, maxSoFar },
                explanation: `Current Sum: ${currentMax}, Global Max: ${maxSoFar}`,
                highlightIndices: Array.from({ length: end - start + 1 }, (_, k) => start + k)
            }
        })
    }
    return steps
}

/**
 * ADD TWO NUMBERS: OPTIMAL PARALLEL TRAVERSAL (O(max(N, M)))
 */
export const generateAddTwoNumbersOptimal = (l1: number[], l2: number[]): Step[] => {
    const steps: Step[] = []
    let carry = 0
    const result: number[] = []
    let i = 0
    let j = 0

    steps.push({
        step: 0,
        description: "Initializing parallel traversal of both lists.",
        state: {
            pointers: { l1: 0, l2: 0 },
            customState: { carry: 0, sum: 0 },
            result: [],
            phase: 'init',
            explanation: "Set carry to 0 and started at the head of both lists."
        }
    })

    while (i < l1.length || j < l2.length || carry > 0) {
        const v1 = i < l1.length ? l1[i] : 0
        const v2 = j < l2.length ? l2[j] : 0
        const oldCarry = carry
        const currentSum = v1 + v2 + carry
        carry = Math.floor(currentSum / 10)
        const digit = currentSum % 10

        result.push(digit)

        steps.push({
            step: steps.length,
            description: `Processing indices: L1[${i}], L2[${j}]`,
            state: {
                pointers: {
                    l1: i < l1.length ? i : null,
                    l2: j < l2.length ? j : null
                },
                customState: {
                    carry,
                    sum: currentSum,
                    digit,
                    additionContext: { v1, v2, oldCarry, newCarry: carry, sum: currentSum, digit }
                },
                result: [...result],
                phase: 'searching',
                explanation: `Adding ${v1} + ${v2} ${oldCarry > 0 ? '+ carry ' + oldCarry : ''} = ${currentSum}. Digit: ${digit}, Carry: ${carry}.`
            }
        })

        if (i < l1.length) i++
        if (j < l2.length) j++
    }

    steps.push({
        step: steps.length,
        description: "Addition complete.",
        state: {
            pointers: { l1: null, l2: null },
            customState: { carry: 0, sum: 0 },
            result: [...result],
            phase: 'found',
            explanation: "Successfully processed both lists and accounted for all carries."
        }
    })

    return steps
}

/**
 * ADD TWO NUMBERS: BRUTE FORCE (INT CONVERSION)
 * Educational comparison of the integer-based approach.
 */
export const generateAddTwoNumbersBrute = (l1: number[], l2: number[]): Step[] => {
    const steps: Step[] = []

    // Step 1: Convert L1 to Int
    let n1 = 0
    for (let i = 0; i < l1.length; i++) {
        n1 += l1[i] * Math.pow(10, i)
        steps.push({
            step: steps.length,
            description: `Converting L1 to integer...`,
            state: {
                pointers: { l1: i },
                customState: { n1 },
                phase: 'searching',
                explanation: `Current value: ${n1}. Adding ${l1[i]} * 10^${i}`
            }
        })
    }

    // Step 2: Convert L2 to Int
    let n2 = 0
    for (let j = 0; j < l2.length; j++) {
        n2 += l2[j] * Math.pow(10, j)
        steps.push({
            step: steps.length,
            description: `Converting L2 to integer...`,
            state: {
                pointers: { l2: j },
                customState: { n1, n2 },
                phase: 'searching',
                explanation: `Current value: ${n2}. Adding ${l2[j]} * 10^${j}`
            }
        })
    }

    const sum = n1 + n2
    steps.push({
        step: steps.length,
        description: "Adding integers.",
        state: {
            customState: { n1, n2, sum },
            phase: 'searching',
            explanation: `${n1} + ${n2} = ${sum}`
        }
    })

    // Step 3: Convert back to list
    const result: number[] = sum.toString().split('').map(Number).reverse()
    steps.push({
        step: steps.length,
        description: "Converting sum back to linked list.",
        state: {
            result: [...result],
            phase: 'found',
            explanation: `Result Integer ${sum} -> Reversed List ${JSON.stringify(result)}`
        }
    })

    return steps
}

/**
 * CONTAINER WITH MOST WATER: TWO POINTERS (O(N))
 */
export const generateContainerWithMostWater = (heights: number[]): Step[] => {
    const steps: Step[] = []
    let left = 0
    let right = heights.length - 1
    let maxArea = 0

    steps.push({
        step: 0,
        description: "Initialize pointers at both ends of the heights array.",
        state: {
            array: heights,
            pointers: { l: left, r: right },
            customState: { maxArea: 0, currentArea: 0 },
            explanation: "The area is limited by the shorter line and the distance between them. Starting with maximum width.",
            phase: 'init'
        }
    })

    while (left < right) {
        const hL = heights[left]
        const hR = heights[right]
        const width = right - left
        const h = Math.min(hL, hR)
        const area = width * h
        const isNewMax = area > maxArea
        if (isNewMax) maxArea = area

        steps.push({
            step: steps.length,
            description: `L=${left}, R=${right}. Width=${width}, Height=${h}. Area=${area}.`,
            state: {
                array: heights,
                pointers: { l: left, r: right },
                highlightIndices: [left, right],
                customState: { maxArea, currentArea: area, width, h, hL, hR },
                explanation: isNewMax
                    ? `Found NEW maximum area: ${area}! (${width} width * ${h} height)`
                    : `Current area ${area} is not greater than max ${maxArea}. Moving the pointer pointing to the shorter line.`,
                phase: 'searching'
            }
        })

        if (hL < hR) left++; else right--
    }

    steps.push({
        step: steps.length,
        description: `Max area found: ${maxArea}`,
        state: {
            array: heights,
            customState: { maxArea },
            explanation: `The maximum volume of water that can be contained between any two vertical lines is ${maxArea}.`,
            phase: 'found'
        }
    })

    return steps
}

/**
 * LONGEST PALINDROMIC SUBSTRING: EXPAND AROUND CENTER (O(N^2))
 */
export const generateLongestPalindromeExpand = (s: string): Step[] => {
    const steps: Step[] = []
    const chars = s.split('')
    let start = 0, end = 0

    const expand = (L: number, R: number) => {
        let left = L, right = R
        while (left >= 0 && right < s.length && s[left] === s[right]) {
            const currentSub = s.substring(left, right + 1)

            if (right - left > end - start) {
                start = left
                end = right
            }

            steps.push({
                step: steps.length,
                description: `Expanding around center... Current match: "${currentSub}"`,
                state: {
                    array: chars as any,
                    pointers: { l: left, r: right },
                    highlightIndices: Array.from({ length: right - left + 1 }, (_, k) => left + k),
                    explanation: `Characters at ${left} and ${right} ('${s[left]}') match. Palindrome confirmed.`,
                    phase: 'searching',
                    customState: {
                        currentSub,
                        longestSoFar: s.substring(start, end + 1),
                        centerIndex: L === R ? L : `${L}-${R}`
                    }
                }
            })
            left--
            right++
        }
    }

    for (let i = 0; i < s.length; i++) {
        // We skip very many intermediate frames for performance in the visualization
        expand(i, i)     // Odd
        expand(i, i + 1) // Even
    }

    steps.push({
        step: steps.length,
        description: `Longest Palindromic Substring identified: "${s.substring(start, end + 1)}"`,
        state: {
            array: chars as any,
            highlightIndices: Array.from({ length: end - start + 1 }, (_, k) => start + k),
            explanation: `Global maximum found after checking all centers. Length: ${end - start + 1}.`,
            phase: 'found',
            customState: { result: s.substring(start, end + 1) }
        }
    })

    return steps
}

/**
 * ZIGZAG CONVERSION: SIMULATION (O(N))
 */
export const generateZigzagSteps = (s: string, numRows: number): Step[] => {
    const steps: Step[] = []
    if (numRows === 1) return [{ step: 0, description: "Only 1 row, result is same as input.", state: { array: s.split('') as any, phase: 'found', explanation: s } }]

    const rows: string[] = Array(numRows).fill('')
    let currRow = 0
    let goingDown = false
    const chars = s.split('')

    steps.push({
        step: 0,
        description: `Starting Zigzag Conversion into ${numRows} rows.`,
        state: {
            array: chars as any,
            pointers: { i: 0 },
            customState: { rows: [...rows], currRow, goingDown },
            explanation: "Initializing rows and setting direction to start at row 0.",
            phase: 'init'
        }
    })

    for (let i = 0; i < s.length; i++) {
        rows[currRow] += s[i]

        steps.push({
            step: steps.length,
            description: `Placing '${s[i]}' into row ${currRow}.`,
            state: {
                array: chars as any,
                pointers: { i },
                customState: { rows: [...rows], currRow, goingDown },
                explanation: `Next character will move ${goingDown ? 'down' : 'up'}.`,
                phase: 'searching'
            }
        })

        if (currRow === 0 || currRow === numRows - 1) goingDown = !goingDown
        currRow += goingDown ? 1 : -1
    }

    const result = rows.join('')
    steps.push({
        step: steps.length,
        description: "Zigzag simulation complete.",
        state: {
            array: chars as any,
            customState: { rows: [...rows], finalResult: result },
            explanation: `Result read row-by-row: ${result}`,
            phase: 'found'
        }
    })

    return steps
}

/**
 * REVERSE INTEGER: MATH (O(log N))
 */
export const generateReverseInteger = (x: number): Step[] => {
    const steps: Step[] = []
    let rev = 0
    const tempX = Math.abs(x)
    const sign = x < 0 ? -1 : 1
    const digits = tempX.toString().split('').map(Number)

    steps.push({
        step: 0,
        description: `Starting reversal of ${x}.`,
        state: {
            array: digits,
            pointers: { i: digits.length - 1 },
            customState: { rev: 0, sign },
            explanation: "Extracting digits from right to left using modulo 10.",
            phase: 'init'
        }
    })

    for (let i = digits.length - 1; i >= 0; i--) {
        const pop = digits[i]
        rev = rev * 10 + pop

        steps.push({
            step: steps.length,
            description: `Popped ${pop}. Current: ${rev * sign}`,
            state: {
                array: digits,
                pointers: { i },
                customState: { rev: rev * sign, pop },
                explanation: `Multiplied ${Math.floor(rev / 10)} by 10 and added ${pop}.`,
                phase: 'searching'
            }
        })
    }

    steps.push({
        step: steps.length,
        description: `Reversal complete: ${rev * sign}`,
        state: {
            customState: { result: rev * sign },
            phase: 'found',
            explanation: "Successfully reversed all digits."
        }
    })

    return steps
}

/**
 * PALINDROME NUMBER: MATH (O(log N))
 */
export const generatePalindromeNumber = (x: number): Step[] => {
    const steps: Step[] = []
    if (x < 0) return [{ step: 0, description: "Negative numbers are never palindromes.", state: { phase: 'not_found', explanation: "Sign '-' makes it asymmetrical." } }]

    const digits = x.toString().split('').map(Number)
    let left = 0
    let right = digits.length - 1

    steps.push({
        step: 0,
        description: `Checking if ${x} is a palindrome.`,
        state: {
            array: digits,
            pointers: { l: left, r: right },
            explanation: "Comparing digits from both ends moving inward.",
            phase: 'init'
        }
    })

    while (left < right) {
        const match = digits[left] === digits[right]
        steps.push({
            step: steps.length,
            description: `Comparing digits at ${left} and ${right} (${digits[left]} vs ${digits[right]})`,
            state: {
                array: digits,
                pointers: { l: left, r: right },
                highlightIndices: [left, right],
                explanation: match ? "Digits match!" : "Mismatch found! Not a palindrome.",
                phase: match ? 'searching' : 'not_found'
            }
        })
        if (!match) return steps
        left++
        right--
    }

    steps.push({
        step: steps.length,
        description: "Confirmed: It is a palindrome.",
        state: {
            array: digits,
            phase: 'found',
            explanation: "All pairs matched."
        }
    })

    return steps
}

/**
 * STRING TO INTEGER (atoi): SCAN (O(N))
 */
export const generateAtoI = (s: string): Step[] => {
    const steps: Step[] = []
    const chars = s.split('')
    let i = 0
    let sign = 1
    let res = 0

    steps.push({
        step: 0,
        description: "Starting string to integer conversion (atoi).",
        state: { array: chars as any, pointers: { i: 0 }, explanation: "Skipping leading whitespace if any.", phase: 'init' }
    })

    // Skip whitespace
    while (i < s.length && s[i] === ' ') {
        i++
        steps.push({
            step: steps.length,
            description: "Skipping whitespace...",
            state: { array: chars as any, pointers: { i }, explanation: "Discarding leading space character.", phase: 'searching' }
        })
    }

    // Check sign
    if (i < s.length && (s[i] === '+' || s[i] === '-')) {
        sign = s[i] === '-' ? -1 : 1
        steps.push({
            step: steps.length,
            description: `Detected sign: ${s[i]}`,
            state: { array: chars as any, pointers: { i }, customState: { sign }, explanation: `Sign set to ${sign}. Moving to digits.`, phase: 'searching' }
        })
        i++
    }

    // Convert digits
    while (i < s.length && /[0-9]/.test(s[i])) {
        const digit = parseInt(s[i])
        res = res * 10 + digit
        steps.push({
            step: steps.length,
            description: `Processing digit: ${s[i]}`,
            state: {
                array: chars as any,
                pointers: { i },
                customState: { currentRes: res * sign },
                highlightIndices: [i],
                explanation: `Accumulated ${digit}. New total: ${res * sign}`,
                phase: 'searching'
            }
        })
        i++
    }

    steps.push({
        step: steps.length,
        description: "Reached non-digit or end of string. Conversion complete.",
        state: {
            array: chars as any,
            customState: { finalResult: res * sign },
            explanation: `Final parsed integer: ${res * sign}`,
            phase: 'found'
        }
    })

    return steps
}

/**
 * 3SUM: TWO POINTERS (O(N^2))
 */
export const generate3Sum = (nums: number[], target: number = 0): Step[] => {
    const steps: Step[] = []
    const sortedNums = [...nums].sort((a, b) => a - b)
    const result: number[][] = []

    steps.push({
        step: 0,
        description: "Starting 3Sum. Sorting array first.",
        state: {
            array: sortedNums,
            explanation: "Sorted the array to use Two Pointers for the inner loop.",
            phase: 'init'
        }
    })

    for (let i = 0; i < sortedNums.length - 2; i++) {
        if (i > 0 && sortedNums[i] === sortedNums[i - 1]) continue

        let left = i + 1
        let right = sortedNums.length - 1

        while (left < right) {
            const sum = sortedNums[i] + sortedNums[left] + sortedNums[right]
            const isMatch = sum === target

            steps.push({
                step: steps.length,
                description: `Fixed i=${i} (${sortedNums[i]}). Checking L=${left}, R=${right}. Sum=${sum}`,
                state: {
                    array: sortedNums,
                    pointers: { i, l: left, r: right },
                    highlightIndices: [i, left, right],
                    customState: { currentSum: sum, target, tripletsFound: result.length },
                    explanation: isMatch
                        ? `Match found! [${sortedNums[i]}, ${sortedNums[left]}, ${sortedNums[right]}] sums to ${target}.`
                        : (sum < target ? `Sum ${sum} < ${target}. Moving Left pointer.` : `Sum ${sum} > ${target}. Moving Right pointer.`),
                    phase: isMatch ? 'found' : 'searching'
                }
            })

            if (isMatch) {
                result.push([sortedNums[i], sortedNums[left], sortedNums[right]])
                while (left < right && sortedNums[left] === sortedNums[left + 1]) left++
                while (left < right && sortedNums[right] === sortedNums[right - 1]) right--
                left++
                right--
            } else if (sum < target) {
                left++
            } else {
                right--
            }
        }
    }

    steps.push({
        step: steps.length,
        description: "3Sum search complete.",
        state: {
            array: sortedNums,
            customState: { finalTriplets: result },
            explanation: `Found ${result.length} unique triplets that sum to ${target}.`,
            phase: 'found'
        }
    })

    return steps
}

/**
 * VALID PARENTHESES: STACK (O(N))
 */
export const generateValidParentheses = (s: string): Step[] => {
    const steps: Step[] = []
    const stack: string[] = []
    const map: Record<string, string> = { ')': '(', '}': '{', ']': '[' }
    const chars = s.split('')

    steps.push({
        step: 0,
        description: "Starting Valid Parentheses check using a Stack.",
        state: { array: chars as any, pointers: { i: 0 }, stack: [], explanation: "Initializing empty stack.", phase: 'init' }
    })

    for (let i = 0; i < s.length; i++) {
        const char = s[i]
        const isClosing = map[char] !== undefined

        if (isClosing) {
            const top = stack.pop()
            const isMatch = top === map[char]

            steps.push({
                step: steps.length,
                description: `Closing bracket '${char}' detected. Popped '${top}' from stack.`,
                state: {
                    array: chars as any,
                    pointers: { i },
                    stack: [...stack],
                    highlightIndices: [i],
                    explanation: isMatch
                        ? `Matches! '${top}' is the opening bracket for '${char}'.`
                        : `Mismatch! Expected '${map[char]}' but found '${top}'.`,
                    phase: isMatch ? 'searching' : 'not_found'
                }
            })

            if (!isMatch) return steps
        } else {
            stack.push(char)
            steps.push({
                step: steps.length,
                description: `Opening bracket '${char}' detected. Pushing to stack.`,
                state: {
                    array: chars as any,
                    pointers: { i },
                    stack: [...stack],
                    highlightIndices: [i],
                    explanation: `Stored '${char}' on stack to match later.`,
                    phase: 'searching'
                }
            })
        }
    }

    const isValid = stack.length === 0
    steps.push({
        step: steps.length,
        description: isValid ? "All brackets matched correctly." : "Wait, some brackets were never closed.",
        state: {
            array: chars as any,
            stack: [...stack],
            explanation: isValid ? "Stack is empty. Balanced!" : `Stack still contains: ${stack.join(', ')}. Unbalanced!`,
            phase: isValid ? 'found' : 'not_found'
        }
    })

    return steps
}

/**
 * MERGE TWO SORTED LISTS: TWO POINTERS (O(N+M))
 */
export const generateMergeTwoSortedLists = (l1: number[], l2: number[]): Step[] => {
    const steps: Step[] = []
    const result: number[] = []
    let i = 0
    let j = 0

    steps.push({
        step: 0,
        description: "Starting Merge of two sorted lists.",
        state: {
            pointers: { i: 0, j: 0 },
            result: [],
            explanation: "Comparing elements at the head of both lists.",
            phase: 'init'
        }
    })

    while (i < l1.length && j < l2.length) {
        const v1 = l1[i]
        const v2 = l2[j]
        const fromL1 = v1 <= v2

        if (fromL1) {
            result.push(v1)
        } else {
            result.push(v2)
        }

        steps.push({
            step: steps.length,
            description: `Comparing ${v1} (L1) and ${v2} (L2).`,
            state: {
                pointers: { i, j },
                result: [...result],
                explanation: fromL1
                    ? `${v1} <= ${v2}. Appending ${v1} from List 1.`
                    : `${v2} < ${v1}. Appending ${v2} from List 2.`,
                phase: 'searching'
            }
        })

        if (fromL1) i++; else j++
    }

    // Append remaining
    while (i < l1.length) {
        result.push(l1[i])
        steps.push({
            step: steps.length,
            description: "List 2 exhausted. Appending remainder of List 1.",
            state: { pointers: { i, j: null }, result: [...result], phase: 'searching', explanation: `Appending ${l1[i]}.` }
        })
        i++
    }

    while (j < l2.length) {
        result.push(l2[j])
        steps.push({
            step: steps.length,
            description: "List 1 exhausted. Appending remainder of List 2.",
            state: { pointers: { i: null, j }, result: [...result], phase: 'searching', explanation: `Appending ${l2[j]}.` }
        })
        j++
    }

    steps.push({
        step: steps.length,
        description: "Merge complete.",
        state: { result: [...result], phase: 'found', explanation: "Fused both lists into a single sorted sequence." }
    })

    return steps
}

/**
 * VALID PALINDROME: TWO POINTERS (O(N))
 */
export const generateValidPalindrome = (s: string): Step[] => {
    const steps: Step[] = []
    const cleanS = s.toLowerCase().replace(/[^a-z0-9]/g, '')
    const chars = cleanS.split('')
    let left = 0
    let right = chars.length - 1

    steps.push({
        step: 0,
        description: "Starting Valid Palindrome check.",
        state: { array: chars as any, pointers: { l: 0, r: chars.length - 1 }, explanation: `Cleaned string: "${cleanS}"`, phase: 'init' }
    })

    while (left < right) {
        const match = chars[left] === chars[right]
        steps.push({
            step: steps.length,
            description: `Comparing '${chars[left]}' and '${chars[right]}'.`,
            state: {
                array: chars as any,
                pointers: { l: left, r: right },
                highlightIndices: [left, right],
                explanation: match ? "Characters match!" : "Mismatch! Not a palindrome.",
                phase: match ? 'searching' : 'not_found'
            }
        })
        if (!match) return steps
        left++; right--
    }

    steps.push({
        step: steps.length,
        description: "Confirmed: It is a palindrome.",
        state: { array: chars as any, phase: 'found', explanation: "Passed all symmetry checks." }
    })
    return steps
}

/**
 * MOVE ZEROES: TWO POINTERS (O(N))
 */
export const generateMoveZeroes = (nums: number[]): Step[] => {
    const steps: Step[] = []
    const currentNums = [...nums]
    let lastNonZero = 0

    steps.push({
        step: 0,
        description: "Starting Move Zeroes. Pushing non-zero elements to front.",
        state: { array: [...currentNums], pointers: { lastNonZero: 0, i: 0 }, explanation: "Initializing write pointer (lastNonZero) at index 0.", phase: 'init' }
    })

    for (let i = 0; i < currentNums.length; i++) {
        const isZero = currentNums[i] === 0
        steps.push({
            step: steps.length,
            description: `Checking index ${i} (value: ${currentNums[i]}).`,
            state: {
                array: [...currentNums],
                pointers: { lastNonZero, i },
                highlightIndices: [i, lastNonZero],
                explanation: isZero ? "Value is zero. Skipping." : `Non-zero value found. Swapping with lastNonZero index ${lastNonZero}.`,
                phase: 'searching'
            }
        })

        if (!isZero) {
            [currentNums[lastNonZero], currentNums[i]] = [currentNums[i], currentNums[lastNonZero]]
            lastNonZero++
        }
    }

    steps.push({
        step: steps.length,
        description: "All non-zero elements shifted. Zeroes are now at the end.",
        state: { array: [...currentNums], phase: 'found', explanation: "Stable mutation complete." }
    })
    return steps
}

/**
 * SEARCH IN ROTATED SORTED ARRAY: BINARY SEARCH (O(log N))
 */
export const generateSearchInRotatedArray = (nums: number[], target: number): Step[] => {
    const steps: Step[] = []
    let left = 0
    let right = nums.length - 1

    steps.push({
        step: 0,
        description: "Starting Search in Rotated Sorted Array.",
        state: { array: nums as any, pointers: { l: 0, r: nums.length - 1 }, explanation: "Initializing search boundaries.", phase: 'init' }
    })

    while (left <= right) {
        const mid = Math.floor((left + right) / 2)
        steps.push({
            step: steps.length,
            description: `Checking mid point index ${mid} (value: ${nums[mid]}).`,
            state: {
                array: nums as any,
                pointers: { l: left, r: right, mid },
                highlightIndices: [mid],
                explanation: nums[mid] === target ? "Target found!" : `Mid is ${nums[mid]}. Checking sorted half.`,
                phase: nums[mid] === target ? 'found' : 'searching'
            }
        })

        if (nums[mid] === target) return steps

        // Left half is sorted
        if (nums[left] <= nums[mid]) {
            if (nums[left] <= target && target < nums[mid]) {
                right = mid - 1
            } else {
                left = mid + 1
            }
        } else {
            // Right half is sorted
            if (nums[mid] < target && target <= nums[right]) {
                left = mid + 1
            } else {
                right = mid - 1
            }
        }
    }

    steps.push({
        step: steps.length,
        description: "Target not found in array.",
        state: { array: nums as any, phase: 'not_found', explanation: "Search space exhausted." }
    })
    return steps
}

/**
 * ROTATE IMAGE: MATRIX TRANSFORMATION (O(N^2))
 */
export const generateRotateImage = (matrix: number[][]): Step[] => {
    const steps: Step[] = []
    const n = matrix.length
    const currentMatrix = matrix.map(row => [...row])

    steps.push({
        step: 0,
        description: "Starting Matrix Rotation (90deg Clockwise).",
        state: { matrix: currentMatrix.map(row => [...row]), explanation: "Transpose and then Reverse each row.", phase: 'init' }
    })

    // Transpose
    for (let i = 0; i < n; i++) {
        for (let j = i; j < n; j++) {
            [currentMatrix[i][j], currentMatrix[j][i]] = [currentMatrix[j][i], currentMatrix[i][j]]
            steps.push({
                step: steps.length,
                description: `Transposing element at (${i},${j}).`,
                state: {
                    matrix: currentMatrix.map(row => [...row]),
                    highlightIndices: [[i, j], [j, i]],
                    explanation: "Swapping elements across the main diagonal.",
                    phase: 'searching'
                }
            })
        }
    }

    // Reverse rows
    for (let i = 0; i < n; i++) {
        currentMatrix[i].reverse()
        steps.push({
            step: steps.length,
            description: `Reversing row ${i}.`,
            state: {
                matrix: currentMatrix.map(row => [...row]),
                highlightIndices: [[i, 0], [i, n - 1]],
                explanation: "Flipping the row horizontally completes the rotation.",
                phase: 'searching'
            }
        })
    }

    steps.push({
        step: steps.length,
        description: "Matrix rotation complete.",
        state: { matrix: currentMatrix.map(row => [...row]), phase: 'found', explanation: "90-degree clockwise rotation achieved." }
    })
    return steps
}

/**
 * MEDIAN OF TWO SORTED ARRAYS: BINARY SEARCH (O(log min(N,M)))
 */
export const generateMedianTwoSortedArrays = (nums1: number[], nums2: number[]): Step[] => {
    const steps: Step[] = []
    // Ensure nums1 is shorter
    if (nums1.length > nums2.length) return generateMedianTwoSortedArrays(nums2, nums1)

    const m = nums1.length
    const n = nums2.length
    let left = 0
    let right = m

    steps.push({
        step: 0,
        description: "Starting Median Search using combined partition.",
        state: {
            array1: nums1,
            array2: nums2,
            pointers: { l: 0, r: m },
            explanation: "Searching for partition in the shorter array.",
            phase: 'init'
        }
    })

    while (left <= right) {
        const i = Math.floor((left + right) / 2)
        const j = Math.floor((m + n + 1) / 2) - i

        steps.push({
            step: steps.length,
            description: `Checking partitions i=${i}, j=${j}.`,
            state: {
                array1: nums1,
                array2: nums2,
                pointers: { i, j },
                explanation: `Partition X at ${i}, Partition Y at ${j}. Checking boundaries.`,
                phase: 'searching'
            }
        })

        const maxLeft1 = (i === 0) ? -Infinity : nums1[i - 1]
        const minRight1 = (i === m) ? Infinity : nums1[i]
        const maxLeft2 = (j === 0) ? -Infinity : nums2[j - 1]
        const minRight2 = (j === n) ? Infinity : nums2[j]

        if (maxLeft1 <= minRight2 && maxLeft2 <= minRight1) {
            steps.push({
                step: steps.length,
                description: "Correct partition found!",
                state: {
                    array1: nums1,
                    array2: nums2,
                    pointers: { i, j },
                    calculation: (m + n) % 2 === 0
                        ? `(max(${maxLeft1}, ${maxLeft2}) + min(${minRight1}, ${minRight2})) / 2`
                        : `max(${maxLeft1}, ${maxLeft2})`,
                    phase: 'found'
                }
            })
            return steps
        } else if (maxLeft1 > minRight2) {
            right = i - 1
        } else {
            left = i + 1
        }
    }

    return steps
}

/**
 * GROUP ANAGRAMS: HASH MAP (O(N * K log K))
 */
export const generateGroupAnagrams = (strs: string[]): Step[] => {
    const steps: Step[] = []
    const map: Record<string, string[]> = {}

    steps.push({
        step: 0,
        description: "Categorizing strings by their character frequency.",
        state: { array: strs, mapState: {}, explanation: "Starting anagram grouping.", phase: 'init' }
    })

    for (let i = 0; i < strs.length; i++) {
        const s = strs[i]
        const sorted = s.split('').sort().join('')
        if (!map[sorted]) map[sorted] = []
        map[sorted].push(s)

        steps.push({
            step: steps.length,
            description: `Processing "${s}".`,
            state: {
                array: strs,
                pointers: { i },
                mapState: JSON.parse(JSON.stringify(map)),
                explanation: `"${s}" sorted is "${sorted}". Adding to group.`,
                phase: 'searching'
            }
        })
    }

    steps.push({
        step: steps.length,
        description: "Groups finalized.",
        state: { array: strs, mapState: JSON.parse(JSON.stringify(map)), phase: 'found', explanation: "Grouping complete." }
    })
    return steps
}

/**
 * PERMUTATIONS: BACKTRACKING (O(N!))
 */
export const generatePermutations = (nums: number[]): Step[] => {
    const steps: Step[] = []
    const results: number[][] = []

    steps.push({
        step: 0,
        description: "Starting Backtracking for Permutations.",
        state: { array: nums, explanation: "Exploring all possible linear orderings.", phase: 'init' }
    })

    const backtrack = (curr: number[], remaining: number[]) => {
        steps.push({
            step: steps.length,
            description: `Current Permutation: [${curr.join(',')}]`,
            state: {
                array: nums,
                customState: { curr, remaining },
                explanation: remaining.length === 0 ? "Found a complete permutation!" : `Next candidates: ${remaining.join(', ')}`,
                phase: remaining.length === 0 ? 'found' : 'searching'
            }
        })

        if (remaining.length === 0) {
            results.push([...curr])
            return
        }

        for (let i = 0; i < remaining.length; i++) {
            const next = remaining[i]
            const newRemaining = remaining.filter((_, idx) => idx !== i)
            backtrack([...curr, next], newRemaining)

            steps.push({
                step: steps.length,
                description: `Backtracking from [${[...curr, next].join(',')}]`,
                state: {
                    array: nums,
                    customState: { curr, remaining },
                    explanation: `Finished exploring branch with ${next}. Returning to previous state.`,
                    phase: 'searching'
                }
            })
        }
    }

    backtrack([], nums)

    steps.push({
        step: steps.length,
        description: "All permutations generated.",
        state: { array: nums, finalAnswer: results, phase: 'found', explanation: `Total Permutations: ${results.length}` }
    })
    return steps
}

/**
 * REGULAR EXPRESSION MATCHING: DP (O(N*M))
 */
export const generateRegExpMatching = (s: string, p: string): Step[] => {
    const steps: Step[] = []
    const m = s.length
    const n = p.length
    const dp: any[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(false))

    // Base case
    dp[0][0] = true
    steps.push({
        step: 0,
        description: "Initializing DP table for Regex Matching.",
        state: { matrix: dp.map(row => [...row]), explanation: "dp[0][0] = true (empty matches empty).", phase: 'init' }
    })

    for (let j = 2; j <= n; j++) {
        if (p[j - 1] === '*') {
            dp[0][j] = dp[0][j - 2]
            steps.push({
                step: steps.length,
                description: `Handling '*' in pattern at index ${j - 1}.`,
                state: { matrix: dp.map(row => [...row]), highlightIndices: [[0, j]], explanation: `dp[0][${j}] = dp[0][${j - 2}]`, phase: 'searching' }
            })
        }
    }

    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (p[j - 1] === s[i - 1] || p[j - 1] === '.') {
                dp[i][j] = dp[i - 1][j - 1]
            } else if (p[j - 1] === '*') {
                dp[i][j] = dp[i][j - 2]
                if (p[j - 2] === s[i - 1] || p[j - 2] === '.') {
                    dp[i][j] = dp[i][j] || dp[i - 1][j]
                }
            }
            steps.push({
                step: steps.length,
                description: `Comparing s[${i - 1}]='${s[i - 1]}' and p[${j - 1}]='${p[j - 1]}'.`,
                state: {
                    matrix: dp.map(row => [...row]),
                    highlightIndices: [[i, j]],
                    explanation: `Cell (${i},${j}) is ${dp[i][j] ? 'MATCH' : 'NO MATCH'}`,
                    phase: 'searching'
                }
            })
        }
    }

    steps.push({
        step: steps.length,
        description: dp[m][n] ? "String matches Pattern!" : "No match found.",
        state: { matrix: dp.map(row => [...row]), phase: dp[m][n] ? 'found' : 'not_found', explanation: "DP complete." }
    })
    return steps
}

export const generateFallbackSteps = (items: any[]): Step[] => {
    return items.map((_, i) => ({
        step: i,
        description: `Processing element at index ${i}...`,
        state: {
            array: Array.isArray(items) ? (typeof items[0] === 'object' ? [] : items) : [],
            pointers: { curr: i },
            explanation: `Phase: Analyze element at index ${i}.`
        }
    }))
}
