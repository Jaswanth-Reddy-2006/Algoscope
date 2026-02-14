import React, { useState, useMemo, useEffect } from 'react'
import { StandardVisualizationLayout } from '../shared/StandardVisualizationLayout'
import { runBinarySearch } from './core/binarySearchCore'
import { runLinearSearch } from './core/linearSearchCore'
import BinarySearchCanvas from './visual/BinarySearchCanvas'
import { LinearSearchCanvas } from './visual/LinearSearchCanvas'
import { BinarySearchInputPanel } from './visual/BinarySearchInputPanel'
import { ComparisonStats } from '../../MentalModelEngine/comparisonStats'

interface Props {
    mode: string // standard, lower_bound, upper_bound
}

export const BinarySearchComparison: React.FC<Props> = ({ mode }) => {
    // 1. Comparison State
    const [array, setArray] = useState<number[]>([])
    const [target, setTarget] = useState(0)
    const [currentStep, setCurrentStep] = useState(0)
    const [isPlaying, setIsPlaying] = useState(false)
    const [speed, setSpeed] = useState(1)

    // 2. Initialize Data
    useEffect(() => {
        const generate = () => {
            // Generate sorted array
            const arr = Array.from({ length: 15 }, () => Math.floor(Math.random() * 50)).sort((a, b) => a - b)
            setArray(arr)
            // Pick target
            const exists = Math.random() > 0.3
            setTarget(exists ? arr[Math.floor(Math.random() * arr.length)] : Math.floor(Math.random() * 50))
        }
        generate()
    }, [mode])

    // 3. Compute States
    const bruteForceStates = useMemo(() =>
        runLinearSearch(array, target),
        [array, target])

    const optimalStates = useMemo(() =>
        runBinarySearch(array, mode, target),
        [array, mode, target])

    const maxSteps = Math.max(bruteForceStates.length, optimalStates.length)

    const stats: ComparisonStats = {
        bruteForceOps: bruteForceStates.length,
        optimalOps: optimalStates.length,
        bruteForceSteps: bruteForceStates.length,
        optimalSteps: optimalStates.length,
        savedOps: bruteForceStates.length - optimalStates.length,
        efficiencyGain: Math.round(((bruteForceStates.length - optimalStates.length) / Math.max(1, bruteForceStates.length)) * 100),
        timeSaved: Math.round(((bruteForceStates.length - optimalStates.length) / Math.max(1, bruteForceStates.length)) * 100),
        numWindows: 0
    }

    // 4. Animation Loop
    useEffect(() => {
        if (!isPlaying) return
        if (currentStep >= maxSteps - 1) {
            setIsPlaying(false)
            return
        }
        const timer = setTimeout(() => {
            setCurrentStep(prev => prev + 1)
        }, 1000 / speed)
        return () => clearTimeout(timer)
    }, [isPlaying, currentStep, maxSteps, speed])

    // 5. Handlers
    const handleArrayChange = (newArray: number[]) => {
        setArray(newArray)
        setCurrentStep(0)
        setIsPlaying(false)
    }

    const handleTargetChange = (newTarget: number) => {
        setTarget(newTarget)
        setCurrentStep(0)
        setIsPlaying(false)
    }

    const handleRandomize = (shouldExist: boolean) => {
        const arr = Array.from({ length: 15 }, () => Math.floor(Math.random() * 50)).sort((a, b) => a - b)
        let t: number
        if (shouldExist) {
            t = arr[Math.floor(Math.random() * arr.length)]
        } else {
            // Generate a value likely not in array
            do {
                t = Math.floor(Math.random() * 50)
            } while (arr.includes(t))
        }

        setArray(arr)
        setTarget(t)
        setCurrentStep(0)
        setIsPlaying(false)
    }

    return (
        <StandardVisualizationLayout
            title={mode.replace('_', ' ').toUpperCase()}

            renderInput={() => (
                <BinarySearchInputPanel
                    array={array}
                    target={target}
                    stats={stats}
                    onArrayChange={handleArrayChange}
                    onTargetChange={handleTargetChange}
                    onRandomize={handleRandomize}
                    mode={mode}
                />
            )}

            isPlaying={isPlaying}
            currentStep={currentStep}
            totalSteps={maxSteps}
            playbackSpeed={speed}

            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onReset={() => { setCurrentStep(0); setIsPlaying(false); }}
            onStepForward={() => setCurrentStep(prev => Math.min(maxSteps - 1, prev + 1))}
            onStepBack={() => setCurrentStep(prev => Math.max(0, prev - 1))}
            onSpeedChange={setSpeed}

            renderBruteForce={() => (
                <LinearSearchCanvas
                    state={bruteForceStates[Math.min(currentStep, bruteForceStates.length - 1)]}
                />
            )}

            renderOptimal={() => (
                <BinarySearchCanvas
                    state={optimalStates[Math.min(currentStep, optimalStates.length - 1)]}
                    mode={mode}
                />
            )}

            renderMetrics={() => (
                <div className="space-y-8">
                    {/* Metrics Card */}
                    <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
                        <h3 className="text-lg font-bold text-white mb-6">Performance Analysis</h3>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div className="p-4 bg-red-500/5 border border-red-500/10 rounded-xl">
                                <span className="text-xs font-bold text-red-400 uppercase tracking-widest block mb-2">Linear Search</span>
                                <span className="text-3xl font-bold text-white font-mono">{stats.bruteForceSteps || 0}</span>
                                <span className="text-xs text-white/40 block mt-1">Comparisons</span>
                            </div>
                            <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-xl">
                                <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest block mb-2">Binary Search</span>
                                <span className="text-3xl font-bold text-white font-mono">{stats.optimalSteps || 0}</span>
                                <span className="text-xs text-white/40 block mt-1">Comparisons</span>
                            </div>
                            <div className="p-4 bg-accent-blue/5 border border-accent-blue/10 rounded-xl col-span-2 flex items-center justify-between">
                                <div>
                                    <span className="text-xs font-bold text-accent-blue uppercase tracking-widest block mb-2">Efficiency Savings</span>
                                    <span className="text-3xl font-bold text-white font-mono">{stats.timeSaved || 0}%</span>
                                    <span className="text-xs text-white/40 block mt-1">Operations Saved: {(stats.bruteForceSteps || 0) - (stats.optimalSteps || 0)}</span>
                                </div>
                                <div className="h-12 w-12 rounded-full border-4 border-accent-blue/20 border-t-accent-blue flex items-center justify-center">
                                    <span className="text-[10px] font-bold text-accent-blue">{Math.round(array.length > 0 ? (Math.log2(array.length)) : 0)} L</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Core Insight Card: Halving Principle */}
                    <div className="p-8 bg-gradient-to-r from-accent-blue/10 to-transparent border border-accent-blue/20 rounded-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            {/* Tree or cutting icon */}
                            <svg width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                                <path d="M12 2L12 22M2 12H22" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-4">The Halving Principle</h3>
                        <p className="text-lg text-white/80 max-w-3xl leading-relaxed">
                            Every comparison in Binary Search eliminates <span className="text-accent-blue font-bold">50%</span> of the remaining possibilities.
                            This logarithmic behavior means that even for a billion elements, Binary Search needs only about 30 comparisons, while Linear Search might need a billion.
                        </p>
                    </div>
                </div>
            )}
        />
    )
}
