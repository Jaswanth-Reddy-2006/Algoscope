import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import RecursionTreeVisualizer from '../../../visualizers/RecursionTreeVisualizer';
import { Play, RotateCcw, Zap, ChevronRight, ChevronLeft } from 'lucide-react';

interface Props {
    patternId: 'linear_recursion' | 'binary_recursion' | 'backtracking_recursion' | 'divide_and_conquer';
    onStepChange?: (stack: any[]) => void;
}

const RecursionTreeEngine: React.FC<Props> = ({ patternId, onStepChange }) => {
    const [step, setStep] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);

    // Mock data generators based on pattern
    const getTreeData = () => {
        if (patternId === 'linear_recursion') {
            return {
                id: '1', value: 'f(3)', status: step >= 1 ? 'completed' : 'active',
                children: [
                    {
                        id: '2', value: 'f(2)', status: step >= 2 ? 'completed' : (step === 1 ? 'active' : 'pending'),
                        children: [
                            {
                                id: '3', value: 'f(1)', status: step >= 3 ? 'completed' : (step === 2 ? 'active' : 'pending'),
                                children: [
                                    { id: '4', value: 'f(0)', status: step >= 4 ? 'completed' : (step === 3 ? 'active' : 'pending') }
                                ]
                            }
                        ]
                    }
                ]
            };
        }
        // Binary Recursion (Fibonacci)
        return {
            id: '1', value: 'f(3)', status: step >= 7 ? 'completed' : 'active',
            children: [
                {
                    id: '2', value: 'f(2)', status: step >= 4 ? 'completed' : (step >= 1 ? 'active' : 'pending'),
                    children: [
                        { id: '4', value: 'f(1)', status: step >= 2 ? 'completed' : (step === 1 ? 'active' : 'pending') },
                        { id: '5', value: 'f(0)', status: step >= 3 ? 'completed' : (step === 2 ? 'active' : 'pending') }
                    ]
                },
                { id: '3', value: 'f(1)', status: step >= 6 ? 'completed' : (step >= 5 ? 'active' : 'pending') }
            ]
        };
    };

    const getStackFrames = () => {
        // Logic to generate stack frames based on current step and pattern
        // Simplified for now
        if (patternId === 'linear_recursion') {
            const frames = [
                { id: 'f1', funcName: 'solve', params: { n: 3 }, locals: {} },
                { id: 'f2', funcName: 'solve', params: { n: 2 }, locals: {} },
                { id: 'f3', funcName: 'solve', params: { n: 1 }, locals: {} },
                { id: 'f4', funcName: 'solve', params: { n: 0 }, locals: {} },
            ];
            return frames.slice(0, Math.min(step + 1, 4));
        }
        return [];
    };

    useEffect(() => {
        if (isPlaying) {
            const interval = setInterval(() => {
                setStep(prev => (prev < 7 ? prev + 1 : 0));
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [isPlaying]);

    useEffect(() => {
        if (onStepChange) {
            onStepChange(getStackFrames());
        }
    }, [step]);

    return (
        <div className="w-full h-full flex flex-col">
            <div className="flex-1 flex items-center justify-center p-8 overflow-auto">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="min-w-[500px]"
                >
                    <RecursionTreeVisualizer data={getTreeData() as any} />
                </motion.div>
            </div>

            <div className="h-20 bg-black/40 border-t border-white/5 px-8 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isPlaying ? 'bg-[#EC4186] text-white' : 'bg-white/5 text-white/40 hover:bg-white/10'}`}
                    >
                        {isPlaying ? <RotateCcw size={18} /> : <Play size={18} className="ml-1" />}
                    </button>
                    <div className="flex bg-white/5 rounded-xl p-1 border border-white/5">
                        <button onClick={() => setStep(s => Math.max(0, s - 1))} className="p-2 hover:bg-white/10 rounded-lg text-white/40">
                            <ChevronLeft size={16} />
                        </button>
                        <button onClick={() => setStep(s => Math.min(7, s + 1))} className="p-2 hover:bg-white/10 rounded-lg text-white/40">
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Execution Step</span>
                        <span className="text-sm font-mono text-white">{step} / 7</span>
                    </div>
                    <div className="p-3 rounded-xl bg-[#EC4186]/10 border border-[#EC4186]/20 text-[#EC4186] flex items-center gap-2">
                        <Zap size={14} />
                        <span className="text-[10px] font-bold uppercase tracking-widest">{patternId.replace('_', ' ')}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecursionTreeEngine;
