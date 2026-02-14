import React from 'react'
import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'

export const RealizationCard: React.FC = () => {
    return (
        <div className="p-8 rounded-2xl bg-gradient-to-br from-purple-500/10 to-indigo-500/10 border border-purple-500/20">
            <div className="flex items-center gap-3 mb-6">
                <Sparkles className="text-purple-400" size={20} />
                <h3 className="text-xl font-bold text-white">The Reusable Overlap Principle</h3>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
                {/* Left: Problem */}
                <div>
                    <h4 className="text-base font-bold text-red-400 mb-3">❌ Brute Force Wastes Work</h4>
                    <ul className="space-y-2 text-sm text-white/80">
                        <li className="flex items-start gap-2">
                            <span className="text-red-400 shrink-0 mt-0.5">•</span>
                            <span>Recalculates <strong>every element</strong> in every window</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-red-400 shrink-0 mt-0.5">•</span>
                            <span>Ignores that <strong>K-1 elements</strong> are the same</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-red-400 shrink-0 mt-0.5">•</span>
                            <span>Performs <strong>K operations</strong> per window</span>
                        </li>
                    </ul>
                </div>

                {/* Right: Solution */}
                <div>
                    <h4 className="text-base font-bold text-green-400 mb-3">✅ Sliding Window Reuses Work</h4>
                    <ul className="space-y-2 text-sm text-white/80">
                        <li className="flex items-start gap-2">
                            <span className="text-green-400 shrink-0 mt-0.5">•</span>
                            <span>Reuses <strong>K-1 overlapping elements</strong></span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-green-400 shrink-0 mt-0.5">•</span>
                            <span>Only updates <strong>2 elements</strong> per shift</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-green-400 shrink-0 mt-0.5">•</span>
                            <span>Performs <strong>2 operations</strong> per window</span>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Visual Overlap Illustration */}
            <div className="p-5 rounded-xl bg-black/40 border border-white/10">
                <div className="text-center mb-3">
                    <h4 className="text-xs font-bold text-white/60 uppercase tracking-wider">Overlap Visualization</h4>
                </div>

                <div className="space-y-3">
                    {/* Window 1 */}
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-white/40 w-20">Window 1:</span>
                        <div className="flex gap-1">
                            {[2, 5, 1].map((val, idx) => (
                                <div key={idx} className="w-12 h-12 rounded-lg bg-accent-blue/20 border border-accent-blue flex items-center justify-center text-white font-mono text-sm">
                                    {val}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Window 2 with overlap highlight */}
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-white/40 w-20">Window 2:</span>
                        <div className="flex gap-1">
                            <motion.div
                                animate={{ opacity: [0.4, 1, 0.4] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                className="w-12 h-12 rounded-lg bg-purple-500/30 border-2 border-purple-500 flex items-center justify-center text-white font-mono text-sm"
                            >
                                5
                            </motion.div>
                            <motion.div
                                animate={{ opacity: [0.4, 1, 0.4] }}
                                transition={{ duration: 2, repeat: Infinity, delay: 0.2, ease: "easeInOut" }}
                                className="w-12 h-12 rounded-lg bg-purple-500/30 border-2 border-purple-500 flex items-center justify-center text-white font-mono text-sm"
                            >
                                1
                            </motion.div>
                            <div className="w-12 h-12 rounded-lg bg-accent-blue/20 border border-accent-blue flex items-center justify-center text-white font-mono text-sm">
                                8
                            </div>
                        </div>
                        <span className="text-xs text-purple-400 ml-2">← Reused!</span>
                    </div>
                </div>

                <div className="mt-4 text-center">
                    <p className="text-xs text-white/60">
                        <strong className="text-purple-400">K-1 elements</strong> remain the same.
                        <br />
                        Only <strong className="text-red-400">1 leaves</strong>, <strong className="text-green-400">1 enters</strong>.
                    </p>
                </div>
            </div>
        </div>
    )
}
