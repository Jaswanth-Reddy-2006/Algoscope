import { useState } from 'react'
import { Copy, Check, Terminal, Code2, Cpu, Globe, Zap } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { FoundationModule } from '../../types/foundation'

type Language = 'python' | 'java' | 'cpp' | 'javascript'

interface Props {
    moduleId?: string
    module: FoundationModule
    activeSubPatternId: string | null
    setActiveSubPatternId: (id: string | null) => void
}

const LANGUAGES: { id: Language; label: string; icon: any; color: string }[] = [
    { id: 'python', label: 'Python', icon: Terminal, color: 'text-blue-400' },
    { id: 'javascript', label: 'JavaScript', icon: Globe, color: 'text-yellow-400' },
    { id: 'java', label: 'Java', icon: Code2, color: 'text-orange-400' },
    { id: 'cpp', label: 'C++', icon: Cpu, color: 'text-cyan-400' }
]

export const EnhancedCodeTemplateTab: React.FC<Props> = ({ module, activeSubPatternId, setActiveSubPatternId }) => {
    const activeSub = module.subPatterns.find(s => s.id === activeSubPatternId) || module.subPatterns[0]
    const [selectedLanguage, setSelectedLanguage] = useState<Language>('python')
    const [copiedId, setCopiedId] = useState<string | null>(null)

    const templates = activeSub?.templates as any
    const currentCode = templates?.[selectedLanguage] || { bruteForce: '# Template coming soon', optimal: '# Template coming soon' }

    const handleCopy = (code: string, id: string) => {
        navigator.clipboard.writeText(code)
        setCopiedId(id)
        setTimeout(() => setCopiedId(null), 2000)
    }

    return (
        <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            {/* Header & Strategy Selector */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-8 pb-8 border-b border-white/5">
                <div className="space-y-4 max-w-2xl">
                    <span className="text-[10px] font-bold text-accent-blue uppercase tracking-[0.3em]">Code Architect</span>
                    <h2 className="text-4xl font-bold text-white tracking-tight">The Blueprint of Performance</h2>
                    <p className="text-white/40 leading-relaxed text-lg">
                        Contrast the naive approach with the optimized invariant. Select a language to explore
                        production-ready templates and strategic nuances.
                    </p>
                </div>

                <div className="flex flex-wrap gap-2">
                    {module.subPatterns.map(pattern => (
                        <button
                            key={pattern.id}
                            onClick={() => setActiveSubPatternId(pattern.id)}
                            className={`
                                px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300
                                ${activeSub?.id === pattern.id
                                    ? 'bg-accent-blue/10 text-accent-blue border border-accent-blue/30 shadow-[0_0_20px_rgba(59,130,246,0.1)]'
                                    : 'bg-white/5 text-white/30 border border-white/5 hover:bg-white/10 hover:text-white/60'
                                }
                            `}
                        >
                            {pattern.title}
                        </button>
                    ))}
                </div>
            </div>

            {/* Language Toolbar */}
            <div className="flex justify-center">
                <div className="inline-flex p-1.5 rounded-2xl bg-black/40 border border-white/5 shadow-2xl">
                    {LANGUAGES.map(lang => (
                        <button
                            key={lang.id}
                            onClick={() => setSelectedLanguage(lang.id)}
                            className={`
                                flex items-center gap-2.5 px-6 py-3 rounded-xl text-sm font-bold transition-all duration-500
                                ${selectedLanguage === lang.id
                                    ? 'bg-white/10 text-white shadow-lg'
                                    : 'text-white/30 hover:text-white/60 hover:bg-white/5'
                                }
                            `}
                        >
                            <lang.icon size={16} className={selectedLanguage === lang.id ? lang.color : ''} />
                            {lang.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Code Comparison Engine */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-stretch">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={`${activeSub?.id}-${selectedLanguage}-brute`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.5 }}
                        className="flex flex-col"
                    >
                        <div className="flex items-center justify-between mb-4 px-2">
                            <div className="flex items-center gap-3">
                                <div className="p-1.5 bg-red-500/10 rounded-lg">
                                    <Terminal size={14} className="text-red-400" />
                                </div>
                                <h3 className="text-sm font-bold text-white uppercase tracking-widest">Brute Force</h3>
                            </div>
                            <button
                                onClick={() => handleCopy(currentCode.bruteForce, 'brute')}
                                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all group"
                            >
                                {copiedId === 'brute' ? (
                                    <Check size={14} className="text-emerald-400" />
                                ) : (
                                    <Copy size={14} className="text-white/40 group-hover:text-white" />
                                )}
                            </button>
                        </div>
                        <div className="flex-grow p-6 rounded-3xl bg-black/60 border border-red-500/20 font-mono text-sm group relative overflow-hidden">
                            <div className="absolute right-0 top-0 p-4 opacity-[0.02] -rotate-12">
                                <Code2 size={120} />
                            </div>
                            <pre className="text-white/70 leading-relaxed whitespace-pre overflow-x-auto selection:bg-red-500/20">
                                <code>{currentCode.bruteForce}</code>
                            </pre>
                        </div>
                    </motion.div>

                    <motion.div
                        key={`${activeSub?.id}-${selectedLanguage}-optimal`}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.5 }}
                        className="flex flex-col"
                    >
                        <div className="flex items-center justify-between mb-4 px-2">
                            <div className="flex items-center gap-3">
                                <div className="p-1.5 bg-accent-blue/10 rounded-lg">
                                    <Zap size={14} className="text-accent-blue" />
                                </div>
                                <h3 className="text-sm font-bold text-white uppercase tracking-widest">Invariant Optimization</h3>
                            </div>
                            <button
                                onClick={() => handleCopy(currentCode.optimal, 'optimal')}
                                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all group"
                            >
                                {copiedId === 'optimal' ? (
                                    <Check size={14} className="text-emerald-400" />
                                ) : (
                                    <Copy size={14} className="text-white/40 group-hover:text-white" />
                                )}
                            </button>
                        </div>
                        <div className="flex-grow p-6 rounded-3xl bg-black/60 border border-accent-blue/30 font-mono text-sm group relative overflow-hidden">
                            <div className="absolute right-0 top-0 p-4 opacity-[0.03] rotate-12">
                                <Zap size={120} className="text-accent-blue" />
                            </div>
                            <pre className="text-white font-medium leading-relaxed whitespace-pre overflow-x-auto selection:bg-accent-blue/20">
                                <code>{currentCode.optimal}</code>
                            </pre>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Strategic Differences */}
            <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-white/[0.03] to-transparent border border-white/5">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    <div className="space-y-2">
                        <span className="text-[10px] font-bold text-accent-blue uppercase tracking-widest">Context</span>
                        <h4 className="text-lg font-bold text-white">The Breakthrough</h4>
                        <p className="text-sm text-white/40 leading-relaxed">
                            While the brute force approach recomputes every state by re-scanning the structure,
                            the optimal version uses the previous state to derive the next one in O(1).
                        </p>
                    </div>
                    <div className="space-y-2">
                        <span className="text-[10px] font-bold text-accent-blue uppercase tracking-widest">Logic</span>
                        <h4 className="text-lg font-bold text-white">State Management</h4>
                        <p className="text-sm text-white/40 leading-relaxed">
                            Notice how the variables are updated within the loop. The invariant is always
                            re-established before the next iteration begins.
                        </p>
                    </div>
                    <div className="space-y-2">
                        <span className="text-[10px] font-bold text-accent-blue uppercase tracking-widest">Advice</span>
                        <h4 className="text-lg font-bold text-white">Production Tip</h4>
                        <p className="text-sm text-white/40 leading-relaxed">
                            For languages like Java or C++, be mindful of integer overflows when accumulating large sums.
                            Always check constraints before implementation.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
