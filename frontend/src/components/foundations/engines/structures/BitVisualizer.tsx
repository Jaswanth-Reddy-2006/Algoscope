import React, { useState } from 'react'

const BitVisualizer: React.FC = () => {
    const [num, setNum] = useState<number>(42)
    const [operation, setOperation] = useState('none')
    const [operand, setOperand] = useState(0)

    const bits = num.toString(2).padStart(8, '0').split('').map(Number)
    const operandBits = operand.toString(2).padStart(8, '0').split('').map(Number)

    // Calculate result bits based on op
    const result = operation === '&' ? (num & operand) :
        operation === '|' ? (num | operand) :
            operation === '^' ? (num ^ operand) :
                num

    const resultBits = result.toString(2).padStart(8, '0').split('').map(Number)

    return (
        <div className="w-full h-full flex flex-col items-center justify-center p-8 gap-8 font-mono text-white">

            {/* Input Row */}
            <div className="flex flex-col gap-2 items-end">
                <div className="flex gap-2 items-center">
                    <span className="text-white/40 text-xs w-16 text-right">A ({num})</span>
                    {bits.map((b, i) => (
                        <div key={i} className={`w-8 h-8 rounded border flex items-center justify-center font-bold ${b ? 'bg-blue-500/20 text-blue-400 border-blue-500' : 'bg-white/5 border-white/10 text-white/20'}`}>
                            {b}
                        </div>
                    ))}
                </div>

                {operation !== 'none' && (
                    <>
                        <div className="flex gap-2 items-center">
                            <span className="text-white/40 text-xs w-16 text-right font-bold text-yellow-400">{operation}</span>
                            <div className="w-8 h-8 flex items-center justify-center text-yellow-400 font-bold opacity-0"></div>
                        </div>

                        <div className="flex gap-2 items-center">
                            <span className="text-white/40 text-xs w-16 text-right">B ({operand})</span>
                            {operandBits.map((b, i) => (
                                <div key={i} className={`w-8 h-8 rounded border flex items-center justify-center font-bold ${b ? 'bg-purple-500/20 text-purple-400 border-purple-500' : 'bg-white/5 border-white/10 text-white/20'}`}>
                                    {b}
                                </div>
                            ))}
                        </div>

                        <div className="w-full h-px bg-white/20 my-2" />

                        <div className="flex gap-2 items-center">
                            <span className="text-white/40 text-xs w-16 text-right text-emerald-400 font-bold">Res ({result})</span>
                            {resultBits.map((b, i) => (
                                <div key={i} className={`w-8 h-8 rounded border flex items-center justify-center font-bold ${b ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]' : 'bg-white/5 border-white/10 text-white/20'}`}>
                                    {b}
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* Controls */}
            <div className="flex flex-col gap-4 bg-white/5 p-6 rounded-xl border border-white/10 w-full max-w-lg mt-8">
                <div className="flex gap-4 w-full">
                    <div className="flex flex-col gap-1 flex-1">
                        <label className="text-[10px] uppercase text-white/40 font-bold">Value A</label>
                        <input
                            type="number"
                            value={num}
                            onChange={e => setNum(parseInt(e.target.value) || 0)}
                            className="bg-black/40 border border-white/20 rounded px-3 py-2 text-white font-mono"
                        />
                    </div>
                    <div className="flex flex-col gap-1 flex-1">
                        <label className="text-[10px] uppercase text-white/40 font-bold">Operation</label>
                        <select
                            value={operation}
                            onChange={e => setOperation(e.target.value)}
                            className="bg-black/40 border border-white/20 rounded px-3 py-2 text-white font-mono"
                        >
                            <option value="none">Visualize...</option>
                            <option value="&">AND (&)</option>
                            <option value="|">OR (|)</option>
                            <option value="^">XOR (^)</option>
                        </select>
                    </div>
                    {operation !== 'none' && (
                        <div className="flex flex-col gap-1 flex-1">
                            <label className="text-[10px] uppercase text-white/40 font-bold">Value B</label>
                            <input
                                type="number"
                                value={operand}
                                onChange={e => setOperand(parseInt(e.target.value) || 0)}
                                className="bg-black/40 border border-white/20 rounded px-3 py-2 text-white font-mono"
                            />
                        </div>
                    )}
                </div>
            </div>

            <div className="text-[10px] text-white/30 text-center max-w-md">
                Bitwise operators perform logic on each bit position independently (parallel processing).
            </div>
        </div>
    )
}

export default BitVisualizer
