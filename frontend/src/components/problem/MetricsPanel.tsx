import React from 'react'
import { useStore } from '../../store/useStore'
import { Activity, Zap, Info, Globe } from 'lucide-react'

const MetricsPanel: React.FC = () => {
    const currentProblem = useStore(state => state.currentProblem)
    const isBruteForce = useStore(state => state.isBruteForce)
    const currentStepIndex = useStore(state => state.currentStepIndex)

    if (!currentProblem) return null

    const bruteefficiency = currentProblem.efficiency?.brute || { time: 'O(N²)', space: 'O(N)' }
    const optimalefficiency = currentProblem.efficiency?.optimal || { time: 'O(N)', space: 'O(1)' }

    const metrics = [
        { label: 'Time', brute: bruteefficiency.time, optimal: optimalefficiency.time, type: 'time' },
        { label: 'Space', brute: bruteefficiency.space, optimal: optimalefficiency.space, type: 'space' },
    ]

    return (
        <div className="h-48 border-t border-white/5 bg-background/50 backdrop-blur-md flex divide-x divide-white/5 overflow-hidden shrink-0">
            {/* Performance Metrics Table */}
            <div className="flex-1 p-6 flex flex-col gap-4">
                <div className="flex items-center gap-2">
                    <Activity size={12} className="text-accent-blue" />
                    <h3 className="text-[10px] uppercase font-bold text-white/40 tracking-widest">Performance</h3>
                </div>
                <div className="flex-1 grid grid-cols-4 gap-4 items-center">
                    <div className="col-span-1 border-r border-white/5 pr-4">
                        <div className="text-[9px] uppercase font-bold text-white/20 mb-1">Metric</div>
                        <div className="space-y-2">
                            {metrics.map(m => (
                                <div key={m.label} className="text-[10px] font-bold text-white/60 h-6 flex items-center">{m.label}</div>
                            ))}
                        </div>
                    </div>
                    <div className="col-span-1 px-4">
                        <div className="text-[9px] uppercase font-bold text-red-500/40 mb-1">Brute</div>
                        <div className="space-y-2">
                            {metrics.map(m => (
                                <div key={m.label} className="text-[10px] font-mono text-red-400 h-6 flex items-center italic">{m.brute}</div>
                            ))}
                        </div>
                    </div>
                    <div className="col-span-1 px-4">
                        <div className="text-[9px] uppercase font-bold text-accent-blue/40 mb-1">Optimal</div>
                        <div className="space-y-2">
                            {metrics.map(m => (
                                <div key={m.label} className="text-[10px] font-mono text-accent-blue h-6 flex items-center font-bold tracking-tight">{m.optimal}</div>
                            ))}
                        </div>
                    </div>
                    <div className="col-span-1 pl-4 bg-accent-blue/5 rounded-xl border border-accent-blue/10 p-4 h-full flex flex-col justify-center">
                        <div className="flex items-center gap-2 mb-1">
                            <Zap size={10} className="text-accent-blue" />
                            <span className="text-[9px] uppercase font-bold text-accent-blue tracking-widest">Efficiency Gain</span>
                        </div>
                        <p className="text-[10px] text-white/50 leading-relaxed font-light">
                            {isBruteForce
                                ? "Selecting 'Optimal' will improve performance to " + optimalefficiency.time
                                : "Reduced search space from " + bruteefficiency.time + " to " + optimalefficiency.time + "."}
                        </p>
                    </div>
                </div>
            </div>

            {/* Real World Mapping & Insights */}
            <div className="w-[350px] p-6 flex flex-col gap-4">
                <div className="flex items-center gap-2">
                    <Globe size={12} className="text-pink-500" />
                    <h3 className="text-[10px] uppercase font-bold text-white/40 tracking-widest">Real World Mapping</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                    {currentProblem.scenarios && currentProblem.scenarios.map((scenario: string, i: number) => (
                        <div key={i} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-[10px] text-white/40 flex items-center gap-2">
                            <div className="w-1 h-1 rounded-full bg-pink-500/40" />
                            {scenario}
                        </div>
                    ))}
                    {!currentProblem.scenarios && (
                        <span className="text-[10px] text-white/20 italic">No scenarios mapped yet.</span>
                    )}
                </div>

                <div className="mt-auto flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.02] border border-dashed border-white/10 group overflow-hidden">
                    <Info size={10} className="text-white/20 group-hover:text-accent-blue transition-colors" />
                    <p className="text-[9px] text-white/20 font-medium italic group-hover:text-white/40 transition-colors">
                        Current Step Efficiency: {currentStepIndex + 1} ops
                    </p>
                </div>
            </div>
        </div>
    )
}

export default MetricsPanel
