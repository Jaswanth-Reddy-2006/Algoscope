import json

with open('backend/data/problems.json', 'r', encoding='utf-8') as f:
    problems = json.load(f)

# Hierarchy mapping
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
    old_type = p.get('algorithmType')
    level = TYPE_TO_LEVEL.get(old_type, 'core_patterns')
    primary = TYPE_TO_PRIMARY.get(old_type, 'sliding_window')
    
    # Update fields
    p['patternLevel'] = level
    p['primaryPattern'] = primary
    
    # Ensure subPattern exists and is valid
    if not p.get('subPattern'):
        p['subPattern'] = DEFAULT_SUB.get(primary, 'classic')

# Save updated problems
with open('backend/data/problems.json', 'w', encoding='utf-8') as f:
    json.dump(problems, f, indent=2)
