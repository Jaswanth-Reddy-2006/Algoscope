import json
import os

patterns = [
    "Array", "Two Pointer", "Sliding Window", "Binary Search", "Recursion",
    "Backtracking", "Stack", "Queue", "Linked List", "Graph (BFS/DFS)",
    "Heap / Priority Queue", "Greedy", "Prefix Sum", "Dynamic Programming"
]

# Mapping algorithm types to patterns
type_to_pattern = {
    "two_pointer": "Two Pointer",
    "sliding_window": "Sliding Window",
    "binary_search": "Binary Search",
    "linked_list": "Linked List",
    "recursion": "Recursion",
    "stack": "Stack",
    "graph": "Graph (BFS/DFS)",
    "tree": "Recursion"
}

# Base metadata for LC style 1-100
metadata_map = {
    1: {"id": 1, "title": "Two Sum", "slug": "two-sum", "difficulty": "Easy", "algorithmType": "two_pointer", "primaryPattern": "Array", "shortPatternReason": "Requires finding a pair with a specific sum.", "time": "O(n)", "space": "O(n)"},
    3: {"id": 3, "title": "Longest Substring Without Repeating Characters", "slug": "longest-substring-without-repeating-characters", "difficulty": "Medium", "algorithmType": "sliding_window", "primaryPattern": "Sliding Window", "shortPatternReason": "Contiguous segment check for uniqueness.", "time": "O(n)", "space": "O(min(m, n))"},
    11: {"id": 11, "title": "Container With Most Water", "slug": "container-with-most-water", "difficulty": "Medium", "algorithmType": "two_pointer", "primaryPattern": "Two Pointer", "shortPatternReason": "Shrinking search space by moving pointers inward.", "time": "O(n)", "space": "O(1)"},
    15: {"id": 15, "title": "3Sum", "slug": "3sum", "difficulty": "Medium", "algorithmType": "two_pointer", "primaryPattern": "Two Pointer", "shortPatternReason": "Sorted array traversal with fixed element and two pointers.", "time": "O(n²)", "space": "O(log n) to O(n)"},
    20: {"id": 20, "title": "Valid Parentheses", "slug": "valid-parentheses", "difficulty": "Easy", "algorithmType": "stack", "primaryPattern": "Stack", "shortPatternReason": "LIFO behavior for matching brackets.", "time": "O(n)", "space": "O(n)"},
    21: {"id": 21, "title": "Merge Two Sorted Lists", "slug": "merge-two-sorted-lists", "difficulty": "Easy", "algorithmType": "linked_list", "primaryPattern": "Linked List", "shortPatternReason": "Pointer manipulation in sorted sequences.", "time": "O(n+m)", "space": "O(1)"},
    22: {"id": 22, "title": "Generate Parentheses", "slug": "generate-parentheses", "difficulty": "Medium", "algorithmType": "recursion", "primaryPattern": "Backtracking", "shortPatternReason": "Recursive generation with valid pairing constraints.", "time": "O(4ⁿ / √n)", "space": "O(n)"},
    23: {"id": 23, "title": "Merge k Sorted Lists", "slug": "merge-k-sorted-lists", "difficulty": "Hard", "algorithmType": "linked_list", "primaryPattern": "Heap / Priority Queue", "shortPatternReason": "K-way merge using a min-heap.", "time": "O(N log k)", "space": "O(k)"},
    33: {"id": 33, "title": "Search in Rotated Sorted Array", "slug": "search-in-rotated-sorted-array", "difficulty": "Medium", "algorithmType": "binary_search", "primaryPattern": "Binary Search", "shortPatternReason": "Logarithmic search in modified sorted space.", "time": "O(log n)", "space": "O(1)"},
    46: {"id": 46, "title": "Permutations", "slug": "permutations", "difficulty": "Medium", "algorithmType": "recursion", "primaryPattern": "Backtracking", "shortPatternReason": "Generating all possible orderings recursively.", "time": "O(n * n!)", "space": "O(n)"},
    49: {"id": 49, "title": "Group Anagrams", "slug": "group-anagrams", "difficulty": "Medium", "algorithmType": "two_pointer", "primaryPattern": "Array", "shortPatternReason": "Categorizing strings by sorted key or frequency frequency.", "time": "O(n * k log k)", "space": "O(n * k)"},
    53: {"id": 53, "title": "Maximum Subarray", "slug": "maximum-subarray", "difficulty": "Medium", "algorithmType": "two_pointer", "primaryPattern": "Dynamic Programming", "shortPatternReason": "Local vs Global maxima optimization (Kadane's).", "time": "O(n)", "space": "O(1)"},
    55: {"id": 55, "title": "Jump Game", "slug": "jump-game", "difficulty": "Medium", "algorithmType": "two_pointer", "primaryPattern": "Greedy", "shortPatternReason": "Tracking maximum reachable index greedily.", "time": "O(n)", "space": "O(1)"},
    56: {"id": 56, "title": "Merge Intervals", "slug": "merge-intervals", "difficulty": "Medium", "algorithmType": "two_pointer", "primaryPattern": "Array", "shortPatternReason": "Sorting and merging overlapping ranges.", "time": "O(n log n)", "space": "O(n)"},
    70: {"id": 70, "title": "Climbing Stairs", "slug": "climbing-stairs", "difficulty": "Easy", "algorithmType": "recursion", "primaryPattern": "Dynamic Programming", "shortPatternReason": "Optimal substructure using Fibonacci relation.", "time": "O(n)", "space": "O(1)"},
    74: {"id": 74, "title": "Search a 2D Matrix", "slug": "search-a-2d-matrix", "difficulty": "Medium", "algorithmType": "binary_search", "primaryPattern": "Binary Search", "shortPatternReason": "Treating matrix as flattened sorted array.", "time": "O(log(m*n))", "space": "O(1)"},
    76: {"id": 76, "title": "Minimum Window Substring", "slug": "minimum-window-substring", "difficulty": "Hard", "algorithmType": "sliding_window", "primaryPattern": "Sliding Window", "shortPatternReason": "Dynamic window expansion and contraction for constraint.", "time": "O(n+m)", "space": "O(m)"},
    78: {"id": 78, "title": "Subsets", "slug": "subsets", "difficulty": "Medium", "algorithmType": "recursion", "primaryPattern": "Backtracking", "shortPatternReason": "Power set generation via inclusion/exclusion.", "time": "O(n * 2ⁿ)", "space": "O(n)"},
    79: {"id": 79, "title": "Word Search", "slug": "word-search", "difficulty": "Medium", "algorithmType": "graph", "primaryPattern": "Backtracking", "shortPatternReason": "DFS traversal with state backtracking on grid.", "time": "O(N * 3ᴸ)", "space": "O(L)"},
    98: {"id": 98, "title": "Validate Binary Search Tree", "slug": "validate-binary-search-tree", "difficulty": "Medium", "algorithmType": "tree", "primaryPattern": "Recursion", "shortPatternReason": "Recursive range check for child nodes.", "time": "O(n)", "space": "O(n)"},
    102: {"id": 102, "title": "Binary Tree Level Order Traversal", "slug": "binary-tree-level-order-traversal", "difficulty": "Medium", "algorithmType": "tree", "primaryPattern": "Graph (BFS/DFS)", "shortPatternReason": "Queue-based breadth-first visit.", "time": "O(n)", "space": "O(n)"},
    104: {"id": 104, "title": "Maximum Depth of Binary Tree", "slug": "maximum-depth-of-binary-tree", "difficulty": "Easy", "algorithmType": "tree", "primaryPattern": "Recursion", "shortPatternReason": "Recursive height calculation (1 + max(L, R)).", "time": "O(n)", "space": "O(n)"},
    121: {"id": 121, "title": "Best Time to Buy and Sell Stock", "slug": "best-time-to-buy-and-sell-stock", "difficulty": "Easy", "algorithmType": "two_pointer", "primaryPattern": "Dynamic Programming", "shortPatternReason": "Tracking historical minimum for future profit.", "time": "O(n)", "space": "O(1)"},
    128: {"id": 128, "title": "Longest Consecutive Sequence", "slug": "longest-consecutive-sequence", "difficulty": "Medium", "algorithmType": "two_pointer", "primaryPattern": "Array", "shortPatternReason": "Unordered set lookup for sequence starts.", "time": "O(n)", "space": "O(n)"},
    133: {"id": 133, "title": "Clone Graph", "slug": "clone-graph", "difficulty": "Medium", "algorithmType": "graph", "primaryPattern": "Graph (BFS/DFS)", "shortPatternReason": "Deep copy using traversal and map state.", "time": "O(V+E)", "space": "O(V)"},
    136: {"id": 136, "title": "Single Number", "slug": "single-number", "difficulty": "Easy", "algorithmType": "two_pointer", "primaryPattern": "Array", "shortPatternReason": "XOR property to cancel out duplicates.", "time": "O(n)", "space": "O(1)"},
    139: {"id": 139, "title": "Word Break", "slug": "word-break", "difficulty": "Medium", "algorithmType": "two_pointer", "primaryPattern": "Dynamic Programming", "shortPatternReason": "Boolean DP tracking word segmentability.", "time": "O(n³)", "space": "O(n)"},
    141: {"id": 141, "title": "Linked List Cycle", "slug": "linked-list-cycle", "difficulty": "Easy", "algorithmType": "linked_list", "primaryPattern": "Two Pointer", "shortPatternReason": "Floyd's Tortoise and Hare detection.", "time": "O(n)", "space": "O(1)"},
    152: {"id": 152, "title": "Maximum Product Subarray", "slug": "maximum-product-subarray", "difficulty": "Medium", "algorithmType": "two_pointer", "primaryPattern": "Dynamic Programming", "shortPatternReason": "Tracking current min/max to handle negatives.", "time": "O(n)", "space": "O(1)"},
    153: {"id": 153, "title": "Find Minimum in Rotated Sorted Array", "slug": "find-minimum-in-rotated-sorted-array", "difficulty": "Medium", "algorithmType": "binary_search", "primaryPattern": "Binary Search", "shortPatternReason": "Logarithmic search for inflection point.", "time": "O(log n)", "space": "O(1)"},
    155: {"id": 155, "title": "Min Stack", "slug": "min-stack", "difficulty": "Easy", "algorithmType": "stack", "primaryPattern": "Stack", "shortPatternReason": "Auxiliary stack to track historical minima.", "time": "O(1)", "space": "O(n)"},
    198: {"id": 198, "title": "House Robber", "slug": "house-robber", "difficulty": "Medium", "algorithmType": "recursion", "primaryPattern": "Dynamic Programming", "shortPatternReason": "Non-adjacent max sum recurrence.", "time": "O(n)", "space": "O(1)"},
    200: {"id": 200, "title": "Number of Islands", "slug": "number-of-islands", "difficulty": "Medium", "algorithmType": "graph", "primaryPattern": "Graph (BFS/DFS)", "shortPatternReason": "Grid traversal to group connected components.", "time": "O(M*N)", "space": "O(M*N)"},
    206: {"id": 206, "title": "Reverse Linked List", "slug": "reverse-linked-list", "difficulty": "Easy", "algorithmType": "linked_list", "primaryPattern": "Two Pointer", "shortPatternReason": "In-place pointer reversal logic.", "time": "O(n)", "space": "O(1)"},
    207: {"id": 207, "title": "Course Schedule", "slug": "course-schedule", "difficulty": "Medium", "algorithmType": "graph", "primaryPattern": "Graph (BFS/DFS)", "shortPatternReason": "Cycle detection in DAG (Topological Sort).", "time": "O(V+E)", "space": "O(V+E)"},
    208: {"id": 208, "title": "Implement Trie (Prefix Tree)", "slug": "implement-trie", "difficulty": "Medium", "algorithmType": "tree", "primaryPattern": "Recursion", "shortPatternReason": "Character-based path traversal logic.", "time": "O(L)", "space": "O(Words * L)"},
    215: {"id": 215, "title": "Kth Largest Element in an Array", "slug": "kth-largest-element-in-an-array", "difficulty": "Medium", "algorithmType": "two_pointer", "primaryPattern": "Heap / Priority Queue", "shortPatternReason": "Min-heap for tracking top K elements.", "time": "O(n log k)", "space": "O(k)"},
    226: {"id": 226, "title": "Invert Binary Tree", "slug": "invert-binary-tree", "difficulty": "Easy", "algorithmType": "tree", "primaryPattern": "Recursion", "shortPatternReason": "Recursive swap of left and right children.", "time": "O(n)", "space": "O(n)"},
    230: {"id": 230, "title": "Kth Smallest Element in a BST", "slug": "kth-smallest-element-in-a-bst", "difficulty": "Medium", "algorithmType": "tree", "primaryPattern": "Recursion", "shortPatternReason": "Inorder traversal property of BST.", "time": "O(n)", "space": "O(n)"},
    232: {"id": 232, "title": "Implement Queue using Stacks", "slug": "implement-queue-using-stacks", "difficulty": "Easy", "algorithmType": "stack", "primaryPattern": "Queue", "shortPatternReason": "Simulating FIFO with two LIFO stacks.", "time": "O(1) amortized", "space": "O(n)"},
    236: {"id": 236, "title": "Lowest Common Ancestor of a Binary Tree", "slug": "lowest-common-ancestor-of-a-binary-tree", "difficulty": "Medium", "algorithmType": "tree", "primaryPattern": "Recursion", "shortPatternReason": "Recursive parent search with split logic.", "time": "O(n)", "space": "O(n)"},
    238: {"id": 238, "title": "Product of Array Except Self", "slug": "product-of-array-except-self", "difficulty": "Medium", "algorithmType": "two_pointer", "primaryPattern": "Prefix Sum", "shortPatternReason": "Prefix and suffix product arrays.", "time": "O(n)", "space": "O(1)"},
    239: {"id": 239, "title": "Sliding Window Maximum", "slug": "sliding-window-maximum", "difficulty": "Hard", "algorithmType": "sliding_window", "primaryPattern": "Sliding Window", "shortPatternReason": "Deque-based monotonic max tracking.", "time": "O(n)", "space": "O(k)"},
    300: {"id": 300, "title": "Longest Increasing Subsequence", "slug": "longest-increasing-subsequence", "difficulty": "Medium", "algorithmType": "two_pointer", "primaryPattern": "Dynamic Programming", "shortPatternReason": "DP relation or patience sorting logic.", "time": "O(n log n)", "space": "O(n)"},
    322: {"id": 322, "title": "Coin Change", "slug": "coin-change", "difficulty": "Medium", "algorithmType": "recursion", "primaryPattern": "Dynamic Programming", "shortPatternReason": "Bottom-up min combination optimization.", "time": "O(S*n)", "space": "O(S)"},
    347: {"id": 347, "title": "Top K Frequent Elements", "slug": "top-k-frequent-elements", "difficulty": "Medium", "algorithmType": "two_pointer", "primaryPattern": "Heap / Priority Queue", "shortPatternReason": "Frequency map + bucket sort or heap.", "time": "O(n)", "space": "O(n)"},
    394: {"id": 394, "title": "Decode String", "slug": "decode-string", "difficulty": "Medium", "algorithmType": "stack", "primaryPattern": "Stack", "shortPatternReason": "Nested expansion using count/string stacks.", "time": "O(n)", "space": "O(n)"},
    416: {"id": 416, "title": "Partition Equal Subset Sum", "slug": "partition-equal-subset-sum", "difficulty": "Medium", "algorithmType": "recursion", "primaryPattern": "Dynamic Programming", "shortPatternReason": "Subset sum variation (0/1 Knapsack).", "time": "O(n * target)", "space": "O(target)"},
    438: {"id": 438, "title": "Find All Anagrams in a String", "slug": "find-all-anagrams-in-a-string", "difficulty": "Medium", "algorithmType": "sliding_window", "primaryPattern": "Sliding Window", "shortPatternReason": "Fixed-size window frequency check.", "time": "O(n)", "space": "O(1)"},
    543: {"id": 543, "title": "Diameter of Binary Tree", "slug": "diameter-of-binary-tree", "difficulty": "Easy", "algorithmType": "tree", "primaryPattern": "Recursion", "shortPatternReason": "Recursive max path tracking through root.", "time": "O(n)", "space": "O(n)"},
    560: {"id": 560, "title": "Subarray Sum Equals K", "slug": "subarray-sum-equals-k", "difficulty": "Medium", "algorithmType": "two_pointer", "primaryPattern": "Prefix Sum", "shortPatternReason": "Prefix sums + map of frequencies.", "time": "O(n)", "space": "O(n)"},
    704: {"id": 704, "title": "Binary Search", "slug": "binary-search", "difficulty": "Easy", "algorithmType": "binary_search", "primaryPattern": "Binary Search", "shortPatternReason": "Standard logarithmic target lookup.", "time": "O(log n)", "space": "O(1)"},
    739: {"id": 739, "title": "Daily Temperatures", "slug": "daily-temperatures", "difficulty": "Medium", "algorithmType": "stack", "primaryPattern": "Stack", "shortPatternReason": "Monotonic stack for next-greater tracking.", "time": "O(n)", "space": "O(n)"},
    994: {"id": 994, "title": "Rotting Oranges", "slug": "rotting-oranges", "difficulty": "Medium", "algorithmType": "graph", "primaryPattern": "Graph (BFS/DFS)", "shortPatternReason": "BFS for shortest time level-by-level decay.", "time": "O(m*n)", "space": "O(m*n)"}
}

