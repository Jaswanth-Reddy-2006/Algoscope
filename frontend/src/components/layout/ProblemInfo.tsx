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
import ProblemTreePreview from '../foundations/engines/Recursion/AdvancedBST/ProblemTreePreview'

// LeetCode style array to Tree parser
const parseLeetCodeTree = (input: string): any | null => {
    try {
        const arr = JSON.parse(input.replace(/none/gi, 'null'));
        if (!Array.isArray(arr) || arr.length === 0 || arr[0] === null) return null;

        const root: any = { val: arr[0] };
        const queue: (any | null)[] = [root];
        let i = 1;

        while (i < arr.length && queue.length > 0) {
            const curr = queue.shift();
            if (!curr) continue;

            // Left child
            if (i < arr.length) {
                if (arr[i] !== null) {
                    curr.left = { val: arr[i] };
                    queue.push(curr.left);
                } else {
                    queue.push(null);
                }
                i++;
            }

            // Right child
            if (i < arr.length) {
                if (arr[i] !== null) {
                    curr.right = { val: arr[i] };
                    queue.push(curr.right);
                } else {
                    queue.push(null);
                }
                i++;
            }
        }
        return root;
    } catch (e) {
        return null;
    }
};

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
    const activePseudoLine = useStore(state => state.activePseudoLine)
    const observationText = useStore(state => state.observationText)

    const treeData = React.useMemo(() =>
        currentProblem?.algorithmType === 'tree' ? parseLeetCodeTree(customInput) : null
        , [customInput, currentProblem?.algorithmType]);

    if (!currentProblem) return null

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            refreshSteps()
        }
    }

    // Simple active node extraction for preview
    const activeNodeVal = null; // Could be synced if needed

    const getTreePseudocode = (mode: string) => {
        const visitLabel = mode === 'inorder' ? 'Visit Root' : mode === 'preorder' ? 'Visit Root (High-Level)' : 'Visit Root (Post-Process)';
        return `void ${mode}(Node root) {
  // 1. Base Case
  if (root == null) return;

  ${mode === 'preorder' ? 'visit(root.val); // ' + visitLabel : mode === 'inorder' ? mode + '(root.left);' : mode + '(root.left);'}
  ${mode === 'preorder' ? mode + '(root.left);' : mode === 'inorder' ? 'visit(root.val); // ' + visitLabel : mode + '(root.right);'}
  ${mode === 'preorder' ? mode + '(root.right);' : mode === 'inorder' ? mode + '(root.right);' : 'visit(root.val); // ' + visitLabel}
}`;
    };

    const brutePseudocode = currentProblem.algorithmType === 'tree' ?
        `// Iterative Tree Traversal using Stack
void iterative(Node root) {
  Stack stack = new Stack();
  Node curr = root;
  while (curr != null || !stack.isEmpty()) {
    while (curr != null) {
      stack.push(curr);
      curr = curr.left;
    }
    curr = stack.pop();
    visit(curr.val);
    curr = curr.right;
  }
}` : (currentProblem.pseudocode?.brute ||
            currentProblem.thinking_guide?.naive_approach?.join('\n') ||
            (currentProblem.brute_force_steps as any[])?.map(s => s.description).join('\n') ||
            "")
    const optimalPseudocode = currentProblem.algorithmType === 'tree' ?
        getTreePseudocode(currentProblem.slug?.includes('preorder') ? 'preorder' : currentProblem.slug?.includes('postorder') ? 'postorder' : 'inorder') :
        (currentProblem.pseudocode?.optimal ||
            currentProblem.thinking_guide?.approach_blueprint?.join('\n') ||
            (currentProblem.optimal_steps as any[])?.map(s => s.description).join('\n') ||
            "")

    return (
        <div className="flex flex-col gap-8 pb-32 px-1">
            {/* 1️⃣ Problem & Data context */}
            <section className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Target size={14} className="text-accent-blue" />
                        <h3 className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-black">Problem Context</h3>
                    </div>
                    <span className={`badge-premium font-bold tracking-[0.2em] py-1 px-3 text-[8px]
                        ${currentProblem.difficulty === 'Easy' ? 'text-[#EE544A] border-[#EE544A]/20 bg-[#EE544A]/10' :
                            currentProblem.difficulty === 'Medium' ? 'text-[#EC4186] border-[#EC4186]/20 bg-[#EC4186]/10' :
                                'text-[#FF6B6B] border-[#FF6B6B]/20 bg-[#FF6B6B]/10'}
                    `}>
                        {currentProblem.difficulty}
                    </span>
                </div>

                <div className="p-6 rounded-[24px] bg-white/[0.03] border border-white/10 relative overflow-hidden group hover:border-white/20 transition-all">
                    <p className="text-[13px] text-white/90 font-medium leading-[1.6] mb-2 whitespace-pre-wrap">
                        {currentProblem.problem_statement}
                    </p>
                </div>

                {/* Lab Configuration (Data Structure Input) */}
                <div className="p-6 rounded-[24px] bg-white/[0.02] border border-white/5 space-y-5">
                    <div className="flex items-center gap-2">
                        <Sliders size={12} className="text-[#EC4186]" />
                        <span className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em]">Lab Parameters</span>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em] pl-1">
                                {currentProblem.algorithmType === 'tree' ? "Binary Tree Array" : (currentProblem.input_settings?.input1.label || "Dataset")}
                            </label>
                            <input
                                type="text"
                                value={customInput}
                                onChange={(e) => setCustomInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-xs font-mono text-white focus:border-[#EC4186]/40 outline-none transition-all placeholder:text-white/10"
                                placeholder={currentProblem.input_settings?.input1.placeholder || "[1,2,3,null,4,5]"}
                            />
                        </div>

                        {currentProblem.algorithmType === 'tree' && treeData && (
                            <div className="pt-2">
                                <ProblemTreePreview treeData={treeData} activeNodeVal={activeNodeVal} />
                            </div>
                        )}

                        {currentProblem.algorithmType !== 'tree' && (
                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em] pl-1">
                                    {currentProblem.input_settings?.input2.label || "Constraint Variable"}
                                </label>
                                <input
                                    type="text"
                                    value={customTarget}
                                    onChange={(e) => setCustomTarget(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-xs font-mono text-white focus:border-[#EC4186]/40 outline-none transition-all"
                                    placeholder={currentProblem.input_settings?.input2.placeholder || ""}
                                />
                            </div>
                        )}

                        <button
                            onClick={refreshSteps}
                            className="w-full py-4 bg-[#EC4186] text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-[0_5px_15px_rgba(236,65,134,0.3)] hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                        >
                            <RefreshCw size={14} />
                            Sync Simulation
                        </button>
                    </div>
                </div>
            </section>

            {/* 2️⃣ Strategy Selector */}
            <section className="space-y-4 pt-4 border-t border-white/10">
                <div className="flex items-center gap-2">
                    <Layout size={14} className="text-accent-blue" />
                    <h3 className="text-[10px] uppercase tracking-[0.2em] text-white/50 font-black">Strategical Section</h3>
                </div>

                <div className="flex items-center gap-2 bg-black/40 p-1.5 rounded-[20px] border border-white/10 w-full font-sans">
                    <button
                        onClick={() => setSimulationMode('brute')}
                        className={cn(
                            "flex-1 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all",
                            isBruteForce && !compareMode ? "bg-[#EE544A] text-white shadow-[0_0_15px_rgba(238,84,74,0.4)]" : "text-white/30 hover:text-white/60"
                        )}
                    >
                        Brute Force
                    </button>
                    <button
                        onClick={() => setSimulationMode('optimal')}
                        className={cn(
                            "flex-1 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all",
                            !isBruteForce && !compareMode ? "bg-[#EC4186] text-white shadow-[0_0_15px_rgba(236,65,134,0.4)]" : "text-white/30 hover:text-white/60"
                        )}
                    >
                        Optimal
                    </button>
                    <button
                        onClick={() => setSimulationMode('compare')}
                        className={cn(
                            "flex-1 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all",
                            compareMode ? "bg-white text-black font-black" : "text-white/30 hover:text-white/60"
                        )}
                    >
                        Compare
                    </button>
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={compareMode ? 'compare' : isBruteForce ? 'brute' : 'optimal'}
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        className={cn(
                            "p-6 rounded-[28px] border transition-all duration-500",
                            compareMode ? "bg-purple-500/5 border-purple-500/20" :
                                isBruteForce ? "bg-red-500/5 border-red-500/20" : "bg-[#EC4186]/5 border-[#EC4186]/20"
                        )}
                    >
                        <div className="flex items-center gap-2 mb-4">
                            <Zap size={14} className={compareMode ? "text-white" : isBruteForce ? "text-[#EE544A]" : "text-[#EC4186]"} />
                            <span className={cn(
                                "text-[11px] uppercase font-black tracking-[0.2em]",
                                compareMode ? "text-white" : isBruteForce ? "text-[#EE544A]" : "text-[#EC4186]"
                            )}>
                                {compareMode ? "Performance Delta" : isBruteForce ? "Naive Mechanism" : "Optimal Strategy"}
                            </span>
                        </div>
                        <p className="text-[12px] text-white/60 leading-relaxed font-bold uppercase tracking-wider">
                            {compareMode
                                ? "Analyzing efficiency gains. Adaptive strategies typically reduce redundant work by leveraging problem-specific properties."
                                : isBruteForce
                                    ? (currentProblem.brute_force_explanation || "Focuses on explicit state management, often sacrificing performance for algorithmic simplicity.")
                                    : (currentProblem.optimal_explanation || "Leverages recursive structures or dynamic data patterns to minimize computational overhead.")
                            }
                        </p>
                    </motion.div>
                </AnimatePresence>
            </section>

            {/* 3️⃣ Abstract Logic (Pseudocode) */}
            <section className="space-y-4 pt-4 border-t border-white/10">
                <div className="flex items-center gap-2">
                    <Code2 size={14} className="text-accent-blue" />
                    <h3 className="text-[10px] uppercase tracking-[0.2em] text-white/50 font-black">Abstract Logic</h3>
                </div>

                <AnimatePresence>
                    {observationText && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="p-4 rounded-2xl bg-[#EC4186]/10 border border-[#EC4186]/20 mb-4 shadow-lg"
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <RefreshCw size={10} className="text-[#EC4186] animate-spin" />
                                <span className="text-[8px] font-black text-[#EC4186] uppercase tracking-[0.2em]">Live Sync</span>
                            </div>
                            <p className="text-[11px] text-white font-bold italic">
                                "{observationText}"
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="space-y-2">
                    <AnimatePresence mode="wait">
                        {isBruteForce && brutePseudocode && (
                            <motion.div
                                key="brute"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="rounded-2xl bg-black/60 border border-white/10 overflow-hidden shadow-2xl"
                            >
                                {brutePseudocode.split('\n').filter(l => l.trim()).map((line, idx) => {
                                    const lineNum = idx + 1;
                                    const isActive = activePseudoLine === lineNum && isBruteForce;
                                    return (
                                        <div
                                            key={idx}
                                            className={cn(
                                                "px-6 py-3 flex gap-4 font-mono text-[10px] transition-all border-l-4",
                                                isActive ? "bg-[#EE544A]/30 text-white border-[#EE544A]" : "text-white/30 border-transparent hover:text-white/50 hover:bg-white/[0.02]"
                                            )}
                                        >
                                            <span className="w-4 opacity-20 text-right">{lineNum}</span>
                                            <span className="whitespace-pre-wrap">{line}</span>
                                        </div>
                                    );
                                })}
                            </motion.div>
                        )}
                        {!isBruteForce && optimalPseudocode && (
                            <motion.div
                                key="optimal"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="rounded-2xl bg-black/60 border border-white/10 overflow-hidden shadow-2xl"
                            >
                                {optimalPseudocode.split('\n').filter(l => l.trim()).map((line, idx) => {
                                    const lineNum = idx + 1;
                                    const isActive = activePseudoLine === lineNum && !isBruteForce;
                                    return (
                                        <div
                                            key={idx}
                                            className={cn(
                                                "px-6 py-3 flex gap-4 font-mono text-[10px] transition-all border-l-4",
                                                isActive ? "bg-[#EC4186]/30 text-white border-[#EC4186]" : "text-white/30 border-transparent hover:text-white/50 hover:bg-white/[0.02]"
                                            )}
                                        >
                                            <span className="w-4 opacity-20 text-right">{lineNum}</span>
                                            <span className="whitespace-pre-wrap">{line}</span>
                                        </div>
                                    );
                                })}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </section>

            {/* 4️⃣ Examples */}
            <section className="space-y-4 pt-4 border-t border-white/10">
                <div className="flex items-center gap-2">
                    <Eye size={14} className="text-accent-blue" />
                    <h3 className="text-[10px] uppercase tracking-[0.2em] text-white/50 font-black">Examples</h3>
                </div>
                <div className="space-y-4">
                    {currentProblem.examples?.map((ex, idx) => (
                        <div key={idx} className="p-5 rounded-[24px] bg-white/[0.02] border border-white/5 space-y-3 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-accent-blue/5 rounded-full blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="flex items-center gap-2">
                                <span className="text-[9px] font-black text-[#EC4186] mb-1">EXAMPLE_ID #{idx + 1}</span>
                            </div>
                            <div className="space-y-2 relative">
                                <div className="flex gap-2 text-xs">
                                    <span className="text-white/20 font-mono">INPUT:</span>
                                    <span className="text-white/60 font-mono italic">{ex.input}</span>
                                </div>
                                <div className="flex gap-2 text-xs">
                                    <span className="text-white/20 font-mono">OUTPUT:</span>
                                    <span className="text-[#EC4186] font-mono font-bold tracking-widest">{ex.output}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* 5️⃣ Comparative Metrics */}
            <section className="space-y-6 pt-4 border-t border-white/10">
                <div className="flex items-center gap-2">
                    <Clock size={14} className="text-accent-blue" />
                    <h3 className="text-[10px] uppercase tracking-[0.2em] text-white/50 font-black">Comparative Analysis</h3>
                </div>

                <div className="rounded-[28px] bg-[#0A0A0A] border border-white/10 overflow-hidden shadow-2xl">
                    <div className="grid grid-cols-3 bg-white/[0.04] text-[10px] font-black text-white/40 uppercase tracking-[0.2em] border-b border-white/10 border-t-0 border-l-0 border-r-0">
                        <div className="px-6 py-5 border-r border-white/10">Logic</div>
                        <div className="px-6 py-5 border-r border-white/10 text-center text-[#EE544A]/60">Naive</div>
                        <div className="px-6 py-5 text-center text-[#EC4186]/60">Optimal</div>
                    </div>
                    <div className="divide-y divide-white/[0.05]">
                        <div className="grid grid-cols-3 items-center">
                            <div className="px-6 py-5 border-r border-white/10 bg-white/[0.01]">
                                <span className="text-[9px] font-black uppercase text-white/40 tracking-widest">Time</span>
                            </div>
                            <div className="px-6 py-5 border-r border-white/10 text-center">
                                <span className="text-[#EE544A] font-mono text-xs font-black">{currentProblem.efficiency?.brute?.time || currentProblem.time_efficiency || 'O(N)'}</span>
                            </div>
                            <div className="px-6 py-5 text-center">
                                <span className="text-[#EC4186] font-mono text-xs font-black">{currentProblem.efficiency?.optimal?.time || currentProblem.time_efficiency || 'O(N)'}</span>
                            </div>
                        </div>
                        <div className="grid grid-cols-3 items-center">
                            <div className="px-6 py-5 border-r border-white/10 bg-white/[0.01]">
                                <span className="text-[9px] font-black uppercase text-white/40 tracking-widest">Space</span>
                            </div>
                            <div className="px-6 py-5 border-r border-white/10 text-center">
                                <span className="text-white/40 font-mono text-[10px] uppercase">{currentProblem.efficiency?.brute?.space || currentProblem.space_efficiency || 'O(N)'}</span>
                            </div>
                            <div className="px-6 py-5 text-center">
                                <span className="text-accent-blue font-mono text-xs font-black">{currentProblem.efficiency?.optimal?.space || currentProblem.space_efficiency || 'O(H)'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 7️⃣ Resources */}
            {currentProblem.external_links && (
                <section className="space-y-4 pt-4 border-t border-white/10">
                    <div className="flex items-center gap-2">
                        <Code2 size={14} className="text-accent-blue" />
                        <h3 className="text-[10px] uppercase tracking-[0.2em] text-white/50 font-black">Resources</h3>
                    </div>
                    <div className="grid grid-cols-1 gap-3">
                        {Object.entries(currentProblem.external_links).map(([key, url]) => (
                            <a
                                key={key}
                                href={url as string}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.08] hover:border-[#EC4186]/40 transition-all flex items-center justify-between group"
                            >
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black text-white/90 uppercase tracking-widest">{key}</span>
                                    <span className="text-[9px] text-white/30 truncate max-w-[200px]">{url as string}</span>
                                </div>
                                <Zap size={14} className="text-white/20 group-hover:text-[#EC4186] transition-colors" />
                            </a>
                        ))}
                    </div>
                </section>
            )}

            {/* industrial context (Optional/Extra) */}
            {currentProblem.real_time_applications && (
                <section className="space-y-4 pt-4 border-t border-white/10">
                    <div className="flex items-center gap-2">
                        <Zap size={14} className="text-accent-blue" />
                        <h3 className="text-[10px] uppercase tracking-[0.2em] text-white/50 font-black">Industrial Context</h3>
                    </div>
                    <div className="grid grid-cols-1 gap-3">
                        {currentProblem.real_time_applications.map((app, i) => (
                            <div key={i} className="p-5 rounded-[24px] bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all">
                                <h4 className="text-[11px] font-bold text-white mb-2 uppercase tracking-tight">{app.title}</h4>
                                <p className="text-[11px] text-white/40 font-serif leading-relaxed italic">
                                    {app.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </div>
    )
}

export default ProblemInfo
