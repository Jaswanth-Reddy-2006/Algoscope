import React from 'react'
import { useStore } from '../../store/useStore'
import { ListFilter, ExternalLink } from 'lucide-react'
import { Link } from 'react-router-dom'

const ProblemInfo: React.FC = () => {
    const currentProblem = useStore(state => state.currentProblem)
    const isBruteForce = useStore(state => state.isBruteForce)
    const compareMode = useStore(state => state.compareMode)
    const toggleApproach = useStore(state => state.toggleApproach)
    const setCompareMode = useStore(state => state.setCompareMode)

    if (!currentProblem) return null

    return (
        <div className="flex flex-col gap-8">
            {/* Header Section */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <span className={`badge-premium font-bold tracking-[0.2em] py-1 px-3 text-[9px]
                        ${currentProblem.difficulty === 'Easy' ? 'text-green-400 border-green-500/10 bg-green-500/5' :
                            currentProblem.difficulty === 'Medium' ? 'text-orange-400 border-orange-500/10 bg-orange-500/5' :
                                'text-red-400 border-red-500/10 bg-red-500/5'}
                    `}>
                        {currentProblem.difficulty}
                    </span>
                    <div className="flex gap-2">
                        {currentProblem.tags.map(tag => (
                            <span key={tag} className="text-[8px] bg-white/5 text-white/30 px-2 py-0.5 rounded-full border border-white/5 uppercase tracking-widest font-bold">
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>

                <h2 className="text-xl font-bold mb-4 tracking-tight text-white group-hover:text-accent-blue transition-colors uppercase">
                    {currentProblem.title}
                </h2>

                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-0.5 h-full bg-accent-blue/30 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <p className="text-xs text-white/50 leading-relaxed font-light mb-4">
                        {currentProblem.problem_statement}
                    </p>
                    <Link
                        to={`/foundations`}
                        className="inline-flex items-center gap-2 text-[9px] font-bold uppercase tracking-wider text-accent-blue hover:text-white transition-colors group/link"
                    >
                        Review Pattern Foundation
                        <ExternalLink size={10} className="group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                    </Link>
                </div>
            </div>

            {/* Strategy Control Integration */}
            <div className="glass-card border border-white/5 p-5 rounded-2xl bg-white/[0.01]">
                <h3 className="text-[10px] uppercase tracking-widest text-white/40 mb-4 font-bold font-mono">Simulacrum Strategy</h3>
                <div className="grid grid-cols-3 gap-2">
                    <button
                        onClick={() => {
                            setCompareMode(false)
                            if (!isBruteForce) toggleApproach()
                        }}
                        className={`py-2.5 rounded-xl text-[9px] font-bold uppercase tracking-wider transition-all border ${isBruteForce && !compareMode
                                ? 'bg-red-500/20 text-red-400 border-red-500/30'
                                : 'bg-white/5 text-white/40 border-white/10 hover:text-white'
                            }`}
                    >
                        Brute
                    </button>
                    <button
                        onClick={() => {
                            setCompareMode(false)
                            if (isBruteForce) toggleApproach()
                        }}
                        className={`py-2.5 rounded-xl text-[9px] font-bold uppercase tracking-wider transition-all border ${!isBruteForce && !compareMode
                                ? 'bg-accent-blue/20 text-accent-blue border-accent-blue/30'
                                : 'bg-white/5 text-white/40 border-white/10 hover:text-white'
                            }`}
                    >
                        Optimal
                    </button>
                    <button
                        onClick={() => setCompareMode(true)}
                        className={`py-2.5 rounded-xl text-[9px] font-bold uppercase tracking-wider transition-all border ${compareMode
                                ? 'bg-purple-500/20 text-purple-400 border-purple-500/30'
                                : 'bg-white/5 text-white/40 border-white/10 hover:text-white'
                            }`}
                    >
                        Compare
                    </button>
                </div>
            </div>

            {/* Constraints */}
            <div className="space-y-3 pb-8">
                <div className="flex items-center gap-2 text-white/20">
                    <ListFilter size={12} />
                    <h3 className="text-[9px] font-bold uppercase tracking-[0.2em]">Logical Constraints</h3>
                </div>
                <div className="flex flex-col gap-2">
                    {currentProblem.constraints.map((c, i) => (
                        <div key={i} className="flex items-start gap-2">
                            <div className="w-1 h-1 rounded-full bg-white/10 mt-1.5 shrink-0" />
                            <span className="text-[10px] text-white/30 font-light leading-relaxed">{c}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default ProblemInfo
