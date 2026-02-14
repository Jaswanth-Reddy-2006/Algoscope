import React from 'react'
import { Zap, TrendingUp } from 'lucide-react'
import { motion } from 'framer-motion'

interface Props {
    bruteForce: string
    optimal: string
    gain: string
}

export const MentalModelStatsCard: React.FC<Props> = ({ bruteForce, optimal, gain }) => {
    return (
        <div className="h-full p-8 rounded-3xl bg-white/[0.02] border border-white/10 flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute -right-8 -top-8 text-accent-blue/10 group-hover:text-accent-blue/20 transition-colors">
                <Zap size={160} />
            </div>

            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-emerald-500/10 rounded-lg">
                        <TrendingUp className="text-emerald-400" size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-white tracking-tight">The Efficiency Leap</h3>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="p-4 rounded-2xl bg-black/40 border border-white/5">
                        <div className="text-[10px] font-bold text-white/40 uppercase mb-1 tracking-widest">Brute Force</div>
                        <div className="text-xl font-mono font-bold text-red-400">{bruteForce}</div>
                    </div>
                    <div className="p-4 rounded-2xl bg-accent-blue/10 border border-accent-blue/20">
                        <div className="text-[10px] font-bold text-accent-blue uppercase mb-1 tracking-widest">Optimized</div>
                        <div className="text-xl font-mono font-bold text-emerald-400">{optimal}</div>
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between items-end">
                        <span className="text-xs font-bold text-white/40 uppercase tracking-widest">Performance Gain</span>
                        <span className="text-2xl font-bold text-emerald-400">{gain}</span>
                    </div>
                    <div className="h-3 bg-white/5 rounded-full overflow-hidden border border-white/10">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: gain }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="h-full bg-gradient-to-r from-accent-blue to-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                        />
                    </div>
                </div>
            </div>

            <p className="mt-6 text-sm text-white/40 leading-relaxed relative z-10">
                By eliminating redundant operations, we reduce the computational overhead significantly, turning quadratic or nested scans into linear traversals.
            </p>
        </div>
    )
}
