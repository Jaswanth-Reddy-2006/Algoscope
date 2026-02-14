import React from 'react'
import { motion } from 'framer-motion'
import { GenericInsightCard } from '../../shared/GenericInsightCard'
import { RefreshCcw } from 'lucide-react'
import { ComparisonStats } from '../../../MentalModelEngine/comparisonStats'

interface Props {
    array: number[]
    stats?: ComparisonStats
    onArrayChange: (arr: number[]) => void
    mode: string
}

export const MonotonicStackInputPanel: React.FC<Props> = ({
    array,
    stats,
    onArrayChange,
    mode
}) => {
    return (
        <div className="grid grid-cols-5 gap-6">
            {/* Left 60% - Input Panel */}
            <div className="col-span-3 p-6 bg-white/[0.02] rounded-2xl border border-white/5 flex flex-col justify-between">
                <div>
                    <h3 className="text-lg font-bold text-white mb-4">Interactive Input Panel</h3>
                    <div className="flex flex-wrap gap-2 mb-4">
                        {array.map((v, i) => (
                            <motion.div
                                key={`${i}-${v}`}
                                layout
                                className="px-2 py-1.5 bg-black/40 rounded-md text-xs text-white/80 font-mono border border-white/10"
                            >
                                {v}
                            </motion.div>
                        ))}
                    </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-auto mb-6">
                    <button
                        onClick={() => {
                            const arr = Array.from({ length: 12 }, () => Math.floor(Math.random() * 50) + 1)
                            onArrayChange(arr)
                        }}
                        className="ml-auto px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors flex items-center gap-2 text-sm text-white/60 hover:text-white"
                    >
                        <RefreshCcw size={14} />
                        <span>Randomize</span>
                    </button>
                </div>
                {/* Live Stats - Standardized Layout */}
                {
                    stats && (
                        <div className="p-4 rounded-xl bg-black/40 border border-white/10">
                            <div className="grid grid-cols-3 gap-3 text-center">
                                <div>
                                    <div className="text-[9px] uppercase tracking-widest text-white/40 mb-1">Items</div>
                                    <div className="text-xl font-bold text-white font-mono">{array.length}</div>
                                </div>
                                <div>
                                    <div className="text-[9px] uppercase tracking-widest text-white/40 mb-1">Optimal Ops</div>
                                    <div className="text-xl font-bold text-accent-blue font-mono">{stats.optimalSteps}</div>
                                </div>
                                <div>
                                    <div className="text-[9px] uppercase tracking-widest text-white/40 mb-1">Brute Ops</div>
                                    <div className="text-xl font-bold text-white font-mono">{stats.bruteForceSteps}</div>
                                </div>
                            </div>
                        </div>
                    )
                }
            </div>

            {/* Right 40% - Insight Card */}
            <div className="col-span-2 h-full">
                <GenericInsightCard
                    title="Why Monotonic Stack?"
                    bruteForceComplexity="O(N²)"
                    optimalComplexity="O(N)"
                    keyPrinciples={[
                        "Process each element exactly once (push/pop)",
                        "Maintain invariant (increasing/decreasing order)",
                        "Solve 'Next Greater' in linear time"
                    ]}
                    invariant={
                        mode.includes('greater')
                            ? "Stack Decreasing: Next item > Top -> Pop"
                            : "Stack Increasing: Next item < Top -> Pop"
                    }
                    invariantLabel="Stack Invariant"
                    efficiencyNote="Finding Next Greater Element for all items takes linear time!"
                />
            </div>
        </div>
    )
}
