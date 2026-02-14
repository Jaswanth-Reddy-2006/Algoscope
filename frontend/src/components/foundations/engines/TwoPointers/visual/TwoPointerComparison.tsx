import React, { useState, useMemo, useEffect } from 'react'
import { StandardVisualizationLayout } from '../../shared/StandardVisualizationLayout'
import { TwoPointersInputPanel } from './TwoPointersInputPanel'
import { TwoPointerBruteForceCanvas } from './TwoPointerBruteForceCanvas'
import TwoPointerCanvas from './TwoPointerCanvas' // Default export
import { generateTwoPointerBruteForce } from '../core/twoPointerBruteForce'
import { runTwoSumSorted, runContainerMostWater } from '../core/twoPointerCore'

interface Props {
    subPatternId: string
}

export const TwoPointerComparison: React.FC<Props> = ({ subPatternId }) => {
    // 1. Inputs
    const [array, setArray] = useState<number[]>([2, 7, 11, 15])
    const [target, setTarget] = useState<number>(9)

    // 2. Control State
    const [currentStep, setCurrentStep] = useState(0)
    const [isPlaying, setIsPlaying] = useState(false)
    const [playbackSpeed, setPlaybackSpeed] = useState(1)

    // 3. Determine Mode
    const mode = subPatternId === 'container_most_water' ? 'container_most_water' : 'two_sum_sorted'

    // 4. Generate States
    const bruteForceStates = useMemo(() =>
        generateTwoPointerBruteForce(array, mode, target),
        [array, mode, target])

    const optimalStates = useMemo(() => {
        if (mode === 'container_most_water') {
            return runContainerMostWater(array)
        }
        return runTwoSumSorted(array, target)
    }, [array, mode, target])

    const maxSteps = Math.max(bruteForceStates.length, optimalStates.length)

    // Calculate Stats
    const stats = {
        bruteForceOps: bruteForceStates.length,
        optimalOps: optimalStates.length,
        bruteForceSteps: bruteForceStates.length,
        optimalSteps: optimalStates.length,
        savedOps: bruteForceStates.length - optimalStates.length,
        efficiencyGain: Math.round(((bruteForceStates.length - optimalStates.length) / Math.max(1, bruteForceStates.length)) * 100),
        timeSaved: Math.round(((bruteForceStates.length - optimalStates.length) / Math.max(1, bruteForceStates.length)) * 100),
        numWindows: 0 // Not applicable for Two Pointers, but needed for type
    }

    // 5. Animation Loop
    useEffect(() => {
        if (!isPlaying) return
        if (currentStep >= maxSteps - 1) {
            setIsPlaying(false)
            return
        }
        const timer = setTimeout(() => {
            setCurrentStep(prev => prev + 1)
        }, 1000 / playbackSpeed)
        return () => clearTimeout(timer)
    }, [isPlaying, currentStep, maxSteps, playbackSpeed])

    // 6. Reset on Input Change
    useEffect(() => {
        setCurrentStep(0)
        setIsPlaying(false)
    }, [array, target, mode])

    return (
        <StandardVisualizationLayout
            title={mode === 'container_most_water' ? 'Two Pointers: maxArea' : 'Two Pointers: Two Sum'}

            // SECTION B.1: Input & Context
            renderInput={() => (
                <TwoPointersInputPanel
                    array={array}
                    target={target}
                    stats={stats}
                    onArrayChange={setArray}
                    onTargetChange={setTarget}
                    mode={mode}
                />
            )}

            // SECTION B.2: Controls
            isPlaying={isPlaying}
            currentStep={currentStep}
            totalSteps={maxSteps}
            playbackSpeed={playbackSpeed}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onReset={() => { setCurrentStep(0); setIsPlaying(false); }}
            onStepForward={() => setCurrentStep(prev => Math.min(maxSteps - 1, prev + 1))}
            onStepBack={() => setCurrentStep(prev => Math.max(0, prev - 1))}
            onSpeedChange={setPlaybackSpeed}

            // SECTION B.3: Visualization
            renderBruteForce={() => (
                <TwoPointerBruteForceCanvas
                    state={bruteForceStates[Math.min(currentStep, bruteForceStates.length - 1)]}
                    mode={mode}
                />
            )}

            renderOptimal={() => (
                <TwoPointerCanvas
                    state={optimalStates[Math.min(currentStep, optimalStates.length - 1)]}
                    mode={mode} // Pass mode if needed by Canvas, though it might infer from state
                    stats={stats}
                    array={array}
                    currentStep={currentStep}
                    totalSteps={optimalStates.length}
                />
            )}
        />
    )
}
