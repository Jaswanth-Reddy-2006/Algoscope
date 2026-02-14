import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Anchor, AlertTriangle, Lightbulb, ChevronDown } from 'lucide-react'
import { Problem } from '../../types'
import { useStore } from '../../store/useStore'

interface PatternCapsuleProps {
    problem: Problem
}

const PatternCapsule: React.FC<PatternCapsuleProps> = ({ problem }) => {
    const [isExpanded, setIsExpanded] = useState(true)
    const patternStats = useStore(state => state.patternStats)

    // Level Logic
    const stats = patternStats[problem.slug]
    const confidence = stats?.confidence || 0
    let level = 'Initiate'
    let levelColor = 'text-amber-500' // Default fallback

    if (confidence >= 90) {
        level = 'Strategist'
        levelColor = 'text-purple-400'
    } else if (confidence >= 70) {
        level = 'Architect'
        levelColor = 'text-blue-400'
    } else if (confidence >= 40) {
        level = 'Practitioner'
        levelColor = 'text-green-400'
    } else {
        level = 'Initiate'
        levelColor = 'text-white/50'
    }

    // Fallback content if data is missing
    // Ideally this data should come from problem.pattern_capsule
    // For now we will use placeholders or try to extract from existing data if possible
    // but the plan called for adding this data.
    // Let's assume the data *might* exist or we show generic helpful text.

    // TEMPORARY: Since we haven't updated problems.json yet, we'll use safe defaults or check if the prop exists.
    // I will add the interface update in the next step, so for now I'll cast or use optional chaining.
    const capsule = (problem as any).pattern_capsule

    if (!capsule) return null

    return (
        <div className="font-outfit">
            <div className="glass-card border border-amber-500/20 bg-amber-500/5 rounded-2xl overflow-hidden transition-all duration-300">
                {/* Header */}
                <div
                    className="p-4 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors"
                    onClick={() => setIsExpanded(!isExpanded)}
                >
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500 shadow-glow-amber">
                            <Anchor size={16} />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-500">Pattern Capsule</h3>
                                <span className={`text-[9px] font-bold border border-white/10 px-1.5 rounded ${levelColor} bg-black/40`}>{level}</span>
                            </div>
                            <p className="text-[10px] text-white/40 font-mono">Critical Pattern Invariants</p>
                        </div>
                    </div>
                    <ChevronDown size={16} className={`text-white/20 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                </div>

                {/* Content */}
                <AnimatePresence>
                    {isExpanded && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="bg-black/20"
                        >
                            <div className="p-4 pt-0 space-y-4">
                                <div className="h-px w-full bg-white/5 mb-4" />

                                {/* Invariant */}
                                <div className="space-y-1.5">
                                    <div className="flex items-center gap-2 text-white/30">
                                        <Anchor size={12} />
                                        <span className="text-[9px] font-bold uppercase tracking-widest">Core Invariant</span>
                                    </div>
                                    <p className="text-xs text-white/70 leading-relaxed font-medium">
                                        {capsule.invariant}
                                    </p>
                                </div>

                                {/* Trigger */}
                                <div className="space-y-1.5">
                                    <div className="flex items-center gap-2 text-white/30">
                                        <Lightbulb size={12} />
                                        <span className="text-[9px] font-bold uppercase tracking-widest">Typical Trigger</span>
                                    </div>
                                    <p className="text-xs text-white/70 leading-relaxed font-light">
                                        {capsule.trigger}
                                    </p>
                                </div>

                                {/* Mistake */}
                                <div className="space-y-1.5">
                                    <div className="flex items-center gap-2 text-white/30">
                                        <AlertTriangle size={12} />
                                        <span className="text-[9px] font-bold uppercase tracking-widest">Common Mistake</span>
                                    </div>
                                    <p className="text-xs text-white/70 leading-relaxed font-light italic opacity-80">
                                        {capsule.mistake}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}

export default PatternCapsule
