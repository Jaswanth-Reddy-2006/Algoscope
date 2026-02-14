import { useState, useEffect, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {

    ArrowRight,
    CheckCircle2,
    XCircle,
    Target,
    Activity,
    RotateCcw
} from 'lucide-react'
import { useStore } from '../store/useStore'
import masteryDrills from '../data/mastery_drills.json'

interface Drill {
    id: string
    type: 'signal_recognition' | 'invariant_identification' | 'mistake_detection'
    scenario: string
    question: string
    options: string[]
    correctAnswer: string
    explanation: string
    codeSnippet?: string
}

const PatternMastery = () => {
    const { pattern } = useParams<{ pattern: string }>()
    const navigate = useNavigate()
    const problems = useStore(state => state.problems)
    const patternStats = useStore(state => state.patternStats)
    const updatePatternMastery = useStore(state => state.updatePatternMastery)

    const [drills, setDrills] = useState<Drill[]>([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const [score, setScore] = useState(0)
    const [selectedOption, setSelectedOption] = useState<string | null>(null)
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
    const [sessionComplete, setSessionComplete] = useState(false)
    const [animating, setAnimating] = useState(false)

    // Load Drills on Mount
    useEffect(() => {
        if (pattern && masteryDrills[pattern as keyof typeof masteryDrills]) {
            // Shuffle and pick 5
            const allDrills = masteryDrills[pattern as keyof typeof masteryDrills] as Drill[]
            const shuffled = [...allDrills].sort(() => 0.5 - Math.random())
            setDrills(shuffled.slice(0, 5))
        }
    }, [pattern])

    // Get current confidence for header
    const currentConfidence = useMemo(() => {
        // Average confidence of problems with this pattern type
        const relevantProblems = problems.filter(p => p.algorithmType === pattern)
        if (!relevantProblems.length) return 0

        const total = relevantProblems.reduce((acc, p) => {
            const stats = patternStats[p.slug]
            return acc + (stats?.confidence || 0)
        }, 0)
        return Math.round(total / relevantProblems.length)
    }, [pattern, problems, patternStats])

    const handleAnswer = (option: string) => {
        if (selectedOption || animating) return
        setSelectedOption(option)
        const correct = option === drills[currentIndex].correctAnswer
        setIsCorrect(correct)
        if (correct) {
            setScore(prev => prev + 1)
        }
    }

    const nextDrill = () => {
        setAnimating(true)
        setTimeout(() => {
            if (currentIndex < drills.length - 1) {
                setCurrentIndex(prev => prev + 1)
                setSelectedOption(null)
                setIsCorrect(null)
                setAnimating(false)
            } else {
                setSessionComplete(true)
                // Update Global Stats
                // Update Global Stats
                // Wait, score is already updated if correct. 
                // But this runs *after* the render where score was updated? 
                // Let's rely on the updated score state in a separate effect or just calc it here properly.
                // Actually, score update is async. Best to calc final score here.

                // Ah, nextDrill is called manually by user. So score state IS updated.
                // updatePatternMastery(pattern!, (score / drills.length) * 100)
                setAnimating(false)
            }
        }, 300)
    }

    // Effect to handle session completion stats update
    useEffect(() => {
        if (sessionComplete && pattern) {
            updatePatternMastery(pattern, (score / drills.length) * 100)
        }
    }, [sessionComplete, pattern, score, drills.length, updatePatternMastery])


    if (!pattern || drills.length === 0) {
        return (
            <div className="flex-1 flex items-center justify-center mesh-bg font-outfit">
                <div className="text-center">
                    <h2 className="text-xl font-bold text-white mb-2">No Drills Found</h2>
                    <p className="text-white/40 mb-6">Drill modules for {(pattern || 'this pattern').replace('_', ' ')} are being synchronized. Focus on foundation problems to build base mastery.</p>
                    <button
                        onClick={() => navigate('/pattern-profile')}
                        className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-white font-bold transition-colors"
                    >
                        Return to Profile
                    </button>
                </div>
            </div>
        )
    }

    const currentDrill = drills[currentIndex]
    const progress = ((currentIndex) / drills.length) * 100

    if (sessionComplete) {
        return (
            <div className="flex-1 flex items-center justify-center mesh-bg font-outfit p-8">
                <div className="w-full max-w-md">
                    <div className="glass-card p-8 rounded-3xl border border-white/10 text-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-accent-blue via-accent-purple to-accent-blue animate-pulse" />

                        <div className="w-20 h-20 rounded-full bg-accent-blue/10 flex items-center justify-center mx-auto mb-6 border border-accent-blue/20 shadow-glow-blue">
                            <Target size={40} className="text-accent-blue" />
                        </div>

                        <h2 className="text-3xl font-bold text-white mb-2">Session Complete</h2>
                        <p className="text-white/40 mb-8">Pattern calibration updated.</p>

                        <div className="flex items-center justify-center gap-12 mb-8">
                            <div className="text-center">
                                <span className="block text-4xl font-mono font-bold text-white mb-1">{score}/{drills.length}</span>
                                <span className="text-[10px] uppercase tracking-widest text-white/30">Score</span>
                            </div>
                            <div className="text-center">
                                <span className={`block text-4xl font-mono font-bold mb-1 ${score / drills.length >= 0.7 ? 'text-green-400' : 'text-amber-400'}`}>
                                    {score / drills.length >= 0.7 ? '+5%' : score / drills.length < 0.4 ? '-2%' : '0%'}
                                </span>
                                <span className="text-[10px] uppercase tracking-widest text-white/30">Confidence</span>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3">
                            <button
                                onClick={() => window.location.reload()}
                                className="w-full py-4 bg-white/5 hover:bg-white/10 rounded-xl text-white font-bold tracking-wide flex items-center justify-center gap-2 transition-all border border-white/5"
                            >
                                <RotateCcw size={18} />
                                Restart Session
                            </button>
                            <button
                                onClick={() => navigate('/pattern-profile')}
                                className="w-full py-4 bg-accent-blue hover:bg-accent-blue/90 rounded-xl text-black font-bold tracking-wide transition-all shadow-glow-blue"
                            >
                                Return to Dashboard
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="flex-1 flex flex-col min-w-0 bg-background font-outfit relative overflow-hidden">
            {/* Minimal Header */}
            <div className="h-20 px-8 flex items-center justify-between border-b border-white/5 z-10 bg-background/50 backdrop-blur-md">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/pattern-profile')}
                        className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                    >
                        <ArrowRight className="rotate-180 text-white/40" size={20} />
                    </button>
                    <div>
                        <h1 className="text-lg font-bold text-white capitalize tracking-wide">{pattern?.replace('_', ' ')} <span className="text-accent-blue">Mastery</span></h1>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    {/* Level Badge */}
                    <div className={`px-3 py-1.5 rounded-lg border ${currentConfidence >= 90 ? 'bg-purple-500/10 border-purple-500/20 text-purple-400' :
                        currentConfidence >= 70 ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' :
                            currentConfidence >= 40 ? 'bg-green-500/10 border-green-500/20 text-green-400' :
                                'bg-white/5 border-white/10 text-white/40'
                        }`}>
                        <span className="text-xs font-bold uppercase tracking-wider">
                            {currentConfidence >= 90 ? 'Strategist' :
                                currentConfidence >= 70 ? 'Architect' :
                                    currentConfidence >= 40 ? 'Practitioner' :
                                        'Initiate'}
                        </span>
                    </div>

                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/5">
                        <Activity size={14} className="text-accent-blue" />
                        <span className="text-xs font-mono font-bold text-white">{currentConfidence}% Confidence</span>
                    </div>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-1 bg-white/5">
                <motion.div
                    animate={{ width: `${progress}%` }}
                    className="h-full bg-accent-blue shadow-glow-blue"
                />
            </div>

            {/* Drill Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-12 flex items-center justify-center">
                <div className="max-w-3xl w-full">
                    <AnimatePresence mode='wait'>
                        <motion.div
                            key={currentIndex}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-8"
                        >
                            {/* Scenario Card */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <span className="px-3 py-1 rounded text-[10px] font-bold uppercase tracking-widest bg-accent-purple/20 text-accent-purple border border-accent-purple/20">
                                        {currentDrill.type.replace('_', ' ')}
                                    </span>
                                    <span className="text-xs font-mono text-white/30">Drill {currentIndex + 1}/{drills.length}</span>
                                </div>
                                <h2 className="text-3xl font-bold text-white leading-tight">
                                    {currentDrill.question}
                                </h2>
                                <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/5 text-lg font-light leading-relaxed text-white/80">
                                    {currentDrill.scenario}
                                </div>
                                {currentDrill.codeSnippet && (
                                    <div className="p-6 rounded-2xl bg-black/40 border border-white/5 font-mono text-sm text-white/70 whitespace-pre overflow-x-auto">
                                        {currentDrill.codeSnippet}
                                    </div>
                                )}
                            </div>

                            {/* Options Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {currentDrill.options.map((option, idx) => {
                                    const isSelected = selectedOption === option
                                    const isCorrectOption = option === currentDrill.correctAnswer

                                    let stateStyles = "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
                                    if (selectedOption) {
                                        if (isSelected) {
                                            stateStyles = isCorrect
                                                ? "bg-green-500/20 border-green-500/50 text-white"
                                                : "bg-red-500/20 border-red-500/50 text-white"
                                        } else if (isCorrectOption) {
                                            stateStyles = "bg-green-500/10 border-green-500/30 text-green-200"
                                        } else {
                                            stateStyles = "opacity-40 grayscale"
                                        }
                                    }

                                    return (
                                        <button
                                            key={idx}
                                            onClick={() => handleAnswer(option)}
                                            disabled={!!selectedOption}
                                            className={`p-6 rounded-xl border text-left transition-all duration-300 relative group ${stateStyles}`}
                                        >
                                            <div className="flex items-start gap-4">
                                                <div className={`w-6 h-6 rounded-full border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${isSelected ? (isCorrect ? 'border-green-500 bg-green-500' : 'border-red-500 bg-red-500') : 'border-white/20 group-hover:border-white/40'}`}>
                                                    {isSelected && (isCorrect ? <CheckCircle2 size={14} className="text-black" /> : <XCircle size={14} className="text-black" />)}
                                                </div>
                                                <span className="text-base font-medium">{option}</span>
                                            </div>
                                        </button>
                                    )
                                })}
                            </div>

                            {/* Feedback & Continue */}
                            {selectedOption && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`p-6 rounded-2xl border ${isCorrect ? 'bg-green-500/10 border-green-500/20' : 'bg-red-500/10 border-red-500/20'}`}
                                >
                                    <div className="flex items-center gap-3 mb-2">
                                        {isCorrect ? <CheckCircle2 className="text-green-500" /> : <XCircle className="text-amber-500" />}
                                        <span className={`font-bold uppercase tracking-widest text-sm ${isCorrect ? 'text-green-500' : 'text-amber-500'}`}>
                                            {isCorrect ? 'Pattern Recognized' : 'Calibration Needed'}
                                        </span>
                                    </div>
                                    <p className="text-white/80 leading-relaxed mb-6">
                                        {currentDrill.explanation}
                                    </p>
                                    <button
                                        onClick={nextDrill}
                                        className="px-8 py-3 bg-white text-black font-bold rounded-xl hover:shadow-glow hover:scale-105 transition-all text-sm uppercase tracking-wide"
                                    >
                                        {currentIndex === drills.length - 1 ? 'Complete Session' : 'Next Drill'}
                                    </button>
                                </motion.div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    )
}

export default PatternMastery
