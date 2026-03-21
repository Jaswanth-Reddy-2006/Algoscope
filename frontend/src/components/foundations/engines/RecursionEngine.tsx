import React, { useState, useMemo, useEffect } from 'react';
import { useStore } from '../../../store/useStore';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Zap,
    Play,
    Info,
    Code,
    MessageSquare,
    LayoutGrid,
    List,
    ChevronRight
} from 'lucide-react';

import { TimelineProvider, useTimeline } from './Recursion/TimelineController';
import { EngineProps } from '../engineRegistry';
import DeterministicTree from './Recursion/DeterministicTree';
import DynamicStack from './Recursion/DynamicStack';
import TimelineControls from './Recursion/TimelineControls';
import MetricsDisplay from './Recursion/MetricsDisplay';
import IterativeView from './Recursion/IterativeView';
import TreeTraversalEngine from './Recursion/AdvancedBST/TreeTraversalEngine';
import problemsData from '../../../data/problems.json';
import {
    simulateFactorial,
    simulateFibonacci,
    simulateMergeSort,
    simulateSubsets,
    simulateTreeTraversal
} from './Recursion/RecursionSimulator';

const ALGORITHMS = [
    { id: 'factorial', label: 'Factorial (Linear)', simulate: () => simulateFactorial(4) },
    { id: 'fibonacci', label: 'Fibonacci (Binary)', simulate: () => simulateFibonacci(3) },
    { id: 'mergesort', label: 'Merge Sort (D&C)', simulate: () => simulateMergeSort([3, 1, 2]) },
    {
        id: 'inorder', label: 'Inorder (Trees)', simulate: () => simulateTreeTraversal({
            val: 1,
            left: { val: 2, left: { val: 4 }, right: { val: 5 } },
            right: { val: 3 }
        }, 'inorder')
    },
    {
        id: 'preorder', label: 'Preorder (Trees)', simulate: () => simulateTreeTraversal({
            val: 1,
            left: { val: 2, left: { val: 4 }, right: { val: 5 } },
            right: { val: 3 }
        }, 'preorder')
    },
    {
        id: 'postorder', label: 'Postorder (Trees)', simulate: () => simulateTreeTraversal({
            val: 1,
            left: { val: 2, left: { val: 4 }, right: { val: 5 } },
            right: { val: 3 }
        }, 'postorder')
    },
    { id: 'backtracking', label: 'Subsets (Backtracking)', simulate: () => simulateSubsets([1, 2]) }
];

const AUTO_DEMO_SCRIPT = [
    { text: "Recursion is simply a function that calls itself.", time: 0 },
    { text: "Each call 'suspends' itself and waits for its children.", time: 5000 },
    { text: "The Root Frame is pushed onto the Call Stack first.", time: 10000 },
    { text: "Notice how the Tree expands as we push new stack frames.", time: 15000 },
    { text: "Once we hit the Base Case, the recursion stops.", time: 25000 },
    { text: "Now watch the results 'cascade' and pop back down.", time: 35000 },
    { text: "The stack is LIFO: Last In, First Out.", time: 45000 },
    { text: "Conceptual Breakthrough: Recursion = Implicit Stack.", time: 55000 },
];

const DemoOverlay: React.FC<{ isRunning: boolean; onComplete: () => void }> = ({ isRunning, onComplete }) => {
    const { play, restart } = useTimeline();
    const [scriptIndex, setScriptIndex] = useState(0);

    useEffect(() => {
        if (!isRunning) return;

        restart();
        play();

        const timers = AUTO_DEMO_SCRIPT.map((item, idx) =>
            setTimeout(() => setScriptIndex(idx), item.time)
        );

        const endTimer = setTimeout(onComplete, 60000);

        return () => {
            timers.forEach(t => clearTimeout(t));
            clearTimeout(endTimer);
        };
    }, [isRunning, play, restart, onComplete]);

    if (!isRunning) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-40 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
        >
            <div className="bg-[#EC4186] text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-4 border border-white/20 backdrop-blur-3xl">
                <MessageSquare size={20} className="text-white/80" />
                <span className="text-sm font-bold tracking-tight font-outfit">{AUTO_DEMO_SCRIPT[scriptIndex].text}</span>
            </div>
        </motion.div>
    );
};

