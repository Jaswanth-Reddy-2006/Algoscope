import React from 'react';
import { useStore } from '../store/useStore';
import { HeapEngine as HeapVisualizer } from '../components/foundations/visualizer/engines/HeapEngine';
import { motion, AnimatePresence } from 'framer-motion';

const HeapEngine: React.FC<{ isBrute?: boolean; steps?: any[] }> = ({ isBrute, steps: overrideSteps }) => {
    const currentProblem = useStore(state => state.currentProblem);
    const currentStepIndex = useStore(state => state.currentStepIndex);
    const isBruteForceStore = useStore(state => state.isBruteForce);

    const effectiveIsBrute = isBrute !== undefined ? isBrute : isBruteForceStore;
    const steps = overrideSteps || (currentProblem ? (effectiveIsBrute ? currentProblem.brute_force_steps : currentProblem.optimal_steps) : []);
    
    if (!steps || steps.length === 0) {
        return <div className="flex items-center justify-center h-full text-white/20 uppercase tracking-widest text-xs font-black">Syncing Heap State...</div>;
    }

    const currentStep = steps[currentStepIndex] || steps[0];
    const { state, description } = currentStep;

    // Standardize heap data extraction
    const heapData = state.tree || state.array || state.heap || [];
    const activeIndex = state.pointers?.i ?? state.pointers?.index ?? -1;

    return (
        <div className="flex flex-col h-full w-full">
            {/* Header / Explanation */}
            <div className="flex-none min-h-[100px] border-b border-white/10 flex flex-col items-center justify-center px-10 bg-black/40">
                <AnimatePresence mode="wait">
                    <motion.p
                        key={currentStepIndex}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-xs text-white/50 font-medium uppercase tracking-widest text-center max-w-2xl"
                    >
                        {description || state.explanation}
                    </motion.p>
                </AnimatePresence>
            </div>

            {/* Visualizer */}
            <div className="flex-1 flex items-center justify-center p-10">
                <HeapVisualizer 
                    data={heapData} 
                    type={currentProblem?.primaryPattern?.toLowerCase().includes('max') ? 'max' : 'min'}
                    activeIndex={activeIndex}
                />
            </div>
        </div>
    );
};

export default HeapEngine;
