import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Plus, Trash2, Repeat } from 'lucide-react'

// Advanced Linked List Visualizer
// Demonstrates: Node Structure, Pointer Rewiring, Traversal, Null Termination

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

    // Interaction State
    const [inputValue, setInputValue] = useState('')
    const [inputIndex, setInputIndex] = useState('')
    const [highlightedNode, setHighlightedNode] = useState<string | null>(null)
    const [operationMsg, setOperationMsg] = useState('Ready.')
    const [isAnimating, setIsAnimating] = useState(false)

    // Helpers
    const generateId = () => `node-${Math.random().toString(36).substr(2, 9)}`
    const sleep = (ms: number) => new Promise(r => setTimeout(r, ms))

    // --------------------------------------------------------------------------
    // Operations
    // --------------------------------------------------------------------------

    const traverseTo = async (index: number): Promise<string | null> => {
        let currentId = headId
        let i = 0
        setOperationMsg(`Traversing to index ${index}...`)

        while (currentId && i < index) {
            setHighlightedNode(currentId)
            await sleep(400)
            const node = nodes.find(n => n.id === currentId)
            if (!node) break
            currentId = node.nextId
            i++
        }
        setHighlightedNode(currentId)
        await sleep(400)
        return currentId
    }

    const handleAddHead = async () => {
        if (isAnimating) return
        const val = parseInt(inputValue) || Math.floor(Math.random() * 100)
        setIsAnimating(true)
        setOperationMsg(`Creating new node(${val})...`)

        const newId = generateId()
        const newNode: ListNode = { id: newId, value: val, nextId: headId }

        setNodes([newNode, ...nodes])
        setHeadId(newId)
        setHighlightedNode(newId)

        await sleep(800)
        setHighlightedNode(null)
        setOperationMsg('Added to Head. O(1)')
        setIsAnimating(false)
        setInputValue('')
    }

    const handleAddTail = async () => {
        if (isAnimating) return
        const val = parseInt(inputValue) || Math.floor(Math.random() * 100)
        setIsAnimating(true)
        setOperationMsg('Traversing to tail... O(N)')

        const newId = generateId()
        const newNode: ListNode = { id: newId, value: val, nextId: null }

        if (!headId) {
            setNodes([newNode])
            setHeadId(newId)
        } else {
            // Traverse to find tail
            let currentId = headId
            while (currentId) {
                setHighlightedNode(currentId)
                await sleep(300)
                const node = nodes.find(n => n.id === currentId)
                if (!node || !node.nextId) break
                currentId = node.nextId
            }

            // Append
            setOperationMsg(`Appending node(${val})...`)
            setNodes(prev => prev.map(n => n.id === currentId ? { ...n, nextId: newId } : n).concat(newNode))
        }

        await sleep(800)
        setHighlightedNode(null)
        setOperationMsg('Added to Tail.')
        setIsAnimating(false)
        setInputValue('')
    }

    const handleInsertAt = async () => {
        if (isAnimating) return
        const val = parseInt(inputValue) || Math.floor(Math.random() * 100)
        const idx = parseInt(inputIndex)
        if (isNaN(idx) || idx < 0) return

        if (idx === 0) {
            await handleAddHead()
            return
        }

        setIsAnimating(true)
        setOperationMsg(`Traversing to index ${idx - 1} to insert...`)

        // Traverse to idx - 1
        const prevId = await traverseTo(idx - 1)

        if (!prevId) {
            setOperationMsg('Index out of bounds.')
            setIsAnimating(false)
            return
        }

        setOperationMsg(`Rewiring pointers...`)
        const prevNode = nodes.find(n => n.id === prevId)!
        const newId = generateId()
        const newNode: ListNode = { id: newId, value: val, nextId: prevNode.nextId }

        setNodes([...nodes.map(n => n.id === prevId ? { ...n, nextId: newId } : n), newNode])
        setHighlightedNode(newId)

        await sleep(1000)
        setHighlightedNode(null)
        setOperationMsg('Inserted.')
        setIsAnimating(false)
        setInputValue('')
    }

    const handleDeleteHead = async () => {
        if (isAnimating || !headId) return
        setIsAnimating(true)
        setOperationMsg('Removing Head... O(1)')
        setHighlightedNode(headId)
        await sleep(500)

        const currentHead = nodes.find(n => n.id === headId)
        if (currentHead) {
            setHeadId(currentHead.nextId)
            setNodes(nodes.filter(n => n.id !== headId))
        }

        setHighlightedNode(null)
        setOperationMsg('Removed.')
        setIsAnimating(false)
    }

    const handleDeleteTail = async () => {
        if (isAnimating || !headId) return
        setIsAnimating(true)
        setOperationMsg('Traversing to tail... O(N)')

        if (!nodes.find(n => n.id === headId)?.nextId) {
            // Only one node
            setHeadId(null)
            setNodes([])
            setIsAnimating(false)
            return
        }

        let currentId = headId
        let prevId: string | null = null

        while (currentId) {
            setHighlightedNode(currentId)
            await sleep(300)
            const node = nodes.find(n => n.id === currentId)
            if (!node?.nextId) break
            prevId = currentId
            currentId = node.nextId
        }

        if (prevId) {
            setOperationMsg('Removing tail node...')
            setNodes(prev => prev.filter(n => n.id !== currentId).map(n => n.id === prevId ? { ...n, nextId: null } : n))
        }

        setHighlightedNode(null)
        setOperationMsg('Removed.')
        setIsAnimating(false)
    }

    const handleReverse = async () => {
        if (isAnimating || !headId) return
        setIsAnimating(true)
        setOperationMsg('Reversing List... O(N)')

        let prev: string | null = null
        let current: string | null = headId

        while (current) {
            setHighlightedNode(current)
            const node = nodes.find(n => n.id === current)!
            const next = node.nextId

            // Visual wait
            await sleep(400)

            // Flip pointer
            // node.next = prev
            // We need to update state immediately for visual effect, but careful with loop
            // For React state, we might compute the whole reversed list and animate "sweeping"
            // But let's verify step by step

            const capturedPrev = prev
            setNodes(prevNodes => prevNodes.map(n => n.id === current ? { ...n, nextId: capturedPrev } : n))

            prev = current
            current = next
        }

        setHeadId(prev)
        setOperationMsg('Reversed!')
        setHighlightedNode(null)
        setIsAnimating(false)
    }

    // Rendering Helpers
    const getOrderedNodes = () => {
        const ordered: ListNode[] = []
        let currentId = headId
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
        <div className="w-full h-full flex flex-col items-center justify-between p-6 bg-black/20">
            {/* Status Bar */}
            <div className="w-full flex justify-between items-center mb-4 px-4 h-10">
                <div className="text-accent-blue font-mono text-sm">{operationMsg}</div>
                <div className="text-white/40 font-mono text-xs uppercase tracking-widest">{displayNodes.length} Nodes</div>
            </div>

            {/* Visualization Area */}
            <div className="flex-1 w-full flex items-center justify-start overflow-x-auto custom-scrollbar p-10 min-h-[300px]">
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
                            displayNodes.map((node, i) => (
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
                                    className="flex items-center gap-2 group relative"
                                >
                                    {/* Index Label */}
                                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] text-white/20 font-mono">{i}</div>

                                    {/* Node Box */}
                                    <div className="relative">
                                        <div className="w-24 h-24 rounded-2xl border flex flex-col items-center justify-center relative z-10 bg-background transition-colors duration-300 shadow-xl">
                                            <span className="text-2xl font-bold text-white mb-1">{node.value}</span>

                                            {/* Pointer Section */}
                                            <div className="w-full border-t border-white/10 mt-2 pt-1 flex justify-center">
                                                <span className="text-[8px] text-white/30 font-mono uppercase tracking-tighter">next: {node.nextId ? 'PTR' : 'NULL'}</span>
                                            </div>

                                            {/* Memory Address Simulation */}
                                            <div className="absolute -bottom-6 text-[8px] text-white/10 font-mono tracking-tighter w-full text-center">{node.id}</div>
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
                            <span className="text-[10px] font-bold uppercase tracking-widest text-white/20">Null</span>
                            <div className="w-12 h-12 rounded-xl border border-dashed border-white/20 flex items-center justify-center text-[10px] text-white/20 font-mono">
                                Ø
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>

            {/* Controls */}
            <div className="w-full max-w-4xl bg-black/40 backdrop-blur-sm p-6 rounded-[32px] border border-white/10 flex flex-col gap-6 mt-4">
                <div className="flex gap-4 items-end">
                    <div className="flex flex-col gap-1 w-20">
                        <label className="text-[9px] uppercase font-bold text-white/30">Index</label>
                        <input
                            type="number"
                            value={inputIndex}
                            onChange={(e) => setInputIndex(e.target.value)}
                            placeholder="i"
                            className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-center text-white font-mono focus:outline-none focus:border-accent-blue/50 text-sm"
                        />
                    </div>
                    <div className="flex flex-col gap-1 w-20">
                        <label className="text-[9px] uppercase font-bold text-white/30">Value</label>
                        <input
                            type="number"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="val"
                            className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-center text-white font-mono focus:outline-none focus:border-accent-blue/50 text-sm"
                        />
                    </div>

                    <div className="flex-1 flex flex-wrap gap-2">
                        <button onClick={handleAddHead} disabled={isAnimating} className="px-4 py-2 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 hover:bg-indigo-500/20 transition-all disabled:opacity-50">
                            <Plus size={14} /> Add Head
                        </button>
                        <button onClick={handleAddTail} disabled={isAnimating} className="px-4 py-2 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 hover:bg-indigo-500/20 transition-all disabled:opacity-50">
                            <Plus size={14} /> Add Tail
                        </button>
                        <button onClick={handleInsertAt} disabled={isAnimating} className="px-4 py-2 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 hover:bg-blue-500/20 transition-all disabled:opacity-50">
                            <Plus size={14} /> Insert(i)
                        </button>

                        <div className="w-px h-8 bg-white/10 mx-2" />

                        <button onClick={handleDeleteHead} disabled={isAnimating} className="px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 hover:bg-red-500/20 transition-all disabled:opacity-50">
                            <Trash2 size={14} /> Del Head
                        </button>
                        <button onClick={handleDeleteTail} disabled={isAnimating} className="px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 hover:bg-red-500/20 transition-all disabled:opacity-50">
                            <Trash2 size={14} /> Del Tail
                        </button>

                        <div className="w-px h-8 bg-white/10 mx-2" />

                        <button onClick={handleReverse} disabled={isAnimating} className="px-4 py-2 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 hover:bg-purple-500/20 transition-all disabled:opacity-50">
                            <Repeat size={14} /> Reverse
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LinkedListVisualizer
