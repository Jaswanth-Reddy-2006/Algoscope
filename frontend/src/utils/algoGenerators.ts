import { Step, RecursionNode } from '../types'

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
export const generateTwoSumBrute = (nums: number[] = [], target: number = 0): Step[] => {
    const steps: Step[] = []
    if (!nums || nums.length === 0) return []

    // 0. Initial State
    steps.push({
        step: 0,
        description: `Initializing Brute Force approach. Searching for two numbers that sum to ${target}.`,
        state: {
            array: nums,
            pointers: {},
            explanation: `We will iterate through each possible pair of numbers in the array to find a sum equal to ${target}.`,
            phase: 'init',
            customState: { target }
        }
    })

    for (let i = 0; i < nums.length; i++) {
        for (let j = i + 1; j < nums.length; j++) {
            const currentSum = nums[i] + nums[j]
            const isMatch = currentSum === target

            steps.push({
                step: steps.length,
                description: `Comparing nums[${i}] (${nums[i]}) and nums[${j}] (${nums[j]}). Sum = ${currentSum}.`,
                state: {
                    array: nums,
                    pointers: { i, j },
                    calculation: `${nums[i]} + ${nums[j]} = ${currentSum}`,
                    explanation: isMatch
                        ? `Match found! ${nums[i]} + ${nums[j]} = ${target}`
                        : `${currentSum} !== ${target}. Shifting search.`,
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
        description: "Exhausted all possible pairs. No solution exists.",
        state: {
            array: nums,
            explanation: "No two numbers in the input array sum up to the target value.",
            phase: 'not_found'
        }
    })
    return steps
}

/**
 * TWO SUM: OPTIMAL HASHMAP (O(N))
 */
export const generateTwoSumHashMap = (nums: number[] = [], target: number = 0): Step[] => {
    const steps: Step[] = []
    if (!nums || nums.length === 0) return []
    const map: Record<number, number> = {}

    // 0. Initial State
    steps.push({
        step: 0,
        description: `Initializing Optimal Hash Map approach for target ${target}.`,
        state: {
            array: nums,
            pointers: {},
            hashTable: {},
            explanation: `We will track seen numbers in a Hash Map for O(1) lookups of the complement (target - num).`,
            phase: 'init',
            customState: { target }
        }
    })

    for (let i = 0; i < nums.length; i++) {
        const val = nums[i]
        const complement = target - val
        const complementIdx = map[complement]
        const isMatch = complementIdx !== undefined

        steps.push({
            step: steps.length,
            description: `Current number: ${val}. Checking if complement ${complement} exists in map.`,
            state: {
                array: nums,
                pointers: { i },
                hashTable: { ...map },
                calculation: `${target} - ${val} = ${complement}`,
                explanation: isMatch
                    ? `Complement ${complement} found at index ${complementIdx}! Perfect pair.`
                    : `${complement} not found in map. Mapping ${val} to index ${i} for future lookup.`,
                phase: isMatch ? 'found' : 'searching',
                highlightIndices: isMatch ? [complementIdx, i] : [i],
                finalAnswer: isMatch ? [complementIdx, i] : undefined,
                customState: { complement, target }
            }
        })

        if (isMatch) return steps
        map[val] = i
    }

    steps.push({
        step: steps.length,
        description: "Traversal complete. No valid pair identified.",
        state: {
            array: nums,
            hashTable: { ...map },
            explanation: "Processed all elements without finding a matching pair.",
            phase: 'not_found'
        }
    })

    return steps
}

/**
 * LONGEST SUBSTRING WITHOUT REPEATING CHARACTERS: BRUTE FORCE (O(N^2))
 */
export const generateLongestSubstringBrute = (input: any): Step[] => {
    const s = typeof input === 'object' ? input.s || "" : String(input);
    const steps: Step[] = [];
    if (!s) return [];
    const n = s.length;
    let maxLen = 0;
    let bestStart = 0;
    let bestEnd = 0;

    steps.push({
        step: 0,
        description: "Initializing Brute Force search for longest unique substring.",
        state: {
            string: s,
            explanation: "We will check every possible substring to see if it contains repeating characters.",
            phase: 'init',
            customState: { maxLen: 0 }
        }
    });

    for (let i = 0; i < n; i++) {
        const seen = new Set();
        for (let j = i; j < n; j++) {
            const char = s[j];
            if (seen.has(char)) {
                steps.push({
                    step: steps.length,
                    description: `Duplicate '${char}' found at index ${j}.`,
                    state: {
                        string: s,
                        pointers: { i, j },
                        highlightIndices: Array.from({ length: j - i + 1 }, (_, k) => i + k),
                        explanation: `Substring "${s.substring(i, j + 1)}" contains duplicate characters. Breaking.`,
                        phase: 'searching',
                        customState: { maxLen, duplicateChar: char }
                    }
                });
                break;
            }
            seen.add(char);
            const currentLen = j - i + 1;
            const isNewMax = currentLen > maxLen;
            if (isNewMax) {
                maxLen = currentLen;
                bestStart = i;
                bestEnd = j;
            }

            steps.push({
                step: steps.length,
                description: `Checking unique substring: "${s.substring(i, j + 1)}"`,
                state: {
                    string: s,
                    pointers: { i, j },
                    highlightIndices: Array.from({ length: j - i + 1 }, (_, k) => i + k),
                    explanation: isNewMax 
                        ? `New record! "${s.substring(i, j + 1)}" has length ${currentLen}.` 
                        : `"${s.substring(i, j + 1)}" is unique. Current max: ${maxLen}`,
                    phase: 'searching',
                    customState: { maxLen, currentLen }
                }
            });
        }
    }

    steps.push({
        step: steps.length,
        description: "Search complete.",
        state: {
            string: s,
            windowRange: [bestStart, bestEnd],
            finalAnswer: maxLen,
            explanation: `The longest unique substring is "${s.substring(bestStart, bestEnd + 1)}" with length ${maxLen}.`,
            phase: 'found'
        }
    });

    return steps;
};

/**
 * LONGEST SUBSTRING WITHOUT REPEATING CHARACTERS: OPTIMAL SLIDING WINDOW (O(N))
 */
export const generateLongestSubstringOptimal = (input: any): Step[] => {
    const s = typeof input === 'object' ? input.s || "" : String(input);
    const steps: Step[] = [];
    if (!s) return [];
    
    const n = s.length;
    let maxLen = 0;
    let left = 0;
    const map: Record<string, number> = {};
    let bestStart = 0;
    let bestEnd = 0;

    steps.push({
        step: 0,
        description: "Initializing Optimal Sliding Window search.",
        state: {
            string: s,
            hashTable: {},
            explanation: "We'll use two pointers (left, right) to create a window and a map to store the last seen index of each character.",
            phase: 'init',
            customState: { maxLen: 0 }
        }
    });

    for (let right = 0; right < n; right++) {
        const char = s[right];
        
        // If char is in map and within window
        if (map[char] !== undefined && map[char] >= left) {
            const oldLeft = left;
            left = map[char] + 1;
            
            steps.push({
                step: steps.length,
                description: `Duplicate '${char}' detected! Shrinking window.`,
                state: {
                    string: s,
                    pointers: { left, right },
                    hashTable: { ...map },
                    calculation: `left = map['${char}'] + 1 = ${left}`,
                    explanation: `Found ${char} again. Moving 'left' pointer from ${oldLeft} to ${left} to exclude the previous occurrence.`,
                    phase: 'searching',
                    customState: { maxLen, duplicateChar: char }
                }
            });
        }

        map[char] = right;
        const currentLen = right - left + 1;
        const isNewMax = currentLen > maxLen;
        if (isNewMax) {
            maxLen = currentLen;
            bestStart = left;
            bestEnd = right;
        }

        steps.push({
            step: steps.length,
            description: `Extending window to "${s.substring(left, right + 1)}"`,
            state: {
                string: s,
                pointers: { left, right },
                hashTable: { ...map },
                calculation: `Length: ${right} - ${left} + 1 = ${currentLen}`,
                explanation: isNewMax 
                    ? `New max length found: ${currentLen}` 
                    : `Window unique. Current record: ${maxLen}`,
                phase: 'searching',
                customState: { maxLen, currentLen }
            }
        });
    }

    steps.push({
        step: steps.length,
        description: "Optimal traversal complete.",
        state: {
            string: s,
            hashTable: { ...map },
            windowRange: [bestStart, bestEnd],
            finalAnswer: maxLen,
            explanation: `Longest substring is "${s.substring(bestStart, bestEnd + 1)}" with length ${maxLen}.`,
            phase: 'found'
        }
    });

    return steps;
};

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
        description: "Initializing parallel addition (Least Significant Digit first).",
        state: {
            pointers: { l1: 0, l2: 0 },
            customState: { carry: 0, sum: 0 },
            result: [],
            phase: 'init',
            explanation: "Numbers are stored in reverse (LSD at head). We start addition from the front of both lists, exactly like standard math."
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
            description: `Adding digits: ${v1} + ${v2} (Previous Carry: ${oldCarry})`,
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
            finalAnswer: result,
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
            finalAnswer: maxArea,
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
            finalAnswer: true,
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

    const MAX_INT = 2147483647;
    const MIN_INT = -2147483648;

    // Convert digits
    while (i < s.length && /[0-9]/.test(s[i])) {
        const digit = parseInt(s[i])

        // Check for overflow before adding digit
        if (sign === 1 && (res > MAX_INT / 10 || (res === MAX_INT / 10 && digit > 7))) {
            res = MAX_INT;
            break;
        }
        if (sign === -1 && (res > Math.abs(MIN_INT / 10) || (res === Math.abs(MIN_INT / 10) && digit > 8))) {
            res = Math.abs(MIN_INT);
            break;
        }

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

    const finalResult = res * sign;

    steps.push({
        step: steps.length,
        description: "Reached non-digit or end of string. Conversion complete.",
        state: {
            array: chars as any,
            finalAnswer: finalResult,
            customState: { finalResult: finalResult },
            explanation: `Final parsed integer: ${finalResult}`,
            phase: 'found'
        }
    })

    return steps
}

/**
 * 3SUM: BRUTE FORCE (O(N^3))
 */
export const generate3SumBrute = (nums: number[], target: number = 0): Step[] => {
    const steps: Step[] = []
    const results: number[][] = []
    const n = nums.length

    steps.push({
        step: 0,
        description: "Starting 3Sum Brute Force. Checking all possible triplets.",
        state: { array: nums, explanation: "Iterating through i, j, k indices to find sums equal to target.", phase: 'init' }
    })

    for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
            for (let k = j + 1; k < n; k++) {
                const sum = nums[i] + nums[j] + nums[k]
                const isMatch = sum === target
                
                steps.push({
                    step: steps.length,
                    description: `Checking indexes [${i}, ${j}, ${k}]: ${nums[i]} + ${nums[j]} + ${nums[k]} = ${sum}`,
                    state: {
                        array: nums,
                        pointers: { i, j, k },
                        highlightIndices: [i, j, k],
                        customState: { currentSum: sum, target },
                        explanation: isMatch ? "Match found!" : `Sum ${sum} is not ${target}.`,
                        phase: isMatch ? 'found' : 'searching'
                    }
                })
                
                if (isMatch) {
                    const triplet = [nums[i], nums[j], nums[k]].sort((a,b) => a-b)
                    if (!results.some(r => r[0] === triplet[0] && r[1] === triplet[1] && r[2] === triplet[2])) {
                        results.push(triplet)
                    }
                }
            }
        }
    }

    steps.push({
        step: steps.length,
        description: "3Sum Brute Force complete.",
        state: { array: nums, finalAnswer: results, phase: 'found', explanation: `Found ${results.length} unique triplets.` }
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
            phase: 'found',
            finalAnswer: result
        }
    })

    return steps
}

/**
 * 3SUM CLOSEST: TWO POINTERS (O(N^2))
 */
export const generate3SumClosest = (nums: number[], target: number): Step[] => {
    const steps: Step[] = []
    const sortedNums = [...nums].sort((a, b) => a - b)
    let closestSum = Infinity

    steps.push({
        step: 0,
        description: "Starting 3Sum Closest. Sorting array first.",
        state: {
            array: sortedNums,
            explanation: "Sorted array for Two Pointers.",
            phase: 'init'
        }
    })

    if (nums.length < 3) return steps

    for (let i = 0; i < sortedNums.length - 2; i++) {
        let left = i + 1
        let right = sortedNums.length - 1

        while (left < right) {
            const sum = sortedNums[i] + sortedNums[left] + sortedNums[right]
            if (Math.abs(target - sum) < Math.abs(target - closestSum)) {
                closestSum = sum
            }

            steps.push({
                step: steps.length,
                description: `Fixed i=${i}. Checking L=${left}, R=${right}. Sum=${sum}`,
                state: {
                    array: sortedNums,
                    pointers: { i, l: left, r: right },
                    highlightIndices: [i, left, right],
                    customState: { currentSum: sum, target, closestSum },
                    explanation: `Distance to target is ${Math.abs(target - sum)}. Best is ${Math.abs(target - closestSum)}`,
                    phase: 'searching'
                }
            })

            if (sum === target) {
                return steps;
            } else if (sum < target) {
                left++
            } else {
                right--
            }
        }
    }

    steps.push({
        step: steps.length,
        description: "3Sum Closest complete.",
        state: {
            array: sortedNums,
            customState: { finalSum: closestSum },
            explanation: `Closest sum found is ${closestSum}.`,
            phase: 'found',
            finalAnswer: closestSum
        }
    })

    return steps
}

/**
 * 4SUM: BRUTE FORCE (O(N^4))
 */
export const generate4SumBrute = (nums: number[], target: number = 0): Step[] => {
    const steps: Step[] = []
    const results: number[][] = []
    const n = nums.length

    steps.push({
        step: 0,
        description: "Starting 4Sum Brute Force. Checking all possible quadruplets.",
        state: { array: nums, explanation: "Trying all combinations of i, j, k, l indices.", phase: 'init' }
    })

    for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
            for (let k = j + 1; k < n; k++) {
                for (let l = k + 1; l < n; l++) {
                    const sum = nums[i] + nums[j] + nums[k] + nums[l]
                    const isMatch = sum === target
                    
                    steps.push({
                        step: steps.length,
                        description: `Checking [${i}, ${j}, ${k}, ${l}]: ${nums[i]} + ${nums[j]} + ${nums[k]} + ${nums[l]} = ${sum}`,
                        state: {
                            array: nums,
                            pointers: { i, j, k, l },
                            highlightIndices: [i, j, k, l],
                            customState: { currentSum: sum, target },
                            explanation: isMatch ? "Match found!" : `Sum ${sum} is not ${target}.`,
                            phase: isMatch ? 'found' : 'searching'
                        }
                    })
                    
                    if (isMatch) {
                        const quad = [nums[i], nums[j], nums[k], nums[l]].sort((a,b) => a-b)
                        if (!results.some(r => r[0] === quad[0] && r[1] === quad[1] && r[2] === quad[2] && r[3] === quad[3])) {
                            results.push(quad)
                        }
                    }
                }
            }
        }
    }

    steps.push({
        step: steps.length,
        description: "4Sum Brute Force complete.",
        state: { array: nums, finalAnswer: results, phase: 'found', explanation: `Found ${results.length} unique quadruplets.` }
    })

    return steps
}

