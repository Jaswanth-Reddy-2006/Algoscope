import { useStore } from '../../store/useStore'
import { cn } from '../../utils/cn'
import TwoPointerEngine from '../../visualization-engines/TwoPointerEngine'
import SlidingWindowEngine from '../../visualization-engines/SlidingWindowEngine'
import { BinarySearchComparison } from '../foundations/engines/SearchEngine/BinarySearchComparison'
import { MonotonicStackComparison } from '../foundations/engines/MonotonicStack/MonotonicStackComparison'
import FallbackEngine from '../visualization-engines/FallbackEngine'
import { Play } from 'lucide-react'

const VizPanel: React.FC = () => {
    const currentProblem = useStore(state => state.currentProblem)
    const compareMode = useStore(state => state.compareMode)
    const isBruteForce = useStore(state => state.isBruteForce)

    if (!currentProblem) return null

    const steps = isBruteForce ? currentProblem.brute_force_steps : currentProblem.optimal_steps
    const hasSteps = steps && steps.length > 0

    if (!hasSteps && !compareMode) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/20">
                    <Play size={24} />
                </div>
                <div className="space-y-1">
                    <h3 className="text-sm font-bold text-white/40 uppercase tracking-widest">Readiness Check</h3>
                    <p className="text-[10px] text-white/20 uppercase tracking-widest">Run visualization to generate algorithmic steps</p>
                </div>
            </div>
        )
    }

    const complexity = currentProblem.complexity

    const renderEngine = (isBrute: boolean) => {
        // Defensive check for steps before rendering engine
        const currentSteps = isBrute ? currentProblem.brute_force_steps : currentProblem.optimal_steps;
        if (!currentSteps || currentSteps.length === 0) {
            return (
                <div className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-4 text-white/20">
                    No steps available for this strategy.
                </div>
            );
        }

        switch (currentProblem.algorithmType) {
            case 'sliding_window':
                return <SlidingWindowEngine isBrute={isBrute} />
            case 'two_pointer':
                return <TwoPointerEngine isBrute={isBrute} />
            case 'binary_search':
                return <BinarySearchComparison mode="standard" />
            case 'stack':
                return <MonotonicStackComparison mode="next_greater" />
            default:
                return <FallbackEngine isBrute={isBrute} />
        }
    }

    // Special Case: Comparison components handle their own layout
    if (currentProblem.algorithmType === 'binary_search' || currentProblem.algorithmType === 'stack') {
        return (
            <div className="flex-1 flex flex-col bg-white/[0.01] overflow-hidden relative">
                {currentProblem.algorithmType === 'binary_search' ? (
                    <BinarySearchComparison mode={currentProblem.id === 35 ? 'lower_bound' : 'standard'} />
                ) : (
                    <MonotonicStackComparison mode="next_greater" />
                )}
            </div>
        )
    }

    return (
        <div className="flex-1 flex flex-col bg-white/[0.01] overflow-hidden relative">
            {compareMode ? (
                <div className="flex-1 flex divide-x divide-white/5">
                    {/* Naive Column */}
                    <div className="flex-1 flex flex-col">
                        <div className="px-6 py-4 flex items-center justify-between border-b border-white/5 bg-white/[0.02]">
                            <span className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">Naive Strategy</span>
                            <span className="text-[10px] font-mono font-bold text-red-400/40">{complexity.brute}</span>
                        </div>
                        <div className="flex-1 relative">
                            {renderEngine(true)}
                        </div>
                    </div>
                    {/* Refined Column */}
                    <div className="flex-1 flex flex-col">
                        <div className="px-6 py-4 flex items-center justify-between border-b border-white/5 bg-white/[0.02]">
                            <span className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">Optimal Strategy</span>
                            <span className="text-[10px] font-mono font-bold text-green-400/60">{complexity.optimal}</span>
                        </div>
                        <div className="flex-1 relative">
                            {renderEngine(false)}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex-1 flex flex-col">
                    <div className="px-6 py-4 flex items-center justify-between border-b border-white/5 bg-white/[0.02]">
                        <span className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">
                            {isBruteForce ? 'Direct Strategy' : 'Optimal Pattern'}
                        </span>
                        <div className={cn(
                            "px-3 py-1 rounded text-[10px] font-mono font-bold border",
                            isBruteForce ? "border-white/5 text-white/20" : "bg-accent-blue/5 border-accent-blue/20 text-accent-blue"
                        )}>
                            {isBruteForce ? complexity.brute : complexity.optimal}
                        </div>
                    </div>
                    <div className="flex-1 relative">
                        {renderEngine(isBruteForce)}
                    </div>
                </div>
            )}
        </div>
    )
}

export default VizPanel
