import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Play, TrendingUp, Award, Zap } from 'lucide-react'
import { cn } from '../../utils/cn'

interface ProblemCardProps {
    problem: any
    stats: any
}

const ProblemCard: React.FC<ProblemCardProps> = ({ problem, stats }) => {
    const formattedId = String(problem.id).padStart(3, '0')
    const confidence = stats?.confidence || 0
    const isNew = !stats || stats.attempts === 0
    const isStrong = confidence >= 80

    const statusLabel = isNew ? 'New' : isStrong ? 'Strong' : 'Practiced'
    const statusColor = isNew ? 'text-accent-blue/60 border-accent-blue/20 bg-accent-blue/5' :
        isStrong ? 'text-green-400 border-green-500/20 bg-green-500/5' :
            'text-amber-400 border-amber-500/20 bg-amber-500/5'

    return (
        <motion.div
            layout
            className="group h-full"
        >
            <Link
                to={`/problems/${problem.slug}`}
                className={cn(
                    "flex flex-col glass-card border-white/5 hover:border-accent-blue/20 transition-all duration-500",
                    "hover:shadow-lg bg-white/[0.02] h-full p-8" // 24px+ internal padding
                )}
            >
                {/* Header: ID and Difficulty */}
                <div className="flex justify-between items-center mb-8">
                    <span className="text-3xl font-mono font-black text-white/10 group-hover:text-accent-blue/40 transition-colors">
                        #{formattedId}
                    </span>
                    <span className={cn(
                        "px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest border",
                        problem.difficulty === 'Easy' ? "bg-green-500/10 text-green-400 border-green-500/20" :
                            problem.difficulty === 'Medium' ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
                                "bg-red-500/10 text-red-400 border-red-500/20"
                    )}>
                        {problem.difficulty}
                    </span>
                </div>

                {/* Body: Title and Primary Pattern */}
                <div className="flex-1">
                    <h3 className="text-2xl font-bold text-white/90 mb-3 group-hover:text-white transition-colors leading-tight">
                        {problem.title}
                    </h3>

                    <div className="flex items-center gap-2 mb-8">
                        <span className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] font-bold text-white/40 uppercase tracking-widest">
                            {problem.primaryPattern || problem.algorithmType.replace('_', ' ')}
                        </span>
                        {confidence > 0 && (
                            <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-accent-blue/5 border border-white/5">
                                <TrendingUp size={12} className="text-accent-blue" />
                                <span className="text-[10px] font-mono font-bold text-white/60">{Math.round(confidence)}%</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer: Action and Status */}
                <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-accent-blue/5 border border-accent-blue/10 flex items-center justify-center group-hover:bg-accent-blue/10 transition-colors">
                            <Play size={16} className="text-accent-blue translate-x-0.5" />
                        </div>
                        <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/20 group-hover:text-white/40 transition-colors">
                            Initialize Lab
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className={cn("px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest border", statusColor)}>
                            {statusLabel}
                        </span>
                        {isStrong && <Award size={18} className="text-green-400/40" />}
                        {isNew && <Zap size={18} className="text-accent-blue/40" />}
                    </div>
                </div>
            </Link>
        </motion.div>
    )
}

export default ProblemCard
