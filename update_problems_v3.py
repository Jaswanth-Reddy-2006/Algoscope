import json

with open('backend/data/problems.json', 'r', encoding='utf-8') as f:
    problems = json.load(f)

# Valid Taxonomy
VALID_HIERARCHY = {
    "foundation": {
        "array_basics": ["prefix_sum", "difference_array", "cyclic_sort", "in_place_rearrangement"],
        "string_basics": ["character_frequency", "anagram_checking", "two_pointer_string"]
    },
    "core_patterns": {
        "two_pointer": ["same_direction", "opposite_direction", "slow_fast_pointer", "partition_pattern", "cycle_detection"],
        "sliding_window": ["fixed_window", "variable_window", "at_most_k", "exact_k", "longest_type", "minimum_type"],
        "binary_search": ["classic", "lower_bound", "upper_bound", "search_on_answer", "predicate_binary_search", "rotated_array_search"]
    },
    "advanced_patterns": {
        "graph_traversal": ["bfs_level_order", "dfs_backtracking", "topological_sort", "shortest_path_unweighted"],
        "tree_patterns": ["postorder_accumulation", "path_sum", "diameter_calculation", "lca"]
    }
}

# Specific mappings for common problems
SLUG_TO_METADATA = {
    "two-sum": ("core_patterns", "two_pointer", "opposite_direction"),
    "add-two-numbers": ("core_patterns", "two_pointer", "same_direction"),
    "longest-substring-without-repeating-characters": ("core_patterns", "sliding_window", "variable_window"),
    "median-of-two-sorted-arrays": ("core_patterns", "binary_search", "classic"),
    "longest-palindromic-substring": ("core_patterns", "two_pointer", "opposite_direction"),
    "container-with-most-water": ("core_patterns", "two_pointer", "opposite_direction"),
    "3sum": ("core_patterns", "two_pointer", "opposite_direction"),
    "climbing-stairs": ("advanced_patterns", "tree_patterns", "postorder_accumulation"),
    "merge-k-sorted-lists": ("core_patterns", "two_pointer", "same_direction"),
    "reverse-nodes-in-k-group": ("core_patterns", "two_pointer", "same_direction"),
    "search-in-rotated-sorted-array": ("core_patterns", "binary_search", "rotated_array_search"),
    "trapping-rain-water": ("core_patterns", "two_pointer", "opposite_direction"),
    "permutations": ("advanced_patterns", "graph_traversal", "dfs_backtracking"),
    "subsets": ("advanced_patterns", "graph_traversal", "dfs_backtracking"),
    "word-search": ("advanced_patterns", "graph_traversal", "dfs_backtracking"),
    "binary-tree-level-order-traversal": ("advanced_patterns", "graph_traversal", "bfs_level_order"),
}

TYPE_TO_LEVEL = {
    'two_pointer': 'core_patterns',
    'sliding_window': 'core_patterns',
    'binary_search': 'core_patterns',
    'tree': 'advanced_patterns',
    'graph': 'advanced_patterns',
    'stack': 'foundation',
    'linked_list': 'core_patterns',
    'recursion': 'advanced_patterns'
}

TYPE_TO_PRIMARY = {
    'two_pointer': 'two_pointer',
    'sliding_window': 'sliding_window',
    'binary_search': 'binary_search',
    'tree': 'tree_patterns',
    'graph': 'graph_traversal',
    'stack': 'array_basics',
    'linked_list': 'two_pointer',
    'recursion': 'tree_patterns'
}

DEFAULT_SUB = {
    'two_pointer': 'same_direction',
    'sliding_window': 'variable_window',
    'binary_search': 'classic',
    'tree_patterns': 'postorder_accumulation',
    'graph_traversal': 'bfs_level_order',
    'array_basics': 'prefix_sum',
    'string_basics': 'character_frequency'
}

for p in problems:
    slug = p.get('slug')
    
    if slug in SLUG_TO_METADATA:
        level, primary, sub = SLUG_TO_METADATA[slug]
        p['patternLevel'] = level
        p['primaryPattern'] = primary
        p['subPattern'] = sub
    else:
        old_type = p.get('algorithmType')
        level = TYPE_TO_LEVEL.get(old_type, 'core_patterns')
        primary = TYPE_TO_PRIMARY.get(old_type, 'sliding_window')
        
        # Fallback for recursion/unmapped types
        if level not in VALID_HIERARCHY: level = 'core_patterns'
        if primary not in VALID_HIERARCHY[level]: 
            # Find a valid primary for this level
            primary = list(VALID_HIERARCHY[level].keys())[0]
            
        p['patternLevel'] = level
        p['primaryPattern'] = primary
        
        # Ensure subPattern is valid for the primary
        sub = p.get('subPattern')
        if not sub or sub not in VALID_HIERARCHY[level][primary]:
            p['subPattern'] = DEFAULT_SUB.get(primary, VALID_HIERARCHY[level][primary][0])

# Final Validation Check within script
for p in problems:
    assert p['patternLevel'] in VALID_HIERARCHY
    assert p['primaryPattern'] in VALID_HIERARCHY[p['patternLevel']]
    assert p['subPattern'] in VALID_HIERARCHY[p['patternLevel']][p['primaryPattern']]

with open('backend/data/problems.json', 'w', encoding='utf-8') as f:
    json.dump(problems, f, indent=2)

print("Problems updated and validated successfully.")
