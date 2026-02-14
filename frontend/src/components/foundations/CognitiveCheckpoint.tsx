import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, XCircle, HelpCircle } from 'lucide-react'

interface CognitiveCheckpointProps {
    onVerified: () => void
}

export const CognitiveCheckpoint: React.FC<CognitiveCheckpointProps> = ({ onVerified }) => {
    const [answer1, setAnswer1] = useState('')
    const [answer2, setAnswer2] = useState('')
    const [validation1, setValidation1] = useState<boolean | null>(null)
    const [validation2, setValidation2] = useState<boolean | null>(null)

    const validateAnswer1 = (text: string) => {
        const normalized = text.toLowerCase()
        return normalized.includes('overlap') ||
            normalized.includes('reuse') ||
            normalized.includes('intersection') ||
            normalized.includes('same')
    }

    const validateAnswer2 = (text: string) => {
        const normalized = text.toLowerCase()
        const hasSubtract = normalized.includes('subtract') ||
            normalized.includes('remove') ||
            normalized.includes('outgoing') ||
            normalized.includes('left')
        const hasAdd = normalized.includes('add') ||
            normalized.includes('incoming') ||
            normalized.includes('new') ||
            normalized.includes('right')
        return hasSubtract && hasAdd
    }

    const handleAnswer1Change = (value: string) => {
        setAnswer1(value)
        if (value.length > 5) {
            const isValid = validateAnswer1(value)
            setValidation1(isValid)
            if (isValid && validation2) {
                onVerified()
            }
        } else {
            setValidation1(null)
        }
    }

    const handleAnswer2Change = (value: string) => {
        setAnswer2(value)
        if (value.length > 5) {
            const isValid = validateAnswer2(value)
            setValidation2(isValid)
            if (isValid && validation1) {
                onVerified()
            }
        } else {
            setValidation2(null)
        }
    }

    const allVerified = validation1 === true && validation2 === true

    return (
        <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-500/10 to-indigo-500/10 border border-purple-500/20">
            <div className="flex items-center gap-3 mb-6">
                <HelpCircle className="text-purple-400" size={20} />
                <h3 className="text-lg font-bold text-white">Cognitive Checkpoint</h3>
            </div>

            <div className="space-y-6">
                {/* Question 1 */}
                <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                        Q1: Why don't we recompute the full window each time?
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            value={answer1}
                            onChange={(e) => handleAnswer1Change(e.target.value)}
                            placeholder="Type your answer..."
                            className="w-full px-4 py-3 pr-12 rounded-xl bg-black/40 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-purple-500/50 transition-colors"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            <AnimatePresence mode="wait">
                                {validation1 === true && (
                                    <motion.div
                                        key="check1"
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        exit={{ scale: 0 }}
                                        transition={{ type: 'spring', stiffness: 200 }}
                                    >
                                        <CheckCircle2 className="text-green-400" size={20} />
                                    </motion.div>
                                )}
                                {validation1 === false && (
                                    <motion.div
                                        key="x1"
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        exit={{ scale: 0 }}
                                    >
                                        <XCircle className="text-red-400" size={20} />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                    {validation1 === false && (
                        <p className="text-xs text-red-400 mt-2">
                            Hint: Think about what stays the same between windows
                        </p>
                    )}
                </div>

                {/* Question 2 */}
                <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                        Q2: What changes when the window moves right by one position?
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            value={answer2}
                            onChange={(e) => handleAnswer2Change(e.target.value)}
                            placeholder="Type your answer..."
                            className="w-full px-4 py-3 pr-12 rounded-xl bg-black/40 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-purple-500/50 transition-colors"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            <AnimatePresence mode="wait">
                                {validation2 === true && (
                                    <motion.div
                                        key="check2"
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        exit={{ scale: 0 }}
                                        transition={{ type: 'spring', stiffness: 200 }}
                                    >
                                        <CheckCircle2 className="text-green-400" size={20} />
                                    </motion.div>
                                )}
                                {validation2 === false && (
                                    <motion.div
                                        key="x2"
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        exit={{ scale: 0 }}
                                    >
                                        <XCircle className="text-red-400" size={20} />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                    {validation2 === false && (
                        <p className="text-xs text-red-400 mt-2">
                            Hint: One element leaves, one element enters
                        </p>
                    )}
                </div>

                {/* Success Message */}
                <AnimatePresence>
                    {allVerified && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-4 rounded-xl bg-green-500/20 border border-green-500/30 flex items-center gap-3"
                        >
                            <CheckCircle2 className="text-green-400 shrink-0" size={20} />
                            <p className="text-sm text-green-300 font-medium">
                                Perfect! You've understood the core principle. Other tabs are now unlocked.
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}
