import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../store/useStore'

interface HashTableEngineProps {
    isBrute: boolean
}

const HashTableEngine: React.FC<HashTableEngineProps> = ({ isBrute }) => {
    const currentProblem = useStore(state => state.currentProblem)
    const currentStepIndex = useStore(state => state.currentStepIndex)

    const steps = isBrute ? currentProblem?.brute_force_steps : currentProblem?.optimal_steps
    const currentStep = (steps?.[currentStepIndex] || [] ) as any
    const state = currentStep?.state || {}
    
    // Support multiple naming conventions for map/table
    const table = state.hashTable || state.map || state.table || state.customState?.map || {}
    const array = state.array || state.string || [];
    const pointers = state.pointers || ({} as any);

    if (!currentStep) return null

    try {
        return (
            <div className="flex flex-col h-full w-full overflow-hidden bg-black/40 min-h-0 flex-1 items-center justify-center p-8 space-y-12">
                {/* Main Array Visualization */}
                {Array.isArray(array) && array.length > 0 && (
                    <div className="flex flex-col items-center space-y-4">
                        <span className="text-[10px] font-black uppercase tracking-widest text-white/30">Input Array</span>
                        <div className="flex gap-2">
                            {(array as any[]).map((val: any, idx: number) => {
                                const isPointed = Object.values(pointers).includes(idx);
                                return (
                                    <motion.div
                                        key={idx}
                                        layout
                                        className={`w-12 h-12 rounded-xl border flex items-center justify-center font-bold text-sm transition-all shadow-xl
                                            ${isPointed ? 'bg-[#EC4186] border-[#EC4186] text-white' : 'bg-white/5 border-white/10 text-white/60'}`}
                                    >
                                        {val}
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Hash Table / Map Visualization */}
                <div className="flex flex-col items-center space-y-6 w-full max-w-2xl">
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/30">Hash Map State</span>
                    <div className="grid grid-cols-4 gap-4 w-full">
                        <AnimatePresence mode="popLayout">
                            {Object.entries(table as Record<string, any>).map(([key, val]) => (
                                <motion.div
                                    key={key}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center space-y-1"
                                >
                                    <span className="text-[10px] text-white/40 font-bold">Key</span>
                                    <span className="text-lg font-black text-white">{key}</span>
                                    <div className="w-full h-[1px] bg-white/10 my-1" />
                                    <span className="text-[10px] text-[#EC4186] font-bold">Value</span>
                                    <span className="text-sm font-bold text-white/80">{typeof val === 'object' ? JSON.stringify(val) : String(val)}</span>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                        {Object.keys(table).length === 0 && (
                            <div className="col-span-4 h-32 flex items-center justify-center border border-dashed border-white/10 rounded-2xl text-white/20 italic text-sm">
                                Map is currently empty
                            </div>
                        )}
                    </div>
                </div>

                {/* Calculation HUD */}
                <AnimatePresence mode="wait">
                    {state.calculation && (
                        <motion.div
                            key={`calc-${currentStepIndex}`}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="px-8 py-3 rounded-2xl border-2 border-white/10 bg-white/[0.02] shadow-2xl backdrop-blur-xl mb-4"
                        >
                            <div className="flex items-center gap-4 text-xl font-black italic uppercase text-white font-mono">
                                {typeof state.calculation === 'object' ? JSON.stringify(state.calculation) : state.calculation}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Explanation Overlay */}
                <div className="absolute bottom-10 left-10 right-10 bg-black/60 backdrop-blur-md border border-white/10 p-6 rounded-2xl">
                    <p className="text-sm text-white/80 leading-relaxed font-medium">
                        {currentStep.description || "Initializing logic..."}
                    </p>
                </div>
            </div>
        )
    } catch (error) {
        console.error("HashTableEngine Render Error:", error);
        return (
            <div className="flex flex-col items-center justify-center h-full text-red-400 p-6 text-center">
                <span className="text-[10px] font-black uppercase tracking-widest mb-2">Render Error</span>
                <span className="text-xs font-bold leading-relaxed">Failed to visualize hash table state.</span>
                <span className="text-[8px] mt-2 opacity-40 whitespace-pre font-mono">{String(error).substring(0, 100)}</span>
            </div>
        )
    }
};

export default HashTableEngine;
