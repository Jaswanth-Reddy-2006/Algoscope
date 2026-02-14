export const ContributionLogic = {
    // For At Most K / Exact K patterns:
    // The number of valid subarrays ending at 'right' is exactly the window size.
    // Explanation: If [left, right] is valid, then [left+1, right], [left+2, right]... [right, right] are also valid.
    countSubarrays: (windowSize: number): number => {
        return Math.max(0, windowSize)
    },

    // Formatter for the UI explanation
    formatExplanation: (count: number, right: number, total: number): string => {
        return `Found ${count} valid subarrays ending at index ${right}. Total: ${total}.`
    },

    formatExactKExplanation: (k: number): string => {
        return `Calculating Exact K as AtMost(${k}) - AtMost(${k - 1})`
    }
}
