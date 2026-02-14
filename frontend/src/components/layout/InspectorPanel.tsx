import React from 'react'
import { useStore } from '../../store/useStore'
import { Bug } from 'lucide-react'

const InspectorPanel: React.FC = () => {
    const currentProblem = useStore(state => state.currentProblem)
    const isBruteForce = useStore(state => state.isBruteForce)
    const currentStepIndex = useStore(state => state.currentStepIndex)

    if (!currentProblem) return null

    const steps = isBruteForce ? currentProblem.brute_force_steps : currentProblem.optimal_steps
    const step = steps[currentStepIndex] || { state: {} }
    const { state } = step

    const renderValue = (v: any) => {
        if (v === null || v === undefined) return '-'
        if (typeof v === 'object') {
            try {
                return JSON.stringify(v)
            } catch {
                return '[Complex Object]'
            }
        }
        return String(v)
    }

    return (
        <div className="flex flex-col h-full font-mono bg-black/20">
            <div className="px-6 py-4 flex items-center justify-between border-b border-white/5 bg-white/[0.02]">
                <div className="flex items-center gap-2">
                    <Bug size={14} className="text-white/20" />
                    <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">State Inspector</span>
                </div>
                <span className="text-[9px] font-bold text-white/10 uppercase bg-white/5 px-2 py-0.5 rounded">Real-time</span>
            </div>

            <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar">
                {/* Active Pointers */}
                <div className="space-y-4">
                    <h4 className="text-[8px] font-bold text-white/20 uppercase tracking-[0.2em]">Pointers</h4>
                    <div className="grid grid-cols-2 gap-3">
                        {state.pointers && Object.entries(state.pointers).map(([id, index]) => (
                            <div key={id} className="bg-white/[0.02] border border-white/5 p-3 rounded-xl flex flex-col gap-1">
                                <span className="text-[8px] text-white/20 uppercase font-bold tracking-widest">Pointer {id}</span>
                                <span className="text-sm font-mono font-bold text-white/80">{renderValue(index)}</span>
                            </div>
                        ))}
                        {(!state.pointers || Object.keys(state.pointers).length === 0) && (
                            <div className="col-span-2 text-[10px] text-white/10 italic">No pointers active</div>
                        )}
                    </div>
                </div>

                {/* Custom Map/Object State */}
                <div className="space-y-4">
                    <h4 className="text-[8px] font-bold text-white/20 uppercase tracking-[0.2em]">Data Structure State</h4>
                    <div className="space-y-2">
                        {state.mapState && Object.entries(state.mapState).map(([key, value]) => (
                            <div key={key} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.01] border border-white/5">
                                <span className="text-[10px] text-accent-blue/60 font-mono font-bold uppercase">{renderValue(key)}</span>
                                <span className="text-[10px] text-white/60 font-mono">{renderValue(value)}</span>
                            </div>
                        ))}
                        {state.customState && Object.entries(state.customState).map(([key, value]) => (
                            <div key={key} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.01] border border-white/5">
                                <span className="text-[10px] text-purple-400/60 font-mono font-bold uppercase">{renderValue(key)}</span>
                                <span className="text-[10px] text-white/60 font-mono">{renderValue(value)}</span>
                            </div>
                        ))}
                        {(!state.mapState && !state.customState) && (
                            <div className="text-[10px] text-white/10 italic">No complex state data</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default InspectorPanel
