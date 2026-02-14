import React from 'react'
import { motion } from 'framer-motion'
import { AnimationControls } from '../../AnimationControls'


interface StandardVisualizationLayoutProps {
    // Context / Input
    title?: string
    renderInput?: () => React.ReactNode

    // Simulation State
    isPlaying: boolean
    currentStep: number
    totalSteps: number
    playbackSpeed: number

    // Controls
    onPlay: () => void
    onPause: () => void
    onReset: () => void
    onStepForward?: () => void
    onStepBack?: () => void
    onSpeedChange: (speed: number) => void

    // Render Props for Panels
    renderBruteForce: () => React.ReactNode
    renderOptimal: () => React.ReactNode

    // Optional metrics override (if not using default stats display)
    renderMetrics?: () => React.ReactNode
}

export function StandardVisualizationLayout({
    title,
    renderInput,
    isPlaying,
    currentStep,
    totalSteps,
    playbackSpeed,
    onPlay,
    onPause,
    onReset,
    onStepForward,
    onStepBack,
    onSpeedChange,
    renderBruteForce,
    renderOptimal,
    renderMetrics
}: StandardVisualizationLayoutProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-12"
        >
            {/* Header Section could go here if we want a specific title per sub-pattern */}
            {title && <h2 className="text-2xl font-bold text-white">{title}</h2>}

            {/* 1. Input Context */}
            {renderInput && (
                <div className="mb-8">
                    {renderInput()}
                </div>
            )}

            {/* 2. Controls */}
            <AnimationControls
                isPlaying={isPlaying}
                onPlay={onPlay}
                onPause={onPause}
                onReset={onReset}
                speed={playbackSpeed}
                onSpeedChange={onSpeedChange}
                currentStep={currentStep}
                totalSteps={totalSteps}
                onStepForward={onStepForward}
                onStepBack={onStepBack}
            />

            {/* 3. Dual Simulation View */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* LEFT CARD: Brute Force */}
                <div className="flex flex-col h-full min-h-[500px]">
                    {renderBruteForce()}
                </div>

                {/* RIGHT CARD: Optimal */}
                <div className="flex flex-col h-full min-h-[500px]">
                    {renderOptimal()}
                </div>
            </div>

            {/* 4. Metrics Row */}
            {renderMetrics && (
                <div className="mt-8">
                    {renderMetrics()}
                </div>
            )}
        </motion.div>
    )
}
