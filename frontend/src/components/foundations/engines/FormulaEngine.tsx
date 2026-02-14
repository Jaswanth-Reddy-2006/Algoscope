import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Play, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react'

interface Props {
    moduleId: string
}

const FormulaEngine: React.FC<Props> = ({ moduleId }) => {
    const [step, setStep] = useState(0)
    const [isPlaying, setIsPlaying] = useState(false)

    // Example logic for Sliding Window Formula
    const items = [1, 3, 2, 5, 8, 1, 4, 6]
    const windowSize = 3

    useEffect(() => {
        let interval: any
        if (isPlaying) {
            interval = setInterval(() => {
                setStep(s => (s + 1) % (items.length - windowSize + 1))
            }, 1500)
        }
        return () => clearInterval(interval)
    }, [isPlaying, items.length])

    const renderFormula = () => {
        if (moduleId === 'sliding_window') {
            const currentSum = items.slice(step, step + windowSize).reduce((a, b) => a + b, 0)
            return (
                <div className="space-y-12 w-full max-w-2xl">
                    {/* Visual Array */}
                    <div className="flex justify-center gap-2">
                        {items.map((num, i) => {
                            const isInWindow = i >= step && i < step + windowSize
                            return (
                                <motion.div
                                    key={i}
                                    animate={{
                                        scale: isInWindow ? 1.1 : 1,
                                        backgroundColor: isInWindow ? 'rgba(59, 130, 246, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                                        borderColor: isInWindow ? 'rgba(59, 130, 246, 0.5)' : 'rgba(255, 255, 255, 0.1)'
                                    }}
                                    className="w-12 h-12 rounded-xl border flex items-center justify-center font-mono text-white transition-colors"
                                >
                                    {num}
                                </motion.div>
                            )
                        })}
                    </div>

                    {/* Formula Animation */}
                    <div className="glass-card p-8 rounded-3xl border border-white/10 bg-black/40 relative">
                        <div className="text-center mb-8">
                            <span className="text-[10px] font-bold text-accent-blue uppercase tracking-[0.2em] block mb-2">Live Invariant</span>
                            <div className="text-3xl font-mono text-white">
                                Sum = <span className="text-accent-blue">{currentSum}</span>
                            </div>
                        </div>

                        <div className="flex items-center justify-center gap-4 font-mono text-sm text-white/40">
                            <div className="flex flex-col items-center">
                                <span className="text-[10px] mb-1">Incoming</span>
                                <div className="p-2 rounded bg-green-500/10 text-green-400 border border-green-500/20">
                                    +{items[step + windowSize] || 'END'}
                                </div>
                            </div>
                            <div className="text-xl">→</div>
                            <div className="flex flex-col items-center">
                                <span className="text-[10px] mb-1">Outgoing</span>
                                <div className="p-2 rounded bg-red-500/10 text-red-400 border border-red-500/20">
                                    -{items[step]}
                                </div>
                            </div>
                        </div>

                        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-accent-blue text-black text-[10px] font-bold uppercase tracking-wider">
                            O(1) Transition
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="flex justify-center gap-4">
                        <button
                            onClick={() => setStep(s => Math.max(0, s - 1))}
                            className="w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white transition-colors"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <button
                            onClick={() => setIsPlaying(!isPlaying)}
                            className="w-16 h-16 rounded-full bg-accent-blue hover:scale-105 flex items-center justify-center text-black transition-all shadow-glow-blue"
                        >
                            {isPlaying ? <RotateCcw size={24} /> : <Play size={24} className="ml-1" />}
                        </button>
                        <button
                            onClick={() => setStep(s => Math.min(items.length - windowSize, s + 1))}
                            className="w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white transition-colors"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>
            )
        }

        return (
            <div className="text-white/20 italic font-mono">
                Formula model for {moduleId} rendering...
            </div>
        )
    }

    return (
        <div className="w-full h-full flex items-center justify-center p-12 overflow-hidden">
            {renderFormula()}
        </div>
    )
}

export default FormulaEngine
