import React, { useState, useMemo, useEffect } from 'react'
import { StandardVisualizationLayout } from '../shared/StandardVisualizationLayout'
import { GenericInsightCard } from '../shared/GenericInsightCard'
import { motion } from 'framer-motion'
import { runTwoPointers } from './core/twoPointerCore'
import { generateTwoPointerBruteForce } from './core/twoPointerBruteForce'
import TwoPointerCanvas from './visual/TwoPointerCanvas'
import { TwoPointerBruteForceCanvas } from './visual/TwoPointerBruteForceCanvas'
import { RefreshCcw } from 'lucide-react'
import { ComparisonStats } from '../../MentalModelEngine/comparisonStats'

interface Props {
    mode: string
}

export const TwoPointersComparison: React.FC<Props> = ({ mode }) => {
    // 1. Comparison State
    const [array, setArray] = useState<number[]>([])
    const [target, setTarget] = useState(9)
    const [currentStep, setCurrentStep] = useState(0)
    const [isPlaying, setIsPlaying] = useState(false)
    const [speed, setSpeed] = useState(1)

    // 2. Initialize Data based on Mode
    useEffect(() => {
        if (mode === 'two_sum_sorted') {
            setArray([2, 5, 7, 8, 11, 15])
            setTarget(13)
        } else if (mode === 'container_most_water') {
            setArray([1, 8, 6, 2, 5, 4, 8, 3, 7])
        } else if (mode === 'move_zeroes') {
            setArray([0, 1, 0, 3, 12])
        } else {
            // Default randomsorted
            setArray([1, 2, 4, 6, 8, 9, 12])
        }
        setCurrentStep(0)
        setIsPlaying(false)
    }, [mode])

    // 3. Compute States
    const bruteForceStates = useMemo(() =>
        generateTwoPointerBruteForce(array, mode, target),
        [array, mode, target])

    const optimalStates = useMemo(() =>
        runTwoPointers(array, mode, target),
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


    // 5. Input Controls (Rendered in Layout)
    const renderInput = () => (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Left: Input Panel */}
            <div className="lg:col-span-3 p-6 bg-white/[0.02] rounded-2xl border border-white/5 space-y-6">
                <div>
                    <h3 className="text-lg font-bold text-white mb-4">Interactive Input Panel</h3>
                    <div className="flex flex-wrap gap-2 mb-4">
                        {array.map((v, i) => (
                            <motion.div
                                key={`${i}-${v}`}
                                layout
                                className="px-3 py-2 bg-black/40 rounded-lg text-sm text-white font-mono border border-white/10"
                            >
                                {v}
                            </motion.div>
                        ))}
                    </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    {mode === 'two_sum_sorted' && (
                        <div className="flex items-center gap-3">
                            <span className="text-xs font-bold uppercase text-white/40">Target</span>
                            <span className="px-3 py-1 bg-accent-blue/10 text-accent-blue rounded font-bold font-mono border border-accent-blue/20">
                                {target}
                            </span>
                        </div>
                    )}

                    <button
                        onClick={() => {
                            if (mode === 'container_most_water') {
                                setArray(prev => prev.map(v => Math.max(1, v + Math.floor(Math.random() * 5) - 2)))
                            } else if (mode === 'two_sum_sorted') {
                                setArray(prev => {
                                    const newArr = prev.map(v => v + Math.floor(Math.random() * 4) - 2)
                                    return newArr.sort((a, b) => a - b)
                                })
                            } else {
                                setArray(prev => prev.map(v => Math.max(0, v + Math.floor(Math.random() * 3) - 1)))
                            }
                            setCurrentStep(0)
                            setIsPlaying(false)
                        }}
                        className="ml-auto px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors flex items-center gap-2 text-sm text-white/60 hover:text-white"
                    >
                        <RefreshCcw size={14} />
                        <span>Randomize</span>
                    </button>
                </div>
            </div>

            {/* Right: Insight Card */}
            <div className="lg:col-span-2">
                <GenericInsightCard
                    title={mode === 'two_sum_sorted' ? "Why Two Pointers?" : "Why Two Pointers?"}
                    bruteForceComplexity="O(N²)"
                    optimalComplexity="O(N)"
                    keyPrinciples={[
                        "Reduce search space by moving based on condition",
                        "Avoid checking impossible pairs",
                        "One pass instead of nested loops"
                    ]}
                    invariant={
                        mode === 'two_sum_sorted' ? "sum < target ? left++ : right--" :
                            mode === 'container_most_water' ? "min_height moves (limit factor)" :
                                "check_condition_and_move"
                    }
                    invariantLabel="Movement Logic"
                />
            </div>
        </div>
    )

    return (
        <StandardVisualizationLayout
            renderInput={renderInput}

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
                <TwoPointerBruteForceCanvas
                    state={bruteForceStates[Math.min(currentStep, bruteForceStates.length - 1)]}
                    mode={mode}
                />
            )}

            renderOptimal={() => (
                <TwoPointerCanvas
                    state={optimalStates[Math.min(currentStep, optimalStates.length - 1)]}
                    mode={mode}
                    stats={stats}
                    array={array}
                    currentStep={currentStep}
                    totalSteps={maxSteps}
                />
            )}
        />
    )
}
