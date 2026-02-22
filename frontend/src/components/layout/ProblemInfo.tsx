import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../../store/useStore'
import {
    Zap,
    Target,
    Sliders,
    Clock,
    Layout,
    Code2,
    Eye,
    RefreshCw
} from 'lucide-react'
import { cn } from '../../utils/cn'

const ProblemInfo: React.FC = () => {
    const currentProblem = useStore(state => state.currentProblem)
    const isBruteForce = useStore(state => state.isBruteForce)
    const compareMode = useStore(state => state.compareMode)
    const setSimulationMode = useStore(state => state.setSimulationMode)
    const customInput = useStore(state => state.customInput)
    const customTarget = useStore(state => state.customTarget)
    const setCustomInput = useStore(state => state.setCustomInput)
    const setCustomTarget = useStore(state => state.setCustomTarget)
    const refreshSteps = useStore(state => state.refreshSteps)

    if (!currentProblem) return null

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            refreshSteps()
        }
    }

    const brutePseudocode = currentProblem.pseudocode?.brute || currentProblem.thinking_guide?.naive_approach?.join('\n') || ""
    const optimalPseudocode = currentProblem.pseudocode?.optimal || currentProblem.thinking_guide?.approach_blueprint?.join('\n') || ""

    return (
        <div className="flex flex-col gap-10 pb-20">
            {/* 1️⃣ Expanded Problem Statement */}
            <section className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-black">Problem Context</h3>
                    <span className={`badge-premium font-bold tracking-[0.2em] py-1 px-3 text-[8px]
                        ${currentProblem.difficulty === 'Easy' ? 'text-green-400 border-green-500/20 bg-green-500/10' :
                            currentProblem.difficulty === 'Medium' ? 'text-orange-400 border-orange-500/20 bg-orange-500/10' :
                                'text-red-400 border-red-500/20 bg-red-500/10'}
                    `}>
                        {currentProblem.difficulty}
                    </span>
                </div>
                <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 relative overflow-hidden group hover:border-white/20 transition-all font-sans">
                    <div className="absolute top-0 left-0 w-1 h-full bg-accent-blue/40 transition-opacity" />
                    <p className="text-[13px] text-white/90 leading-relaxed font-medium mb-4 whitespace-pre-wrap">
                        {currentProblem.problem_statement}
                    </p>
                </div>
            </section>

            {/* 2️⃣ Structured Examples */}
            <section className="space-y-4">
                <div className="flex items-center gap-2">
                    <Eye size={14} className="text-accent-blue" />
                    <h3 className="text-[10px] uppercase tracking-[0.2em] text-white/50 font-black">Examples & Use Cases</h3>
                </div>
                <div className="space-y-4">
                    {currentProblem.examples?.map((ex, idx) => (
                        <div key={idx} className="p-5 rounded-xl bg-white/[0.02] border border-white/5 space-y-3 hover:bg-white/[0.04] transition-all">
                            <div className="flex items-center gap-2">
                                <span className="text-[9px] font-black text-accent-blue uppercase tracking-widest">Example {idx + 1}</span>
                            </div>
                            <div className="space-y-2">
                                <div className="flex gap-2 text-xs">
                                    <span className="text-white/20 font-mono">Input:</span>
                                    <span className="text-white/60 font-mono">{ex.input}</span>
                                </div>
                                <div className="flex gap-2 text-xs">
                                    <span className="text-white/20 font-mono">Output:</span>
                                    <span className="text-accent-blue font-mono font-bold">{ex.output}</span>
                                </div>
                                <p className="text-[11px] text-white/40 italic leading-relaxed pt-1">
                                    "{ex.explanation}"
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* 3️⃣ Strategy Selector Focus */}
            <section className="space-y-4 pt-10 border-t border-white/10">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Target size={14} className="text-accent-blue" />
                        <h3 className="text-[10px] uppercase tracking-[0.2em] text-white/50 font-black">Strategy Selection</h3>
                    </div>
                </div>
                <div className="flex items-center gap-2 bg-black/40 p-1.5 rounded-2xl border border-white/10 w-full">
                    <button
                        onClick={() => setSimulationMode('brute')}
                        className={cn(
                            "flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                            isBruteForce && !compareMode ? "bg-red-500 text-white shadow-glow" : "text-white/30 hover:text-white/60"
                        )}
                    >
                        Brute Force
                    </button>
                    <button
                        onClick={() => setSimulationMode('optimal')}
                        className={cn(
                            "flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                            !isBruteForce && !compareMode ? "bg-accent-blue text-black shadow-glow" : "text-white/30 hover:text-white/60"
                        )}
                    >
                        Optimal
                    </button>
                    <button
                        onClick={() => setSimulationMode('compare')}
                        className={cn(
                            "flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                            compareMode ? "bg-purple-500 text-white shadow-glow" : "text-white/30 hover:text-white/60"
                        )}
                    >
                        Compare
                    </button>
                </div>

                {/* Dynamic Detailed Explanation */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={compareMode ? 'compare' : isBruteForce ? 'brute' : 'optimal'}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className={cn(
                            "p-5 rounded-2xl border transition-all duration-500",
                            compareMode ? "bg-purple-500/5 border-purple-500/20" :
                                isBruteForce ? "bg-red-500/5 border-red-500/20" : "bg-accent-blue/5 border-accent-blue/20"
                        )}
                    >
                        <div className="flex items-center gap-2 mb-3">
                            <Zap size={12} className={compareMode ? "text-purple-400" : isBruteForce ? "text-red-400" : "text-accent-blue"} />
                            <span className={cn(
                                "text-[10px] uppercase font-black tracking-widest",
                                compareMode ? "text-purple-400" : isBruteForce ? "text-red-400" : "text-accent-blue"
                            )}>
                                {compareMode ? "Efficiency Gain Engine" : isBruteForce ? "Naive Analysis" : "Optimal Strategy"}
                            </span>
                        </div>
                        <p className="text-[12px] text-white/70 leading-relaxed font-medium">
                            {compareMode
                                ? (currentProblem.efficiencyGain || "")
                                : isBruteForce
                                    ? (currentProblem.brute_force_explanation || "")
                                    : (currentProblem.optimal_explanation || "")
                            }
                        </p>
                    </motion.div>
                </AnimatePresence>
            </section>

            {/* 4️⃣ Algorithm Visualization (Pseudocode) */}
            <section className="space-y-4 pt-10 border-t border-white/10">
                <div className="flex items-center gap-2">
                    <Code2 size={14} className="text-accent-blue" />
                    <h3 className="text-[10px] uppercase tracking-[0.2em] text-white/50 font-black">Abstract Logic</h3>
                </div>
                <div className="space-y-4">
                    {(isBruteForce || compareMode) && brutePseudocode && (
                        <div className="space-y-2">
                            <span className="text-[8px] font-black text-red-400/60 uppercase tracking-widest pl-1">Brute-Force Ops</span>
                            <pre className="p-4 rounded-xl bg-black/60 border border-white/10 font-mono text-[10px] leading-relaxed text-white/60 overflow-x-auto">
                                {brutePseudocode}
                            </pre>
                        </div>
                    )}
                    {(!isBruteForce || compareMode) && optimalPseudocode && (
                        <div className="space-y-2">
                            <span className="text-[8px] font-black text-accent-blue/60 uppercase tracking-widest pl-1">Optimal-Strategy Ops</span>
                            <pre className="p-4 rounded-xl bg-black/60 border border-white/10 font-mono text-[10px] leading-relaxed text-white/60 overflow-x-auto">
                                {optimalPseudocode}
                            </pre>
                        </div>
                    )}
                </div>
            </section>

            {/* 5️⃣ Lab Settings */}
            <section className="space-y-4 pt-10 border-t border-white/10">
                <div className="flex items-center gap-2">
                    <Sliders size={14} className="text-accent-blue" />
                    <h3 className="text-[10px] uppercase tracking-[0.2em] text-white/50 font-black">Simulation Tuning</h3>
                </div>
                <div className="grid grid-cols-1 gap-5">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] pl-1">
                            {currentProblem.input_settings?.input1.label || "Custom Workspace"}
                        </label>
                        <input
                            type="text"
                            value={customInput}
                            onChange={(e) => setCustomInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="w-full bg-black/60 border border-white/10 rounded-xl px-5 py-4 text-xs font-mono text-white/90 focus:border-accent-blue/40 outline-none transition-all"
                            placeholder={currentProblem.input_settings?.input1.placeholder || ""}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] pl-1">
                            {currentProblem.input_settings?.input2.label || "Target Constraint"}
                        </label>
                        <input
                            type="text"
                            value={customTarget}
                            onChange={(e) => setCustomTarget(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="w-full bg-black/60 border border-white/10 rounded-xl px-5 py-4 text-xs font-mono text-white/90 focus:border-accent-blue/40 outline-none transition-all"
                            placeholder={currentProblem.input_settings?.input2.placeholder || ""}
                        />
                    </div>
                    <button
                        onClick={refreshSteps}
                        className="w-full py-4 bg-accent-blue text-black rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-glow hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                    >
                        <RefreshCw size={14} />
                        Sync Lab Parameters
                    </button>
                </div>
            </section>

            {/* MOVED: Constraints after Tuning */}
            {currentProblem.constraints && (
                <section className="space-y-4 pt-4">
                    <div className="flex flex-wrap gap-2">
                        {currentProblem.constraints.map((c, i) => (
                            <span key={i} className="text-[9px] text-white/40 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5 font-medium tracking-tight">
                                {c}
                            </span>
                        ))}
                    </div>
                </section>
            )}

            {/* 6️⃣ Performance & Efficiency Refined */}
            <section className="pt-10 border-t border-white/10">
                <div className="flex items-center gap-2 mb-6">
                    <Layout size={14} className="text-accent-blue" />
                    <h3 className="text-[10px] uppercase tracking-[0.2em] text-white/50 font-black">Comparative Metrics</h3>
                </div>

                <div className="space-y-6">
                    <div className="rounded-2xl bg-white/[0.02] border border-white/10 overflow-hidden shadow-2xl">
                        <div className="grid grid-cols-3 gap-2 px-5 py-4 bg-white/[0.05] text-[9px] font-black text-white/40 uppercase tracking-[0.2em] border-b border-white/10">
                            <span>Complexity</span>
                            <span className="text-red-400/60">Brute Force</span>
                            <span className="text-accent-blue/60">Optimal</span>
                        </div>
                        <div className="p-6 space-y-5">
                            <div className="grid grid-cols-3 gap-2 text-[12px] items-center">
                                <div className="flex items-center gap-2 text-white/60">
                                    <Clock size={12} className="text-white/20" />
                                    <span className="font-bold">Time</span>
                                </div>
                                <span className="text-red-400 font-mono font-black">{currentProblem.complexity?.brute?.time || ''}</span>
                                <span className="text-accent-blue font-mono font-black">{currentProblem.complexity?.optimal?.time || ''}</span>
                            </div>
                            <div className="grid grid-cols-3 gap-2 text-[12px] items-center">
                                <div className="flex items-center gap-2 text-white/60">
                                    <Layout size={12} className="text-white/20" />
                                    <span className="font-bold">Space</span>
                                </div>
                                <span className="text-white/60 font-mono">{currentProblem.complexity?.brute?.space || ''}</span>
                                <span className="text-accent-blue font-mono font-black">{currentProblem.complexity?.optimal?.space || ''}</span>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 rounded-2xl bg-gradient-to-br from-accent-blue/10 to-transparent border border-accent-blue/20 shadow-glow-sm">
                        <div className="flex items-center gap-2 mb-3">
                            <Zap size={14} className="text-accent-blue" />
                            <h4 className="text-[10px] font-black text-accent-blue uppercase tracking-[0.2em]">Platform Insight</h4>
                        </div>
                        <p className="text-[12px] text-white/80 leading-relaxed font-medium">
                            {currentProblem.efficiencyGain || ""}
                        </p>
                    </div>
                </div>
            </section>

            {/* 7️⃣ Real-World Architecture Context */}
            {currentProblem.real_time_applications && (
                <section className="pt-10 border-t border-white/10">
                    <div className="flex items-center gap-2 mb-6">
                        <Zap size={14} className="text-accent-blue" />
                        <h3 className="text-[10px] uppercase tracking-[0.2em] text-white/50 font-black">Industrial Context</h3>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                        {currentProblem.real_time_applications.map((app, i) => (
                            <div key={i} className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all">
                                <h4 className="text-xs font-bold text-white mb-2">{app.title}</h4>
                                <p className="text-[11px] text-white/40 leading-relaxed font-medium">
                                    {app.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* 8️⃣ Educational Resources */}
            <section className="pt-10 border-t border-white/10 space-y-4">
                <div className="flex items-center gap-2 mb-2">
                    <Target size={14} className="text-accent-blue" />
                    <h3 className="text-[10px] uppercase tracking-[0.2em] text-white/50 font-black">Pattern Mastery</h3>
                </div>
                <div className="grid grid-cols-1 gap-3">
                    {/* Pattern Library Bridge */}
                    {currentProblem.primaryPattern && (
                        <button
                            onClick={() => {
                                const patternIdMap: Record<string, string> = {
                                    "Two Pointers": "two_pointers",
                                    "Linked List": "linked_lists",
                                    "Sliding Window": "sliding_window",
                                    "Binary Search": "binary_search",
                                    "Expand Around Center": "two_pointers",
                                    "Cyclic Traversal": "matrices",
                                    "Digit Manipulation": "arrays",
                                    "Backtracking": "backtracking",
                                    "Stack": "stacks",
                                    "Hash Table": "hash_maps",
                                    "Recursion": "recursion",
                                    "Top-Down Memoization": "dp_strings",
                                    "Array": "arrays",
                                    "Greedy": "greedy",
                                    "Merge Intervals": "merge_intervals",
                                    "Dynamic Programming": "dp_1d",
                                    "Two Pointer": "two_pointers",
                                    "Matrix": "matrices",
                                    "Graph (BFS/DFS)": "bfs"
                                }
                                const pName = currentProblem.primaryPattern;
                                if (!pName) return;

                                const pId = patternIdMap[pName] || pName.toLowerCase().replace(/\s+/g, '_')
                                // Determine family based on ID or data
                                const corePatterns = ['two_pointers', 'sliding_window', 'binary_search', 'monotonic_stack', 'fast_slow_pointers', 'cyclic_sort', 'merge_intervals', 'greedy', 'recursion', 'backtracking', 'bfs', 'dfs', 'topological_sort', 'union_find']
                                const advancedPatterns = ['dp_1d', 'dp_2d', 'dp_strings', 'trie', 'segment_tree', 'graph_advanced', 'string_matching']
                                const dataStructures = ['arrays', 'strings', 'linked_lists', 'stacks', 'queues', 'hash_maps', 'matrices', 'heaps', 'bit_manipulation']

                                let route = `/foundations/basics/${pId}`
                                if (corePatterns.includes(pId)) route = `/foundations/core_patterns/${pId}/mental`
                                if (advancedPatterns.includes(pId)) route = `/foundations/advanced_patterns/${pId}`
                                if (dataStructures.includes(pId)) route = `/foundations/data_structures/${pId}`

                                window.location.href = route
                            }}
                            className="flex items-center justify-between p-4 rounded-xl bg-accent-blue/5 border border-accent-blue/20 hover:bg-accent-blue/10 hover:border-accent-blue/40 transition-all group text-left"
                        >
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black text-accent-blue uppercase">Discover Pattern</span>
                                <span className="text-[11px] text-white/80 font-bold uppercase tracking-tight">
                                    The {currentProblem.primaryPattern} Blueprint
                                </span>
                            </div>
                            <Layout size={14} className="text-accent-blue group-hover:scale-110 transition-transform" />
                        </button>
                    )}

                    {currentProblem.external_links?.leetcode && (
                        <a href={currentProblem.external_links.leetcode} target="_blank" className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-accent-blue/30 transition-all group">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black text-white/80 uppercase">Practice Arena</span>
                                <span className="text-[8px] text-white/30 uppercase tracking-tighter">Official LeetCode Problem #{currentProblem.id}</span>
                            </div>
                            <Layout size={12} className="text-white/20 group-hover:text-accent-blue transition-colors" />
                        </a>
                    )}
                    <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                        <span className="text-[10px] font-black text-white/80 uppercase mb-1 block">Concept Tags</span>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {currentProblem.tags?.map(tag => (
                                <span key={tag} className="text-[8px] font-bold text-accent-blue/60 bg-accent-blue/5 px-2 py-0.5 rounded border border-accent-blue/10 uppercase">{tag}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default ProblemInfo
