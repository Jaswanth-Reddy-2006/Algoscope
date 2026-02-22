import React, { useState } from 'react'
import { motion } from 'framer-motion'


const PrefixSumVisualizer: React.FC = () => {
    const [nums] = useState<number[]>([1, 2, 3, 4, 5])
    const [prefix] = useState<number[]>([0, 1, 3, 6, 10, 15])
    const [highlightIndex, setHighlightIndex] = useState<number | null>(null)
    const [range, setRange] = useState({ l: 1, r: 3 }) // 0-indexed for nums

    const handleCalc = async () => {
        // Show range calculation
        setHighlightIndex(range.r + 1) // Right bound in P
        await new Promise(r => setTimeout(r, 1000))
        setHighlightIndex(range.l) // Left bound in P
        await new Promise(r => setTimeout(r, 1000))
        setHighlightIndex(null)
    }

    return (
        <div className="w-full h-full flex flex-col items-center justify-start p-8 gap-8 overflow-y-auto">

            <div className="w-full max-w-4xl flex flex-col gap-2">
                <div className="text-white/40 font-mono text-xs mb-1">Index: </div>
                <div className="flex gap-1 h-32 items-end">
                    {/* Index markers */}
                    {Object.keys(nums).map(i => (
                        <div key={i} className="w-12 text-center text-white/20 text-xs">{i}</div>
                    ))}
                </div>
            </div>

            {/* NUMS Array */}
            <div className="flex flex-col gap-2 w-full items-center">
                <div className="text-white/60 font-bold mb-2">Original Array (A)</div>
                <div className="flex gap-2">
                    {nums.map((val, i) => (
                        <motion.div
                            key={i}
                            className={`w-12 h-12 rounded-lg border border-white/10 flex items-center justify-center text-white font-bold
                                ${i >= range.l && i <= range.r ? 'bg-blue-500/20 border-blue-500' : 'bg-white/5'}
                            `}
                        >
                            {val}
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Prefix Sum Array */}
            <div className="flex flex-col gap-2 w-full items-center mt-8">
                <div className="text-white/60 font-bold mb-2">Prefix Sum Array (P)</div>
                <div className="flex gap-2 relative">
                    {prefix.map((val, i) => (
                        <motion.div
                            key={i}
                            animate={{
                                scale: highlightIndex === i ? 1.2 : 1,
                                borderColor: highlightIndex === i ? '#ec4899' : 'rgba(255,255,255,0.1)',
                                backgroundColor: highlightIndex === i ? 'rgba(236, 72, 153, 0.2)' : 'rgba(255,255,255,0.05)'
                            }}
                            className="w-12 h-12 rounded-lg border flex items-center justify-center text-white font-bold relative"
                        >
                            {val}
                            <span className="absolute -bottom-4 text-[8px] text-white/30">{i}</span>
                        </motion.div>
                    ))}

                    {/* Logic Arrow */}
                    {highlightIndex !== null && (
                        <div className="absolute -top-8 left-0 w-full flex justify-center text-pink-400 font-mono text-xs">
                            Reading P[{highlightIndex}]
                        </div>
                    )}
                </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col items-center gap-4 bg-white/5 p-6 rounded-2xl border border-white/10 mt-8">
                <div className="flex gap-4 items-center">
                    <span className="text-white/60 font-mono">Range(L, R):</span>
                    <input
                        type="number"
                        value={range.l}
                        onChange={e => setRange({ ...range, l: parseInt(e.target.value) })}
                        className="w-12 bg-black/40 border border-white/20 rounded px-2 text-center text-white"
                    />
                    <span className="text-white/40">-</span>
                    <input
                        type="number"
                        value={range.r}
                        onChange={e => setRange({ ...range, r: parseInt(e.target.value) })}
                        className="w-12 bg-black/40 border border-white/20 rounded px-2 text-center text-white"
                    />
                    <button onClick={handleCalc} className="px-4 py-2 bg-pink-500 text-white font-bold rounded-lg ml-4">
                        Calculate Sum
                    </button>
                </div>
                <div className="text-emerald-400 font-mono text-xl">
                    Sum = P[{range.r + 1}] - P[{range.l}] = {prefix[range.r + 1]} - {prefix[range.l]} = {prefix[range.r + 1] - prefix[range.l]}
                </div>
            </div>
        </div>
    )
}

export default PrefixSumVisualizer
