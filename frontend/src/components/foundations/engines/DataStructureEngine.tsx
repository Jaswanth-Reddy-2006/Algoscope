import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Minus } from 'lucide-react'
import LinkedListVisualizer from './structures/LinkedListVisualizer'
import ArrayVisualizer from './structures/ArrayVisualizer'
import StackQueueVisualizer from './structures/StackQueueVisualizer'
import HashMapVisualizer from './structures/HashMapVisualizer'

// ----------------------------------------------------------------------
// Legacy Logic (Preserved inline until fully split)
// ----------------------------------------------------------------------
const DataStructureEngineLegacy: React.FC<{ type: 'stack' | 'queue' | 'array' | 'hash_map' }> = ({ type }) => {
    const [elements, setElements] = useState<number[]>([10, 20, 30])
    const [inputValue, setInputValue] = useState('')
    const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null)

    const handlePush = () => {
        const val = parseInt(inputValue) || Math.floor(Math.random() * 100)
        setElements([...elements, val])
        setInputValue('')
    }

    const handlePop = () => {
        if (elements.length === 0) return
        if (type === 'queue') {
            setElements(elements.slice(1))
        } else {
            setElements(elements.slice(0, -1))
        }
    }

    const handleAccess = () => {
        const idx = parseInt(inputValue)
        if (isNaN(idx) || idx < 0 || idx >= elements.length) return
        setHighlightedIndex(idx)
        setTimeout(() => setHighlightedIndex(null), 1000)
        setInputValue('')
    }

    return (
        <div className="w-full h-full flex flex-col items-center justify-center p-8 space-y-12">
            {/* Visual Display */}
            <div className={`flex ${type === 'stack' ? 'flex-col-reverse' : 'flex-row'} items-center justify-center gap-4 min-h-[300px] w-full`}>
                <AnimatePresence mode="popLayout">
                    {elements.map((el, i) => (
                        <motion.div
                            key={`${i}-${el}`}
                            layout
                            initial={{ opacity: 0, scale: 0, y: type === 'stack' ? 50 : 0, x: type === 'queue' ? -50 : 0 }}
                            animate={{
                                opacity: 1,
                                scale: 1,
                                y: 0,
                                x: 0,
                                backgroundColor: highlightedIndex === i ? 'rgba(59, 130, 246, 0.5)' : 'rgba(255, 255, 255, 0.05)',
                                borderColor: highlightedIndex === i ? '#3b82f6' : 'rgba(255, 255, 255, 0.1)'
                            }}
                            exit={{ opacity: 0, scale: 0, y: type === 'stack' ? 50 : 0, x: type === 'queue' ? 50 : 0 }}
                            className="w-16 h-16 rounded-2xl border flex items-center justify-center font-mono text-xl text-white relative shadow-lg bg-white/[0.02]"
                        >
                            {el}
                            <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] text-white/20 font-mono">
                                {type === 'stack' ? `idx ${i}` : i}
                            </span>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {elements.length === 0 && (
                    <div className="text-white/10 font-mono italic">Empty {type}</div>
                )}
            </div>

            {/* Controls */}
            <div className="flex flex-col items-center gap-6 w-full max-w-md">
                <div className="flex gap-2 w-full">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder={type === 'array' ? "Enter Index..." : "Enter Value..."}
                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-mono text-sm focus:outline-none focus:border-accent-blue/50"
                    />
                    {type === 'array' ? (
                        <button onClick={handleAccess} className="px-6 py-3 bg-accent-blue text-black font-bold rounded-xl text-xs uppercase tracking-wider">Access</button>
                    ) : (
                        <button onClick={handlePush} className="px-6 py-3 bg-accent-blue text-black font-bold rounded-xl text-xs uppercase tracking-wider flex items-center gap-2">
                            <Plus size={14} /> {type === 'stack' ? 'Push' : 'Enqueue'}
                        </button>
                    )}
                </div>

                {type !== 'array' && (
                    <button onClick={handlePop} className="w-full py-3 bg-white/5 border border-white/10 text-white/60 font-bold rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-white/10 transition-colors">
                        <Minus size={14} /> {type === 'stack' ? 'Pop' : 'Dequeue'}
                    </button>
                )}

                <div className="grid grid-cols-2 gap-4 w-full text-[10px] font-mono text-white/20 uppercase tracking-widest text-center mt-4">
                    <div className="p-3 rounded-lg border border-white/5 bg-white/[0.02]">
                        <div className="mb-1">Time Complexity</div>
                        <div className="text-emerald-400 font-bold">O(1)</div>
                    </div>
                    <div className="p-3 rounded-lg border border-white/5 bg-white/[0.02]">
                        <div className="mb-1">Space Usage</div>
                        <div className="text-pink-400 font-bold">O(N)</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

// ----------------------------------------------------------------------
// Main Dispatcher
// ----------------------------------------------------------------------
interface Props {
    type: 'stack' | 'queue' | 'array' | 'hash_map' | 'linked_list'
    moduleId: string
    mode?: string | null
}

const DataStructureEngine: React.FC<Props> = ({ type }) => {
    if (type === 'linked_list') {
        return <LinkedListVisualizer />
    }
    if (type === 'array') {
        return <ArrayVisualizer />
    }
    if (type === 'stack' || type === 'queue') {
        return <StackQueueVisualizer type={type} />
    }
    if (type === 'hash_map') {
        return <HashMapVisualizer />
    }

    // Temporary Fallback to the legacy engine until strict replacement
    return <DataStructureEngineLegacy type={type as any} />
}

export default DataStructureEngine
