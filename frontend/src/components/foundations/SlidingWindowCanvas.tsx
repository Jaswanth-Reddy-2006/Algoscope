import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SlidingWindowState } from './MentalModelEngine/slidingWindowModel'
import { ArrowRight, Minus, Plus } from 'lucide-react'

interface Props {
    state: SlidingWindowState
    array: number[]
}

export const SlidingWindowCanvas: React.FC<Props> = ({ state, array }) => {
    return (
        <div className="space-y-6">
            {/* Formula Display */}
            {!state.isInitializing && state.outgoing !== null && state.incoming !== null && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-xl bg-accent-blue/10 border border-accent-blue/20"
                >
                    <div className="flex items-center justify-center gap-3 text-lg font-mono">
                        <span className="text-white/60">New Sum =</span>
                        <span className="text-white font-bold">{state.currentSum - state.incoming + state.outgoing}</span>
                        <Minus size={16} className="text-red-400" />
                        <motion.span
                            key={`out-${state.outgoing}`}
                            initial={{ scale: 1.3, color: '#ef4444' }}
                            animate={{ scale: 1, color: '#f87171' }}
                            className="font-bold"
                        >
                            {state.outgoing}
                        </motion.span>
                        <Plus size={16} className="text-green-400" />
                        <motion.span
                            key={`in-${state.incoming}`}
                            initial={{ scale: 1.3, color: '#10b981' }}
                            animate={{ scale: 1, color: '#34d399' }}
                            className="font-bold"
                        >
                            {state.incoming}
                        </motion.span>
                        <ArrowRight size={16} className="text-white/40" />
                        <motion.span
                            key={state.currentSum}
                            initial={{ scale: 1.3, color: '#00B0FA' }}
                            animate={{ scale: 1, color: '#ffffff' }}
                            className="font-bold"
                        >
                            {state.currentSum}
                        </motion.span>
                    </div>
                </motion.div>
            )}

            {/* Array Visualization */}
            <div className="flex gap-2 justify-center flex-wrap">
                {array.map((val, idx) => {
                    const isInWindow = idx >= state.left && idx <= state.right
                    const isOutgoing = !state.isInitializing && val === state.outgoing && idx === state.left - 1
                    const isIncoming = !state.isInitializing && val === state.incoming && idx === state.right
                    const isLeftPointer = idx === state.left
                    const isRightPointer = idx === state.right

                    return (
                        <div key={idx} className="relative">
                            {/* L/R Pointer Labels */}
                            <AnimatePresence>
                                {isLeftPointer && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -5 }}
                                        className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-accent-blue"
                                    >
                                        L
                                    </motion.div>
                                )}
                                {isRightPointer && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -5 }}
                                        className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-accent-blue"
                                    >
                                        R
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <motion.div
                                className={`w-16 h-16 rounded-xl flex items-center justify-center text-xl font-bold transition-all ${isOutgoing
                                        ? 'bg-red-500/40 border-2 border-red-500 text-white shadow-lg shadow-red-500/50'
                                        : isIncoming
                                            ? 'bg-green-500/40 border-2 border-green-500 text-white shadow-lg shadow-green-500/50'
                                            : isInWindow
                                                ? 'bg-accent-blue/20 border-2 border-accent-blue text-white'
                                                : 'bg-white/5 border border-white/10 text-white/40'
                                    }`}
                                animate={
                                    isOutgoing ? { scale: [1, 0.9, 1], x: [-5, 0] } :
                                        isIncoming ? { scale: [1, 1.1, 1], x: [5, 0] } :
                                            {}
                                }
                                transition={{ duration: 0.3 }}
                            >
                                {val}
                            </motion.div>
                        </div>
                    )
                })}
            </div>

            {/* Status Display */}
            <div className="text-center space-y-2">
                {state.isInitializing ? (
                    <div className="text-sm text-green-400 font-mono">
                        Initializing first window...
                    </div>
                ) : (
                    <div className="text-sm text-white/60 font-mono">
                        Window: [{state.left}, {state.right}]
                    </div>
                )}
            </div>

            {/* Current Sum Display */}
            <div className="p-4 rounded-xl bg-black/40 border border-green-500/20 text-center">
                <div className="text-xs text-white/60 mb-1">Current Sum</div>
                <motion.div
                    key={state.currentSum}
                    initial={{ scale: 1.2, color: '#10b981' }}
                    animate={{ scale: 1, color: '#ffffff' }}
                    className="text-3xl font-bold font-mono"
                >
                    {state.currentSum}
                </motion.div>
            </div>
        </div>
    )
}
