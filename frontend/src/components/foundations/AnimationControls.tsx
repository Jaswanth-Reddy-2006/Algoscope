import React from 'react'
import { Play, Pause, RotateCcw, Gauge, SkipBack, SkipForward } from 'lucide-react'

interface Props {
    isPlaying: boolean
    onPlay: () => void
    onPause: () => void
    onReset: () => void
    speed: number
    onSpeedChange: (speed: number) => void
    // New props for progress
    currentStep?: number
    totalSteps?: number
    onStepForward?: () => void
    onStepBack?: () => void
}

const SPEED_OPTIONS = [
    { value: 0.5, label: '0.5x' },
    { value: 1, label: '1x' },
    { value: 2, label: '2x' },
    { value: 3, label: '3x' }
]

export const AnimationControls: React.FC<Props> = ({
    isPlaying,
    onPlay,
    onPause,
    onReset,
    speed,
    onSpeedChange,
    currentStep = 0,
    totalSteps = 0,
    onStepForward,
    onStepBack
}) => {
    const progress = totalSteps > 1 ? (currentStep / (totalSteps - 1)) * 100 : 0

    return (
        <div className="flex flex-col gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
            {/* Top Row: Controls & Speed */}
            <div className="flex items-center justify-between">
                {/* Left: Playback Controls */}
                <div className="flex items-center gap-2">
                    {!isPlaying ? (
                        <button
                            onClick={onPlay}
                            className="px-4 py-2 rounded-lg bg-accent-blue/20 hover:bg-accent-blue/30 border border-accent-blue/30 transition-colors flex items-center gap-2"
                            title="Play"
                        >
                            <Play size={16} className="text-accent-blue" fill="currentColor" />
                            <span className="text-sm font-medium text-white">Play</span>
                        </button>
                    ) : (
                        <button
                            onClick={onPause}
                            className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 transition-colors flex items-center gap-2"
                            title="Pause"
                        >
                            <Pause size={16} className="text-white" fill="currentColor" />
                            <span className="text-sm font-medium text-white">Pause</span>
                        </button>
                    )}
                    <button
                        onClick={onReset}
                        className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 transition-colors flex items-center gap-2"
                        title="Reset"
                    >
                        <RotateCcw size={16} className="text-white" />
                        <span className="text-sm font-medium text-white">Reset</span>
                    </button>
                </div>

                {/* Step Controls (Optional) */}
                {(onStepBack || onStepForward) && (
                    <div className="flex items-center gap-2">
                        <button
                            onClick={onStepBack}
                            disabled={currentStep <= 0}
                            className="p-2 rounded-lg hover:bg-white/10 disabled:opacity-30 transition-colors"
                        >
                            <SkipBack size={16} />
                        </button>
                        <span className="text-xs font-mono text-white/40">
                            {currentStep + 1} / {totalSteps}
                        </span>
                        <button
                            onClick={onStepForward}
                            disabled={currentStep >= totalSteps - 1}
                            className="p-2 rounded-lg hover:bg-white/10 disabled:opacity-30 transition-colors"
                        >
                            <SkipForward size={16} />
                        </button>
                    </div>
                )}


                {/* Right: Speed Control */}
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 text-white/60">
                        <Gauge size={16} />
                        <span className="text-sm">Speed:</span>
                    </div>
                    <div className="flex gap-1">
                        {SPEED_OPTIONS.map(option => (
                            <button
                                key={option.value}
                                onClick={() => onSpeedChange(option.value)}
                                className={`px-3 py-1 rounded-lg text-sm font-mono transition-colors ${speed === option.value
                                    ? 'bg-accent-blue/30 text-accent-blue border border-accent-blue/50'
                                    : 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10'
                                    }`}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom Row: Progress Bar */}
            {totalSteps > 0 && (
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-accent-blue transition-all duration-300 ease-out"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            )}
        </div>
    )
}
