import React from 'react'
import { Target } from 'lucide-react'

interface Props {
    formula: string
    explanation: string
}

export const CoreInvariantCard: React.FC<Props> = ({ formula, explanation }) => {
    return (
        <div className="p-8 rounded-2xl bg-gradient-to-br from-accent-blue/5 to-cyan-500/5 border border-accent-blue/20">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <Target size={20} className="text-accent-blue" />
                <h3 className="text-xl font-bold text-white tracking-tight">The Invariant</h3>
            </div>

            {/* Formula */}
            <div className="
                font-mono text-2xl text-emerald-400 text-center
                p-8 mb-6 rounded-2xl
                bg-black/40 border border-white/5
                shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)]
            ">
                {formula}
            </div>

            {/* Explanation */}
            <div className="space-y-4">
                <p className="text-white/60 leading-relaxed">
                    {explanation}
                </p>
                <div className="pt-4 border-t border-white/5">
                    <span className="text-[10px] font-bold text-accent-blue uppercase tracking-widest opacity-60">Strategic Outcome</span>
                    <p className="text-xs text-white/40 mt-1">This invariant guarantees that our search space always contains the potential solution without redundant checks.</p>
                </div>
            </div>
        </div>
    )
}
