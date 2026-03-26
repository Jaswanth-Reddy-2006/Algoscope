import React from 'react';
import { useStore } from '../store/useStore';
import { motion, AnimatePresence } from 'framer-motion';

const BinarySearchEngine: React.FC<{ isBrute?: boolean; steps?: any[] }> = ({ isBrute, steps: overrideSteps }) => {
    const currentStepIndex = useStore(state => state.currentStepIndex);
    const currentProblem = useStore(state => state.currentProblem);
    
    const steps = overrideSteps || (isBrute ? 
        currentProblem?.brute_force_steps || [] : 
        currentProblem?.optimal_steps || []);
        
    const currentStep = (steps[currentStepIndex] || {}) as any;
    const { state = {} } = currentStep;
    const array = state.array || [];
    const pointers = state.pointers || {};
    const values = state.values || {};
    
    const low = state.low ?? pointers?.low ?? -1;
    const high = state.high ?? pointers?.high ?? -1;
    const mid = state.mid ?? pointers?.mid ?? -1;
    const target = state.target ?? values?.target ?? -1;

    return (
        <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-16 relative">
            {/* Target Value Indicator */}
            <div className="flex items-center gap-4 bg-white/5 border border-white/10 px-6 py-3 rounded-full">
                <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Target Value</span>
                <span className="text-xl font-black text-[#EC4186]">{target !== -1 ? target : 'N/A'}</span>
            </div>

            {/* Array Container */}
            <div className="relative w-full max-w-4xl flex items-center justify-center pt-12">
                <div className="flex gap-1 items-end h-32">
                    {array.map((val: any, idx: number) => {
                        const isMid = idx === mid;
                        const inRange = idx >= low && idx <= high;
                        
                        return (
                            <div key={idx} className="flex flex-col items-center gap-2 group">
                                {/* Pointer Labels */}
                                <div className="h-10 flex flex-col items-center justify-end">
                                    {idx === low && <span className="text-[9px] font-black text-blue-400 uppercase">Low</span>}
                                    {idx === high && <span className="text-[9px] font-black text-red-400 uppercase">High</span>}
                                </div>

                                <motion.div
                                    layout
                                    className={`w-10 rounded-lg flex items-center justify-center font-bold text-sm transition-all relative
                                        ${isMid ? 'bg-[#EC4186] text-white h-20 shadow-[0_0_20px_rgba(236,65,134,0.3)] ring-2 ring-[#EC4186]/50' : 
                                          inRange ? 'bg-white/10 text-white/80 h-16' : 
                                          'bg-white/[0.02] text-white/20 h-12 grayscale opacity-30'} border border-white/5`}
                                >
                                    {val}
                                    {isMid && (
                                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-[8px] font-black uppercase text-[#EC4186] whitespace-nowrap">
                                            Midpoint
                                        </div>
                                    )}
                                </motion.div>
                                
                                <span className="text-[9px] font-medium text-white/10 group-hover:text-white/30 transition-colors">{idx}</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Scale/Info Section */}
            <div className="flex gap-12">
                <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded bg-[#EC4186]" />
                    <span className="text-[10px] font-bold text-white/60 uppercase">Current Mid</span>
                </div>
                <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded bg-white/20" />
                    <span className="text-[10px] font-bold text-white/60 uppercase">Active Range</span>
                </div>
                <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded bg-white/5 opacity-30" />
                    <span className="text-[10px] font-bold text-white/60 uppercase">Discarded</span>
                </div>
            </div>

            {/* Calculation HUD */}
            <AnimatePresence mode="wait">
                {state.calculation && (
                    <motion.div
                        key={`calc-${currentStepIndex}`}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="px-8 py-3 rounded-2xl border-2 border-white/10 bg-white/[0.02] shadow-2xl backdrop-blur-xl"
                    >
                        <div className="flex items-center gap-4 text-xl font-black italic uppercase text-white font-mono">
                            {typeof state.calculation === 'object' ? JSON.stringify(state.calculation) : state.calculation}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Explanation Overlay */}
            <div className="absolute bottom-10 left-10 right-10 bg-[#1b062b]/80 backdrop-blur-xl border border-white/5 p-6 rounded-3xl shadow-2xl">
                <div className="flex items-start gap-4">
                    <div className="p-2 bg-[#EC4186]/10 rounded-xl">
                        <div className="w-2 h-2 rounded-full bg-[#EC4186] animate-pulse" />
                    </div>
                    <p className="text-sm text-white/90 leading-relaxed font-medium">
                        {currentStep.description || "Initializing binary search..."}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default BinarySearchEngine;
