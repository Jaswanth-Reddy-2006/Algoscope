import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Play, Search, Grid, ArrowRight, ArrowDown } from 'lucide-react'

// Advanced Matrix Visualizer
// Demonstrates: 2D Grid Memory, Row-Major Traversal, Coordinate Access

const MatrixVisualizer: React.FC = () => {
    // Config
    const ROWS = 4
    const COLS = 4

    // State
    const [matrix] = useState<number[][]>(() =>
        Array.from({ length: ROWS }, () =>
            Array.from({ length: COLS }, () => Math.floor(Math.random() * 20))
        )
    )
    const [highlighted, setHighlighted] = useState<{ r: number, c: number } | null>(null)
    const [message, setMessage] = useState('Ready.')
    const [isAnimating, setIsAnimating] = useState(false)

    // Inputs
    const [inputRow, setInputRow] = useState('')
    const [inputCol, setInputCol] = useState('')

    const sleep = (ms: number) => new Promise(r => setTimeout(r, ms))

    const handleTraverse = async () => {
        if (isAnimating) return
        setIsAnimating(true)
        setMessage('Traversing Row-Major... O(M*N)')

        for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS; c++) {
                setHighlighted({ r, c })
                await sleep(200)
            }
        }
        setHighlighted(null)
        setMessage('Traversal Complete.')
        setIsAnimating(false)
    }

    const handleAccess = async () => {
        if (isAnimating) return
        const r = parseInt(inputRow)
        const c = parseInt(inputCol)

        if (isNaN(r) || isNaN(c) || r < 0 || r >= ROWS || c < 0 || c >= COLS) {
            setMessage('Invalid Coordinates.')
            return
        }

        setIsAnimating(true)
        setMessage(`Accessing cell [${r}][${c}]... O(1)`)
        setHighlighted({ r, c })

        await sleep(1000)
        setMessage(`Value: ${matrix[r][c]}`)
        await sleep(1000)

        setHighlighted(null)
        setMessage('Ready.')
        setIsAnimating(false)
    }

    const handleRowScan = async () => {
        if (isAnimating) return
        const r = parseInt(inputRow)
        if (isNaN(r) || r < 0 || r >= ROWS) {
            setMessage('Invalid Row.')
            return
        }

        setIsAnimating(true)
        setMessage(`Scanning Row ${r}...`)

        for (let c = 0; c < COLS; c++) {
            setHighlighted({ r, c })
            await sleep(300)
        }

        setHighlighted(null)
        setMessage('Ready.')
        setIsAnimating(false)
    }

    const handleColScan = async () => {
        if (isAnimating) return
        const c = parseInt(inputCol)
        if (isNaN(c) || c < 0 || c >= COLS) {
            setMessage('Invalid Column.')
            return
        }

        setIsAnimating(true)
        setMessage(`Scanning Column ${c}...`)

        for (let r = 0; r < ROWS; r++) {
            setHighlighted({ r, c })
            await sleep(300)
        }

        setHighlighted(null)
        setMessage('Ready.')
        setIsAnimating(false)
    }

    return (
        <div className="w-full h-full flex flex-col items-center justify-between p-6 bg-black/20">
            {/* Status Bar */}
            <div className="w-full flex justify-between items-center mb-4 px-4 h-10">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                        <Grid size={16} />
                    </div>
                    <span className="font-bold text-white tracking-wider">2D Matrix</span>
                </div>
                <div className="text-white/60 font-mono text-xs bg-white/5 py-1 px-3 rounded-lg border border-white/10">
                    {message}
                </div>
            </div>

            {/* Matrix Visual */}
            <div className="flex-1 w-full flex items-center justify-center p-8 overflow-hidden">
                <div className="relative p-6 bg-white/[0.02] rounded-2xl border border-white/5 backdrop-blur-sm">
                    {/* Column Indices */}
                    <div className="flex gap-2 mb-2 ml-8 justify-center">
                        {Array.from({ length: COLS }).map((_, i) => (
                            <div key={i} className="w-14 text-center text-[10px] text-white/30 font-mono">
                                {i}
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-col gap-2">
                        {matrix.map((row, r) => (
                            <div key={r} className="flex gap-2 items-center">
                                {/* Row Index */}
                                <div className="w-6 text-right text-[10px] text-white/30 font-mono mr-2">
                                    {r}
                                </div>

                                {row.map((val, c) => (
                                    <motion.div
                                        key={`${r}-${c}`}
                                        animate={{
                                            backgroundColor: highlighted?.r === r && highlighted?.c === c ? 'rgba(99, 102, 241, 0.5)' : 'rgba(255, 255, 255, 0.03)',
                                            scale: highlighted?.r === r && highlighted?.c === c ? 1.15 : 1,
                                            borderColor: highlighted?.r === r && highlighted?.c === c ? '#6366f1' : 'rgba(255, 255, 255, 0.1)',
                                            zIndex: highlighted?.r === r && highlighted?.c === c ? 10 : 1
                                        }}
                                        className="w-14 h-14 border rounded-lg flex items-center justify-center text-white font-mono text-lg font-bold shadow-sm relative group cursor-pointer hover:bg-white/10"
                                        onClick={() => {
                                            setInputRow(r.toString())
                                            setInputCol(c.toString())
                                        }}
                                    >
                                        {val}
                                        {/* Coord Tooltip */}
                                        <div className="absolute opacity-0 group-hover:opacity-100 -bottom-4 bg-black/80 px-1 rounded text-[8px] pointer-events-none transition-opacity">
                                            {r},{c}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="w-full max-w-2xl bg-black/40 backdrop-blur-md p-6 rounded-[24px] border border-white/10 flex flex-col gap-4">
                <div className="flex gap-4">
                    <div className="flex gap-2 w-32">
                        <div className="flex flex-col gap-1 flex-1">
                            <label className="text-[9px] uppercase font-bold text-white/30">Row</label>
                            <input type="number" value={inputRow} onChange={(e) => setInputRow(e.target.value)} placeholder="r" className="w-full bg-white/5 border border-white/10 rounded-xl px-2 py-2 text-center text-white font-mono focus:outline-none focus:border-accent-blue/50" />
                        </div>
                        <div className="flex flex-col gap-1 flex-1">
                            <label className="text-[9px] uppercase font-bold text-white/30">Col</label>
                            <input type="number" value={inputCol} onChange={(e) => setInputCol(e.target.value)} placeholder="c" className="w-full bg-white/5 border border-white/10 rounded-xl px-2 py-2 text-center text-white font-mono focus:outline-none focus:border-accent-blue/50" />
                        </div>
                    </div>

                    <div className="flex-1 flex gap-2 items-end">
                        <button onClick={handleAccess} disabled={isAnimating} className="px-4 py-2 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 justify-center flex-1 h-10 transition-all disabled:opacity-50">
                            <Search size={14} /> Get(r,c)
                        </button>
                        <button onClick={handleRowScan} disabled={isAnimating} className="px-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 justify-center flex-1 h-10 transition-all disabled:opacity-50">
                            <ArrowRight size={14} /> Row Scan
                        </button>
                        <button onClick={handleColScan} disabled={isAnimating} className="px-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 justify-center flex-1 h-10 transition-all disabled:opacity-50">
                            <ArrowDown size={14} /> Col Scan
                        </button>
                        <button onClick={handleTraverse} disabled={isAnimating} className="px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 justify-center flex-1 h-10 transition-all disabled:opacity-50">
                            <Play size={14} /> Traverse
                        </button>
                    </div>
                </div>
            </div>

            <div className="mt-4 text-[10px] text-white/30 italic">
                Memory is logically 2D, but physically linear (usually row-major).
            </div>
        </div>
    )
}

export default MatrixVisualizer
