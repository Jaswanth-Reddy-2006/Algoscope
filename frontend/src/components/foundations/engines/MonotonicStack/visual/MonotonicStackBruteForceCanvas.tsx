import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BruteForceStackState } from '../core/monotonicStackBruteForce'

interface Props {
    state: BruteForceStackState | null
}

export const MonotonicStackBruteForceCanvas: React.FC<Props> = ({ state }) => {
    // Guard 3: Max value safety
    const maxVal = React.useMemo(() => {
        const arr = state?.array || []
        if (arr.length === 0) return 1
        return Math.max(...arr, 1)
    }, [state?.array])

    // Guard 1: Root state existence
    if (!state) return <div className="h-64 flex items-center justify-center text-white/20 font-mono text-xs italic">Waiting for simulation...</div>

    // Guard 2: Data Extraction & Defaults
    const array = state.array || []
    const i = state.i ?? -1
    const j = state.j ?? -1
    const result = state.result || []
    const explanation = state.explanation || "Executing brute force..."
    const found = state.found || false

    return (
        <div className="flex flex-col h-full bg-red-500/[0.02] rounded-3xl border border-red-500/10 p-6 relative overflow-hidden font-outfit">
            {/* Header */}
            <div className="absolute top-4 left-6 z-10">
                <h3 className="text-sm font-bold text-red-400 flex items-center gap-2">
                    <span>🔴</span> Brute Force (O(N²))
                </h3>
            </div>

            {/* Explanation Banner */}
            <div className="absolute top-4 right-6 z-10 max-w-xs text-right">
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

            {/* Array Visualization */}
            <div className="flex-1 flex items-center justify-center px-4">
                <div className="flex items-end gap-2 h-32 w-full justify-center">
                    {array.map((val, idx) => {
                        const isI = idx === i
                        const isJ = idx === j
                        const isProcessed = idx < i || (idx === i && found)

                        return (
                            <div key={idx} className="relative flex flex-col items-center flex-1 max-w-[40px]">
                                <motion.div
                                    layout
                                    animate={{
                                        height: `${(val / maxVal) * 80 + 20}%`,
                                        backgroundColor: isI
                                            ? 'rgba(239, 68, 68, 0.5)'
                                            : isJ
                                                ? 'rgba(255, 255, 255, 0.2)'
                                                : 'rgba(255, 255, 255, 0.05)',
                                        borderColor: isI ? '#ef4444' : isJ ? 'rgba(255,255,255,0.4)' : 'rgba(255, 255, 255, 0.1)',
                                        opacity: isProcessed ? 1 : 0.6
                                    }}
                                    className="w-full rounded-t border flex items-center justify-center transition-colors mb-2"
                                >
                                    <span className="text-[10px] font-bold text-white/80">{val}</span>
                                </motion.div>
                                <span className="text-[8px] font-mono text-white/20">{idx}</span>

                                {/* Result Overlay */}
                                {result[idx] !== undefined && result[idx] !== -1 && (
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="absolute -top-6 w-full text-center text-[10px] text-green-400 font-bold"
                                    >
                                        {result[idx]}
                                    </motion.div>
                                )}

                                {isI && (
                                    <motion.div layoutId="bf-i-pointer" className="absolute -bottom-6">
                                        <div className="w-0.5 h-2 bg-red-500 mx-auto" />
                                        <div className="text-[8px] font-bold text-red-500 bg-red-500/10 px-1 rounded">i</div>
                                    </motion.div>
                                )}
                                {isJ && (
                                    <motion.div layoutId="bf-j-pointer" className="absolute -bottom-6">
                                        <div className="w-0.5 h-2 bg-white/50 mx-auto" />
                                        <div className="text-[8px] font-bold text-white/60 bg-white/10 px-1 rounded">j</div>
                                    </motion.div>
                                )}
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Metrics Footer */}
            <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="p-3 bg-black/20 rounded-xl border border-white/5">
                    <span className="text-[10px] uppercase text-white/40 block mb-1">Comparisons</span>
                    <span className="text-lg font-mono font-bold text-red-400">{state.step ?? 0}</span>
                </div>
            </div>
        </div>
    )
}
