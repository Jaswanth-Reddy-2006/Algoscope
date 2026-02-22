import React, { useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BinarySearchState } from '../core/binarySearchCore'

interface Props {
    state: BinarySearchState
    mode: string
}

const BinarySearchCanvas: React.FC<Props> = ({ state, mode: _mode }) => {
    // Guard 2: Array stability
    const maxVal = useMemo(() => {
        const arr = state?.array || []
        if (arr.length === 0) return 1
        return Math.max(...arr, 1)
    }, [state?.array])

    // Guard 1: Root state existence
    if (!state) return null

    // Guard 3: Range stability
    const low = state.low ?? 0
    const high = state.high ?? 0
    const activeRange = state.activeRange || [0, 0]
    const mid = state.mid
    const explanation = state.explanation || "Initializing..."
    const array = state.array || []

    return (
        <div className="p-6 rounded-2xl bg-emerald-500/[0.05] border border-emerald-500/20 flex flex-col h-full max-h-[600px] relative overflow-hidden font-outfit">
            {/* Header */}
            <div className="flex items-center justify-between mb-8 z-10">
                <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <span className="text-xl">🟢</span> Binary Search
                    </h3>
                    <p className="text-xs text-white/60 mt-1">O(log N) • logarithmic time</p>
                </div>
                <div className="flex gap-4">
                    <div className="text-right">
                        <span className="text-[10px] uppercase text-white/40 font-bold tracking-widest block">Current Range</span>
                        <span className="text-sm font-mono text-emerald-400 font-bold">[{low}, {high}]</span>
                    </div>
                </div>
            </div>

            {/* Canvas Area */}
            <div className="flex-1 flex flex-col items-center justify-center relative min-h-[300px]">
                {low <= high && (
                    <motion.div
                        layout
                        className="absolute inset-x-0 bg-emerald-500/5 blur-xl pointer-events-none transition-all duration-300"
                        style={{ opacity: 0.5 }}
                    />
                )}

                <div className="flex items-end gap-3 relative z-10 h-32">
                    {array.map((val, idx) => {
                        const isDiscarded = idx < activeRange[0] || idx > activeRange[1]
                        const isMid = mid === idx
                        const isFound = state.phase === 'found' && state.foundIndex === idx
                        const isRelevant = !isDiscarded

                        const isLow = low === idx
                        const isHigh = high === idx

                        return (
                            <motion.div
                                key={idx}
                                layout
                                animate={{
                                    opacity: isDiscarded ? 0.15 : 1,
                                    scale: isDiscarded ? 0.9 : 1,
                                    filter: isDiscarded ? 'grayscale(100%) blur(1px)' : 'none'
                                }}
                                transition={{ duration: 0.3 }}
                                className="w-10 md:w-12 flex flex-col items-center gap-2 relative"
                            >
                                <motion.div
                                    animate={{
                                        height: `${(val / maxVal) * 100}%`,
                                        backgroundColor: isFound
                                            ? 'rgba(16, 185, 129, 0.6)'
                                            : isMid
                                                ? 'rgba(236, 72, 153, 0.5)'
                                                : isRelevant
                                                    ? 'rgba(52, 211, 153, 0.2)'
                                                    : 'rgba(255, 255, 255, 0.05)',
                                        borderColor: isFound
                                            ? '#10b981'
                                            : isMid
                                                ? '#ec4899'
                                                : isRelevant
                                                    ? 'rgba(52, 211, 153, 0.5)'
                                                    : 'rgba(255,255,255,0.05)',
                                        boxShadow: isRelevant && !isDiscarded ? '0 0 15px rgba(16,185,129,0.1)' : 'none'
                                    }}
                                    className="w-full rounded-md border flex items-end justify-center pb-2 min-h-[40px] transition-colors relative"
                                >
                                    <span className="absolute bottom-1 text-xs font-bold text-white drop-shadow-md">{val}</span>
                                </motion.div>

                                <span className={`text-[9px] font-mono transition-colors ${isRelevant ? 'text-white/60' : 'text-white/10'}`}>{idx}</span>

                                <AnimatePresence>
                                    {isLow && !isDiscarded && (
                                        <motion.div
                                            initial={{ y: 10, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="absolute -bottom-8 flex flex-col items-center"
                                        >
                                            <div className="w-px h-3 bg-emerald-400 mb-1" />
                                            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">L</span>
                                        </motion.div>
                                    )}
                                    {isHigh && !isDiscarded && (
                                        <motion.div
                                            initial={{ y: 10, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="absolute -bottom-8 flex flex-col items-center"
                                        >
                                            <div className="w-px h-3 bg-emerald-400 mb-1" />
                                            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">R</span>
                                        </motion.div>
                                    )}
                                    {isMid && (
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="absolute -top-10 z-20"
                                        >
                                            <div className="flex flex-col items-center">
                                                <span className="text-[10px] font-bold text-white bg-pink-500 px-2 py-1 rounded shadow-lg mb-1">MID</span>
                                                <div className="w-0.5 h-3 bg-pink-500" />
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        )
                    })}
                </div>

                {/* Live Logic Feedback */}
                <div className="mt-12 w-full text-center h-16 flex items-center justify-center">
                    <AnimatePresence mode="wait">
                        <motion.p
                            key={explanation}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            className="text-lg font-medium text-white/90 bg-black/40 px-6 py-3 rounded-xl border border-white/10"
                        >
                            {explanation.split('.').map((part, i) => (
                                part && <span key={i} className="block">{part}.</span>
                            ))}
                        </motion.p>
                    </AnimatePresence>
                </div>
            </div>

            {/* Footer Stats */}
            <div className="grid grid-cols-3 gap-3 border-t border-emerald-500/10 pt-4 mt-4">
                <div className="p-2 rounded-lg bg-emerald-500/5 border border-emerald-500/10 text-center">
                    <span className="text-[9px] uppercase text-emerald-400/60 block mb-1">Left Pointer</span>
                    <span className="font-mono font-bold text-emerald-400">{low}</span>
                </div>
                <div className="p-2 rounded-lg bg-pink-500/5 border border-pink-500/10 text-center">
                    <span className="text-[9px] uppercase text-pink-400/60 block mb-1">Mid Element</span>
                    <span className="font-mono font-bold text-pink-400">
                        {activeRange[0] <= activeRange[1] && mid != null && array[mid] !== undefined ? array[mid] : '-'}
                    </span>
                </div>
                <div className="p-2 rounded-lg bg-emerald-500/5 border border-emerald-500/10 text-center">
                    <span className="text-[9px] uppercase text-emerald-400/60 block mb-1">Right Pointer</span>
                    <span className="font-mono font-bold text-emerald-400">{high}</span>
                </div>
            </div>
        </div>
    )
}

export default BinarySearchCanvas
