import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../store/useStore'
import { Activity, Clock } from 'lucide-react'

interface SlidingWindowEngineProps {
    isBrute: boolean
}

const SlidingWindowEngine: React.FC<SlidingWindowEngineProps> = ({ isBrute }) => {
    const currentProblem = useStore(state => state.currentProblem)
    const currentStepIndex = useStore(state => state.currentStepIndex)
    const customInput = useStore(state => state.customInput)

    const steps = isBrute ? currentProblem?.brute_force_steps : currentProblem?.optimal_steps
    const safeStep = (steps?.[currentStepIndex] ?? steps?.[0] ?? null) as any
    const state = safeStep?.state || {}
    const s = state.array || state.string || (customInput != null ? String(customInput).replace(/^"|"$/g, '') : "abcabcbb")
    const chars = typeof s === 'string' ? s.split('') : Array.isArray(s) ? s : []
    
    // Support multiple naming conventions for window pointers
    const winL = state.pointers?.l ?? state.pointers?.left ?? state.pointers?.start ?? state.start_pointer ?? state.l ?? state.left ?? state.start ?? state.windowRange?.[0] ?? null
    const winR = state.pointers?.r ?? state.pointers?.right ?? state.pointers?.end ?? state.pointers?.curr ?? state.end_pointer ?? state.curr ?? state.r ?? state.right ?? state.end ?? state.windowRange?.[1] ?? null
    
    const efficiency = isBrute ? currentProblem?.efficiency?.brute : currentProblem?.efficiency?.optimal

    if (!currentProblem) return null

    if (!steps || steps.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[300px] text-white/20 gap-4">
                <Activity size={32} strokeWidth={1} className="animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-center">
                    No steps generated.<br />Click "Run Visualization" to start.
                </span>
            </div>
        )
    }

    if (!safeStep) return null

    try {
        return (
            <div className="flex flex-col h-full w-full overflow-hidden bg-black/40 min-h-0">
            {/* TOP SECTION: Step Explanation (Fixed Height) */}
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
                            className="px-6 py-2 rounded-full border-2 border-white/10 bg-white/[0.02]"
                        >
                            <div className="flex items-center gap-4 text-xs font-black italic uppercase">
                                {state.calculation ? (
                                    <span className="text-white font-mono">{typeof state.calculation === 'object' ? JSON.stringify(state.calculation) : state.calculation}</span>
                                ) : (
                                    <>
                                        <span className="text-white/40">Window:</span>
                                        <span className="text-accent-blue">[{winL ?? '-'}, {winR ?? '-'}]</span>
                                        <span className="text-white/20">|</span>
                                        <span className="text-white/40">Len:</span>
                                        <span className="text-white">{state.window?.currentLen || state.customState?.currentLen || 0}</span>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Progress bar */}
                <div className="absolute bottom-0 left-0 h-[2px] bg-accent-blue/40 transition-all duration-300" style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }} />
            </div>

            {/* MAIN CONTENT SECTION: SCROLLABLE */}
            <div className="flex-1 min-h-0 relative flex flex-col p-6 sm:p-10 overflow-y-auto custom-scrollbar gap-10">
                {/* Standard Headers (Compact) */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="px-3 py-1 rounded bg-white/5 border border-white/10 flex items-center gap-2">
                            <Activity size={10} className="text-accent-blue" />
                            <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest">Op Count: {currentStepIndex + 1}</span>
                        </div>
                        <div className="px-3 py-1 rounded bg-accent-blue/5 border border-accent-blue/10 flex items-center gap-2">
                            <Clock size={10} className="text-accent-blue" />
                            <span className="text-[9px] font-bold text-accent-blue uppercase tracking-widest">
                                {typeof efficiency === 'object' ? efficiency.time : efficiency}
                            </span>
                        </div>
                    </div>
                </div>

                {/* String Visualization */}
                <div className="flex flex-col gap-6">
                    <div className="flex justify-between items-center">
                        <div className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Memory Space (String)</div>
                        <div className="flex gap-4">
                            <div className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-lg border border-white/5">
                                <span className="text-[8px] text-white/30 uppercase font-bold tracking-widest">Window:</span>
                                <span className="text-xs font-bold text-accent-blue font-mono">{state.customState?.currentLen || 0}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-2 flex-wrap relative pb-10">
                        {(chars as any[]).map((char: any, idx: number) => {
                            const isInWindow = winL !== null && winR !== null && idx >= winL && idx <= winR
                            const isDuplicate = state.customState?.duplicateChar === char && isInWindow
                            const isFound = state.found && isInWindow

                            return (
                                <motion.div
                                    key={idx}
                                    layout
                                    className={`w-10 h-12 rounded-lg flex items-center justify-center text-lg font-bold border-2 transition-all relative ${isInWindow
                                        ? `border-accent-blue bg-accent-blue/10 text-accent-blue ${isDuplicate ? 'border-red-500 bg-red-500/20 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]' : ''}`
                                        : 'border-white/5 bg-white/5 text-white/20'
                                        } ${isFound ? 'shadow-[0_0_20px_rgba(34,197,94,0.3)] border-green-500 text-green-400' : ''}`}
                                >
                                    {char}
                                    <div className="absolute -top-5 text-[8px] text-white/10 font-mono">[{idx}]</div>

                                    {state.pointers && Object.entries(state.pointers as Record<string, number>).map(([id, ptrIndex]) => {
                                        if (ptrIndex !== idx) return null
                                        const ptrColorClass = id === 'left' || id === 'l' ? 'text-accent-blue' : 'text-purple-500'
                                        const ptrBgClass = id === 'left' || id === 'l' ? 'bg-accent-blue' : 'bg-purple-500'

                                        return (
                                            <motion.div
                                                key={id}
                                                layoutId={`ptr-${id}-${isBrute ? 'brute' : 'optimal'}`}
                                                className="absolute -bottom-8 flex flex-col items-center"
                                            >
                                                <div className={`w-1.5 h-1.5 ${ptrBgClass} rotate-45 mb-0.5 shadow-glow-sm`} />
                                                <span className={`text-[8px] font-bold uppercase ${ptrColorClass}`}>{id}</span>
                                            </motion.div>
                                        )
                                    })}
                                </motion.div>
                            )
                        })}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-8">
                    {/* Frequency Tracker */}
                    <div className="flex flex-col gap-4">
                        <div className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Cognitive Map (Character Set)</div>
                        <div className="bg-white/5 border border-white/5 rounded-2xl p-5 flex flex-wrap gap-2 min-h-[100px] content-start shadow-inner">
                            <AnimatePresence>
                                {state.mapState && typeof state.mapState === 'object' && Object.keys(state.mapState as object).map((char: string) => (
                                    <motion.div
                                        key={char}
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0.8, opacity: 0 }}
                                        className="px-2.5 py-1 bg-accent-blue/10 border border-accent-blue/20 rounded-lg text-xs font-mono text-accent-blue font-bold"
                                    >
                                        {char}
                                    </motion.div>
                                ))}
                                {(!state.mapState || Object.keys(state.mapState as object).length === 0) && (
                                    <div className="w-full text-center text-white/10 text-[10px] italic mt-4 uppercase tracking-widest font-bold">Set Empty</div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Substring View */}
                    <div className="flex flex-col gap-4">
                        <div className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Current Active Window</div>
                        <div className="bg-white/5 border border-white/5 rounded-2xl p-5 flex items-center justify-center min-h-[100px] shadow-inner">
                            <motion.span
                                key={winL != null && winR != null ? `${winL},${winR}` : 'none'}
                                initial={{ filter: 'blur(4px)', opacity: 0 }}
                                animate={{ filter: 'blur(0px)', opacity: 1 }}
                                className="text-2xl font-bold font-mono tracking-widest text-accent-blue"
                            >
                                {winL !== null && winR !== null && typeof s === 'string' ? s.substring(winL as number, (winR as number) + 1) : '-'}
                            </motion.span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        )
    } catch (error) {
        console.error("SlidingWindowEngine Render Error:", error);
        return (
            <div className="flex flex-col items-center justify-center h-full text-red-400 p-6 text-center">
                <span className="text-[10px] font-black uppercase tracking-widest mb-2">Render Error</span>
                <span className="text-xs font-bold leading-relaxed">Failed to visualize window state.</span>
                <span className="text-[8px] mt-2 opacity-40 whitespace-pre font-mono">{String(error).substring(0, 100)}</span>
            </div>
        )
    }
}

export default SlidingWindowEngine