// Group problems by sub-patterns (Linear, Binary, Divide & Conquer, Backtracking)
const getRecursionProblems = () => {
    return (problemsData as any[]).filter(p =>
        p.tags?.includes('Recursion') ||
        p.primaryPattern === 'Backtracking' ||
        p.primaryPattern === 'Trees'
    ).map(p => ({
        ...p,
        // Map to our simulator IDs if they exist
        simulatorId: p.id === 94 ? 'inorder' :
            p.id === 95 ? 'preorder' :
                p.id === 96 ? 'postorder' :
                    p.title.includes('Fibonacci') ? 'fibonacci' :
                        p.title.includes('Factorial') ? 'factorial' :
                            p.title.includes('Merge Sort') ? 'mergesort' :
                                p.title.includes('Subsets') ? 'backtracking' : null
    }));
};

const RecursionEngineContent: React.FC<{
    showIterative: boolean;
    setShowIterative: (v: boolean) => void;
    selectedAlgo: any;
    isDemoRunning: boolean;
    setIsDemoRunning: (v: boolean) => void;
    isBrute?: boolean;
    onCloseVisualizer: () => void;
}> = ({ showIterative, setShowIterative, selectedAlgo, isDemoRunning, setIsDemoRunning, isBrute, onCloseVisualizer }) => {
    // If we have selected the BST (Advanced Visualizer), load the specialized debugger
    if (['inorder', 'preorder', 'postorder'].includes(selectedAlgo.id)) {
        return <TreeTraversalEngine />;
    }

    return (
        <div className="w-full h-full flex flex-col bg-[#2b0d38] overflow-hidden">
            <DemoOverlay isRunning={isDemoRunning} onComplete={() => setIsDemoRunning(false)} />

            {/* Header */}
            <div className="h-20 border-b border-white/5 px-8 flex items-center justify-between bg-white/[0.02] backdrop-blur-3xl z-30">
                <div className="flex items-center gap-4">
                    <button onClick={onCloseVisualizer} className="text-white/40 hover:text-white transition-colors mr-2">
                        <ChevronRight size={20} className="rotate-180" />
                    </button>
                    <div className="p-3 rounded-2xl bg-gradient-to-br from-[#EC4186] to-[#EE544A] text-white shadow-lg shadow-[#EC4186]/20">
                        <Zap size={20} />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="text-lg font-bold text-white tracking-tight">{selectedAlgo.label}</h2>
                            {isBrute && (
                                <span className="px-1.5 py-0.5 rounded bg-red-500/10 border border-red-500/20 text-red-400 text-[8px] font-black uppercase tracking-widest">
                                    Brute Force
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-white/40 uppercase tracking-widest font-bold">
                            <span className="text-[#EC4186]">Deterministic Engine Active</span>
                            <span className="w-1 h-1 rounded-full bg-white/20" />
                            <span>Timeline Verified</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsDemoRunning(true)}
                        className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#EC4186]/10 border border-[#EC4186]/30 text-[#EC4186] hover:bg-[#EC4186]/20 transition-all font-bold text-[10px] uppercase tracking-widest shadow-[0_0_20px_rgba(236,65,134,0.1)]"
                    >
                        <Play size={14} fill="currentColor" />
                        Explain in 60s
                    </button>
                    <button
                        onClick={() => setShowIterative(!showIterative)}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl border transition-all font-bold text-[10px] uppercase tracking-widest ${showIterative
                            ? 'bg-amber-500/10 border-amber-500/30 text-amber-500'
                            : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10'
                            }`}
                    >
                        <Code size={14} />
                        Iterative Mode
                    </button>
                </div>
            </div>

            {/* Main View */}
            <div className="flex-1 flex overflow-hidden">
                <div className="flex-1 relative flex flex-col p-8 gap-8 overflow-hidden">
                    {/* Upper Section: Tree and metrics */}
                    <div className="flex-1 relative bg-black/40 border border-white/5 rounded-3xl overflow-hidden shadow-inner font-sans">
                        <AnimatePresence>
                            {showIterative && (
                                <motion.div
                                    initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
                                    animate={{ opacity: 1, backdropFilter: 'blur(20px)' }}
                                    exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
                                    className="absolute inset-0 z-40 p-12 bg-[#2b0d38]/60"
                                >
                                    <IterativeView algorithmId={selectedAlgo.id} />
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <DeterministicTree />

                        {/* Floating Analytics */}
                        <div className="absolute top-6 left-6 flex flex-col gap-4">
                            <MetricsDisplay />
                        </div>

                        {/* Conceptual Overlay */}
                        <div className="absolute top-6 right-6 max-w-[240px]">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={selectedAlgo.id}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="p-5 rounded-2xl bg-black/60 border border-white/10 backdrop-blur-md shadow-2xl"
                                >
                                    <div className="flex items-center gap-2 text-[#EC4186] mb-3 font-black text-[10px] uppercase tracking-widest">
                                        <Info size={14} />
                                        <span>Engine Logic</span>
                                    </div>
                                    <p className="text-[11px] text-white/60 leading-relaxed italic font-medium">
                                        {selectedAlgo.id === 'fibonacci'
                                            ? "Binary recursion spawns two branches at each step, leading to exponential O(2^N) calls."
                                            : selectedAlgo.id === 'factorial'
                                                ? "Linear recursion creates a single chain of suspended calls."
                                                : selectedAlgo.id === 'mergesort'
                                                    ? "Merge Sort uses Divide & Conquer to split work into logarithmic depths."
                                                    : "Recursive exploration of the tree structure using the Depth First Search protocol."}
                                    </p>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Lower Section: Controls */}
                    <div className="h-32 bg-white/[0.03] border border-white/5 rounded-3xl p-6 backdrop-blur-3xl shadow-2xl">
                        <TimelineControls />
                    </div>
                </div>

                {/* Sidebar: Stack */}
                <div className="w-[340px] border-l border-white/5 bg-black/20 flex flex-col">
                    <DynamicStack />
                </div>
            </div>
        </div>
    );
};

const RecursionEngine: React.FC<EngineProps> = ({ moduleId, isBrute }) => {
    const currentProblem = useStore(state => state.currentProblem);

    const [selectedAlgo, setSelectedAlgo] = useState<any | null>(null);

    // Sync selected algo with current problem on load / change
    useEffect(() => {
        if (!currentProblem) return;

        const type = currentProblem.algorithmType;
        if (moduleId === 'trees' || type === 'tree' || type === 'recursion') {
            let algo = null;
            if (currentProblem.id === 94 || moduleId === 'trees') {
                algo = ALGORITHMS.find(a => a.id === 'inorder');
            } else if (currentProblem.id === 95) {
                algo = ALGORITHMS.find(a => a.id === 'preorder');
            } else if (currentProblem.id === 96) {
                algo = ALGORITHMS.find(a => a.id === 'postorder');
            } else if (currentProblem.id === 509 || currentProblem.id === 70) {
                algo = ALGORITHMS.find(a => a.id === 'fibonacci');
            }

            if (algo) {
                setSelectedAlgo(algo);
            }
        }
    }, [currentProblem, moduleId]);

    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [showIterative, setShowIterative] = useState(false);
    const [isDemoRunning, setIsDemoRunning] = useState(false);

    const problems = useMemo(() => getRecursionProblems(), []);

    const simulationResult = useMemo(() => {
        if (!selectedAlgo) return null;
        return selectedAlgo.simulate();
    }, [selectedAlgo]);

    // If an algorithm is selected, render the execution visualizer
    if (selectedAlgo && simulationResult) {
        return (
            <TimelineProvider key={selectedAlgo.id} result={simulationResult}>
                <RecursionEngineContent
                    selectedAlgo={selectedAlgo}
                    showIterative={showIterative}
                    setShowIterative={setShowIterative}
                    isDemoRunning={isDemoRunning}
                    setIsDemoRunning={setIsDemoRunning}
                    isBrute={isBrute}
                    onCloseVisualizer={() => setSelectedAlgo(null)}
                />
            </TimelineProvider>
        );
    }

    // Otherwise, render the Pattern Library list of recursion problems
    return (
        <div className="w-full h-full flex flex-col bg-[#2b0d38] overflow-hidden text-white font-sans">
            {/* Top Bar Navigation */}
            <div className="h-16 px-8 border-b border-white/5 flex items-center justify-between bg-black/20">
                {/* Breadcrumbs */}
                <div className="flex items-center gap-2 text-sm font-bold text-white/60">
                    <span className="hover:text-white cursor-pointer transition-colors uppercase tracking-[0.1em] text-[10px]">Patterns</span>
                    <ChevronRight size={12} className="text-white/20" />
                    <span className="text-white uppercase tracking-[0.1em] text-[10px]">Recursion</span>
                </div>

                {/* Toggles */}
                <div className="flex items-center gap-6">
                    {/* Concept | Execution | Stack | Hybrid modes - Placeholder visuals for now */}
                    <div className="flex items-center gap-1 bg-white/5 p-1 rounded-lg border border-white/10">
                        {['Concept', 'Execution', 'Stack', 'Hybrid'].map(mode => (
                            <button key={mode} className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-md ${mode === 'Execution' ? 'bg-[#EC4186] text-white shadow-md' : 'text-white/40 hover:text-white/80'}`}>
                                {mode}
                            </button>
                        ))}
                    </div>

                    <div className="w-px h-6 bg-white/10" />

                    {/* View Toggles */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-white/10 text-white' : 'text-white/40 hover:bg-white/5'}`}
                        >
                            <LayoutGrid size={18} />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-white/10 text-white' : 'text-white/40 hover:bg-white/5'}`}
                        >
                            <List size={18} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-8">
                <div className="max-w-6xl mx-auto">
                    <div className="mb-12 border-l-4 border-[#EC4186] pl-8 py-2">
                        <h1 className="text-4xl font-black mb-4 uppercase tracking-tighter">Recursion Patterns</h1>
                        <p className="text-white/50 max-w-2xl text-sm leading-relaxed font-medium">
                            Explore recursive algorithms through high-fidelity visual execution. Witness the call stack expansion, base case anchoring, and the reactive cascade of results across complex data structures.
                        </p>
                    </div>

                    <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" : "flex flex-col gap-4"}>
                        {problems.map(problem => {
                            // Find the matching simulation algorithm
                            const algoObj = ALGORITHMS.find(a => a.id === problem.simulatorId);

                            return (
                                <div
                                    key={problem.id}
                                    onClick={() => {
                                        if (algoObj) setSelectedAlgo(algoObj);
                                    }}
                                    className={`
                                        group relative p-8 rounded-[32px] border border-white/5 bg-white/5 hover:bg-white/[0.08] transition-all cursor-pointer overflow-hidden
                                        ${algoObj ? 'hover:border-[#EC4186]/30' : 'opacity-50 grayscale cursor-not-allowed'}
                                        ${viewMode === 'list' ? 'flex items-center justify-between gap-6' : 'flex flex-col'}
                                    `}
                                >
                                    {/* Pattern Glow */}
                                    {algoObj && (
                                        <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#EC4186]/5 blur-[60px] group-hover:bg-[#EC4186]/10 transition-all rounded-full" />
                                    )}

                                    <div className="flex-1 relative z-10">
                                        <div className="flex items-center justify-between mb-6">
                                            <span className={`px-4 py-1 text-[9px] font-black uppercase tracking-[0.2em] rounded-full border ${problem.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                                problem.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                                                    'bg-rose-500/10 text-rose-400 border-rose-500/20'
                                                }`}>
                                                {problem.difficulty}
                                            </span>
                                            {algoObj && (
                                                <div className="flex items-center gap-2 text-[9px] text-[#EC4186] font-black uppercase tracking-[0.2em] bg-[#EC4186]/10 px-3 py-1 rounded-full border border-[#EC4186]/20">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-[#EC4186] animate-pulse" /> Live Lab
                                                </div>
                                            )}
                                        </div>
                                        <h3 className="text-2xl font-black text-white mb-3 group-hover:text-[#EC4186] transition-colors tracking-tight">
                                            {problem.title}
                                        </h3>
                                        {viewMode === 'grid' && (
                                            <p className="text-[13px] text-white/40 leading-relaxed font-medium line-clamp-2">
                                                {problem.shortPatternReason || problem.brute_force_explanation}
                                            </p>
                                        )}
                                    </div>

                                    <div className={`flex items-center gap-6 relative z-10 ${viewMode === 'grid' ? 'mt-8 pt-8 border-t border-white/5' : ''}`}>
                                        <div className="flex flex-col gap-1">
                                            <span className="text-[8px] uppercase tracking-[0.3em] text-white/30 font-black">efficiency</span>
                                            <span className="font-mono text-sm text-white/70 font-bold">{problem.time_efficiency || 'O(?)'}</span>
                                        </div>
                                        <div className="w-px h-8 bg-white/10" />
                                        <div className="flex flex-col gap-1">
                                            <span className="text-[8px] uppercase tracking-[0.3em] text-white/30 font-black">Pattern</span>
                                            <span className="text-xs text-[#EC4186] font-black uppercase tracking-widest">{problem.primaryPattern || 'Recursion'}</span>
                                        </div>
                                    </div>

                                    {/* Decoration */}
                                    <div className="absolute bottom-4 right-8 opacity-0 group-hover:opacity-10 transition-opacity">
                                        <ChevronRight size={40} className="text-white" />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecursionEngine;
