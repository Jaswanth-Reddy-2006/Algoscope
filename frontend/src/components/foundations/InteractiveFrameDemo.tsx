import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, RotateCcw } from 'lucide-react'

const DEMO_ARRAY = [2, 5, 1, 8, 2, 9, 1]
const WINDOW_SIZE = 3

export const InteractiveFrameDemo: React.FC = () => {
    const [windowStart, setWindowStart] = useState(0)
    const [calculation, setCalculation] = useState<{
        oldSum: number
        subtract: number
        add: number
        newSum: number
    } | null>(null)

    const currentSum = DEMO_ARRAY.slice(windowStart, windowStart + WINDOW_SIZE).reduce((a, b) => a + b, 0)
    const canSlide = windowStart + WINDOW_SIZE < DEMO_ARRAY.length

    const slideRight = () => {
        if (!canSlide) return

        const oldSum = currentSum
        const subtract = DEMO_ARRAY[windowStart]
        const add = DEMO_ARRAY[windowStart + WINDOW_SIZE]
        const newSum = oldSum - subtract + add

        setCalculation({ oldSum, subtract, add, newSum })
        setWindowStart(prev => prev + 1)
    }

    const reset = () => {
        setWindowStart(0)
        setCalculation(null)
    }

    return (
        <div className="space-y-6">
            {/* Array Visualization */}
            <div className="relative">
                <div className="flex gap-2 justify-center">
                    {DEMO_ARRAY.map((value, index) => {
                        const isInWindow = index >= windowStart && index < windowStart + WINDOW_SIZE
                        const isLeft = index === windowStart
                        const isRight = index === windowStart + WINDOW_SIZE - 1

                        return (
                            <div key={index} className="relative">
                                {/* Cell */}
                                <motion.div
                                    className={`w-16 h-16 rounded-xl flex items-center justify-center text-xl font-bold transition-all duration-300 ${isInWindow
                                            ? 'bg-accent-blue/20 border-2 border-accent-blue text-white scale-110'
                                            : 'bg-white/5 border border-white/10 text-white/40'
                                        }`}
                                    animate={isInWindow ? { scale: 1.1 } : { scale: 1 }}
                                >
                                    {value}
                                </motion.div>

                                {/* Pointer Labels */}
                                <AnimatePresence>
                                    {isLeft && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="absolute -top-8 left-1/2 -translate-x-1/2 text-[10px] font-mono uppercase tracking-widest text-accent-blue"
                                        >
                                            L
                                        </motion.div>
                                    )}
                                    {isRight && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="absolute -top-8 left-1/2 -translate-x-1/2 text-[10px] font-mono uppercase tracking-widest text-purple-400"
                                        >
                                            R
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Index */}
                                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-white/30 font-mono">
                                    {index}
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* Window Highlight Bar */}
                <motion.div
                    className="absolute top-0 h-16 bg-accent-blue/10 border-2 border-accent-blue/50 rounded-xl pointer-events-none"
                    animate={{
                        left: `${windowStart * (64 + 8)}px`,
                        width: `${WINDOW_SIZE * 64 + (WINDOW_SIZE - 1) * 8}px`
                    }}
                    transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                />
            </div>

            {/* Current Sum Display */}
            <div className="flex justify-center">
                <div className="px-6 py-3 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-[10px] uppercase tracking-widest text-white/40 mr-3">Current Sum</span>
                    <motion.span
                        key={currentSum}
                        initial={{ scale: 1.2, color: '#00B0FA' }}
                        animate={{ scale: 1, color: '#ffffff' }}
                        className="text-2xl font-bold font-mono"
                    >
                        {currentSum}
                    </motion.span>
                </div>
            </div>

            {/* Calculation Display */}
            <AnimatePresence>
                {calculation && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="p-6 rounded-2xl bg-gradient-to-br from-orange-500/10 to-amber-500/10 border border-orange-500/20"
                    >
                        <div className="flex items-center justify-center gap-4 text-sm font-mono">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 }}
                                className="flex flex-col items-center"
                            >
                                <span className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Old Sum</span>
                                <span className="text-xl font-bold text-white">{calculation.oldSum}</span>
                            </motion.div>

                            <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="text-white/40 text-2xl"
                            >
                                −
                            </motion.span>

                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 }}
                                className="flex flex-col items-center"
                            >
                                <span className="text-[10px] uppercase tracking-widest text-red-400 mb-1">Subtract</span>
                                <span className="text-xl font-bold text-red-400">{calculation.subtract}</span>
                            </motion.div>

                            <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="text-white/40 text-2xl"
                            >
                                +
                            </motion.span>

                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 }}
                                className="flex flex-col items-center"
                            >
                                <span className="text-[10px] uppercase tracking-widest text-green-400 mb-1">Add</span>
                                <span className="text-xl font-bold text-green-400">{calculation.add}</span>
                            </motion.div>

                            <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.6 }}
                                className="text-white/40 text-2xl"
                            >
                                =
                            </motion.span>

                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.7, type: 'spring' }}
                                className="flex flex-col items-center"
                            >
                                <span className="text-[10px] uppercase tracking-widest text-accent-blue mb-1">New Sum</span>
                                <span className="text-2xl font-bold text-accent-blue">{calculation.newSum}</span>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Controls */}
            <div className="flex justify-center gap-4">
                <button
                    onClick={slideRight}
                    disabled={!canSlide}
                    className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all ${canSlide
                            ? 'bg-accent-blue text-black hover:scale-105 shadow-lg shadow-accent-blue/20'
                            : 'bg-white/5 text-white/20 cursor-not-allowed'
                        }`}
                >
                    Slide Right
                    <ChevronRight size={18} />
                </button>

                <button
                    onClick={reset}
                    className="px-6 py-3 rounded-xl font-bold flex items-center gap-2 bg-white/5 text-white/60 hover:bg-white/10 hover:text-white transition-all"
                >
                    <RotateCcw size={18} />
                    Reset
                </button>
            </div>
        </div>
    )
}
