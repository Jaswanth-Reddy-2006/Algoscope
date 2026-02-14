import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LinearSearchState } from '../core/linearSearchCore'

interface Props {
    state: LinearSearchState | null
}

export const LinearSearchCanvas: React.FC<Props> = ({ state }) => {
    if (!state) return <div className="h-40 flex items-center justify-center text-white/20">Waiting...</div>

    const { array, currentIndex, foundIndex, explanation } = state
    const maxVal = Math.max(...array, 1)

    return (
        <div className="flex flex-col h-full bg-red-500/[0.02] rounded-3xl border border-red-500/10 p-6 relative overflow-hidden">
            {/* Header */}
            <div className="absolute top-4 left-6 z-10">
                <h3 className="text-sm font-bold text-red-400 flex items-center gap-2">
                    <span>🔴</span> Linear Search (O(N))
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
                <div className="flex items-end gap-1.5 h-32 w-full justify-center">
                    {array.map((val, idx) => {
                        const isCurrent = idx === currentIndex
                        const isFound = idx === foundIndex
                        const isChecked = idx < currentIndex

                        return (
                            <div key={idx} className="relative flex flex-col items-center flex-1 max-w-[40px]">
                                <motion.div
                                    layout
                                    animate={{
                                        height: `${(val / maxVal) * 80 + 20}%`,
                                        backgroundColor: isFound
                                            ? 'rgba(16, 185, 129, 0.5)'
                                            : isCurrent
                                                ? 'rgba(239, 68, 68, 0.5)'
                                                : isChecked
                                                    ? 'rgba(255, 255, 255, 0.05)'
                                                    : 'rgba(59, 130, 246, 0.1)',
                                        borderColor: isFound
                                            ? '#10b981'
                                            : isCurrent
                                                ? '#ef4444'
                                                : isChecked
                                                    ? 'rgba(255, 255, 255, 0.1)'
                                                    : 'rgba(59, 130, 246, 0.3)',
                                        opacity: isChecked ? 0.3 : 1
                                    }}
                                    className="w-full rounded-t border flex items-center justify-center transition-colors mb-2"
                                >
                                    <span className="text-[10px] font-bold text-white/80">{val}</span>
                                </motion.div>
                                <span className="text-[8px] font-mono text-white/20">{idx}</span>

                                {isCurrent && (
                                    <motion.div
                                        layoutId="search-pointer"
                                        className="absolute -bottom-6"
                                    >
                                        <div className="w-0.5 h-2 bg-red-500 mx-auto" />
                                        <div className="text-[8px] font-bold text-red-500 bg-red-500/10 px-1 rounded">SCAN</div>
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
                    <span className="text-lg font-mono font-bold text-red-400">{state.step}</span>
                </div>
                <div className="p-3 bg-black/20 rounded-xl border border-white/5">
                    <span className="text-[10px] uppercase text-white/40 block mb-1">Status</span>
                    <span className={`text-lg font-mono font-bold ${state.phase === 'found' ? 'text-green-400' : 'text-white/60'}`}>
                        {state.phase === 'found' ? 'FOUND' : state.phase === 'not_found' ? 'MISSING' : 'SCANNING'}
                    </span>
                </div>
            </div>
        </div>
    )
}
