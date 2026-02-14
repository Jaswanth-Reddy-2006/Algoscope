import React from 'react'
import { SubPatternSelector } from './SubPatternSelector'
import { SubPatternFullView } from './SubPatternFullView'
import { FoundationModule } from '../../types/foundation'

interface Props {
    moduleId?: string
    module: FoundationModule
    activeSubPatternId: string | null
    setActiveSubPatternId: (id: string | null) => void
}

export const SubPatternTab: React.FC<Props> = ({ moduleId, module, activeSubPatternId, setActiveSubPatternId }) => {
    if (activeSubPatternId) {
        const subPattern = module?.subPatterns?.find(p => p.id === activeSubPatternId)

        if (subPattern) {
            return (
                <SubPatternFullView
                    moduleId={moduleId}
                    subPattern={subPattern}
                    onBack={() => setActiveSubPatternId(null)}
                />
            )
        }
    }

    return (
        <SubPatternSelector
            patterns={module?.subPatterns ?? []}
            onSelect={setActiveSubPatternId}
        />
    )
}
