const PATTERN_MAP = {
    // Array / Two Pointers
    'two-sum': 'two_pointers',
    'three-sum': 'two_pointers',
    'container-with-most-water': 'two_pointers',
    'remove-duplicates-from-sorted-array': 'two_pointers',
    'trapping-rain-water': 'two_pointers',
    
    // Sliding Window
    'longest-substring-without-repeating-characters': 'sliding_window',
    'minimum-window-substring': 'sliding_window',
    'sliding-window-maximum': 'sliding_window',
    
    // Binary Search
    'binary-search': 'binary_search',
    'search-in-rotated-sorted-array': 'binary_search',
    'find-minimum-in-rotated-sorted-array': 'binary_search',
    
    // Stack
    'valid-parentheses': 'stack',
    'min-stack': 'stack',
    'largest-rectangle-in-histogram': 'stack',
    
    // Trees
    'binary-tree-inorder-traversal': 'trees',
    'maximum-depth-of-binary-tree': 'trees',
    'invert-binary-tree': 'trees',
    
    // Graphs
    'number-of-islands': 'graphs',
    'clone-graph': 'graphs',
    'course-schedule': 'graphs',
    
    // DP
    'climbing-stairs': 'dynamic_programming',
    'coin-change': 'dynamic_programming',
    'longest-increasing-subsequence': 'dynamic_programming',
    'edit-distance': 'dynamic_programming'
};

const getPatternForSlug = (slug) => {
    // Direct match
    if (PATTERN_MAP[slug]) return PATTERN_MAP[slug];
    
    // Heuristic matches
    if (slug.includes('tree')) return 'trees';
    if (slug.includes('graph') || slug.includes('island')) return 'graphs';
    if (slug.includes('sum') || slug.includes('array')) return 'arrays';
    if (slug.includes('string')) return 'strings';
    if (slug.includes('linked-list')) return 'linked_lists';
    if (slug.includes('search')) return 'binary_search';
    
    return 'arrays'; // Generic fallback
};

module.exports = { getPatternForSlug };
