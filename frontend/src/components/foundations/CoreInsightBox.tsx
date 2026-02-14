import React from 'react'
import { Crop, Sparkles } from 'lucide-react'

export const CoreInsightBox: React.FC = () => {
    return (
        <div className="space-y-6">
            {/* Analogy Section */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20">
                <div className="flex items-center gap-3 mb-4">
                    <Crop className="text-amber-400" size={20} />
                    <h3 className="text-lg font-bold text-white">The Digital Cropping Frame</h3>
                </div>

                <ul className="space-y-3 mb-6">
                    <li className="flex items-start gap-3 text-sm text-white/80">
                        <span className="text-amber-400 font-bold shrink-0">1.</span>
                        <span>The frame captures only a portion of data</span>
                    </li>
                    <li className="flex items-start gap-3 text-sm text-white/80">
                        <span className="text-amber-400 font-bold shrink-0">2.</span>
                        <span>Instead of recomputing the entire picture, we reuse the overlap</span>
                    </li>
                    <li className="flex items-start gap-3 text-sm text-white/80">
                        <span className="text-amber-400 font-bold shrink-0">3.</span>
                        <span>Only two elements change per movement</span>
                    </li>
                </ul>

                {/* Formula */}
                <div className="p-4 rounded-xl bg-black/40 border border-amber-500/30">
                    <div className="flex items-center gap-2 mb-2">
                        <Sparkles size={14} className="text-amber-400" />
                        <span className="text-[10px] uppercase tracking-widest text-amber-400/80">Reusable Overlap Principle</span>
                    </div>
                    <code className="text-base font-mono font-bold text-accent-blue block">
                        New_Value = Old_Value - Outgoing + Incoming
                    </code>
                </div>
            </div>
        </div>
    )
}
