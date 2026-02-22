import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Trash2, Search, ArrowRight, Layers } from 'lucide-react'

// Advanced Dynamic Array Visualizer
// Demonstrates: Capacity vs Size, O(1) Access, O(N) Shift, Resizing

const ArrayVisualizer: React.FC = () => {
    // Configuration

    // State
    const [elements, setElements] = useState<(number | null)[]>([10, 20, null, null]) // Null represents empty memory slots
    const [size, setSize] = useState(2)
    const [capacity, setCapacity] = useState(4)

    // Interaction State
    const [highlightedIndices, setHighlightedIndices] = useState<number[]>([])
    const [operationMsg, setOperationMsg] = useState('Ready.')
    const [inputValue, setInputValue] = useState('')
    const [inputIndex, setInputIndex] = useState('')
    const [isAnimating, setIsAnimating] = useState(false)

    // Helper to sync local state if needed, though we use 'elements' as source of truth for visual
    useEffect(() => {
        // Ensure elements array matches capacity
        if (elements.length !== capacity) {
            const newArr = [...elements]
            while (newArr.length < capacity) newArr.push(null)
            while (newArr.length > capacity) newArr.pop()
            setElements(newArr)
        }
    }, [capacity, elements])

    const sleep = (ms: number) => new Promise(r => setTimeout(r, ms))

    // --------------------------------------------------------------------------
    // Operations
    // --------------------------------------------------------------------------

    const handleAccess = async () => {
        if (isAnimating) return
        const idx = parseInt(inputIndex)
        if (isNaN(idx) || idx < 0 || idx >= size) {
            setOperationMsg('Index out of bounds!')
            return
        }

        setIsAnimating(true)
        setOperationMsg(`Accessing Index ${idx}... O(1)`)
        setHighlightedIndices([idx])
        await sleep(1000)
        setOperationMsg(`Value at [${idx}] is ${elements[idx]}`)
        await sleep(1000)
        setHighlightedIndices([])
        setOperationMsg('Ready.')
        setIsAnimating(false)
    }

    const handleSearch = async () => {
        if (isAnimating) return
        const val = parseInt(inputValue)
        if (isNaN(val)) return

        setIsAnimating(true)
        setOperationMsg(`Searching for value ${val}... O(N)`)

        for (let i = 0; i < size; i++) {
            setHighlightedIndices([i])
            await sleep(400)
            if (elements[i] === val) {
                setOperationMsg(`Found ${val} at Index ${i}!`)
                await sleep(1000)
                setHighlightedIndices([])
                setIsAnimating(false)
                return
            }
        }

        setOperationMsg(`${val} not found.`)
        setHighlightedIndices([])
        await sleep(1000)
        setIsAnimating(false)
    }

    const handlePush = async () => {
        if (isAnimating) return
        const val = parseInt(inputValue) || Math.floor(Math.random() * 100)
        setIsAnimating(true)

        // Check Capacity
        if (size === capacity) {
            setOperationMsg('Capacity Full! Resizing array... O(N)')
            await handleResize()
        }

        setOperationMsg(`Pushing ${val} to index ${size}... O(1)`)

        // Update Array
        const newArr = [...elements]
        newArr[size] = val
        setElements(newArr)
        setHighlightedIndices([size])
        setSize(prev => prev + 1)

        await sleep(800)
        setHighlightedIndices([])
        setOperationMsg('Ready.')
        setIsAnimating(false)
        setInputValue('')
    }

    const handleInsertAt = async () => {
        if (isAnimating) return
        const val = parseInt(inputValue) || Math.floor(Math.random() * 100)
        const idx = parseInt(inputIndex)

        if (isNaN(idx) || idx < 0 || idx > size) {
            setOperationMsg('Invalid Index.')
            return
        }

        setIsAnimating(true)

        // Check Capacity
        if (size === capacity) {
            setOperationMsg('Capacity Full! Triggers Resize first...')
            await handleResize()
        }

        setOperationMsg(`Shifting elements from index ${idx} to right... O(N)`)

        // Animate Shift
        // We simulate shift by highlighting from end to idx
        const newArr = [...elements]

        for (let i = size; i > idx; i--) {
            setHighlightedIndices([i, i - 1])
            // Visual shift
            newArr[i] = newArr[i - 1]
            setElements([...newArr]) // Force render
            await sleep(300)
        }

        // Insert
        setOperationMsg(`Inserting ${val} at index ${idx}...`)
        newArr[idx] = val
        setElements(newArr)
        setSize(prev => prev + 1)
        setHighlightedIndices([idx])

        await sleep(800)
        setHighlightedIndices([])
        setOperationMsg('Ready.')
        setIsAnimating(false)
        setInputValue('')
    }

    const handleDeleteAt = async () => {
        if (isAnimating) return
        const idx = parseInt(inputIndex)

        if (isNaN(idx) || idx < 0 || idx >= size) {
            setOperationMsg('Invalid Index.')
            return
        }

        setIsAnimating(true)
        setOperationMsg(`Deleting at index ${idx}... Shifting left O(N)`)

        const newArr = [...elements]

        // Animate Shift
        for (let i = idx; i < size - 1; i++) {
            setHighlightedIndices([i, i + 1])
            // Visual shift
            newArr[i] = newArr[i + 1]
            setElements([...newArr])
            await sleep(300)
        }

        // Clear last
        newArr[size - 1] = null
        setElements(newArr)
        setSize(prev => prev - 1)
        setHighlightedIndices([])

        await sleep(500)
        setOperationMsg('Ready.')
        setIsAnimating(false)
    }

    const handleResize = async () => {
        const newCapacity = capacity * 2

        // Visual cue for allocating new memory
        // In a real visualizer, we might show a separate array being created. 
        // Here we just expand the current visual block.
        const expandedArr = [...elements]
        while (expandedArr.length < newCapacity) expandedArr.push(null)

        setCapacity(newCapacity)
        setElements(expandedArr)

        await sleep(1000)
    }

    return (
        <div className="w-full h-full flex flex-col items-center justify-between p-6 bg-black/20">
            {/* Status Bar */}
            <div className="w-full flex justify-between items-center mb-4 px-4">
                <div className="flex gap-6 font-mono text-sm">
                    <div className="flex flex-col">
                        <span className="text-white/40 uppercase text-[10px] font-bold tracking-widest">Size</span>
                        <span className="text-emerald-400 font-bold text-xl">{size}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-white/40 uppercase text-[10px] font-bold tracking-widest">Capacity</span>
                        <span className="text-blue-400 font-bold text-xl">{capacity}</span>
                    </div>
                </div>
                <div className="text-white/60 font-mono text-sm bg-white/5 py-1 px-3 rounded-lg border border-white/10">
                    {operationMsg}
                </div>
            </div>

            {/* Main Memory Visualization */}
            <div className="flex-1 w-full flex items-center justify-start overflow-x-auto custom-scrollbar p-10 min-h-[200px] border border-dashed border-white/10 rounded-2xl bg-black/20 relative">
                <div className="flex gap-2 relative">
                    {elements.map((el, i) => (
                        <motion.div
                            key={i}
                            layout
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{
                                opacity: 1,
                                scale: 1,
                                backgroundColor: i < size
                                    ? (highlightedIndices.includes(i) ? 'rgba(59, 130, 246, 0.4)' : 'rgba(59, 130, 246, 0.1)')
                                    : 'rgba(255, 255, 255, 0.02)',
                                borderColor: highlightedIndices.includes(i) ? '#3b82f6' : (i < size ? 'rgba(59, 130, 246, 0.3)' : 'rgba(255, 255, 255, 0.05)'),
                                y: highlightedIndices.includes(i) ? -10 : 0
                            }}
                            className={`
                                w-16 h-24 rounded-lg border-2 flex flex-col items-center justify-center relative
                                ${i >= capacity ? 'opacity-50' : ''}
                            `}
                        >
                            {/* Value */}
                            <span className={`text-xl font-bold font-mono ${i < size ? 'text-white' : 'text-white/10 italic'}`}>
                                {el !== null ? el : 'ø'}
                            </span>

                            {/* Index */}
                            <div className="absolute -bottom-8 text-[10px] font-mono text-white/30 flex flex-col items-center">
                                <span>{i}</span>
                                <div className="w-px h-2 bg-white/10 mt-1" />
                            </div>

                        </motion.div>
                    ))}

                    {/* Capacity Marker / Virtual Expansion */}
                    <div className="absolute top-0 bottom-0 -right-4 w-4 bg-gradient-to-r from-transparent to-white/5 pointer-events-none" />
                </div>
            </div>

            {/* Controls */}
            <div className="w-full max-w-3xl bg-black/40 backdrop-blur-md p-6 rounded-[24px] border border-white/10 mt-8 flex flex-col gap-4">
                {/* Inputs */}
                <div className="flex gap-4">
                    <div className="flex flex-col gap-1 w-24">
                        <label className="text-[9px] uppercase font-bold text-white/30">Index</label>
                        <input
                            type="number"
                            value={inputIndex}
                            onChange={e => setInputIndex(e.target.value)}
                            placeholder="i"
                            className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white font-mono focus:border-accent-blue/50 outline-none text-center"
                        />
                    </div>
                    <div className="flex flex-col gap-1 w-24">
                        <label className="text-[9px] uppercase font-bold text-white/30">Value</label>
                        <input
                            type="number"
                            value={inputValue}
                            onChange={e => setInputValue(e.target.value)}
                            placeholder="val"
                            className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white font-mono focus:border-accent-blue/50 outline-none text-center"
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex-1 flex flex-wrap gap-2 items-end">
                        <button onClick={handleAccess} disabled={isAnimating} className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 transition-all disabled:opacity-50">
                            <ArrowRight size={14} /> Get(i)
                        </button>
                        <button onClick={handleSearch} disabled={isAnimating} className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 transition-all disabled:opacity-50">
                            <Search size={14} /> Find(v)
                        </button>
                        <button onClick={handlePush} disabled={isAnimating} className="px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all disabled:opacity-50">
                            <Plus size={14} /> Push(v)
                        </button>
                        <button onClick={handleInsertAt} disabled={isAnimating} className="px-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-400 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all disabled:opacity-50">
                            <Layers size={14} /> Insert(i,v)
                        </button>
                        <button onClick={handleDeleteAt} disabled={isAnimating} className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all disabled:opacity-50">
                            <Trash2 size={14} /> Remove(i)
                        </button>
                    </div>
                </div>

                {/* Complexity Legend */}
                <div className="grid grid-cols-4 gap-4 pt-4 border-t border-white/5 text-center">
                    <div>
                        <div className="text-[9px] uppercase text-white/30 font-bold mb-1">Access</div>
                        <div className="text-emerald-400 font-mono text-xs">O(1)</div>
                    </div>
                    <div>
                        <div className="text-[9px] uppercase text-white/30 font-bold mb-1">Search</div>
                        <div className="text-pink-400 font-mono text-xs">O(N)</div>
                    </div>
                    <div>
                        <div className="text-[9px] uppercase text-white/30 font-bold mb-1">Insert</div>
                        <div className="text-pink-400 font-mono text-xs">O(N)*</div>
                    </div>
                    <div>
                        <div className="text-[9px] uppercase text-white/30 font-bold mb-1">Space</div>
                        <div className="text-blue-400 font-mono text-xs">O(N)</div>
                    </div>
                </div>
            </div>

            <div className="mt-4 text-[10px] text-white/30 italic">
                *Insert is O(N) due to shifting, or amortized O(1) at end (with resizing).
            </div>
        </div>
    )
}

export default ArrayVisualizer
