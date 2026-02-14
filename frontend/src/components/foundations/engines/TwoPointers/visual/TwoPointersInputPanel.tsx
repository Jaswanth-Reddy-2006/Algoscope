import React, { useState, useEffect } from 'react'
import { GenericInsightCard } from '../../shared/GenericInsightCard'
import { ComparisonStats } from '../../../MentalModelEngine/comparisonStats'

interface Props {
    array: number[]
    target: number
    stats?: ComparisonStats
    onArrayChange: (arr: number[]) => void
    onTargetChange: (target: number) => void
    mode: string // 'two_sum_sorted', 'container_most_water', etc.
}

export const TwoPointersInputPanel: React.FC<Props> = ({
    array,
    target,
    stats,
    onArrayChange,
    onTargetChange,
    mode
}) => {
    const [inputValue, setInputValue] = useState(array.join(', '))
    const [targetValue, setTargetValue] = useState(target.toString())

    useEffect(() => {
        setInputValue(array.join(', '))
    }, [array])

    const handleArraySubmit = () => {
        const parsed = inputValue
            .split(',')
            .map(s => parseInt(s.trim()))
            .filter(n => !isNaN(n))

        if (parsed.length > 0 && parsed.length <= 20) {
            onArrayChange(parsed)
        }
    }


    const getInsightProps = () => {
        if (mode === 'container_most_water') {
            return {
                title: "Container With Most Water",
                bruteForceComplexity: "O(N²)",
                optimalComplexity: "O(N)",
                keyPrinciples: [
                    "Maximize Width vs Height trade-off",
                    "Shrink window from the shorter side",
                    "Only one pass required"
                ],
                invariant: "Area = min(H[L], H[R]) * (R - L)",
                invariantLabel: "Area Formula",
                efficiencyNote: "Eliminates need to check inner pairs bounded by shorter lines"
            }
        }
        // Default to Two Sum Sorted
        return {
            title: "Two Sum (Sorted)",
            bruteForceComplexity: "O(N²)",
            optimalComplexity: "O(N)",
            keyPrinciples: [
                "Sorted array allows directional search",
                "Sum < Target: Need larger number (Left++)",
                "Sum > Target: Need smaller number (Right--)"
            ],
            invariant: "L < R ensures distinct comparison",
            invariantLabel: "Search Invariant",
            efficiencyNote: "Each step definitively eliminates one candidate (L or R)"
        }
    }

    const insight = getInsightProps()

    return (
        <div className="grid grid-cols-5 gap-6">
            {/* Left 60% - Interactive Input Panel */}
            <div className="col-span-3 p-6 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col justify-between">
                <div>
                    <h3 className="text-lg font-bold text-white mb-4">Interactive Input Panel</h3>

                    {/* Array Input */}
                    <div className="mb-4">
                        <div className="flex justify-between items-end mb-2">
                            <label className="text-sm text-white/60 block">Editable Array</label>
                            <button
                                onClick={() => {
                                    const newArr = Array.from({ length: 8 }, () => Math.floor(Math.random() * 20) + 1).sort((a, b) => a - b)
                                    onArrayChange(newArr)
                                    setInputValue(newArr.join(', '))
                                }}
                                className="text-xs text-accent-blue hover:text-white transition-colors"
                            >
                                Randomize
                            </button>
                        </div>
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onBlur={handleArraySubmit}
                            onKeyDown={(e) => e.key === 'Enter' && handleArraySubmit()}
                            className="w-full px-4 py-2 rounded-xl bg-black/40 border border-white/10 text-white font-mono focus:outline-none focus:border-accent-blue/50 transition-colors text-sm"
                            placeholder="2, 7, 11, 15"
                        />
                        <p className="text-xs text-white/40 mt-1">
                            Comma-separated numbers (max 20). Must be sorted for Two Sum.
                        </p>
                    </div>

                    {/* Target Input - Only for relevant modes */}
                    {mode !== 'container_most_water' && (
                        <div className="mb-4">
                            <div className="flex items-center justify-between">
                                <label className="text-sm text-white/60">Target Sum</label>
                                <input
                                    type="number"
                                    value={targetValue}
                                    onChange={(e) => {
                                        setTargetValue(e.target.value)
                                        const val = parseInt(e.target.value)
                                        if (!isNaN(val)) onTargetChange(val)
                                    }}
                                    className="w-20 px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white font-mono text-center focus:outline-none focus:border-accent-blue/50 transition-colors"
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Live Stats - Matching Sliding Window Layout */}
                {stats && (
                    <div className="p-4 rounded-xl bg-black/40 border border-white/10 mt-auto">
                        <div className="grid grid-cols-3 gap-3 text-center">
                            <div>
                                <div className="text-[9px] uppercase tracking-widest text-white/40 mb-1">Array Length</div>
                                <div className="text-xl font-bold text-white font-mono">{array.length}</div>
                            </div>
                            <div>
                                <div className="text-[9px] uppercase tracking-widest text-white/40 mb-1">Pairs Checked</div>
                                <div className="text-xl font-bold text-accent-blue font-mono">{stats.optimalSteps || 0}</div>
                            </div>
                            <div>
                                <div className="text-[9px] uppercase tracking-widest text-white/40 mb-1">Brute Ops</div>
                                <div className="text-xl font-bold text-white font-mono">{stats.bruteForceSteps || 0}</div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Right 40% - Concept Card */}
            <div className="col-span-2 h-full">
                <GenericInsightCard {...insight} />
            </div>
        </div>
    )
}
