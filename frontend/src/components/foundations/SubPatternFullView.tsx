import React from 'react'
import { ArrowLeft } from 'lucide-react'
import { CoreInvariantCard } from './CoreInvariantCard.tsx'
import { InvariantSufficiencyCard } from './InvariantSufficiencyCard.tsx'
import { InvariantFailureCard } from './InvariantFailureCard.tsx'
import { BruteForceComparisonCard } from './BruteForceComparisonCard.tsx'
import { InteractiveExampleCard } from './InteractiveExampleCard.tsx'
import { SubPattern } from '../../types/foundation'
import TwoPointersModule from './engines/TwoPointers/TwoPointersModule'
import { BinarySearchComparison } from './engines/SearchEngine/BinarySearchComparison'
import { MonotonicStackComparison } from './engines/MonotonicStack/MonotonicStackComparison'

interface Props {
    moduleId?: string
    subPattern: SubPattern
    onBack: () => void
}

export const SubPatternFullView: React.FC<Props> = ({ moduleId, subPattern, onBack }) => {
    // Specialized view for Two Pointers engine integration
    if (moduleId === 'two_pointers') {
        return (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={onBack}
                            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                        >
                            <ArrowLeft size={20} className="text-white" />
                        </button>
                        <div>
                            <h2 className="text-3xl font-bold text-white">{subPattern.title}</h2>
                            <p className="text-sm text-white/60">Active Sub-Pattern Visualization</p>
                        </div>
                    </div>
                </div>

                <TwoPointersModule subPattern={subPattern as any} activeTab="sub_patterns" />
            </div>
        )
    }

    // Specialized view for Binary Search engine integration
    if (moduleId === 'binary_search' || moduleId === 'binary_search_bounds') {
        return (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={onBack}
                            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                        >
                            <ArrowLeft size={20} className="text-white" />
                        </button>
                        <div className="flex items-center gap-3">
                            <div>
                                <h2 className="text-3xl font-bold text-white">{subPattern.title}</h2>
                                <p className="text-sm text-white/60">Active Sub-Pattern Visualization</p>
                            </div>

                        </div>
                    </div>
                    <span className="px-3 py-1 bg-accent-blue/10 text-accent-blue border border-accent-blue/20 rounded font-mono text-xs">
                        {subPattern.id}
                    </span>
                </div>

                <BinarySearchComparison mode={subPattern.id === 'binary_search_basic' ? 'standard' : subPattern.id} />
            </div>
        )
    }

    // Specialized view for Monotonic Stack engine integration
    if (moduleId === 'monotonic_stack') {
        return (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={onBack}
                            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                        >
                            <ArrowLeft size={20} className="text-white" />
                        </button>
                        <div className="flex items-center gap-3">
                            <div>
                                <h2 className="text-3xl font-bold text-white">{subPattern.title}</h2>
                                <p className="text-sm text-white/60">Active Sub-Pattern Visualization</p>
                            </div>
                        </div>
                    </div>
                    <span className="px-3 py-1 bg-accent-blue/10 text-accent-blue border border-accent-blue/20 rounded font-mono text-xs">
                        {subPattern.id}
                    </span>
                </div>

                <MonotonicStackComparison mode={subPattern.id} />
            </div>
        )
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onBack}
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                    >
                        <ArrowLeft size={20} className="text-white" />
                    </button>
                    <div>
                        <h2 className="text-3xl font-bold text-white">{subPattern.title}</h2>
                        <p className="text-sm text-white/60">Complete pattern strategy & breakdown</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <span className="px-4 py-2 rounded-full bg-accent-blue/20 text-accent-blue text-sm font-bold border border-accent-blue/30">
                        O(N) Time
                    </span>
                </div>
            </div>

            {/* Core Understanding */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <CoreInvariantCard
                    formula={subPattern.formula}
                    explanation={subPattern.description || subPattern.invariant}
                />
                <InvariantSufficiencyCard subPatternId={subPattern.id} />
            </div>

            {/* Row 2: Comparison & Failure */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <InvariantFailureCard
                    mistakes={subPattern.mistakes}
                    whenNotToUse={subPattern.whenNotToUse || []}
                />
                <BruteForceComparisonCard subPatternId={subPattern.id} />
            </div>

            {/* Row 3: Interactive Example */}
            <InteractiveExampleCard
                edgeCases={subPattern.edgeCases}
            />
        </div>
    )
}

