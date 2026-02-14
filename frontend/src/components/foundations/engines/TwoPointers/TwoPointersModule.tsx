import React from 'react'
import { SubPattern } from '../../../../types/foundation'
import { TwoPointersComparison } from './TwoPointersComparison'

interface Props {
    subPattern: SubPattern
    activeTab: string
}

const TwoPointersModule: React.FC<Props> = ({ subPattern, activeTab }) => {
    // If mental model tab, parent handles it
    if (activeTab === 'mental_model') {
        return null
    }

    return (
        <TwoPointersComparison mode={subPattern.id} />
    )
}

export default TwoPointersModule
