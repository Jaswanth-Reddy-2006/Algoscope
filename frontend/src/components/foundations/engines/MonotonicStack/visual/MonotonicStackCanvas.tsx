import React, { useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MonotonicStackState } from '../core/monotonicStackCore'

interface Props {
    state: MonotonicStackState
}

const MonotonicStackCanvas: React.FC<Props> = ({ state }) => {
    // Guard 3: Max value safety
    const maxVal = useMemo(() => {
        const arr = state?.array || []
        if (arr.length === 0) return 1
        return Math.max(...arr, 1)
    }, [state?.array])

    // Guard 1: Root state existence
    if (!state) return null

    // Guard 2: Extraction & Defaulting
    const array = state.array || []
    const stack = state.stack || []
    const currentIndex = state.currentIndex ?? -1
    const result = state.result || []
    const phase = state.phase || "IDLE"
    const explanation = state.explanation || "Initializing..."
    const activeComparison = state.activeComparison

    return (
        <div className="w-full h-full flex flex-col p-6 overflow-hidden bg-background/50 relative font-outfit">
            {/* Explanation Banner */}
            <div className="absolute top-4 right-4 z-20">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={explanation}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="px-4 py-2 rounded-xl bg-black/40 border border-white/10 backdrop-blur-md max-w-md text-right"
                    >
                        <p className="text-sm font-medium text-white/90">{explanation}</p>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Main Area: Array on Top, Stack on Bottom */}
            <div className="flex-1 flex flex-col justify-center gap-12">
                <div className="relative h-32 flex items-end justify-center gap-3 px-8">
                    {array.map((val, idx) => {
                        const isCurrent = idx === currentIndex
                        const inStack = stack.includes(idx)
                        const isBeingCompared = activeComparison && activeComparison.stackIdx === idx
                        const isProcessed = idx < currentIndex && !inStack && result[idx] !== -1 && result[idx] !== undefined

                        // Guarded stack position for gradient color
                        const stackPos = stack.indexOf(idx)
                        const stackColor = stackPos !== -1
                            ? `rgba(168, 85, 247, ${0.4 + (stackPos / Math.max(stack.length, 1)) * 0.6})`
                            : undefined

                        return (
                            <div key={idx} className="relative flex flex-col items-center group w-10">
                                <motion.div
                                    layout
                                    animate={{
                                        height: `${(val / maxVal) * 80 + 20}%`,
                                        backgroundColor: isCurrent
                                            ? 'rgba(59, 130, 246, 0.6)'
                                            : isBeingCompared
                                                ? 'rgba(239, 68, 68, 0.6)'
                                                : inStack
                                                    ? stackColor
                                                    : 'rgba(255, 255, 255, 0.1)',
                                        borderColor: isCurrent ? '#3b82f6' : isBeingCompared ? '#ef4444' : inStack ? '#a855f7' : 'rgba(255,255,255,0.1)',
                                        opacity: isProcessed ? 0.3 : 1
                                    }}
                                    className="w-full rounded-t-lg border-2 flex items-center justify-center transition-colors mb-2"
                                >
                                    <span className="text-xs font-bold text-white">{val}</span>
                                </motion.div>
                                <span className="text-[10px] font-mono text-white/30">{idx}</span>

                                {/* Result Overlay */}
                                {result[idx] !== undefined && result[idx] !== -1 && (
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="absolute -top-8 px-2 py-0.5 bg-green-500/20 border border-green-500/40 rounded text-[10px] text-green-400 font-bold"
                                    >
                                        {result[idx]}
                                    </motion.div>
                                )}

                                {isCurrent && (
                                    <motion.div layoutId="curr-pointer" className="absolute -bottom-6 flex flex-col items-center">
                                        <div className="w-0.5 h-2 bg-blue-500" />
                                        <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 px-1 rounded">i</span>
                                    </motion.div>
                                )}
                            </div>
                        )
                    })}
                </div>

                <div className="h-40 flex flex-col items-center justify-end">
                    <div className="text-xs font-bold uppercase tracking-widest text-white/30 mb-2">Monotonic Stack</div>
                    <div className="flex flex-col-reverse w-16 bg-white/5 border-l-2 border-r-2 border-b-2 border-white/10 rounded-b-xl min-h-[100px] p-2 gap-1 items-center">
                        <AnimatePresence>
                            {stack.map((idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: -20, scale: 0.8 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, x: 50, scale: 0.8 }}
                                    className="w-full py-1 bg-purple-500/20 border border-purple-500/40 rounded text-center"
                                >
                                    <span className="text-xs font-mono font-bold text-purple-300">
                                        {array[idx] ?? "-"} <span className="text-white/30 text-[9px]">({idx})</span>
                                    </span>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                        {stack.length === 0 && <span className="text-[10px] text-white/20 mt-4">Empty</span>}
                    </div>
                </div>
            </div>

            <div className="absolute top-4 left-4">
                <div className={`px-3 py-1 rounded-lg border text-xs font-bold uppercase tracking-widest ${phase === 'push' ? 'bg-purple-500/10 border-purple-500/20 text-purple-400' :
                    phase === 'pop' ? 'bg-red-500/10 border-red-500/20 text-red-400' :
                        'bg-blue-500/10 border-blue-500/20 text-blue-400'
                    }`}>
                    {phase}
                </div>
            </div>
        </div>
    )
}

export default MonotonicStackCanvas
