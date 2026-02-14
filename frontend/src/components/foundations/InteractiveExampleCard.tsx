import React, { useState } from 'react'
import { Zap, AlertCircle, ShieldAlert } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { EdgeCase } from '../../types/foundation'

interface Props {
    edgeCases: EdgeCase[]
}

export const InteractiveExampleCard: React.FC<Props> = ({ edgeCases }) => {
    const [activeIndex, setActiveIndex] = useState(0)
    const activeCase = edgeCases[activeIndex]

    if (!activeCase) return (
        <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/5 text-center">
            <p className="text-white/40 italic">No specific edge cases defined for this sub-pattern yet.</p>
        </div>
    )

    return (
        <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/10 overflow-hidden relative group">
            <div className="absolute right-0 top-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <ShieldAlert size={120} className="text-amber-400" />
            </div>

            <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-amber-500/10 rounded-lg">
                            <AlertCircle size={24} className="text-amber-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-white tracking-tight">Interactive Failure Analysis</h3>
                    </div>

                    <div className="flex gap-2">
                        {edgeCases.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setActiveIndex(i)}
                                className={`w-8 h-2 rounded-full transition-all duration-300 ${i === activeIndex ? 'bg-amber-400 w-12' : 'bg-white/10 hover:bg-white/20'
                                    }`}
                            />
                        ))}
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeIndex}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="grid grid-cols-1 lg:grid-cols-2 gap-12"
                    >
                        {/* Info Section */}
                        <div className="space-y-6">
                            <div>
                                <h4 className="text-xl font-bold text-white mb-2">{activeCase.title}</h4>
                                <p className="text-white/60 leading-relaxed text-sm">
                                    {activeCase.description}
                                </p>
                            </div>

                            <div className="p-4 rounded-2xl bg-red-500/5 border border-red-500/10">
                                <span className="text-[10px] font-bold text-red-400 uppercase tracking-widest block mb-1">Impact</span>
                                <p className="text-sm text-white/70">{activeCase.whyItBreaks}</p>
                            </div>

                            <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10">
                                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest block mb-1">Strategic Fix</span>
                                <p className="text-sm text-white/70">{activeCase.howToFix}</p>
                            </div>
                        </div>

                        {/* Visualization Section */}
                        <div className="flex flex-col justify-center space-y-8">
                            {activeCase.visualExample && (
                                <div className="space-y-4">
                                    <div className="flex gap-3 justify-center">
                                        {activeCase.visualExample.array.map((val, i) => (
                                            <div
                                                key={i}
                                                className={`w-12 h-12 rounded-xl border flex items-center justify-center font-mono font-bold transition-all duration-500 ${val < 0 ? 'bg-red-500/20 border-red-500 text-red-500' : 'bg-white/5 border-white/10 text-white/60'
                                                    }`}
                                            >
                                                {val}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="p-4 rounded-xl bg-black/40 border border-white/5 text-center">
                                        <p className="text-xs text-white/40 italic">
                                            {activeCase.visualExample.message}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {!activeCase.visualExample && (
                                <div className="aspect-video rounded-3xl bg-black/40 border border-white/5 flex items-center justify-center p-8 text-center">
                                    <div>
                                        <Zap size={32} className="text-white/10 mx-auto mb-4" />
                                        <p className="text-sm text-white/30 italic max-w-[200px]">
                                            This case requires manual code validation—see the specific fix logic for details.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    )
}
