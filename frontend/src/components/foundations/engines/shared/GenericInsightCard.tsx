import React from 'react'
import { Sparkles, Zap } from 'lucide-react'

interface InsightProps {
    title: string
    bruteForceComplexity: string
    optimalComplexity: string
    keyPrinciples: string[]
    invariant: string
    invariantLabel?: string
    efficiencyNote?: string
}

export const GenericInsightCard: React.FC<InsightProps> = ({
    title,
    bruteForceComplexity,
    optimalComplexity,
    keyPrinciples,
    invariant,
    invariantLabel = "Core Invariant",
    efficiencyNote
}) => {
    return (
        <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 h-full flex flex-col">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Sparkles size={18} className="text-purple-400" />
                {title}
            </h3>

            <div className="space-y-4 flex-1">
                {/* Complexity Comparison */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-center">
                        <div className="text-[10px] uppercase text-white/40 mb-1">Brute Force</div>
                        <div className="text-lg font-bold text-red-400 font-mono">{bruteForceComplexity}</div>
                    </div>
                    <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-center">
                        <div className="text-[10px] uppercase text-white/40 mb-1">Optimal</div>
                        <div className="text-lg font-bold text-green-400 font-mono">{optimalComplexity}</div>
                    </div>
                </div>

                {/* Key Principles */}
                <ul className="space-y-2">
                    {keyPrinciples.map((principle, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-white/70">
                            <span className="text-accent-blue font-bold">•</span>
                            <span>{principle}</span>
                        </li>
                    ))}
                </ul>

                {/* Invariant Formula */}
                <div className="mt-auto p-4 rounded-xl bg-black/40 border border-accent-blue/20">
                    <div className="flex items-center gap-2 mb-2">
                        <Zap size={12} className="text-accent-blue" />
                        <span className="text-[9px] uppercase tracking-widest text-accent-blue/80">{invariantLabel}</span>
                    </div>
                    <code className="text-sm font-mono font-bold text-white block break-words">
                        {invariant}
                    </code>
                </div>

                {efficiencyNote && (
                    <p className="text-[10px] text-white/40 text-center italic mt-2">
                        {efficiencyNote}
                    </p>
                )}
            </div>
        </div>
    )
}
