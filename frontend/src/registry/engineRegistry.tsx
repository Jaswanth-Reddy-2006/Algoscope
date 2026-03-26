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
        component: lazy(() => import('../components/foundations/engines/RecursionEngine'))
    },
    'tree': {
        component: lazy(() => import('../components/foundations/engines/RecursionEngine'))
    },
    'binary_tree': {
        component: lazy(() => import('../components/foundations/engines/RecursionEngine'))
    },
    'bst': {
        component: lazy(() => import('../components/foundations/engines/RecursionEngine'))
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
    'union_find': {
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
    }
}

/**
 * Robust engine resolver that maps descriptive AI-generated patterns to visualizers.
 */
export const resolveEngine = (problem: Problem) => {
    // 0. Hard Override for Foundation Problems (IDs 1-50)
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
        20: 'linked_list',
        21: 'linked_list'
    };

    if (foundationOverrides[problem.id]) {
        return engineRegistry[foundationOverrides[problem.id]]?.component;
    }

    // 1. Check direct algorithmType first
    if (problem.algorithmType && engineRegistry[problem.algorithmType]) {
        return engineRegistry[problem.algorithmType]?.component;
    }

    // 2. Resolve via primaryPattern keyword matching
    const pattern = (problem.primaryPattern || "").toLowerCase();
    
    if (pattern.includes('tree') || pattern.includes('dfs') || pattern.includes('recursive')) {
        return engineRegistry['tree']?.component;
    }
    if (pattern.includes('two pointer') || pattern.includes('binary search') || pattern.includes('sorted')) {
        if (pattern.includes('binary search')) return engineRegistry['binary_search']?.component;
        return engineRegistry['two_pointers']?.component;
    }
    if (pattern.includes('window')) {
        return engineRegistry['sliding_window']?.component;
    }
    if (pattern.includes('list')) {
        return engineRegistry['linked_list']?.component;
    }
    if (pattern.includes('heap')) {
        return engineRegistry['heap']?.component;
    }
    if (pattern.includes('graph') || pattern.includes('island') || pattern.includes('path')) {
        return engineRegistry['graph']?.component;
    }
    if (pattern.includes('bit')) {
        return engineRegistry['bit_manipulation']?.component;
    }
    if (pattern.includes('sql') || pattern.includes('query')) {
        return engineRegistry['math']?.component;
    }
    if (pattern.includes('hash') || pattern.includes('map') || pattern.includes('table')) {
        return engineRegistry['hash_table']?.component;
    }

    // 3. Fallback to Matrix/Array for general problem structures
    return engineRegistry['array']?.component;
}

export const getEngine = (type: AlgorithmType) => {
    return engineRegistry[type]?.component || null
}
