import React, { useState, useEffect, useMemo } from 'react'
import { RotateCcw, Play, Pause, Zap } from 'lucide-react'
import { motion } from 'framer-motion'
import { runTwoPointers } from './TwoPointerEngine/core/twoPointerCore'
import TwoPointerCanvas from './TwoPointerEngine/visual/TwoPointerCanvas'
import CodePanel from '../code/CodePanel'

interface Props {
    moduleId: string
    mode?: string | null
}

const TwoPointerEngine: React.FC<Props> = ({ mode: initialMode }) => {
    const mode = initialMode || 'opposite_direction'
    const [array, setArray] = useState<number[]>([])
    const [target, setTarget] = useState(0)

    // Generate data based on mode
    useEffect(() => {
        if (mode === 'opposite_direction') {
            // Sorted Array for Two Sum
            const arr = Array.from({ length: 10 }, () => Math.floor(Math.random() * 30)).sort((a, b) => a - b)
            // Ensure nice unique values for clarity
            const uniqueSorted = Array.from(new Set(arr)).slice(0, 8)
            setArray(uniqueSorted)

            // Pick valid target
            if (uniqueSorted.length > 1) {
                setTarget(uniqueSorted[0] + uniqueSorted[uniqueSorted.length - 1])
            }
        } else if (mode === 'same_direction') {
            // Random with zeroes
            setArray(Array.from({ length: 10 }, () => Math.random() > 0.6 ? 0 : Math.floor(Math.random() * 9) + 1))
        } else if (mode === 'fast_slow') {
            // Circular Array (indices 0..5)
            setArray([0, 1, 2, 3, 4, 5])
        } else if (mode === 'partition') {
            // Random for QuickSort Partition
            setArray(Array.from({ length: 10 }, () => Math.floor(Math.random() * 50) + 1))
        }
    }, [mode])

    const [currentIndex, setCurrentIndex] = useState(0)
    const [isPlaying, setIsPlaying] = useState(false)
    const [speed, setSpeed] = useState(1000)

    const states = useMemo(() => {
        if (array.length === 0) return []
        return runTwoPointers(array, mode, target)
    }, [array, mode, target])

    const currentState = states[currentIndex] || states[0]
    const explanation = currentState?.explanation || "Ready to simulate..."

    useEffect(() => {
        let interval: any;
        if (isPlaying) {
            interval = setInterval(() => {
                setCurrentIndex((prev) => {
                    if (prev < states.length - 1) return prev + 1
                    setIsPlaying(false)
                    return prev
                })
            }, speed)
        }
        return () => clearInterval(interval)
    }, [isPlaying, states.length, speed])

    const handleReset = () => {
        setIsPlaying(false)
        setCurrentIndex(0)
        // Re-trigger effect to generate new array by slightly changing a dummy state if needed, 
        // but for now simpler reset just resets index. 
        //Ideally we'd have a generation key. Since array is in state, we can just re-run the useful part of useEffect by extracting it. 
        // For simplicity, we just reset the index to 0 for replay.
    }

    if (!currentState) return <div className="p-8 text-white/50">Initializing Engine...</div>

    return (
        <div className="flex h-full w-full bg-background rounded-3xl overflow-hidden">
            <div className="flex-1 flex flex-col h-full relative">
                <div className="flex-1 relative min-h-[400px]">
                    <TwoPointerCanvas state={currentState} mode={mode} />
                </div>

                {/* Controls */}
                <div className="h-20 bg-white/5 border-t border-white/5 flex items-center justify-between px-8 backdrop-blur-sm">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setCurrentIndex(0)}
                            className="p-3 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                        >
                            <RotateCcw size={18} />
                        </button>
                        <button
                            onClick={() => setIsPlaying(!isPlaying)}
                            className={`px-6 py-3 rounded-xl font-bold uppercase tracking-wider text-xs flex items-center gap-2 transition-all ${isPlaying
                                ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                                : 'bg-accent-blue text-black shadow-glow-blue hover:scale-105'
                                }`}
                        >
                            {isPlaying ? <><Pause size={16} /> Pause</> : <><Play size={16} /> Auto Play</>}
                        </button>
                    </div>

                    {/* Scrubber */}
                    <div className="flex-1 mx-8">
                        <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-accent-blue"
                                animate={{ width: `${((currentIndex + 1) / states.length) * 100}%` }}
                            />
                        </div>
                        <div className="flex justify-between mt-2 text-[10px] font-mono text-white/30">
                            <span>Step {currentIndex + 1}</span>
                            <span>Total {states.length}</span>
                        </div>
                    </div>

                    {/* Speed */}
                    <div className="flex items-center gap-4 bg-white/5 px-4 py-2 rounded-xl border border-white/5">
                        <Zap size={14} className={speed < 500 ? "text-yellow-400" : "text-white/40"} />
                        <input
                            type="range"
                            min="100"
                            max="2000"
                            step="100"
                            value={2100 - speed}
                            onChange={(e) => setSpeed(2100 - parseInt(e.target.value))}
                            className="w-24 accent-accent-blue cursor-pointer"
                        />
                    </div>

                    {/* Presets */}
                    <div className="flex flex-col gap-1 ml-4 border-l border-white/5 pl-4">
                        <span className="text-[8px] font-bold text-white/20 uppercase tracking-widest">Presets</span>
                        <div className="flex gap-1">
                            <button onClick={() => { setArray([2, 7, 11, 15, 18, 22]); handleReset() }} className="text-[10px] px-2 py-1 bg-white/5 hover:bg-white/10 rounded text-white/60">Std</button>
                            <button onClick={() => { setArray([0]); handleReset() }} className="text-[10px] px-2 py-1 bg-red-500/10 hover:bg-red-500/20 rounded text-red-400 font-bold">1</button>
                            <button onClick={() => { setArray([5, 5, 5, 5]); handleReset() }} className="text-[10px] px-2 py-1 bg-white/5 hover:bg-white/10 rounded text-white/60">Dup</button>
                        </div>
                    </div>
                </div>

                {/* Explanation Panel */}
                <div className="flex-1 max-w-2xl px-8 py-4">
                    <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-center min-h-[60px]">
                        <p className="text-sm font-medium text-center text-white/80 transition-colors">
                            {explanation}
                        </p>
                    </div>
                </div>
            </div>
            <CodePanel mode={mode} />
        </div>
    )
}

export default TwoPointerEngine
