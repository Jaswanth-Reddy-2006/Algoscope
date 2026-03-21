import React from 'react';
import { motion } from 'framer-motion';

interface Props {
    data: number[];
    type: 'min' | 'max';
    activeIndex?: number;
}

export const HeapEngine: React.FC<Props> = ({ data, type, activeIndex }) => {
    // Convert flat array to tree structure positions
    const getPosition = (index: number) => {
        const level = Math.floor(Math.log2(index + 1));
        const itemsInLevel = Math.pow(2, level);
        const posInLevel = index - (itemsInLevel - 1);

        const xBase = 100 / (itemsInLevel + 1);
        const x = xBase * (posInLevel + 1);
        const y = level * 80 + 40;

        return { x, y };
    };

    return (
        <div className="relative w-full h-[300px] flex items-center justify-center">
            <div className="relative w-full h-full max-w-2xl px-12">
                {/* Draw edges first */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
                    {data.map((_, i) => {
                        if (i === 0) return null;
                        const parentIdx = Math.floor((i - 1) / 2);
                        const parentPos = getPosition(parentIdx);
                        const childPos = getPosition(i);

                        return (
                            <line
                                key={`edge-${i}`}
                                x1={`${parentPos.x}%`}
                                y1={parentPos.y}
                                x2={`${childPos.x}%`}
                                y2={childPos.y}
                                stroke="white"
                                strokeWidth="2"
                                strokeOpacity="0.1"
                            />
                        );
                    })}
                </svg>

                {/* Draw Nodes */}
                {data.map((val, i) => {
                    const pos = getPosition(i);
                    const isActive = activeIndex === i;

                    return (
                        <motion.div
                            key={i}
                            layout
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            style={{ left: `${pos.x}%`, top: pos.y }}
                            className={`
                absolute -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full border-2 flex items-center justify-center font-bold font-mono transition-all duration-300
                ${isActive
                                    ? 'bg-accent-blue/20 border-accent-blue shadow-[0_0_15px_rgba(236, 65, 134,0.4)] scale-110 z-10 text-white'
                                    : 'bg-white/5 border-white/10 text-white/60'
                                }
              `}
                        >
                            {val}

                            {/* Index label */}
                            <div className="absolute -bottom-5 text-[8px] text-white/20 font-bold">
                                {i}
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Legend */}
            <div className="absolute bottom-0 right-0 p-4 flex flex-col items-end gap-2">
                <div className="px-3 py-1 rounded-full bg-accent-blue/10 border border-accent-blue/20 text-[10px] font-bold text-accent-blue uppercase tracking-widest">
                    {type.toUpperCase()} HEAP Engine
                </div>
            </div>
        </div>
    );
};
