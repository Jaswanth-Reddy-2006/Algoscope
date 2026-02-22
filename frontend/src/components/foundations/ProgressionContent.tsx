import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BookOpen,
    Code,
    CheckCircle2,
    ExternalLink,
    Play
} from 'lucide-react';
import { FoundationModule, ProgressionLevel } from '../../types/foundation';
import { FoundationVisualizer } from './visualizer/FoundationVisualizer';
import { PatternDependencyGraph } from './PatternDependencyGraph';
import { InterviewSimulator } from './InterviewSimulator';

interface Props {
    module: FoundationModule;
    level: 'fundamentals' | 'patterns' | 'advanced';
    onVisualize?: () => void;
}

export const ProgressionContent: React.FC<Props> = ({ module, level, onVisualize }) => {
    const content: ProgressionLevel = module.progression[level];
    const [showVisualizer, setShowVisualizer] = React.useState(false);

    return (
        <div className="space-y-12">
            {/* Visualizer Trigger Card */}
            <div className="relative group overflow-hidden rounded-3xl bg-gradient-to-r from-accent-blue/20 to-purple-500/20 border border-white/10 p-1">
                <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:20px_20px]" />
                <div className="relative bg-[#0a0118]/80 backdrop-blur-3xl rounded-[22px] p-8 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold italic">Interactive Playground</h2>
                        <p className="text-white/50 max-w-md">
                            Visualize the {module.title} in action. Step through operations, track memory pointers, and master the {level} logic.
                        </p>
                    </div>
                    <button
                        onClick={() => {
                            setShowVisualizer(!showVisualizer);
                            onVisualize?.();
                        }}
                        className="flex items-center gap-3 px-8 py-4 bg-accent-blue hover:bg-accent-blue/80 text-white font-bold rounded-2xl transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(0,112,243,0.3)]"
                    >
                        {showVisualizer ? (
                            <>
                                <BookOpen size={20} />
                                Show Concepts
                            </>
                        ) : (
                            <>
                                <Play size={20} fill="currentColor" />
                                Launch Visualizer
                            </>
                        )}
                    </button>
                </div>
            </div>

            <AnimatePresence mode="wait">
                {showVisualizer ? (
                    <motion.div
                        key="visualizer"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-12"
                    >
                        {level === 'patterns' && module.patternMapping?.dependencyGraph?.nodes?.length > 0 && (
                            <PatternDependencyGraph
                                graph={module.patternMapping.dependencyGraph}
                                moduleId={module.id}
                            />
                        )}
                        {level === 'advanced' && module.interviewSim && (
                            <InterviewSimulator
                                simData={module.interviewSim}
                                moduleId={module.id}
                            />
                        )}
                        <FoundationVisualizer type={module.visualizerType} moduleId={module.id} />
                    </motion.div>
                ) : (
                    <motion.div
                        key="concepts"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-12"
                    >
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                            {/* Concepts Column */}
                            <div className="lg:col-span-2 space-y-8">
                                <div className="flex items-center gap-3 text-2xl font-bold italic">
                                    <BookOpen className="text-accent-blue" />
                                    Core Concepts
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {content.concepts.map((concept, idx) => (
                                        <motion.div
                                            key={idx}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.1 }}
                                            className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all group"
                                        >
                                            <h4 className="text-lg font-bold text-accent-blue mb-2 group-hover:text-white transition-colors">
                                                {concept.title}
                                            </h4>
                                            <p className="text-white/50 text-sm leading-relaxed">
                                                {concept.explanation}
                                            </p>
                                        </motion.div>
                                    ))}
                                </div>

                                <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 space-y-4">
                                    <h3 className="text-xl font-bold flex items-center gap-2">
                                        <Code className="text-accent-blue" size={20} />
                                        Structural Logic
                                    </h3>
                                    <div className="text-white/60 text-sm leading-loose">
                                        {level === 'fundamentals' && module.internalWorking}
                                        {level === 'patterns' && module.whatProblemItSolves}
                                        {level === 'advanced' && "Focus on amortized analysis and edge-case handling for high-performance systems."}
                                    </div>
                                </div>
                            </div>

                            {/* Practice Column */}
                            <div className="space-y-8">
                                <div className="flex items-center gap-3 text-2xl font-bold italic">
                                    <CheckCircle2 className="text-green-400" />
                                    Mastery Drills
                                </div>

                                <div className="space-y-4">
                                    {content.problems.map((probId, idx) => (
                                        <a
                                            key={probId}
                                            href={`/problems/${probId}`}
                                            className="flex items-center justify-between p-4 rounded-xl bg-white/[0.05] border border-white/5 hover:bg-white/[0.08] hover:border-white/10 transition-all group"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-xs font-mono text-white/40">
                                                    #{probId}
                                                </div>
                                                <div className="font-bold text-white/80 group-hover:text-white transition-colors">
                                                    Practice Goal {idx + 1}
                                                </div>
                                            </div>
                                            <ExternalLink size={16} className="text-white/20 group-hover:text-accent-blue transition-colors" />
                                        </a>
                                    ))}

                                    <div className="pt-6 border-t border-white/5 mt-6">
                                        <h4 className="text-xs font-bold text-white/20 uppercase tracking-widest mb-4">Memory Hint</h4>
                                        <p className="text-xs text-white/40 leading-relaxed italic">
                                            {module.memoryRepresentation}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
