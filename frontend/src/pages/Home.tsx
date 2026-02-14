import React from 'react'
import { Link } from 'react-router-dom'
import { Zap, Shield, Globe, ChevronRight, Activity, Cpu, Layers } from 'lucide-react'
import { motion } from 'framer-motion'

const Home: React.FC = () => {
    return (
        <div className="flex-1 overflow-y-auto mesh-bg relative flex flex-col">
            {/* Animated Blobs */}
            <div className="absolute top-20 left-1/4 w-72 h-72 bg-accent-blue/20 rounded-full blur-[120px] animate-blob" />
            <div className="absolute top-40 right-1/4 w-72 h-72 bg-accent-purple/20 rounded-full blur-[120px] animate-blob animation-delay-2000" />

            <div className="max-w-7xl mx-auto px-8 py-24 flex flex-col lg:flex-row items-center gap-16 relative z-10">
                {/* Left: Content */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="flex-1 text-left"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-accent-blue text-[11px] font-bold uppercase tracking-[0.2em] mb-8 shadow-inner">
                        <Activity size={14} />
                        <span>High-Intelligence Research Laboratory</span>
                    </div>

                    <h1 className="leading-[1.05]">
                        Visualize the <br />
                        <span className="text-gradient">Invisible Logic</span>
                    </h1>

                    <p className="text-xl text-white/50 max-w-xl mb-10 leading-relaxed font-light">
                        AlgoScope is a high-precision interactive platform designed to transform abstract code into breathtaking visual logic. Master the patterns that define modern computation.
                    </p>

                    <div className="flex flex-wrap items-center gap-6">
                        <Link to="/problems" className="btn-primary group">
                            <span>Open Laboratory</span>
                            <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link to="/problems/two-sum" className="btn-secondary">
                            <span>View All Patterns</span>
                        </Link>
                    </div>

                    <div className="mt-16 grid grid-cols-3 gap-8">
                        <StatItem icon={Activity} label="Analysis Layers" value="Atomic" />
                        <StatItem icon={Cpu} label="Engine State" value="Optimized" />
                        <StatItem icon={Layers} label="Architecture" value="Modular" />
                    </div>
                </motion.div>

                {/* Right: Animated Demo Preview */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, rotate: 2 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="flex-1 w-full relative"
                >
                    <div className="glass-card p-4 aspect-video shadow-2xl shadow-accent-blue/10">
                        <div className="absolute inset-0 bg-gradient-to-tr from-accent-blue/10 to-transparent" />
                        <div className="h-full w-full bg-black/40 rounded-xl border border-white/5 flex flex-col overflow-hidden">
                            {/* Mock Visualizer Header */}
                            <div className="h-10 border-b border-white/5 flex items-center px-4 gap-2 bg-white/5">
                                <div className="w-2 h-2 rounded-full bg-red-500/40" />
                                <div className="w-2 h-2 rounded-full bg-yellow-500/40" />
                                <div className="w-2 h-2 rounded-full bg-green-500/40" />
                                <div className="ml-4 h-4 w-32 bg-white/5 rounded-full" />
                            </div>
                            {/* Mock Content */}
                            <div className="flex-1 p-6 relative">
                                <motion.div
                                    animate={{ y: [0, -10, 0] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                    className="flex gap-4 justify-center mt-8"
                                >
                                    {[2, 7, 11, 15, 20].map((num, i) => (
                                        <div key={i} className={`w-14 h-14 rounded-xl border flex items-center justify-center font-mono text-lg transition-all
                                            ${i === 1 || i === 3 ? 'border-accent-blue bg-accent-blue/20 text-accent-blue shadow-glow' : 'border-white/10 text-white/20'}
                                        `}>
                                            {num}
                                        </div>
                                    ))}
                                </motion.div>

                                <div className="absolute bottom-8 left-8 right-8 h-2 bg-white/5 rounded-full overflow-hidden">
                                    <motion.div
                                        animate={{ x: ['-100%', '100%'] }}
                                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                        className="h-full w-1/3 bg-accent-blue/40 shadow-glow"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Floating elements */}
                    <motion.div
                        animate={{ y: [0, -20, 0] }}
                        transition={{ duration: 5, repeat: Infinity }}
                        className="absolute -top-10 -right-10 w-24 h-24 glass-card flex items-center justify-center p-4 border-accent-purple/30 bg-accent-purple/5"
                    >
                        <Zap size={32} className="text-accent-purple" />
                    </motion.div>

                    <motion.div
                        animate={{ y: [0, 15, 0] }}
                        transition={{ duration: 6, repeat: Infinity }}
                        className="absolute -bottom-6 -left-6 w-32 h-16 glass-card flex items-center justify-center gap-2 p-2 px-4 border-accent-cyan/30"
                    >
                        <div className="w-2 h-2 rounded-full bg-accent-cyan animate-ping" />
                        <span className="text-[10px] font-bold text-accent-cyan uppercase tracking-widest">Live Sync</span>
                    </motion.div>
                </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/20"
            >
                <div className="w-[1px] h-12 bg-gradient-to-b from-transparent via-white/20 to-transparent" />
                <span className="text-[10px] uppercase tracking-[0.3em] font-bold">Scroll</span>
            </motion.div>

            {/* Features Row */}
            <div className="max-w-7xl mx-auto px-8 py-24 w-full">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <FeatureCard
                        icon={Zap}
                        title="Atomic Precision"
                        desc="Visualize logic at the individual instruction level. Every pointer swap, every comparison, rendered with frame-by-frame exactness."
                    />
                    <FeatureCard
                        icon={Shield}
                        title="Enterprise Stability"
                        desc="Built on a mission-critical React codebase with global error handling and high-resilience memory state guards."
                    />
                    <FeatureCard
                        icon={Globe}
                        title="Pattern-First Learning"
                        desc="Don't just solve problems. Master the underlying patterns like Sliding Window and Two Pointers through visual intuition."
                    />
                </div>
            </div>
        </div>
    )
}

const StatItem = ({ icon: Icon, label, value }: any) => (
    <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2 text-white/30 mb-1">
            <Icon size={14} />
            <span className="text-[10px] uppercase tracking-widest font-bold">{label}</span>
        </div>
        <span className="text-2xl font-bold font-mono text-white/90">{value}</span>
    </div>
)

const FeatureCard = ({ icon: Icon, title, desc }: any) => (
    <div className="glass-card p-10 hover-lift group border-white/5 hover:border-accent-blue/30 transition-all">
        <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-8 group-hover:bg-accent-blue/20 group-hover:text-accent-blue transition-all duration-500 group-hover:shadow-glow">
            <Icon size={28} />
        </div>
        <h3 className="mb-4 group-hover:text-accent-blue transition-colors">{title}</h3>
        <p className="text-white/40 leading-relaxed font-light">{desc}</p>
    </div>
)

export default Home
