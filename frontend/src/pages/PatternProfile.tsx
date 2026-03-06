import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
    Zap,
    ArrowRight,
    Clock,
    ShieldAlert,
    Target,
    Activity,
    Search,
    Bell,
    History
} from 'lucide-react'
import { PATTERN_HIERARCHY } from '../data/patternHierarchy'
import { useStore } from '../store/useStore'
import CognitiveTransferMatrix from '../components/profile/CognitiveTransferMatrix'

const PatternProfile = () => {
    const navigate = useNavigate()
    const problems = useStore(state => state.problems)
    const patternStats = useStore(state => state.patternStats)

    // Comprehensive Pattern Data (Includes all patterns from hierarchy)
    const patternData = useMemo(() => {
        const allPatterns: any[] = []

        Object.entries(PATTERN_HIERARCHY).forEach(([, group]) => {
            Object.entries(group.patterns).forEach(([patternId, patternDef]) => {
                // Get aggregate stats for this pattern
                const solvedInPattern = problems.filter(p => p.algorithmType === patternId)
                const aggregateStats = patternStats[`pattern_${patternId}`]

                let totalConfidence = 0
                let practicedCount = 0
                let lastPracticed = 0

                solvedInPattern.forEach(p => {
                    const stats = patternStats[p.slug]
                    if (stats) {
                        totalConfidence += stats.confidence
                        practicedCount++
                        lastPracticed = Math.max(lastPracticed, stats.lastPracticed || 0)
                    }
                })

                const avgConfidence = aggregateStats?.confidence || (practicedCount > 0 ? totalConfidence / practicedCount : 0)
                const daysSincePractice = lastPracticed ? (Date.now() - lastPracticed) / (1000 * 60 * 60 * 24) : 999
                const needsRefresh = avgConfidence > 0 && (avgConfidence < 50 || daysSincePractice > 14)

                // Sub-pattern data
                const subPatternData = patternDef.subPatterns.map(sp => ({
                    id: sp,
                    confidence: patternStats[`${patternId}_${sp}`]?.confidence || 0
                }))

                // Level Logic
                let level = 'Initiate'
                let levelColor = 'text-white/40'
                let levelBg = 'bg-white/5'
                if (avgConfidence >= 90) {
                    level = 'Strategist'
                    levelColor = 'text-purple-400'
                    levelBg = 'bg-purple-400/10'
                } else if (avgConfidence >= 70) {
                    level = 'Architect'
                    levelColor = 'text-blue-400'
                    levelBg = 'bg-blue-400/10'
                } else if (avgConfidence >= 40) {
                    level = 'Practitioner'
                    levelColor = 'text-pink-400'
                    levelBg = 'bg-pink-400/10'
                }

                allPatterns.push({
                    type: patternId,
                    title: patternDef.title,
                    groupTitle: group.title,
                    confidence: Math.round(avgConfidence),
                    level,
                    levelColor,
                    levelBg,
                    problemCount: solvedInPattern.length,
                    lastPracticed,
                    needsRefresh,
                    daysSincePractice,
                    subPatterns: subPatternData
                })
            })
        })

        return allPatterns.sort((a, b) => b.confidence - a.confidence)
    }, [problems, patternStats])

    // Global Stats
    const globalStats = useMemo(() => {
        const practiced = patternData.filter(p => p.confidence > 0)
        if (practiced.length === 0) return { avg: 0, strongest: 'None', weakest: 'None' }
        const avg = Math.round(practiced.reduce((acc, p) => acc + p.confidence, 0) / practiced.length)
        return {
            avg,
            strongest: practiced[0].title,
            weakest: practiced[practiced.length - 1].title
        }
    }, [patternData])

    // Insights
    const insights = useMemo(() => {
        const allInsights: string[] = []
        problems.forEach(p => {
            const stats = patternStats[p.slug]
            if (stats) {
                if (stats.confidence < 50 && stats.attempts > 2) {
                    allInsights.push(`Struggling with ${p.title}: Try breaking down the brute force constraints.`)
                }
                if (stats.bruteFirstCount > stats.attempts * 0.8) {
                    allInsights.push(`${p.title}: Heavy reliance on brute force detected.`)
                }
            }
        })
        return allInsights.slice(0, 3)
    }, [problems, patternStats])

    const recommendation = useStore(state => state.getRecommendedAction())

    return (
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative font-outfit bg-[#0f0314]">
            {/* Header (Screenshot Style) */}
            <div className="h-20 px-8 flex items-center justify-between border-b border-white/5 bg-black/20 backdrop-blur-xl z-20 shrink-0">
                <div className="relative w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                    <input
                        type="text"
                        placeholder="Search patterns or algorithms..."
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-[#EC4186]/30 transition-all"
                    />
                </div>
                <div className="flex items-center gap-6">
                    <button className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/40 hover:text-white transition-all">
                        <Bell size={18} />
                    </button>
                    <div className="flex items-center gap-3 pl-6 border-l border-white/10">
                        <div className="text-right">
                            <p className="text-xs font-bold text-white uppercase tracking-wider">Jaswanth Reddy</p>
                            <p className="text-[10px] text-[#EC4186] font-bold uppercase tracking-tight">Pro Member</p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#EC4186] to-[#EE544A]" />
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-10">
                <div className="max-w-[1400px] mx-auto space-y-16">
                    {/* Header Row */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <h1 className="text-4xl font-black text-white tracking-tight mb-2">Pattern Profile</h1>
                            <p className="text-white/40 text-sm font-medium italic">Real-time visualization of your algorithmic mastery and problem-solving DNA.</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-white/60 hover:text-white transition-all uppercase tracking-widest">
                                <History size={14} />
                                View History
                            </button>
                            <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#EC4186] text-xs font-bold text-white shadow-[0_10px_20px_rgba(236,65,134,0.3)] hover:scale-105 transition-all uppercase tracking-widest">
                                <Zap size={14} className="fill-current" />
                                Daily Challenge
                            </button>
                        </div>
                    </div>

                    {/* Top: Global Cognitive Metrics (Step 586 Style) */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="glass-card p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 min-h-[200px] flex flex-col justify-between relative overflow-hidden">
                            <div>
                                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#EC4186] mb-2 block">Global Confidence</span>
                                <div className="flex items-baseline gap-3">
                                    <h2 className="text-5xl font-black text-white">0%</h2>
                                    <span className="text-xs font-bold text-white/20 flex items-center gap-1">
                                        Active
                                    </span>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div className="flex justify-between text-[10px] font-bold text-white/20 uppercase tracking-widest">
                                    <span>To Elite Status</span>
                                    <span>12% to go</span>
                                </div>
                                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${globalStats.avg}%` }}
                                        className="h-full bg-gradient-to-r from-[#EC4186] to-[#EE544A]"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="glass-card p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 min-h-[200px] flex flex-col justify-between group">
                            <div>
                                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#10B981] mb-2 block">Strongest Pattern</span>
                                <h2 className="text-3xl font-black text-white capitalize">-</h2>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest bg-white/5 text-white/20 border border-white/10">Stable</span>
                                <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">-</span>
                            </div>
                        </div>

                        <div className="glass-card p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 min-h-[200px] flex flex-col justify-between group">
                            <div>
                                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#EE544A] mb-2 block">Priority Area</span>
                                <h2 className="text-3xl font-black text-white capitalize">-</h2>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest bg-white/5 text-white/20 border border-white/10">Stable</span>
                                <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">-</span>
                            </div>
                        </div>
                    </div>

                    {/* Middle: Pattern Inventory (Comprehensive Matrix) */}
                    <section>
                        <div className="flex items-center justify-between mb-10">
                            <div className="flex items-center gap-4">
                                <h2 className="text-2xl font-black text-white tracking-tight">Pattern Inventory</h2>
                                <span className="px-2.5 py-0.5 rounded-lg bg-[#EC4186]/10 text-[#EC4186] text-[10px] font-bold uppercase tracking-widest border border-[#EC4186]/20">
                                    {patternData.length} Patterns
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {patternData.map((pattern, idx) => (
                                <motion.div
                                    key={pattern.type}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className={`glass-card p-6 border rounded-[2.5rem] group hover:border-[#EC4186]/30 transition-all relative overflow-hidden bg-white/[0.02] ${pattern.needsRefresh ? 'border-[#EE544A]/30' : 'border-white/5'}`}
                                >
                                    {pattern.needsRefresh && (
                                        <div className="absolute top-6 right-6">
                                            <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-[#EE544A]/20 text-[#EE544A] border border-[#EE544A]/20">
                                                <Clock size={10} />
                                                <span className="text-[8px] font-bold uppercase tracking-tighter">Refresh Required</span>
                                            </div>
                                        </div>
                                    )}

                                    <div className="mb-8">
                                        <div className="flex justify-between items-start mb-4">
                                            <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${pattern.levelBg} ${pattern.levelColor} border border-white/5`}>
                                                {pattern.level}
                                            </span>
                                            <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest">{pattern.groupTitle}</span>
                                        </div>
                                        <h3 className="text-xl font-black text-white capitalize mb-1 group-hover:text-[#EC4186] transition-colors">
                                            {pattern.title}
                                        </h3>
                                        <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">{pattern.problemCount} Problems Solved</p>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex justify-between items-end">
                                            <span className="text-[10px] font-mono font-bold text-white/20 uppercase tracking-widest">Confidence</span>
                                            <span className="text-sm font-mono font-bold text-white">{pattern.confidence}%</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full transition-all duration-1000 ${pattern.confidence >= 80 ? 'bg-gradient-to-r from-emerald-500 to-emerald-400' : pattern.confidence >= 40 ? 'bg-gradient-to-r from-[#EC4186] to-[#EE544A]' : 'bg-white/10'}`}
                                                style={{ width: `${pattern.confidence}%` }}
                                            />
                                        </div>
                                    </div>

                                    {/* Sub-Pattern Mastery (Step 575 Design requirement) */}
                                    {pattern.subPatterns.length > 0 && (
                                        <div className="mt-8 pt-6 border-t border-white/5 space-y-4">
                                            <h4 className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">Sub-Pattern Exploration</h4>
                                            <div className="grid grid-cols-1 gap-3">
                                                {pattern.subPatterns.map((sp: any) => (
                                                    <div key={sp.id} className="space-y-2">
                                                        <div className="flex justify-between items-center text-[10px]">
                                                            <span className="text-white/60 capitalize font-medium">{sp.id.replace(/_/g, ' ')}</span>
                                                            <span className="text-white/30 font-mono italic">{Math.round(sp.confidence)}%</span>
                                                        </div>
                                                        <div className="w-full h-1 bg-white/[0.03] rounded-full overflow-hidden">
                                                            <div
                                                                className={`h-full rounded-full transition-all duration-1000 ${sp.confidence > 0 ? 'bg-[#EC4186]/50' : 'bg-transparent'}`}
                                                                style={{ width: `${sp.confidence}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <button
                                        onClick={() => navigate(`/mastery/${pattern.type}`)}
                                        className="w-full mt-8 py-3.5 rounded-2xl bg-white/5 hover:bg-[#EC4186] border border-white/5 text-[10px] font-bold uppercase tracking-widest text-white/40 hover:text-white transition-all flex items-center justify-center gap-2 group/btn"
                                    >
                                        Mastery Analytics
                                        <ArrowRight size={12} className="group-hover/btn:translate-x-1 transition-transform" />
                                    </button>
                                </motion.div>
                            ))}
                        </div>
                    </section>

                    {/* Bottom: Recommendation & Matrix (Original structure restoration) */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-10">
                        <div className="lg:col-span-2">
                            <div className="flex items-center gap-3 mb-8">
                                <Activity size={18} className="text-[#EC4186]" />
                                <h2 className="text-xl font-bold text-white tracking-tight">Cognitive Transfer Matrix</h2>
                            </div>
                            <CognitiveTransferMatrix />
                        </div>
                        <div className="space-y-6">
                            {recommendation && (
                                <section>
                                    <div className="flex items-center gap-3 mb-8">
                                        <Target size={18} className="text-[#EE544A]" />
                                        <h2 className="text-sm font-bold uppercase tracking-widest text-white/60">Next Objective</h2>
                                    </div>
                                    <div className="glass-card p-8 border border-[#EC4186]/30 bg-[#EC4186]/5 rounded-[2.5rem] relative overflow-hidden group hover:border-[#EC4186]/50 transition-all flex flex-col justify-between min-h-[240px]">
                                        <div>
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-[#EC4186] mb-3 block">Strategy Suggestion</span>
                                            <h3 className="text-2xl font-black text-white leading-tight mb-4">{recommendation.message}</h3>
                                        </div>
                                        <button
                                            onClick={() => navigate(recommendation.link)}
                                            className="w-full py-4 bg-[#EC4186] hover:bg-[#EC4186]/90 text-white font-black rounded-2xl transition-all shadow-[0_10px_20px_rgba(236,65,134,0.3)] flex items-center justify-center gap-3 uppercase tracking-widest text-xs"
                                        >
                                            {recommendation.label}
                                            <ArrowRight size={16} />
                                        </button>
                                    </div>
                                </section>
                            )}

                            <section>
                                <div className="flex items-center gap-3 mb-8">
                                    <ShieldAlert size={18} className="text-purple-400" />
                                    <h2 className="text-sm font-bold uppercase tracking-widest text-white/60">Neural Feedback</h2>
                                </div>
                                <div className="glass-card border border-white/5 bg-purple-500/5 rounded-[2.5rem] p-8 space-y-6">
                                    {insights.length > 0 ? insights.map((insight, i) => (
                                        <div key={i} className="flex gap-4 items-start">
                                            <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2 shrink-0 shadow-[0_0_8px_rgba(168,85,247,0.5)]" />
                                            <p className="text-xs text-white/60 leading-relaxed font-medium">"{insight}"</p>
                                        </div>
                                    )) : (
                                        <p className="text-xs text-white/20 italic text-center">Solve more problems to generate deep-slice insights.</p>
                                    )}
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Information */}
            <div className="h-12 border-t border-white/5 flex items-center justify-center px-8 text-[9px] text-white/10 uppercase tracking-[0.4em] font-black shrink-0">
                Algoscope Intelligence Systems • V2.5.0-STABLE • Pattern Mastery Engine Active
            </div>
        </div>
    )
}

export default PatternProfile
