export type PatternLevel = 'data_structures' | 'core_patterns' | 'advanced_patterns';

export interface SubPatternDetails {
    id: string;
    title: string;
    signals: string[];
    invariant: string;
    formula: string;
    mistakes: string[];
}

export interface PatternDefinition {
    title: string;
    subPatterns: string[];
}

export interface PatternGroup {
    title: string;
    patterns: Record<string, PatternDefinition>;
}

export const PATTERN_HIERARCHY: Record<PatternLevel, PatternGroup> = {
    data_structures: {
        title: "Data Structures",
        patterns: {
            arrays: {
                title: "Array",
                subPatterns: ["memory_model", "dynamic_resizing", "insertion_deletion", "traversal"]
            },
            strings: {
                title: "String",
                subPatterns: ["immutability", "string_builder", "substrings", "ascii_unicode"]
            },
            stacks: {
                title: "Stack",
                subPatterns: ["lifo_principle", "push_pop", "array_implementation", "linked_list_implementation"]
            },
            queues: {
                title: "Queue",
                subPatterns: ["fifo_principle", "enqueue_dequeue", "circular_queue", "deque_intro"]
            },
            hash_maps: {
                title: "Hash Map",
                subPatterns: ["hashing_function", "collision_resolution", "load_factor", "set_operations"]
            },
            linked_lists: {
                title: "Linked List",
                subPatterns: ["singly_linked", "doubly_linked", "pointer_manipulation", "cycles"]
            },
            heaps: {
                title: "Heap / Priority Queue",
                subPatterns: ["binary_heap", "min_max_heap", "heapify", "priority_queue_usage"]
            },
            matrices: {
                title: "Matrix (2D Arrays)",
                subPatterns: ["row_col_traversal", "layer_traversal", "transpose", "submatrices"]
            },
            prefix_sums: {
                title: "Prefix Sum",
                subPatterns: ["1d_range_sum", "2d_range_sum", "difference_array", "equilibrium_index"]
            },
            bit_manipulation: {
                title: "Bit Manipulation",
                subPatterns: ["bitwise_operators", "masking", "single_number", "power_of_two"]
            }
        }
    },

    core_patterns: {
        title: "Core Patterns",
        patterns: {
            two_pointers: {
                title: "Two Pointers",
                subPatterns: [
                    "same_direction",
                    "opposite_direction",
                    "slow_fast_pointer",
                    "partition_pattern"
                ]
            },
            sliding_window: {
                title: "Sliding Window",
                subPatterns: [
                    "fixed_window",
                    "variable_window",
                    "at_most_k",
                    "exact_k",
                    "minimum_type"
                ]
            },
            binary_search: {
                title: "Binary Search",
                subPatterns: [
                    "classic",
                    "lower_bound",
                    "upper_bound",
                    "search_on_answer",
                    "rotated_array_search"
                ]
            },
            monotonic_stack: {
                title: "Monotonic Stack",
                subPatterns: ["next_greater_element", "next_smaller_element", "histogram_area", "sliding_window_max"]
            },
            fast_slow_pointers: {
                title: "Fast & Slow Pointers",
                subPatterns: ["cycle_detection", "middle_of_list", "happy_number", "palindrome_linked_list"]
            },
            cyclic_sort: {
                title: "Cyclic Sort",
                subPatterns: ["missing_number", "find_duplicate", "corrupt_pair", "smallest_missing_positive"]
            },
            merge_intervals: {
                title: "Merge Intervals",
                subPatterns: ["overlapping_intervals", "insert_interval", "interval_intersection", "meeting_rooms"]
            },
            greedy: {
                title: "Greedy Fundamentals",
                subPatterns: ["activity_selection", "huffman_coding_logic", "fractional_knapsack", "jump_game_logic"]
            },
            recursion: {
                title: "Recursion",
                subPatterns: ["base_case_logic", "recurrence_relation", "call_stack_visualization", "memoization_intro"]
            },
            backtracking: {
                title: "Backtracking",
                subPatterns: ["state_space_tree", "subsets", "permutations", "n_queens_logic"]
            },
            bfs: {
                title: "BFS",
                subPatterns: ["level_order_traversal", "shortest_path_unweighted", "connected_components", "bipartite_check"]
            },
            dfs: {
                title: "DFS",
                subPatterns: ["preorder_inorder_postorder", "path_finding", "cycle_detection_directed", "topological_sort_logic"]
            },
            topological_sort: {
                title: "Topological Sort",
                subPatterns: ["kahn_algorithm", "dfs_approach", "course_schedule_logic", "alien_dictionary_logic"]
            },
            union_find: {
                title: "Union Find",
                subPatterns: ["quick_find", "quick_union", "path_compression", "rank_optimization"]
            }
        }
    },

    advanced_patterns: {
        title: "Advanced Patterns",
        patterns: {
            dp_1d: {
                title: "Dynamic Programming (1D)",
                subPatterns: ["climbing_stairs_logic", "fibonacci_memoization", "house_robber", "longest_increasing_subsequence"]
            },
            dp_2d: {
                title: "Dynamic Programming (2D)",
                subPatterns: ["grid_traveler", "obstacle_grid", "min_path_sum", "0_1_knapsack"]
            },
            dp_strings: {
                title: "DP on Strings",
                subPatterns: ["lcs", "edit_distance", "longest_palindromic_subsequence", "wildcard_matching"]
            },
            trie: {
                title: "Trie",
                subPatterns: ["insert_search", "prefix_matching", "autocomplete_logic", "word_search_ii"]
            },
            segment_tree: {
                title: "Segment Tree",
                subPatterns: ["range_sum_query", "range_min_query", "lazy_propagation", "fenwick_tree_comparison"]
            },
            graph_advanced: {
                title: "Advanced Graph",
                subPatterns: ["dijkstra", "bellman_ford", "prim_mst", "kruskal_mst"]
            },
            string_matching: {
                title: "String Matching",
                subPatterns: ["kmp_algorithm", "rabin_karp", "z_algorithm"]
            }
        }
    }
};

// Helper to get flat pattern info for easy lookups
export const getPatternInfo = (patternId: string) => {
    for (const [level, group] of Object.entries(PATTERN_HIERARCHY)) {
        if (group.patterns[patternId]) {
            return {
                level: level as PatternLevel,
                title: group.patterns[patternId].title,
                subPatterns: group.patterns[patternId].subPatterns
            };
        }
    }
    return null;
};
