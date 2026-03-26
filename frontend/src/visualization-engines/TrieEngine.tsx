import React from 'react';
import { useStore } from '../store/useStore';
import { TrieEngine as TrieVisualizer } from '../components/foundations/visualizer/engines/TrieEngine';
import { motion, AnimatePresence } from 'framer-motion';

const TrieEngine: React.FC<{ isBrute?: boolean; steps?: any[] }> = ({ isBrute, steps: overrideSteps }) => {
    const currentProblem = useStore(state => state.currentProblem);
    const currentStepIndex = useStore(state => state.currentStepIndex);
    const isBruteForceStore = useStore(state => state.isBruteForce);

    const effectiveIsBrute = isBrute !== undefined ? isBrute : isBruteForceStore;
    const steps = overrideSteps || (currentProblem ? (effectiveIsBrute ? currentProblem.brute_force_steps : currentProblem.optimal_steps) : []);
    
    if (!steps || steps.length === 0) {
        return <div className="flex items-center justify-center h-full text-white/20 uppercase tracking-widest text-xs font-black">Syncing Trie State...</div>;
    }

    const currentStep = steps[currentStepIndex] || steps[0];
    const { state, description } = currentStep;

    return (
        <div className="flex flex-col h-full w-full">
            <div className="flex-none min-h-[100px] border-b border-white/10 flex flex-col items-center justify-center px-10 bg-black/40">
                <AnimatePresence mode="wait">
                    <motion.p
                        key={currentStepIndex}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-xs text-white/50 font-medium uppercase tracking-widest text-center"
                    >
                        {description || state.explanation}
                    </motion.p>
                </AnimatePresence>
            </div>

            <div className="flex-1 flex items-center justify-center p-10 overflow-hidden">
                <TrieVisualizer 
                    nodes={state.tree?.nodes || state.trie?.nodes || {}} 
                    rootId={state.tree?.rootId || state.trie?.rootId || "root"}
                    activeNodeId={state.pointers?.nodeId}
                />
            </div>
        </div>
    );
};

export default TrieEngine;
