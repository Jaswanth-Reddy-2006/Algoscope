import React from 'react';
import { motion } from 'framer-motion';

interface Props {
    data: (number | string | null)[];
    activeIndex?: number;
    highlightIndices?: number[];
    label?: string;
}

export const ArrayEngine: React.FC<Props> = ({ data, activeIndex, highlightIndices = [], label }) => {
    return (
        <div className="flex flex-col items-center gap-8 w-full max-w-4xl">
            {label && (
                <div className="px-4 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-white/40 uppercase tracking-widest">
                    {label}
                </div>
            )}

            <div className="flex flex-wrap justify-center gap-2 lg:gap-4">
                {data.map((val, idx) => {
                    const isActive = activeIndex === idx;
                    const isHighlighted = highlightIndices.includes(idx);

                    return (
                        <motion.div
                            key={idx}
                            layout
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`
                relative w-12 h-12 lg:w-16 lg:h-16 flex items-center justify-center rounded-xl border-2 transition-all duration-300
                ${isActive
                                    ? 'bg-accent-blue/20 border-accent-blue shadow-[0_0_20px_rgba(236, 65, 134,0.4)] scale-110 z-10'
                                    : isHighlighted
                                        ? 'bg-purple-500/20 border-purple-500 shadow-[0_0_15px_rgba(236, 65, 134,0.3)]'
                                        : 'bg-white/5 border-white/10'
                                }
              `}
                        >
                            <span className={`text-lg font-mono font-bold ${isActive ? 'text-white' : 'text-white/60'}`}>
                                {val !== null ? val : ''}
                            </span>

                            {/* Index Label */}
                            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-mono font-bold text-white/20">
                                {idx}
                            </div>

                            {/* Active Pointer */}
                            {isActive && (
                                <motion.div
                                    layoutId="pointer"
                                    className="absolute -top-8 left-1/2 -translate-x-1/2 text-accent-blue"
                                >
                                    <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-accent-blue" />
                                </motion.div>
                            )}
                        </motion.div>
                    );
                })}
            </div>

            <div className="mt-12 flex gap-8">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-accent-blue/40 border border-accent-blue" />
                    <span className="text-[10px] font-bold text-white/40 tracking-widest uppercase">Active Pointer</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-purple-500/40 border border-purple-500" />
                    <span className="text-[10px] font-bold text-white/40 tracking-widest uppercase">Highlighted</span>
                </div>
            </div>
        </div>
    );
};
