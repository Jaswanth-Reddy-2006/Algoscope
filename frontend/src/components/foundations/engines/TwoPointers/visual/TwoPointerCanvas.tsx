import React, { useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TwoPointerState } from '../core/twoPointerCore'

import { ComparisonStats } from '../../../MentalModelEngine/comparisonStats'

interface Props {
    state: TwoPointerState | null
    mode: string
    stats?: ComparisonStats
    array: number[]
    currentStep: number
    totalSteps: number
}

const TwoPointerCanvas: React.FC<Props> = ({ state, mode, stats, array, currentStep, totalSteps }) => {
    const maxVal = useMemo(() => {
        const arr = array || []
        return Math.max(...arr, 1)
    }, [array])

    if (!state) return (
        <div className="p-8 rounded-3xl bg-green-500/[0.05] border border-green-500/20 flex items-center justify-center h-full">
            <p className="text-white/40">Initialize simulation to begin</p>
        </div>
    )

    const getInvariantLabel = () => {
        const labels: Record<string, string> = {
            two_sum_sorted: 'sum === target',
            container_most_water: 'greedy_optimization',
            palindrome_check: 'char[l] == char[r]',
            move_zeroes: 'non_zero_boundary',
            cycle_detection: 'slow == fast',
            dnf_partition: 'three_way_split'
        }
        return labels[mode] || 'two_pointer_invariant'
    }

    return (
        <div className="p-6 rounded-2xl bg-green-500/[0.05] border border-green-500/20 flex flex-col h-full max-h-[600px]">
            {/* Header */}
            <div className="mb-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <span className="text-xl">🟢</span> Two Pointers
                </h3>
                <p className="text-xs text-white/60 mt-1">Single pass solution</p>
            </div>

            {/* Canvas - scrollable if needed */}
            <div className="mb-4 overflow-y-auto flex-1 flex flex-col items-center justify-center min-h-[200px] relative">

                {/* Logic Invariant Banner */}
                <div className="absolute top-0 right-0 z-20 mb-4">
                    <motion.div
                        animate={{
                            borderColor: state.conditionMet ? 'rgba(52, 211, 153, 0.4)' : 'rgba(59, 130, 246, 0.4)',
                            backgroundColor: state.conditionMet ? 'rgba(52, 211, 153, 0.1)' : 'rgba(59, 130, 246, 0.1)'
                        }}
                        className="px-3 py-1.5 rounded-lg border backdrop-blur-md"
                    >
                        <code className={`text-xs font-mono font-bold ${state.conditionMet ? 'text-emerald-400' : 'text-blue-400'}`}>
                            {getInvariantLabel()}
                        </code>
                    </motion.div>
                </div>

                {/* Explanation */}
                <div className="mt-8 mb-4 text-center max-w-lg min-h-[40px]">
                    <AnimatePresence mode="wait">
                        <motion.p
                            key={state.explanation}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            className="text-white/70 font-medium text-sm"
                        >
                            {state.explanation}
                        </motion.p>
                    </AnimatePresence>
                </div>

                <div className="flex items-end gap-2 h-40 relative">
                    {/* Water Area for Container With Most Water */}
                    {mode === 'container_most_water' && typeof state.left === 'number' && typeof state.right === 'number' && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{
                                opacity: 1,
                                left: `${(state.left * (100 / array.length))}%`,
                                width: `${((state.right - state.left) * (100 / array.length))}%`,
                                height: `${(Math.min(array[state.left], array[state.right]) / maxVal) * 80 + 20}%`
                            }}
                            className="absolute bottom-0 bg-accent-blue/20 border-t-2 border-accent-blue/40 z-0 rounded-t-sm"
                        />
                    )}

                    {array.map((val, idx) => {
                        const isLeft = state.left === idx
                        const isRight = state.right === idx
                        const isComparison = state.compareIndices?.includes(idx)
                        const isSwap = state.swapIndices?.includes(idx)

                        let color = 'rgba(255, 255, 255, 0.05)'
                        let borderColor = 'rgba(255, 255, 255, 0.1)'

                        if (isLeft) { color = 'rgba(59, 130, 246, 0.2)'; borderColor = '#3b82f6'; }
                        if (isRight) { color = 'rgba(236, 72, 153, 0.2)'; borderColor = '#ec4899'; }
                        if (isComparison) { color = 'rgba(250, 204, 21, 0.2)'; borderColor = '#facc15'; }

                        return (
                            <div key={idx} className="relative flex-1 flex flex-col items-center group h-full">
                                <motion.div
                                    layout
                                    animate={{
                                        height: `${(val / maxVal) * 80 + 20}%`,
                                        backgroundColor: isSwap ? 'rgba(168, 85, 247, 0.4)' : color,
                                        borderColor: isSwap ? '#a855f7' : borderColor,
                                        scale: (isLeft || isRight) ? 1.05 : 1,
                                        y: isSwap ? -10 : 0
                                    }}
                                    className="w-full rounded-t-lg border-2 flex items-center justify-center transition-colors duration-300 relative z-10"
                                >
                                    <span className="text-[10px] font-bold text-white/90">{val}</span>
                                </motion.div>
                                <span className="text-[9px] font-mono text-white/20 mt-2">{idx}</span>

                                {/* Premium Pointers */}
                                <AnimatePresence>
                                    {isLeft && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            className="absolute -bottom-10 z-20"
                                        >
                                            <div className="flex flex-col items-center">
                                                <div className="w-0.5 h-3 bg-accent-blue" />
                                                <div className="px-2 py-0.5 rounded bg-accent-blue text-black text-[9px] font-black uppercase tracking-tighter shadow-glow-blue flex items-center gap-1">
                                                    <span>L</span>
                                                    <div className="w-1 h-1 rounded-full bg-black animate-pulse" />
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                    {isRight && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            className="absolute -bottom-10 z-20"
                                        >
                                            <div className="flex flex-col items-center">
                                                <div className="w-0.5 h-3 bg-pink-500" />
                                                <div className="px-2 py-0.5 rounded bg-pink-500 text-black text-[9px] font-black uppercase tracking-tighter shadow-glow-pink flex items-center gap-1">
                                                    <span>R</span>
                                                    <div className="w-1 h-1 rounded-full bg-black animate-pulse" />
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Stats */}
            <div className="space-y-3">
                {/* Primary Stats */}
                <div className="p-4 rounded-xl bg-black/40 border border-green-500/20">
                    <div className="grid grid-cols-3 gap-3 text-center">
                        <div>
                            <div className="text-[9px] uppercase tracking-widest text-green-400 mb-1">Step</div>
                            <div className="text-lg font-bold text-green-400 font-mono">
                                {currentStep + 1}/{totalSteps}
                            </div>
                        </div>
                        <div>
                            <div className="text-[9px] uppercase tracking-widest text-green-400 mb-1">Operations</div>
                            <motion.div
                                key={currentStep}
                                initial={{ scale: 1.2 }}
                                animate={{ scale: 1 }}
                                className="text-lg font-bold text-green-400 font-mono"
                            >
                                {currentStep}
                            </motion.div>
                        </div>
                        <div>
                            <div className="text-[9px] uppercase tracking-widest text-white/40 mb-1">Complexity</div>
                            <div className="text-sm font-bold text-white/60 font-mono">O(N)</div>
                        </div>
                    </div>
                </div>

                {/* Efficiency Metrics */}
                {stats && (
                    <div className="p-3 rounded-xl bg-accent-blue/10 border border-accent-blue/20">
                        <div className="grid grid-cols-2 gap-3 text-center">
                            <div>
                                <div className="text-[9px] uppercase tracking-widest text-white/40 mb-1">Saved Ops</div>
                                <div className="text-lg font-bold text-accent-blue font-mono">
                                    {(stats.bruteForceSteps || 0) - (stats.optimalSteps || 0)}
                                </div>
                            </div>
                            <div>
                                <div className="text-[9px] uppercase tracking-widest text-white/40 mb-1">Efficiency</div>
                                <div className="text-lg font-bold text-accent-blue font-mono">
                                    {stats.timeSaved || 0}%
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default TwoPointerCanvas
