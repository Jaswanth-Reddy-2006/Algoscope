import React from 'react';
import { motion } from 'framer-motion';
import {
    Play,
    Pause,
    RotateCcw,
    ChevronRight,
    ChevronLeft,
    Zap
} from 'lucide-react';
import { useTimeline } from './TimelineController';

const TimelineControls: React.FC = () => {
    const {
        state: { currentStepIndex, steps, isPlaying, speed },
        play,
        pause,
        stepForward,
        stepBackward,
        restart,
        setSpeed
    } = useTimeline();

    const progress = (currentStepIndex / (steps.length - 1)) * 100;

    return (
        <div className="flex flex-col gap-4">
            {/* Progress Bar */}
            <div className="relative h-1 bg-white/5 rounded-full overflow-hidden group">
                <motion.div
                    className="absolute inset-y-0 left-0 bg-[#EE544A] shadow-[0_0_10px_#EE544A]"
                    animate={{ width: `${progress}%` }}
                />
            </div>

            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="flex items-center bg-white/5 rounded-xl p-1 border border-white/10">
                        <ControlButton onClick={stepBackward} icon={ChevronLeft} />
                        <ControlButton
                            onClick={isPlaying ? pause : play}
                            icon={isPlaying ? Pause : Play}
                            variant="primary"
                        />
                        <ControlButton onClick={stepForward} icon={ChevronRight} />
                    </div>

                    <div className="flex items-center gap-2 bg-white/5 rounded-xl px-3 py-1.5 border border-white/10 font-mono text-[10px] text-white/40">
                        <Zap size={12} className="text-amber-400" />
                        <span>{currentStepIndex + 1} / {steps.length}</span>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center bg-white/5 rounded-xl p-1 border border-white/10">
                        {[0.5, 1, 2, 4].map(s => (
                            <button
                                key={s}
                                onClick={() => setSpeed(s)}
                                className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all ${speed === s ? 'bg-white/10 text-white' : 'text-white/20 hover:text-white/40'}`}
                            >
                                {s}x
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={restart}
                        className="p-2 rounded-xl bg-white/5 border border-white/10 text-white/40 hover:text-white hover:bg-white/10 transition-all"
                    >
                        <RotateCcw size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};

const ControlButton: React.FC<{ onClick: () => void; icon: any; variant?: 'primary' | 'secondary' }> = ({ onClick, icon: Icon, variant = 'secondary' }) => (
    <button
        onClick={onClick}
        className={`
            p-2 rounded-lg transition-all
            ${variant === 'primary'
                ? 'bg-[#EE544A] text-white shadow-lg shadow-[#EE544A]/20'
                : 'text-white/40 hover:text-white hover:bg-white/5'}
        `}
    >
        <Icon size={18} fill={variant === 'primary' ? 'currentColor' : 'none'} />
    </button>
);

export default TimelineControls;
