import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../store/useStore'
import { cn } from '../utils/cn'

interface UnionFindEngineProps {
    isBrute?: boolean
}

const UnionFindEngine: React.FC<UnionFindEngineProps> = ({ isBrute = false }) => {
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
    const parent = (state as any).parent || []
    const highlightIndices = (state as any).highlightIndices || []
    const mergeIndices = (state as any).mergeIndices || []

    if (!currentProblem || !safeStep) return null

    // Helper to calculate node positions in a simple grid
    const getPos = (idx: number) => {
        const rowSize = Math.ceil(Math.sqrt(parent.length))
        const r = Math.floor(idx / rowSize)
        const c = idx % rowSize
        return { x: c * 100 + 50, y: r * 100 + 50 }
    }

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
                        {safeStep.description || "Synthesizing Union Find logic..."}
                    </motion.p>
                </AnimatePresence>
                <div className="absolute bottom-0 left-0 h-[2px] bg-accent-blue/40 transition-all duration-300" style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }} />
            </div>

            {/* MAIN CONTENT Area */}
            <div className="flex-1 min-h-0 relative flex items-center justify-center p-10 overflow-hidden">
                <div className="relative w-full h-full max-w-5xl max-h-5xl overflow-auto custom-scrollbar flex items-center justify-center">
                    <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
                        {parent.map((p: number, i: number) => {
                            if (p === i) return null
                            const from = getPos(i)
                            const to = getPos(p)
                            const isConnecting = mergeIndices.includes(i) || mergeIndices.includes(p)
                            
                            return (
                                <motion.line
                                    key={`edge-${i}-${p}`}
                                    initial={{ pathLength: 0, opacity: 0 }}
                                    animate={{ pathLength: 1, opacity: 1 }}
                                    x1={from.x} y1={from.y}
                                    x2={to.x} y2={to.y}
                                    stroke={isConnecting ? "rgba(236, 65, 134, 0.4)" : "rgba(255, 255, 255, 0.1)"}
                                    strokeWidth={isConnecting ? 4 : 2}
                                    strokeDasharray={isConnecting ? "10 5" : "0"}
                                />
                            )
                        })}
                    </svg>

                    <div className="relative z-10 flex flex-wrap gap-12 justify-center max-w-2xl">
                        {parent.map((p: number, i: number) => {
                            const isHighlighted = highlightIndices.includes(i)
                            const isMerging = mergeIndices.includes(i)
                            const isRoot = p === i

                            return (
                                <motion.div
                                    key={i}
                                    layout
                                    className={cn(
                                        "w-16 h-16 rounded-2xl border-2 flex flex-col items-center justify-center transition-all duration-500 shadow-2xl relative",
                                        isMerging ? "border-rose-500 bg-rose-500/20 scale-110 shadow-glow" : 
                                        isHighlighted ? "border-accent-blue bg-accent-blue/20" :
                                        "border-white/5 bg-white/5"
                                    )}
                                >
                                    <span className={cn("text-[9px] font-black uppercase tracking-tighter opacity-20 mb-1")}>NODE {i}</span>
                                    <span className={cn("text-xl font-black", isMerging ? "text-white" : "text-white/60")}>{i}</span>
                                    {isRoot && <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-500 shadow-glow-sm" />}
                                    
                                    {/* Parent Overlay info */}
                                    <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] font-bold text-white/10 uppercase tracking-widest whitespace-nowrap">
                                        Parent: {p}
                                    </div>
                                </motion.div>
                            )
                        })}
                    </div>
                </div>

                <div className="absolute bottom-10 left-10 flex gap-10">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-glow-sm" />
                        <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest leading-none">Root Node</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UnionFindEngine
