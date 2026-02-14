import React from 'react'
import { useStore } from '../../store/useStore'
import {
    Activity,
    Info
} from 'lucide-react'
import { motion } from 'framer-motion'
import InspectorPanel from './InspectorPanel'
import { cn } from '../../utils/cn'

const CognitiveConsole: React.FC = () => {
    const currentProblem = useStore(state => state.currentProblem)
    const patternStats = useStore(state => state.patternStats)
    const generatePatternInsight = useStore(state => state.generatePatternInsight)
    const getAdaptiveBehavior = useStore(state => state.getAdaptiveBehavior)

    if (!currentProblem) return null

    const adaptiveBehavior = getAdaptiveBehavior(currentProblem.slug)
    const stats = patternStats[currentProblem.slug] || { confidence: 0, attempts: 0 }

    return (
        <div className="h-full flex flex-col bg-white/[0.01] font-outfit overflow-hidden">
            {/* Header: Pattern Status */}
            <header className="p-6 border-b border-white/5 space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Activity size={14} className="text-accent-blue" />
                        <span className="text-[10px] font-bold tracking-[0.2em] text-white/40 uppercase">Pattern Engine</span>
                    </div>
                    {adaptiveBehavior.statusLabel && (
                        <div className={cn(
                            "px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest border",
                            adaptiveBehavior.statusLabel === 'Focus Area' ? "text-amber-400 border-amber-500/20 bg-amber-500/5" : "text-green-400 border-green-500/20 bg-green-500/5"
                        )}>
                            {adaptiveBehavior.statusLabel}
                        </div>
                    )}
                </div>

                <div className="flex items-end justify-between">
                    <div className="space-y-1">
                        <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Mastery Level</span>
                        <div className="text-3xl font-black text-white/90 font-mono tracking-tighter">
                            {Math.round(stats.confidence)}<span className="text-xs text-white/20 ml-1">%</span>
                        </div>
                    </div>
                    <div className="w-24 h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-accent-blue"
                            initial={{ width: 0 }}
                            animate={{ width: `${stats.confidence}%` }}
                        />
                    </div>
                </div>
            </header>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
                {/* Section 2: Session Metrics */}
                <section className="space-y-4">
                    <h3 className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">Session Analytics</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <MetricCard label="Attempts" value={stats.attempts} />
                        <MetricCard label="Optimality" value={stats.confidence > 70 ? 'High' : 'Scaling'} />
                        <MetricCard label="Space Load" value={currentProblem.complexity.space} />
                        <MetricCard label="Efficiency" value={currentProblem.complexity.optimal} />
                    </div>
                </section>

                {/* Section 3: Insight Tip */}
                <section className="space-y-4">
                    <h3 className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">Single Insight</h3>
                    <div className="p-5 rounded-2xl bg-accent-blue/5 border border-accent-blue/10">
                        <div className="flex gap-4">
                            <Info size={16} className="text-accent-blue/40 shrink-0 mt-0.5" />
                            <p className="text-[13px] text-white/60 leading-relaxed font-light italic">
                                "{generatePatternInsight(currentProblem.slug)}"
                            </p>
                        </div>
                    </div>
                </section>

                {/* State Inspector Consolidated */}
                <section className="space-y-4 pt-4">
                    <div className="rounded-2xl border border-white/5 bg-black/10 overflow-hidden">
                        <InspectorPanel />
                    </div>
                </section>
            </div>
        </div>
    )
}

const MetricCard = ({ label, value }: { label: string, value: string | number }) => (
    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex flex-col gap-1.5 hover:bg-white/[0.04] transition-colors">
        <span className="text-[8px] font-bold text-white/10 uppercase tracking-widest">{label}</span>
        <span className="text-xs font-mono font-bold text-white/60">{value}</span>
    </div>
)

export default CognitiveConsole
