import { PatternEngine } from '../../types/engine'
import { SlidingWindowPattern } from './engines/SlidingWindowPattern'
import DataStructureEngine from './engines/DataStructureEngine.tsx' // Keep this import as it's used in the 'array' entry
import RecursionEngine from './engines/RecursionEngine.tsx'
import GraphEngine from './engines/GraphEngine.tsx'
import FormulaEngine from './engines/FormulaEngine.tsx'
import SortingEngine from './engines/SortingEngine.tsx'
import StringVisualizer from './engines/structures/StringVisualizer'

// Temporary: Map legacy components to ANY until they are refactored
const legacyRegistry: Record<string, any> = {
    // 'two_pointer': TwoPointerEngine, 
    // ... others
}

export interface EngineProps {
    moduleId: string
    mode?: string
    edgeCase?: string
}

export const foundationEngineRegistry: Record<string, PatternEngine<any, any> | React.FC<EngineProps>> = {
    'sliding_window': SlidingWindowPattern,
    ...legacyRegistry,

    // Fallback Category Mappings
    array: (props) => <DataStructureEngine {...props} type="array" />, // Will eventually point to ArrayVisualizer directly if we refactor DSE
    // For now DSE wraps ArrayVisualizer, but let's check DSE... 
    // Wait, I updated ArrayVisualizer but DSE uses it. 
    // To be clean, 'strings' should point to StringVisualizer.

    strings: (_props) => <StringVisualizer />, // Added this

    stack: (props) => <DataStructureEngine {...props} type="stack" />,
    queue: (props) => <DataStructureEngine {...props} type="queue" />,
    hash_map: (props) => <DataStructureEngine {...props} type="hash_map" />,
    linked_list: (props) => <DataStructureEngine {...props} type="linked_list" />,
    recursion: (props) => <RecursionEngine {...props} />,
    graph: (props) => <GraphEngine {...props} />,
    sorting: (props) => <SortingEngine {...props} />,
    formula: (props) => <FormulaEngine {...props} />,
}
