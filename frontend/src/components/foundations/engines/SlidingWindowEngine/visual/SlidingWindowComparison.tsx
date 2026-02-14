import React, { useState, useMemo, useEffect } from 'react'
import { generateBruteForceStates } from '../../../MentalModelEngine/bruteForceModel'
import { generateSlidingWindowStates } from '../../../MentalModelEngine/slidingWindowModel'
import { calculateComparison } from '../../../MentalModelEngine/comparisonStats'
import { ProblemPlayground } from '../../../ProblemPlayground'
import { BruteForcePanel } from '../../../BruteForcePanel'
import { SlidingWindowPanel } from '../../../SlidingWindowPanel'
import { StandardVisualizationLayout } from '../../shared/StandardVisualizationLayout'

export const SlidingWindowComparison: React.FC = () => {
    const [array, setArray] = useState([2, 5, 1, 8, 2, 9, 1])
    const [windowSize, setWindowSize] = useState(3)
    const [currentStep, setCurrentStep] = useState(0)
    const [isPlaying, setIsPlaying] = useState(false)
    const [animationSpeed, setAnimationSpeed] = useState(1)

    const bruteForceStates = useMemo(() => generateBruteForceStates(array, windowSize), [array, windowSize])
    const slidingWindowStates = useMemo(() => generateSlidingWindowStates(array, windowSize), [array, windowSize])
    const stats = useMemo(() => calculateComparison(array.length, windowSize), [array.length, windowSize])

    const maxSteps = Math.max(bruteForceStates.length, slidingWindowStates.length)

    useEffect(() => {
        setCurrentStep(0)
        setIsPlaying(false)
    }, [array, windowSize])

    useEffect(() => {
        if (!isPlaying) return
        if (currentStep >= maxSteps - 1) {
            setIsPlaying(false)
            return
        }
        const timer = setTimeout(() => {
            setCurrentStep(prev => prev + 1)
        }, 600 / animationSpeed)
        return () => clearTimeout(timer)
    }, [isPlaying, currentStep, maxSteps, animationSpeed])

    return (
        <div className="space-y-8">
            <StandardVisualizationLayout
                renderInput={() => (
                    <ProblemPlayground
                        array={array}
                        windowSize={windowSize}
                        stats={stats}
                        onArrayChange={setArray}
                        onWindowSizeChange={setWindowSize}
                    />
                )}

                isPlaying={isPlaying}
                currentStep={currentStep}
                totalSteps={maxSteps}
                playbackSpeed={animationSpeed}

                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onReset={() => { setCurrentStep(0); setIsPlaying(false); }}
                onSpeedChange={setAnimationSpeed}

                renderBruteForce={() => (
                    <BruteForcePanel
                        states={bruteForceStates}
                        currentStep={currentStep}
                        array={array}
                        windowSize={windowSize}
                    />
                )}

                renderOptimal={() => (
                    <SlidingWindowPanel
                        states={slidingWindowStates}
                        currentStep={currentStep}
                        array={array}
                        stats={stats}
                    />
                )}
            />
        </div>
    )
}
