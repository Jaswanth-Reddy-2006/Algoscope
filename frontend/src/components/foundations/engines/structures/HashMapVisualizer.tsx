import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Plus, ArrowRight } from 'lucide-react'

// Simple hash map entry
interface Entry {
    key: string
    value: string
    id: string // Unique ID for key properties
}

const BUCKET_COUNT = 5

const HashMapVisualizer: React.FC = () => {
    // Initial State: 5 buckets
    const [buckets, setBuckets] = useState<Entry[][]>(Array.from({ length: BUCKET_COUNT }, () => []))
    const [inputKey, setInputKey] = useState('')
    const [inputValue, setInputValue] = useState('')
    const [message, setMessage] = useState('Enter a Key and Value to map.')

    // Animation State
    const [highlightedBucket, setHighlightedBucket] = useState<number | null>(null)
    const [hashingVisualization, setHashingVisualization] = useState<{ k: string, hash: number, code: number } | null>(null)

    // Simple string hash for demo
    const hashFunction = (key: string) => {
        let hash = 0
        for (let i = 0; i < key.length; i++) {
            hash = (hash + key.charCodeAt(i))
        }
        return hash
    }

    const handlePut = async () => {
        if (!inputKey || !inputValue) {
            setMessage('Please enter both Key and Value.')
            return
        }

        const rawHash = hashFunction(inputKey)
        const bucketIdx = rawHash % BUCKET_COUNT

        // Visualize Hashing
        setMessage(`Hashing key "${inputKey}"...`)
        setHashingVisualization({ k: inputKey, hash: bucketIdx, code: rawHash })
        await new Promise(r => setTimeout(r, 1000))

        // Highlight Bucket
        setMessage(`Mapped to Bucket ${bucketIdx}`)
        setHighlightedBucket(bucketIdx)
        await new Promise(r => setTimeout(r, 600))

        // Update State
        setBuckets(prev => {
            const newBuckets = [...prev]
            const bucket = [...newBuckets[bucketIdx]]

            // Check if key exists (Update)
            const existingIdx = bucket.findIndex(e => e.key === inputKey)

            if (existingIdx !== -1) {
                setMessage(`Key "${inputKey}" exists. Updating value...`)
                bucket[existingIdx] = { ...bucket[existingIdx], value: inputValue }
            } else {
                if (bucket.length > 0) {
                    setMessage(`Collision at Bucket ${bucketIdx}! Chaining...`)
                } else {
                    setMessage(`Inserted into Bucket ${bucketIdx}.`)
                }
                bucket.push({ key: inputKey, value: inputValue, id: Math.random().toString(36).substr(2, 9) })
            }

            newBuckets[bucketIdx] = bucket
            return newBuckets
        })

        // Cleanup
        await new Promise(r => setTimeout(r, 800))
        setHashingVisualization(null)
        setHighlightedBucket(null)
        setInputKey('')
        setInputValue('')
        setMessage('Ready.')
    }

    const handleGet = async () => {
        if (!inputKey) return

        const rawHash = hashFunction(inputKey)
        const bucketIdx = rawHash % BUCKET_COUNT

        // Visualize Hashing
        setHashingVisualization({ k: inputKey, hash: bucketIdx, code: rawHash })
        await new Promise(r => setTimeout(r, 800))

        setHighlightedBucket(bucketIdx)
        setMessage(`Searching Bucket ${bucketIdx}...`)

        await new Promise(r => setTimeout(r, 1000))

        const bucket = buckets[bucketIdx]
        const entry = bucket.find(e => e.key === inputKey)

        if (entry) {
            setMessage(`Found! Value: ${entry.value}`)
        } else {
            setMessage(`Key "${inputKey}" not found in map.`)
        }

        setTimeout(() => {
            setHashingVisualization(null)
            setHighlightedBucket(null)
            setMessage('Ready.')
        }, 2000)
    }

    return (
        <div className="w-full h-full flex flex-col items-center justify-between p-8">
            {/* Header Status */}
            <div className="w-full text-center mb-4">
                <p className="text-accent-blue font-mono text-sm min-h-[20px]">{message}</p>
            </div>

            {/* Visualization Area */}
            <div className="flex-1 w-full flex flex-col items-center justify-start p-4 gap-8 overflow-y-auto custom-scrollbar">

                {/* Hash Function Visualization Overlay */}
                <AnimatePresence>
                    {hashingVisualization && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-black/80 backdrop-blur-md border border-accent-blue/30 px-8 py-6 rounded-2xl flex flex-col items-center gap-4 absolute top-20 z-20 shadow-2xl"
                        >
                            <div className="text-xs text-white/40 uppercase tracking-widest font-bold">Hash Function</div>
                            <div className="flex items-center gap-4 font-mono text-lg">
                                <span className="text-white">"{hashingVisualization.k}"</span>
                                <ArrowRight className="text-white/20" size={16} />
                                <span className="text-purple-400">code({hashingVisualization.code})</span>
                                <ArrowRight className="text-white/20" size={16} />
                                <span className="text-emerald-400 bg-emerald-900/30 px-2 py-1 rounded">Bucket {hashingVisualization.hash}</span>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Buckets Grid */}
                <div className="flex flex-wrap justify-center gap-4 w-full max-w-5xl">
                    {buckets.map((bucket, i) => (
                        <div key={i} className="flex flex-col gap-0 min-w-[140px]">
                            {/* Bucket Header */}
                            <div
                                className={`
                                    h-12 rounded-t-xl border-t border-l border-r border-white/10 flex items-center justify-center font-bold font-mono transition-colors duration-300
                                    ${highlightedBucket === i ? 'bg-accent-blue/20 border-accent-blue text-accent-blue' : 'bg-white/5 text-white/40'}
                                `}
                            >
                                [{i}]
                            </div>

                            {/* Bucket Body (Linked List Container) */}
                            <div
                                className={`
                                    min-h-[200px] bg-black/20 border-b border-l border-r border-white/5 rounded-b-xl p-2 flex flex-col gap-2 relative transition-colors duration-300
                                    ${highlightedBucket === i ? 'border-accent-blue/30 bg-accent-blue/5' : ''}
                                `}
                            >
                                <AnimatePresence>
                                    {bucket.map((entry, idx) => (
                                        <motion.div
                                            key={entry.id}
                                            layout
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className="relative"
                                        >
                                            <div className="bg-white/10 border border-white/10 rounded-lg p-3 text-xs font-mono relative group hover:bg-white/20 transition-colors">
                                                <div className="flex justify-between items-center mb-1">
                                                    <span className="text-emerald-400 font-bold">{entry.key}</span>
                                                </div>
                                                <div className="text-white/70 truncate border-t border-white/10 pt-1 mt-1">{entry.value}</div>
                                            </div>

                                            {/* Link Arrow */}
                                            {idx < bucket.length - 1 && (
                                                <div className="h-4 flex justify-center items-center">
                                                    <div className="w-px h-full bg-white/20" />
                                                </div>
                                            )}
                                        </motion.div>
                                    ))}
                                </AnimatePresence>

                                {bucket.length === 0 && (
                                    <div className="absolute inset-0 flex items-center justify-center text-white/5 text-[10px] italic pointer-events-none">
                                        NULL
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Controls */}
            <div className="w-full max-w-2xl bg-black/40 backdrop-blur-sm p-6 rounded-[32px] border border-white/10 flex flex-col gap-6">
                <div className="flex gap-4">
                    <input
                        type="text"
                        value={inputKey}
                        onChange={(e) => setInputKey(e.target.value)}
                        placeholder="Key"
                        className="w-1/3 bg-white/5 border border-white/10 rounded-xl px-4 text-center text-white font-mono focus:outline-none focus:border-accent-blue/50"
                    />
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Value"
                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 text-center text-white font-mono focus:outline-none focus:border-accent-blue/50"
                    />

                    <button onClick={handlePut} className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 transition-colors">
                        <Plus size={14} className="text-emerald-400" /> Put
                    </button>
                    <button onClick={handleGet} className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 transition-colors">
                        <Search size={14} className="text-blue-400" /> Get
                    </button>
                </div>

                <div className="grid grid-cols-3 gap-4 border-t border-white/5 pt-4">
                    <div className="text-center">
                        <div className="text-[10px] text-white/20 font-bold uppercase tracking-widest mb-1">Avg Access</div>
                        <div className="text-emerald-400 font-mono text-xs">O(1)</div>
                    </div>
                    <div className="text-center">
                        <div className="text-[10px] text-white/20 font-bold uppercase tracking-widest mb-1">Worst Access</div>
                        <div className="text-pink-400 font-mono text-xs">O(N)</div>
                    </div>
                    <div className="text-center">
                        <div className="text-[10px] text-white/20 font-bold uppercase tracking-widest mb-1">Collision Handling</div>
                        <div className="text-white/40 font-mono text-xs">Separate Chaining</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HashMapVisualizer
