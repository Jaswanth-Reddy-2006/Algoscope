import { lazy, LazyExoticComponent, FC } from 'react'
import { AlgorithmType } from '../types'

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
        component: lazy(() => import('../visualization-engines/TwoPointerEngine'))
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
    'math': {
        component: lazy(() => import('../visualization-engines/TwoPointerEngine'))
    },
    'array': {
        component: lazy(() => import('../visualization-engines/MatrixEngine'))
    },
    'string': {
        component: lazy(() => import('../visualization-engines/TwoPointerEngine'))
    },
    'hash_table': {
        component: lazy(() => import('../visualization-engines/TwoPointerEngine'))
    }
}

/**
 * Standardized way to retrieve an engine component.
 * Allows for easy expansion as Algoscope grows to 1000+ problems.
 */
export const getEngine = (type: AlgorithmType) => {
    return engineRegistry[type]?.component || null
}