orig_file = 'backend/data/problems.json'
with open(orig_file, 'r') as f:
    existing_problems = json.load(f)

existing_map = {p['id']: p for p in existing_problems}

full_problems = []
current_ids = set()

# Process existing problems and enrich them
for pid, p in existing_map.items():
    if pid in metadata_map:
        m = metadata_map[pid]
        p['primaryPattern'] = m['primaryPattern']
        p['shortPatternReason'] = m['shortPatternReason']
        p['time_complexity'] = m['time']
        p['space_complexity'] = m['space']
        p['patternSignals'] = [m['shortPatternReason'], f"Uses {m['primaryPattern']} logic."]
        p['edgeCases'] = ["Empty input", "Single element", "Maximum constraints"]
        if p.get('status') == 'complete':
            p['status'] = 'strong'
    full_problems.append(p)
    current_ids.add(pid)

# Add missing metadata problems
for pid, m in metadata_map.items():
    if pid not in current_ids:
        p = {
            "id": pid,
            "title": m["title"],
            "slug": m["slug"],
            "difficulty": m["difficulty"],
            "algorithmType": m["algorithmType"],
            "status": "new",
            "tags": [m["primaryPattern"]],
            "primaryPattern": m["primaryPattern"],
            "shortPatternReason": m["shortPatternReason"],
            "time_complexity": m["time"],
            "space_complexity": m["space"],
            "problem_statement": f"Standard LeetCode problem: {m['title']}.",
            "constraints": ["N <= 10^5"],
            "examples": [],
            "brute_force_explanation": "Iterative approach checking all pairs/subsets.",
            "optimal_explanation": f"Optimal solution using {m['primaryPattern']}.",
            "brute_force_steps": [],
            "optimal_steps": [],
            "complexity": {"brute": "O(n²)", "optimal": m["time"], "space": m["space"]},
            "patternSignals": [m["shortPatternReason"]],
            "edgeCases": ["Small input", "Large values"],
            "thinking_guide": {
                "first_principles": [f"Understand the goal of {m['title']}."],
                "pattern_signals": [m["shortPatternReason"]],
                "naive_approach": ["Brute force checking all possibilities."],
                "approach_blueprint": ["1. Apply pattern", "2. Optimize"]
            }
        }
        full_problems.append(p)
        current_ids.add(pid)

