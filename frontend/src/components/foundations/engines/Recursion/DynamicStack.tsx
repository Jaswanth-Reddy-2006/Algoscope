import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTimeline } from './TimelineController';
import { Cpu, Terminal, Database } from 'lucide-react';

const DynamicStack: React.FC = () => {
    const { state: { steps, currentStepIndex: currentIndex, frames } } = useTimeline();

    // The stack state at currentIndex is the list of frames that have been pushed
    // but not yet popped.
    const stackFrames = useMemo(() => {
        const stack: any[] = [];
        for (let i = 0; i <= currentIndex; i++) {
            const step = steps[i];
            if (step.action === 'PUSH_FRAME') {
                stack.push(frames[step.activeFrameId]);
            } else if (step.action === 'POP_FRAME') {
                stack.pop();
            }
        }
        return stack;
    }, [steps, currentIndex, frames]);

    const activeStep = steps[currentIndex];

    return (
        <div className="w-full h-full flex flex-col bg-[#2b0d38]/40 border-l border-white/5 overflow-hidden">
            <div className="p-4 border-b border-white/5 flex items-center justify-between">
                <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-widest flex items-center gap-2">
                    <Database size={12} className="text-[#EE544A]" />
                    Memory Stack Registry
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-white/5 text-[10px] text-white/40 font-mono">
                    DEPTH: {stackFrames.length}
                </span>
            </div>

            <div className="flex-1 overflow-y-auto p-4 flex flex-col-reverse gap-3 scrollbar-hide">
                <AnimatePresence initial={false}>
                    {stackFrames.map((frame, _index) => {
                        const isActive = frame.id === activeStep.activeFrameId;
                        return (
                            <motion.div
                                key={frame.id}
                                initial={{ opacity: 0, x: 20, scale: 0.95 }}
                                animate={{ opacity: 1, x: 0, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                className={`
                  relative p-4 rounded-xl border transition-all duration-300
                  ${isActive
                                        ? 'bg-[#EE544A]/10 border-[#EE544A]/40 shadow-[0_0_20px_rgba(238, 84, 74,0.1)]'
                                        : 'bg-white/[0.02] border-white/10 opacity-60'}
                `}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <Terminal size={12} className={isActive ? 'text-[#EE544A]' : 'text-white/20'} />
                                        <span className="text-xs font-bold text-white font-mono">{frame.functionName}</span>
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    {Object.entries(frame.params).map(([key, val]) => (
                                        <div key={key} className="flex justify-between items-center text-[10px] font-mono">
                                            <span className="text-white/30 uppercase tracking-tighter">{key}</span>
                                            <span className="text-white/80 truncate ml-4" title={JSON.stringify(val)}>
                                                {JSON.stringify(val)}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                {isActive && (
                                    <motion.div
                                        layoutId="stack-pointer"
                                        className="absolute -left-1 top-1/2 -translate-y-1/2 w-0.5 h-8 bg-[#EE544A] shadow-[0_0_10px_#EE544A]"
                                    />
                                )}
                            </motion.div>
                        );
                    })}
                </AnimatePresence>

                {stackFrames.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center opacity-20 text-center px-8">
                        <Cpu size={32} className="mb-4" />
                        <p className="text-[10px] uppercase font-bold tracking-widest">Stack Empty</p>
                    </div>
                )}
            </div>

            <div className="p-4 bg-black/40 border-t border-white/5 space-y-2">
                <div className="flex justify-between text-[9px] font-bold uppercase text-white/30">
                    <span>Stack Usage</span>
                    <span>{stackFrames.length * 64} KB</span>
                </div>
                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-gradient-to-r from-[#EE544A] to-[#60A5FA]"
                        animate={{ width: `${Math.min((stackFrames.length / 10) * 100, 100)}%` }}
                    />
                </div>
            </div>
        </div>
    );
};

export default DynamicStack;
