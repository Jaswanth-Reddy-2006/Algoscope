import React from 'react'
import { ComparisonStats } from './MentalModelEngine/comparisonStats'

interface Props {
    stats: ComparisonStats
}

export const ConceptCard: React.FC<Props> = ({ stats }) => {
    return (
        <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 h-full flex flex-col justify-center">
            <h3 className="text-lg font-bold text-white mb-4">Why Sliding Window Exists</h3>

            <div className="space-y-3">
                {/* Brute Force Row */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                    <div>
                        <div className="text-xs text-white/60 mb-1">Brute Force</div>
                        <div className="text-xl font-bold text-red-400 font-mono">
                            O(N×K)
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-xs text-white/60 mb-1">Idea</div>
                        <div className="text-xs text-white/80">Recompute entire window</div>
                    </div>
                </div>

                {/* Sliding Window Row */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-green-500/10 border border-green-500/20">
                    <div>
                        <div className="text-xs text-white/60 mb-1">Sliding Window</div>
                        <div className="text-xl font-bold text-green-400 font-mono">
                            O(N)
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-xs text-white/60 mb-1">Idea</div>
                        <div className="text-xs text-white/80">Reuse overlap</div>
                    </div>
                </div>

                {/* Efficiency Gain */}
                <div className="mt-4 p-3 rounded-xl bg-accent-blue/10 border border-accent-blue/20">
                    <div className="text-center">
                        <div className="text-xs text-white/60 mb-1">Efficiency Gain</div>
                        <div className="text-2xl font-bold text-accent-blue font-mono">
                            {stats.efficiencyGain}%
                        </div>
                        <div className="text-[10px] text-white/40 mt-1">
                            Saves {stats.savedOps} operations
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
