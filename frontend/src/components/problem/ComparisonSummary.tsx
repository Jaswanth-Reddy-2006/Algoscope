import React from 'react'
import { motion } from 'framer-motion'
import { Trophy, Zap, Clock, Maximize2, RotateCcw, X, ArrowRight } from 'lucide-react'
import { Problem } from '../../types'

interface ComparisonSummaryProps {
    problem: Problem
    onReset: () => void
    onClose: () => void
}

const ComparisonSummary: React.FC<ComparisonSummaryProps> = ({ problem, onReset, onClose }) => {
    const bruteSteps = problem.brute_force_steps?.length || 0
    const optimalSteps = problem.optimal_steps?.length || 0
    const stepsSaved = bruteSteps - optimalSteps
    const efficiencyGain = Math.round((stepsSaved / Math.max(1, bruteSteps)) * 100)

    return (
        <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            className="w-full max-w-3xl glass-card border border-purple-500/30 p-10 relative overflow-hidden shadow-2xl bg-[#240b33]/90 backdrop-blur-2xl rounded-[32px] mx-auto"
        >
            {/* Close Button */}
            <button
                onClick={onClose}
                className="absolute top-8 right-8 p-2 text-white/20 hover:text-white hover:bg-white/5 rounded-xl transition-all z-20"
            >
                <X size={24} />
            </button>

            {/* Background Decorative Elements */}
            <div className="absolute -top-24 -left-24 w-64 h-64 bg-purple-500/10 rounded-full blur-[100px]" />
            <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-accent-blue/10 rounded-full blur-[100px]" />

            <div className="text-center mb-12 relative z-10">
                <motion.div
                    initial={{ scale: 0, rotate: -10 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    className="w-20 h-20 bg-gradient-to-br from-purple-500/20 to-accent-blue/20 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-white/10 shadow-glow-sm"
                >
                    <Trophy className="text-purple-400 w-10 h-10" />
                </motion.div>

                <h2 className="text-3xl font-black tracking-tighter mb-3 text-white uppercase italic">
                    Optimization Mastery
                </h2>
                <p className="text-white/40 text-[11px] font-bold uppercase tracking-[0.3em]">
                    Algorithmic Efficiency Comparison
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 relative z-10">
                {/* Stats Section */}
                <div className="space-y-6">
                    <div className="p-6 bg-white/[0.03] border border-white/5 rounded-3xl relative group overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/20">
                                <Zap className="text-purple-400 w-5 h-5" />
                            </div>
                            <div>
                                <div className="text-[10px] font-black text-purple-400 uppercase tracking-widest">Efficiency Boost</div>
                                <div className="text-2xl font-black text-white">{efficiencyGain}% Faster</div>
                            </div>
                        </div>
                        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${efficiencyGain}%` }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                                className="h-full bg-gradient-to-r from-purple-500 to-accent-blue shadow-glow"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl">
                            <div className="text-[9px] font-bold text-white/20 uppercase tracking-widest mb-1">Brute Ops</div>
                            <div className="text-xl font-black text-red-400/80 font-mono">{bruteSteps}</div>
                        </div>
                        <div className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl">
                            <div className="text-[9px] font-bold text-white/20 uppercase tracking-widest mb-1">Optimal Ops</div>
                            <div className="text-xl font-black text-accent-blue font-mono">{optimalSteps}</div>
                        </div>
                    </div>
                </div>

                {/* Insight Section */}
                <div className="flex flex-col justify-center gap-6 p-8 bg-purple-500/5 border border-purple-500/10 rounded-3xl">
                    <div className="flex items-center gap-3">
                        <Clock className="text-purple-400 w-5 h-5" />
                        <span className="text-[11px] font-black text-white/60 uppercase tracking-widest">Performance Insight</span>
                    </div>
                    <p className="text-sm text-white/70 leading-relaxed font-medium">
                        The optimal strategy saved <span className="text-purple-400 font-bold">{stepsSaved} operations</span>.
                        By leveraging {problem.algorithmType === 'two_pointers' ? 'Two Pointers' : 'Sliding Window'} techniques,
                        we achieved <span className="text-accent-blue font-bold">{problem.efficiency?.optimal?.time || "O(N)"}</span> time versus the naive <span className="text-red-400 font-bold">{problem.efficiency?.brute?.time || "O(N²)"}</span>.
                    </p>
                    <div className="flex items-center gap-2 pt-2 text-[10px] font-black text-purple-400/60 uppercase tracking-widest">
                        <Maximize2 size={12} />
                        <span>Scale impact: Significant (10x - 1000x gain)</span>
                    </div>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 relative z-10">
                <button
                    onClick={onReset}
                    className="flex-1 flex items-center justify-center gap-3 py-5 bg-white/5 text-white/60 font-black text-[11px] uppercase tracking-[0.2em] rounded-2xl border border-white/10 hover:bg-white/10 hover:text-white transition-all shadow-glow-sm"
                >
                    <RotateCcw size={16} />
                    <span>Run Again</span>
                </button>
                <button
                    onClick={onClose}
                    className="flex-1 flex items-center justify-center gap-3 py-5 bg-purple-500 text-white font-black text-[11px] uppercase tracking-[0.2em] rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-glow group"
                >
                    <span>Analyze Patterns</span>
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
        </motion.div>
    )
}

export default ComparisonSummary
