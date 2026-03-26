import { useMemo, useEffect, useState } from 'react'
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
    History,
    LogOut
} from 'lucide-react'
import { PATTERN_HIERARCHY } from '../data/patternHierarchy'
import { useStore } from '../store/useStore'
import CognitiveTransferMatrix from '../components/profile/CognitiveTransferMatrix'
import { analyticsService } from '../services/api'

const PatternProfile = () => {
    const navigate = useNavigate()
    const problems = useStore(state => state.problems)
    const patternStats = useStore(state => state.patternStats)
    
    // Backend Stats State
    const [summary, setSummary] = useState<any>(null)
    const [proficiency, setProficiency] = useState<any>(null)

    const handleLogout = () => {
        localStorage.removeItem('algoscope_token');
        localStorage.removeItem('algoscope_user');
        window.location.href = '/login';
    };

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const [sum, profData] = await Promise.all([
                    analyticsService.getSummary(),
                    analyticsService.getProficiency(),
                ]);
                
                setSummary(sum)
                setProficiency(profData)
            } catch (err) {
                console.error("Failed to fetch analytics", err)
            }
        }
        fetchAnalytics()
    }, [])

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
            <div className="h-20 px-8 pt-8 flex items-center justify-between border-b border-white/5 bg-black/20 backdrop-blur-xl z-20 shrink-0">
                <div className="relative w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                    <input
                        type="text"
                        placeholder="Search patterns or algorithms..."
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-[#EC4186]/30 transition-all"
                    />
                </div>
                <div className="flex items-center gap-6">
                    <button 
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/5 border border-red-500/10 text-red-400/70 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/20 transition-all duration-300 text-[10px] font-black uppercase tracking-widest"
                    >
                        <LogOut size={14} />
                        Log Out
                    </button>
                    <button className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/40 hover:text-white transition-all">
                        <Bell size={18} />
                    </button>
                    <div className="flex items-center gap-3 pl-6 border-l border-white/10">
                        <div className="text-right">
                            <p className="text-xs font-bold text-white uppercase tracking-wider">Jaswanth Reddy</p>
                            <p className="text-[10px] text-white/10 font-black uppercase tracking-[0.2em]">ALGO_MODE: ACTIVE</p>
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
                            <h1 className="text-4xl font-black text-white tracking-tight mb-2">Pattern Library</h1>
                            <p className="text-white/40 text-sm font-medium">Track your progress and analyze your problem-solving patterns.</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-white/60 hover:text-white transition-all uppercase tracking-widest">
                                <History size={14} />
                                View History
                            </button>
                        </div>
                    </div>
 
                    {/* Top Stats Section */}
                    {problems.length === 0 ? (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="p-12 rounded-[40px] bg-white/[0.02] border border-white/5 flex flex-col items-center justify-center text-center py-20 relative overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#EC4186] to-[#EE544A]" />
                            <div className="absolute -right-24 -top-24 w-64 h-64 bg-[#EC4186]/5 rounded-full blur-[100px]" />
                            <div className="absolute -left-24 -bottom-24 w-64 h-64 bg-[#EE544A]/5 rounded-full blur-[100px]" />
 
                            <div className="w-20 h-20 rounded-3xl bg-[#EC4186]/10 flex items-center justify-center mb-8 border border-[#EC4186]/20 relative z-10 shadow-glow">
                                <ShieldAlert size={40} className="text-[#EC4186]" />
                            </div>
 
                            <h2 className="text-3xl font-black text-white tracking-tighter mb-4 uppercase relative z-10">Archive Connection Inactive</h2>
                            <p className="text-white/40 text-base max-w-sm mx-auto mb-10 leading-relaxed relative z-10">
                                Connect your LeetCode account to synchronize your historical performance and unlock pattern mastery.
                            </p>
 
                            <button 
                                onClick={() => navigate('/settings?tab=leetcode&hub=true')}
                                className="px-10 py-5 bg-[#EC4186] text-white rounded-2xl font-black flex items-center justify-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-glow relative z-10 uppercase tracking-widest text-xs"
                            >
                                <Zap size={18} className="fill-current" />
                                <span>Initialize Archive</span>
                            </button>
                        </motion.div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="glass-card p-6 rounded-[32px] bg-white/[0.02] border border-white/5 flex flex-col justify-between relative overflow-hidden h-[180px]"
                            >
                                <div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-[#EC4186] mb-3 block">Total Mastery</span>
                                    <div className="flex items-baseline gap-2">
                                        <h2 className="text-4xl font-black text-white">
                                            {proficiency?.score || 0}
                                        </h2>
                                        <span className="text-[10px] font-bold text-white/20 uppercase">Units</span>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex justify-between text-[10px] font-black text-white/20 uppercase tracking-widest">
                                        <span>Level {proficiency?.level || 1} • {proficiency?.title || 'Explorer'}</span>
                                        <span>{Math.round(proficiency?.progress || 0)}% Sync</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${proficiency?.progress || 0}%` }}
                                            transition={{ duration: 1, ease: 'easeOut' }}
                                            className="h-full bg-gradient-to-r from-[#EC4186] to-[#EE544A]"
                                        />
                                    </div>
                                </div>
                            </motion.div>
 
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="glass-card p-6 rounded-[32px] bg-white/[0.02] border border-white/5 flex flex-col justify-between h-[180px]"
                            >
                                <span className="text-[10px] font-black uppercase tracking-widest text-[#FFFFFF] mb-3 block">Solve Matrix</span>
                                <div className="flex gap-3 items-end flex-1 mb-2">
                                    {[
                                        { label: 'Easy', count: summary?.Easy || 0, color: 'emerald-500' },
                                        { label: 'Medium', count: summary?.Medium || 0, color: '[#EC4186]' },
                                        { label: 'Hard', count: summary?.Hard || 0, color: '[#EE544A]' }
                                    ].map(item => (
                                        <div key={item.label} className="flex-1 space-y-2">
                                            <div className="h-[60px] w-full bg-white/5 rounded-xl relative overflow-hidden">
                                                <motion.div 
                                                    initial={{ height: 0 }}
                                                    animate={{ height: `${Math.min((item.count * 10), 100)}%` }}
                                                    transition={{ duration: 1.5, ease: 'backOut' }}
                                                    className={`absolute bottom-0 w-full bg-${item.color}/40`} 
                                                />
                                                <div className="absolute inset-0 flex items-center justify-center text-xs font-black text-white/40">
                                                    {item.count}
                                                </div>
                                            </div>
                                            <div className="text-[8px] text-white/20 uppercase font-black text-center">{item.label}</div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
 
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="glass-card p-6 rounded-[32px] bg-white/[0.02] border border-white/5 flex flex-col justify-between h-[180px]"
                            >
                                <div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-[#EE544A] mb-3 block">Neural Bridge</span>
                                    <h2 className="text-4xl font-black text-white">{problems.length} <span className="text-sm font-bold text-white/20 uppercase">Problems</span></h2>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="px-2 py-1 rounded bg-blue-500/10 text-blue-400 text-[9px] font-black uppercase tracking-widest border border-blue-500/20">Sync Optimal</span>
                                    <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest">v2.0 Connected</span>
                                </div>
                            </motion.div>
                        </div>
                    )}

                    {/* Middle: Pattern Inventory (Comprehensive Matrix) */}
                    <section>
                        <div className="flex items-center justify-between mb-10">
                            <div className="flex items-center gap-4">
                                <h2 className="text-2xl font-black text-white tracking-tight">Main Patterns</h2>
                                <span className="px-2.5 py-0.5 rounded-lg bg-[#EC4186]/10 text-[#EC4186] text-[11px] font-bold uppercase tracking-widest border border-[#EC4186]/20">
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
                                    className={`glass-card p-5 border rounded-[32px] group hover:border-[#EC4186]/30 transition-all relative overflow-hidden bg-white/[0.02] ${pattern.needsRefresh ? 'border-[#EE544A]/30' : 'border-white/5'}`}
                                >
                                    {pattern.needsRefresh && (
                                        <div className="absolute top-5 right-5">
                                            <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#EE544A]/20 text-[#EE544A] border border-[#EE544A]/20">
                                                <Clock size={8} />
                                                <span className="text-[9px] font-black uppercase tracking-tighter">Review</span>
                                            </div>
                                        </div>
                                    )}

                                    <div className="mb-6">
                                        <div className="flex justify-between items-start mb-3">
                                            <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest ${pattern.levelBg} ${pattern.levelColor} border border-white/5`}>
                                                {pattern.level}
                                            </span>
                                            <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest">{pattern.groupTitle}</span>
                                        </div>
                                        <h3 className="text-lg font-black text-white capitalize mb-1 group-hover:text-[#EC4186] transition-colors">
                                            {pattern.title}
                                        </h3>
                                        <p className="text-[9px] text-white/40 uppercase tracking-widest font-black">{pattern.problemCount} Analyzed</p>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex justify-between items-end">
                                            <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest">Mastery</span>
                                            <span className="text-xs font-black text-white">{pattern.confidence}%</span>
                                        </div>
                                        <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${pattern.confidence}%` }}
                                                transition={{ duration: 1.5, ease: 'circOut' }}
                                                className={`h-full rounded-full ${pattern.confidence >= 80 ? 'bg-emerald-500' : pattern.confidence >= 40 ? 'bg-[#EC4186]' : 'bg-white/10'}`}
                                            />
                                        </div>
                                    </div>

                                    {/* Sub-Pattern Mastery */}
                                    {pattern.subPatterns.length > 0 && (
                                        <div className="mt-6 pt-5 border-t border-white/5 space-y-3">
                                            <div className="grid grid-cols-1 gap-2">
                                                {pattern.subPatterns.slice(0, 3).map((sp: any) => (
                                                    <div key={sp.id} className="space-y-1.5">
                                                        <div className="flex justify-between items-center text-[9px]">
                                                            <span className="text-white/40 capitalize font-bold tracking-tight">{sp.id.replace(/_/g, ' ')}</span>
                                                            <span className="text-white/20 font-black">{Math.round(sp.confidence)}%</span>
                                                        </div>
                                                        <div className="w-full h-0.5 bg-white/[0.02] rounded-full overflow-hidden">
                                                            <motion.div
                                                                initial={{ width: 0 }}
                                                                animate={{ width: `${sp.confidence}%` }}
                                                                transition={{ duration: 2, ease: 'circOut' }}
                                                                className={`h-full rounded-full ${sp.confidence > 0 ? 'bg-[#EC4186]/40' : 'bg-transparent'}`}
                                                            />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <button
                                        onClick={() => navigate(`/mastery/${pattern.type}`)}
                                        className="w-full mt-6 py-3 rounded-xl bg-white/5 hover:bg-[#EC4186]/20 border border-white/5 text-[9px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-all flex items-center justify-center gap-2 group/btn"
                                    >
                                        Neural Analysis
                                        <ArrowRight size={10} className="group-hover/btn:translate-x-1 transition-transform" />
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
                                <h2 className="text-xl font-bold text-white tracking-tight">Correlation Matrix</h2>
                            </div>
                            <CognitiveTransferMatrix />
                        </div>
                        <div className="space-y-6">
                            {recommendation && (
                                <section>
                                    <div className="flex items-center gap-3 mb-8">
                                        <Target size={18} className="text-[#EE544A]" />
                                        <h2 className="text-sm font-bold uppercase tracking-widest text-white/60">Next Goal</h2>
                                    </div>
                                    <div className="glass-card p-8 border border-[#EC4186]/30 bg-[#EC4186]/5 rounded-[40px] relative overflow-hidden group hover:border-[#EC4186]/50 transition-all flex flex-col justify-between min-h-[240px]">
                                        <div>
                                            <span className="text-[11px] font-bold uppercase tracking-widest text-[#EC4186] mb-3 block">Recommendation</span>
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
                                    <h2 className="text-sm font-bold uppercase tracking-widest text-white/60">AI Insights</h2>
                                </div>
                                <div className="glass-card border border-white/5 bg-purple-500/5 rounded-[40px] p-8 space-y-6">
                                    {insights.length > 0 ? insights.map((insight, i) => (
                                        <div key={i} className="flex gap-4 items-start">
                                            <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2 shrink-0 shadow-[0_0_8px_rgba(236, 65, 134,0.5)]" />
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
                Algoscope Intelligence Systems • Pattern Mastery Engine Active
            </div>
        </div>
    )
}

export default PatternProfile
