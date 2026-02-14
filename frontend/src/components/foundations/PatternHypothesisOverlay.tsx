import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, XCircle, BrainCircuit } from 'lucide-react'

interface Props {
    correctPattern: string // e.g., 'sliding_window'
    onComplete: () => void
}

const PATTERN_OPTIONS = [
    { id: 'sliding_window', label: 'Sliding Window', reason: "Focuses on a contiguous subarray or substring." },
    { id: 'two_pointer', label: 'Two Pointers', reason: "Used for searching pairs or comparing ends." },
    { id: 'binary_search', label: 'Binary Search', reason: "Efficiently divides sorted search space." },
    { id: 'prefix_sum', label: 'Prefix Sum', reason: "Pre-computes cumulative sums for range queries." },
    { id: 'hash_map', label: 'Hash Map', reason: "Uses key-value pairs for O(1) lookups." }
]

export const PatternHypothesisOverlay: React.FC<Props> = ({ correctPattern, onComplete }) => {
    const [selected, setSelected] = useState<string | null>(null)
    const [feedback, setFeedback] = useState<{ isCorrect: boolean; message: string } | null>(null)

    const handleSelect = (id: string) => {
        setSelected(id)
        if (id === correctPattern) {
            setFeedback({ isCorrect: true, message: "Correct! You've identified the core pattern." })
            setTimeout(onComplete, 1500)
        } else {
            const wrongOption = PATTERN_OPTIONS.find(p => p.id === id)
            setFeedback({
                isCorrect: false,
                message: `Incorrect. ${wrongOption?.label} is ${wrongOption?.reason.toLowerCase()} Think about the problem structure.`
            })
        }
    }

    return (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-2xl"
            >
                <div className="text-center mb-6">
                    <div className="w-12 h-12 bg-indigo-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                        <BrainCircuit className="w-6 h-6 text-indigo-400" />
                    </div>
                    <h2 className="text-xl font-bold text-white">Pattern Hypothesis</h2>
                    <p className="text-slate-400 text-sm mt-1">
                        Identify the algorithmic pattern required to solve this problem.
                    </p>
                </div>

                <div className="space-y-2">
                    {PATTERN_OPTIONS.map((option) => (
                        <button
                            key={option.id}
                            onClick={() => handleSelect(option.id)}
                            disabled={feedback?.isCorrect}
                            className={`w-full p-3 rounded-lg text-left text-sm font-medium transition-all flex items-center justify-between
                                ${selected === option.id
                                    ? feedback?.isCorrect
                                        ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                                        : 'bg-red-500/20 border-red-500/50 text-red-300'
                                    : 'bg-slate-800 hover:bg-slate-700 border border-transparent text-slate-300 hover:text-white'
                                }
                                ${feedback?.isCorrect && selected !== option.id ? 'opacity-50 cursor-not-allowed' : ''}
                            `}
                        >
                            <span>{option.label}</span>
                            {selected === option.id && (
                                feedback?.isCorrect ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />
                            )}
                        </button>
                    ))}
                </div>

                <AnimatePresence>
                    {feedback && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className={`mt-6 p-4 rounded-lg text-sm border ${feedback.isCorrect
                                    ? 'bg-emerald-950/30 border-emerald-900 text-emerald-300'
                                    : 'bg-red-950/30 border-red-900 text-red-300'
                                }`}
                        >
                            <div className="flex items-start gap-3">
                                <div className="mt-0.5 shrink-0">
                                    {feedback.isCorrect ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                                </div>
                                <p>{feedback.message}</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    )
}
