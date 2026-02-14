import React, { useState, useEffect, useRef } from 'react'
import { VisualizerType } from '../../types/foundation'
import { foundationEngineRegistry } from './engineRegistry'
import { PatternHypothesisOverlay } from './PatternHypothesisOverlay'
import { Play, Pause, RotateCcw, SkipBack, SkipForward } from 'lucide-react'
import { useStore } from '../../store/useStore'

interface Props {
    type: VisualizerType
    moduleId: string
    mode?: string | null
    edgeCase?: string | null
    onInteract?: () => void
}

const FoundationVisualizer: React.FC<Props> = ({ type, moduleId, mode, edgeCase, onInteract }) => {
    const EngineOrComponent = foundationEngineRegistry[moduleId] || foundationEngineRegistry[type]

    // Pattern Mastery Check (Smart Skip)
    const patternStats = useStore(state => state.patternStats)
    const stats = patternStats[moduleId]
    const isMastered = (stats?.confidence || 0) >= 80

    // Patterns that require hypothesis verification
    const REQUIRES_HYPOTHESIS = ['sliding_window', 'two_pointer', 'binary_search']
    const shouldVerify = REQUIRES_HYPOTHESIS.includes(moduleId) && !isMastered

    const [isVerified, setIsVerified] = React.useState(!shouldVerify)

    // Reset verification when switching modules
    useEffect(() => {
        setIsVerified(!shouldVerify)
    }, [moduleId, shouldVerify])

    // Universal Engine State
    const [input, setInput] = useState<any>(null)
    const [steps, setSteps] = useState<any[]>([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isPlaying, setIsPlaying] = useState(false)
    const [speed, setSpeed] = useState(1) // 1x speed
    const timerRef = useRef<number | null>(null)

    const isLegacy = typeof EngineOrComponent === 'function'

    useEffect(() => {
        setIsVerified(!shouldVerify)
    }, [moduleId, shouldVerify])

    // Initialize Engine
    useEffect(() => {
        if (!isLegacy && EngineOrComponent) {
            const config = { mode: mode || 'fixed_window', edgeCase: edgeCase || undefined }
            const newInput = EngineOrComponent.generateInput(config)
            const newSteps = EngineOrComponent.generateSteps(newInput, config)

            setInput(newInput)
            setSteps(newSteps)
            setCurrentIndex(0)
            setIsPlaying(false)
        }
    }, [moduleId, mode, edgeCase, EngineOrComponent, isLegacy])

    // Playback Loop
    useEffect(() => {
        if (isPlaying) {
            timerRef.current = setInterval(() => {
                setCurrentIndex(prev => {
                    if (prev >= steps.length - 1) {
                        setIsPlaying(false)
                        if (onInteract) onInteract()
                        return prev
                    }
                    return prev + 1
                })
            }, 1000 / speed)
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current)
        }
    }, [isPlaying, steps.length, speed, onInteract])

    const handlePlayPause = () => setIsPlaying(!isPlaying)
    const handleReset = () => {
        setIsPlaying(false)
        setCurrentIndex(0)
    }
    const handleStep = (direction: 'forward' | 'back') => {
        setIsPlaying(false)
        setCurrentIndex(prev => {
            if (direction === 'forward') return Math.min(prev + 1, steps.length - 1)
            return Math.max(prev - 1, 0)
        })
    }

    // Render Legacy Component
    if (isLegacy && EngineOrComponent) {
        return (
            <div className="flex-1 w-full h-full p-8 flex items-center justify-center overflow-hidden relative text-white">
                <EngineOrComponent moduleId={moduleId} mode={mode || undefined} edgeCase={edgeCase || undefined} />
            </div>
        )
    }

    // Render Universal Engine
    if (!EngineOrComponent) return (
        <div className="p-12 text-center text-white/20 font-mono italic">
            Visual Model Engine for {type} ({moduleId}) under construction...
        </div>
    )

    const Visualizer = EngineOrComponent.VisualizerComponent
    const currentState = steps[currentIndex]

    return (
        <div className="flex-1 w-full h-full p-8 flex flex-col overflow-hidden relative">
            {!isVerified && shouldVerify && (
                <PatternHypothesisOverlay
                    correctPattern={moduleId}
                    onComplete={() => {
                        setIsVerified(true)
                        if (onInteract) onInteract()
                    }}
                />
            )}

            {(isVerified || !shouldVerify) && currentState && (
                <>
                    {/* Visualizer Area */}
                    <div className="flex-1 relative rounded-3xl overflow-hidden bg-black/20 border border-white/5 shadow-inner">
                        <Visualizer
                            state={currentState}
                            config={{ mode: mode || 'fixed_window', edgeCase }}
                            input={input}
                        />
                    </div>

                    {/* Universal Controls */}
                    <div className="h-20 mt-6 flex items-center justify-between px-8 bg-[#0f1115] border border-white/5 rounded-2xl">
                        <div className="flex items-center gap-4">
                            <button onClick={handleReset} className="p-3 rounded-xl hover:bg-white/5 text-white/40 hover:text-white transition-colors">
                                <RotateCcw size={18} />
                            </button>
                            <div className="h-8 w-px bg-white/5" />
                            <button onClick={() => handleStep('back')} className="p-3 rounded-xl hover:bg-white/5 text-white/60 hover:text-white transition-colors">
                                <SkipBack size={20} />
                            </button>
                            <button
                                onClick={handlePlayPause}
                                className="w-12 h-12 flex items-center justify-center rounded-xl bg-accent-blue text-black hover:scale-105 transition-transform shadow-glow-blue"
                            >
                                {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-0.5" />}
                            </button>
                            <button onClick={() => handleStep('forward')} className="p-3 rounded-xl hover:bg-white/5 text-white/60 hover:text-white transition-colors">
                                <SkipForward size={20} />
                            </button>
                        </div>

                        {/* Scrubber / Progress */}
                        <div className="flex-1 mx-8">
                            <div className="flex justify-between text-[10px] text-white/30 font-mono uppercase tracking-widest mb-2">
                                <span>Step {currentIndex + 1} / {steps.length}</span>
                                <span>{Math.round(((currentIndex + 1) / steps.length) * 100)}% Complete</span>
                            </div>
                            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden cursor-pointer" onClick={(e) => {
                                const rect = e.currentTarget.getBoundingClientRect()
                                const x = e.clientX - rect.left
                                const pct = x / rect.width
                                setCurrentIndex(Math.floor(pct * steps.length))
                            }}>
                                <div
                                    className="h-full bg-accent-blue transition-all duration-100 ease-linear"
                                    style={{ width: `${((currentIndex + 1) / steps.length) * 100}%` }}
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="text-[10px] text-white/30 font-mono uppercase">Speed</span>
                            <div className="flex bg-white/5 rounded-lg p-1">
                                {[0.5, 1, 2].map(s => (
                                    <button
                                        key={s}
                                        onClick={() => setSpeed(s)}
                                        className={`px-2 py-1 rounded-md text-[10px] font-bold transition-all ${speed === s ? 'bg-white/10 text-white' : 'text-white/30 hover:text-white/60'}`}
                                    >
                                        {s}x
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}


export default FoundationVisualizer
