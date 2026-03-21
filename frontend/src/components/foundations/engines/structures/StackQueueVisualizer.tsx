import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Minus, ArrowRight, Layers, ArrowLeftRight, Eye } from 'lucide-react'

// Advanced Stack & Queue Visualizer
// Demonstrates LIFO/FIFO principles with clearer memory/pointer visualization

interface Props {
    type: 'stack' | 'queue'
}

const StackQueueVisualizer: React.FC<Props> = ({ type }) => {
    // Configuration
    const MAX_CAPACITY = 8

    // State
    const [elements, setElements] = useState<number[]>([10, 20, 30])
    const [inputValue, setInputValue] = useState('')
    const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null)
    const [message, setMessage] = useState<string>('Ready.')
    const [isAnimating, setIsAnimating] = useState(false)

    // Operations
    const handleAdd = async () => {
        if (isAnimating) return
        const val = parseInt(inputValue) || Math.floor(Math.random() * 100)

        if (elements.length >= MAX_CAPACITY) {
            setMessage('Stack Overflow! Capacity Reached.')
            return
        }

        setIsAnimating(true)
        if (type === 'stack') {
            setMessage(`Pushing ${val} to Top... O(1)`)
        } else {
            setMessage(`Enqueuing ${val} to Rear... O(1)`)
        }

        setElements([...elements, val])
        setHighlightedIndex(elements.length)
        setInputValue('')

        await new Promise(r => setTimeout(r, 600))
        setHighlightedIndex(null)
        setMessage('Ready.')
        setIsAnimating(false)
    }

    const handleRemove = async () => {
        if (isAnimating) return
        if (elements.length === 0) {
            setMessage('Stack Underflow! Is Empty.')
            return
        }

        setIsAnimating(true)

        if (type === 'queue') {
            // Dequeue
            setMessage(`Dequeuing ${elements[0]} from Front... O(1)`)
            setHighlightedIndex(0)
            await new Promise(r => setTimeout(r, 600))
            // Shift animation happens via layout prop
            setElements(elements.slice(1))
            setHighlightedIndex(null)
        } else {
            // Pop
            const topVal = elements[elements.length - 1]
            setMessage(`Popping ${topVal} from Top... O(1)`)
            setHighlightedIndex(elements.length - 1)
            await new Promise(r => setTimeout(r, 600))
            setElements(elements.slice(0, -1))
            setHighlightedIndex(null)
        }

        await new Promise(r => setTimeout(r, 300))
        setMessage('Ready.')
        setIsAnimating(false)
    }

    const handlePeek = async () => {
        if (elements.length === 0) {
            setMessage('Empty.')
            return
        }
        if (isAnimating) return
        setIsAnimating(true)

        const idx = type === 'queue' ? 0 : elements.length - 1
        setHighlightedIndex(idx)
        setMessage(type === 'queue' ? `Peeking Front: ${elements[0]}` : `Peeking Top: ${elements[idx]}`)

        await new Promise(r => setTimeout(r, 1000))
        setHighlightedIndex(null)
        setMessage('Ready.')
        setIsAnimating(false)
    }

    return (
        <div className="w-full h-full flex flex-col items-center justify-between p-6 bg-black/20">
            {/* Status Bar */}
            <div className="w-full flex justify-between items-center mb-4 px-4 h-10">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-${type === 'stack' ? 'purple' : 'emerald'}-500/10 border border-${type === 'stack' ? 'purple' : 'emerald'}-500/20 text-${type === 'stack' ? 'purple' : 'emerald'}-400`}>
                        {type === 'stack' ? <Layers size={16} /> : <ArrowLeftRight size={16} />}
                    </div>
                    <span className="font-bold text-white tracking-wider">{type === 'stack' ? 'LIFO Stack' : 'FIFO Queue'}</span>
                </div>
                <div className="text-white/60 font-mono text-xs bg-white/5 py-1 px-3 rounded-lg border border-white/10">
                    {message}
                </div>
            </div>

            {/* Visualization Area */}
            <div className={`flex-1 w-full flex items-center justify-center p-10 relative overflow-hidden`}>

                {/* Container/Boundary Visuals */}
                <div className={`
                    relative transition-all duration-500
                    ${type === 'stack'
                        ? 'w-40 min-h-[400px] border-b-4 border-l-4 border-r-4 border-white/20 rounded-b-3xl flex flex-col-reverse items-center justify-start p-4 gap-2'
                        : 'w-full max-w-3xl h-32 border-t-4 border-b-4 border-white/10 border-l-2 border-r-2 border-l-white/5 border-r-white/5 rounded-2xl flex items-center justify-start px-4 gap-2 overflow-x-auto custom-scrollbar'
                    }
                    bg-white/[0.02] backdrop-blur-md shadow-2xl
                `}>
                    {/* Capacity Guides for Stack */}
                    {type === 'stack' && Array.from({ length: MAX_CAPACITY }).map((_, i) => (
                        <div key={i} className="absolute w-full border-t border-white/5 pointer-events-none" style={{ bottom: `${(i + 1) * 50}px` }} />
                    ))}

                    <AnimatePresence mode="popLayout">
                        {elements.map((el, i) => (
                            <motion.div
                                key={`${el}-${i}`} // Key needs to be somewhat unique but index is needed for position
                                layout
                                initial={{
                                    opacity: 0,
                                    scale: 0.5,
                                    y: type === 'stack' ? -200 : 0,
                                    x: type === 'queue' ? 200 : 0
                                }}
                                animate={{
                                    opacity: 1,
                                    scale: 1,
                                    y: 0,
                                    x: 0,
                                    backgroundColor: highlightedIndex === i
                                        ? (type === 'stack' ? 'rgba(236, 65, 134, 0.4)' : 'rgba(16, 185, 129, 0.4)')
                                        : 'rgba(255,255,255,0.05)',
                                    borderColor: highlightedIndex === i
                                        ? (type === 'stack' ? '#EC4186' : '#FFFFFF')
                                        : 'rgba(255,255,255,0.1)'
                                }}
                                exit={{
                                    opacity: 0,
                                    scale: 0,
                                    y: type === 'stack' ? -200 : 0,
                                    x: type === 'queue' ? -200 : 0,
                                    transition: { duration: 0.3 }
                                }}
                                transition={{ type: "spring", stiffness: 400, damping: 28 }}
                                className={`
                                    rounded-xl border-2 flex items-center justify-center relative group
                                    ${type === 'stack' ? 'w-full h-10 flex-shrink-0' : 'h-20 w-20 flex-shrink-0'}
                                    text-white font-mono font-bold text-lg shadow-lg
                                `}
                            >
                                {el}

                                {/* Index Label */}
                                <span className="absolute text-[8px] text-white/20 font-mono bottom-1 right-2">{i}</span>

                                {/* Pointers */}
                                {type === 'stack' && i === elements.length - 1 && (
                                    <motion.div layoutId="top-pointer" className="absolute left-full ml-4 flex items-center gap-2 w-max">
                                        <ArrowRight size={16} className="text-purple-400 rotate-180" />
                                        <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest bg-purple-500/10 px-2 py-1 rounded">Top</span>
                                    </motion.div>
                                )}
                                {type === 'queue' && i === 0 && (
                                    <div className="absolute bottom-full mb-3 flex flex-col items-center">
                                        <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-2 py-1 rounded mb-1">Front</span>
                                        <div className="w-px h-3 bg-emerald-400" />
                                    </div>
                                )}
                                {type === 'queue' && i === elements.length - 1 && (
                                    <div className="absolute top-full mt-3 flex flex-col items-center">
                                        <div className="w-px h-3 bg-blue-400" />
                                        <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest bg-blue-500/10 px-2 py-1 rounded mt-1">Rear</span>
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {elements.length === 0 && (
                        <div className="absolute inset-0 flex items-center justify-center text-white/10 font-mono text-sm uppercase tracking-widest">
                            Empty
                        </div>
                    )}
                </div>
            </div>

            {/* Controls */}
            <div className="w-full max-w-xl bg-black/40 backdrop-blur-md p-6 rounded-[24px] border border-white/10 flex flex-col gap-4">
                <div className="flex gap-4">
                    <div className="flex flex-col gap-1 w-32">
                        <label className="text-[9px] uppercase font-bold text-white/30">Value</label>
                        <input
                            type="number"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="val"
                            className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-center text-white font-mono focus:outline-none focus:border-accent-blue/50"
                        />
                    </div>

                    <div className="flex-1 flex gap-2 items-end">
                        <button onClick={handleAdd} disabled={isAnimating} className="px-6 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-xl text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2 transition-all disabled:opacity-50 flex-1 justify-center h-10">
                            <Plus size={16} /> {type === 'stack' ? 'Push' : 'Enqueue'}
                        </button>
                        <button onClick={handleRemove} disabled={isAnimating} className="px-6 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-xl text-xs font-bold text-red-400 uppercase tracking-wider flex items-center gap-2 transition-all disabled:opacity-50 flex-1 justify-center h-10">
                            <Minus size={16} /> {type === 'stack' ? 'Pop' : 'Dequeue'}
                        </button>
                        <button onClick={handlePeek} disabled={isAnimating} className="px-6 py-2 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 rounded-xl text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-2 transition-all disabled:opacity-50 flex-1 justify-center h-10">
                            <Eye size={16} /> Peek
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-4 border-t border-white/5 pt-4">
                    <div className="text-center">
                        <div className="text-[9px] text-white/20 font-bold uppercase tracking-widest mb-1">Access (Peek)</div>
                        <div className="text-pink-400 font-mono text-xs">O(1)</div>
                    </div>
                    <div className="text-center">
                        <div className="text-[9px] text-white/20 font-bold uppercase tracking-widest mb-1">Insert</div>
                        <div className="text-emerald-400 font-mono text-xs">O(1)</div>
                    </div>
                    <div className="text-center">
                        <div className="text-[9px] text-white/20 font-bold uppercase tracking-widest mb-1">Remove</div>
                        <div className="text-emerald-400 font-mono text-xs">O(1)</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default StackQueueVisualizer
