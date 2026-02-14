import React, { useState } from 'react'
import { ConceptCard } from './ConceptCard'
import { ComparisonStats } from './MentalModelEngine/comparisonStats'

interface Props {
    array: number[]
    windowSize: number
    stats: ComparisonStats
    onArrayChange: (arr: number[]) => void
    onWindowSizeChange: (size: number) => void
}

export const ProblemPlayground: React.FC<Props> = ({
    array,
    windowSize,
    stats,
    onArrayChange,
    onWindowSizeChange
}) => {
    const [inputValue, setInputValue] = useState(array.join(','))

    const handleArraySubmit = () => {
        const parsed = inputValue
            .split(',')
            .map(s => parseInt(s.trim()))
            .filter(n => !isNaN(n))

        if (parsed.length > 0 && parsed.length <= 20) {
            onArrayChange(parsed)
        }
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleArraySubmit()
        }
    }

    return (
        <div className="grid grid-cols-5 gap-6">
            {/* Left 60% - Interactive Input Panel */}
            <div className="col-span-3 p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                <h3 className="text-lg font-bold text-white mb-4">Interactive Input Panel</h3>

                {/* Array Input */}
                <div className="mb-4">
                    <div className="flex justify-between items-end mb-2">
                        <label className="text-sm text-white/60 block">Editable Array</label>
                        <button
                            onClick={() => {
                                const newArr = Array.from({ length: 8 }, () => Math.floor(Math.random() * 20) + 1)
                                onArrayChange(newArr)
                                setInputValue(newArr.join(','))
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
                        onKeyPress={handleKeyPress}
                        className="w-full px-4 py-2 rounded-xl bg-black/40 border border-white/10 text-white font-mono focus:outline-none focus:border-accent-blue/50 transition-colors text-sm"
                        placeholder="2,5,1,8,2,9,1"
                    />
                    <p className="text-xs text-white/40 mt-1">
                        Comma-separated numbers (max 20)
                    </p>
                </div>

                {/* Window Size Input */}
                <div className="mb-4">
                    <div className="flex items-center justify-between">
                        <label className="text-sm text-white/60">Window Size</label>
                        <input
                            type="number"
                            min={1}
                            max={array.length}
                            value={windowSize}
                            onChange={(e) => {
                                const val = parseInt(e.target.value)
                                if (!isNaN(val) && val >= 1 && val <= array.length) {
                                    onWindowSizeChange(val)
                                }
                            }}
                            className="w-20 px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white font-mono text-center focus:outline-none focus:border-accent-blue/50 transition-colors"
                        />
                    </div>
                </div>

                {/* Live Stats */}
                <div className="p-4 rounded-xl bg-black/40 border border-white/10">
                    <div className="grid grid-cols-3 gap-3 text-center">
                        <div>
                            <div className="text-[9px] uppercase tracking-widest text-white/40 mb-1">Array Length</div>
                            <div className="text-xl font-bold text-white font-mono">{array.length}</div>
                        </div>
                        <div>
                            <div className="text-[9px] uppercase tracking-widest text-white/40 mb-1">Window Size</div>
                            <div className="text-xl font-bold text-accent-blue font-mono">{windowSize}</div>
                        </div>
                        <div>
                            <div className="text-[9px] uppercase tracking-widest text-white/40 mb-1">Subarrays</div>
                            <div className="text-xl font-bold text-white font-mono">{stats.numWindows ?? 0}</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right 40% - Concept Card */}
            <div className="col-span-2">
                <ConceptCard stats={stats} />
            </div>
        </div>
    )
}
