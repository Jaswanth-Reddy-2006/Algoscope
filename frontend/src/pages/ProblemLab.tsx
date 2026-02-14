import React, { useEffect, Suspense, lazy } from 'react'
import { useParams, Navigate, Link } from 'react-router-dom'
import { useStore } from '../store/useStore'
import ProblemInfo from '../components/layout/ProblemInfo'
import ErrorBoundary from '../components/common/ErrorBoundary'
import LabSkeleton from '../components/layout/LabSkeleton'
import { motion, AnimatePresence } from 'framer-motion'
import {
    ChevronLeft,
    Play,
    Pause,
    SkipBack,
    SkipForward,
    RefreshCw
} from 'lucide-react'
import { cn } from '../utils/cn'

// Lazy loaded heavy components
const VizPanel = lazy(() => import('../components/layout/VizPanel'))
const SuccessSummary = lazy(() => import('../components/problem/SuccessSummary'))

const ProblemLab: React.FC = () => {
    const { slug } = useParams<{ slug: string }>()
    const currentProblem = useStore(state => state.currentProblem)
    const fetchProblemBySlug = useStore(state => state.fetchProblemBySlug)
    const isBruteForce = useStore(state => state.isBruteForce)
    const compareMode = useStore(state => state.compareMode)
    const setCompareMode = useStore(state => state.setCompareMode)
    const isPlaying = useStore(state => state.isPlaying)
    const setPlaying = useStore(state => state.setPlaying)
    const isEngineInitialized = useStore(state => state.isEngineInitialized)
    const refreshSteps = useStore(state => state.refreshSteps)
    const currentStepIndex = useStore(state => state.currentStepIndex)
    const nextStep = useStore(state => state.nextStep)
    const prevStep = useStore(state => state.prevStep)
    const setStep = useStore(state => state.setStep)
    const resetState = useStore(state => state.resetState)
    const error = useStore(state => state.error)
    const playbackSpeed = useStore(state => state.playbackSpeed)
    const setSpeed = useStore(state => state.setSpeed)
    const customInput = useStore(state => state.customInput)
    const customTarget = useStore(state => state.customTarget)
    const setCustomInput = useStore(state => state.setCustomInput)
    const setCustomTarget = useStore(state => state.setCustomTarget)
    const toggleApproach = useStore(state => state.toggleApproach)

    useEffect(() => {
        if (slug) {
            fetchProblemBySlug(slug)
        }
        return () => resetState()
    }, [slug, fetchProblemBySlug, resetState])

    const steps = isBruteForce ? currentProblem?.brute_force_steps : currentProblem?.optimal_steps
    const totalSteps = steps?.length || 0

    // PLAYBACK LOGIC (PART 2 SECTION E)
    useEffect(() => {
        if (!isPlaying) return
        const interval = setInterval(() => {
            setStep(Math.min(currentStepIndex + 1, totalSteps - 1))
            if (currentStepIndex >= totalSteps - 1) {
                setPlaying(false)
            }
        }, 1000 / (playbackSpeed / 500)) // Scaled to speed options
        return () => clearInterval(interval)
    }, [isPlaying, playbackSpeed, currentStepIndex, totalSteps, setStep, setPlaying])

    if (error) return <Navigate to="/404" replace />
    if (!currentProblem || !isEngineInitialized) return <LabSkeleton />

    const isSuccess = steps && currentStepIndex === steps.length - 1 && steps[currentStepIndex]?.state?.found
    const formattedId = String(currentProblem.id).padStart(2, '0')

    return (
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative font-outfit bg-background text-white">
            {/* Header with Title & Navigation */}
            <div className="h-16 px-8 flex items-center justify-between border-b border-white/5 bg-background/50 backdrop-blur-md z-10 shrink-0">
                <div className="flex items-center gap-5">
                    <Link to="/problems" className="p-2.5 rounded-xl bg-white/5 text-white/40 hover:text-white hover:bg-white/10 transition-all">
                        <ChevronLeft size={20} />
                    </Link>
                    <span className="text-accent-blue font-mono font-bold text-lg bg-accent-blue/5 px-2 py-1 rounded-lg border border-accent-blue/10">#{formattedId}</span>
                    <h1 className="text-sm font-bold tracking-tight text-white/90 truncate max-w-[200px] uppercase tracking-widest">{currentProblem.title}</h1>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">{currentProblem.algorithmType.replace('_', ' ')} Pattern</span>
                </div>
            </div>

            {/* Main Lab Layout - 2 Columns (Part 2) */}
            <div className="flex-1 overflow-hidden flex">

                {/* COLUMN 1: Left Panel (Section A, B, C) */}
                <aside className="w-[400px] border-r border-white/5 flex flex-col h-full bg-white/[0.01] overflow-y-auto custom-scrollbar">
                    <div className="p-8 space-y-10">
                        {/* SECTION A: Problem Overview */}
                        <ErrorBoundary>
                            <ProblemInfo />
                        </ErrorBoundary>

                        {/* SECTION B: Strategy Selector */}
                        <div className="space-y-4">
                            <h3 className="text-[10px] uppercase tracking-widest text-white/40 font-bold font-mono">Strategy Selector</h3>
                            <div className="grid grid-cols-3 gap-2">
                                <button
                                    onClick={() => { setCompareMode(false); if (!isBruteForce) toggleApproach(); }}
                                    className={cn(
                                        "py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest border transition-all",
                                        isBruteForce && !compareMode ? "bg-red-500/10 text-red-400 border-red-500/20 shadow-glow-sm" : "bg-white/5 text-white/30 border-white/5 hover:text-white"
                                    )}
                                >
                                    Brute
                                </button>
                                <button
                                    onClick={() => { setCompareMode(false); if (isBruteForce) toggleApproach(); }}
                                    className={cn(
                                        "py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest border transition-all",
                                        !isBruteForce && !compareMode ? "bg-accent-blue/10 text-accent-blue border-accent-blue/20 shadow-glow-sm" : "bg-white/5 text-white/30 border-white/5 hover:text-white"
                                    )}
                                >
                                    Optimal
                                </button>
                                <button
                                    onClick={() => setCompareMode(true)}
                                    className={cn(
                                        "py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest border transition-all",
                                        compareMode ? "bg-purple-500/10 text-purple-400 border-purple-500/20 shadow-glow-sm" : "bg-white/5 text-white/30 border-white/5 hover:text-white"
                                    )}
                                >
                                    Compare
                                </button>
                            </div>
                        </div>

                        {/* SECTION C: Interactive Input */}
                        <div className="space-y-4 pt-4 border-t border-white/5">
                            <h3 className="text-[10px] uppercase tracking-widest text-white/40 font-bold font-mono">Simulation Parameters</h3>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[9px] font-bold text-white/20 uppercase tracking-widest pl-1">Input Array</label>
                                    <input
                                        type="text"
                                        value={customInput}
                                        onChange={(e) => setCustomInput(e.target.value)}
                                        className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-xs font-mono text-white/80 focus:border-accent-blue/30 outline-none transition-all shadow-inner"
                                    />
                                </div>
                                {currentProblem.id === 1 && (
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-bold text-white/20 uppercase tracking-widest pl-1">Target Value</label>
                                        <input
                                            type="text"
                                            value={customTarget}
                                            onChange={(e) => setCustomTarget(e.target.value)}
                                            className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-xs font-mono text-white/80 focus:border-accent-blue/30 outline-none transition-all shadow-inner"
                                        />
                                    </div>
                                )}
                                <button
                                    onClick={refreshSteps}
                                    className="w-full py-4 bg-accent-blue/10 hover:bg-accent-blue/20 text-accent-blue border border-accent-blue/20 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all shadow-glow-sm flex items-center justify-center gap-2"
                                >
                                    <RefreshCw size={14} className={isPlaying ? "animate-spin" : ""} />
                                    Run Visualization
                                </button>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* COLUMN 2: Right Panel (Section D, E) */}
                <main className="flex-1 flex flex-col bg-black/20 relative">
                    {/* SECTION D: Visualization Engine */}
                    <div className="flex-1 relative overflow-hidden flex flex-col">
                        <Suspense fallback={<LabSkeleton />}>
                            <ErrorBoundary>
                                <VizPanel />
                            </ErrorBoundary>
                        </Suspense>

                        <AnimatePresence>
                            {isSuccess && (
                                <Suspense fallback={null}>
                                    <div className="absolute inset-0 z-50 flex items-center justify-center p-8 bg-black/60 backdrop-blur-sm">
                                        <div className="max-w-md w-full">
                                            <SuccessSummary
                                                problem={currentProblem}
                                                step={steps[currentStepIndex]}
                                                onReset={refreshSteps}
                                            />
                                        </div>
                                    </div>
                                </Suspense>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* SECTION E: Playback Controls (Shifted below Visualization) */}
                    <div className="h-24 border-t border-white/5 bg-background flex items-center justify-between px-10 shrink-0">
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2 bg-white/5 p-1 rounded-xl border border-white/10">
                                <button onClick={prevStep} disabled={currentStepIndex === 0} className="p-2.5 text-white/30 hover:text-white disabled:opacity-5 transition-all">
                                    <SkipBack size={18} />
                                </button>
                                <button
                                    onClick={() => setPlaying(!isPlaying)}
                                    className="w-11 h-11 bg-accent-blue text-black rounded-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-glow"
                                >
                                    {isPlaying ? <Pause size={18} fill="black" /> : <Play size={18} fill="black" className="ml-0.5" />}
                                </button>
                                <button onClick={nextStep} disabled={currentStepIndex === totalSteps - 1} className="p-2.5 text-white/30 hover:text-white disabled:opacity-5 transition-all">
                                    <SkipForward size={18} />
                                </button>
                            </div>

                            <div className="flex flex-col gap-2">
                                <div className="flex items-center justify-between px-1">
                                    <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest">Step {currentStepIndex + 1} / {totalSteps}</span>
                                </div>
                                <div className="relative w-64 h-2 flex items-center">
                                    <div className="absolute w-full h-1 bg-white/5 rounded-full" />
                                    <motion.div
                                        className="absolute h-1 bg-accent-blue rounded-full shadow-glow"
                                        style={{ width: `${(currentStepIndex / (totalSteps - 1 || 1)) * 100}%` }}
                                    />
                                    <input
                                        type="range"
                                        min="0"
                                        max={totalSteps - 1}
                                        value={currentStepIndex}
                                        onChange={(e) => setStep(parseInt(e.target.value))}
                                        className="absolute w-full h-6 opacity-0 cursor-pointer z-10"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 bg-white/5 px-6 py-3 rounded-xl border border-white/10">
                            <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest">Speed</span>
                            <select
                                value={playbackSpeed}
                                onChange={(e) => setSpeed(parseInt(e.target.value))}
                                className="bg-transparent text-[11px] font-mono font-bold text-accent-blue focus:outline-none cursor-pointer"
                            >
                                <option value="800">0.5x</option>
                                <option value="500">1.0x</option>
                                <option value="250">2.0x</option>
                                <option value="120">3.0x</option>
                            </select>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}

export default ProblemLab
