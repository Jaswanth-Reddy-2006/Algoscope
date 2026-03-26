import json

# Load Hierarchy
# Since it's a TS file, I'll manually define the valid keys here for validation
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

with open('backend/data/problems.json', 'r', encoding='utf-8') as f:
    problems = json.load(f)

errors = []
for p in problems:
    pid = p.get('id')
    title = p.get('title')
    level = p.get('patternLevel')
    primary = p.get('primaryPattern')
    sub = p.get('subPattern')
    
    if not level or level not in VALID_HIERARCHY:
        errors.append(f"Problem {pid} ({title}): Invalid patternLevel '{level}'")
        continue
        
    if not primary or primary not in VALID_HIERARCHY[level]:
        errors.append(f"Problem {pid} ({title}): Invalid primaryPattern '{primary}' for level '{level}'")
        continue
        
    if not sub or sub not in VALID_HIERARCHY[level][primary]:
        errors.append(f"Problem {pid} ({title}): Invalid subPattern '{sub}' for pattern '{primary}'")

if errors:
    print(f"Validation failed with {len(errors)} errors:")
    for e in errors[:20]: # Show first 20
        print(e)
    if len(errors) > 20:
        print("...")
else:
    print("Validation passed! All problems align with taxonomy.")
