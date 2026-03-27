import React, { Suspense } from 'react'
import { useStore } from '../../store/useStore'
import { resolveEngine } from '../../registry/engineRegistry'
import ErrorBoundary from '../common/ErrorBoundary'
import { cn } from '../../utils/cn'

const VizPanel: React.FC = () => {
    const currentProblem = useStore(state => state.currentProblem)
    const compareMode = useStore(state => state.compareMode)
    const isBruteForce = useStore(state => state.isBruteForce)
    const compareLeft = useStore(state => state.compareLeft)
    const compareRight = useStore(state => state.compareRight)
    const compareLeftSteps = useStore(state => state.compareLeftSteps)
    const compareRightSteps = useStore(state => state.compareRightSteps)
    const setCompareSide = useStore(state => state.setCompareSide)

    if (!currentProblem) return null

    const renderEngine = (mode: 'brute' | 'optimal', steps?: any[]) => {
        const Engine = resolveEngine(currentProblem)

        if (!Engine) {
            return (
                <div className="flex flex-col items-center justify-center h-full text-white/20 italic text-sm space-y-2">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50">Visualization Pending</span>
                    <span className="font-medium">The dynamic generator for {currentProblem.algorithmType.replace('_', ' ')} is being synchronized.</span>
                </div>
            )
        }

        return (
            <ErrorBoundary fallback={
                <div className="flex flex-col items-center justify-center h-full text-red-400 bg-red-400/5 p-6 text-center border border-red-500/20 rounded-2xl">
                    <span className="text-[10px] font-black uppercase tracking-widest mb-2">Engine Alert</span>
                    <span className="text-xs font-bold leading-relaxed">The visualization logic crashed while rendering.</span>
                    <span className="text-[8px] mt-2 opacity-40 uppercase">Isolating failure...</span>
                </div>
            }>
                <Suspense fallback={
                    <div className="flex items-center justify-center h-full">
                        <div className="w-8 h-8 border-2 border-[#EC4186]/20 border-t-[#EC4186] rounded-full animate-spin" />
                    </div>
                }>
                    <Engine isBrute={mode === 'brute'} steps={steps} />
                </Suspense>
            </ErrorBoundary>
        )
    }

    return (
        <div className="flex-1 flex flex-col bg-[#1b062b] overflow-hidden relative border-none h-full">
            {/* Grid Pattern Overlay */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none pattern-grid-lg" />

            {compareMode ? (
                <div className="flex-1 flex flex-col relative z-10 h-full">
                    {/* Comparison Insight Bar */}
                    <div className="h-12 border-b border-white/5 bg-[#EC4186]/5 flex items-center justify-between px-10 shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#EC4186] shadow-[0_0_10px_rgba(236,65,134,0.6)] animate-pulse" />
                            <span className="text-[10px] font-black text-[#EC4186] uppercase tracking-[0.2em]">Efficiency Analysis</span>
                        </div>
                        <p className="text-[11px] text-white/50 font-medium italic">
                            {currentProblem.algorithmType === 'two_pointers' ?
                                "Optimal reduces O(N²) quadratic search to O(N) linear scan by leveraging sorted order." :
                                currentProblem.algorithmType === 'sliding_window' ?
                                    "Optimal eliminates redundant substring re-scans using a dynamic window." :
                                    currentProblem.algorithmType === 'recursion' || currentProblem.algorithmType === 'backtracking' ?
                                        "Optimal strategies often use memoization or pruning to reduce exponential branching." :
                                        "The optimal strategy eliminates redundant calculations to improve performance."
                            }
                        </p>
                        <div className="px-3 py-1 rounded-full border border-white/10 text-[9px] font-black text-white/30 uppercase tracking-widest">
                            {currentProblem.efficiency?.optimal?.time} vs {currentProblem.efficiency?.brute?.time}
                        </div>
                    </div>

                    <div className="flex-1 flex divide-x divide-white/5 relative h-full">
                        {/* LEFT Column */}
                        <div className="flex-1 flex flex-col h-full">
                            <div className="h-14 border-b border-white/5 flex items-center justify-between px-6 bg-white/[0.02] shrink-0">
                                <div className="flex items-center gap-4">
                                    <div className="flex bg-black/40 p-1 rounded-xl border border-white/5">
                                        <button
                                            onClick={() => setCompareSide('left', { mode: 'brute' })}
                                            className={cn("px-3 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all", compareLeft.mode === 'brute' ? "bg-[#EE544A] text-white shadow-lg shadow-red-500/20" : "text-white/20 hover:text-white/40")}
                                        >Brute</button>
                                        <button
                                            onClick={() => setCompareSide('left', { mode: 'optimal' })}
                                            className={cn("px-3 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all", compareLeft.mode === 'optimal' ? "bg-[#EC4186] text-white shadow-lg shadow-pink-500/20" : "text-white/20 hover:text-white/40")}
                                        >Optimal</button>
                                    </div>
                                    {compareLeft.mode === 'optimal' && currentProblem.optimal_variants && currentProblem.optimal_variants.length > 1 && (
                                        <select
                                            value={compareLeft.variantIndex}
                                            onChange={(e) => setCompareSide('left', { variantIndex: parseInt(e.target.value) })}
                                            className="bg-white/5 border border-white/10 rounded-xl text-[9px] font-black text-white/60 px-3 py-1.5 outline-none hover:border-white/20 transition-all cursor-pointer uppercase tracking-tighter"
                                        >
                                            {currentProblem.optimal_variants.map((v: any, i: number) => <option key={i} value={i} className="bg-[#1b062b] text-white">{v.name}</option>)}
                                        </select>
                                    )}
                                </div>
                            </div>
                            <div className="flex-1 relative overflow-hidden h-full">
                                {renderEngine(compareLeft.mode, compareLeftSteps)}
                            </div>
                        </div>

                        {/* RIGHT Column */}
                        <div className="flex-1 flex flex-col h-full">
                            <div className="h-14 border-b border-white/5 flex items-center justify-between px-6 bg-white/[0.02] shrink-0">
                                <div className="flex items-center gap-4">
                                    <div className="flex bg-black/40 p-1 rounded-xl border border-white/5">
                                        <button
                                            onClick={() => setCompareSide('right', { mode: 'brute' })}
                                            className={cn("px-3 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all", compareRight.mode === 'brute' ? "bg-[#EE544A] text-white shadow-lg shadow-red-500/20" : "text-white/20 hover:text-white/40")}
                                        >Brute</button>
                                        <button
                                            onClick={() => setCompareSide('right', { mode: 'optimal' })}
                                            className={cn("px-3 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all", compareRight.mode === 'optimal' ? "bg-[#EC4186] text-white shadow-lg shadow-pink-500/20" : "text-white/20 hover:text-white/40")}
                                        >Optimal</button>
                                    </div>
                                    {compareRight.mode === 'optimal' && currentProblem.optimal_variants && currentProblem.optimal_variants.length > 1 && (
                                        <select
                                            value={compareRight.variantIndex}
                                            onChange={(e) => setCompareSide('right', { variantIndex: parseInt(e.target.value) })}
                                            className="bg-white/5 border border-white/10 rounded-xl text-[9px] font-black text-white/60 px-3 py-1.5 outline-none hover:border-white/20 transition-all cursor-pointer uppercase tracking-tighter"
                                        >
                                            {currentProblem.optimal_variants.map((v: any, i: number) => <option key={i} value={i} className="bg-[#1b062b] text-white">{v.name}</option>)}
                                        </select>
                                    )}
                                </div>
                            </div>
                            <div className="flex-1 relative overflow-hidden h-full">
                                {renderEngine(compareRight.mode, compareRightSteps)}
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex-1 flex flex-col relative z-10 w-full h-full min-h-0">
                    {/* No header here since engine has its own 10% explanation bar */}
                    <div className="flex-1 relative overflow-hidden h-full">
                        {renderEngine(isBruteForce ? 'brute' : 'optimal')}
                    </div>
                </div>
            )}
        </div>
    )
}

export default VizPanel
