import { CheckCircle2 } from 'lucide-react'
// removed unused import

interface Props {
    subPatternId: string
}

const SUFFICIENCY_DATA: Record<string, { points: string[]; proof: string }> = {
    fixed_window: {
        points: [
            'No redundant recomputation (each element processed ≤ 2 times)',
            'Window always valid (size === K guaranteed)',
            'Linear time (right moves N times, left moves ≤ N times)'
        ],
        proof: 'Since right pointer moves N times and left pointer moves at most N times, total operations = 2N = O(N). Each window is computed in O(1) by reusing previous sum.'
    },
    variable_window: {
        points: [
            'No redundant computation (each element added/removed once)',
            'Window always valid (shrink until constraint satisfied)',
            'Linear time (both pointers move at most N times total)'
        ],
        proof: 'Left and right pointers each traverse the array at most once. Total pointer movements ≤ 2N = O(N). Window validation is O(1) per step.'
    },
    at_most_k: {
        points: [
            'Counts all valid subarrays (right - left + 1 per position)',
            'No double counting (each subarray counted exactly once)',
            'Linear time (single pass with O(1) updates)'
        ],
        proof: 'For each right position, we count subarrays ending at right. Formula (right - left + 1) counts all valid prefixes. Single pass = O(N).'
    },
    exact_k: {
        points: [
            'Identity eliminates double counting',
            'Reuses at_most(k) logic (proven O(N))',
            'Two passes = O(N) + O(N) = O(N)'
        ],
        proof: 'at_most(k) includes subarrays with ≤ k elements. at_most(k-1) includes subarrays with ≤ k-1 elements. Difference = exactly k elements. Two O(N) passes = O(N).'
    },
    opposite_direction: {
        points: [
            'Safe reduction of search space',
            'No valid pairs skipped (due to sorted monotonic property)',
            'Guaranteed O(N) completion'
        ],
        proof: 'Each step moves either left or right pointer exactly once toward the middle. There are N-1 steps total. This is strictly better than O(N²) nested loops.'
    },
    same_direction: {
        points: [
            'Complete coverage (scanner visits every element)',
            'Invariant maintained at write boundary',
            'In-place modification (O(1) space)'
        ],
        proof: 'The fast pointer increments every iteration. The slow pointer increments at most N times. Total work = O(N). Boundary ensures property is held.'
    },
    fast_slow: {
        points: [
            'Distance closure (gap closes by 1 each step)',
            'Bounded detection time',
            'No extra space needed for history'
        ],
        proof: 'If a cycle exists, the distance between Fast and Slow increases by 1 relative to the cycle length until they overlap. Maximum steps ≤ List Length.'
    },
    partition: {
        points: [
            'Deterministic placement (pivot in final spot)',
            'Disjoint sets (smaller to left, larger to right)',
            'Basis for recursive sorting'
        ],
        proof: 'One pass through the array compares N elements. Swaps occur only when property is met. Final pivot swap places it exactly where it belongs in sorted order.'
    }
}

export const InvariantSufficiencyCard: React.FC<Props> = ({ subPatternId }) => {
    const data = SUFFICIENCY_DATA[subPatternId] || SUFFICIENCY_DATA.fixed_window

    return (
        <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/5">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <CheckCircle2 size={20} className="text-green-400" />
                <h3 className="text-lg font-bold text-white">Why This Invariant Is Enough</h3>
            </div>

            {/* Key Points */}
            <div className="space-y-3 mb-6">
                {data.points.map((point, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center shrink-0 mt-0.5">
                            <span className="text-xs font-bold text-green-400">{idx + 1}</span>
                        </div>
                        <p className="text-sm text-white/80">{point}</p>
                    </div>
                ))}
            </div>

            {/* Mathematical Proof */}
            <div className="p-4 rounded-xl bg-black/30 border border-white/10">
                <div className="text-xs uppercase tracking-widest text-white/40 mb-2">
                    Mathematical Proof
                </div>
                <p className="text-sm text-white/70 leading-relaxed">
                    {data.proof}
                </p>
            </div>
        </div>
    )
}
