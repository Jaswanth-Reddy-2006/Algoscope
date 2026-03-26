import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../store/useStore'
import { cn } from '../utils/cn'

interface TwoPointerEngineProps {
    isBrute?: boolean
    steps?: any[]
}

const TwoPointerEngine: React.FC<TwoPointerEngineProps> = ({ isBrute = false, steps: overrideSteps }) => {
    const currentProblem = useStore(state => state.currentProblem)
    const currentStepIndex = useStore(state => state.currentStepIndex)
    const isBruteForceStore = useStore(state => state.isBruteForce)
    const setPlaying = useStore(state => state.setPlaying)

    const effectiveIsBrute = isBrute !== undefined ? isBrute : isBruteForceStore
    const steps = overrideSteps || (currentProblem ? (effectiveIsBrute ? currentProblem.brute_force_steps : currentProblem.optimal_steps) : [])
    const safeStep = (steps && steps.length > 0) ? (steps[currentStepIndex] || steps[0]) : null

    useEffect(() => {
        if (safeStep?.state?.phase === 'found') {
            setPlaying(false)
        }
    }, [safeStep, setPlaying])

    if (!currentProblem) return null

    if (!steps || steps.length === 0) {
        return (
            <div className="flex items-center justify-center h-full text-white/20 italic text-sm">
                Generating visualization steps...
            </div>
        )
    }

    if (!safeStep) return null

    const { state = {} } = safeStep
    const array1 = state.array1 || state.nums1 || []
    const array2 = state.array2 || state.nums2 || []
    const hasDualArrays = (Array.isArray(array1) && array1.length > 0) || (Array.isArray(array2) && array2.length > 0)

    const rawItems = state.array || state.string || state.result || []
    const items = typeof rawItems === 'string' ? rawItems.split('') : rawItems
    const pointers = state.pointers || {}
    const mapState = state.mapState || state.table || {}
    const highlightIndices = (state.highlightIndices || []) as any[]
    const phase = state.phase
    const customState = state.customState || state.window || {}
    const values = state.values || {}
    const isFound = phase === 'found'
    const stack = state.stack || []

    // Calculation logic for bottom section
    const targetValue = values.target ?? state.target ?? Number(useStore.getState().customTarget || 0)
    let currentCalculation = null

    if (state.calculation) {
        currentCalculation = (
            <div className="flex items-center gap-4 text-xl sm:text-2xl font-black italic uppercase text-white font-mono">
                {typeof state.calculation === 'object' ? JSON.stringify(state.calculation) : state.calculation}
            </div>
        )
    } else if (values.sum !== undefined || customState.currentSum !== undefined) {
        const sum = values.sum ?? customState.currentSum;
        currentCalculation = (
            <div className="flex items-center gap-4 text-xl sm:text-2xl font-black italic uppercase">
                <span className="text-white/20">SUM:</span>
                <span className={cn(isFound ? "text-green-400" : "text-white")}>{sum}</span>
                {targetValue !== 0 && (
                    <>
                        <span className="text-white/20">TARGET:</span>
                        <span className="text-accent-blue">{targetValue}</span>
                    </>
                )}
            </div>
        )
    } else {
        // Generic pointer-based value display
        const activeVals = Object.entries(pointers)
            .map(([name, idx]) => ({ name, val: items[idx as number] }))
            .filter(v => v.val !== undefined);
            
        if (activeVals.length > 0) {
            currentCalculation = (
                <div className="flex items-center gap-4 text-lg sm:text-xl font-black italic uppercase">
                    {activeVals.map((v, i) => (
                        <React.Fragment key={v.name}>
                            <span className="text-white/40">{v.name.toUpperCase()}:</span>
                            <span className="text-white">{v.val}</span>
                            {i < activeVals.length - 1 && <span className="text-white/10">|</span>}
                        </React.Fragment>
                    ))}
                </div>
            )
        }
    }

    return (
        <div className="flex flex-col h-full w-full overflow-hidden bg-black/40 min-h-0">
            {/* TOP SECTION: Step Explanation & Runtime Log */}
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
                            {safeStep.description || state.explanation}
                        </motion.p>
                    </AnimatePresence>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={`calc-${currentStepIndex}`}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.05 }}
                            className={cn(
                                "px-6 py-2 rounded-full border-2 transition-all duration-500 shadow-2xl bg-white/[0.02]",
                                isFound ? "border-green-500 bg-green-500/10 shadow-glow" : "border-white/10"
                            )}
                        >
                            {currentCalculation || <span className="text-white/10 font-black italic tracking-[0.2em] text-xs uppercase">Initializing Engine...</span>}
                        </motion.div>
                    </AnimatePresence>
                </div>
                <div className="absolute bottom-0 left-0 h-[2px] bg-accent-blue/40 transition-all duration-300" style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }} />
            </div>

            {/* MIDDLE SECTION: MAIN VISUALIZATION */}
            <div className="flex-1 min-h-0 relative flex flex-col p-4 sm:p-8 overflow-y-auto custom-scrollbar gap-10">

                {/* DUAL ARRAY VIEW (Median of Two Sorted Arrays) */}
                {hasDualArrays && (
                    <div className="flex flex-col gap-20 py-10 items-center">
                        <div className="flex flex-col gap-6 w-full items-center">
                            <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] self-start ml-10">Array 1</span>
                            <div className="flex flex-wrap justify-center gap-4">
                                {array1.map((val: any, idx: number) => {
                                    const activePointersAtIdx = Object.entries(pointers).filter(([pName, pIdx]) => pIdx === idx && (pName === 'i' || pName === 'l'));
                                    const isPointerHere = activePointersAtIdx.length > 0;
                                    return (
                                        <div key={`a1-${idx}`} className="relative pt-10">
                                            <AnimatePresence>
                                                {activePointersAtIdx.map(([id, _], pOffset) => (
                                                    <motion.div key={id} initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center z-20" style={{ top: `${pOffset * 30}px` }}>
                                                        <span className="text-[9px] font-black text-accent-blue bg-black px-1.5 py-0.5 rounded border border-accent-blue/30 uppercase">{id}</span>
                                                        <div className="text-accent-blue font-bold text-xl leading-none">↓</div>
                                                    </motion.div>
                                                ))}
                                            </AnimatePresence>
                                            <div className={cn("w-12 h-12 sm:w-16 sm:h-16 rounded-xl border-2 flex items-center justify-center font-bold text-lg", isPointerHere ? "border-accent-blue bg-accent-blue/20 text-accent-blue shadow-glow-sm" : "border-white/5 bg-white/5 text-white/30")}>
                                                {val}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                        <div className="flex flex-col gap-6 w-full items-center">
                            <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] self-start ml-10">Array 2</span>
                            <div className="flex flex-wrap justify-center gap-4">
                                {array2.map((val: any, idx: number) => {
                                    const activePointersAtIdx = Object.entries(pointers).filter(([pName, pIdx]) => pIdx === idx && (pName === 'j' || pName === 'r'));
                                    const isPointerHere = activePointersAtIdx.length > 0;
                                    return (
                                        <div key={`a2-${idx}`} className="relative pt-10">
                                            <AnimatePresence>
                                                {activePointersAtIdx.map(([id, _], pOffset) => (
                                                    <motion.div key={id} initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center z-20" style={{ top: `${pOffset * 30}px` }}>
                                                        <span className="text-[9px] font-black text-purple-500 bg-black px-2 py-0.5 rounded border border-purple-500/30 uppercase">{id}</span>
                                                        <div className="text-purple-500 font-bold text-xl leading-none">↓</div>
                                                    </motion.div>
                                                ))}
                                            </AnimatePresence>
                                            <div className={cn("w-12 h-12 sm:w-16 sm:h-16 rounded-xl border-2 flex items-center justify-center font-bold text-lg", isPointerHere ? "border-purple-500 bg-purple-500/20 text-purple-500 shadow-glow-sm" : "border-white/5 bg-white/5 text-white/30")}>
                                                {val}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                )}

                {/* SINGLE ARRAY VIEW */}
                {!hasDualArrays && items.length > 0 && (
                    <div className="flex-shrink-0 flex flex-col justify-center items-center py-8">
                        <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
                            {items.map((num: any, idx: number) => {
                                const activePointersAtIdx = Object.entries(pointers).filter(([_, pIdx]) => pIdx === idx);
                                const isHighlighted = highlightIndices.includes(idx)
                                let status: 'neutral' | 'active' | 'discarded' | 'visited' | 'match' = 'neutral'
                                if (isFound && isHighlighted) status = 'match'
                                else if (isHighlighted) status = 'active'
                                else if (pointers.l !== undefined && pointers.l !== null && pointers.r !== undefined && pointers.r !== null && (idx < (pointers.l as number) || idx > (pointers.r as number))) status = 'discarded'

                                return (
                                    <div key={idx} className="relative pt-24 pb-6 px-1">
                                        <AnimatePresence>
                                            {activePointersAtIdx.map(([id, _], pOffset) => {
                                                const isPurple = id === 'j' || id === 'r' || id === 'right' || id === 'high';
                                                return (
                                                    <motion.div
                                                        key={id}
                                                        initial={{ y: -20, opacity: 0 }}
                                                        animate={{ y: 0, opacity: 1 }}
                                                        exit={{ y: 20, opacity: 0 }}
                                                        className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center z-20"
                                                        style={{ top: `${(pOffset * 32)}px` }}
                                                    >
                                                        <span className={cn(
                                                            "text-[8px] font-black px-1.5 py-0.5 rounded border uppercase shadow-2xl",
                                                            isPurple ? "bg-purple-900/40 text-purple-400 border-purple-500/40" : "bg-blue-900/40 text-accent-blue border-accent-blue/40"
                                                        )}>
                                                            {id}
                                                        </span>
                                                        <div className={cn("text-lg font-bold leading-tight", isPurple ? "text-purple-500" : "text-accent-blue")}>↓</div>
                                                    </motion.div>
                                                )
                                            })}
                                        </AnimatePresence>
                                        <motion.div
                                            layout
                                            className={cn(
                                                "w-12 h-12 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center font-black border-2 transition-all",
                                                status === 'match' ? "border-green-500 bg-green-500/30 text-green-400 shadow-glow" :
                                                    status === 'active' ? "border-accent-blue bg-accent-blue/20 text-accent-blue scale-110 shadow-glow-sm" :
                                                        status === 'discarded' ? "border-white/5 opacity-20" : "border-white/10 bg-white/5 text-white/80"
                                            )}
                                        >
                                            {num}
                                        </motion.div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}

                {/* AUXILIARY VISUALS */}
                <div className="mt-auto flex flex-col gap-10">
                    {Object.keys(mapState).length > 0 && (
                        <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
                            <h4 className="text-[10px] uppercase font-black text-white/40 tracking-[0.3em] mb-4">Hash Map</h4>
                            <div className="flex flex-wrap gap-3">
                                {Object.entries(mapState).map(([k, v]) => (
                                    <div key={k} className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg flex items-center gap-3">
                                        <span className="text-accent-blue font-mono font-bold">{k}</span>
                                        <span className="text-white/20">→</span>
                                        <span className="text-white font-bold">{Array.isArray(v) ? `[${v.join(', ')}]` : String(v)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {stack.length > 0 && (
                        <div className="flex flex-col items-center gap-4">
                            <h4 className="text-[10px] uppercase font-black text-white/40 tracking-[0.3em]">Stack</h4>
                            <div className="flex flex-col-reverse gap-2 w-32 border-x-2 border-b-2 border-white/10 p-2 rounded-b-xl min-h-[100px]">
                                {stack.map((s: any, idx: number) => (
                                    <motion.div key={idx} initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="h-10 bg-accent-purple/20 border border-accent-purple/40 rounded flex items-center justify-center text-accent-purple font-bold">
                                        {s}
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default TwoPointerEngine
