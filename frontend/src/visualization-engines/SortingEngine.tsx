import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../store/useStore'
import { cn } from '../utils/cn'

interface SortingEngineProps {
    isBrute?: boolean
}

const SortingEngine: React.FC<SortingEngineProps> = ({ isBrute = false }) => {
    const currentProblem = useStore(state => state.currentProblem)
    const currentStepIndex = useStore(state => state.currentStepIndex)
    const isBruteForceStore = useStore(state => state.isBruteForce)

    const effectiveIsBrute = isBrute !== undefined ? isBrute : isBruteForceStore
    const steps = currentProblem
        ? effectiveIsBrute
            ? currentProblem.brute_force_steps
            : currentProblem.optimal_steps
        : []

    const safeStep = steps?.[currentStepIndex] ?? steps?.[0] ?? null
    const state = safeStep?.state || {}
    const array = state.array || []
    const highlightIndices = state.highlightIndices || []
    const swapIndices = state.swapIndices || []
    const pivotIndex = state.pivotIndex
    const sortedIndices = state.sortedIndices || []

    if (!currentProblem || !safeStep) return null

    // Calculate max value for scaling bars
    const maxVal = Math.max(...array.map((v: any) => typeof v === 'number' ? v : 0), 1)

    return (
        <div className="flex flex-col h-full w-full overflow-hidden bg-black/40 min-h-0">
             {/* TOP SECTION: Step Explanation */}
             <div className="flex-none min-h-[110px] sm:min-h-[130px] border-b border-white/10 flex flex-col items-center justify-center px-10 bg-black/60 relative z-30">
                <AnimatePresence mode="wait">
                    <motion.p
                        key={`desc-${currentStepIndex}`}
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        className="text-[12px] text-white/50 font-medium uppercase tracking-[0.15em] text-center max-w-2xl"
                    >
                        {safeStep.description || "Sorting process..."}
                    </motion.p>
                </AnimatePresence>
                <div className="absolute bottom-0 left-0 h-[2px] bg-accent-blue/40 transition-all duration-300" style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }} />
            </div>

            {/* MAIN VISUALIZATION */}
            <div className="flex-1 flex flex-col items-center justify-center p-10 overflow-hidden relative">
                <div className="flex items-end justify-center gap-1 sm:gap-2 w-full max-w-4xl h-64 border-b border-white/5 pb-2">
                    {array.map((val: number, idx: number) => {
                        const isComparing = highlightIndices.includes(idx)
                        const isSwapping = swapIndices.includes(idx)
                        const isPivot = pivotIndex === idx
                        const isSorted = sortedIndices.includes(idx)
                        
                        let barColor = "bg-white/10"
                        if (isSorted) barColor = "bg-emerald-500/40"
                        if (isPivot) barColor = "bg-purple-500"
                        if (isComparing) barColor = "bg-accent-blue"
                        if (isSwapping) barColor = "bg-rose-500 shadow-glow-sm"

                        return (
                            <div key={`${idx}-${val}`} className="flex flex-col items-center flex-1 min-w-[20px]">
                                <motion.div
                                    layout
                                    className={cn(
                                        "w-full rounded-t-lg transition-colors relative",
                                        barColor
                                    )}
                                    style={{ 
                                        height: `${(val / maxVal) * 100}%`,
                                        minHeight: '10%'
                                    }}
                                    initial={false}
                                    animate={{
                                        scale: isComparing || isSwapping ? 1.05 : 1,
                                    }}
                                >
                                    {(isComparing || isSwapping || isPivot) && (
                                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] font-black uppercase text-white tracking-widest whitespace-nowrap">
                                            {isPivot ? 'PIVOT' : isSwapping ? 'SWAP' : 'CMP'}
                                        </div>
                                    )}
                                </motion.div>
                                <span className={cn(
                                    "text-[10px] font-black mt-2",
                                    isComparing || isSwapping ? "text-white" : "text-white/20"
                                )}>
                                    {val}
                                </span>
                            </div>
                        )
                    })}
                </div>
                
                {/* Visual Metadata Overlay */}
                <div className="absolute bottom-10 right-10 flex gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-accent-blue" />
                        <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest">Comparing</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-rose-500" />
                        <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest">Swapping</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SortingEngine
