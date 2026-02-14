// @ts-nocheck
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowDown, Plus, Trash2, Search, ArrowRight } from 'lucide-react'

const ArrayVisualizer: React.FC = () => {
    const [array, setArray] = useState<(number | null)[]>([10, 20, 30, 40, null, null])
    const [capacity, setCapacity] = useState(6)
    const [size, setSize] = useState(4)
    const [highlightIndex, setHighlightIndex] = useState<number | null>(null)
    const [accessIndex, setAccessIndex] = useState<string>('')
    const [insertValue, setInsertValue] = useState<string>('')
    const [insertIndex, setInsertIndex] = useState<string>('')
    const [message, setMessage] = useState<string>('Array of capacity 6, size 4.')
    const [operation, setOperation] = useState<'access' | 'insert' | 'delete' | null>(null)

    // O(1) Access
    const handleAccess = () => {

        setHighlightedIndex(idx)
        setTimeout(() => {
            setHighlightedIndex(null)

        }, 1000)
        setInputValue('')
    }

    const handleSearch = async () => {
        const val = parseInt(inputValue)
        if (isNaN(val)) return


        for (let i = 0; i < elements.length; i++) {
            setHighlightedIndex(i)
            await new Promise(r => setTimeout(r, 400))
            if (elements[i] === val) {
                // Found
                setTimeout(() => {
                    setHighlightedIndex(null)

                }, 1000)
                return
            }
        }
        setHighlightedIndex(null)
    }

    const handleInsert = async () => {
        // Insert at index (default to end if not specified or invalid)
        // For simplicity in this UI, we might just append or insert at random index to show shifting
        // Let's implement specific index insertion if input is "val,idx" or just append for now
        // To show O(N), let's insert at index 1 forcefully if length > 1

        const val = parseInt(inputValue) || Math.floor(Math.random() * 100)

        if (elements.length > 6) {
            // Limit size for visual clarity
            return
        }

        // Inserting at index 2 to show shift
        const insertIdx = elements.length > 2 ? 2 : elements.length

        const newArr = [...elements]
        newArr.splice(insertIdx, 0, val)
        setElements(newArr)
        setHighlightedIndex(insertIdx)
        setTimeout(() => setHighlightedIndex(null), 1000)
        setInputValue('')
    }

    const handleDelete = () => {
        const idx = parseInt(inputValue)
        if (isNaN(idx) || idx < 0 || idx >= elements.length) {
            // Delete random if invalid input
            if (elements.length === 0) return
            const rIdx = Math.floor(Math.random() * elements.length)
            const newArr = elements.filter((_, i) => i !== rIdx)
            setElements(newArr)
        } else {
            const newArr = elements.filter((_, i) => i !== idx)
            setElements(newArr)
        }
        setInputValue('')
    }

    return (
        <div className="w-full h-full flex flex-col items-center justify-between p-8">
            {/* Visualization Area */}
            <div className="flex-1 w-full flex items-center justify-center overflow-x-auto custom-scrollbar p-10">
                <div className="flex items-end gap-1">
                    <AnimatePresence mode="popLayout">
                        {elements.map((el, i) => (
                            <motion.div
                                key={`${i}-${el}`} // Key by index-value to force re-render on shift? No, key by unique ID is better usually, but here index changes matter for array visual
                                layout
                                initial={{ opacity: 0, y: -50 }}
                                animate={{
                                    opacity: 1,
                                    y: 0,
                                    backgroundColor: highlightedIndex === i ? 'rgba(59, 130, 246, 0.2)' : 'rgba(255,255,255,0.02)',
                                    borderColor: highlightedIndex === i ? '#3b82f6' : 'rgba(255,255,255,0.1)',
                                    scale: highlightedIndex === i ? 1.1 : 1
                                }}
                                exit={{ opacity: 0, scale: 0, y: 50 }}
                                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                className="w-16 h-24 rounded-xl border flex flex-col items-center justify-center relative group"
                            >
                                <span className="text-2xl font-bold text-white">{el}</span>

                                {/* Memory Address / Index */}
                                <div className="absolute -bottom-8 flex flex-col items-center">
                                    <span className="text-[10px] font-mono text-white/40">{i}</span>
                                    <div className="w-px h-2 bg-white/10 group-hover:bg-accent-blue/50 transition-colors" />
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>

            {/* Controls */}
            <div className="w-full max-w-xl bg-black/40 backdrop-blur-sm p-6 rounded-[32px] border border-white/10 flex flex-col gap-6">
                <div className="flex gap-4">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Idx (Access/Del) or Val..."
                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 text-center text-white font-mono focus:outline-none focus:border-accent-blue/50"
                    />

                    <button onClick={handleAccess} className="px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 transition-colors">
                        <ArrowRight size={14} className="text-blue-400" /> Access
                    </button>
                    <button onClick={handleSearch} className="px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 transition-colors">
                        <Search size={14} className="text-purple-400" /> Search
                    </button>
                    <button onClick={handleInsert} className="px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 transition-colors">
                        <Plus size={14} className="text-emerald-400" /> Insert
                    </button>
                    <button onClick={handleDelete} className="px-4 py-3 bg-white/5 hover:bg-red-500/10 border border-white/10 hover:border-red-500/30 rounded-xl text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 transition-colors">
                        <Trash2 size={14} className="text-red-400" /> Remove
                    </button>
                </div>

                <div className="grid grid-cols-3 gap-4 border-t border-white/5 pt-4">
                    <div className="text-center">
                        <div className="text-[10px] text-white/20 font-bold uppercase tracking-widest mb-1">Access</div>
                        <div className="text-emerald-400 font-mono text-xs">O(1)</div>
                    </div>
                    <div className="text-center">
                        <div className="text-[10px] text-white/20 font-bold uppercase tracking-widest mb-1">Search</div>
                        <div className="text-pink-400 font-mono text-xs">O(N)</div>
                    </div>
                    <div className="text-center">
                        <div className="text-[10px] text-white/20 font-bold uppercase tracking-widest mb-1">Insert/Del</div>
                        <div className="text-pink-400 font-mono text-xs">O(N)</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ArrayVisualizer
