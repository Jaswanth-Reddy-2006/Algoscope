import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BruteForceState } from '../core/twoPointerBruteForce'

interface Props {
    state: BruteForceState | null
    mode: string
}

export const TwoPointerBruteForceCanvas: React.FC<Props> = ({ state, mode }) => {
    if (!state) return (
        <div className="p-8 rounded-3xl bg-red-500/[0.05] border border-red-500/20 flex items-center justify-center h-full">
            <p className="text-white/40">No states to display</p>
        </div>
    )

    const { i, j, array, explanation } = state
    const maxVal = Math.max(...array, 1)

    return (
        <div className="p-6 rounded-2xl bg-red-500/[0.05] border border-red-500/20 flex flex-col h-full max-h-[600px]">
            {/* Header */}
            <div className="mb-4">
                <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <span className="text-xl">🔴</span> Brute Force
                    </h3>
                    <p className="text-xs text-white/60 mt-1">Recomputes every pair</p>
                </div>
            </div>

            {/* Canvas - scrollable if needed */}
            <div className="mb-4 overflow-y-auto flex-1 flex flex-col items-center justify-center min-h-[200px] relative">
                {/* Explanation Banner */}
                <div className="absolute top-0 right-0 z-10 max-w-xs text-right mb-4">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={explanation}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            className="text-xs font-mono text-white/60 bg-black/40 px-3 py-1.5 rounded-lg border border-white/5"
                        >
                            {explanation}
                        </motion.div>
                    </AnimatePresence>
                </div>

                <div className="flex items-end gap-2 h-40 mt-8">
                    {array.map((val, idx) => {
                        const isI = idx === i
                        const isJ = idx === j
                        // Highlight range between i and j for container, or just pair for two sum
                        const inRange = mode === 'container_most_water' && idx > i && idx < j

                        return (
                            <div key={idx} className="relative flex flex-col items-center group">
                                <motion.div
                                    layout
                                    animate={{
                                        height: `${(val / maxVal) * 80 + 20}%`,
                                        backgroundColor: isI || isJ
                                            ? 'rgba(239, 68, 68, 0.5)'
                                            : inRange
                                                ? 'rgba(239, 68, 68, 0.1)'
                                                : 'rgba(255, 255, 255, 0.05)',
                                        borderColor: isI || isJ ? '#ef4444' : 'rgba(255, 255, 255, 0.1)',
                                    }}
                                    className="w-8 rounded-t border flex items-center justify-center transition-colors mb-2"
                                >
                                    <span className="text-[10px] font-bold text-white/80">{val}</span>
                                </motion.div>
                                <span className="text-[8px] font-mono text-white/20">{idx}</span>

                                {/* Pointers */}
                                {(isI || isJ) && (
                                    <motion.div
                                        layoutId={`pointer-${isI ? 'i' : 'j'}`}
                                        className="absolute -bottom-6 flex flex-col items-center"
                                    >
                                        <div className="w-0.5 h-2 bg-red-500/50" />
                                        <span className="text-[10px] font-bold text-red-500 bg-red-500/10 px-1.5 rounded">
                                            {isI ? 'i' : 'j'}
                                        </span>
                                    </motion.div>
                                )}
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Stats */}
            <div className="space-y-3">
                <div className="p-4 rounded-xl bg-black/40 border border-red-500/20">
                    <div className="grid grid-cols-3 gap-3 text-center">
                        <div>
                            <div className="text-[9px] uppercase tracking-widest text-red-400 mb-1">Step</div>
                            <div className="text-lg font-bold text-red-400 font-mono">
                                {state.step}
                            </div>
                        </div>
                        <div>
                            <div className="text-[9px] uppercase tracking-widest text-red-400 mb-1">Operations</div>
                            <div className="text-lg font-bold text-red-400 font-mono">
                                {state.step}
                            </div>
                        </div>
                        <div>
                            <div className="text-[9px] uppercase tracking-widest text-white/40 mb-1">Complexity</div>
                            <div className="text-sm font-bold text-white/60 font-mono">O(N²)</div>
                        </div>
                    </div>
                </div>

                {/* Current Check Display (similar to Final Answer but for current state in brute force) */}
                <motion.div
                    className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-center"
                >
                    <div className="text-[9px] uppercase tracking-widest text-white/60 mb-1">Current Check</div>
                    <div className="text-xl font-bold text-red-400 font-mono">
                        {mode === 'container_most_water' ? `Area: ${state.area || 0}` : `Sum: ${state.currentSum || 0}`}
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
