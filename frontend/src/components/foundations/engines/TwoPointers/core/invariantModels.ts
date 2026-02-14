
export interface InvariantModel {
    formula: string
    explanation: string
    color: string
}

export const INVARIANT_MODELS: Record<string, InvariantModel> = {
    two_sum_sorted: {
        formula: 'left < right',
        explanation: 'In a sorted array, we move pointers inward to narrow the search space.',
        color: 'from-blue-500/20 to-cyan-500/20'
    },
    container_most_water: {
        formula: 'min(h[l], h[r]) * (r - l)',
        explanation: 'We always move the shorter wall inward, as it is the limiting factor for area.',
        color: 'from-blue-500/20 to-indigo-500/20'
    },
    palindrome_check: {
        formula: 's[left] == s[right]',
        explanation: 'Characters at symmetric positions must be equal for a valid palindrome.',
        color: 'from-emerald-500/20 to-teal-500/20'
    },
    move_zeroes: {
        formula: 'slow <= fast',
        explanation: 'Slow pointer marks the boundary for non-zero elements; fast scans the array.',
        color: 'from-orange-500/20 to-amber-500/20'
    },
    remove_duplicates: {
        formula: 'nums[slow] != nums[fast]',
        explanation: 'When a new unique element is found, we swap it to the next unique spot.',
        color: 'from-purple-500/20 to-pink-500/20'
    },
    partition_array: {
        formula: 'arr[fast] < pivot',
        explanation: 'Elements smaller than the pivot are swapped into the left (low) section.',
        color: 'from-rose-500/20 to-red-500/20'
    },
    cycle_detection: {
        formula: 'slow == fast (collision)',
        explanation: 'If a cycle exists, the fast pointer will eventually lap the slow pointer.',
        color: 'from-yellow-500/20 to-orange-500/20'
    },
    linked_list_mid: {
        formula: 'fast moves 2x steps',
        explanation: 'By the time the fast pointer reaches the end, the slow pointer is at the middle.',
        color: 'from-cyan-500/20 to-blue-500/20'
    },
    happy_number: {
        formula: 'n != 1 && slow != fast',
        explanation: 'Detection of whether the sum of squares sequence terminates at 1 or cycles.',
        color: 'from-green-500/20 to-emerald-500/20'
    },
    dnf_partition: {
        formula: '0s < l, 1s [l..m], 2s > h',
        explanation: 'Three-way partitioning ensures all identical colors are grouped together.',
        color: 'from-red-500/20 via-white/20 to-blue-500/20'
    }
}
