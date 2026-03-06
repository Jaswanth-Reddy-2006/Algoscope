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
    RefreshCw,
} from 'lucide-react'
import { cn } from '../utils/cn'

// Lazy loaded heavy components
const VizPanel = lazy(() => import('../components/layout/VizPanel'))
const SuccessSummary = lazy(() => import('../components/problem/SuccessSummary'))
const ComparisonSummary = lazy(() => import('../components/problem/ComparisonSummary'))
const InspectorPanel = lazy(() => import('../components/layout/InspectorPanel'))

const ProblemLab: React.FC = () => {
    const { slug } = useParams<{ slug: string }>()
    const currentProblem = useStore(state => state.currentProblem)
    const fetchProblemBySlug = useStore(state => state.fetchProblemBySlug)
    const isBruteForce = useStore(state => state.isBruteForce)
    const compareMode = useStore(state => state.compareMode)
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
    const globalTotalSteps = useStore(state => state.totalSteps)
    const [showSummary, setShowSummary] = React.useState(false)

    useEffect(() => {
        if (slug) {
            fetchProblemBySlug(slug)
            setShowSummary(false)
        }
        return () => resetState()
    }, [slug, fetchProblemBySlug, resetState])

    const steps = isBruteForce ? currentProblem?.brute_force_steps : currentProblem?.optimal_steps
    const totalSteps = globalTotalSteps > 0 ? globalTotalSteps : (steps?.length || 0)
    const isSuccess = steps && currentStepIndex === totalSteps - 1 && (steps[currentStepIndex]?.state?.found || currentProblem?.algorithmType === 'tree')

    // PLAYBACK LOGIC
    useEffect(() => {
        if (!isPlaying) return
        const interval = setInterval(() => {
            setStep(Math.min(currentStepIndex + 1, totalSteps - 1))
            if (currentStepIndex >= totalSteps - 1) {
                setPlaying(false)
            }
        }, playbackSpeed)
        return () => clearInterval(interval)
    }, [isPlaying, playbackSpeed, currentStepIndex, totalSteps, setStep, setPlaying])

    // Trigger summary on success
    useEffect(() => {
        if (isSuccess) {
            setShowSummary(true)
        }
    }, [isSuccess])

    if (error) return <Navigate to="/problems" replace />
    if (!currentProblem || !isEngineInitialized) return <LabSkeleton />

    const formattedId = String(currentProblem.id).padStart(3, '0')

    return (
        <div className="h-screen flex flex-col bg-background text-white font-outfit overflow-hidden">
            {/* 1️⃣ HEADER */}
            <header className="h-20 border-b border-white/5 flex items-center justify-between px-10 shrink-0 bg-background/50 backdrop-blur-md z-20">
                <div className="flex items-center gap-4">
                    <Link
                        to="/problems"
                        className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/20 transition-all"
                    >
                        <ChevronLeft size={20} />
                    </Link>
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-[10px] font-mono font-black text-[#EC4186] px-1.5 py-0.5 bg-[#EC4186]/10 rounded">#{formattedId}</span>
                            <h1 className="text-sm font-bold text-white uppercase tracking-tight">{currentProblem.title}</h1>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className={cn(
                                "flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[8px] font-black uppercase tracking-widest transition-all duration-300",
                                compareMode ? "bg-white/20 border-white/30 text-white shadow-[0_0_15px_rgba(255,255,255,0.2)]" :
                                    isBruteForce ? "bg-[#EE544A]/20 border-[#EE544A]/30 text-[#EE544A] shadow-[0_0_15px_rgba(238,84,74,0.2)]" :
                                        "bg-[#EC4186]/20 border-[#EC4186]/30 text-[#EC4186] shadow-[0_0_15px_rgba(236,65,134,0.2)]"
                            )}>
                                <div className={cn("w-1 h-1 rounded-full animate-pulse",
                                    compareMode ? "bg-white" :
                                        isBruteForce ? "bg-[#EE544A]" : "bg-[#EC4186]"
                                )} />
                                {compareMode ? 'Mode: Compare' : isBruteForce ? 'Mode: Brute' : 'Mode: Optimal'}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-8 bg-white/[0.03] px-6 py-2 rounded-2xl border border-white/10 hover:border-white/20 transition-all shadow-glow-sm">
                    <div className="flex items-center gap-4">
                        <button onClick={prevStep} disabled={currentStepIndex === 0} className="p-2 text-white/40 hover:text-white disabled:opacity-5 transition-all">
                            <SkipBack size={16} />
                        </button>
                        <button
                            onClick={() => setPlaying(!isPlaying)}
                            className="w-11 h-11 bg-gradient-to-br from-[#EC4186] to-[#EE544A] text-white rounded-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-[0_5px_15px_rgba(236,65,134,0.4)] border border-white/20"
                        >
                            {isPlaying ? <Pause size={18} fill="white" /> : <Play size={18} fill="white" className="ml-0.5" />}
                        </button>
                        <button onClick={nextStep} disabled={currentStepIndex === totalSteps - 1} className="p-2 text-white/40 hover:text-white disabled:opacity-5 transition-all">
                            <SkipForward size={16} />
                        </button>
                    </div>
                    <div className="h-4 w-px bg-white/10" />
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => {
                                setStep(0)
                                setPlaying(false)
                            }}
                            className="p-2 text-white/40 hover:text-white transition-all flex items-center gap-2 group"
                            title="Restart Simulation"
                        >
                            <RefreshCw size={14} className="group-hover:rotate-180 transition-transform duration-500" />
                            <span className="text-[9px] font-black uppercase tracking-widest">Restart</span>
                        </button>
                    </div>
                    <div className="h-4 w-px bg-white/10" />
                    <div className="flex items-center gap-4">
                        <span className="text-[10px] font-bold text-white/40 uppercase tracking-[0.1em] min-w-[70px]">Step {currentStepIndex + 1} / {totalSteps}</span>
                        <div className="flex items-center gap-2 bg-black/40 rounded-lg p-1 border border-white/10">
                            {[2000, 1000, 500, 250].map(s => (
                                <button
                                    key={s}
                                    onClick={() => setSpeed(s)}
                                    className={cn(
                                        "px-3 py-1 rounded text-[9px] font-black transition-all uppercase tracking-tighter",
                                        playbackSpeed === s ? "bg-[#EC4186] text-white shadow-[0_0_10px_rgba(236,65,134,0.4)]" : "text-white/40 hover:text-white/60"
                                    )}
                                >
                                    {s === 2000 ? '0.25x' : s === 1000 ? '0.5x' : s === 500 ? '1x' : '2x'}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3 invisible">
                    {/* Metrics removed per user request */}
                </div>
            </header>

            {/* 🧱 GLOBAL LAYOUT (Middle Section) */}
            <div className={cn(
                "flex-1 overflow-hidden grid min-h-0",
                compareMode ? "grid-cols-[25%_55%_20%]" : "grid-cols-[30%_50%_20%]"
            )}>
                {/* 2️⃣ LEFT PANEL (Shown only in non-compare mode) */}
                <aside className="flex flex-col h-full bg-[#240b33] border-r border-white/5 overflow-y-auto custom-scrollbar shadow-2xl z-10">
                    <div className="p-8 space-y-10">
                        <ErrorBoundary>
                            <Suspense fallback={<div className="h-full flex items-center justify-center"><span className="text-white/20 animate-pulse font-black uppercase tracking-widest text-xs">Accessing Data...</span></div>}>
                                <ProblemInfo />
                            </Suspense>
                        </ErrorBoundary>

                        <div className="pt-6 border-t border-white/5">
                            <button
                                onClick={refreshSteps}
                                className="w-full py-5 bg-[#EC4186]/5 hover:bg-[#EC4186]/10 text-[#EC4186] border border-[#EC4186]/20 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all shadow-[0_5px_15px_rgba(236,65,134,0.05)] flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98]"
                            >
                                <RefreshCw size={16} className={isPlaying ? "animate-spin" : ""} />
                                Reset Simulation
                            </button>
                        </div>
                    </div>
                </aside>

                {/* 3️⃣ CENTER PANEL – VISUALIZATION CANVAS */}
                <main className={cn(
                    "flex flex-col bg-[#1b062b] relative pattern-grid overflow-hidden",
                    compareMode ? "col-span-1" : "col-span-1"
                )}>
                    <Suspense fallback={<LabSkeleton />}>
                        <ErrorBoundary>
                            <VizPanel />
                        </ErrorBoundary>
                    </Suspense>

                    {/* Full Screen Summary Overlay */}
                    <AnimatePresence>
                        {isSuccess && showSummary && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 z-50 flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm"
                            >
                                <div className="w-full max-w-2xl relative">
                                    <Suspense fallback={<div className="text-white/20 animate-pulse font-black uppercase tracking-widest text-xs text-center">Finalizing Results...</div>}>
                                        {compareMode ? (
                                            <ComparisonSummary
                                                problem={currentProblem}
                                                onReset={() => {
                                                    refreshSteps()
                                                    setShowSummary(false)
                                                }}
                                                onClose={() => setShowSummary(false)}
                                            />
                                        ) : (
                                            <SuccessSummary
                                                problem={currentProblem}
                                                step={steps[currentStepIndex]}
                                                onReset={() => {
                                                    refreshSteps()
                                                    setShowSummary(false)
                                                }}
                                                onClose={() => setShowSummary(false)}
                                            />
                                        )}
                                    </Suspense>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </main>

                {/* 4️⃣ RIGHT PANEL – STATE INSPECTOR */}
                <aside className="flex flex-col h-full bg-[#240b33] border-l border-white/5 overflow-y-auto custom-scrollbar shadow-2xl z-10">
                    <ErrorBoundary>
                        <Suspense fallback={<div className="h-full flex items-center justify-center"><span className="text-white/20 animate-pulse font-black uppercase tracking-widest text-xs">Syncing State...</span></div>}>
                            <InspectorPanel />
                        </Suspense>
                    </ErrorBoundary>
                </aside>
            </div>
        </div>
    )
}

export default ProblemLab
