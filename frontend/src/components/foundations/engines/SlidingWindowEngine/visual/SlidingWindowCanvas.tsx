import React, { useMemo } from 'react'
import { motion } from 'framer-motion'
import { WindowState } from '../core/slidingWindowCore'
import { slidingWindowInvariants } from '../core/invariantModels'

interface SlidingWindowCanvasProps {
    array: number[]
    state: WindowState
    mode: string
    context?: 'foundation' | 'application'
}

const SlidingWindowCanvas: React.FC<SlidingWindowCanvasProps> = ({
    array,
    state,
    mode,
    context = 'foundation'
}) => {
    const meta = slidingWindowInvariants[mode] || slidingWindowInvariants.fixed_window

    // Cell width for coordinated animations
    const gap = 8
    const totalStep = 48 + gap

    const maxVal = useMemo(() => Math.max(...array, 1), [array])


    // Distinct Color Mapping for AtMostK/ExactK
    const distinctColors = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'] // Red, Blue, Green, Amber, Purple, Pink

    return (
        <div className="w-full h-full flex flex-col items-center justify-center p-12 relative overflow-hidden bg-background/50">
            {/* Top Layer: Banners & Badges */}
            <div className="absolute top-8 left-8 flex flex-col gap-4">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold ${meta.color} uppercase tracking-[0.2em] shadow-glow-sm`}
                >
                    {meta.modelName.replace('_', ' ')}
                </motion.div>

                {state.currentContribution !== undefined && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-4 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex flex-col gap-1"
                    >
                        <span className="text-[8px] font-bold text-orange-400/60 uppercase tracking-widest">Net Contribution</span>
                        <span className="text-xl font-mono font-bold text-orange-400">+{state.currentContribution}</span>
                    </motion.div>
                )}
            </div>

            <div className="absolute top-8 right-8 flex flex-col items-end gap-3">
                <motion.div
                    animate={{
                        borderColor: state.conditionMet ? 'rgba(52, 211, 153, 0.2)' : 'rgba(248, 113, 113, 0.2)',
                        backgroundColor: state.conditionMet ? 'rgba(52, 211, 153, 0.05)' : 'rgba(248, 113, 113, 0.05)'
                    }}
                    className="p-6 rounded-[32px] border backdrop-blur-md text-right min-w-[240px]"
                >
                    <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest block mb-2">Invariant Monitor</span>
                    <code className={`text-2xl font-mono font-bold tracking-tight ${state.conditionMet ? 'text-emerald-400' : 'text-red-400'}`}>
                        {meta.invariant}
                    </code>
                    <div className="mt-2 flex items-center justify-end gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${state.conditionMet ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'}`} />
                        <span className="text-[10px] font-mono text-white/40">{state.conditionMet ? 'CONDITION_MET' : 'PREDICATE_FALSE'}</span>
                    </div>
                </motion.div>

                {context === 'foundation' && (mode === 'at_most_k' || mode === 'exact_k') && (
                    <motion.div
                        animate={{
                            backgroundColor: state.currentContribution ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                            borderColor: state.currentContribution ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                            scale: state.currentContribution ? 1.05 : 1
                        }}
                        className="px-4 py-2 rounded-xl border font-mono text-[10px] text-white/40 flex flex-col items-end"
                    >
                        <span>result += (right - left + 1)</span>
                        {state.currentContribution && (
                            <motion.span
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-emerald-400 font-bold"
                            >
                                + {state.currentContribution}
                            </motion.span>
                        )}
                    </motion.div>
                )}
            </div>

            {/* Middle Layer: Array Track */}
            <div className="relative flex items-end justify-center h-64 w-full max-w-5xl px-20">
                {/* Window Highlight Layer */}
                <motion.div
                    animate={{
                        left: `calc(50% - ${(array.length * totalStep) / 2}px + ${state.left * totalStep}px)`,
                        width: (state.right - state.left + 1) * totalStep - gap,
                        opacity: state.conditionMet ? 1 : 0.5
                    }}
                    transition={{ type: "spring", stiffness: 150, damping: 20 }}
                    className="absolute bottom-0 h-64 bg-accent-blue/5 border-x border-accent-blue/20 pointer-events-none rounded-t-2xl"
                />

                <div className="flex items-end gap-2 relative z-10">
                    {array.map((val, idx) => {
                        const isInWindow = idx >= state.left && idx <= state.right
                        const isLeaving = idx === state.left - 1 && !isInWindow

                        // Distinct Mode Visuals
                        const isDistinctMode = mode === 'at_most_k' || mode === 'exact_k'
                        const color = isDistinctMode ? distinctColors[(val - 1) % distinctColors.length] : '#3b82f6'

                        return (
                            <div key={idx} className="w-12 flex flex-col items-center gap-4">
                                <motion.div
                                    animate={{
                                        height: isDistinctMode ? '60%' : `${(val / maxVal) * 100}%`,
                                        opacity: isInWindow ? 1 : 0.2,
                                        backgroundColor: isInWindow
                                            ? (state.conditionMet ? (isDistinctMode ? color : 'rgba(59, 130, 246, 0.4)') : (isDistinctMode ? color : 'rgba(239, 68, 68, 0.4)'))
                                            : isLeaving ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                                        borderColor: isInWindow
                                            ? (state.conditionMet ? (isDistinctMode ? color : '#3b82f6') : '#ef4444')
                                            : isLeaving ? '#ef4444' : 'rgba(255, 255, 255, 0.1)',
                                        scale: isInWindow ? 1 : 0.95
                                    }}
                                    className="w-full rounded-xl border flex items-center justify-center pb-0 relative overflow-hidden transition-colors"
                                    style={{
                                        background: isDistinctMode && isInWindow ? `${color}40` : undefined
                                    }}
                                >
                                    <span className={`text-lg font-bold ${isInWindow ? 'text-white' : 'text-white/20'}`}>{val}</span>
                                    {isInWindow && !isDistinctMode && (
                                        <motion.div
                                            layoutId="window-glow"
                                            className="absolute inset-x-0 bottom-0 h-1 bg-accent-blue shadow-[0_0_15px_rgba(0,186,250,0.5)]"
                                        />
                                    )}
                                </motion.div>
                                <span className="text-[10px] font-mono text-white/10 uppercase">{idx}</span>
                            </div>
                        )
                    })}
                </div>

                {/* Pointer Overlay */}
                <div className="absolute inset-0 pointer-events-none">
                    {/* Left Pointer */}
                    <motion.div
                        animate={{
                            x: `calc(50% - ${(array.length * totalStep) / 2}px + ${state.left * totalStep}px + 24px - 50%)`
                        }}
                        transition={{ type: "spring", stiffness: 120, damping: 15 }}
                        className="absolute -top-16 flex flex-col items-center"
                    >
                        <span className="text-xs font-black text-accent-blue mb-1">L</span>
                        <div className="w-0.5 h-16 bg-gradient-to-t from-accent-blue/60 to-transparent" />
                    </motion.div>

                    {/* Right Pointer */}
                    <motion.div
                        animate={{
                            x: `calc(50% - ${(array.length * totalStep) / 2}px + ${state.right * totalStep}px + 24px - 50%)`
                        }}
                        transition={{ type: "spring", stiffness: 120, damping: 15 }}
                        className="absolute -top-16 flex flex-col items-center"
                    >
                        <span className="text-xs font-black text-purple-400 mb-1">R</span>
                        <div className="w-0.5 h-16 bg-gradient-to-t from-purple-400/60 to-transparent" />
                    </motion.div>
                </div>
            </div>

            {/* Bottom Layer: Feedback */}
            <div className="mt-20 w-full max-w-2xl px-8 py-6 rounded-3xl bg-white/[0.02] border border-white/5 backdrop-blur-sm">
                <div className="flex gap-4 items-start">
                    <div className="p-2 rounded-xl bg-accent-blue/10 text-accent-blue mt-1">
                        <motion.div
                            key={state.explanation}
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                        >
                            <span className="text-[10px] font-bold">LOG</span>
                        </motion.div>
                    </div>
                    <div className="flex-1">
                        <motion.p
                            key={state.explanation}
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-sm text-white/80 font-light leading-relaxed italic"
                        >
                            {state.explanation}
                        </motion.p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SlidingWindowCanvas
