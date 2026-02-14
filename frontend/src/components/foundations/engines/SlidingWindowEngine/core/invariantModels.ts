export const slidingWindowInvariants: Record<string, { invariant: string; color: string; modelName: string }> = {
    fixed_window: {
        invariant: "right - left + 1 === K",
        color: "text-accent-blue",
        modelName: "FIXED WINDOW"
    },
    variable_window: {
        invariant: "current_sum >= Target",
        color: "text-emerald-400",
        modelName: "MIN SUBARRAY LEN"
    },
    at_most_k: {
        invariant: "distinct_count <= K",
        color: "text-orange-400",
        modelName: "DISTINCT ELEMENTS"
    },
    exact_k: {
        invariant: "at_most(K) - at_most(K-1)",
        color: "text-purple-400",
        modelName: "EXACT K COMPOSITION"
    }
}
