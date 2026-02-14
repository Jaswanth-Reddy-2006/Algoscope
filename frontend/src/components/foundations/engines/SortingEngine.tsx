import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, RotateCcw, Zap } from 'lucide-react'

interface Props {
    moduleId: string
}

const SortingEngine: React.FC<Props> = ({ moduleId }) => {
    const [array, setArray] = useState<number[]>([])
    const [pointers, setPointers] = useState<{ [key: string]: number }>({})
    const [status, setStatus] = useState<'idle' | 'running' | 'paused' | 'finished'>('idle')
    const [speed, setSpeed] = useState(500)
    const [explanation, setExplanation] = useState('')

    // Initialize random array
    const reset = useCallback(() => {
        const newArr = Array.from({ length: 12 }, () => Math.floor(Math.random() * 90) + 10)
        setArray(newArr)
        setPointers({})
        setStatus('idle')
        setExplanation('Press Start to begin the visualization.')
    }, [])

    useEffect(() => {
        reset()
    }, [reset])

    // Algorithm Logic
    const runStep = useCallback(async () => {
        if (status !== 'running') return

        const newArr = [...array]
        let newPointers = { ...pointers }

        if (moduleId === 'bubble_sort') {
            const { i = 0, j = 0 } = pointers as { i: number, j: number }
            const n = newArr.length

            if (i < n - 1) {
                if (j < n - i - 1) {
                    newPointers = { ...newPointers, active: j, comparing: j + 1, i, j }
                    setExplanation(`Comparing ${newArr[j]} and ${newArr[j + 1]}`)
                    if (newArr[j] > newArr[j + 1]) {
                        setExplanation(`Swapping ${newArr[j]} and ${newArr[j + 1]}`)
                        const temp = newArr[j]
                        newArr[j] = newArr[j + 1]
                        newArr[j + 1] = temp
                    }
                    newPointers.j = j + 1
                } else {
                    newPointers.j = 0
                    newPointers.i = i + 1
                    newPointers.sorted = n - i - 1
                }
            } else {
                setStatus('finished')
                setExplanation('Sorting complete!')
                newPointers = { sorted: 0 }
            }
        } else if (moduleId === 'selection_sort') {
            const { i = 0, j = 1, minIdx = 0 } = pointers as { i: number, j: number, minIdx: number }
            const n = newArr.length

            if (i < n - 1) {
                if (j < n) {
                    newPointers = { ...newPointers, active: minIdx, comparing: j, i, j, minIdx }
                    setExplanation(`Checking if ${newArr[j]} is smaller than current minimum ${newArr[minIdx]}`)
                    if (newArr[j] < newArr[minIdx]) {
                        newPointers.minIdx = j
                        setExplanation(`New minimum found: ${newArr[j]}`)
                    }
                    newPointers.j = j + 1
                } else {
                    setExplanation(`Swapping minimum ${newArr[minIdx]} with position ${i}`)
                    const temp = newArr[i]
                    newArr[i] = newArr[minIdx]
                    newArr[minIdx] = temp
                    newPointers.i = i + 1
                    newPointers.j = i + 2
                    newPointers.minIdx = i + 1
                    newPointers.sorted = i + 1
                }
            } else {
                setStatus('finished')
                setExplanation('Sorting complete!')
                newPointers = { sorted: n }
            }
        } else {
            setExplanation(`${moduleId.replace('_', ' ')} visualization engine initializing. Select a different sorting pattern for active analysis.`)
            setStatus('paused')
        }

        setArray(newArr)
        setPointers(newPointers)
    }, [array, pointers, status, moduleId])

    useEffect(() => {
        let interval: any
        if (status === 'running') {
            interval = setInterval(runStep, speed)
        }
        return () => clearInterval(interval)
    }, [status, speed, runStep])

    // Utility to get bar color
    const getBarColor = (index: number) => {
        if (pointers.active === index) return 'bg-accent-blue shadow-glow-blue'
        if (pointers.comparing === index) return 'bg-amber-400 shadow-glow-amber'
        if (pointers.sorted >= 0 && index >= pointers.sorted) return 'bg-emerald-500/50'
        return 'bg-white/10'
    }

    return (
        <div className="w-full h-full flex flex-col">
            {/* Visualizer Area */}
            <div className="flex-1 flex items-end justify-center gap-2 px-12 pb-12">
                {array.map((value, idx) => (
                    <div key={idx} className="flex flex-col items-center flex-1 max-w-[40px] gap-4">
                        <AnimatePresence mode="wait">
                            <motion.div
                                layout
                                key={idx}
                                initial={{ scaleY: 0 }}
                                animate={{ scaleY: 1 }}
                                className={`w-full rounded-t-lg transition-colors duration-300 ${getBarColor(idx)}`}
                                style={{ height: `${value * 3}px` }}
                            />
                        </AnimatePresence>
                        <span className="text-[10px] font-mono text-white/40">{value}</span>
                    </div>
                ))}
            </div>

            {/* Controls */}
            <div className="h-24 bg-black/40 border-t border-white/5 px-8 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setStatus(status === 'running' ? 'paused' : 'running')}
                        className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform"
                    >
                        {status === 'running' ? <Pause size={20} /> : <Play size={20} className="ml-1" />}
                    </button>
                    <button
                        onClick={reset}
                        className="w-10 h-10 rounded-full bg-white/5 text-white/60 flex items-center justify-center hover:bg-white/10 transition-colors"
                    >
                        <RotateCcw size={18} />
                    </button>
                </div>

                <div className="flex-1 px-12">
                    <p className="text-sm text-white/80 font-light italic text-center">
                        {explanation}
                    </p>
                </div>

                <div className="flex items-center gap-6">
                    <div className="flex flex-col gap-1">
                        <span className="text-[10px] text-white/20 uppercase tracking-widest font-bold">Engine Speed</span>
                        <input
                            type="range"
                            min="50"
                            max="1000"
                            value={status === 'running' ? speed : 1050 - speed}
                            onChange={(e) => setSpeed(1050 - parseInt(e.target.value))}
                            className="w-32 accent-accent-blue"
                        />
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-500">
                        <Zap size={14} />
                        <span className="text-[10px] font-bold uppercase tracking-wider">Live</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SortingEngine
