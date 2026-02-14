import { motion } from 'framer-motion'
import { Square, Maximize2, Grid3x3, Target, Activity, Zap, Shield, HelpCircle, Code } from 'lucide-react'
import { SubPattern } from '../../types/foundation'

interface Props {
    patterns: SubPattern[]
    onSelect: (id: string) => void
}

const getIconForPattern = (id: string) => {
    const icons: Record<string, any> = {
        'fixed_window': Square,
        'variable_window': Maximize2,
        'at_most_k': Grid3x3,
        'exact_k': Target,
        'two_sum_sorted': Zap,
        'opposite_direction': Activity,
        'same_direction': Shield,
        'fast_slow': Activity,
        'partition': Shield
    }
    return icons[id] || HelpCircle
}

const getGradientForPattern = (index: number) => {
    const gradients = [
        'from-blue-500/10 to-cyan-500/10 border-blue-500/20',
        'from-emerald-500/10 to-green-500/10 border-emerald-500/20',
        'from-purple-500/10 to-pink-500/10 border-purple-500/20',
        'from-amber-500/10 to-orange-500/10 border-amber-500/20',
        'from-rose-500/10 to-red-500/10 border-rose-500/20',
        'from-indigo-500/10 to-blue-500/10 border-indigo-500/20'
    ]
    return gradients[index % gradients.length]
}

export const SubPatternSelector: React.FC<Props> = ({ patterns, onSelect }) => {
    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="text-center space-y-4 max-w-3xl mx-auto">
                <span className="text-xs font-bold text-accent-blue uppercase tracking-[0.2em]">Strategy selection</span>
                <h2 className="text-4xl font-bold text-white">The Toolkit of Intelligence</h2>
                <p className="text-white/50 leading-relaxed text-lg">
                    Each sub-pattern is a specific strategic variation. Select a pattern to explore its
                    logical invariants, edge cases, and language implementations.
                </p>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {patterns.map((pattern, idx) => {
                    const Icon = getIconForPattern(pattern.id)
                    const gradient = getGradientForPattern(idx)

                    return (
                        <motion.button
                            key={pattern.id}
                            onClick={() => onSelect(pattern.id)}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1, duration: 0.5 }}
                            whileHover={{ scale: 1.02, y: -8 }}
                            whileTap={{ scale: 0.98 }}
                            className={`
                                group relative p-8 rounded-[2rem]
                                bg-gradient-to-br ${gradient}
                                border border-white/5 hover:border-white/20
                                transition-all duration-500
                                text-left overflow-hidden flex flex-col h-full
                            `}
                        >
                            {/* Animated Background Glow */}
                            <div className="absolute -inset-1 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 scanline-animation" />

                            {/* Decorative Icon */}
                            <div className="absolute -right-8 -bottom-8 opacity-[0.03] group-hover:opacity-[0.08] group-hover:scale-125 transition-all duration-700 text-white">
                                <Icon size={180} />
                            </div>

                            {/* Content */}
                            <div className="relative z-10 flex flex-col h-full">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                                        <Icon size={24} className="text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold text-white group-hover:text-accent-blue transition-colors">
                                        {pattern.title}
                                    </h3>
                                </div>

                                <p className="text-white/40 text-sm leading-relaxed mb-8 flex-grow">
                                    {pattern.description || "Master the logical foundations of this sub-pattern strategy."}
                                </p>

                                <div className="space-y-4">
                                    <div className="p-4 rounded-2xl bg-black/40 border border-white/5 group-hover:border-white/10 transition-colors relative overflow-hidden">
                                        <div className="text-[10px] uppercase tracking-widest text-white/30 mb-2 font-bold flex items-center gap-2">
                                            <Shield size={10} className="text-accent-blue" />
                                            Invariant
                                        </div>
                                        <code className="text-xs font-mono text-white/80 line-clamp-1 group-hover:text-white transition-colors">
                                            {pattern.invariant}
                                        </code>
                                    </div>

                                    <div className="flex items-center justify-between pt-2">
                                        <div className="flex items-center gap-4">
                                            <div className="flex -space-x-2">
                                                {[1, 2, 3, 4].map(i => (
                                                    <div key={i} className="w-6 h-6 rounded-full border border-black bg-white/5 flex items-center justify-center">
                                                        <Code size={10} className="text-white/40" />
                                                    </div>
                                                ))}
                                            </div>
                                            <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">4 Languages</span>
                                        </div>
                                        <span className="text-sm font-bold text-accent-blue opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-500">
                                            Open →
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </motion.button>
                    )
                })}
            </div>

            {/* Footer Insight */}
            <div className="max-w-xl mx-auto p-6 rounded-3xl bg-white/[0.02] border border-white/5 text-center mt-12">
                <p className="text-sm text-white/30 italic">
                    "Intelligence is not just finding the answer, but understanding the invariant that makes the answer inevitable."
                </p>
            </div>
        </div>
    )
}
