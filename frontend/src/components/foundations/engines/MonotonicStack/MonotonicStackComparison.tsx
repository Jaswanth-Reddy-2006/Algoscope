import React, { useState, useMemo, useEffect } from 'react'
import { StandardVisualizationLayout } from '../shared/StandardVisualizationLayout'
import { runMonotonicStack } from './core/monotonicStackCore'
import { runMonotonicStackBruteForce } from './core/monotonicStackBruteForce'
import MonotonicStackCanvas from './visual/MonotonicStackCanvas'
import { MonotonicStackBruteForceCanvas } from './visual/MonotonicStackBruteForceCanvas'
import { MonotonicStackInputPanel } from './visual/MonotonicStackInputPanel'
import { ComparisonStats } from '../../MentalModelEngine/comparisonStats'

interface Props {
    mode: string // next_greater, next_smaller, prev_greater, prev_smaller, daily_temperatures
}

export const MonotonicStackComparison: React.FC<Props> = ({ mode }) => {
    // 1. Comparison State
    const [array, setArray] = useState<number[]>([])
    const [currentStep, setCurrentStep] = useState(0)
    const [isPlaying, setIsPlaying] = useState(false)
    const [speed, setSpeed] = useState(1)

    // 2. Initialize Data
    useEffect(() => {
        const arr = Array.from({ length: 12 }, () => Math.floor(Math.random() * 50) + 1)
        setArray(arr)
        setCurrentStep(0)
        setIsPlaying(false)
    }, [mode])

    // 3. Compute States
    const bruteForceStates = useMemo(() =>
        runMonotonicStackBruteForce(array, mode),
        [array, mode])

    const optimalStates = useMemo(() =>
        runMonotonicStack(array, mode),
        [array, mode])

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

    return (
        <StandardVisualizationLayout
            title={mode.replace(/_/g, ' ').toUpperCase()}

            renderInput={() => (
                <MonotonicStackInputPanel
                    array={array}
                    stats={stats}
                    onArrayChange={handleArrayChange}
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
                <MonotonicStackBruteForceCanvas
                    state={bruteForceStates[Math.min(currentStep, bruteForceStates.length - 1)]}
                />
            )}

            renderOptimal={() => (
                <MonotonicStackCanvas
                    state={optimalStates[Math.min(currentStep, optimalStates.length - 1)]}
                />
            )}
        />
    )
}
