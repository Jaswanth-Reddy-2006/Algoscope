import React, { useMemo, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTimeline } from './TimelineController';
import { CallFrame } from './RecursionSimulator';

const DeterministicTree: React.FC = () => {
    return (
        <div className="w-full h-full relative p-20 flex items-center justify-center overflow-auto">
            <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
                <defs>
                    <marker
                        id="arrowhead"
                        markerWidth="10"
                        markerHeight="7"
                        refX="0"
                        refY="3.5"
                        orient="auto"
                    >
                        <polygon points="0 0, 10 3.5, 0 7" fill="#3B82F6" opacity="0.5" />
                    </marker>
                </defs>
                <Connections parentId={undefined} />
            </svg>

            <div className="relative flex flex-col items-center gap-16">
                <NodeHierarchy parentId={undefined} />
            </div>
        </div>
    );
};

const Connections: React.FC<{ parentId?: string }> = ({ parentId }) => {
    const { state: { frames, currentStepIndex: currentIndex } } = useTimeline();

    const children = useMemo(() => {
        return Object.values(frames).filter((f: CallFrame) => f.parentId === parentId && f.stepCreated <= currentIndex);
    }, [frames, parentId, currentIndex]);

    return (
        <>
            {children.map((child: any) => (
                <React.Fragment key={child.id}>
                    <ConnectionLine parentId={parentId} childId={child.id} />
                    <Connections parentId={child.id} />
                </React.Fragment>
            ))}
        </>
    );
};

const ConnectionLine: React.FC<{ parentId?: string; childId: string }> = ({ parentId, childId }) => {
    const [points, setPoints] = useState<{ x1: number, y1: number, x2: number, y2: number } | null>(null);
    const { state: { frames, currentStepIndex: currentIndex } } = useTimeline();

    useEffect(() => {
        const timer = setTimeout(() => {
            const parentEl = document.getElementById(`node-${parentId || 'root'}`);
            const childEl = document.getElementById(`node-${childId}`);
            const containerEl = parentEl?.closest('.p-20');

            if (parentEl && childEl && containerEl) {
                const pRect = parentEl.getBoundingClientRect();
                const cRect = childEl.getBoundingClientRect();
                const contRect = containerEl.getBoundingClientRect();

                setPoints({
                    x1: pRect.left + pRect.width / 2 - contRect.left,
                    y1: pRect.top + pRect.height / 2 - contRect.top,
                    x2: cRect.left + cRect.width / 2 - contRect.left,
                    y2: cRect.top + cRect.height / 2 - contRect.top
                });
            }
        }, 50);
        return () => clearTimeout(timer);
    }, [parentId, childId, currentIndex]);

    if (!points) return null;

    const isReturned = frames[childId].stepReturned !== undefined && frames[childId].stepReturned <= currentIndex;

    return (
        <motion.line
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: isReturned ? 0.2 : 0.5 }}
            x1={points.x1}
            y1={points.y1}
            x2={points.x2}
            y2={points.y2}
            stroke={isReturned ? "#10B981" : "#3B82F6"}
            strokeWidth="2"
            strokeDasharray="4 4"
        />
    );
};

const NodeHierarchy: React.FC<{ parentId?: string }> = ({ parentId }) => {
    const { state: { frames, currentStepIndex: currentIndex, steps } } = useTimeline();
    const activeStep = steps[currentIndex];

    const children = useMemo(() => {
        return Object.values(frames).filter((f: CallFrame) => f.parentId === parentId && f.stepCreated <= currentIndex);
    }, [frames, parentId, currentIndex]);

    const node = parentId ? frames[parentId] : null;

    return (
        <div className="flex flex-col items-center gap-16">
            {parentId && node && (
                <TreeNodeComponent
                    id={node.id}
                    node={node}
                    isActive={node.id === activeStep.activeFrameId}
                    isReturned={node.stepReturned !== undefined && node.stepReturned <= currentIndex}
                />
            )}
            {!parentId && (
                <div id="node-root" className="opacity-0 w-0 h-0" />
            )}
            {children.length > 0 && (
                <div className="flex gap-16 items-start">
                    {children.map((child: any) => (
                        <NodeHierarchy key={child.id} parentId={child.id} />
                    ))}
                </div>
            )}
        </div>
    );
};

const TreeNodeComponent: React.FC<{ id: string; node: CallFrame; isActive: boolean; isReturned: boolean }> = ({ id, node, isActive, isReturned }) => {
    return (
        <motion.div
            id={`node-${id}`}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`
                relative w-14 h-14 rounded-2xl flex flex-col items-center justify-center border-2 transition-all duration-500
                ${isActive ? 'bg-[#3B82F6]/20 border-[#3B82F6] shadow-[0_0_20px_#3B82F6]' :
                    isReturned ? 'bg-[#10B981]/10 border-[#10B981]/40 text-emerald-400' :
                        'bg-white/5 border-white/10 text-white/40'}
            `}
        >
            <div className="text-[10px] font-mono font-bold">
                {Object.values(node.params)[0]}
            </div>

            <AnimatePresence>
                {isReturned && (
                    <motion.div
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: -40, opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute bg-emerald-500 text-black px-2 py-0.5 rounded text-[10px] font-bold shadow-lg shadow-emerald-500/20"
                    >
                        {JSON.stringify(node.returnValue)}
                    </motion.div>
                )}
            </AnimatePresence>

            {isActive && (
                <motion.div
                    layoutId="active-ring"
                    className="absolute -inset-2 rounded-[22px] border border-[#3B82F6]/50 animate-pulse"
                />
            )}

            {/* Call Order Badge */}
            <div className="absolute -bottom-2 -right-2 w-5 h-5 rounded-full bg-black/80 border border-white/10 text-[8px] flex items-center justify-center text-white font-bold">
                {node.stepCreated}
            </div>
        </motion.div>
    );
};

export default DeterministicTree;
