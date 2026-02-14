import React from 'react'
import { motion } from 'framer-motion'
import { BruteForceState } from './MentalModelEngine/bruteForceModel'

interface Props {
    state: BruteForceState
    array: number[]
}

export const BruteForceCanvas: React.FC<Props> = ({ state, array }) => {
    return (
        <div className="space-y-6">
            {/* Array Visualization */}
            <div className="flex gap-2 justify-center flex-wrap">
                {array.map((val, idx) => {
                    const isInCurrentWindow = idx >= state.outerIndex && idx < state.outerIndex + state.currentWindow.length
                    const isBeingRecalculated = state.recalculatedElements.includes(val) &&
                        idx >= state.outerIndex &&
                        idx <= state.innerIndex

                    return (
                        <motion.div
                            key={idx}
                            className={`w-16 h-16 rounded-xl flex items-center justify-center text-xl font-bold transition-all ${isBeingRecalculated
                                    ? 'bg-red-500/40 border-2 border-red-500 text-white shadow-lg shadow-red-500/50'
                                    : isInCurrentWindow
                                        ? 'bg-red-500/10 border border-red-500/30 text-white/80'
                                        : 'bg-white/5 border border-white/10 text-white/40'
                                }`}
                            animate={isBeingRecalculated ? {
                                scale: [1, 1.15, 1],
                                rotate: [0, 2, -2, 0]
                            } : {}}
                            transition={{ duration: 0.3 }}
                        >
                            {val}
                        </motion.div>
                    )
                })}
            </div>

            {/* Window Indicator */}
            <div className="text-center space-y-2">
                <div className="text-sm text-white/60 font-mono">
                    Window Position: <span className="text-red-400 font-bold">{state.outerIndex}</span>
                </div>
                <div className="text-xs text-white/40">
                    Recalculating element {state.innerIndex - state.outerIndex + 1} of {state.currentWindow.length}
                </div>
            </div>

            {/* Current Sum Display */}
            <div className="p-4 rounded-xl bg-black/40 border border-red-500/20 text-center">
                <div className="text-xs text-white/60 mb-1">Current Sum</div>
                <motion.div
                    key={state.currentSum}
                    initial={{ scale: 1.2, color: '#ef4444' }}
                    animate={{ scale: 1, color: '#ffffff' }}
                    className="text-3xl font-bold font-mono"
                >
                    {state.currentSum}
                </motion.div>
            </div>
        </div>
    )
}
