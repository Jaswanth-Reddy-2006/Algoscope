import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Play, RotateCcw, Activity } from 'lucide-react'

interface Props {
    isBrute?: boolean
}

const FallbackEngine: React.FC<Props> = ({ isBrute = false }) => {
    const [progress, setProgress] = useState(0)
    const [isPlaying, setIsPlaying] = useState(false)

    useEffect(() => {
        let interval: any
        if (isPlaying) {
            interval = setInterval(() => {
                setProgress(prev => (prev >= 100 ? 0 : prev + 1))
            }, 50)
        }
        return () => clearInterval(interval)
    }, [isPlaying])

    return (
        <div className="w-full h-full flex flex-col items-center justify-center p-8 font-outfit">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center space-y-2">
                    <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-6 shadow-glow">
                        <Activity className="text-accent-blue/60" size={24} />
                    </div>

                    <h3 className="text-xl font-bold text-white">
                        {isBrute ? 'Standard Processing' : 'Optimized Logic'}
                    </h3>
                    <p className="text-sm text-white/40">
                        Visualizing algorithmic state transitions...
                    </p>
                </div>

                {/* Simulated Visualizer Area */}
                <div className="h-40 bg-black/40 rounded-xl border border-white/5 relative overflow-hidden flex items-end justify-center gap-1 p-4">
                    {[...Array(10)].map((_, i) => (
                        <motion.div
                            key={i}
                            animate={{
                                height: isPlaying ? `${Math.max(10, Math.random() * 100)}%` : '20%',
                                opacity: isPlaying ? 1 : 0.3
                            }}
                            transition={{ duration: 0.5 }}
                            className={`flex-1 rounded-t-sm ${i % 2 === 0 ? 'bg-accent-blue/40' : 'bg-accent-purple/40'}`}
                        />
                    ))}

                    <div className="absolute top-2 right-2 text-[10px] font-mono text-white/20">
                        {isBrute ? 'O(N)' : 'O(log N)'}
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-white/30">
                        <span>Computation</span>
                        <span>{progress}%</span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-accent-blue"
                            animate={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                {/* Controls */}
                <div className="flex justify-center gap-4">
                    <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-bold uppercase tracking-widest transition-colors flex items-center gap-2"
                    >
                        {isPlaying ? 'Pause' : <><Play size={12} fill="currentColor" /> Simulate</>}
                    </button>
                    <button
                        onClick={() => { setProgress(0); setIsPlaying(false); }}
                        className="px-4 py-2 bg-transparent hover:bg-white/5 text-white/40 hover:text-white rounded-lg transition-colors"
                    >
                        <RotateCcw size={16} />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default FallbackEngine
