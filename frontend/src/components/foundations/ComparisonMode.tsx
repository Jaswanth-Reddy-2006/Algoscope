import React from 'react';
import { motion } from 'framer-motion';
import {
    ArrowRightLeft,
    AlertCircle
} from 'lucide-react';
import { Comparison } from '../../types/foundation';

interface Props {
    comparisons: Comparison[];
}

export const ComparisonMode: React.FC<Props> = ({ comparisons }) => {
    if (!comparisons || comparisons.length === 0) return null;

    return (
        <div className="mt-24 space-y-12">
            <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-accent-blue/10 text-accent-blue shadow-[0_0_15px_rgba(236, 65, 134,0.2)]">
                    <ArrowRightLeft size={28} />
                </div>
                <div>
                    <h2 className="text-3xl font-bold italic tracking-tight">Side-by-Side Analysis</h2>
                    <p className="text-white/40 text-sm">Understanding the trade-offs between similar structures.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {comparisons.map((comp, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="group relative overflow-hidden rounded-3xl bg-white/[0.02] border border-white/10 hover:border-accent-blue/30 transition-all p-8"
                    >
                        {/* Background Accent */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-accent-blue/5 rounded-full blur-3xl group-hover:bg-accent-blue/10 transition-colors" />

                        <h3 className="text-xl font-bold mb-8 text-white group-hover:text-accent-blue transition-colors italic">
                            {comp.title}
                        </h3>

                        <div className="space-y-6">
                            {comp.metrics.map((metric, mIdx) => (
                                <div key={mIdx} className="space-y-3">
                                    <div className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">
                                        {metric.label}
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        {Object.entries(metric.values).map(([key, val], vIdx) => (
                                            <div key={vIdx} className="p-4 rounded-xl bg-white/[0.03] border border-white/5 group-hover:bg-white/[0.05] transition-colors">
                                                <div className="text-[10px] text-white/30 uppercase mb-1">{key}</div>
                                                <div className="text-sm font-mono font-bold text-white/80">{val}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}

                            <div className="mt-8 p-4 rounded-2xl bg-accent-blue/10 border border-accent-blue/20 flex gap-4 items-start">
                                <AlertCircle className="text-accent-blue shrink-0" size={20} />
                                <div className="space-y-1">
                                    <div className="text-xs font-bold text-accent-blue uppercase tracking-widest">Key Trade-off</div>
                                    <p className="text-sm text-white/70 leading-relaxed italic">{comp.tradeoff}</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};
