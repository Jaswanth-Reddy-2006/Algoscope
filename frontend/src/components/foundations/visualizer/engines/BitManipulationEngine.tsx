import React from 'react';
import { motion } from 'framer-motion';

interface Props {
    value: number;
    highlightBits?: number[];
}

export const BitManipulationEngine: React.FC<Props> = ({ value, highlightBits = [] }) => {
    // Convert number to 8-bit binary array
    const bits = value.toString(2).padStart(8, '0').split('').map(Number);

    return (
        <div className="flex flex-col items-center gap-8 p-12">
            <div className="flex gap-3">
                {bits.map((bit, i) => {
                    const bitPos = 7 - i;
                    const isHighlighted = highlightBits.includes(bitPos);

                    return (
                        <motion.div
                            key={bitPos}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: i * 0.05 }}
                            className="flex flex-col items-center gap-2"
                        >
                            <div
                                className={`
                  w-12 h-16 rounded-xl border-2 flex items-center justify-center text-2xl font-mono font-bold transition-all duration-300
                  ${bit === 1
                                        ? 'bg-accent-blue/20 border-accent-blue text-accent-blue shadow-[0_0_15px_rgba(236, 65, 134,0.3)]'
                                        : 'bg-white/5 border-white/10 text-white/20'
                                    }
                  ${isHighlighted ? 'scale-110 !border-purple-500 !shadow-[0_0_20px_rgba(236, 65, 134,0.5)]' : ''}
                `}
                            >
                                {bit}
                            </div>
                            <span className="text-[10px] font-bold text-white/20 font-mono">2^{bitPos}</span>
                        </motion.div>
                    );
                })}
            </div>

            <div className="flex items-center gap-6">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center min-w-[120px]">
                    <div className="text-[10px] font-bold text-white/20 uppercase tracking-widest mb-1">Decimal</div>
                    <div className="text-3xl font-bold font-mono text-accent-blue">{value}</div>
                </div>
                <div className="text-white/20 text-3xl font-light">=</div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center min-w-[200px]">
                    <div className="text-[10px] font-bold text-white/20 uppercase tracking-widest mb-1">Binary Representation</div>
                    <div className="text-xl font-bold font-mono text-white/60 tracking-widest">0b{bits.join('')}</div>
                </div>
            </div>
        </div>
    );
};
