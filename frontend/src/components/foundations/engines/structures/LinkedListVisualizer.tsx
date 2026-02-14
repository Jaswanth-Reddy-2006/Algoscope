import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Plus, Trash2, ArrowRightCircle } from 'lucide-react'

// Define Node Structure
interface ListNode {
    id: string
    value: number
    nextId: string | null
}

const LinkedListVisualizer: React.FC = () => {
    // Initial State: Head -> 10 -> 20 -> 30 -> Null
    const [nodes, setNodes] = useState<ListNode[]>([
        { id: 'node-1', value: 10, nextId: 'node-2' },
        { id: 'node-2', value: 20, nextId: 'node-3' },
        { id: 'node-3', value: 30, nextId: null }
    ])

    const [headId, setHeadId] = useState<string | null>('node-1')
    const [inputValue, setInputValue] = useState('')
    const [highlightedNode, setHighlightedNode] = useState<string | null>(null)
    const [operationState, setOperationState] = useState<string | null>(null) // 'traversing', 'inserting', 'deleting'

    // Helpers
    const generateId = () => `node-${Math.random().toString(36).substr(2, 9)}`

    // Operations
    const addToHead = () => {
        const val = parseInt(inputValue) || Math.floor(Math.random() * 100)
        const newId = generateId()
        const newNode: ListNode = { id: newId, value: val, nextId: headId }

        setNodes([newNode, ...nodes])
        setHeadId(newId)
        setInputValue('')
        setOperationState('inserted_head')
        setTimeout(() => setOperationState(null), 1000)
    }

    const addToTail = () => {
        const val = parseInt(inputValue) || Math.floor(Math.random() * 100)
        const newId = generateId()
        const newNode: ListNode = { id: newId, value: val, nextId: null }

        if (!headId) {
            setNodes([newNode])
            setHeadId(newId)
        } else {
            // Find tail
            const newNodes = [...nodes]
            // Ideally we traverse, but for state simplicity we just find the node with null next
            const tailIndex = newNodes.findIndex(n => n.nextId === null)
            if (tailIndex !== -1) {
                newNodes[tailIndex].nextId = newId
                setNodes([...newNodes, newNode])
            }
        }
        setInputValue('')
    }

    const deleteHead = () => {
        if (!headId) return
        const currentHead = nodes.find(n => n.id === headId)
        if (currentHead) {
            setHeadId(currentHead.nextId)
            setNodes(nodes.filter(n => n.id !== headId))
        }
    }

    const traverse = async () => {
        setOperationState('traversing')
        let currentId = headId
        while (currentId) {
            setHighlightedNode(currentId)
            await new Promise(r => setTimeout(r, 600))
            const node = nodes.find(n => n.id === currentId)
            currentId = node ? node.nextId : null
        }
        setHighlightedNode(null)
        setOperationState(null)
    }

    // Rendering Helpers
    const getOrderedNodes = () => {
        const ordered: ListNode[] = []
        let currentId = headId
        // Safety check for cycles or broken links (though our ops prevent them)
        const visited = new Set<string>()

        while (currentId && !visited.has(currentId)) {
            visited.add(currentId)
            const node = nodes.find(n => n.id === currentId)
            if (node) {
                ordered.push(node)
                currentId = node.nextId
            } else {
                break
            }
        }
        return ordered
    }

    const displayNodes = getOrderedNodes()

    return (
        <div className="w-full h-full flex flex-col items-center justify-between p-8">
            {/* Visualization Area */}
            <div className="flex-1 w-full flex items-center justify-center overflow-x-auto custom-scrollbar p-10">
                <div className="flex items-center gap-2">
                    {/* Head Pointer */}
                    <div className="flex flex-col items-center gap-2 mr-4">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-accent-blue">Head</span>
                        <div className="w-2 h-8 bg-accent-blue/50 rounded-full" />
                    </div>

                    <AnimatePresence mode="popLayout">
                        {displayNodes.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-white/20 italic font-mono"
                            >
                                NULL
                            </motion.div>
                        ) : (
                            displayNodes.map((node) => (
                                <motion.div
                                    key={node.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.8, x: -20 }}
                                    animate={{
                                        opacity: 1,
                                        scale: 1,
                                        x: 0,
                                        borderColor: highlightedNode === node.id ? '#3b82f6' : 'rgba(255,255,255,0.1)',
                                        backgroundColor: highlightedNode === node.id ? 'rgba(59, 130, 246, 0.1)' : 'rgba(255,255,255,0.02)'
                                    }}
                                    exit={{ opacity: 0, scale: 0.8, y: 20 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                    className="flex items-center gap-2 group"
                                >
                                    {/* Node Box */}
                                    <div className="relative">
                                        <div className="w-20 h-20 rounded-2xl border flex flex-col items-center justify-center relative z-10 bg-background transition-colors duration-300">
                                            <span className="text-2xl font-bold text-white mb-1">{node.value}</span>
                                            <span className="text-[8px] text-white/20 font-mono uppercase">Next: {node.nextId ? 'PTR' : 'NULL'}</span>

                                            {/* Memory Address Simulation */}
                                            <div className="absolute -bottom-6 text-[9px] text-white/10 font-mono">{node.id.replace('node-', '0x')}</div>
                                        </div>
                                    </div>

                                    {/* Pointer Arrow */}
                                    <div className="flex items-center text-white/20">
                                        <div className="w-8 h-0.5 bg-current" />
                                        <ArrowRight size={16} className="-ml-2" />
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </AnimatePresence>

                    {displayNodes.length > 0 && (
                        <motion.div layout className="opacity-40 flex flex-col items-center gap-2 ml-2">
                            <div className="w-12 h-12 rounded-xl border border-dashed border-white/20 flex items-center justify-center text-[10px] text-white/20 font-mono">NULL</div>
                        </motion.div>
                    )}
                </div>
            </div>

            {/* Controls */}
            <div className="w-full max-w-2xl bg-black/40 backdrop-blur-sm p-6 rounded-[32px] border border-white/10 flex flex-col gap-6">
                <div className="flex gap-4">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Value..."
                        className="w-24 bg-white/5 border border-white/10 rounded-xl px-4 text-center text-white font-mono focus:outline-none focus:border-accent-blue/50"
                    />

                    <div className="flex-1 flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                        <button onClick={addToHead} className="px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold text-white uppercase tracking-wider whitespace-nowrap flex items-center gap-2 transition-colors">
                            <Plus size={14} className="text-emerald-400" /> Add Head
                        </button>
                        <button onClick={addToTail} className="px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold text-white uppercase tracking-wider whitespace-nowrap flex items-center gap-2 transition-colors">
                            <Plus size={14} className="text-blue-400" /> Add Tail
                        </button>
                        <button onClick={deleteHead} className="px-4 py-3 bg-white/5 hover:bg-red-500/10 border border-white/10 hover:border-red-500/30 rounded-xl text-xs font-bold text-white uppercase tracking-wider whitespace-nowrap flex items-center gap-2 transition-colors">
                            <Trash2 size={14} className="text-red-400" /> Del Head
                        </button>
                    </div>

                    <button
                        onClick={traverse}
                        disabled={!!operationState}
                        className="px-6 py-3 bg-accent-blue text-black font-bold rounded-xl text-xs uppercase tracking-wider whitespace-nowrap flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ArrowRightCircle size={16} /> Traverse
                    </button>
                </div>

                <div className="grid grid-cols-3 gap-4 border-t border-white/5 pt-4">
                    <div className="text-center">
                        <div className="text-[10px] text-white/20 font-bold uppercase tracking-widest mb-1">Access</div>
                        <div className="text-pink-400 font-mono text-xs">O(N)</div>
                    </div>
                    <div className="text-center">
                        <div className="text-[10px] text-white/20 font-bold uppercase tracking-widest mb-1">Insert Head</div>
                        <div className="text-emerald-400 font-mono text-xs">O(1)</div>
                    </div>
                    <div className="text-center">
                        <div className="text-[10px] text-white/20 font-bold uppercase tracking-widest mb-1">Insert Tail</div>
                        <div className="text-emerald-400 font-mono text-xs">O(1)*</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LinkedListVisualizer
