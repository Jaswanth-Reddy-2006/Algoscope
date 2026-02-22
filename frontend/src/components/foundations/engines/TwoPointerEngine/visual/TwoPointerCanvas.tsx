import React, { useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TwoPointerState } from '../core/twoPointerCore'

interface Props {
    state: TwoPointerState
    mode: string
}

const TwoPointerCanvas: React.FC<Props> = ({ state, mode }) => {

    // Helper to get invariant text
    const getInvariant = () => {
        if (mode === 'opposite_direction') return "sum === target"
        if (mode === 'same_direction') return "order_invariant"
        if (mode === 'partition') return "left_vals < pivot"
        if (mode === 'fast_slow') return "slow === fast"
        return "two_pointer"
    }

    const maxVal = useMemo(() => {
        const arr = state?.array || []
        return Math.max(...arr, 1)
    }, [state?.array])

    if (!state) return null
    const array = state.array

    return (
        <div className="w-full h-full flex flex-col items-center justify-center p-8 relative overflow-hidden bg-background/50">

            {/* Top Right: Invariant Banner */}
            <div className="absolute top-8 right-8">
                <motion.div
                    animate={{
                        borderColor: state.conditionMet ? 'rgba(52, 211, 153, 0.3)' : 'rgba(239, 68, 68, 0.3)',
                        backgroundColor: state.conditionMet ? 'rgba(52, 211, 153, 0.05)' : 'rgba(248, 113, 113, 0.05)'
                    }}
                    className="px-6 py-4 rounded-2xl border backdrop-blur-md text-right"
                >
                    <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest block mb-1">Logic Gate</span>
                    <code className={`text-xl font-mono font-bold tracking-tight ${state.conditionMet ? 'text-emerald-400' : 'text-red-400'}`}>
                        {getInvariant()}
                    </code>
                </motion.div>
            </div>

            {/* Main Array Visualization */}
            <div className="relative flex items-center justify-center h-64 w-full px-20">
                <div className="flex items-end gap-3 relative z-10">
                    {array.map((val, idx) => {
                        const isLeft = state.left === idx
                        const isRight = state.right === idx
                        const isSlow = state.slow === idx
                        const isFast = state.fast === idx
                        const isPivot = state.pivotIndex === idx
                        const isSwap = state.swapIndices?.includes(idx)

                        // Partition Colors
                        let color = '#3b82f6' // Default Blue
                        if (mode === 'partition') {
                            if (isPivot) color = '#f59e0b' // Amber Pivot
                            else if (state.left !== null && idx < state.left) color = '#10b981' // Green (Smaller)
                            else if (state.left !== null && idx >= state.left && idx < (state.pivotIndex || 0)) color = '#ef4444' // Red (Larger)
                        }

                        return (
                            <div key={idx} className="w-12 flex flex-col items-center gap-4 relative">
                                {/* Value Bar/Block */}
                                <motion.div
                                    layout
                                    animate={{
                                        height: mode === 'partition' ? '50px' : `${(val / maxVal) * 100}%`,
                                        opacity: 1,
                                        backgroundColor: isPivot ? 'rgba(245, 158, 11, 0.2)' : `${color}30`,
                                        borderColor: isPivot ? '#f59e0b' : color,
                                        scale: isSwap ? 1.1 : 1,
                                        y: isSwap ? -20 : 0
                                    }}
                                    className="w-full rounded-lg border-2 flex items-center justify-center relative overflow-hidden transition-colors"
                                    style={{ minHeight: '40px' }}
                                >
                                    <span className="text-sm font-bold text-white">{val}</span>
                                </motion.div>

                                {/* Index */}
                                <span className="text-[10px] font-mono text-white/20">{idx}</span>

                                {/* Pointers */}
                                <AnimatePresence>
                                    {isLeft && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            className="absolute -bottom-10"
                                        >
                                            <div className="flex flex-col items-center">
                                                <div className="w-0.5 h-4 bg-accent-blue" />
                                                <span className="text-[10px] font-bold text-accent-blue uppercase bg-accent-blue/10 px-1.5 py-0.5 rounded">L</span>
                                            </div>
                                        </motion.div>
                                    )}
                                    {isRight && mode !== 'partition' && ( // Don't show Right pointer in partition if it's scanner
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            className="absolute -bottom-10"
                                        >
                                            <div className="flex flex-col items-center">
                                                <div className="w-0.5 h-4 bg-red-400" />
                                                <span className="text-[10px] font-bold text-red-400 uppercase bg-red-400/10 px-1.5 py-0.5 rounded">R</span>
                                            </div>
                                        </motion.div>
                                    )}
                                    {mode === 'partition' && idx === state.right && idx !== state.pivotIndex && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="absolute -top-12 z-20"
                                        >
                                            <div className="flex flex-col items-center">
                                                <span className="text-[10px] font-bold text-purple-400 uppercase bg-purple-400/10 px-1.5 py-0.5 rounded mb-1">Scan</span>
                                                <div className="w-0.5 h-4 bg-purple-400" />
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* Fast & Slow Pointers */}
                                    {isSlow && mode === 'fast_slow' && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            className="absolute -bottom-10"
                                        >
                                            <div className="flex flex-col items-center">
                                                <div className="w-0.5 h-4 bg-emerald-400" />
                                                <span className="text-[10px] font-bold text-emerald-400 uppercase bg-emerald-400/10 px-1.5 py-0.5 rounded">S</span>
                                            </div>
                                        </motion.div>
                                    )}
                                    {isFast && mode === 'fast_slow' && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="absolute -top-12 z-20"
                                        >
                                            <div className="flex flex-col items-center">
                                                <span className="text-[10px] font-bold text-amber-400 uppercase bg-amber-400/10 px-1.5 py-0.5 rounded mb-1">F</span>
                                                <div className="w-0.5 h-4 bg-amber-400" />
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Explanation Log */}
            <div className="mt-12 max-w-2xl text-center">
                <motion.p
                    key={state.explanation}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-lg font-medium text-white/90"
                >
                    {state.explanation}
                </motion.p>
            </div>
        </div>
    )
}

export default TwoPointerCanvas
