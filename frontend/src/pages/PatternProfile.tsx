import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
    Brain,
    Zap,
    BarChart2,
    ArrowRight,
    AlertCircle,
    Clock,
    ShieldAlert
} from 'lucide-react'
import { getPatternInfo } from '../data/patternHierarchy'
import { useStore } from '../store/useStore'
import CognitiveTransferMatrix from '../components/profile/CognitiveTransferMatrix'

const PatternProfile = () => {
    const navigate = useNavigate()
    const problems = useStore(state => state.problems)
    const patternStats = useStore(state => state.patternStats)

    // Aggregate stats by Algorithm Type
    const patternData = useMemo(() => {
        const groups: Record<string, { totalConfidence: number, count: number, problems: any[], lastPracticed: number }> = {}

        problems.forEach(p => {
            const type = p.algorithmType || 'Uncategorized'
            if (!groups[type]) {
                groups[type] = { totalConfidence: 0, count: 0, problems: [], lastPracticed: 0 }
            }
            groups[type].problems.push(p)

            const stats = patternStats[p.slug]
            if (stats) {
                groups[type].totalConfidence += stats.confidence
                groups[type].count += 1
                groups[type].lastPracticed = Math.max(groups[type].lastPracticed, stats.lastPracticed || 0)
            }
        })

        return Object.entries(groups).map(([type, data]) => {
            const aggregateStats = patternStats[`pattern_${type}`]
            const avgConfidence = aggregateStats?.confidence || (data.count > 0 ? data.totalConfidence / data.count : 0)

            const patternInfo = getPatternInfo(type)
            const subPatterns = patternInfo?.subPatterns || []
            const subPatternData = subPatterns.map((sp: string) => ({
                id: sp,
                confidence: patternStats[`${type}_${sp}`]?.confidence || 0
            }))
            let level = 'Initiate'
            let levelColor = 'text-white/40'
            const daysSincePractice = data.lastPracticed ? (Date.now() - data.lastPracticed) / (1000 * 60 * 60 * 24) : 999
            const needsRefresh = avgConfidence < 50 || daysSincePractice > 14

            // Level Logic
            if (avgConfidence >= 90) {
                level = 'Strategist'
                levelColor = 'text-purple-400'
            } else if (avgConfidence >= 70) {
                level = 'Architect'
                levelColor = 'text-blue-400'
            } else if (avgConfidence >= 40) {
                level = 'Practitioner'
                levelColor = 'text-green-400'
            }

            return {
                type,
                confidence: Math.round(avgConfidence),
                level,
                levelColor,
                problemCount: data.problems.length,
                lastPracticed: data.lastPracticed,
                needsRefresh,
                daysSincePractice,
                subPatterns: subPatternData
            }
        }).sort((a, b) => b.confidence - a.confidence)
    }, [problems, patternStats])

    // Global Stats
    const globalStats = useMemo(() => {
        if (patternData.length === 0) return { avg: 0, strongest: 'None', weakest: 'None' }
        const avg = Math.round(patternData.reduce((acc, p) => acc + p.confidence, 0) / patternData.length)
        return {
            avg,
            strongest: patternData[0].type,
            weakest: patternData[patternData.length - 1].type
        }
    }, [patternData])


    // Generate Insights
    const insights = useMemo(() => {
        const allInsights: string[] = []
        problems.forEach(p => {
            // We can check local "patternStats" for generic issues to generate a summary
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


    // Get Recommended Action
    const recommendation = useStore(state => state.getRecommendedAction())

    return (
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative font-outfit bg-background/50">
            {/* Header */}
            <div className="h-20 px-8 flex items-center justify-between border-b border-white/5 bg-background/50 backdrop-blur-md z-10 shrink-0">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-accent-purple/10 flex items-center justify-center border border-accent-purple/20 shadow-glow-purple">
                        <Brain size={20} className="text-accent-purple" />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold tracking-widest text-white uppercase">Pattern Profile</h1>
                        <p className="text-[10px] text-white/40 uppercase tracking-wider font-mono">Cognitive Architecture Overview</p>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
                <div className="max-w-7xl mx-auto space-y-12">

                    {/* Top: Global Cognitive Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="glass-card p-6 border border-white/5 bg-white/[0.02] rounded-3xl flex flex-col justify-between min-h-[160px]">
                            <div>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1 block">Global Confidence</span>
                                <h2 className="text-4xl font-mono font-bold text-white">{globalStats.avg}%</h2>
                            </div>
                            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${globalStats.avg}%` }}
                                    className="h-full bg-accent-blue rounded-full shadow-glow-blue"
                                />
                            </div>
                        </div>
                        <div className="glass-card p-6 border border-white/5 bg-green-500/5 rounded-3xl flex flex-col justify-between min-h-[160px]">
                            <div>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-green-500/60 mb-1 block">Strongest Pattern</span>
                                <h2 className="text-xl font-bold text-white capitalize">{globalStats.strongest.replace('_', ' ')}</h2>
                            </div>
                            <div className="flex items-center gap-2 text-green-500">
                                <ShieldAlert size={14} />
                                <span className="text-[10px] font-bold uppercase tracking-widest">Mastery Level</span>
                            </div>
                        </div>
                        <div className="glass-card p-6 border border-white/5 bg-amber-500/5 rounded-3xl flex flex-col justify-between min-h-[160px]">
                            <div>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-amber-500/60 mb-1 block">Weakest Pattern</span>
                                <h2 className="text-xl font-bold text-white capitalize">{globalStats.weakest.replace('_', ' ')}</h2>
                            </div>
                            <div className="flex items-center gap-2 text-amber-500">
                                <AlertCircle size={14} />
                                <span className="text-[10px] font-bold uppercase tracking-widest">Priority Area</span>
                            </div>
                        </div>
                    </div>

                    {/* Middle: Pattern Grid (3 per row) */}
                    <section>
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <BarChart2 size={18} className="text-accent-blue" />
                                <h2 className="text-base font-bold uppercase tracking-widest text-white/80">Pattern Inventory</h2>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {patternData.map((pattern, idx) => {
                                const deps = useStore.getState().getPatternDependencies(pattern.type)
                                return (
                                    <motion.div
                                        key={pattern.type}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className={`glass-card p-6 border rounded-3xl group hover:border-white/20 transition-all relative overflow-hidden ${pattern.needsRefresh ? 'border-amber-500/30 bg-amber-500/[0.02]' : 'border-white/5 bg-white/[0.02]'}`}
                                    >
                                        {pattern.needsRefresh && (
                                            <div className="absolute top-0 right-0 p-3">
                                                <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-amber-500/20 text-amber-500 border border-amber-500/20">
                                                    <Clock size={10} />
                                                    <span className="text-[8px] font-bold uppercase tracking-tighter">Refresh Required</span>
                                                </div>
                                            </div>
                                        )}

                                        <div className="mb-6">
                                            <h3 className="text-lg font-bold text-white capitalize mb-1 group-hover:text-accent-blue transition-colors">
                                                {pattern.type.replace('_', ' ')}
                                            </h3>
                                            <div className="flex items-center gap-3 text-[10px] uppercase tracking-wider font-bold">
                                                <span className={pattern.levelColor}>{pattern.level}</span>
                                                <span className="text-white/20">•</span>
                                                <span className="text-white/40">{pattern.problemCount} Problems</span>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="flex justify-between items-end">
                                                <span className="text-[10px] font-mono font-bold text-white/20 uppercase tracking-widest">Confidence</span>
                                                <span className="text-lg font-mono font-bold text-white">{pattern.confidence}%</span>
                                            </div>
                                            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full transition-all duration-1000 ${pattern.confidence >= 80 ? 'bg-green-500' : pattern.confidence >= 40 ? 'bg-accent-blue' : 'bg-amber-500'}`}
                                                    style={{ width: `${pattern.confidence}%` }}
                                                />
                                            </div>
                                        </div>

                                        {pattern.subPatterns.length > 0 && (
                                            <div className="mt-6 pt-6 border-t border-white/5 space-y-4">
                                                <h4 className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">Sub-Pattern Mastery</h4>
                                                <div className="grid grid-cols-1 gap-3">
                                                    {pattern.subPatterns.map(sp => (
                                                        <div key={sp.id} className="space-y-1.5">
                                                            <div className="flex justify-between items-center text-[10px]">
                                                                <span className="text-white/60 capitalize truncate max-w-[120px]">{sp.id.replace(/_/g, ' ')}</span>
                                                                <span className="text-white/40 font-mono">{Math.round(sp.confidence)}%</span>
                                                            </div>
                                                            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                                                <div
                                                                    className={`h-full rounded-full transition-all duration-1000 ${sp.confidence >= 70 ? 'bg-accent-blue' : 'bg-white/20'}`}
                                                                    style={{ width: `${sp.confidence}%` }}
                                                                />
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {deps && !deps.isMet && (
                                            <div className="mt-6 p-3 rounded-xl bg-red-500/5 border border-red-500/10 flex items-center gap-2">
                                                <AlertCircle size={14} className="text-red-500" />
                                                <span className="text-[10px] font-bold text-red-400 uppercase tracking-tight">{deps.message}</span>
                                            </div>
                                        )}

                                        <button
                                            onClick={() => navigate(`/mastery/${pattern.type}`)}
                                            className="w-full mt-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-[10px] font-bold uppercase tracking-widest text-white/60 hover:text-white transition-all flex items-center justify-center gap-2"
                                        >
                                            Mastery Drill
                                            <ArrowRight size={12} />
                                        </button>
                                    </motion.div>
                                )
                            })}
                        </div>
                    </section>

                    {/* Bottom: Recommendation & Matrix */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2">
                            <CognitiveTransferMatrix />
                        </div>
                        <div className="space-y-6">
                            {recommendation && (
                                <section>
                                    <div className="flex items-center gap-3 mb-6">
                                        <Zap size={18} className="text-accent-blue" />
                                        <h2 className="text-sm font-bold uppercase tracking-widest text-white/60">Action Plan</h2>
                                    </div>
                                    <div className="glass-card p-6 border border-accent-blue/30 bg-accent-blue/5 rounded-3xl relative overflow-hidden group hover:border-accent-blue/50 transition-all flex flex-col justify-between min-h-[200px]">
                                        <div>
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-accent-blue mb-2 block">AI Recommendation</span>
                                            <h3 className="text-xl font-bold text-white leading-tight mb-4">{recommendation.message}</h3>
                                        </div>
                                        <button
                                            onClick={() => navigate(recommendation.link)}
                                            className="w-full py-4 bg-accent-blue hover:bg-accent-blue/90 text-black font-bold rounded-xl transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-xs"
                                        >
                                            {recommendation.label}
                                            <ArrowRight size={14} />
                                        </button>
                                    </div>
                                </section>
                            )}

                            {/* Cognitive Insights Summary (Mini) */}
                            <section>
                                <div className="flex items-center gap-3 mb-6">
                                    <Brain size={18} className="text-accent-purple" />
                                    <h2 className="text-sm font-bold uppercase tracking-widest text-white/60">Neural Insights</h2>
                                </div>
                                <div className="glass-card border border-white/5 bg-accent-purple/5 rounded-3xl p-6">
                                    <div className="space-y-4">
                                        {insights.length > 0 ? insights.map((insight, i) => (
                                            <div key={i} className="flex gap-4 items-start">
                                                <div className="w-1.5 h-1.5 rounded-full bg-accent-purple mt-2 shrink-0" />
                                                <p className="text-xs text-white/60 leading-relaxed italic">"{insight}"</p>
                                            </div>
                                        )) : (
                                            <p className="text-xs text-white/20 italic text-center">Solve more problems to generate deep-slice insights.</p>
                                        )}
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PatternProfile
