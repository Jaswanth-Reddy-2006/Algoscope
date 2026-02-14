import React from 'react'
import { Zap, TrendingDown, TrendingUp } from 'lucide-react'

export const PatternBreakdownPanel: React.FC = () => {
    return (
        <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
            <div className="flex items-center gap-3 mb-4">
                <Zap className="text-indigo-400" size={20} />
                <h3 className="text-lg font-bold text-white">Why This Pattern Exists</h3>
            </div>

            {/* Complexity Comparison */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                    <div className="flex items-center gap-2 mb-2">
                        <TrendingDown size={16} className="text-red-400" />
                        <span className="text-xs uppercase tracking-widest text-red-400">Brute Force</span>
                    </div>
                    <div className="text-2xl font-bold font-mono text-red-400">O(N×K)</div>
                </div>

                <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20">
                    <div className="flex items-center gap-2 mb-2">
                        <TrendingUp size={16} className="text-green-400" />
                        <span className="text-xs uppercase tracking-widest text-green-400">Sliding Window</span>
                    </div>
                    <div className="text-2xl font-bold font-mono text-green-400">O(N)</div>
                </div>
            </div>

            {/* Side-by-Side Comparison */}
            <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10">
                    <h4 className="text-sm font-bold text-white mb-2">Brute Force</h4>
                    <p className="text-xs text-white/60 leading-relaxed">
                        Recalculate every subarray from scratch
                    </p>
                </div>

                <div className="p-4 rounded-xl bg-accent-blue/10 border border-accent-blue/20">
                    <h4 className="text-sm font-bold text-accent-blue mb-2">Sliding Window</h4>
                    <p className="text-xs text-white/80 leading-relaxed">
                        Reuse intersection, update only edges
                    </p>
                </div>
            </div>
        </div>
    )
}
