import React, { useState, useMemo, useEffect } from 'react'
import { Play, RotateCcw, SkipForward, SkipBack } from 'lucide-react'
import { runSlidingWindow } from './SlidingWindowEngine/core/slidingWindowCore'
import SlidingWindowCanvas from './SlidingWindowEngine/visual/SlidingWindowCanvas'

interface Props {
    moduleId: string
    mode?: string | null
    edgeCase?: string
}

const SlidingWindowEngine: React.FC<Props> = ({ mode: initialMode, edgeCase }) => {
    // Default to fixed_window if mode is not specified
    const mode = initialMode || 'fixed_window'

    // Generate array with duplicates for distinct mode, or standard random for others
    const [array, setArray] = useState<number[]>([])

    useEffect(() => {
        // Handle Edge Cases
        if (edgeCase === 'Empty Input') {
            setArray([])
            return
        }
        if (edgeCase === 'Window > Array') {
            setArray([1, 2, 3]) // Size 3, but K will be 4 in useMemo logic? Need to verify K.
            return
        }
        if (edgeCase === 'Negative numbers') {
            setArray([5, -2, 3, -1, 4, -5, 2])
            return
        }

        // Generate new array when mode changes (Standard Cases)
        const size = 12
        if (mode === 'at_most_k' || mode === 'exact_k') {
            // For distinct elements, we need limited range [1..5] to ensure duplicates
            setArray(Array.from({ length: size }, () => Math.floor(Math.random() * 5) + 1))
        } else {
            // For sum problems
            setArray(Array.from({ length: size }, () => Math.floor(Math.random() * 20) + 1))
        }
    }, [mode, edgeCase])

    const [currentIndex, setCurrentIndex] = useState(0)
    const [isPlaying, setIsPlaying] = useState(false)

    // Run core logic - pass K/Target based on mode
    const states = useMemo(() => {
        if (array.length === 0) return []
        let k = 3
        if (mode === 'variable_window') k = 15 // Target sum
        if (mode === 'at_most_k' || mode === 'exact_k') k = 3 // Max distinct
        if (mode === 'fixed_window') k = 4 // Window size

        return runSlidingWindow(array, mode, k)
    }, [array, mode])

    const currentState = states[currentIndex] || states[0]

    useEffect(() => {
        let interval: any;
        if (isPlaying) {
            interval = setInterval(() => {
                setCurrentIndex((prev) => {
                    if (prev < states.length - 1) return prev + 1
                    setIsPlaying(false)
                    return prev
                })
            }, 500) // Faster default speed
        }
        return () => clearInterval(interval)
    }, [isPlaying, states.length])

    const reset = () => {
        setCurrentIndex(0)
        setIsPlaying(false)
    }

    return (
        <div className="w-full h-full flex flex-col bg-background overflow-hidden rounded-[40px]">
            <div className="flex-1">
                <SlidingWindowCanvas
                    array={array}
                    state={currentState}
                    mode={mode}
                />
            </div>

            {/* Controls Bar */}
            <div className="h-24 bg-black/40 border-t border-white/5 px-8 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${isPlaying ? 'bg-white/10 text-white' : 'bg-white text-black'}`}
                    >
                        <Play size={20} fill={!isPlaying ? 'black' : 'none'} className={isPlaying ? '' : 'ml-1'} />
                    </button>
                    <button
                        onClick={reset}
                        className="w-10 h-10 rounded-full bg-white/5 text-white/60 flex items-center justify-center hover:bg-white/10 transition-colors"
                    >
                        <RotateCcw size={18} />
                    </button>
                </div>

                <div className="flex items-center gap-6">
                    <button
                        disabled={currentIndex === 0}
                        onClick={() => setCurrentIndex(c => Math.max(0, c - 1))}
                        className="p-3 rounded-xl bg-white/5 text-white/40 disabled:opacity-20 hover:text-white transition-colors"
                    >
                        <SkipBack size={18} />
                    </button>
                    <div className="flex flex-col items-center min-w-[80px]">
                        <span className="text-2xl font-bold font-mono text-white tracking-widest">{currentIndex}</span>
                        <span className="text-[10px] uppercase font-bold text-white/20 tracking-[0.2em]">Step</span>
                    </div>
                    <button
                        disabled={currentIndex === states.length - 1}
                        onClick={() => setCurrentIndex(c => Math.min(states.length - 1, c + 1))}
                        className="p-3 rounded-xl bg-white/5 text-white/40 disabled:opacity-20 hover:text-white transition-colors"
                    >
                        <SkipForward size={18} />
                    </button>
                </div>

                {/* Case Presets */}
                <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest mr-2 hidden lg:inline">Cases</span>
                    <button
                        onClick={() => {
                            setArray(Array.from({ length: 12 }, () => Math.floor(Math.random() * 20) + 1))
                            reset()
                        }}
                        className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[10px] font-bold uppercase text-white/60 hover:text-white transition-colors"
                    >
                        Random
                    </button>
                    <button
                        onClick={() => {
                            setArray([]) // Empty
                            reset()
                        }}
                        className="px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-[10px] font-bold uppercase text-red-400 transition-colors"
                    >
                        Empty
                    </button>
                    <button
                        onClick={() => {
                            setArray([42]) // Single
                            reset()
                        }}
                        className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[10px] font-bold uppercase text-white/60 hover:text-white transition-colors"
                    >
                        Single
                    </button>
                </div>

                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-accent-blue/10 border border-accent-blue/20">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent-blue animate-pulse" />
                    <span className="text-[10px] font-bold text-accent-blue uppercase tracking-widest">Invariant Monitor</span>
                </div>
            </div>
        </div>
    )
}

export default SlidingWindowEngine
