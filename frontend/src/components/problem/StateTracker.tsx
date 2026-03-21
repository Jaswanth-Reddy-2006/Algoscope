import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../../store/useStore'
import { Activity, Crosshair } from 'lucide-react'
import { cn } from '../../utils/cn'

const StateTracker: React.FC = () => {
    const currentProblem = useStore(state => state.currentProblem)
    const currentStepIndex = useStore(state => state.currentStepIndex)
    const isBruteForce = useStore(state => state.isBruteForce)
    const compareMode = useStore(state => state.compareMode)
    const compareRightSteps = useStore(state => state.compareRightSteps)

    if (!currentProblem) return null

    const steps = compareMode ? compareRightSteps : (isBruteForce ? currentProblem.brute_force_steps : currentProblem.optimal_steps)
    const currentState = steps?.[currentStepIndex]?.state
    if (!currentState) return null

    const { pointers = {}, customState = {}, mapState = {}, stack = [] } = currentState
    const items = currentState.array || []

    const displayVariables: { label: string, value: any, color?: string }[] = []

    // 1. Pointers
    Object.entries(pointers).forEach(([key, val]) => {
        if (val === null) return
        displayVariables.push({ label: `POINTER_${key.toUpperCase()}`, value: val })
        if (items[val as number] !== undefined) {
            displayVariables.push({ label: `VALUE_${key.toUpperCase()}`, value: items[val as number] })
        }
    })

    // 2. Map State
    if (mapState && Object.keys(mapState).length > 0) {
        displayVariables.push({ label: 'MAP_SIZE', value: Object.keys(mapState).length, color: 'text-accent-blue' })
        if (customState.complement !== undefined) {
            displayVariables.push({ label: 'TARGET_COMP', value: customState.complement, color: 'text-[#EC4186]' })
        }
    }

    // 3. Stack State
    if (stack && stack.length > 0) {
        displayVariables.push({ label: 'STACK_DEPTH', value: stack.length, color: 'text-purple-400' })
    }

    // 4. Custom & Global Metrics
    if (customState.currentSum !== undefined) {
        displayVariables.push({ label: 'CURRENT_SUM', value: customState.currentSum, color: 'text-red-400' })
    }

    if (currentState.phase) {
        displayVariables.push({
            label: 'PHASE',
            value: currentState.phase.toUpperCase(),
            color: currentState.phase === 'found' ? 'text-green-400' : 'text-white/40'
        })
    }

    displayVariables.push({ label: 'CYCLE', value: currentStepIndex + 1 })

    return (
        <div className="h-full flex flex-col bg-[#1b062b] border-l border-white/10 overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="p-8 border-b border-white/10 shrink-0 bg-white/[0.03]">
                <div className="flex items-center gap-3">
                    <Activity size={14} className="text-accent-blue" />
                    <h3 className="text-[11px] uppercase font-black text-white/90 tracking-[0.3em]">Runtime State</h3>
                </div>
            </div>

            {/* Variable List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-10">
                <div className="space-y-6">
                    <div className="flex items-center gap-3 text-[10px] uppercase font-black text-white/50 tracking-[0.2em] pl-1">
                        <Crosshair size={12} className="text-accent-blue/60" />
                        <span>Live Execution</span>
                    </div>

                    <div className="space-y-3">
                        <AnimatePresence mode="popLayout">
                            {displayVariables.map((variable) => (
                                <motion.div
                                    key={variable.label}
                                    layout
                                    className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-white/20 transition-all group relative overflow-hidden"
                                >
                                    <motion.div
                                        key={`${variable.label}-${variable.value}`}
                                        initial={{ opacity: 0.8, backgroundColor: 'rgba(236, 65, 134, 0.2)' }}
                                        animate={{ opacity: 0, backgroundColor: 'rgba(236, 65, 134, 0)' }}
                                        transition={{ duration: 0.8 }}
                                        className="absolute inset-0 pointer-events-none"
                                    />

                                    <span className="text-[10px] text-white/40 uppercase font-black tracking-wider group-hover:text-white/80 transition-colors">
                                        {variable.label}
                                    </span>
                                    <span className={cn(
                                        "text-xs font-mono font-black px-3 py-1 rounded-lg bg-black/40 border border-white/5 shadow-inner",
                                        variable.color || "text-white/95"
                                    )}>
                                        {variable.value}
                                    </span>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>

            </div>

            {/* Footer / Step ID */}
            <div className="p-6 border-t border-white/10 bg-white/[0.02] shrink-0">
                <div className="flex items-center justify-between text-[9px] font-mono text-white/30 uppercase tracking-[0.2em] font-black">
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#EE544A] shadow-[0_0_8px_rgba(238,84,74,0.6)] animate-pulse" />
                        <span>Live Runtime</span>
                    </div>
                    <span className="text-[#EC4186]/80 font-bold">Step {currentStepIndex + 1}</span>
                </div>
            </div>
        </div>
    )
}

export default StateTracker
