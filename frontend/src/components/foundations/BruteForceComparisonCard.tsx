import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Zap } from 'lucide-react'

interface Props {
    subPatternId: string
}

export const BruteForceComparisonCard: React.FC<Props> = ({ subPatternId }) => {
    const [isPlaying, setIsPlaying] = useState(false)
    const [step, setStep] = useState(0)

    const isTwoPointer = ['opposite_direction', 'same_direction', 'fast_slow', 'partition', 'two_sum_sorted'].includes(subPatternId)

    // Example: Fixed window with K=3, array length=5
    const totalSteps = isTwoPointer ? 25 : 15 // N*N vs N
    const optimalSteps = 5 // N

    useEffect(() => {
        if (!isPlaying) return

        const interval = setInterval(() => {
            setStep(prev => {
                if (prev >= totalSteps) {
                    setIsPlaying(false)
                    return 0
                }
                return prev + 1
            })
        }, 300)

        return () => clearInterval(interval)
    }, [isPlaying, totalSteps])

    const bruteForceProgress = Math.min((step / totalSteps) * 100, 100)
    const optimalProgress = Math.min((step / optimalSteps) * 100, 100)

    const getBruteLabel = () => {
        if (subPatternId === 'opposite_direction' || subPatternId === 'two_sum_sorted') return "Check all pairs (i, j)"
        if (subPatternId === 'fast_slow') return "Store all visited nodes"
        if (subPatternId === 'fixed_window') return "Recalculate each window"
        return "Naive Nested Loops"
    }

    const getOptimalLabel = () => {
        if (subPatternId === 'opposite_direction' || subPatternId === 'two_sum_sorted') return "Two Pointers (Sorted)"
        if (subPatternId === 'fast_slow') return "Floyd's Cycle Detection"
        if (subPatternId === 'fixed_window') return "Sliding Window"
        return "Optimized Linear Pass"
    }

    const getBruteComp = () => isTwoPointer ? "O(N²)" : "O(N×K)"

    return (
        <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/5">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <Zap size={20} className="text-yellow-400" />
                    <h3 className="text-xl font-bold text-white tracking-tight">Efficiency Race</h3>
                </div>
                <button
                    onClick={() => {
                        setIsPlaying(!isPlaying)
                        if (step >= totalSteps) setStep(0)
                    }}
                    className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-white uppercase tracking-widest transition-colors"
                >
                    {isPlaying ? 'Pause' : step >= totalSteps ? 'Replay' : 'Run Simulation'}
                </button>
            </div>

            {/* Comparison */}
            <div className="space-y-8">
                {/* Brute Force */}
                <div>
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-white/50">{getBruteLabel()}</span>
                        <div className="px-2 py-0.5 rounded bg-red-500/10 border border-red-500/20">
                            <span className="text-[10px] font-mono font-bold text-red-400">{getBruteComp()}</span>
                        </div>
                    </div>
                    <div className="h-4 rounded-full bg-black/40 border border-white/5 overflow-hidden">
                        <motion.div
                            className="h-full bg-gradient-to-r from-red-500 to-orange-500 shadow-[0_0_10px_rgba(239,68,68,0.3)]"
                            initial={{ width: 0 }}
                            animate={{ width: `${bruteForceProgress}%` }}
                            transition={{ duration: 0.3 }}
                        />
                    </div>
                    <div className="mt-2 text-[10px] text-white/20 uppercase tracking-widest font-bold">
                        Operations: {step} / {totalSteps}
                    </div>
                </div>

                {/* Optimal */}
                <div>
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-white/50">{getOptimalLabel()}</span>
                        <div className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                            <span className="text-[10px] font-mono font-bold text-emerald-400">O(N)</span>
                        </div>
                    </div>
                    <div className="h-4 rounded-full bg-black/40 border border-white/5 overflow-hidden">
                        <motion.div
                            className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]"
                            initial={{ width: 0 }}
                            animate={{ width: `${optimalProgress}%` }}
                            transition={{ duration: 0.3 }}
                        />
                    </div>
                    <div className="mt-2 text-[10px] text-white/20 uppercase tracking-widest font-bold">
                        Operations: {Math.min(step, optimalSteps)} / {optimalSteps}
                    </div>
                </div>
            </div>

            {/* Efficiency Gain */}
            <div className="mt-8 p-6 rounded-2xl bg-emerald-500/[0.03] border border-emerald-500/10 relative overflow-hidden">
                <div className="absolute right-0 top-0 p-4 opacity-5">
                    <Zap size={64} className="text-emerald-400" />
                </div>
                <div className="text-[10px] uppercase tracking-widest text-emerald-400 font-bold mb-1">
                    Potential Savings
                </div>
                <div className="text-3xl font-bold text-emerald-400">
                    {Math.round(((totalSteps - optimalSteps) / totalSteps) * 100)}% Fewer Ops
                </div>
                <p className="text-xs text-white/40 mt-2 leading-relaxed">
                    {isTwoPointer
                        ? 'By using coordinated movement, we bypass unnecessary pairs and reach the target in a single linear pass.'
                        : 'Reusing the overlapping window state eliminates the need to recalcute from scratch at every index.'
                    }
                </p>
            </div>
        </div>
    )
}
