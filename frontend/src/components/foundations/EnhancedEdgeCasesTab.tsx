import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle, XCircle, CheckCircle } from 'lucide-react'
import { FoundationModule, EdgeCase } from '../../types/foundation'

interface Props {
    moduleId?: string
    module: FoundationModule
    activeSubPatternId: string | null
}

const EmptyState = ({ message }: { message: string }) => (
    <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl bg-white/5 border border-white/10">
        <AlertTriangle size={48} className="text-white/20 mb-4" />
        <p className="text-white/60">{message}</p>
    </div>
)

interface EdgeCaseCardProps {
    scenario: EdgeCase
}

const EdgeCaseCard: React.FC<EdgeCaseCardProps> = ({ scenario }) => {
    const [interactiveValue, setInteractiveValue] = useState(scenario.interactive?.defaultValue ?? null)
    const [showAnimation, setShowAnimation] = useState(false)

    // Reset state when scenario changes to prevent stale values from other patterns
    useEffect(() => {
        if (scenario.interactive) {
            setInteractiveValue(scenario.interactive.defaultValue)
        }
        setShowAnimation(false)
    }, [scenario])

    const handleInteraction = (value: any) => {
        setInteractiveValue(value)
        setShowAnimation(true)
        setTimeout(() => setShowAnimation(false), 1000)
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-2xl bg-red-500/[0.02] border border-red-500/20 hover:border-red-500/40 transition-colors"
        >
            {/* Header */}
            <div className="flex items-start gap-3 mb-4">
                <AlertTriangle size={20} className="text-red-400 mt-1 flex-shrink-0" />
                <div className="flex-1">
                    <h3 className="text-lg font-bold text-white mb-2">{scenario.title}</h3>
                    <p className="text-sm text-white/60">{scenario.description}</p>
                </div>
            </div>

            {/* Interactive Control */}
            {scenario.interactive && (
                <div className="mb-6 p-4 rounded-xl bg-black/30 border border-white/10">
                    <div className="text-xs uppercase tracking-widest text-white/40 mb-3">Interactive Control</div>

                    {scenario.interactive.type === 'slider' && (
                        <div>
                            <input
                                type="range"
                                min={0}
                                max={(scenario.interactive.options?.length || 8) - 1}
                                value={scenario.interactive.options?.indexOf(interactiveValue) ?? 0}
                                onChange={(e) => {
                                    const options = scenario.interactive?.options
                                    if (options) {
                                        handleInteraction(options[parseInt(e.target.value)] || interactiveValue)
                                    }
                                }}
                                className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-red-500"
                            />
                            <div className="text-center mt-2 text-lg font-bold text-red-400">
                                Value = {interactiveValue?.toString() || 'None'}
                            </div>
                        </div>
                    )}

                    {scenario.interactive.type === 'toggle' && (
                        <button
                            onClick={() => handleInteraction(!interactiveValue)}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${interactiveValue
                                ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                                : 'bg-white/10 text-white/70 border border-white/10'
                                }`}
                        >
                            {interactiveValue ? 'Failure Mode Active' : 'Click to Activate'}
                        </button>
                    )}

                    {scenario.interactive.type === 'array' && (
                        <div className="flex gap-2 justify-center flex-wrap">
                            {(Array.isArray(interactiveValue) ? interactiveValue : []).map((val: number, idx: number) => (
                                <div
                                    key={idx}
                                    className="w-12 h-12 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center font-mono text-white"
                                >
                                    {val}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Visual Example */}
            {scenario.visualExample && showAnimation && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30"
                >
                    <div className="flex items-center gap-2 mb-3">
                        <XCircle size={16} className="text-red-400" />
                        <span className="text-sm font-bold text-red-400">Failure Visualization</span>
                    </div>
                    <div className="flex gap-2 mb-3 justify-center">
                        {scenario.visualExample.array.map((val, idx) => (
                            <div
                                key={idx}
                                className="w-10 h-10 rounded bg-red-500/20 border border-red-500/40 flex items-center justify-center text-sm font-mono text-red-300"
                            >
                                {val}
                            </div>
                        ))}
                    </div>
                    <p className="text-xs text-red-300 text-center">{scenario.visualExample.message}</p>
                </motion.div>
            )}

            {/* Why It Breaks */}
            <div className="mb-4 p-4 rounded-xl bg-red-500/5 border border-red-500/20">
                <div className="flex items-center gap-2 mb-2">
                    <XCircle size={14} className="text-red-400" />
                    <span className="text-xs font-bold uppercase tracking-widest text-red-400">Why It Breaks</span>
                </div>
                <p className="text-sm text-white/70 leading-relaxed">{scenario.whyItBreaks}</p>
            </div>

            {/* How to Fix */}
            <div className="p-4 rounded-xl bg-green-500/5 border border-green-500/20">
                <div className="flex items-center gap-2 mb-2">
                    <CheckCircle size={14} className="text-green-400" />
                    <span className="text-xs font-bold uppercase tracking-widest text-green-400">How to Fix It</span>
                </div>
                <p className="text-sm text-white/70 leading-relaxed">{scenario.howToFix}</p>
            </div>
        </motion.div>
    )
}

export const EnhancedEdgeCasesTab: React.FC<Props> = ({ module, activeSubPatternId }) => {
    const activeSub = module.subPatterns.find(s => s.id === activeSubPatternId)
    const scenarios = activeSub?.edgeCases ?? []

    if (!activeSub) {
        return <EmptyState message="Please select a sub-pattern to explore its edge cases." />
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="text-center space-y-3">
                <h2 className="text-3xl font-bold text-white">Where This Pattern Fails</h2>
                <p className="text-white/60 max-w-2xl mx-auto">
                    Interactive failure simulator for {activeSub.title}. Understand edge cases through hands-on exploration.
                </p>
            </div>

            {/* Sub-Pattern Indicators (Visual Only) */}
            <div className="flex flex-wrap gap-2 justify-center">
                {module.subPatterns.map(pattern => (
                    <div
                        key={pattern.id}
                        className={`
                            px-4 py-2 rounded-lg text-sm font-medium transition-all
                            ${activeSubPatternId === pattern.id
                                ? 'bg-red-500/20 text-red-400 border border-red-500/30 ring-2 ring-red-500/20'
                                : 'bg-white/5 text-white/40 border border-white/5 opacity-50'
                            }
                        `}
                    >
                        {pattern.title}
                    </div>
                ))}
            </div>

            {/* Edge Case Cards */}
            {scenarios.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-7xl mx-auto">
                    {scenarios.map((scenario, idx) => (
                        <EdgeCaseCard
                            key={`${activeSubPatternId}-${idx}`}
                            scenario={scenario}
                        />
                    ))}
                </div>
            ) : (
                <EmptyState message={`No edge cases defined for ${activeSub.title} yet.`} />
            )}

            {/* Summary */}
            <div className="max-w-4xl mx-auto p-6 rounded-2xl bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/20">
                <h4 className="text-sm font-bold text-white mb-3">Key Takeaway</h4>
                <p className="text-sm text-white/70">
                    Edge cases aren't just bugs to avoid—they're opportunities to deeply understand the invariant.
                    Each failure scenario reveals a boundary condition where the pattern's assumptions break down.
                    Master these, and you'll know exactly when to use (and when NOT to use) this strategy.
                </p>
            </div>
        </div>
    )
}
