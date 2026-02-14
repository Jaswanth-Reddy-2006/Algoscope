import React from 'react'
import { AlertTriangle, XCircle, Info } from 'lucide-react'

interface Props {
    mistakes: string[]
    whenNotToUse: string[]
}

export const InvariantFailureCard: React.FC<Props> = ({ mistakes, whenNotToUse }) => {
    return (
        <div className="p-8 rounded-2xl bg-gradient-to-br from-red-500/[0.05] to-orange-500/[0.05] border border-red-500/20">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <AlertTriangle size={20} className="text-red-400" />
                <h3 className="text-xl font-bold text-white tracking-tight">Failure Scenarios</h3>
            </div>

            <div className="space-y-6">
                {/* Mistakes */}
                <div className="space-y-4">
                    <div className="text-[10px] font-bold text-red-400 uppercase tracking-widest flex items-center gap-2">
                        <XCircle size={12} />
                        Common Implementation Pitfalls
                    </div>
                    <ul className="space-y-3">
                        {mistakes.map((mistake, idx) => (
                            <li key={idx} className="flex gap-3 text-sm text-white/60 leading-relaxed bg-black/20 p-3 rounded-xl border border-white/5">
                                <span className="text-red-400 font-mono font-bold">•</span>
                                {mistake}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* When Not To Use */}
                {whenNotToUse.length > 0 && (
                    <div className="pt-4 border-t border-white/5 space-y-4">
                        <div className="text-[10px] font-bold text-amber-400 uppercase tracking-widest flex items-center gap-2">
                            <Info size={12} />
                            Strategic Constraints
                        </div>
                        <ul className="space-y-3">
                            {whenNotToUse.map((reason, idx) => (
                                <li key={idx} className="flex gap-3 text-sm text-white/40 leading-relaxed italic">
                                    <span className="text-amber-400 font-mono font-bold">!</span>
                                    {reason}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    )
}
