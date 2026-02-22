import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Timer,
    AlertOctagon,
    Terminal,
    CheckCircle2,
    Play,
    Zap,
    Copy,
    Search,
    Trophy
} from 'lucide-react';
import { InterviewSim } from '../../types/foundation';

interface Props {
    simData: InterviewSim;
    moduleId: string;
}

export const InterviewSimulator: React.FC<Props> = ({ simData, moduleId }) => {
    const [timeLeft, setTimeLeft] = useState(1200); // 20 mins
    const [isActive, setIsActive] = useState(false);
    const [activeTab, setActiveTab] = useState<'mistakes' | 'constraints' | 'code'>('mistakes');
    const [selectedLanguage, setSelectedLanguage] = useState<'python' | 'java' | 'cpp' | 'ts'>('python');

    useEffect(() => {
        let interval: any = null;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setIsActive(false);
        }
        return () => clearInterval(interval);
    }, [isActive, timeLeft]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const getConstraintLabel = (constraint: string) => {
        if (constraint.includes('10^5')) return { complexity: 'O(N) / O(N log N)', color: 'text-green-400' };
        if (constraint.includes('10^8')) return { complexity: 'O(log N)', color: 'text-accent-blue' };
        if (constraint.includes('2^N')) return { complexity: 'O(2^N) / Backtracking', color: 'text-red-400' };
        return { complexity: 'O(1)', color: 'text-white' };
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-12">
            {/* Left Column: Challenge Controls */}
            <div className="lg:col-span-4 space-y-6">
                <div className="p-8 rounded-3xl bg-gradient-to-br from-purple-500/20 to-accent-blue/20 border border-white/10 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Trophy size={100} />
                    </div>

                    <div className="relative space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-white/60 tracking-widest uppercase">
                                Challenge Session
                            </div>
                            <div className={`text-xl font-mono font-bold ${timeLeft < 300 ? 'text-red-400 animate-pulse' : 'text-accent-blue'}`}>
                                {formatTime(timeLeft)}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <h3 className="text-2xl font-bold tracking-tight text-white uppercase italic">Mock Interview</h3>
                            <p className="text-sm text-white/40 leading-relaxed">
                                You have 20 minutes to explain the {moduleId} architecture and solve its core pattern challenges.
                            </p>
                        </div>

                        <button
                            onClick={() => setIsActive(!isActive)}
                            className={`w-full py-4 rounded-2xl flex items-center justify-center gap-3 font-bold uppercase tracking-widest transition-all ${isActive
                                ? 'bg-red-500/20 border border-red-500/40 text-red-400 hover:bg-red-500/30'
                                : 'bg-accent-blue hover:bg-accent-blue/80 text-white shadow-lg shadow-accent-blue/20'
                                }`}
                        >
                            {isActive ? <Timer size={20} /> : <Play size={20} fill="currentColor" />}
                            {isActive ? 'Pause Challenge' : 'Start Simulation'}
                        </button>
                    </div>
                </div>

                {/* Practice Problem Links */}
                <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 space-y-4">
                    <h4 className="text-xs font-bold text-white/20 uppercase tracking-widest flex items-center gap-2">
                        <Search size={14} /> Recommended Drills
                    </h4>
                    <div className="space-y-2">
                        {simData.practiceProblems.map(probId => (
                            <a
                                key={probId}
                                href={`/problems/${probId}`}
                                className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors group"
                            >
                                <span className="text-sm font-bold text-white/60 group-hover:text-white transition-colors">
                                    LC #{probId} Strategy
                                </span>
                                <CheckCircle2 size={16} className="text-white/20 group-hover:text-green-400 transition-colors" />
                            </a>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Column: Simulator Tabs */}
            <div className="lg:col-span-8 space-y-6">
                <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-white/[0.02] border border-white/5 w-fit">
                    {[
                        { id: 'mistakes', label: 'Pitfalls', icon: AlertOctagon },
                        { id: 'constraints', label: 'Constraints', icon: Zap },
                        { id: 'code', label: 'Implementation', icon: Terminal }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${activeTab === tab.id
                                ? 'bg-white/10 text-white shadow-xl'
                                : 'text-white/40 hover:text-white/60'
                                }`}
                        >
                            <tab.icon size={14} />
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="min-h-[450px]">
                    <AnimatePresence mode="wait">
                        {activeTab === 'mistakes' && (
                            <motion.div
                                key="mistakes"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="grid grid-cols-1 md:grid-cols-2 gap-6"
                            >
                                {simData.commonMistakes.map((mistake, idx) => (
                                    <div key={idx} className="p-6 rounded-3xl bg-red-500/[0.03] border border-red-500/10 space-y-4 hover:border-red-500/20 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-lg bg-red-500/20 text-red-500">
                                                <AlertOctagon size={18} />
                                            </div>
                                            <h4 className="font-bold text-white tracking-tight">{mistake.title}</h4>
                                        </div>
                                        <p className="text-sm text-white/40 leading-relaxed italic">
                                            "{mistake.explanation}"
                                        </p>
                                        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/10 flex items-start gap-3">
                                            <Zap size={14} className="text-red-400 shrink-0 mt-0.5" />
                                            <p className="text-xs text-red-400 font-medium">{mistake.warning}</p>
                                        </div>
                                    </div>
                                ))}
                            </motion.div>
                        )}

                        {activeTab === 'constraints' && (
                            <motion.div
                                key="constraints"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 space-y-6">
                                    <div className="flex items-center gap-3 text-xl font-bold italic">
                                        <Zap className="text-yellow-400" />
                                        Complexity Decoder
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {simData.constraints.map((c, idx) => {
                                            const analysis = getConstraintLabel(c);
                                            return (
                                                <div key={idx} className="p-6 rounded-2xl bg-white/[0.03] border border-white/5 space-y-3">
                                                    <div className="text-xs font-bold text-white/30 uppercase tracking-widest">Input Limit</div>
                                                    <div className="text-lg font-mono text-white">{c}</div>
                                                    <div className={`text-xs font-bold uppercase tracking-widest pt-2 flex items-center gap-2 ${analysis.color}`}>
                                                        <div className="w-1 h-1 rounded-full bg-current" />
                                                        REQUIRES {analysis.complexity}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'code' && (
                            <motion.div
                                key="code"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div className="flex items-center justify-between pb-2">
                                    <div className="flex gap-2">
                                        {['python', 'java', 'cpp', 'ts'].map((lang) => (
                                            <button
                                                key={lang}
                                                onClick={() => setSelectedLanguage(lang as any)}
                                                className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${selectedLanguage === lang
                                                    ? 'bg-accent-blue text-white shadow-lg shadow-accent-blue/20'
                                                    : 'bg-white/5 text-white/40 hover:text-white/60'
                                                    }`}
                                            >
                                                {lang}
                                            </button>
                                        ))}
                                    </div>
                                    <button className="flex items-center gap-2 p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/40 transition-colors">
                                        <Copy size={16} />
                                    </button>
                                </div>

                                <div className="rounded-3xl bg-[#0d021f] border border-white/10 overflow-hidden shadow-2xl">
                                    <div className="flex items-center justify-between px-6 py-4 bg-white/5 border-b border-white/10">
                                        <div className="flex items-center gap-4">
                                            <div className="flex gap-1.5">
                                                <div className="w-2.5 h-2.5 rounded-full bg-red-500/40" />
                                                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/40" />
                                                <div className="w-2.5 h-2.5 rounded-full bg-green-500/40" />
                                            </div>
                                            <span className="text-[10px] font-mono text-white/30 uppercase tracking-widest">
                                                {moduleId}_foundation_template.{selectedLanguage === 'python' ? 'py' : selectedLanguage === 'ts' ? 'ts' : selectedLanguage === 'java' ? 'java' : 'cpp'}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 px-2 py-0.5 rounded bg-green-400/10 text-green-400 text-[10px] font-bold uppercase tracking-widest">
                                            <Zap size={10} /> Optimized O(1)
                                        </div>
                                    </div>
                                    <pre className="p-8 text-sm font-mono text-white/70 leading-relaxed overflow-x-auto bg-grid-white/[0.01]">
                                        {`# Standard ${moduleId.charAt(0).toUpperCase() + moduleId.slice(1)} Implementation
# -----------------------------------------------
class ${moduleId.charAt(0).toUpperCase() + moduleId.slice(1)}Structure:
    def __init__(self, capacity):
        self.data = [None] * capacity
        self.capacity = capacity
        
    def execute_core_operation(self, value):
        # Time Complexity: O(1)
        # Space Complexity: O(1)
        pass

# PRO-TIP: During interviews, always mention 
# amortized time complexity if the structure
# resizes dynamically.`}
                                    </pre>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};
