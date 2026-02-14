import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Minus, ArrowRight, Layers, ArrowLeftRight } from 'lucide-react'

interface Props {
    type: 'stack' | 'queue'
}

const StackQueueVisualizer: React.FC<Props> = ({ type }) => {
    // Initial State
    const [elements, setElements] = useState<number[]>([10, 20, 30])
    const [inputValue, setInputValue] = useState('')
    const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null)
    const [message, setMessage] = useState<string>(type === 'stack' ? 'LIFO: Last In, First Out' : 'FIFO: First In, First Out')

    // Operations
    const handleAdd = () => {
        const val = parseInt(inputValue) || Math.floor(Math.random() * 100)
        if (elements.length > 7) {
            setMessage('Capacity Full!')
            return
        }

        if (type === 'stack') {
            setMessage(`Pushing ${val} to Top`)
        } else {
            setMessage(`Enqueuing ${val} at Rear`)
        }

        setElements([...elements, val])
        setInputValue('')

        // Highlight new element momentarily
        setTimeout(() => {
            setHighlightedIndex(elements.length)
            setTimeout(() => setHighlightedIndex(null), 500)
        }, 100)
    }

    const handleRemove = () => {
        if (elements.length === 0) {
            setMessage('Underflow! Construct is empty.')
            return
        }

        if (type === 'queue') {
            // Dequeue: Remove from front (index 0)
            setMessage(`Dequeuing ${elements[0]} from Front`)
            setHighlightedIndex(0)
            setTimeout(() => {
                setElements(elements.slice(1))
                setHighlightedIndex(null)
            }, 600)
        } else {
            // Pop: Remove from end (Top)
            const topVal = elements[elements.length - 1]
            setMessage(`Popping ${topVal} from Top`)
            setHighlightedIndex(elements.length - 1)
            setTimeout(() => {
                setElements(elements.slice(0, -1))
                setHighlightedIndex(null)
            }, 600)
        }
    }

    const handlePeek = () => {
        if (elements.length === 0) return

        const idx = type === 'queue' ? 0 : elements.length - 1
        setHighlightedIndex(idx)
        setMessage(type === 'queue' ? `Peeking Front: ${elements[0]}` : `Peeking Top: ${elements[idx]}`)
        setTimeout(() => setHighlightedIndex(null), 1000)
    }

    return (
        <div className="w-full h-full flex flex-col items-center justify-between p-8">
            {/* Header */}
            <div className="flex items-center gap-3 mb-8">
                <div className={`p-3 rounded-xl bg-${type === 'stack' ? 'purple' : 'emerald'}-500/10 border border-${type === 'stack' ? 'purple' : 'emerald'}-500/20 text-${type === 'stack' ? 'purple' : 'emerald'}-400`}>
                    {type === 'stack' ? <Layers size={20} /> : <ArrowLeftRight size={20} />}
                </div>
                <div>
                    <h3 className="text-xl font-bold capitalize">{type} Visualization</h3>
                    <p className="text-xs text-white/40 font-mono">{message}</p>
                </div>
            </div>

            {/* Visualization Area */}
            <div className={`flex-1 w-full flex items-center justify-center p-10 relative`}>

                {/* Container/Boundary Visuals */}
                <div className={`
                    relative transition-all duration-500
                    ${type === 'stack'
                        ? 'w-32 h-[400px] border-b-4 border-l-4 border-r-4 border-white/20 rounded-b-xl flex flex-col-reverse items-center justify-start p-2 gap-2'
                        : 'w-[600px] h-32 border-t-4 border-b-4 border-white/10 border-l-2 border-r-2 border-l-white/5 border-r-white/5 rounded-xl flex items-center justify-start px-4 gap-2 overflow-hidden'
                    }
                    bg-white/[0.02] backdrop-blur-sm
                `}>
                    <AnimatePresence mode="popLayout">
                        {elements.map((el, i) => (
                            <motion.div
                                key={`${el}-${i}`} // Include index for stability
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
                                        ? (type === 'stack' ? 'rgba(168, 85, 247, 0.3)' : 'rgba(16, 185, 129, 0.3)')
                                        : 'rgba(255,255,255,0.05)',
                                    borderColor: highlightedIndex === i
                                        ? (type === 'stack' ? '#a855f7' : '#10b981')
                                        : 'rgba(255,255,255,0.1)'
                                }}
                                exit={{
                                    opacity: 0,
                                    scale: 0,
                                    y: type === 'stack' ? -200 : 0,
                                    x: type === 'queue' ? -200 : 0,
                                    transition: { duration: 0.4 }
                                }}
                                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                className={`
                                    rounded-lg border flex items-center justify-center relative group
                                    ${type === 'stack' ? 'w-full h-12 flex-shrink-0' : 'h-20 w-20 flex-shrink-0'}
                                    text-white font-mono font-bold
                                `}
                            >
                                {el}

                                {/* Pointers */}
                                {type === 'stack' && i === elements.length - 1 && (
                                    <div className="absolute left-full ml-4 flex items-center gap-2">
                                        <ArrowRight size={14} className="text-purple-400 rotate-180" />
                                        <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest">Top</span>
                                    </div>
                                )}
                                {type === 'queue' && i === 0 && (
                                    <div className="absolute bottom-full mb-2 flex flex-col items-center">
                                        <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Front</span>
                                        <div className="w-px h-2 bg-emerald-400" />
                                    </div>
                                )}
                                {type === 'queue' && i === elements.length - 1 && (
                                    <div className="absolute top-full mt-2 flex flex-col items-center">
                                        <div className="w-px h-2 bg-blue-400" />
                                        <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Rear</span>
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
            <div className="w-full max-w-xl bg-black/40 backdrop-blur-sm p-6 rounded-[32px] border border-white/10 flex flex-col gap-6">
                <div className="flex gap-4">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Value..."
                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 text-center text-white font-mono focus:outline-none focus:border-accent-blue/50"
                    />

                    <button onClick={handleAdd} className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 transition-colors">
                        <Plus size={14} className="text-emerald-400" /> {type === 'stack' ? 'Push' : 'Enqueue'}
                    </button>
                    <button onClick={handleRemove} className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 transition-colors">
                        <Minus size={14} className="text-red-400" /> {type === 'stack' ? 'Pop' : 'Dequeue'}
                    </button>
                    <button onClick={handlePeek} className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 transition-colors">
                        <ArrowRight size={14} className="text-blue-400" /> Peek
                    </button>
                </div>

                <div className="grid grid-cols-3 gap-4 border-t border-white/5 pt-4">
                    <div className="text-center">
                        <div className="text-[10px] text-white/20 font-bold uppercase tracking-widest mb-1">Access</div>
                        <div className="text-pink-400 font-mono text-xs">O(N)</div>
                    </div>
                    <div className="text-center">
                        <div className="text-[10px] text-white/20 font-bold uppercase tracking-widest mb-1">Insert</div>
                        <div className="text-emerald-400 font-mono text-xs">O(1)</div>
                    </div>
                    <div className="text-center">
                        <div className="text-[10px] text-white/20 font-bold uppercase tracking-widest mb-1">Remove</div>
                        <div className="text-emerald-400 font-mono text-xs">O(1)</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default StackQueueVisualizer
