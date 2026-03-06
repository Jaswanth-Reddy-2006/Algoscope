import React from 'react'
import { useStore } from '../../store/useStore'
import { Bug, Target, Activity, Database, Table as TableIcon } from 'lucide-react'
import { cn } from '../../utils/cn'

const InspectorPanel: React.FC = () => {
    const currentProblem = useStore(state => state.currentProblem)
    const isBruteForce = useStore(state => state.isBruteForce)
    const currentStepIndex = useStore(state => state.currentStepIndex)
    const customTarget = useStore(state => state.customTarget)

    if (!currentProblem) return null

    const steps = isBruteForce ? currentProblem.brute_force_steps : currentProblem.optimal_steps
    const step = (steps && steps.length > 0) ? (steps[currentStepIndex] || steps[0]) : null

    if (!step || !step.state) return null
    const state = step.state

    const rawItems = (state as any).array || (state as any).string || (state as any).result || []
    const items = typeof rawItems === 'string' ? rawItems.split('') : rawItems
    const pointers = state.pointers || {}
    const mapState = state.mapState || {}
    const customState = state.customState || {}

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
        <div className="flex flex-col h-full font-outfit bg-[#0f0314]/50 backdrop-blur-xl border-l border-white/5">
            {/* Header */}
            <div className="px-6 py-5 flex items-center justify-between border-b border-white/5 bg-white/[0.02]">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-accent-blue/10 flex items-center justify-center border border-accent-blue/20">
                        <Bug size={14} className="text-accent-blue" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black text-white/80 uppercase tracking-[0.2em]">State Inspector</span>
                        <span className="text-[8px] font-bold text-white/20 uppercase">Real-time Memory Stream</span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent-blue animate-pulse" />
                    <span className="text-[9px] font-black text-accent-blue uppercase tracking-widest">Active</span>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-10">

                {/* 1. Tracked Variables (Summary Section) */}
                <section className="space-y-4">
                    <div className="flex items-center gap-2">
                        <Target size={12} className="text-purple-400" />
                        <h4 className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em]">Engine Variables</h4>
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                        <div className="bg-white/[0.03] border border-white/5 p-4 rounded-2xl flex justify-between items-center group hover:border-purple-500/30 transition-all">
                            <span className="text-[10px] font-bold text-white/40 uppercase">Target Value</span>
                            <span className="text-sm font-mono font-black text-purple-400">{customTarget || currentProblem.target || '-'}</span>
                        </div>
                        {customState.currentSum !== undefined && (
                            <div className="bg-white/[0.03] border border-white/5 p-4 rounded-2xl flex justify-between items-center group hover:border-green-500/30 transition-all">
                                <span className="text-[10px] font-bold text-white/40 uppercase">Current Sum</span>
                                <span className={cn("text-sm font-mono font-black", customState.currentSum === (customTarget || currentProblem.target) ? "text-green-400" : "text-white/80")}>
                                    {customState.currentSum}
                                </span>
                            </div>
                        )}
                        {Object.entries(customState).map(([key, val]) => {
                            if (key === 'currentSum' || key === 'windowRange') return null
                            return (
                                <div key={key} className="bg-white/[0.03] border border-white/5 p-4 rounded-2xl flex justify-between items-center">
                                    <span className="text-[10px] font-bold text-white/40 uppercase">{key.replace(/([A-Z])/g, ' $1')}</span>
                                    <span className="text-sm font-mono font-black text-accent-blue">{renderValue(val)}</span>
                                </div>
                            )
                        })}
                    </div>
                </section>

                {/* 2. Pointer References */}
                <section className="space-y-4">
                    <div className="flex items-center gap-2">
                        <Activity size={12} className="text-accent-blue" />
                        <h4 className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em]">Active Pointers</h4>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        {Object.entries(pointers).map(([id, idx]) => {
                            const val = items[idx as number];
                            const isPurple = id === 'j' || id === 'r' || id === 'right';
                            return (
                                <div key={id} className={cn(
                                    "bg-white/[0.02] border p-4 rounded-2xl flex flex-col gap-2 transition-all",
                                    isPurple ? "border-purple-500/20 hover:border-purple-500/40" : "border-accent-blue/20 hover:border-accent-blue/40"
                                )}>
                                    <div className="flex justify-between items-center">
                                        <span className={cn("text-[9px] font-black uppercase tracking-widest", isPurple ? "text-purple-400" : "text-accent-blue")}>
                                            Pointer {id}
                                        </span>
                                        <span className="text-[8px] font-mono text-white/20">IDX: {idx as number}</span>
                                    </div>
                                    <div className="text-lg font-mono font-black text-white">
                                        {renderValue(val)}
                                    </div>
                                </div>
                            )
                        })}
                        {Object.keys(pointers).length === 0 && (
                            <div className="col-span-2 py-4 text-center border border-dashed border-white/5 rounded-2xl">
                                <span className="text-[10px] text-white/10 uppercase font-bold tracking-widest">No Pointers Active</span>
                            </div>
                        )}
                    </div>
                </section>

                {/* 3. Memory Table (Index Values) */}
                <section className="space-y-4">
                    <div className="flex items-center gap-2">
                        <TableIcon size={12} className="text-white/40" />
                        <h4 className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em]">Memory Snapshots</h4>
                    </div>
                    <div className="bg-white/[0.01] border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-white/[0.04] border-b border-white/10">
                                    <th className="px-4 py-3 text-[8px] font-black text-white/40 uppercase tracking-widest">Index</th>
                                    <th className="px-4 py-3 text-[8px] font-black text-white/40 uppercase tracking-widest text-center">Value</th>
                                    <th className="px-4 py-3 text-[8px] font-black text-white/40 uppercase tracking-widest text-right">Label</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/[0.05]">
                                {items.map((val: any, idx: number) => {
                                    const activePointers = Object.entries(pointers)
                                        .filter(([_, pIdx]) => pIdx === idx)
                                        .map(([id]) => id);
                                    const isTargeted = activePointers.length > 0;

                                    return (
                                        <tr key={idx} className={cn(
                                            "transition-colors",
                                            isTargeted ? "bg-accent-blue/5" : "hover:bg-white/[0.02]"
                                        )}>
                                            <td className="px-4 py-3 text-[10px] font-mono text-white/20">{idx}</td>
                                            <td className={cn(
                                                "px-4 py-3 text-xs font-mono font-bold text-center",
                                                isTargeted ? "text-accent-blue" : "text-white/60"
                                            )}>
                                                {renderValue(val)}
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <div className="flex justify-end gap-1">
                                                    {activePointers.map(p => (
                                                        <span key={p} className={cn(
                                                            "px-1.5 py-0.5 rounded text-[8px] font-black uppercase",
                                                            (p === 'j' || p === 'r' || p === 'right') ? "bg-purple-500/20 text-purple-400" : "bg-accent-blue/20 text-accent-blue"
                                                        )}>
                                                            {p}
                                                        </span>
                                                    ))}
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* 4. Complex Data Structures (Maps, Stacks) */}
                {(Object.keys(mapState).length > 0) && (
                    <section className="space-y-4">
                        <div className="flex items-center gap-2">
                            <Database size={12} className="text-accent-blue" />
                            <h4 className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em]">Map Registry</h4>
                        </div>
                        <div className="space-y-2">
                            {Object.entries(mapState).map(([key, value]) => (
                                <div key={key} className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5 group hover:border-accent-blue/30 transition-all">
                                    <div className="flex flex-col">
                                        <span className="text-[8px] text-white/20 uppercase font-black mb-1">Key</span>
                                        <span className="text-sm font-mono font-black text-accent-blue">{renderValue(key)}</span>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className="text-[8px] text-white/20 uppercase font-black mb-1">Value</span>
                                        <span className="text-sm font-mono font-bold text-white/80">{renderValue(value)}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </div>

            {/* Sub-footer Information */}
            <div className="px-6 py-4 bg-white/[0.02] border-t border-white/5 flex items-center justify-between">
                <span className="text-[8px] font-black text-white/10 uppercase tracking-[0.2em]">Pillar: Dynamic Analysis</span>
                <span className="text-[8px] font-mono text-white/20">S:{(steps?.length || 0)} L:{(currentStepIndex + 1)}</span>
            </div>
        </div>
    )
}

export default InspectorPanel
