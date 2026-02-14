import React from 'react'
import { motion } from 'framer-motion'
import { useStore } from '../store/useStore'
import { Activity, Clock } from 'lucide-react'

interface TwoPointerEngineProps {
    isBrute: boolean
}

const TwoPointerEngine: React.FC<TwoPointerEngineProps> = ({ isBrute }) => {
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

    let items: any[] = []
    try {
        if (customInput && customInput.trim()) {
            items = JSON.parse(customInput)
        } else {
            items = [2, 7, 11, 15]
        }
    } catch (e) {
        items = [2, 7, 11, 15]
    }

    if (!Array.isArray(items)) items = [String(items)]

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

            {/* Input Array Visualization */}
            <div className="flex flex-col gap-6">
                <div className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Memory Space (Array)</div>
                <div className="flex gap-4 flex-wrap pb-10">
                    {items.map((num, idx) => {
                        const pointers = state.pointers || {}
                        const activePointerKeys = Object.keys(pointers).filter(k => pointers[k] === idx)
                        const isActive = activePointerKeys.length > 0
                        const isFound = state.found && isActive

                        return (
                            <motion.div
                                key={idx}
                                layout
                                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                className={`w-14 h-14 rounded-xl flex items-center justify-center text-lg font-bold border-2 transition-all relative ${isActive
                                    ? isBrute ? 'border-accent-blue bg-accent-blue/10 text-accent-blue shadow-glow-sm' : 'border-green-400 bg-green-400/10 text-green-400 shadow-glow-sm'
                                    : 'border-white/5 bg-white/5'
                                    } ${isFound ? 'border-green-500 bg-green-500/20 text-green-500 shadow-[0_0_20px_rgba(34,197,94,0.3)]' : ''}`}
                            >
                                <span className="truncate px-1">{typeof num === 'object' ? JSON.stringify(num) : String(num)}</span>
                                <div className="absolute -top-7 text-[9px] text-white/20 font-mono font-bold">[{idx}]</div>

                                {Object.entries(pointers).map(([id, ptrIndex]) => {
                                    if (ptrIndex !== idx) return null
                                    const ptrColorClass = id === 'i' || id === 'left' || id === 'low' ? 'text-accent-blue' : 'text-purple-500'
                                    const ptrBgClass = id === 'i' || id === 'left' || id === 'low' ? 'bg-accent-blue' : 'bg-purple-500'

                                    return (
                                        <motion.div
                                            key={id}
                                            layoutId={`ptr-${id}-${isBrute ? 'brute' : 'optimal'}`}
                                            className="absolute -bottom-8 flex flex-col items-center"
                                        >
                                            <div className={`w-2 h-2 ${ptrBgClass} rotate-45 mb-1 shadow-glow-sm`} />
                                            <span className={`text-[9px] font-bold uppercase tracking-tight ${ptrColorClass}`}>{id}</span>
                                        </motion.div>
                                    )
                                })}
                            </motion.div>
                        )
                    })}
                </div>
            </div>

            {/* PART 4: Visual Data Structures */}
            {state.mapState && typeof state.mapState === 'object' && (
                <div className="flex flex-col gap-4">
                    <div className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Cognitive State (HashMap)</div>
                    <div className="flex flex-wrap gap-2 p-5 bg-white/[0.01] border border-white/5 rounded-2xl min-h-[80px]">
                        {Object.entries(state.mapState).map(([k, v]) => (
                            <motion.div
                                key={k}
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-[10px] font-mono flex gap-2"
                            >
                                <span className="text-accent-blue font-bold">{k}</span>
                                <span className="text-white/20">→</span>
                                <span className="text-white/60">{typeof v === 'object' ? JSON.stringify(v) : String(v)}</span>
                            </motion.div>
                        ))}
                        {Object.keys(state.mapState).length === 0 && <span className="text-white/10 text-[10px] italic">Initial State: Empty</span>}
                    </div>
                </div>
            )}

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

export default TwoPointerEngine
