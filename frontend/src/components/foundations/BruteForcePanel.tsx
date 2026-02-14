import React from 'react'
import { motion } from 'framer-motion'
import { BruteForceState } from './MentalModelEngine/bruteForceModel'
import { BruteForceCanvas } from './BruteForceCanvas'

interface Props {
    states: BruteForceState[]
    currentStep: number
    array: number[]
    windowSize: number
}

export const BruteForcePanel: React.FC<Props> = ({
    states,
    currentStep,
    array,
    windowSize
}) => {
    const currentState = states[Math.min(currentStep, states.length - 1)] || states[0]
    const finalState = states[states.length - 1]

    if (!currentState) {
        return (
            <div className="p-8 rounded-3xl bg-red-500/[0.05] border border-red-500/20 flex items-center justify-center h-full">
                <p className="text-white/40">No states to display</p>
            </div>
        )
    }

    return (
        <div className="p-6 rounded-2xl bg-red-500/[0.05] border border-red-500/20 flex flex-col h-full max-h-[600px]">
            {/* Header */}
            <div className="mb-4">
                <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <span className="text-xl">🔴</span> Brute Force
                    </h3>
                    <p className="text-xs text-white/60 mt-1">Recomputes entire window every time</p>
                </div>
            </div>

            {/* Canvas - scrollable if needed */}
            <div className="mb-4 overflow-y-auto flex-1">
                <BruteForceCanvas state={currentState} array={array} />
            </div>

            {/* Stats */}
            <div className="space-y-3">
                <div className="p-4 rounded-xl bg-black/40 border border-red-500/20">
                    <div className="grid grid-cols-3 gap-3 text-center">
                        <div>
                            <div className="text-[9px] uppercase tracking-widest text-red-400 mb-1">Step</div>
                            <div className="text-lg font-bold text-red-400 font-mono">
                                {currentState.step + 1}/{states.length}
                            </div>
                        </div>
                        <div>
                            <div className="text-[9px] uppercase tracking-widest text-red-400 mb-1">Operations</div>
                            <motion.div
                                key={currentState.operationCount}
                                initial={{ scale: 1.2 }}
                                animate={{ scale: 1 }}
                                className="text-lg font-bold text-red-400 font-mono"
                            >
                                {currentState.operationCount}
                            </motion.div>
                            <div className="text-[8px] text-white/40 mt-0.5">
                                Total: {finalState?.operationCount || 0}
                            </div>
                        </div>
                        <div>
                            <div className="text-[9px] uppercase tracking-widest text-white/40 mb-1">Complexity</div>
                            <div className="text-sm font-bold text-white/60 font-mono">O(N×K)</div>
                        </div>
                    </div>
                </div>

                {/* Final Answer */}
                {currentStep >= states.length - 1 && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-center"
                    >
                        <div className="text-[9px] uppercase tracking-widest text-white/60 mb-1">Final Answer</div>
                        <div className="text-2xl font-bold text-red-400 font-mono">
                            {Math.max(...array.slice(0, array.length - windowSize + 1).map((_, i) =>
                                array.slice(i, i + windowSize).reduce((a, b) => a + b, 0)
                            ))}
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    )
}
