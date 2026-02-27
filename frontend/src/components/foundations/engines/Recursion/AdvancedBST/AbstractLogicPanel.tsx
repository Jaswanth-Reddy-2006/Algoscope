import React from 'react';
import { motion } from 'framer-motion';
import { useTimeline } from '../TimelineController';
import { Terminal, Code } from 'lucide-react';
import { useStore } from '../../../../../store/useStore';

const GET_LOGIC = (mode: string) => {
    const fn = mode.includes('preorder') ? 'preorder' : mode.includes('postorder') ? 'postorder' : 'inorder';

    return [
        { line: 1, text: `function ${fn}(node):` },
        { line: 2, text: "    if node == null:" },
        { line: 3, text: "        return" },
        ...(fn === 'preorder' ? [{ line: 5, text: "    visit(node)" }] : []),
        { line: 4, text: `    ${fn}(node.left)` },
        ...(fn === 'inorder' ? [{ line: 5, text: "    visit(node)" }] : []),
        { line: 6, text: `    ${fn}(node.right)` },
        ...(fn === 'postorder' ? [{ line: 5, text: "    visit(node)" }] : []),
    ];
};

const AbstractLogicPanel: React.FC = () => {
    const { currentStep } = useTimeline();
    const { currentProblem } = useStore();

    const mode = currentProblem?.slug || 'inorder';
    const logicSteps = GET_LOGIC(mode);
    const activeLineNumber = currentStep?.payload?.pseudoCodeLine || null;

    return (
        <div className="flex-1 flex flex-col bg-black/40 border border-white/5 rounded-3xl overflow-hidden shadow-2xl font-mono text-sm relative min-h-[300px]">
            <div className="px-6 py-4 border-b border-white/10 bg-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Terminal size={14} className="text-[#EC4186]" />
                    <span className="font-bold text-white tracking-widest text-[10px] uppercase underline decoration-[#EC4186]/50 underline-offset-4">Abstract Logic</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#EC4186]/10 border border-[#EC4186]/20">
                    <div className="w-1 h-1 rounded-full bg-[#EC4186] animate-pulse" />
                    <span className="text-[8px] font-black text-[#EC4186] uppercase tracking-[0.2em]">Logic Mode</span>
                </div>
            </div>

            <div className="p-6 flex flex-col gap-1 overflow-y-auto">
                <div className="flex flex-col gap-1">
                    {logicSteps.map(({ line, text }) => {
                        const isActive = activeLineNumber === line;

                        return (
                            <div
                                key={`${line}-${text}`}
                                className={`
                                    relative px-4 py-2 rounded-lg flex items-center gap-4 transition-all duration-300
                                    ${isActive ? 'bg-[#EC4186]/20 text-[#EC4186] font-bold shadow-[inset_0_0_20px_rgba(236,65,134,0.1)]' : 'text-white/60 hover:bg-white/5'}
                                `}
                            >
                                {/* Line Number */}
                                <span className="w-6 text-right text-[10px] opacity-30 select-none font-bold">{line}</span>

                                {/* Code Text */}
                                <span className="whitespace-pre text-[11px]">{text}</span>

                                {/* Active Indicator Bar */}
                                {isActive && (
                                    <motion.div
                                        layoutId="active-line-indicator"
                                        className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-2/3 bg-[#EC4186] rounded-r-full shadow-[0_0_10px_#EC4186]"
                                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                    />
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="mt-auto px-6 py-3 bg-[#EC4186]/5 border-t border-white/5 flex items-center justify-between">
                <span className="text-[9px] text-[#EC4186]/50 font-black uppercase tracking-widest italic font-outfit">Neural Sync Active...</span>
                <Code size={12} className="text-[#EC4186]/30" />
            </div>
        </div>
    );
};

export default AbstractLogicPanel;
