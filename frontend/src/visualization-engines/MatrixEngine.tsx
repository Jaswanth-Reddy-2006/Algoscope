import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../store/useStore'
import { Activity, Clock, Grid } from 'lucide-react'
import { cn } from '../utils/cn'

interface MatrixEngineProps {
    isBrute?: boolean
}

const MatrixEngine: React.FC<MatrixEngineProps> = ({ isBrute = false }) => {
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
    const state = safeStep?.state
    const matrix = state?.matrix || []
    const highlightIndices = state?.highlightIndices || [] // Array of [r, c] or flat index
    const efficiency = effectiveIsBrute ? currentProblem?.efficiency?.brute : currentProblem?.efficiency?.optimal

    if (!currentProblem) return null

    if (!steps || steps.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[300px] text-white/20 gap-4">
                <Activity size={32} strokeWidth={1} className="animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-center">
                    Generating Matrix Visualization...
                </span>
            </div>
        )
    }

    if (!safeStep || !state) return null

    const isHighlighted = (r: number, c: number) => {
        return highlightIndices.some(h => Array.isArray(h) && h[0] === r && h[1] === c)
    }

    return (
        <div className="flex flex-col h-full w-full overflow-hidden bg-black/40 min-h-0">
            {/* TOP SECTION: Step Explanation */}
            <div className="flex-none min-h-[110px] sm:min-h-[130px] border-b border-white/10 flex flex-col items-center justify-center px-6 sm:px-10 bg-black/60 relative z-30">
                <div className="flex flex-col items-center gap-3 max-w-3xl w-full">
                    <AnimatePresence mode="wait">
                        <motion.p
                            key={`desc-${currentStepIndex}`}
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 5 }}
                            className="text-[10px] sm:text-[12px] text-white/50 font-medium uppercase tracking-[0.15em] text-center leading-relaxed"
                        >
                            {safeStep.description}
                        </motion.p>
                    </AnimatePresence>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={`calc-${currentStepIndex}`}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="px-6 py-2 rounded-full border-2 border-white/10 bg-white/[0.02]"
                        >
                            <div className="flex items-center gap-4 text-xs font-black italic uppercase text-white/80">
                                {state.explanation || "Transforming Matrix..."}
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
                <div className="absolute bottom-0 left-0 h-[2px] bg-accent-blue/40 transition-all duration-300" style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }} />
            </div>

            {/* MAIN CONTENT SECTION */}
            <div className="flex-1 min-h-0 relative flex flex-col p-6 sm:p-10 overflow-y-auto custom-scrollbar gap-10 items-center">
                <div className="flex items-center justify-between w-full max-w-2xl">
                    <div className="flex items-center gap-3">
                        <div className="px-3 py-1 rounded bg-white/5 border border-white/10 flex items-center gap-2">
                            <Activity size={10} className="text-accent-blue" />
                            <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest">Op: {currentStepIndex + 1}</span>
                        </div>
                        <div className="px-3 py-1 rounded bg-accent-blue/5 border border-accent-blue/10 flex items-center gap-2">
                            <Clock size={10} className="text-accent-blue" />
                            <span className="text-[9px] font-bold text-accent-blue uppercase tracking-widest">
                                {typeof efficiency === 'object' ? efficiency.time : efficiency}
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Grid size={12} className="text-white/20" />
                        <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest">{matrix.length}x{matrix[0]?.length || 0} Grid</span>
                    </div>
                </div>

                {/* Matrix Grid */}
                <div className="relative p-6 bg-white/[0.02] border border-white/10 rounded-3xl shadow-2xl">
                    <div
                        className="grid gap-2 sm:gap-4"
                        style={{ gridTemplateColumns: `repeat(${matrix[0]?.length || 0}, minmax(0, 1fr))` }}
                    >
                        {matrix.map((row: any[], rIdx: number) => (
                            row.map((val: any, cIdx: number) => {
                                const active = isHighlighted(rIdx, cIdx)
                                return (
                                    <motion.div
                                        key={`${rIdx}-${cIdx}`}
                                        layout
                                        initial={false}
                                        animate={{
                                            scale: active ? 1.05 : 1,
                                            backgroundColor: active ? "rgba(59, 130, 246, 0.2)" : "rgba(255, 255, 255, 0.05)",
                                            borderColor: active ? "rgba(59, 130, 246, 0.5)" : "rgba(255, 255, 255, 0.1)"
                                        }}
                                        className={cn(
                                            "w-10 h-10 sm:w-14 sm:h-14 rounded-xl border flex items-center justify-center font-bold text-sm sm:text-lg transition-all relative",
                                            active ? "text-accent-blue shadow-glow-sm" : "text-white/40"
                                        )}
                                    >
                                        {val}
                                        <div className="absolute -top-1.5 -left-1.5 text-[6px] text-white/10 font-mono">
                                            {rIdx},{cIdx}
                                        </div>
                                    </motion.div>
                                )
                            })
                        ))}
                    </div>
                </div>

                {/* Legend / Info */}
                <div className="mt-4 flex gap-6 text-[10px] uppercase font-bold tracking-[0.2em] text-white/20">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded bg-accent-blue/40 border border-accent-blue/60" />
                        <span>Active Swap / Move</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MatrixEngine
