import React, { useState, useEffect } from 'react'
import { GenericInsightCard } from '../../shared/GenericInsightCard'
import { RefreshCcw, AlertTriangle, BookOpen, Search } from 'lucide-react'
import { ComparisonStats } from '../../../MentalModelEngine/comparisonStats'

interface Props {
    array: number[]
    target: number
    stats?: ComparisonStats
    onArrayChange: (arr: number[]) => void
    onTargetChange: (target: number) => void
    onRandomize: (shouldExist: boolean) => void
    mode: string
}

export const BinarySearchInputPanel: React.FC<Props> = ({
    array,
    target,
    stats,
    onArrayChange,
    onTargetChange,
    onRandomize,
    mode
}) => {
    const [inputStr, setInputStr] = useState(array.join(', '))
    const [targetStr, setTargetStr] = useState(target.toString())
    const [targetExists, setTargetExists] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // Sync local state when props change (e.g. from randomize)
    useEffect(() => {
        setInputStr(array.join(', '))
    }, [array])

    useEffect(() => {
        setTargetStr(target.toString())
    }, [target])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value
        setInputStr(val)
        setError(null)

        try {
            const numArr = val.split(',').map(s => s.trim()).filter(s => s !== '').map(Number)
            if (numArr.some(isNaN)) {
                setError("Array must contain numbers only")
                return
            }

            // Check sorted
            const isSorted = numArr.every((v, i, a) => i === 0 || a[i - 1] <= v)
            if (!isSorted) {
                setError("Array must be sorted for Binary Search")
                // We still update the array to show the user "Broken" state or just warn?
                // Requirements say: "If not sorted -> show warning".
                // We might not update the visuals if it breaks the algo, or update and let it fail?
                // Let's update it but keep the error visible.
            }

            onArrayChange(numArr)
        } catch (err) {
            setError("Invalid format")
        }
    }

    const handleTargetInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTargetStr(e.target.value)
        const num = Number(e.target.value)
        if (!isNaN(num)) {
            onTargetChange(num)
        }
    }

    return (
        <div className="space-y-6">
            {/* SECTION A: Core Definition Card */}
            <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Search size={120} />
                </div>

                <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="col-span-2">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 bg-accent-blue/10 rounded-lg">
                                <BookOpen size={20} className="text-accent-blue" />
                            </div>
                            <h2 className="text-2xl font-bold text-white">Binary Search</h2>
                            <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 text-xs font-bold uppercase tracking-wider rounded-full border border-emerald-500/20">
                                Halving Strategy
                            </span>
                        </div>
                        <p className="text-lg text-white/80 leading-relaxed mb-4">
                            Binary Search reduces a sorted search space by <span className="text-accent-blue font-bold">half</span> at every step.
                        </p>

                        <div className="flex flex-wrap gap-2">
                            {["Sorted Array", "Monotonic Function", "Search Space Reduction", "O(log N)"].map((tag, i) => (
                                <span key={i} className="px-3 py-1 bg-white/5 border border-white/5 rounded-full text-xs text-white/60">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="border-l border-white/5 pl-8 hidden md:block">
                        <div className="space-y-4">
                            <div>
                                <h4 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-2">Recognition Signals</h4>
                                <ul className="text-sm text-white/60 space-y-1">
                                    <li className="flex items-center gap-2"><div className="w-1 h-1 bg-accent-blue rounded-full" /> "Find in sorted array"</li>
                                    <li className="flex items-center gap-2"><div className="w-1 h-1 bg-accent-blue rounded-full" /> "Minimum/Maximum satisfying condition"</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* SECTION B: Interactive Input & Insight */}
            <div className="grid grid-cols-5 gap-6">
                {/* LEFT: Input Panel */}
                <div className="col-span-3 p-6 bg-white/[0.02] rounded-2xl border border-white/5 flex flex-col gap-6">
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-white">Input Configuration</h3>
                            <div className="flex bg-black/40 rounded-lg p-1 border border-white/5">
                                <button
                                    onClick={() => { setTargetExists(true); onRandomize(true); }}
                                    className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${targetExists ? 'bg-emerald-500/20 text-emerald-400' : 'text-white/40 hover:text-white'}`}
                                >
                                    Exists
                                </button>
                                <button
                                    onClick={() => { setTargetExists(false); onRandomize(false); }}
                                    className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${!targetExists ? 'bg-red-500/20 text-red-400' : 'text-white/40 hover:text-white'}`}
                                >
                                    Not Exists
                                </button>
                            </div>
                        </div>

                        {/* Array Input */}
                        <div className="space-y-2 mb-4">
                            <label className="text-xs font-bold text-white/40 uppercase tracking-widest">Sorted Array (Comma separated)</label>
                            <input
                                type="text"
                                value={inputStr}
                                onChange={handleInputChange}
                                className={`w-full bg-black/40 border ${error ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-accent-blue/50'} rounded-xl px-4 py-3 text-sm font-mono text-white placeholder-white/20 transition-all outline-none`}
                                placeholder="1, 3, 5, 7, 9..."
                            />
                            {error && (
                                <div className="flex items-center gap-2 text-red-400 text-xs">
                                    <AlertTriangle size={12} />
                                    <span>{error}</span>
                                </div>
                            )}
                        </div>

                        {/* Target Input & Randomize */}
                        <div className="flex items-end gap-4">
                            <div className="flex-1 space-y-2">
                                <label className="text-xs font-bold text-white/40 uppercase tracking-widest">Target Value</label>
                                <input
                                    type="number"
                                    value={targetStr}
                                    onChange={handleTargetInputChange}
                                    className="w-full bg-black/40 border border-white/10 focus:border-accent-blue/50 rounded-xl px-4 py-3 text-sm font-mono text-white placeholder-white/20 transition-all outline-none"
                                />
                            </div>
                            <button
                                onClick={() => onRandomize(targetExists)}
                                className="px-6 py-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors flex items-center gap-2 text-sm text-white font-medium border border-white/5 h-[46px]"
                            >
                                <RefreshCcw size={16} />
                                <span>Randomize</span>
                            </button>
                        </div>
                    </div>

                    {/* Array Preview / Length */}
                    <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between text-xs text-white/40">
                        <span>Array Length: <span className="text-white font-mono">{array.length}</span></span>
                        <span>Mode: <span className="text-white uppercase">{mode}</span></span>
                    </div>

                    {/* Stats */}
                    {stats && (
                        <div className="mt-2 grid grid-cols-2 gap-2">
                            <div className="p-3 bg-black/40 border border-white/5 rounded-xl flex items-center justify-between">
                                <span className="text-xs text-white/40">Binary Steps</span>
                                <span className="text-lg font-bold text-accent-blue font-mono">{stats.optimalSteps || 0}</span>
                            </div>
                            <div className="p-3 bg-black/40 border border-white/5 rounded-xl flex items-center justify-between">
                                <span className="text-xs text-white/40">Linear Steps</span>
                                <span className="text-lg font-bold text-red-400 font-mono">{stats.bruteForceSteps || 0}</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* RIGHT: Insight Card */}
                <div className="col-span-2 h-full">
                    <GenericInsightCard
                        title="Why Binary Search?"
                        bruteForceComplexity="O(N)"
                        optimalComplexity="O(log N)"
                        keyPrinciples={[
                            "Halve the search space every step",
                            "Data MUST be sorted",
                            "Compare middle element with target"
                        ]}
                        invariant={
                            mode === 'lower_bound' ? "first index >= target" :
                                mode === 'upper_bound' ? "first index > target" :
                                    "low <= high implies range valid"
                        }
                        invariantLabel="Halving Logic"
                        efficiencyNote={`Efficiency Gain: ${stats?.efficiencyGain ? stats.efficiencyGain + '%' : 'Calculated Live'}`}
                    />
                </div>
            </div>
        </div>
    )
}
