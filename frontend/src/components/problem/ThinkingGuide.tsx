import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '../../utils/cn'
import {
    ChevronDown,
    Brain,
    Zap,
    Info,
    ListChecks,
    HelpCircle
} from 'lucide-react'
import { Problem } from '../../types'
import { useStore } from '../../store/useStore'

interface ThinkingGuideProps {
    problem: Problem
    onChecklistComplete?: (isComplete: boolean) => void
}

const ThinkingGuide: React.FC<ThinkingGuideProps> = ({ problem, onChecklistComplete }) => {
    const [isExpanded, setIsExpanded] = useState(true)
    const [activeSection, setActiveSection] = useState<string | null>('pattern_signals')

    // Checklist state for unlocking viz
    const [completedSections, setCompletedSections] = useState<Record<string, boolean>>(() => {
        const saved = localStorage.getItem(`thinkingGuide_unlock_${problem.slug}`)
        return saved ? JSON.parse(saved) : {}
    })

    useEffect(() => {
        const count = Object.values(completedSections).filter(v => v).length
        onChecklistComplete?.(count >= 2)
        localStorage.setItem(`thinkingGuide_unlock_${problem.slug}`, JSON.stringify(completedSections))

        if (problem.slug) {
            const rate = (count / 4) * 100
            useStore.getState().trackActivity(problem.slug, 'guideSectionCompletionRate', rate)
        }
    }, [completedSections, onChecklistComplete, problem.slug])

    if (!problem.thinking_guide) return null

    const toggleSection = (id: string, e: React.MouseEvent) => {
        e.stopPropagation()
        setCompletedSections(prev => ({ ...prev, [id]: !prev[id] }))
    }

    const sections = [
        { id: 'pattern_signals', title: 'Pattern Signals', icon: Zap, content: problem.thinking_guide.pattern_signals },
        { id: 'core_invariant', title: 'Core Invariant', icon: Info, content: problem.thinking_guide.first_principles },
        { id: 'edge_cases', title: 'Edge Cases', icon: HelpCircle, content: problem.constraints },
        { id: 'strategy_shift', title: 'Strategy Shift', icon: ListChecks, content: problem.thinking_guide.approach_blueprint },
    ]

    return (
        <div className="flex flex-col gap-4 font-outfit">
            <div className={cn(
                "glass-card border border-white/5 bg-white/[0.02] overflow-hidden transition-all duration-500 rounded-2xl",
                isExpanded ? "p-6" : "p-4"
            )}>
                {/* Header */}
                <div
                    className="flex items-center justify-between cursor-pointer group"
                    onClick={() => setIsExpanded(!isExpanded)}
                >
                    <div className="flex items-center gap-4">
                        <div className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500",
                            isExpanded ? "bg-accent-blue/10 text-accent-blue" : "bg-white/5 text-white/20"
                        )}>
                            <Brain size={20} />
                        </div>
                        <div className="flex flex-col">
                            <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40 group-hover:text-white transition-colors">Thinking Guide</h3>
                            {isExpanded && <span className="text-[8px] text-accent-blue/40 font-bold uppercase tracking-widest mt-0.5">Internalize Pattern Invariants</span>}
                        </div>
                    </div>
                    <ChevronDown size={18} className={cn("text-white/20 transition-transform duration-500", isExpanded && "rotate-180 text-white")} />
                </div>

                {/* Content */}
                <AnimatePresence>
                    {isExpanded && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="mt-8 space-y-3"
                        >
                            {sections.map((section) => (
                                <div key={section.id} className="group/section">
                                    <div
                                        className={cn(
                                            "flex items-center justify-between p-4 rounded-xl transition-all cursor-pointer border",
                                            activeSection === section.id
                                                ? "bg-white/[0.04] border-white/10"
                                                : "bg-transparent border-transparent hover:bg-white/[0.02]"
                                        )}
                                        onClick={() => setActiveSection(activeSection === section.id ? null : section.id)}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div
                                                className={cn(
                                                    "w-5 h-5 rounded border flex items-center justify-center transition-all duration-300",
                                                    completedSections[section.id] ? "bg-accent-blue border-accent-blue text-black" : "border-white/10 text-transparent"
                                                )}
                                                onClick={(e) => toggleSection(section.id, e)}
                                            >
                                                <div className="w-2 h-2 bg-current rounded-sm" />
                                            </div>
                                            <span className={cn(
                                                "text-xs font-bold uppercase tracking-wider transition-colors",
                                                activeSection === section.id ? "text-white" : "text-white/30"
                                            )}>
                                                {section.title}
                                            </span>
                                        </div>
                                        <ChevronDown size={14} className={cn("transition-transform duration-300 text-white/10", activeSection === section.id && "rotate-180")} />
                                    </div>

                                    <AnimatePresence>
                                        {activeSection === section.id && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="overflow-hidden"
                                            >
                                                <div className="pb-4 pt-1 px-14 space-y-3">
                                                    {section.content.map((point, idx) => (
                                                        <div key={idx} className="flex gap-3">
                                                            <div className="w-1 h-1 rounded-full bg-accent-blue/40 mt-1.5 shrink-0" />
                                                            <p className="text-[13px] text-white/40 leading-relaxed font-light">
                                                                {point}
                                                            </p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ))}

                            <div className="pt-6 border-t border-white/5 mt-4">
                                <p className="text-[10px] text-white/20 font-medium leading-relaxed italic text-center">
                                    Analyze 2+ sections to unlock visualization layers
                                </p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}

export default ThinkingGuide
