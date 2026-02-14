import React from 'react'
import { Lightbulb, Info, Footprints } from 'lucide-react'

interface Props {
    analogy: string
    realWorldExample: string
    coreInsight: string
}

export const MentalModelPrincipleCard: React.FC<Props> = ({ analogy, realWorldExample, coreInsight }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Analogy Card */}
            <div className="p-6 rounded-2xl bg-accent-blue/5 border border-accent-blue/10 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-accent-blue/20 flex items-center justify-center mb-4">
                    <Footprints className="text-accent-blue" size={24} />
                </div>
                <h4 className="text-sm font-bold text-accent-blue uppercase tracking-widest mb-3">The Analogy</h4>
                <p className="text-sm text-white/70 leading-relaxed italic">
                    "{analogy}"
                </p>
            </div>

            {/* Insight Card */}
            <div className="p-6 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center mb-4">
                    <Lightbulb className="text-emerald-400" size={24} />
                </div>
                <h4 className="text-sm font-bold text-emerald-400 uppercase tracking-widest mb-3">Core Insight</h4>
                <p className="text-sm text-white/70 leading-relaxed">
                    {coreInsight}
                </p>
            </div>

            {/* Real World Card */}
            <div className="p-6 rounded-2xl bg-amber-500/5 border border-amber-500/10 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center mb-4">
                    <Info className="text-amber-400" size={24} />
                </div>
                <h4 className="text-sm font-bold text-amber-400 uppercase tracking-widest mb-3">Real World</h4>
                <p className="text-sm text-white/70 leading-relaxed">
                    {realWorldExample}
                </p>
            </div>
        </div>
    )
}