/**
 * 4SUM: TWO POINTERS (O(N^3))
 */
export const generate4Sum = (nums: number[], target: number): Step[] => {
    const steps: Step[] = []
    const sortedNums = [...nums].sort((a, b) => a - b)
    const result: number[][] = []

    steps.push({
        step: 0,
        description: "Starting 4Sum. Sorting array first.",
        state: {
            array: sortedNums,
            explanation: "Sorted array for nested loops.",
            phase: 'init'
        }
    })

    for (let i = 0; i < sortedNums.length - 3; i++) {
        if (i > 0 && sortedNums[i] === sortedNums[i - 1]) continue
        for (let j = i + 1; j < sortedNums.length - 2; j++) {
            if (j > i + 1 && sortedNums[j] === sortedNums[j - 1]) continue

            let left = j + 1
            let right = sortedNums.length - 1

            while (left < right) {
                const sum = sortedNums[i] + sortedNums[j] + sortedNums[left] + sortedNums[right]

                steps.push({
                    step: steps.length,
                    description: `Fixed i=${i}, j=${j}. Checking L=${left}, R=${right}. Sum=${sum}`,
                    state: {
                        array: sortedNums,
                        pointers: { i, j, l: left, r: right },
                        highlightIndices: [i, j, left, right],
                        customState: { currentSum: sum, target, quadrupletsFound: result.length },
                        explanation: sum === target ? "Match found!" : (sum < target ? "Sum < target. Move Left." : "Sum > target. Move Right."),
                        phase: sum === target ? 'found' : 'searching'
                    }
                })

                if (sum === target) {
                    result.push([sortedNums[i], sortedNums[j], sortedNums[left], sortedNums[right]])
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
    }

    steps.push({
        step: steps.length,
        description: "4Sum search complete.",
        state: {
            array: sortedNums,
            customState: { finalQuadruplets: result },
            explanation: `Found ${result.length} unique quadruplets.`,
            phase: 'found',
            finalAnswer: result
        }
    })

    return steps
}

/**
 * BEST TIME TO BUY AND SELL STOCK: TWO POINTERS/MATH (O(N))
 */
export const generateBestTimeToBuyAndSellStock = (prices: number[]): Step[] => {
    const steps: Step[] = [];
    let minPrice = Infinity;
    let maxProfit = 0;

    steps.push({
        step: 0,
        description: "Initialize variables.",
        state: { array: prices, customState: { minPrice: "Infinity", maxProfit }, explanation: "Track lowest price and max profit seen so far.", phase: 'init' }
    });

    for (let i = 0; i < prices.length; i++) {
        const profit = prices[i] - minPrice;
        if (prices[i] < minPrice) {
            minPrice = prices[i];
            steps.push({
                step: steps.length,
                description: `Found new min price: ${prices[i]}`,
                state: { array: prices, pointers: { i }, highlightIndices: [i], customState: { minPrice, maxProfit, currentPrice: prices[i] }, explanation: `Price ${prices[i]} is tracking lowest.`, phase: 'searching' }
            });
        } else if (profit > maxProfit) {
            maxProfit = profit;
            steps.push({
                step: steps.length,
                description: `Found new max profit: ${profit}`,
                state: { array: prices, pointers: { i }, highlightIndices: [i], customState: { minPrice, maxProfit, currentPrice: prices[i] }, explanation: `Selling here yields max profit ${profit}.`, phase: 'found' }
            });
        } else {
            steps.push({
                step: steps.length,
                description: `Checking price: ${prices[i]}`,
                state: { array: prices, pointers: { i }, highlightIndices: [i], customState: { minPrice, maxProfit, currentPrice: prices[i] }, explanation: `No new min or optimal profit here.`, phase: 'searching' }
            });
        }
    }

    steps.push({
        step: steps.length,
        description: "Done trading.",
        state: { array: prices, customState: { finalProfit: maxProfit }, explanation: `Maximum profit possible is ${maxProfit}.`, phase: 'found', finalAnswer: maxProfit }
    });

    return steps;
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
            phase: isValid ? 'found' : 'not_found',
            finalAnswer: isValid
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
        state: { result: [...result], phase: 'found', explanation: "Fused both lists into a single sorted sequence.", finalAnswer: result }
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

    const isValid = cleanS.length === 0 || left >= right; // If cleanS is empty, it's a valid palindrome. If left >= right, all checks passed.
    steps.push({
        step: steps.length,
        description: "Confirmed: It is a palindrome.",
        state: { array: chars as any, phase: 'found', explanation: "Passed all symmetry checks.", finalAnswer: isValid }
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
        state: { array: [...currentNums], phase: 'found', explanation: "Stable mutation complete.", finalAnswer: currentNums }
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
    let foundIndex = -1

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

        if (nums[mid] === target) {
            foundIndex = mid
            break
        }

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
        description: foundIndex !== -1 ? `Target found at index ${foundIndex}.` : "Target not found in array.",
        state: { array: nums as any, phase: foundIndex !== -1 ? 'found' : 'not_found', explanation: foundIndex !== -1 ? `Target ${target} found.` : "Search space exhausted.", finalAnswer: foundIndex }
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
        state: { matrix: currentMatrix.map(row => [...row]), phase: 'found', explanation: "90-degree clockwise rotation achieved.", finalAnswer: currentMatrix }
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
    let median = 0

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

        const maxLeft1 = (i === 0) ? -Infinity : nums1[i - 1]
        const minRight1 = (i === m) ? Infinity : nums1[i]
        const maxLeft2 = (j === 0) ? -Infinity : nums2[j - 1]
        const minRight2 = (j === n) ? Infinity : nums2[j]

        steps.push({
            step: steps.length,
            description: `Checking partitions i=${i}, j=${j}.`,
            state: {
                array1: nums1,
                array2: nums2,
                pointers: { i, j },
                calculation: `L1:${maxLeft1} vs R2:${minRight2} | L2:${maxLeft2} vs R1:${minRight1}`,
                explanation: `Partition boundaries: [${maxLeft1} | ${minRight1}] in X, [${maxLeft2} | ${minRight2}] in Y.`,
                phase: 'searching',
                customState: { maxLeft1, minRight1, maxLeft2, minRight2 }
            }
        })

        if (maxLeft1 <= minRight2 && maxLeft2 <= minRight1) {
            if ((m + n) % 2 === 0) {
                median = (Math.max(maxLeft1, maxLeft2) + Math.min(minRight1, minRight2)) / 2
            } else {
                median = Math.max(maxLeft1, maxLeft2)
            }
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
                    phase: 'found',
                    finalAnswer: median
                }
            })
            return steps
        } else if (maxLeft1 > minRight2) {
            right = i - 1
        } else {
            left = i + 1
        }
    }

    // Should not reach here for valid inputs
    steps.push({
        step: steps.length,
        description: "Median calculation failed (should not happen for valid inputs).",
        state: { phase: 'not_found', explanation: "Algorithm did not converge.", finalAnswer: null }
    })
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

    const finalResult = Object.values(map)
    steps.push({
        step: steps.length,
        description: "Groups finalized.",
        state: { array: strs, mapState: JSON.parse(JSON.stringify(map)), phase: 'found', explanation: "Grouping complete.", finalAnswer: finalResult }
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
        state: { matrix: dp.map(row => [...row]), finalAnswer: dp[m][n], phase: dp[m][n] ? 'found' : 'not_found', explanation: "DP complete." }
    })
    return steps
}



/**
 * SORT COLORS: DUTCH NATIONAL FLAG (O(N))
 */
export const generateSortColors = (nums: number[]): Step[] => {
    const steps: Step[] = []
    const currentNums = [...nums]
    let low = 0
    let curr = 0
    let high = currentNums.length - 1

    steps.push({
        step: 0,
        description: "Starting Sort Colors (Dutch National Flag).",
        state: {
            array: [...currentNums],
            pointers: { low, curr, high },
            explanation: "Initializing three pointers: low (0s boundary), curr (iteration), and high (2s boundary).",
            phase: 'init'
        }
    })

    while (curr <= high) {
        const val = currentNums[curr]
        let action = ""

        if (val === 0) {
            action = `Value at curr is 0. Swapping with low index ${low}.`
            // Swap curr and low
            const temp = currentNums[curr]
            currentNums[curr] = currentNums[low]
            currentNums[low] = temp

            steps.push({
                step: steps.length,
                description: `Found 0 at index ${curr}. Swapping with low (${low}).`,
                state: {
                    array: [...currentNums],
                    pointers: { low, curr, high },
                    highlightIndices: [low, curr],
                    explanation: action,
                    phase: 'searching'
                }
            })
            low++
            curr++
        } else if (val === 2) {
            action = `Value at curr is 2. Swapping with high index ${high}.`
            // Swap curr and high
            const temp = currentNums[curr]
            currentNums[curr] = currentNums[high]
            currentNums[high] = temp

            steps.push({
                step: steps.length,
                description: `Found 2 at index ${curr}. Swapping with high (${high}).`,
                state: {
                    array: [...currentNums],
                    pointers: { low, curr, high },
                    highlightIndices: [curr, high],
                    explanation: action,
                    phase: 'searching'
                }
            })
            high--
        } else {
            action = "Value at curr is 1. Correct position for white, moving curr."
            steps.push({
                step: steps.length,
                description: `Found 1 at index ${curr}.`,
                state: {
                    array: [...currentNums],
                    pointers: { low, curr, high },
                    highlightIndices: [curr],
                    explanation: action,
                    phase: 'searching'
                }
            })
            curr++
        }
    }

    steps.push({
        step: steps.length,
        description: "Sort Colors complete.",
        state: {
            array: [...currentNums],
            phase: 'found',
            explanation: "Array is now partitioned into Red (0), White (1), and Blue (2) regions.",
            finalAnswer: currentNums
        }
    })

    return steps
}

/**
 * SORT COLORS: BRUTE FORCE (COUNTING SORT)
 */
export const generateSortColorsBrute = (nums: number[]): Step[] => {
    const steps: Step[] = []
    const currentNums = [...nums]
    const counts = [0, 0, 0]

    // Step 1: Count
    for (let i = 0; i < currentNums.length; i++) {
        counts[currentNums[i]]++
        steps.push({
            step: steps.length,
            description: `Counting color ${currentNums[i]}.`,
            state: {
                array: [...currentNums],
                pointers: { i },
                customState: { counts: [...counts] },
                explanation: `Detected one ${currentNums[i] === 0 ? "Red" : (currentNums[i] === 1 ? "White" : "Blue")}.`,
                phase: 'searching'
            }
        })
    }

    // Step 2: Overwrite
    let idx = 0
    for (let color = 0; color < 3; color++) {
        for (let j = 0; j < counts[color]; j++) {
            currentNums[idx] = color
            steps.push({
                step: steps.length,
                description: `Writing color ${color} back to index ${idx}.`,
                state: {
                    array: [...currentNums],
                    pointers: { idx },
                    customState: { counts: [...counts] },
                    explanation: `Placing ${color === 0 ? "Red" : (color === 1 ? "White" : "Blue")} based on count.`,
                    phase: 'searching'
                }
            })
            idx++
        }
    }

    steps.push({
        step: steps.length,
        description: "Counting sort complete.",
        state: {
            array: [...currentNums],
            phase: 'found',
            explanation: "Array sorted using two passes (Count and Write).",
            finalAnswer: currentNums
        }
    })

    return steps
}
/**
 * JUMP GAME: GREEDY (O(N))
 */
export const generateJumpGame = (nums: number[]): Step[] => {
    const steps: Step[] = []
    let maxReach = 0

    steps.push({
        step: 0,
        description: "Starting Jump Game. Can we reach the last index?",
        state: { array: nums, pointers: { i: 0 }, customState: { maxReach: 0 }, explanation: "Initializing maximum reachable distance to 0.", phase: 'init' }
    })

    for (let i = 0; i < nums.length; i++) {
        if (i > maxReach) {
            steps.push({
                step: steps.length,
                description: `Stopped at index ${i}. Max reach ${maxReach} is less than current index.`,
                state: { array: nums, pointers: { i }, customState: { maxReach }, explanation: "Game Over: Cannot jump further.", phase: 'not_found', finalAnswer: false }
            })
            return steps
        }

        const currentReach = i + nums[i]
        const oldMax = maxReach
        maxReach = Math.max(maxReach, currentReach)

        steps.push({
            step: steps.length,
            description: `At index ${i} (value ${nums[i]}). New potential reach: ${currentReach}`,
            state: {
                array: nums,
                pointers: { i },
                customState: { maxReach, currentReach },
                highlightIndices: [i],
                explanation: currentReach > oldMax
                    ? `Expanded max reach from ${oldMax} to ${maxReach}!`
                    : `Current jump doesn't exceed existing max reach of ${maxReach}.`,
                phase: 'searching'
            }
        })

        if (maxReach >= nums.length - 1) {
            steps.push({
                step: steps.length,
                description: `Success! Max reach ${maxReach} covers the end of the array.`,
                state: { array: nums, customState: { maxReach }, phase: 'found', explanation: "Reached the goal index.", finalAnswer: true }
            })
            return steps
        }
    }

    steps.push({
        step: steps.length,
        description: "End of array reached, but last index was not reachable.",
        state: { array: nums, customState: { maxReach }, phase: 'not_found', explanation: "Could not reach the last index.", finalAnswer: false }
    })
    return steps
}

/**
 * MERGE INTERVALS: SORT + SCAN (O(N log N))
 */
export const generateMergeIntervals = (intervals: number[][]): Step[] => {
    const steps: Step[] = []
    if (intervals.length === 0) {
        steps.push({
            step: 0,
            description: "No intervals provided.",
            state: { intervals: [], result: [], explanation: "Empty input, returning empty array.", phase: 'found', finalAnswer: [] }
        })
        return steps
    }

    const sorted = [...intervals].sort((a, b) => a[0] - b[0])
    const merged: number[][] = []

    steps.push({
        step: 0,
        description: "Starting Merge Intervals. Sorting intervals by start time.",
        state: { intervals: sorted, result: [], explanation: "Sorted intervals to process them chronologically.", phase: 'init' }
    })

    let current = sorted[0]
    merged.push(current)

    for (let i = 1; i < sorted.length; i++) {
        const next = sorted[i]
        const last = merged[merged.length - 1]
        const overlaps = next[0] <= last[1]

        steps.push({
            step: steps.length,
            description: `Comparing [${last}] and [${next}].`,
            state: {
                intervals: sorted,
                pointers: { i },
                result: JSON.parse(JSON.stringify(merged)),
                highlightIndices: [i, merged.length - 1],
                explanation: overlaps
                    ? `Overlapping detected (${next[0]} <= ${last[1]}). Merging...`
                    : `No overlap. Appending [${next}] as a new interval.`,
                phase: 'searching'
            }
        })

        if (overlaps) {
            last[1] = Math.max(last[1], next[1])
        } else {
            merged.push(next)
        }
    }

    steps.push({
        step: steps.length,
        description: "Merge process complete.",
        state: { result: merged, phase: 'found', explanation: `Consolidated into ${merged.length} intervals.`, finalAnswer: merged }
    })

    return steps
}

/**
 * CLIMBING STAIRS: DP (O(N))
 */
export const generateClimbingStairs = (n: number): Step[] => {
    const steps: Step[] = []
    if (n <= 2) {
        steps.push({
            step: 0,
            description: `For n=${n}, ways = ${n}`,
            state: { phase: 'found', explanation: `Base case for n=${n}.`, finalAnswer: n }
        })
        return steps
    }

    const dp = new Array(n + 1).fill(0)
    dp[1] = 1
    dp[2] = 2

    steps.push({
        step: 0,
        description: "Starting Climbing Stairs DP.",
        state: { array: dp, explanation: "Base cases: dp[1]=1, dp[2]=2.", phase: 'init' }
    })

    for (let i = 3; i <= n; i++) {
        dp[i] = dp[i - 1] + dp[i - 2]
        steps.push({
            step: steps.length,
            description: `Calculating ways for step ${i}.`,
            state: {
                array: [...dp],
                pointers: { i },
                highlightIndices: [i - 1, i - 2],
                explanation: `Ways for step ${i} = dp[${i - 1}] + dp[${i - 2}] = ${dp[i - 1]} + ${dp[i - 2]} = ${dp[i]}.`,
                phase: 'searching'
            }
        })
    }

    steps.push({
        step: steps.length,
        description: `Total ways to climb ${n} stairs: ${dp[n]}`,
        state: { array: dp, phase: 'found', explanation: "Completed Fibonacci-based DP traversal.", finalAnswer: dp[n] }
    })

    return steps
}

/**
 * SEARCH A 2D MATRIX: FLATTENED BINARY SEARCH (O(log(m*n)))
 */
export const generateSearch2DMatrix = (matrix: number[][], target: number): Step[] => {
    const steps: Step[] = []
    const m = matrix.length
    if (m === 0) {
        steps.push({
            step: 0,
            description: "Empty matrix provided.",
            state: { matrix, phase: 'not_found', explanation: "Matrix is empty, target cannot be found.", finalAnswer: false }
        })
        return steps
    }
    const n = matrix[0].length
    if (n === 0) {
        steps.push({
            step: 0,
            description: "Empty rows in matrix provided.",
            state: { matrix, phase: 'not_found', explanation: "Matrix rows are empty, target cannot be found.", finalAnswer: false }
        })
        return steps
    }

    let left = 0
    let right = m * n - 1
    let found = false

    steps.push({
        step: 0,
        description: "Starting Binary Search on 2D Matrix.",
        state: { matrix, pointers: { l: 0, r: m * n - 1 }, explanation: "Treating the 2D matrix as a sorted 1D array.", phase: 'init' }
    })

    while (left <= right) {
        const mid = Math.floor((left + right) / 2)
        const r = Math.floor(mid / n)
        const c = mid % n
        const val = matrix[r][c]

        steps.push({
            step: steps.length,
            description: `Checking middle index ${mid} (Matrix: [${r}][${c}], Value: ${val}).`,
            state: {
                matrix,
                pointers: { l: left, r: right, mid },
                highlightIndices: [[r, c]],
                explanation: val === target
                    ? `Found target ${target}!`
                    : (val < target ? `${val} < ${target}, searching right half.` : `${val} > ${target}, searching left half.`),
                phase: val === target ? 'found' : 'searching'
            }
        })

        if (val === target) {
            found = true
            break
        }
        if (val < target) left = mid + 1; else right = mid - 1
    }

    steps.push({
        step: steps.length,
        description: found ? `Target ${target} found in matrix.` : "Target not found in matrix.",
        state: { matrix, phase: found ? 'found' : 'not_found', explanation: found ? "Target found." : "Search space exhausted.", finalAnswer: found }
    })

    return steps
}

/**
 * MINIMUM WINDOW SUBSTRING: SLIDING WINDOW (O(N))
 */
export const generateMinWindowSubstring = (s: string, t: string): Step[] => {
    const steps: Step[] = []
    const chars = s.split('')
    const targetMap: Record<string, number> = {}
    for (const char of t) targetMap[char] = (targetMap[char] || 0) + 1

    let left = 0, right = 0, required = Object.keys(targetMap).length, formed = 0
    const windowMap: Record<string, number> = {}
    let ans = [-1, 0, 0] // length, left, right

    steps.push({
        step: 0,
        description: `Starting Sliding Window for Minimum Window Substring of "${t}".`,
        state: { array: chars as any, pointers: { l: 0, r: 0 }, customState: { targetMap, windowMap: {} }, explanation: "Initializing window and target frequencies.", phase: 'init' }
    })

    while (right < s.length) {
        const c = s[right]
        windowMap[c] = (windowMap[c] || 0) + 1
        if (targetMap[c] && windowMap[c] === targetMap[c]) formed++

        steps.push({
            step: steps.length,
            description: `Expanding window: Added "${c}" at index ${right}.`,
            state: {
                array: chars as any,
                pointers: { l: left, r: right },
                customState: { formed, required, windowMap: { ...windowMap } },
                highlightIndices: Array.from({ length: right - left + 1 }, (_, k) => left + k),
                explanation: formed === required ? "All characters found! Shrinking window..." : `Need ${required - formed} more unique characters.`,
                phase: 'searching'
            }
        })

        while (left <= right && formed === required) {
            const d = s[left]
            if (ans[0] === -1 || right - left + 1 < ans[0]) {
                ans = [right - left + 1, left, right]
            }

            windowMap[d]--
            if (targetMap[d] && windowMap[d] < targetMap[d]) formed--

            steps.push({
                step: steps.length,
                description: `Shrinking window: Removed "${d}" at index ${left}.`,
                state: {
                    array: chars as any,
                    pointers: { l: left, r: right },
                    customState: { formed, required, windowMap: { ...windowMap }, bestSoFar: s.substring(ans[1], ans[2] + 1) },
                    highlightIndices: Array.from({ length: right - left + 1 }, (_, k) => left + k),
                    explanation: formed < required ? `Lost character "${d}". Looking for replacement.` : "Window still valid. Continuing to shrink...",
                    phase: 'searching'
                }
            })
            left++
        }
        right++
    }

    const finalResult = ans[0] === -1 ? "" : s.substring(ans[1], ans[2] + 1)
    steps.push({
        step: steps.length,
        description: finalResult ? `Minimum Window identified: "${finalResult}"` : "No valid window found.",
        state: { array: chars as any, phase: finalResult ? 'found' : 'not_found', explanation: "Sliding window scan complete." }
    })

    return steps
}

/**
 * SUBSETS: BACKTRACKING (O(N * 2^N))
 */
export const generateSubsets = (nums: number[]): Step[] => {
    const steps: Step[] = []
    const results: number[][] = []

    steps.push({
        step: 0,
        description: "Starting Backtracking for Subsets.",
        state: { array: nums, explanation: "Exploring all possible combinations using a choice tree.", phase: 'init' }
    })

    const backtrack = (start: number, curr: number[]) => {
        steps.push({
            step: steps.length,
            description: `Found subset: [${curr.join(',')}]`,
            state: {
                array: nums,
                customState: { curr, start },
                explanation: `Adding [${curr.join(',')}] to results. Processing next elements starting from ${start}.`,
                phase: 'found'
            }
        })
        results.push([...curr])

        for (let i = start; i < nums.length; i++) {
            backtrack(i + 1, [...curr, nums[i]])
            steps.push({
                step: steps.length,
                description: `Backtracking: Removed ${nums[i]} from subset.`,
                state: {
                    array: nums,
                    customState: { curr, nextIndex: i + 1 },
                    explanation: "Returning to parent state to explore other branches.",
                    phase: 'searching'
                }
            })
        }
    }

    backtrack(0, [])

    steps.push({
        step: steps.length,
        description: "All subsets generated.",
        state: { array: nums, finalAnswer: results, phase: 'found', explanation: `Total Subsets: ${results.length}` }
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


/**
 * PALINDROME LINKED LIST: TWO POINTERS (O(N))
 */
export const generatePalindromeLinkedList = (nums: number[]): Step[] => {
    const steps: Step[] = []
    
    steps.push({
        step: 0,
        description: "Initializing Palindrome Linked List check.",
        state: {
            array: nums,
            pointers: { slow: 0, fast: 0 },
            explanation: "To check if a linked list is a palindrome in O(N), we find the middle using slow/fast pointers, reverse the second half, and compare.",
            phase: 'init'
        }
    })

    // Simulated visualization
    let left = 0, right = nums.length - 1
    while(left < right) {
        const match = nums[left] === nums[right]
        steps.push({
            step: steps.length,
            description: `Comparing values: Node(${nums[left]}) vs Node(${nums[right]})`,
            state: {
                array: nums,
                pointers: { l: left, r: right },
                highlightIndices: [left, right],
                explanation: match ? "Values match! Proceeding to next pair." : "Mismatch detected! Not a palindrome.",
                phase: match ? 'searching' : 'not_found'
            }
        })
        if(!match) return steps
        left++
        right--
    }

    steps.push({
        step: steps.length,
        description: "Confirmed: Linked List is a palindrome.",
        state: {
            array: nums,
            phase: 'found',
            explanation: "All compared nodes matched successfully."
        }
    })

    return steps
}

/**
 * PRODUCT OF ARRAY EXCEPT SELF: O(N)
 */
export const generateProductExceptSelf = (nums: number[]): Step[] => {
    const steps: Step[] = []
    const n = nums.length
    const res = new Array(n).fill(1)
    
    steps.push({
        step: 0,
        description: "Initializing Product of Array Except Self.",
        state: {
            array: nums,
            explanation: "We'll use prefix and suffix products to calculate the result without using division.",
            phase: 'init'
        }
    })

    // Prefix pass
    let prefix = 1
    for(let i = 0; i < n; i++) {
        res[i] = prefix
        prefix *= nums[i]
        steps.push({
            step: steps.length,
            description: `Calculating prefix product for index ${i}.`,
            state: {
                array: nums,
                pointers: { i },
                highlightIndices: [i],
                customState: { currentPrefix: prefix, res: [...res] },
                explanation: `Setting res[${i}] to product of all elements before it: ${res[i]}. Update prefix to ${prefix}.`,
                phase: 'searching'
            }
        })
    }

    // Suffix pass
    let suffix = 1
    for(let i = n - 1; i >= 0; i--) {
        const oldRes = res[i]
        res[i] *= suffix
        suffix *= nums[i]
        steps.push({
            step: steps.length,
            description: `Calculating suffix product for index ${i}.`,
            state: {
                array: nums,
                pointers: { i },
                highlightIndices: [i],
                customState: { currentSuffix: suffix, res: [...res] },
                explanation: `Multiplying res[${i}] (${oldRes}) by suffix product ${suffix/nums[i]}: Result is ${res[i]}.`,
                phase: 'searching'
            }
        })
    }

    steps.push({
        step: steps.length,
        description: "Calculation complete.",
        state: {
            array: nums,
            finalAnswer: res,
            phase: 'found',
            explanation: "Successfully computed products for all positions."
        }
    })

    return steps
}

/**
 * INTEGER TO ROMAN: GREEDY SUBTRACTION (O(1) given 1-3999 range)
 */
export const generateIntegerToRoman = (num: number): Step[] => {
    const steps: Step[] = []
    const values = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1]
    const symbols = ["M", "CM", "D", "CD", "C", "XC", "L", "XL", "X", "IX", "V", "IV", "I"]
    let current = num
    let roman = ""

    steps.push({
        step: 0,
        description: `Converting ${num} to Roman numerals.`,
        state: { customState: { num, roman: "" }, explanation: "Starting Greedy conversion from largest symbols.", phase: 'init' }
    })

    for (let i = 0; i < values.length && current > 0; i++) {
        while (current >= values[i]) {
            current -= values[i]
            roman += symbols[i]
            steps.push({
                step: steps.length,
                description: `Adding "${symbols[i]}" because balance (${current + values[i]}) >= ${values[i]}.`,
                state: {
                    customState: { num: current, roman },
                    explanation: `Subtracted ${values[i]}, balance is now ${current}.`,
                    phase: 'searching'
                }
            })
        }
    }

    steps.push({
        step: steps.length,
        description: `Conversion complete: ${roman}`,
        state: { customState: { num: current, roman }, finalAnswer: roman, phase: 'found', explanation: "All integer value components translated." }
    })
    return steps
}

/**
 * LONGEST COMMON PREFIX: HORIZONTAL SCANNING (O(N * M))
 */
export const generateLongestCommonPrefix = (strs: string[]): Step[] => {
    const steps: Step[] = []
    if (strs.length === 0) return []
    let prefix = strs[0]

    steps.push({
        step: 0,
        description: `Starting with first string as initial prefix: "${prefix}".`,
        state: { array: strs, customState: { prefix }, explanation: "Iteratively shrinking prefix based on subsequent strings.", phase: 'init' }
    })

    for (let i = 1; i < strs.length; i++) {
        const s = strs[i]
        const oldPrefix = prefix
        while (s.indexOf(prefix) !== 0) {
            prefix = prefix.substring(0, prefix.length - 1)
            steps.push({
                step: steps.length,
                description: `Shrinking prefix for string "${s}".`,
                state: {
                    array: strs,
                    pointers: { i },
                    customState: { prefix },
                    explanation: `"${oldPrefix}" is not a prefix of "${s}". Reduced to "${prefix}".`,
                    phase: 'searching'
                }
            })
            if (prefix === "") break
        }
        if (prefix === "") break
    }

    steps.push({
        step: steps.length,
        description: prefix === "" ? "No common prefix found." : `Global Longest Common Prefix: "${prefix}"`,
        state: { array: strs, customState: { prefix }, finalAnswer: prefix, phase: 'found', explanation: "All strings scanned." }
    })
    return steps
}

/**
 * TRAPPING RAIN WATER: TWO POINTERS (O(N))
 */
export const generateTrappingRainWater = (height: number[]): Step[] => {
    const steps: Step[] = []
    let left = 0
    let right = height.length - 1
    let leftMax = 0
    let rightMax = 0
    let totalWater = 0

    steps.push({
        step: 0,
        description: "Initializing pointers at boundaries.",
        state: { array: height, pointers: { left, right }, explanation: "Simulating water trapping from sides to center.", phase: 'init' }
    })

    while (left < right) {
        let currentType: 'left' | 'right' = height[left] < height[right] ? 'left' : 'right'
        
        if (currentType === 'left') {
            if (height[left] >= leftMax) {
                leftMax = height[left]
                steps.push({
                    step: steps.length,
                    description: `New LeftMax: ${leftMax}`,
                    state: { array: height, pointers: { left, right }, customState: { leftMax, rightMax, totalWater }, explanation: "Cannot trap water at current peak.", phase: 'searching' }
                })
            } else {
                totalWater += leftMax - height[left]
                steps.push({
                    step: steps.length,
                    description: `Trapped ${leftMax - height[left]} units at index ${left}.`,
                    state: { array: height, pointers: { left, right }, customState: { leftMax, rightMax, totalWater }, highlightIndices: [left], explanation: `Height is ${height[left]}, while LeftMax is ${leftMax}.`, phase: 'searching' }
                })
            }
            left++
        } else {
            if (height[right] >= rightMax) {
                rightMax = height[right]
                steps.push({
                    step: steps.length,
                    description: `New RightMax: ${rightMax}`,
                    state: { array: height, pointers: { left, right }, customState: { leftMax, rightMax, totalWater }, explanation: "Cannot trap water at current peak.", phase: 'searching' }
                })
            } else {
                totalWater += rightMax - height[right]
                steps.push({
                    step: steps.length,
                    description: `Trapped ${rightMax - height[right]} units at index ${right}.`,
                    state: { array: height, pointers: { left, right }, customState: { leftMax, rightMax, totalWater }, highlightIndices: [right], explanation: `Height is ${height[right]}, while RightMax is ${rightMax}.`, phase: 'searching' }
                })
            }
            right--
        }
    }

    steps.push({
        step: steps.length,
        description: `Total Trapped Water: ${totalWater}`,
        state: { array: height, finalAnswer: totalWater, phase: 'found', explanation: "Converged at highest point." }
    })
    return steps
}

/**
 * NEXT PERMUTATION: DIJKSTRA'S SYMMETRY (O(N))
 */
export const generateNextPermutation = (nums: number[]): Step[] => {
    const steps: Step[] = []
    const arr = [...nums]
    let i = arr.length - 2

    steps.push({
        step: 0,
        description: "Starting lexicographical scan from right to left.",
        state: { array: [...arr], explanation: "Searching for the first index 'i' where arr[i] < arr[i+1].", phase: 'init' }
    })

    while (i >= 0 && arr[i] >= arr[i + 1]) i--

    if (i >= 0) {
        let j = arr.length - 1
        while (arr[j] <= arr[i]) j--
        
        steps.push({
            step: steps.length,
            description: `Found pivot index ${i} (value ${arr[i]}). Swapping with ${arr[j]}.`,
            state: { array: [...arr], pointers: { i, j }, highlightIndices: [i, j], explanation: `Swap ${arr[i]} with the first larger value from right (${arr[j]}).`, phase: 'searching' }
        })
        
        const temp = arr[i]
        arr[i] = arr[j]
        arr[j] = temp
    } else {
        steps.push({
            step: steps.length,
            description: "No pivot found. Array is in reverse order.",
            state: { array: [...arr], explanation: "Will result in the smallest permutation (strictly increasing).", phase: 'searching' }
        })
    }

    // Reverse from i + 1 to end
    let l = i + 1, r = arr.length - 1
    while (l < r) {
        const temp = arr[l]
        arr[l] = arr[r]
        arr[r] = temp
        l++; r--
    }

    steps.push({
        step: steps.length,
        description: "Reversed suffix to achieve next greater lexicographical order.",
        state: { array: [...arr], finalAnswer: arr, phase: 'found', explanation: "Transformation complete." }
    })
    return steps
}

/**
 * COMBINATION SUM: BACKTRACKING (O(2^N))
 */
export const generateCombinationSum = (candidates: number[], target: number): Step[] => {
    const steps: Step[] = []
    const results: number[][] = []

    steps.push({
        step: 0,
        description: `Searching for combinations that sum to ${target}.`,
        state: { array: candidates, explanation: "Exploring decision tree allowing multiple uses of each number.", phase: 'init' }
    })

    const backtrack = (curr: number[], currentSum: number, start: number) => {
        steps.push({
            step: steps.length,
            description: `Current [${curr.join(',')}] Sum: ${currentSum}`,
            state: {
                array: candidates,
                customState: { curr, target, currentSum },
                explanation: currentSum === target ? "Target reached!" : `Available: ${candidates.slice(start).join(', ')}`,
                phase: currentSum === target ? 'found' : 'searching'
            }
        })

        if (currentSum === target) {
            results.push([...curr])
            return
        }
        if (currentSum > target) return

        for (let i = start; i < candidates.length; i++) {
            const num = candidates[i]
            backtrack([...curr, num], currentSum + num, i)
        }
    }

    backtrack([], 0, 0)
    steps.push({
        step: steps.length,
        description: "Exploration complete.",
        state: { array: candidates, finalAnswer: results, phase: 'found', explanation: `Total groups found: ${results.length}` }
    })
    return steps
}

/**
 * CARTESIAN PRODUCT: BACKTRACKING (O(Product of array lengths))
 */
export const generateCartesianProduct = (arrays: any[][]): Step[] => {
    const steps: Step[] = []
    const results: any[][] = []
    const nodes: Record<string, RecursionNode> = {}
    let nodeCounter = 0

    if (!arrays || arrays.length === 0) return []

    const buildStep = (activeId: string, description: string, curr: any[], phase: any = 'searching') => {
        steps.push({
            step: steps.length,
            description,
            state: {
                tree: {
                    nodes: JSON.parse(JSON.stringify(nodes)),
                    rootId: "node-0",
                    activeNodeId: activeId
                },
                array: curr,
                explanation: description,
                phase
            }
        })
    }

    const backtrack = (arrayIndex: number, curr: any[], parentId: string | undefined, depth: number) => {
        const id = `node-${nodeCounter++}`
        const label = arrayIndex === 0 ? "root" : `pick(${curr[curr.length - 1]})`
        
        const node: RecursionNode = {
            id,
            label,
            parentId,
            description: `Level ${arrayIndex}: [${curr.join(',')}]`,
            children: [],
            status: 'active',
            params: { level: arrayIndex, current: curr },
            depth
        }
        nodes[id] = node
        if (parentId) nodes[parentId].children.push(id)

        buildStep(id, `Processing Level ${arrayIndex}. Current path: [${curr.join(',')}]`, curr)

        if (arrayIndex === arrays.length) {
            results.push([...curr])
            node.result = [...curr]
            node.status = 'completed'
            buildStep(id, `Reached bottom. Found result: [${curr.join(',')}]`, curr, 'found')
            return
        }

        const choices = arrays[arrayIndex]
        for (let i = 0; i < choices.length; i++) {
            backtrack(arrayIndex + 1, [...curr, choices[i]], id, depth + 1)
            
            node.status = 'returning'
            buildStep(id, `Returning from branch. Backtracking...`, curr)
            node.status = 'active'
        }
        
        node.status = 'completed'
    }

    backtrack(0, [], undefined, 0)

    steps.push({
        step: steps.length,
        description: `Cartesian Product complete. Found ${results.length} total combinations.`,
        state: {
            tree: {
                nodes: JSON.parse(JSON.stringify(nodes)),
                rootId: "node-0",
                activeNodeId: undefined
            },
            finalAnswer: results,
            phase: 'found',
            explanation: `Generation finished matching all combinations from ${arrays.length} input sets.`
        }
    })

    return steps
}

/**
 * LETTER COMBINATIONS OF A PHONE NUMBER: BFS/BACKTRACKING (O(4^N))
 */
export const generateLetterCombinations = (digits: string): Step[] => {
    const steps: Step[] = []
    if (!digits) return []
    const mapping: Record<string, string[]> = {
        '2': ['a', 'b', 'c'], '3': ['d', 'e', 'f'], '4': ['g', 'h', 'i'],
        '5': ['j', 'k', 'l'], '6': ['m', 'n', 'o'], '7': ['p', 'q', 'r', 's'],
        '8': ['t', 'u', 'v'], '9': ['w', 'x', 'y', 'z']
    }
    const results: string[] = []

    steps.push({
        step: 0,
        description: `Starting combinations for digits "${digits}".`,
        state: { string: digits.split(''), explanation: "Treating this as a decision tree with N levels.", phase: 'init' }
    })

    const backtrack = (index: number, curr: string) => {
        if (index === digits.length) {
            results.push(curr)
            steps.push({
                step: steps.length,
                description: `Found combination: "${curr}".`,
                state: { string: digits.split(''), customState: { curr, results: [...results] }, explanation: "Base case reached.", phase: 'found' }
            })
            return
        }

        const letters = mapping[digits[index]]
        for (const char of letters) {
            backtrack(index + 1, curr + char)
        }
    }

    backtrack(0, "")
    steps.push({
        step: steps.length,
        description: "All combinations generated.",
        state: { string: digits.split(''), finalAnswer: results, phase: 'found', explanation: `Total: ${results.length}` }
    })
    return steps
}

/**
 * GENERATE PARENTHESES: BACKTRACKING (O(4^N / N sqrt(N)))
 */
export const generateGenerateParentheses = (n: number): Step[] => {
    const steps: Step[] = []
    const results: string[] = []

    steps.push({
        step: 0,
        description: `Generating all valid combinations of ${n} pairs of parentheses.`,
        state: { customState: { n, open: 0, close: 0, current: "" }, explanation: "Rule: Cannot add ')' if count of ')' >= '('.", phase: 'init' }
    })

    const backtrack = (curr: string, open: number, close: number) => {
        if (curr.length === n * 2) {
            results.push(curr)
            steps.push({
                step: steps.length,
                description: `Valid pair complete: ${curr}`,
                state: { customState: { curr, open, close, results: [...results] }, explanation: "Found a balanced combination.", phase: 'found' }
            })
            return
        }

        if (open < n) {
            backtrack(curr + "(", open + 1, close)
        }
        if (close < open) {
            backtrack(curr + ")", open, close + 1)
        }
    }

    backtrack("", 0, 0)
    steps.push({
        step: steps.length,
        description: "Generation complete.",
        state: { finalAnswer: results, phase: 'found', explanation: `Generated ${results.length} valid sequences.` }
    })
    return steps
}

/**
 * SEARCH FOR A RANGE (First and Last Position): BINARY SEARCH (O(log N))
 */
export const generateSearchRange = (nums: number[], target: number): Step[] => {
    const steps: Step[] = []
    const findBound = (isFirst: boolean) => {
        let left = 0, right = nums.length - 1
        let bound = -1
        while (left <= right) {
            const mid = Math.floor((left + right) / 2)
            steps.push({
                step: steps.length,
                description: `Looking for ${isFirst ? 'First' : 'Last'} index at mid=${mid}.`,
                state: { array: nums, pointers: { left, right, mid }, highlightIndices: [mid], explanation: `Current: ${nums[mid]} vs Target: ${target}`, phase: 'searching' }
            })
            if (nums[mid] === target) {
                bound = mid
                if (isFirst) right = mid - 1; else left = mid + 1
            } else if (nums[mid] < target) left = mid + 1; else right = mid - 1
        }
        return bound
    }

    const first = findBound(true)
    const last = findBound(false)

    steps.push({
        step: steps.length,
        description: `Final Range: [${first}, ${last}]`,
        state: { array: nums, finalAnswer: [first, last], phase: 'found', explanation: "Binary search completed for both boundaries." }
    })
    return steps
}

/**
 * FIBONACCI (RECURSIVE): O(2^N)
 */
export const generateFibonacciTree = (n: number): Step[] => {
    const steps: Step[] = []
    const nodes: Record<string, RecursionNode> = {}
    let nodeCounter = 0

    const buildStep = (activeId: string, description: string, phase: any = 'searching') => {
        steps.push({
            step: steps.length,
            description,
            state: {
                tree: {
                    nodes: JSON.parse(JSON.stringify(nodes)),
                    rootId: "node-0",
                    activeNodeId: activeId
                },
                explanation: description,
                phase
            }
        })
    }

    const fib = (val: number, parentId: string | undefined, depth: number): number => {
        const id = `node-${nodeCounter++}`
        const node: RecursionNode = {
            id,
            label: `fib(${val})`,
            parentId,
            description: `Abstract Logic: State n=${val}`,
            children: [],
            status: 'active',
            params: { n: val },
            depth
        }
        nodes[id] = node
        if (parentId) nodes[parentId].children.push(id)

        buildStep(id, `Evaluating Recursive Branch: fib(${val})`, 'searching')

        if (val <= 1) {
            node.result = val
            node.status = 'completed'
            buildStep(id, `Base Case Reached: fib(${val}) = ${val}`, 'found')
            return val
        }

        // Left Call
        buildStep(id, `Recursive Descent: Exploring Left Branch (n-1)`)
        const left = fib(val - 1, id, depth + 1)
        
        // Right Call
        buildStep(id, `Recursive Descent: Exploring Right Branch (n-2)`)
        const right = fib(val - 2, id, depth + 1)
        
        const res = left + right

        node.result = res
        node.status = 'returning'
        buildStep(id, `Aggregation Logic: Combining Results (${left} + ${right} = ${res})`, 'found')
        node.status = 'completed'
        
        return res
    }

    fib(n, undefined, 0)
    
    steps.push({
        step: steps.length,
        description: `Fibonacci(${n}) calculation complete: ${nodes["node-0"].result}`,
        state: {
            tree: {
                nodes: JSON.parse(JSON.stringify(nodes)),
                rootId: "node-0",
                activeNodeId: undefined
            },
            finalAnswer: nodes["node-0"].result,
            phase: 'found',
            explanation: `Computed Fibonacci sequence up to index ${n}.`
        }
    })

    return steps
}

/**
 * PERMUTATIONS (RECURSIVE TREE): O(N!)
 */
export const generatePermutationsTree = (nums: number[]): Step[] => {
    const steps: Step[] = []
    const results: number[][] = []
    const nodes: Record<string, RecursionNode> = {}
    let nodeCounter = 0

    const buildStep = (activeId: string, description: string, currPerm: number[], remaining: number[], phase: any = 'searching') => {
        steps.push({
            step: steps.length,
            description,
            state: {
                tree: {
                    nodes: JSON.parse(JSON.stringify(nodes)),
                    rootId: "node-0",
                    activeNodeId: activeId
                },
                array: currPerm,
                customState: { remaining },
                explanation: description,
                phase
            }
        })
    }

    const backtrack = (curr: number[], remaining: number[], parentId: string | undefined, depth: number) => {
        const id = `node-${nodeCounter++}`
        const label = curr.length === 0 ? "root" : `pick(${curr[curr.length - 1]})`
        const node: RecursionNode = {
            id,
            label,
            parentId,
            description: `Exploring branch: [${curr.join(',')}]`,
            children: [],
            status: 'active',
            params: { curr, remaining },
            depth
        }
        nodes[id] = node
        if (parentId) nodes[parentId].children.push(id)

        buildStep(id, curr.length === 0 ? "Starting permutation search." : `Exploring permutations starting with ${curr[curr.length-1]}`, curr, remaining)

        if (remaining.length === 0) {
            results.push([...curr])
            node.result = [...curr]
            node.status = 'completed'
            buildStep(id, `Found valid permutation: [${curr.join(',')}]`, curr, remaining, 'found')
            return
        }

        for (let i = 0; i < remaining.length; i++) {
            const next = remaining[i]
            const nextRemaining = remaining.filter((_, idx) => idx !== i)
            backtrack([...curr, next], nextRemaining, id, depth + 1)
            
            // Backtracking step visuals
            node.status = 'returning'
            buildStep(id, `Finished sub-branch. Returning to explore other options.`, curr, remaining)
            node.status = 'active'
        }
        
        node.status = 'completed'
    }

    backtrack([], nums, undefined, 0)

    steps.push({
        step: steps.length,
        description: `All ${results.length} permutations explored.`,
        state: {
            tree: {
                nodes: JSON.parse(JSON.stringify(nodes)),
                rootId: "node-0",
                activeNodeId: undefined
            },
            finalAnswer: results,
            phase: 'found',
            explanation: `Total unique orderings found: ${results.length}`
        }
    })

    return steps
}
