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

    if (!currentProblem) return null

    const steps = isBrute ? currentProblem.brute_force_steps : currentProblem.optimal_steps

    // PART 1: Defensive Rendering
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

    // PART 1: Strict Indexing
    const safeStep = steps[currentStepIndex] ?? steps[0] ?? null
    if (!safeStep) return null

    const { state } = safeStep

    let s = ""
    try {
        if (customInput != null) {
            s = String(customInput).replace(/^"|"$/g, '')
        }
    } catch (e) {
        s = "abcabcbb"
    }
    const chars = s.split('')

    const [winL, winR] = state.windowRange || [null, null]
    const complexity = isBrute ? currentProblem.complexity.brute : currentProblem.complexity.optimal

    return (
        <div className="flex-1 flex flex-col gap-8 p-10 w-full h-full overflow-y-auto custom-scrollbar bg-black/5">
            {/* PART 4: Standard Headers */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="px-3 py-1 rounded bg-white/5 border border-white/10 flex items-center gap-2">
                        <Activity size={10} className="text-accent-blue" />
                        <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest">Op Count: {currentStepIndex + 1}</span>
                    </div>
                    <div className="px-3 py-1 rounded bg-accent-blue/5 border border-accent-blue/10 flex items-center gap-2">
                        <Clock size={10} className="text-accent-blue" />
                        <span className="text-[9px] font-bold text-accent-blue uppercase tracking-widest">{complexity}</span>
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
                    {chars.map((char, idx) => {
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

                                {state.pointers && Object.entries(state.pointers).map(([id, ptrIndex]) => {
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
                            {state.mapState && typeof state.mapState === 'object' && Object.keys(state.mapState).map(char => (
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
                            {(!state.mapState || Object.keys(state.mapState).length === 0) && (
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
                            key={state.windowRange ? state.windowRange.join(',') : 'none'}
                            initial={{ filter: 'blur(4px)', opacity: 0 }}
                            animate={{ filter: 'blur(0px)', opacity: 1 }}
                            className="text-2xl font-bold font-mono tracking-widest text-accent-blue"
                        >
                            {winL !== null && winR !== null && s ? s.substring(winL, winR + 1) : '-'}
                        </motion.span>
                    </div>
                </div>
            </div>

            {/* Step Message */}
            <div className="mt-auto border-t border-white/5 pt-6">
                <div className="flex gap-4">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent-blue mt-1.5 shadow-glow-sm" />
                    <p className="text-[13px] text-white/60 leading-relaxed font-light italic">
                        {safeStep.description}
                    </p>
                </div>
            </div>
        </div>
    )
}

export default SlidingWindowEngine
