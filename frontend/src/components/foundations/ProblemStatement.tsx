import React from 'react'
import { FileQuestion } from 'lucide-react'

interface Props {
    definition: string
    returnValue: string
    constraints: string[]
}

export const ProblemStatement: React.FC<Props> = ({ definition, returnValue, constraints }) => {
    return (
        <div className="h-full p-8 rounded-3xl bg-white/[0.02] border border-white/10 flex flex-col justify-between">
            <div>
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-accent-blue/10 rounded-lg">
                        <FileQuestion className="text-accent-blue" size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-white tracking-tight">The Challenge</h3>
                </div>
                <p className="text-lg text-white/80 leading-relaxed mb-8">
                    {definition}
                </p>
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-accent-blue uppercase tracking-widest opacity-60">Returns:</span>
                        <span className="text-sm font-medium text-emerald-400 font-mono">{returnValue}</span>
                    </div>
                    <div>
                        <span className="text-xs font-bold text-accent-blue uppercase tracking-widest opacity-60 block mb-2">Constraints:</span>
                        <div className="flex flex-wrap gap-2">
                            {constraints.map((c, i) => (
                                <span key={i} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] text-white/50">
                                    {c}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
