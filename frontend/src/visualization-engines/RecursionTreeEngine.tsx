import React, { useMemo } from 'react';
import { useStore } from '../store/useStore';
import RecursiveTreeVisualizer from '../components/foundations/engines/structures/RecursiveTreeVisualizer';
import { motion, AnimatePresence } from 'framer-motion';

const RecursionEngine: React.FC<{ isBrute?: boolean; steps?: any[] }> = ({ isBrute, steps: overrideSteps }) => {
    const currentProblem = useStore(state => state.currentProblem);
    const currentStepIndex = useStore(state => state.currentStepIndex);
    const isBruteForceStore = useStore(state => state.isBruteForce);

    const effectiveIsBrute = isBrute !== undefined ? isBrute : isBruteForceStore;
    const steps = useMemo(() => {
        return overrideSteps || (currentProblem ? (effectiveIsBrute ? currentProblem.brute_force_steps : currentProblem.optimal_steps) : []);
    }, [overrideSteps, currentProblem, effectiveIsBrute]);

    if (!steps || steps.length === 0) {
        return <div className="flex items-center justify-center h-full text-white/20 uppercase tracking-widest text-xs font-black">Waiting for Recursion State...</div>;
    }

    const currentStep = steps[currentStepIndex] || steps[0];
    const { state, description } = currentStep;

    // The recursion tree engine can also show a "Standard Visualization" (like an array) 
    // side-by-side with the tree if the problem defines one.
    const showSidePanel = state.array || state.matrix || state.string;

    return (
        <div className="flex flex-col h-full w-full bg-[#1A1A1A]/40 overflow-hidden">
            {/* Context / Header Bar */}
            <div className="flex-none p-8 border-b border-white/5 bg-black/40 flex flex-col items-center justify-center">
                <AnimatePresence mode="wait">
                    <motion.p
                        key={currentStepIndex}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-white/60 font-black tracking-[0.2em] text-[10px] uppercase text-center max-w-2xl px-12"
                    >
                        {description || state.explanation}
                    </motion.p>
                </AnimatePresence>
            </div>

            {/* Main Visualizer Area */}
            <div className="flex-1 flex w-full h-full overflow-hidden">
                {/* Vertical Tree Panel (Main focus) */}
                <div className={`flex-1 min-w-0 h-full relative border-r border-white/5 transition-all duration-700 ${showSidePanel ? 'w-2/3' : 'w-full'}`}>
                    <RecursiveTreeVisualizer 
                        nodes={state.tree?.nodes || {}} 
                        rootId={state.tree?.rootId || "root"}
                        activeNodeId={state.tree?.activeNodeId}
                    />
                </div>

                {/* Optional State Panel (Side Panel) */}
                {showSidePanel && (
                    <motion.div 
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: '33.333333%', opacity: 1 }}
                        className="flex-none bg-black/60 backdrop-blur-3xl overflow-y-auto p-12 border-l border-white/5"
                    >
                        <h4 className="text-white/20 text-[10px] font-black uppercase tracking-[0.3em] mb-12">Problem State</h4>
                        
                        {/* Recursive Summary or Array view */}
                        {state.array && (
                            <div className="flex flex-col gap-4">
                                <span className="text-accent-blue text-[9px] font-black uppercase tracking-widest">Active Input</span>
                                <div className="flex flex-wrap gap-2">
                                    {state.array.map((val: any, idx: number) => (
                                        <div 
                                            key={idx}
                                            className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-black border transition-colors ${state.highlightIndices?.includes(idx) ? 'bg-accent-blue/20 border-accent-blue' : 'bg-white/5 border-white/10 text-white/40'}`}
                                        >
                                            {val}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        
                        {/* Recursion specific data */}
                        <div className="mt-20 flex flex-col gap-6">
                            <span className="text-[#EC4186] text-[9px] font-black uppercase tracking-widest">Call Parameters</span>
                            <div className="grid grid-cols-2 gap-4">
                                {Object.entries(state.customState || {}).map(([key, val]) => (
                                    <div key={key} className="flex flex-col gap-1 p-3 rounded-xl bg-white/5 border border-white/10">
                                        <span className="text-[9px] text-white/20 font-black uppercase tracking-tighter">{key}</span>
                                        <span className="text-[10px] text-white font-mono truncate">{JSON.stringify(val)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default RecursionEngine;
