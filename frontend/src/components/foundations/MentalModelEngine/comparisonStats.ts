export interface ComparisonStats {
    bruteForceOps: number
    slidingWindowOps?: number
    optimalOps?: number
    savedOps: number
    efficiencyGain: number // percentage
    bruteForceComplexity?: string
    slidingWindowComplexity?: string
    optimalComplexity?: string
    numWindows?: number
    bruteForceSteps?: number
    optimalSteps?: number
    timeSaved?: number
}

export function calculateComparison(
    arrayLength: number,
    windowSize: number
): ComparisonStats {
    const n = arrayLength
    const k = windowSize
    const numWindows = n - k + 1

    // Brute force: For each window, sum all K elements
    const bruteForceOps = numWindows * k

    // Sliding window: Initialize first window (K ops) + slide (2 ops per slide)
    const slidingWindowOps = k + (numWindows - 1) * 2

    const savedOps = bruteForceOps - slidingWindowOps
    const efficiencyGain = bruteForceOps > 0
        ? Math.round((savedOps / bruteForceOps) * 100)
        : 0

    return {
        bruteForceOps,
        slidingWindowOps,
        savedOps,
        efficiencyGain,
        bruteForceComplexity: `O(N×K) = O(${n}×${k})`,
        slidingWindowComplexity: `O(N) = O(${n})`,
        numWindows
    }
}
