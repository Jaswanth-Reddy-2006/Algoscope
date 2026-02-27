import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, Terminal } from 'lucide-react';

interface Frame {
    id: string;
    funcName: string;
    params: Record<string, any>;
    locals: Record<string, any>;
    returnValue?: any;
}

interface Props {
    frames: Frame[];
    activeFrameId?: string;
}

const StackPanel: React.FC<Props> = ({ frames, activeFrameId }) => {
    return (
        <div className="w-full h-full flex flex-col bg-[#0a0118]/40 border-l border-white/5 overflow-hidden">
            <div className="p-4 border-b border-white/5 flex items-center justify-between">
                <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-widest flex items-center gap-2">
                    <Cpu size={12} className="text-[#EC4186]" />
                    Call Stack Registry
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-white/5 text-[10px] text-white/40 font-mono">
                    DEPTH: {frames.length}
                </span>
            </div>

            <div className="flex-1 overflow-y-auto p-4 flex flex-col-reverse gap-3 scrollbar-hide">
                <AnimatePresence initial={false}>
                    {frames.map((frame) => {
                        const isActive = frame.id === activeFrameId;
                        return (
                            <motion.div
                                key={frame.id}
                                initial={{ opacity: 0, x: 20, scale: 0.95 }}
                                animate={{ opacity: 1, x: 0, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                className={`
                  relative p-4 rounded-xl border transition-all duration-300
                  ${isActive
                                        ? 'bg-[#EC4186]/10 border-[#EC4186]/40 shadow-[0_0_20px_rgba(236,65,134,0.1)]'
                                        : 'bg-white/[0.02] border-white/10 opacity-60'}
                `}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <Terminal size={12} className={isActive ? 'text-[#EC4186]' : 'text-white/20'} />
                                        <span className="text-xs font-bold text-white font-mono">{frame.funcName}</span>
                                    </div>
                                    {frame.returnValue !== undefined && (
                                        <div className="text-[10px] font-bold text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5 rounded">
                                            RET: {frame.returnValue}
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-1.5">
                                    {Object.entries(frame.params).map(([key, val]) => (
                                        <div key={key} className="flex justify-between items-center text-[10px] font-mono">
                                            <span className="text-white/30 uppercase tracking-tighter">{key}</span>
                                            <span className="text-white/80">{JSON.stringify(val)}</span>
                                        </div>
                                    ))}
                                </div>

                                {isActive && (
                                    <motion.div
                                        layoutId="stack-pointer"
                                        className="absolute -left-1 top-1/2 -translate-y-1/2 w-0.5 h-8 bg-[#EC4186] shadow-[0_0_10px_#EC4186]"
                                    />
                                )}
                            </motion.div>
                        );
                    })}
                </AnimatePresence>

                {frames.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center opacity-20 text-center px-8">
                        <Cpu size={32} className="mb-4" />
                        <p className="text-[10px] uppercase font-bold tracking-widest">Stack Empty</p>
                    </div>
                )}
            </div>

            <div className="p-4 bg-black/40 border-t border-white/5 space-y-2">
                <div className="flex justify-between text-[9px] font-bold uppercase text-white/30">
                    <span>Stack Limit</span>
                    <span>1024 KB</span>
                </div>
                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-gradient-to-r from-[#EC4186] to-[#EE544A]"
                        animate={{ width: `${(frames.length / 10) * 100}%` }}
                    />
                </div>
            </div>
        </div>
    );
};

export default StackPanel;
