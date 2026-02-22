import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Play,
    Pause,
    SkipForward,
    RotateCcw,
    Settings2,
    Cpu,
    Eye,
    Activity
} from 'lucide-react';
import { VisualizerType } from '../../../types/foundation';
import { ArrayEngine } from './engines/ArrayEngine';
import { LinkedListEngine } from './engines/LinkedListEngine';
import { HeapEngine } from './engines/HeapEngine';
import { TrieEngine } from './engines/TrieEngine';
import { GraphEngine } from './engines/GraphEngine';
import { BitManipulationEngine } from './engines/BitManipulationEngine';

interface Props {
    type: VisualizerType;
    moduleId: string;
}

export const FoundationVisualizer: React.FC<Props> = ({ type, moduleId }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [step, setStep] = useState(0);
    const [speed, setSpeed] = useState(1);
    const [advancedMode, setAdvancedMode] = useState(false);

    // Mock Data States
    const [mockData] = useState([10, 20, 30, 40, null, null, null, null]);
    const [mockNodes] = useState([
        { id: 'n1', value: 10, next: 'n2' },
        { id: 'n2', value: 20, next: 'n3' },
        { id: 'n3', value: 30, next: 'n4' },
        { id: 'n4', value: 40, next: null },
    ]);
    const [mockHeap] = useState([85, 70, 45, 12, 59, 34, 15]);
    const [mockTrie] = useState({
        'root': { id: 'root', char: null, isEndOfWord: false, children: { 'a': 'n1', 'b': 'n2' } },
        'n1': { id: 'n1', char: 'A', isEndOfWord: false, children: { 'p': 'n3' } },
        'n2': { id: 'n2', char: 'B', isEndOfWord: true, children: {} },
        'n3': { id: 'n3', char: 'P', isEndOfWord: true, children: {} }
    });
    const [mockGraph] = useState({
        nodes: [
            { id: 'g1', label: '0', x: 50, y: 50 },
            { id: 'g2', label: '1', x: 30, y: 150 },
            { id: 'g3', label: '2', x: 70, y: 150 },
            { id: 'g4', label: '3', x: 50, y: 250 },
        ],
        edges: [
            { source: 'g1', target: 'g2' },
            { source: 'g1', target: 'g3' },
            { source: 'g2', target: 'g4' },
            { source: 'g3', target: 'g4' },
            { source: 'g2', target: 'g3' }
        ]
    });
    const [mockBitValue] = useState(42);

    const [activeIndex, setActiveIndex] = useState(0);

    // Dynamic limit based on type
    const getLimit = useCallback(() => {
        switch (type) {
            case 'heap': return mockHeap.length;
            case 'array': return mockData.length;
            case 'linked_list': return mockNodes.length;
            case 'trie': return Object.keys(mockTrie).length;
            case 'graph': return mockGraph.nodes.length;
            case 'bit_manipulation': return 8;
            default: return 1;
        }
    }, [type, mockHeap.length, mockData.length, mockNodes.length, mockTrie, mockGraph.nodes.length]);

    // Simple auto-step logic for demo
    useEffect(() => {
        if (isPlaying) {
            const interval = setInterval(() => {
                const limit = getLimit();
                setActiveIndex((prev) => (prev + 1) % limit);
                setStep((prev) => prev + 1);
            }, 1000 / speed);
            return () => clearInterval(interval);
        }
    }, [isPlaying, speed, getLimit]);

    const handleStep = () => {
        const limit = getLimit();
        setActiveIndex((prev) => (prev + 1) % limit);
        setStep((prev) => prev + 1);
    };

    const handleReset = () => {
        setActiveIndex(0);
        setIsPlaying(false);
        setStep(0);
    };

    return (
        <div className="relative w-full aspect-video rounded-3xl bg-[#0a0118] border border-white/10 overflow-hidden shadow-2xl flex flex-col">
            {/* Visualizer Canvas Placeholder */}
            <div className="flex-1 relative flex items-center justify-center bg-grid-white/[0.02]">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0a0118]/80" />

                <AnimatePresence mode="wait">
                    {type === 'array' ? (
                        <motion.div
                            key="array-engine"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="relative z-10 w-full flex justify-center p-12"
                        >
                            <ArrayEngine
                                data={mockData}
                                activeIndex={activeIndex}
                                label={`${moduleId.toUpperCase()} - CAPACITY: ${mockData.length}`}
                            />
                        </motion.div>
                    ) : type === 'linked_list' ? (
                        <motion.div
                            key="ll-engine"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="relative z-10 w-full flex justify-center p-12"
                        >
                            <LinkedListEngine
                                nodes={mockNodes}
                                headId="n1"
                                activeNodeId={mockNodes[activeIndex]?.id}
                            />
                        </motion.div>
                    ) : type === 'heap' ? (
                        <motion.div
                            key="heap-engine"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="relative z-10 w-full flex justify-center p-12"
                        >
                            <HeapEngine
                                data={mockHeap}
                                type="max"
                                activeIndex={activeIndex}
                            />
                        </motion.div>
                    ) : type === 'trie' ? (
                        <motion.div
                            key="trie-engine"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="relative z-10 w-full flex justify-center p-12"
                        >
                            <TrieEngine
                                nodes={mockTrie}
                                rootId="root"
                                activeNodeId={Object.keys(mockTrie)[activeIndex]}
                            />
                        </motion.div>
                    ) : type === 'graph' ? (
                        <motion.div
                            key="graph-engine"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.1 }}
                            className="relative z-10 w-full flex justify-center p-12"
                        >
                            <GraphEngine
                                nodes={mockGraph.nodes}
                                edges={mockGraph.edges}
                                activeNodeId={mockGraph.nodes[activeIndex]?.id}
                            />
                        </motion.div>
                    ) : type === 'bit_manipulation' ? (
                        <motion.div
                            key="bit-engine"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.1 }}
                            className="relative z-10 w-full flex justify-center p-12"
                        >
                            <BitManipulationEngine
                                value={mockBitValue}
                                highlightBits={[activeIndex % 8]}
                            />
                        </motion.div>
                    ) : (
                        <motion.div
                            key={type}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.1 }}
                            className="relative z-10 flex flex-col items-center gap-6"
                        >
                            <div className="p-6 rounded-full bg-accent-blue/10 border border-accent-blue/20 text-accent-blue animate-pulse">
                                <Activity size={48} />
                            </div>
                            <div className="text-center">
                                <h3 className="text-2xl font-bold text-white tracking-widest uppercase italic">{type} Engine</h3>
                                <p className="text-white/40 text-sm">Visualizing internal partitions and memory mappings...</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Floating Memory Overlay (Advanced Mode) */}
                {advancedMode && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="absolute top-6 right-6 w-64 p-4 rounded-2xl bg-white/[0.05] border border-white/10 backdrop-blur-xl z-20 space-y-4"
                    >
                        <h4 className="text-[10px] font-bold text-accent-blue uppercase tracking-widest flex items-center gap-2">
                            <Cpu size={12} />
                            Memory Registry
                        </h4>
                        <div className="space-y-2 font-mono text-[10px]">
                            <div className="flex justify-between text-white/60">
                                <span>Stack Pointer:</span>
                                <span className="text-green-400">0x7FFF56B4</span>
                            </div>
                            <div className="flex justify-between text-white/60">
                                <span>Heap Allocation:</span>
                                <span className="text-purple-400">1.2 KB</span>
                            </div>
                            <div className="flex justify-between text-white/60">
                                <span>Step Count:</span>
                                <span className="text-white">{step}</span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Control Bar */}
            <div className="p-6 bg-white/[0.02] border-t border-white/10 backdrop-blur-xl flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <div className="flex items-center bg-white/5 rounded-2xl p-1 border border-white/5">
                        <button
                            onClick={() => setIsPlaying(!isPlaying)}
                            className={`p-3 rounded-xl transition-all active:scale-90 ${isPlaying ? 'bg-accent-blue/20 text-accent-blue' : 'hover:bg-white/10 text-white'}`}
                        >
                            {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
                        </button>
                        <button
                            onClick={handleStep}
                            className="p-3 rounded-xl hover:bg-white/10 text-white/60 transition-all active:scale-90"
                        >
                            <SkipForward size={20} />
                        </button>
                        <button
                            onClick={handleReset}
                            className="p-3 rounded-xl hover:bg-white/10 text-white/60 transition-all active:scale-90"
                        >
                            <RotateCcw size={20} />
                        </button>
                    </div>

                    <div className="flex items-center gap-2 bg-white/5 rounded-2xl px-4 py-2 border border-white/5">
                        <span className="text-[10px] font-bold text-white/40 uppercase">Speed</span>
                        <select
                            value={speed}
                            onChange={(e) => setSpeed(Number(e.target.value))}
                            className="bg-transparent text-accent-blue font-bold text-sm outline-none cursor-pointer"
                        >
                            <option value={1}>1x</option>
                            <option value={2}>2x</option>
                            <option value={5}>5x</option>
                        </select>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setAdvancedMode(!advancedMode)}
                        className={`
              flex items-center gap-2 px-4 py-2 rounded-2xl border transition-all font-bold text-xs uppercase tracking-widest
              ${advancedMode
                                ? 'bg-accent-blue/20 border-accent-blue/40 text-accent-blue'
                                : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10'
                            }
            `}
                    >
                        <Eye size={14} />
                        Advanced
                    </button>

                    <button className="p-3 rounded-2xl bg-white/5 border border-white/10 text-white/40 hover:bg-white/10 transition-all">
                        <Settings2 size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
};
