import { lazy, LazyExoticComponent, FC } from 'react'
import { AlgorithmType, Problem } from '../types'

interface EngineEntry {
    component: LazyExoticComponent<FC<any>>
}

export const engineRegistry: Partial<Record<AlgorithmType, EngineEntry>> = {
    'two_pointer': {
        component: lazy(() => import('../visualization-engines/TwoPointerEngine'))
    },
    'two_pointers': {
        component: lazy(() => import('../visualization-engines/TwoPointerEngine'))
    },
    'sliding_window': {
        component: lazy(() => import('../visualization-engines/SlidingWindowEngine'))
    },
    'linked_list': {
        component: lazy(() => import('../visualization-engines/LinkedListEngine'))
    },
    'binary_search': {
        component: lazy(() => import('../visualization-engines/BinarySearchEngine'))
    },
    'dynamic_programming': {
        component: lazy(() => import('../visualization-engines/MatrixEngine'))
    },
    'recursion': {
        component: lazy(() => import('../visualization-engines/RecursionTreeEngine'))
    },
    'backtracking': {
        component: lazy(() => import('../visualization-engines/RecursionTreeEngine'))
    },
    'tree': {
        component: lazy(() => import('../visualization-engines/RecursionTreeEngine'))
    },
    'binary_tree': {
        component: lazy(() => import('../visualization-engines/RecursionTreeEngine'))
    },
    'bst': {
        component: lazy(() => import('../visualization-engines/RecursionTreeEngine'))
    },
    'heap': {
        component: lazy(() => import('../visualization-engines/HeapEngine'))
    },
    'trie': {
        component: lazy(() => import('../visualization-engines/TrieEngine'))
    },
    'graph': {
        component: lazy(() => import('../visualization-engines/GraphEngine'))
    },
    'matrix': {
        component: lazy(() => import('../visualization-engines/MatrixEngine'))
    },
    'bit_manipulation': {
        component: lazy(() => import('../visualization-engines/BitManipulationEngine'))
    },
    'math': {
        component: lazy(() => import('../visualization-engines/TwoPointerEngine'))
    },
    'array': {
        component: lazy(() => import('../visualization-engines/MatrixEngine'))
    },
    'arrays': {
        component: lazy(() => import('../visualization-engines/MatrixEngine'))
    },
    'string': {
        component: lazy(() => import('../visualization-engines/TwoPointerEngine'))
    },
    'hash_table': {
        component: lazy(() => import('../visualization-engines/HashTableEngine'))
    },
    'hash_map': {
        component: lazy(() => import('../visualization-engines/HashTableEngine'))
    },
    'sorting': {
        component: lazy(() => import('../visualization-engines/SortingEngine'))
    },
    'union_find': {
        component: lazy(() => import('../visualization-engines/UnionFindEngine'))
    }
}

/**
 * Robust engine resolver that maps descriptive AI-generated patterns to visualizers.
 * This is the "brain" that ensures each of the 3,900 problems gets the suitable visualization.
 */
export const resolveEngine = (problem: Problem) => {
    // 0. Hard Override for Foundation Problems (IDs 1-100)
    const foundationOverrides: Record<number, AlgorithmType> = {
        1: 'hash_table',
        2: 'linked_list',
        3: 'sliding_window',
        4: 'two_pointers',
        5: 'two_pointers',
        6: 'matrix',
        7: 'hash_table',
        8: 'two_pointers',
        9: 'two_pointers',
        10: 'matrix',
        11: 'two_pointers',
        15: 'two_pointers',
        16: 'two_pointers',
        17: 'recursion',
        18: 'two_pointers',
        20: 'linked_list',
        21: 'linked_list',
        121: 'array'
    };

    if (foundationOverrides[problem.id]) {
        return engineRegistry[foundationOverrides[problem.id]]?.component;
    }

    // 1. Check direct algorithmType first
    if (problem.algorithmType && engineRegistry[problem.algorithmType]) {
        return engineRegistry[problem.algorithmType]?.component;
    }

    // 2. Resolve via keyword matching from primaryPattern, tags, and problem statement
    const pattern = (problem.primaryPattern || "").toLowerCase();
    const tags = (problem.tags || []).join(' ').toLowerCase();
    const statement = (problem.problem_statement || "").toLowerCase();

    // -- RECURSION / TREES / BACKTRACKING --
    if (pattern.includes('tree') || pattern.includes('dfs') || pattern.includes('recursive') || 
        tags.includes('tree') || tags.includes('recursion') || tags.includes('backtracking') ||
        statement.includes('recursive') || statement.includes('binary tree')) {
        return engineRegistry['tree']?.component;
    }

    // -- SEARCH / POINTERS --
    if (pattern.includes('binary search') || tags.includes('binary search')) {
        return engineRegistry['binary_search']?.component;
    }
    if (pattern.includes('two pointer') || pattern.includes('pointer') || tags.includes('two pointers') ||
        statement.includes('two pointers')) {
        return engineRegistry['two_pointers']?.component;
    }

    // -- WINDOWS --
    if (pattern.includes('window') || tags.includes('sliding window') || statement.includes('sliding window')) {
        return engineRegistry['sliding_window']?.component;
    }

    // -- LINEAR STRUCTURES --
    if (pattern.includes('list') || tags.includes('linked list') || statement.includes('linked list')) {
        return engineRegistry['linked_list']?.component;
    }
    if (pattern.includes('stack') || pattern.includes('queue') || tags.includes('stack') || tags.includes('queue')) {
        return engineRegistry['hash_table']?.component; // Fallback to Hash for stack/queue viz for now or specialized
    }

    // -- ADVANCED STRUCTURES --
    if (pattern.includes('heap') || pattern.includes('priority') || tags.includes('heap')) {
        return engineRegistry['heap']?.component;
    }
    if (pattern.includes('trie') || tags.includes('trie')) {
        return engineRegistry['trie']?.component;
    }
    if (pattern.includes('graph') || pattern.includes('island') || pattern.includes('path') || 
        tags.includes('graph') || tags.includes('union find') || tags.includes('disjoint set') || 
        statement.includes('graph')) {
        if (tags.includes('union find') || tags.includes('disjoint set')) return engineRegistry['union_find']?.component;
        return engineRegistry['graph']?.component;
    }

    // -- SORTING --
    if (pattern.includes('sort') || tags.includes('sorting') || statement.includes('sort colors')) {
        return engineRegistry['sorting']?.component;
    }

    // -- SYSTEMS --
    if (pattern.includes('bit') || tags.includes('bit manipulation') || statement.includes('bitwise')) {
        return engineRegistry['bit_manipulation']?.component;
    }
    if (pattern.includes('hash') || pattern.includes('map') || pattern.includes('table') || 
        tags.includes('hash table') || tags.includes('hash map')) {
        return engineRegistry['hash_table']?.component;
    }

    // -- GRID / MATRIX --
    if (pattern.includes('matrix') || pattern.includes('grid') || tags.includes('matrix') || 
        tags.includes('2d array') || statement.includes('grid')) {
        return engineRegistry['matrix']?.component;
    }

    // 3. Last Resort Fallback (The Swiss Army Knife)
    return engineRegistry['array']?.component;
}

export const getEngine = (type: AlgorithmType) => {
    return engineRegistry[type]?.component || null
}