# Finally, fill up to 100 with drilled patterns
next_id = 1000
while len(full_problems) < 100:
    while next_id in current_ids:
        next_id += 1
    
    idx = len(full_problems)
    pattern = patterns[idx % len(patterns)]
    p = {
        "id": next_id,
        "title": f"Pattern Drill {idx + 1}",
        "slug": f"pattern-drill-{idx + 1}",
        "difficulty": "Medium" if idx % 3 == 0 else "Easy",
        "algorithmType": "two_pointer",
        "status": "new",
        "tags": [pattern],
        "primaryPattern": pattern,
        "shortPatternReason": f"Fundamental drill for {pattern} recognition.",
        "time_complexity": "O(n)",
        "space_complexity": "O(1)",
        "problem_statement": f"Practice your {pattern} skills with this scenario.",
        "constraints": [],
        "examples": [],
        "brute_force_explanation": "",
        "optimal_explanation": "",
        "brute_force_steps": [],
        "optimal_steps": [],
        "complexity": {"brute": "O(n²)", "optimal": "O(n)", "space": "O(1)"}
    }
    full_problems.append(p)
    current_ids.add(next_id)

with open(orig_file, 'w') as f:
    json.dump(full_problems, f, indent=2)

print(f"Enriched and expanded to {len(full_problems)} problems.")
