import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link as LinkIcon, Lock } from 'lucide-react'

const StringVisualizer: React.FC = () => {
    const [str, setStr] = useState<string>("Hello")
    const [concatVal, setConcatVal] = useState<string>("")
    const [message, setMessage] = useState<string>("Strings are Immutable.")
    const [shake, setShake] = useState(false)
    const [address, setAddress] = useState("0x4A12")

    // Simulate Immutability
    const handleTryEdit = () => {
        setMessage("Error: Cannot modify character in place!")
        setShake(true)
        setTimeout(() => setShake(false), 500)
    }

    // Concatenate (New String Creation)
    const handleConcat = () => {
        if (!concatVal) return

        setMessage(`Creating NEW string: "${str + concatVal}"`)

        // Simulate "Copying"
        setTimeout(() => {
            const newAddress = "0x" + Math.floor(Math.random() * 16777215).toString(16).toUpperCase().substring(0, 4)
            setStr(str + concatVal)
            setAddress(newAddress)
            setConcatVal("")
            setMessage(`New string allocated at ${newAddress}. O(N+M)`)
        }, 800)
    }

    return (
        <div className="flex flex-col items-center gap-12 w-full max-w-4xl">
            {/* Header / Immutability Badge */}
            <div className="flex items-center gap-2 mb-4">
                <div className="bg-red-500/10 border border-red-500/20 px-3 py-1 rounded-full text-red-400 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                    <Lock size={12} /> Immutable
                </div>
            </div>

            {/* Memory Visualization */}
            <div className="relative p-8 bg-white/[0.02] border border-white/5 rounded-2xl">
                <div className="absolute top-2 left-4 text-[10px] text-white/20 font-mono">Heap Address: {address}</div>

                <div className={`flex items-center gap-1 ${shake ? 'animate-shake' : ''}`}>
                    <AnimatePresence>
                        {str.split('').map((char, i) => (
                            <motion.div
                                key={`${i}-${char}-${address}`} // Key changes on address change to force re-render/anim
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="w-12 h-16 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center text-xl font-bold font-mono text-white relative group cursor-not-allowed hover:bg-red-500/10 hover:border-red-500/30 transition-colors"
                                onClick={handleTryEdit}
                            >
                                {char}
                                <div className="absolute -bottom-6 text-[10px] text-white/20 font-mono">{i}</div>

                                {/* Lock Icon on Hover */}
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Lock size={16} className="text-red-400" />
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>

            {/* Message Bar */}
            <div className="h-8 text-center">
                <p className={`text-sm font-mono transition-colors ${message.includes('Error') ? 'text-red-400' : 'text-accent-blue'}`}>
                    {message}
                </p>
            </div>

            {/* Controls */}
            <div className="flex gap-4 items-center bg-white/[0.02] border border-white/5 p-4 rounded-xl">
                <div className="text-[10px] uppercase font-bold text-white/40 tracking-wider">Operation:</div>
                <div className="flex gap-2">
                    <input
                        value={concatVal}
                        onChange={(e) => setConcatVal(e.target.value)}
                        placeholder="Append Text"
                        className="bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-white font-mono focus:border-accent-blue/50 outline-none w-32"
                    />
                    <button
                        onClick={handleConcat}
                        className="flex items-center gap-2 px-4 py-2 bg-accent-blue/10 hover:bg-accent-blue/20 text-accent-blue border border-accent-blue/20 rounded-lg text-xs uppercase font-bold tracking-wider transition-colors"
                    >
                        <LinkIcon size={14} /> Concatenate
                    </button>
                </div>
            </div>

            <style>{`
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-5px); }
                    75% { transform: translateX(5px); }
                }
                .animate-shake {
                    animation: shake 0.2s ease-in-out 3;
                }
            `}</style>
        </div>
    )
}

export default StringVisualizer
