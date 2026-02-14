import React from 'react'
import { motion } from 'framer-motion'
import { SlidingWindowState } from './MentalModelEngine/slidingWindowModel'
import { SlidingWindowCanvas } from './SlidingWindowCanvas'
import { ComparisonStats } from './MentalModelEngine/comparisonStats'

interface Props {
    states: SlidingWindowState[]
    currentStep: number
    array: number[]
    stats: ComparisonStats
}

export const SlidingWindowPanel: React.FC<Props> = ({
    states,
    currentStep,
    array,
    stats
}) => {
    const currentState = states[Math.min(currentStep, states.length - 1)] || states[0]
    const finalState = states[states.length - 1]

    if (!currentState) {
        return (
            <div className="p-8 rounded-3xl bg-green-500/[0.05] border border-green-500/20 flex items-center justify-center h-full">
                <p className="text-white/40">No states to display</p>
            </div>
        )
    }

    return (
        <div className="p-6 rounded-2xl bg-green-500/[0.05] border border-green-500/20 flex flex-col h-full max-h-[600px]">
            {/* Header */}
            <div className="mb-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <span className="text-xl">🟢</span> Sliding Window
                </h3>
                <p className="text-xs text-white/60 mt-1">Update only outgoing and incoming</p>
            </div>

            {/* Canvas - scrollable if needed */}
            <div className="mb-4 overflow-y-auto flex-1">
                <SlidingWindowCanvas state={currentState} array={array} />
            </div>

            {/* Stats */}
            <div className="space-y-3">
                {/* Primary Stats */}
                <div className="p-4 rounded-xl bg-black/40 border border-green-500/20">
                    <div className="grid grid-cols-3 gap-3 text-center">
                        <div>
                            <div className="text-[9px] uppercase tracking-widest text-green-400 mb-1">Step</div>
                            <div className="text-lg font-bold text-green-400 font-mono">
                                {currentState.step + 1}/{states.length}
                            </div>
                        </div>
                        <div>
                            <div className="text-[9px] uppercase tracking-widest text-green-400 mb-1">Operations</div>
                            <motion.div
                                key={currentState.operationCount}
                                initial={{ scale: 1.2 }}
                                animate={{ scale: 1 }}
                                className="text-lg font-bold text-green-400 font-mono"
                            >
                                {currentState.operationCount}
                            </motion.div>
                            <div className="text-[8px] text-white/40 mt-0.5">
                                Total: {finalState?.operationCount || 0}
                            </div>
                        </div>
                        <div>
                            <div className="text-[9px] uppercase tracking-widest text-white/40 mb-1">Complexity</div>
                            <div className="text-sm font-bold text-white/60 font-mono">O(N)</div>
                        </div>
                    </div>
                </div>

                {/* Efficiency Metrics */}
                <div className="p-3 rounded-xl bg-accent-blue/10 border border-accent-blue/20">
                    <div className="grid grid-cols-2 gap-3 text-center">
                        <div>
                            <div className="text-[9px] uppercase tracking-widest text-white/40 mb-1">Saved Ops</div>
                            <div className="text-lg font-bold text-accent-blue font-mono">
                                {stats.savedOps}
                            </div>
                        </div>
                        <div>
                            <div className="text-[9px] uppercase tracking-widest text-white/40 mb-1">Efficiency</div>
                            <div className="text-lg font-bold text-accent-blue font-mono">
                                {stats.efficiencyGain}%
                            </div>
                        </div>
                    </div>
                </div>

                {/* Final Answer */}
                {currentStep >= states.length - 1 && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-3 rounded-xl bg-green-500/10 border border-green-500/30 text-center"
                    >
                        <div className="text-[9px] uppercase tracking-widest text-white/60 mb-1">Final Answer</div>
                        <div className="text-2xl font-bold text-green-400 font-mono">
                            {Math.max(...array.slice(0, array.length - (stats.numWindows ?? 0) + 1 + (stats.numWindows ?? 0)).map((_, i) =>
                                array.slice(i, i + (array.length - (stats.numWindows ?? 0) + 1)).reduce((a, b) => a + b, 0)
                            ).filter((_, i) => i < (stats.numWindows ?? 0)))}
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    )
}
