import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../store/useStore'
import { cn } from '../utils/cn'
import { Activity, Plus, ArrowRight } from 'lucide-react'

interface LinkedListEngineProps {
    isBrute?: boolean
}

const LinkedListEngine: React.FC<LinkedListEngineProps> = ({ isBrute = false }) => {
    const currentProblem = useStore(state => state.currentProblem)
    const currentStepIndex = useStore(state => state.currentStepIndex)
    const isBruteForceStore = useStore(state => state.isBruteForce)

    const effectiveIsBrute = isBrute !== undefined ? isBrute : isBruteForceStore
    const customInput = useStore(state => state.customInput)
    const customTarget = useStore(state => state.customTarget)
    const steps = currentProblem ? (effectiveIsBrute ? currentProblem.brute_force_steps : currentProblem.optimal_steps) : []
    const safeStep = (steps && steps.length > 0) ? (steps[currentStepIndex] || steps[0]) : null

    if (!currentProblem) return null

    if (!steps || steps.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[300px] text-white/20 gap-4">
                <Activity size={32} strokeWidth={1} className="animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-center">
                    Generating Linked List Visualization...
                </span>
            </div>
        )
    }

    if (!safeStep) return null

    const state = ((safeStep as any)?.state || {}) as any
    const pointers = state.pointers || {}
    const customState = state.customState || state.values || {}
    const phase = state.phase
    const additionContext = state.additionContext || customState.additionContext || (state.v1 !== undefined || state.val1 !== undefined || state.sum !== undefined ? state : null)

    const safeRender = (val: any) => {
        if (val === undefined || val === null) return '0'
        if (typeof val === 'object') return '...'
        return String(val)
    }

    // Use nodes from state if available, otherwise fall back to parsing custom input
    const nodes = state.nodes || {};
    
    const parseList = (input: string, fallback: number[]) => {
        if (!input) return fallback;
        try {
            const cleaned = input.trim()
            if (cleaned.startsWith('[') && cleaned.endsWith(']')) return JSON.parse(cleaned)
            return cleaned.split(',').map(s => Number(s.trim())).filter(n => !isNaN(n))
        } catch (e) {
            return fallback
        }
    }

    const l1 = state.l1 || state.list1 || state.array1 || state.nodes1 || parseList(customInput, [2, 4, 3])
    const l2 = state.l2 || state.list2 || state.array2 || state.nodes2 || parseList(customTarget, [5, 6, 4])
    const result = state.res || state.result || state.ans || []

    const renderNode = (val: number, idx: number, type: 'l1' | 'l2' | 'res' = 'l1') => {
        // Check if any pointer refers to this index in this specific list
        const activePointerNames = Object.entries(pointers)
            .filter(([name, ptrIdx]) => {
                if (ptrIdx !== idx) return false;
                if (type === 'l1' && (name === 'l1' || name === 'head1' || name === 'p1')) return true;
                if (type === 'l2' && (name === 'l2' || name === 'head2' || name === 'p2')) return true;
                if (type === 'res' && (name === 'curr' || name === 'res' || name === 'dummy')) return true;
                if (name === 'curr' || name === 'p' || name === 'head') return true;
                return false;
            })
            .map(([name]) => name);

        const isCurrent = activePointerNames.length > 0;
        const label = activePointerNames[0]; // Take the first matching pointer for the label

        return (
            <div className="flex items-center gap-2">
                <motion.div
                    layout
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className={cn(
                        "w-12 h-12 rounded-full border-2 flex flex-col items-center justify-center font-bold relative transition-all duration-500",
                        isCurrent
                            ? (type === 'res' ? "border-green-400 bg-green-400/20 text-green-400 shadow-glow" :
                                type === 'l2' ? "border-purple-400 bg-purple-400/20 text-purple-400 shadow-glow-sm" :
                                    "border-accent-blue bg-accent-blue/20 text-accent-blue shadow-glow-sm")
                            : "border-white/10 bg-white/5 text-white/40"
                    )}
                >
                    <span className="text-sm">{val}</span>
                    {label && (
                        <div className="absolute -top-6 text-[7px] font-black text-white/40 bg-black/40 px-1 py-0.5 rounded border border-white/10 uppercase tracking-widest text-center w-max min-w-[30px] z-10">
                            {label}
                        </div>
                    )}
                </motion.div>
                <ArrowRight size={14} className="text-white/5" />
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full w-full overflow-hidden bg-black/40 min-h-0">
            {/* TOP SECTION: Explanation & Carry Stats */}
            <div className="flex-none h-40 border-b border-white/10 flex flex-col items-center justify-center px-10 bg-black/60 relative z-30">
                <div className="flex flex-col items-center gap-4 max-w-3xl w-full">
                    <AnimatePresence mode="wait">
                        <motion.p
                            key={`desc-${currentStepIndex}`}
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 5 }}
                            className="text-[11px] text-white/50 font-medium uppercase tracking-[0.2em] text-center leading-loose"
                        >
                            {safeStep.description}
                        </motion.p>
                    </AnimatePresence>

                    {/* LIVE CALCULATION HUD */}
                    {additionContext && (
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="flex items-center gap-4 bg-white/[0.03] px-8 py-3 rounded-2xl border border-white/10"
                        >
                            <div className="flex flex-col items-center">
                                <span className="text-[7px] text-accent-blue uppercase font-black tracking-tighter">List 1</span>
                                <span className="text-lg font-black text-white">{safeRender(additionContext.v1 ?? additionContext.val1)}</span>
                            </div>
                            <span className="text-lg text-white/20 font-light">+</span>
                            <div className="flex flex-col items-center">
                                <span className="text-[7px] text-purple-400 uppercase font-black tracking-tighter">List 2</span>
                                <span className="text-lg font-black text-white">{safeRender(additionContext.v2 ?? additionContext.val2)}</span>
                            </div>
                            <span className="text-lg text-white/20 font-light">+</span>
                            <div className="flex flex-col items-center">
                                <span className="text-[7px] text-red-400 uppercase font-black tracking-tighter">Carry</span>
                                <span className="text-lg font-black text-red-500">{safeRender(additionContext.carry ?? additionContext.oldCarry)}</span>
                            </div>
                            <span className="text-lg text-white/20 font-light">=</span>
                            <div className="flex flex-col items-center px-4 py-1 rounded-lg bg-accent-blue/10 border border-accent-blue/20">
                                <span className="text-[7px] text-accent-blue uppercase font-black tracking-tighter">Total</span>
                                <span className="text-lg font-black text-accent-blue">{safeRender(additionContext.sum)}</span>
                            </div>
                        </motion.div>
                    )}
                </div>
                <div className="absolute bottom-0 left-0 h-[2px] bg-accent-blue/40 transition-all duration-300" style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }} />
            </div>

            {/* MAIN VISUALIZATION CANVAS */}
            <div className="flex-1 min-h-0 relative flex flex-col p-10 overflow-y-auto custom-scrollbar gap-16">

                {/* TRACK 1: LIST 1 */}
                <div className="flex flex-col gap-5">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-accent-blue" />
                        <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">First Number (L1) - Reversed Storage</span>
                    </div>
                    <div className="flex items-center gap-0.5">
                        {l1.map((val: number, idx: number) => (
                            <React.Fragment key={`l1-${idx}`}>
                                {renderNode(
                                    val,
                                    idx,
                                    'l1'
                                )}
                            </React.Fragment>
                        ))}
                        <span className="text-[8px] font-black text-white/5 uppercase italic ml-2">Null</span>
                    </div>
                </div>

                {/* TRACK 2: LIST 2 */}
                <div className="flex flex-col gap-5">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-purple-500" />
                        <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Second Number (L2) - Reversed Storage</span>
                    </div>
                    <div className="flex items-center gap-0.5">
                        {l2.map((val: number, idx: number) => (
                            <React.Fragment key={`l2-${idx}`}>
                                {renderNode(
                                    val,
                                    idx,
                                    'l2'
                                )}
                            </React.Fragment>
                        ))}
                        <span className="text-[8px] font-black text-white/5 uppercase italic ml-2">Null</span>
                    </div>
                </div>

                {/* SUMMATION ZONE: CENTER ANIMATION */}
                <div className="flex justify-center h-20 relative">
                    <AnimatePresence mode="wait">
                        {additionContext && (
                            <motion.div
                                key={`addition-${currentStepIndex}`}
                                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 1.1, y: -20 }}
                                className="flex items-center gap-8 relative"
                            >
                                {/* Magic Result Digit Creation */}
                                <div className="flex flex-col items-center">
                                    <div className="w-16 h-16 rounded-2xl bg-green-500/10 border-2 border-green-500/30 flex axial-center flex-col items-center justify-center shadow-glow-sm">
                                        <span className="text-[8px] font-black text-green-500/60 uppercase mb-1">Digit</span>
                                        <span className="text-xl font-black text-green-400">{safeRender(additionContext.digit)}</span>
                                    </div>
                                    <div className="h-4 w-[1px] bg-green-500/20" />
                                    <span className="text-[7px] font-black text-green-500/40 uppercase tracking-widest">To Result</span>
                                </div>

                                {/* Next Carry Generation */}
                                <div className="flex flex-col items-center">
                                    <div className="w-16 h-16 rounded-2xl bg-red-500/10 border-2 border-red-500/30 flex axial-center flex-col items-center justify-center shadow-glow-sm">
                                        <span className="text-[8px] font-black text-red-500/60 uppercase mb-1">New Carry</span>
                                        <span className="text-xl font-black text-red-400">{safeRender(additionContext.newCarry ?? additionContext.nextCarry)}</span>
                                    </div>
                                    <div className="h-4 w-[1px] bg-red-500/20" />
                                    <span className="text-[7px] font-black text-red-500/40 uppercase tracking-widest">Next Step</span>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* TRACK 3: RESULT LIST */}
                <div className="flex flex-col gap-6 pt-10 border-t border-white/5">
                    <div className="flex items-center gap-3">
                        <Plus size={14} className="text-green-500" />
                        <span className="text-[10px] font-black text-green-400 uppercase tracking-[0.3em]">Sum Result List</span>
                    </div>
                    <div className="flex items-center gap-0.5 min-h-[60px]">
                        <AnimatePresence>
                            {result.map((val: number, idx: number) => (
                                <motion.div
                                    key={`res-${idx}`}
                                    initial={{ opacity: 0, x: -50, scale: 0.5 }}
                                    animate={{ opacity: 1, x: 0, scale: 1 }}
                                    transition={{ type: 'spring', damping: 15 }}
                                    className="flex items-center"
                                >
                                    {renderNode(val, idx, 'res')}
                                </motion.div>
                            ))}
                        </AnimatePresence>
                        {result.length === 0 && (
                            <span className="text-white/10 text-[10px] italic font-medium uppercase tracking-[0.1em]">Initializing Summation...</span>
                        )}
                        {phase === 'found' && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="px-4 py-1 rounded-full bg-green-500/20 border border-green-500/30 text-[8px] font-black text-green-400 uppercase ml-4"
                            >
                                Finished
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LinkedListEngine
