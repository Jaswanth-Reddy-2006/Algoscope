import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Minus } from 'lucide-react'

// Advanced Heap Visualizer
// Demonstrates: Max Heap Property, Tree Structure (Array-based), Sift Up/Down Operations

const HeapVisualizer: React.FC = () => {
    // Initial State: Max Heap
    const [heap, setHeap] = useState<number[]>([50, 40, 30, 20, 10, 5])
    const [inputValue, setInputValue] = useState('')
    const [highlightIndex, setHighlightIndex] = useState<number | null>(null)
    const [compareIndex, setCompareIndex] = useState<number | null>(null) // For highlighting comparison
    const [message, setMessage] = useState('Max Heap: Parent ≥ Children')
    const [isAnimating, setIsAnimating] = useState(false)

    const sleep = (ms: number) => new Promise(r => setTimeout(r, ms))

    // --------------------------------------------------------------------------
    // Operations
    // --------------------------------------------------------------------------

    const handlePush = async () => {
        if (isAnimating) return
        const val = parseInt(inputValue) || Math.floor(Math.random() * 100)
        setIsAnimating(true)

        // 1. Insert at end
        setMessage(`Pushing ${val} to end of heap...`)
        const newHeap = [...heap, val]
        setHeap(newHeap)
        setHighlightIndex(newHeap.length - 1)
        await sleep(800)

        // 2. Sift Up
        await siftUp(newHeap, newHeap.length - 1)

        setIsAnimating(false)
        setInputValue('')
        setMessage('Ready.')
    }

    const siftUp = async (arr: number[], idx: number) => {
        let current = idx
        while (current > 0) {
            const parent = Math.floor((current - 1) / 2)

            setMessage(`Comparing [${current}] with Parent [${parent}]...`)
            setHighlightIndex(current)
            setCompareIndex(parent)
            await sleep(800)

            if (arr[current] > arr[parent]) {
                setMessage(`Child ${arr[current]} > Parent ${arr[parent]}. Swapping...`)

                // Swap
                const temp = arr[current]
                arr[current] = arr[parent]
                arr[parent] = temp
                setHeap([...arr])

                current = parent
                await sleep(800)
            } else {
                setMessage('Heap property satisfied.')
                break
            }
        }
        setHighlightIndex(null)
        setCompareIndex(null)
    }

    const handlePop = async () => {
        if (isAnimating) return
        if (heap.length === 0) {
            setMessage('Heap is empty.')
            return
        }

        setIsAnimating(true)

        const max = heap[0]
        const last = heap[heap.length - 1]

        const newHeap = [...heap]

        if (newHeap.length === 1) {
            setMessage(`Extracting Max: ${max}`)
            setHeap([])
            setIsAnimating(false)
            setMessage('Heap is empty.')
            return
        }

        // 1. Swap Root with Last
        setMessage(`Swapping Root (${max}) with Last (${last})...`)
        setHighlightIndex(0)
        await sleep(800)

        newHeap[0] = last
        newHeap.pop()
        setHeap([...newHeap])
        setMessage(`Removed ${max}. Sifting down NEW root ${last}...`)

        await sleep(800)

        // 2. Sift Down
        await siftDown(newHeap, 0)

        setIsAnimating(false)
        setMessage('Ready.')
    }

    const siftDown = async (arr: number[], idx: number) => {
        let current = idx
        const n = arr.length

        while (current < n) {
            const left = 2 * current + 1
            const right = 2 * current + 2
            let largest = current

            // Visualize comparison logic
            setHighlightIndex(current)
            setMessage(`Checking children of [${current}]...`)
            await sleep(600)

            if (left < n) {
                setCompareIndex(left)
                await sleep(400)
                if (arr[left] > arr[largest]) largest = left
            }

            if (right < n) {
                setCompareIndex(right)
                await sleep(400)
                if (arr[right] > arr[largest]) largest = right
            }

            setCompareIndex(null)

            if (largest !== current) {
                setMessage(`${arr[largest]} > ${arr[current]}. Swapping...`)
                const temp = arr[current]
                arr[current] = arr[largest]
                arr[largest] = temp
                setHeap([...arr])
                current = largest
                await sleep(800)
            } else {
                setMessage('Heap property satisfied.')
                break
            }
        }
        setHighlightIndex(null)
    }

    return (
        <div className="w-full h-full flex flex-col items-center justify-between p-6 bg-black/20">
            {/* Status Bar */}
            <div className="w-full flex justify-between items-center mb-4 px-4 h-10">
                <div className="font-bold text-white tracking-wider flex items-center gap-2">
                    <span className="text-accent-blue font-mono">MAX_HEAP</span>
                    <span className="text-[10px] bg-white/10 px-2 py-1 rounded text-white/50">Complete Binary Tree</span>
                </div>
                <div className="text-white/60 font-mono text-xs bg-white/5 py-1 px-3 rounded-lg border border-white/10">
                    {message}
                </div>
            </div>

            {/* Main Visual: Tree & Array */}
            <div className="flex-1 w-full flex flex-col items-center justify-center relative overflow-hidden">

                {/* Tree Visualization */}
                <div className="relative w-full h-[300px] flex items-center justify-center mb-8">
                    <AnimatePresence>
                        {heap.map((val, i) => {
                            // Calculate Tree Positions
                            const level = Math.floor(Math.log2(i + 1))
                            // Dynamic spacing based on level to prevent overlap
                            const maxNodesAtLevel = Math.pow(2, level)
                            const offset = i - (maxNodesAtLevel - 1)

                            // Adjust spacing multiplier based on depth (deeper levels need less spacing to fit)
                            const spacing = 300 / (level + 1)
                            const x = (offset - (maxNodesAtLevel - 1) / 2) * spacing
                            const y = level * 60 - 120

                            // Dynamic Line Drawing (to Parent)
                            // Ideally SVG, but for simple animation div lines work if careful
                            // skipping lines for simplicity or using a simpler connection in future

                            return (
                                <motion.div
                                    key={`${i}-${val}`} // Ideally unique ID, but index swap animation is tricky without it. For Heap simple viz, key by index is often smoother for "value swapping" feel, key by ID for "node moving" feel. Let's use value-index combo or just index for position stability.
                                    layout
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{
                                        x,
                                        y,
                                        opacity: 1,
                                        scale: 1,
                                        backgroundColor: highlightIndex === i
                                            ? 'rgba(16, 185, 129, 0.5)'
                                            : (compareIndex === i ? 'rgba(236, 72, 153, 0.4)' : 'rgba(0,0,0, 0.8)'),
                                        borderColor: highlightIndex === i
                                            ? '#10b981'
                                            : (compareIndex === i ? '#ec4899' : 'rgba(255,255,255,0.2)'),
                                        zIndex: highlightIndex === i ? 10 : 0
                                    }}
                                    exit={{ opacity: 0, scale: 0 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                    className="absolute w-10 h-10 rounded-full border-2 flex items-center justify-center text-white font-bold text-sm shadow-xl"
                                >
                                    {val}
                                    <span className="absolute -bottom-4 text-[8px] text-white/20 font-mono">{i}</span>
                                </motion.div>
                            )
                        })}
                    </AnimatePresence>
                </div>

                {/* Array Representation (Bottom) */}
                <div className="flex gap-1 p-4 bg-black/40 rounded-xl border border-white/5">
                    {heap.map((val, i) => (
                        <div
                            key={i}
                            className={`
                                w-8 h-8 rounded border flex items-center justify-center text-xs font-mono transition-colors duration-300
                                ${highlightIndex === i ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-white/5 border-white/10 text-white/50'}
                            `}
                        >
                            {val}
                        </div>
                    ))}
                    {heap.length === 0 && <span className="text-xs text-white/20 uppercase">Empty Heap</span>}
                </div>

            </div>

            {/* Controls */}
            <div className="w-full max-w-lg bg-black/40 backdrop-blur-md p-6 rounded-[24px] border border-white/10 flex flex-col gap-4">
                <div className="flex gap-4">
                    <div className="flex flex-col gap-1 w-32">
                        <label className="text-[9px] uppercase font-bold text-white/30">Value</label>
                        <input
                            type="number"
                            value={inputValue}
                            onChange={e => setInputValue(e.target.value)}
                            placeholder="val"
                            className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-center text-white font-mono focus:outline-none focus:border-accent-blue/50"
                        />
                    </div>

                    <div className="flex-1 flex gap-2 items-end">
                        <button onClick={handlePush} disabled={isAnimating} className="px-6 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 justify-center flex-1 h-10 transition-all disabled:opacity-50">
                            <Plus size={16} /> Push
                        </button>
                        <button onClick={handlePop} disabled={isAnimating} className="px-6 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 justify-center flex-1 h-10 transition-all disabled:opacity-50">
                            <Minus size={16} /> Pop Max
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-4 text-center">
                    <div>
                        <div className="text-[9px] text-white/20 font-bold uppercase tracking-widest mb-1">Peek Max</div>
                        <div className="text-emerald-400 font-mono text-xs">O(1)</div>
                    </div>
                    <div>
                        <div className="text-[9px] text-white/20 font-bold uppercase tracking-widest mb-1">Insert / Remove</div>
                        <div className="text-pink-400 font-mono text-xs">O(log N)</div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default HeapVisualizer
