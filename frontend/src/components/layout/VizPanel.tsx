import React, { Suspense } from 'react'
import { useStore } from '../../store/useStore'
import { getEngine } from '../../registry/engineRegistry'
import ErrorBoundary from '../common/ErrorBoundary'

const VizPanel: React.FC = () => {
    const currentProblem = useStore(state => state.currentProblem)
    const compareMode = useStore(state => state.compareMode)
    const isBruteForce = useStore(state => state.isBruteForce)

    if (!currentProblem) return null

    const renderEngine = (isBrute: boolean) => {
        const Engine = getEngine(currentProblem.algorithmType)

        if (!Engine) {
            return (
                <div className="flex items-center justify-center h-full text-white/20 italic text-sm">
                    Visualization engine for {currentProblem.algorithmType} is under construction...
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
                    <Engine isBrute={isBrute} />
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
                                    "The optimal strategy eliminates redundant calculations to improve performance."
                            }
                        </p>
                        <div className="px-3 py-1 rounded-full border border-white/10 text-[9px] font-black text-white/30 uppercase tracking-widest">
                            {currentProblem.efficiency?.optimal?.time} vs {currentProblem.efficiency?.brute?.time}
                        </div>
                    </div>

                    <div className="flex-1 flex divide-x divide-white/5 relative h-full">
                        {/* Brute/Naive Column */}
                        <div className="flex-1 flex flex-col h-full">
                            <div className="h-10 border-b border-white/5 flex items-center justify-center bg-[#EE544A]/5 shrink-0">
                                <span className="text-[10px] font-bold text-[#EE544A]/60 uppercase tracking-widest">Brute Force Exploration</span>
                            </div>
                            <div className="flex-1 relative overflow-hidden h-full">
                                {renderEngine(true)}
                            </div>
                        </div>
                        {/* Optimal/Refined Column */}
                        <div className="flex-1 flex flex-col h-full">
                            <div className="h-10 border-b border-white/5 flex items-center justify-center bg-[#EC4186]/5 shrink-0">
                                <span className="text-[10px] font-bold text-[#EC4186] uppercase tracking-widest">Optimal Execution</span>
                            </div>
                            <div className="flex-1 relative overflow-hidden h-full">
                                {renderEngine(false)}
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex-1 flex flex-col relative z-10 w-full h-full min-h-0">
                    {/* No header here since engine has its own 10% explanation bar */}
                    <div className="flex-1 relative overflow-hidden h-full">
                        {renderEngine(isBruteForce)}
                    </div>
                </div>
            )}
        </div>
    )
}

export default VizPanel
