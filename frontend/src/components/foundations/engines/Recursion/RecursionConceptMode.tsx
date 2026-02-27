import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, ArrowDown, ArrowUp, Zap } from 'lucide-react';

const RecursionConceptMode: React.FC = () => {
    const [level, setLevel] = useState(0);
    const [isUnwinding, setIsUnwinding] = useState(false);
    const maxLevels = 4;

    useEffect(() => {
        const timer = setInterval(() => {
            if (!isUnwinding) {
                if (level < maxLevels) {
                    setLevel(prev => prev + 1);
                } else {
                    setIsUnwinding(true);
                }
            } else {
                if (level > 0) {
                    setLevel(prev => prev - 1);
                } else {
                    setIsUnwinding(false);
                    // Loop or stop
                }
            }
        }, 1500);

        return () => clearInterval(timer);
    }, [level, isUnwinding]);

    const cards = Array.from({ length: maxLevels + 1 }, (_, i) => i);

    return (
        <div className="w-full h-full flex items-center justify-center p-12 bg-grid-white/[0.02]">
            <div className="relative w-full max-w-2xl aspect-[16/9] flex items-center justify-center">

                {/* Background Decorative Rings */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <motion.div
                        animate={{ rotate: 360, scale: [0.9, 1.1, 0.9] }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="w-96 h-96 rounded-full border border-white/5"
                    />
                    <motion.div
                        animate={{ rotate: -360, scale: [1.1, 0.9, 1.1] }}
                        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                        className="w-[500px] h-[500px] rounded-full border border-white/5"
                    />
                </div>

                {/* Stacking Cards */}
                <div className="relative z-10 w-full h-full flex items-center justify-center">
                    <AnimatePresence>
                        {cards.map((i) => {
                            const isActive = i === level;
                            const isVisible = i <= level;
                            const isUnder = i < level;

                            if (!isVisible) return null;

                            return (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, scale: 0.8, y: 50 }}
                                    animate={{
                                        opacity: 1,
                                        scale: 1 - (level - i) * 0.05,
                                        y: (level - i) * -15,
                                        z: i * 10,
                                        filter: isUnder ? 'brightness(0.5) blur(1px)' : 'brightness(1) blur(0px)',
                                    }}
                                    exit={{ opacity: 0, scale: 1.2, y: -100 }}
                                    className={`
                    absolute w-64 h-40 rounded-3xl border shadow-2xl backdrop-blur-3xl flex flex-col p-6
                    ${isActive
                                            ? 'bg-gradient-to-br from-[#EC4186]/20 to-[#EE544A]/20 border-[#EC4186]/40 shadow-[#EC4186]/20'
                                            : 'bg-white/[0.03] border-white/10 shadow-black/40'}
                  `}
                                    style={{ transformStyle: 'preserve-3d' }}
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className={`p-2 rounded-xl ${isActive ? 'bg-[#EC4186]/20 text-[#EC4186]' : 'bg-white/5 text-white/40'}`}>
                                            <Layers size={20} />
                                        </div>
                                        <div className="font-mono text-[10px] text-white/20 uppercase tracking-widest leading-none mt-2">
                                            Instance #{maxLevels - i}
                                        </div>
                                    </div>

                                    <div className="flex-1">
                                        <h4 className="text-2xl font-bold text-white mb-1">
                                            solve({4 - i})
                                        </h4>
                                        <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">
                                            {i === maxLevels ? "Base Case Reached!" : "Waiting for results..."}
                                        </p>
                                    </div>

                                    {isActive && (
                                        <motion.div
                                            layoutId="pulsar"
                                            className="absolute -inset-1 rounded-[26px] border-2 border-[#EC4186] opacity-30 shadow-[0_0_20px_#EC4186] animate-pulse"
                                        />
                                    )}
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>

                {/* Flow Indicators */}
                <div className="absolute left-12 bottom-12 flex flex-col gap-4">
                    <div className={`flex items-center gap-3 transition-opacity duration-500 ${!isUnwinding ? 'opacity-100' : 'opacity-20'}`}>
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-500 flex items-center justify-center animate-bounce">
                            <ArrowDown size={16} />
                        </div>
                        <div className="text-xs font-bold text-white uppercase tracking-tighter">Stacking Up (Push)</div>
                    </div>
                    <div className={`flex items-center gap-3 transition-opacity duration-500 ${isUnwinding ? 'opacity-100' : 'opacity-20'}`}>
                        <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-500 flex items-center justify-center animate-bounce">
                            <ArrowUp size={16} />
                        </div>
                        <div className="text-xs font-bold text-white uppercase tracking-tighter">Unwinding (Pop)</div>
                    </div>
                </div>

                {/* Floating Insights */}
                <div className="absolute right-12 top-12 max-w-[200px]">
                    <motion.div
                        key={isUnwinding ? 'unwind' : 'stack'}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl"
                    >
                        <div className="flex items-center gap-2 text-[#EC4186] mb-2">
                            <Zap size={14} />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Insight</span>
                        </div>
                        <p className="text-xs text-white/60 leading-relaxed italic">
                            {isUnwinding
                                ? "Now the magic happens. Results cascade back down the stack to build the final answer."
                                : "Each call 'suspends' itself and opens a new version of the same problem."}
                        </p>
                    </motion.div>
                </div>

            </div>
        </div>
    );
};

export default RecursionConceptMode;
