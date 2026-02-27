import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTimeline } from '../TimelineController';

interface DualTreeProps {
    is3DMode: boolean;
    treeData: any;
}

// Render the actual static binary tree (Problem Tree)
// ExecutionTree component renders the dynamic trace...

const ExecutionTree: React.FC<{ frames: any[] }> = ({ frames }) => {
    const { state } = useTimeline();
    // Build a tree from flat frames
    const frameTree = useMemo(() => {
        const map: Record<string, any> = {};
        const roots: any[] = [];

        frames.forEach(f => {
            map[f.id] = { ...f, children: [] };
        });

        frames.forEach(f => {
            if (f.parentId && map[f.parentId]) {
                map[f.parentId].children.push(map[f.id]);
            } else if (!f.parentId) {
                roots.push(map[f.id]);
            }
        });

        return roots;
    }, [frames]);

    const maxDepth = useMemo(() => {
        const getDepth = (node: any): number => {
            if (!node.children || node.children.length === 0) return 0;
            return 1 + Math.max(...node.children.map(getDepth));
        };
        return frameTree.length > 0 ? getDepth(frameTree[0]) : 0;
    }, [frameTree]);

    const renderExecutionNode = (node: any, x: number, y: number, level: number) => {
        const { currentStepIndex, steps } = state;
        const currentStep = steps[currentStepIndex];
        const activeFrameId = currentStep?.activeFrameId;

        // Dynamic State Calculation
        const isCreated = currentStepIndex >= node.stepCreated;
        const isReturned = node.stepReturned !== undefined && currentStepIndex >= node.stepReturned;
        const isActive = isCreated && !isReturned && activeFrameId === node.id;
        const isWaiting = isCreated && !isReturned && activeFrameId !== node.id;

        if (!isCreated) return null;

        // Adaptive horizontal spacing: 2^(maxDepth - level) * base_width
        const spacingMultiplier = Math.pow(1.8, maxDepth - level);
        const horizontalGap = 45 * spacingMultiplier;

        return (
            <g key={`exec-node-${node.id}`}>
                {/* Edges to children */}
                {node.children.map((child: any, idx: number) => {
                    const childX = x - (node.children.length - 1) * horizontalGap / 2 + idx * horizontalGap;
                    return (
                        <React.Fragment key={`frag-${node.id}-${child.id}`}>
                            <line
                                x1={x} y1={y + 20} x2={childX} y2={y + 100}
                                stroke={child.state !== 'created' ? 'rgba(236, 65, 134, 0.4)' : 'rgba(255,255,255,0.05)'}
                                strokeWidth="1.5"
                                className="transition-all duration-700"
                            />
                            {renderExecutionNode(child, childX, y + 100, level + 1)}
                        </React.Fragment>
                    );
                })}

                {/* Node Card */}
                <foreignObject x={x - 45} y={y - 20} width="90" height="45">
                    <motion.div
                        layoutId={node.id}
                        initial={false}
                        className={`
                            w-full h-full rounded-2xl border flex flex-col items-center justify-center p-2 backdrop-blur-xl transition-all duration-500
                            ${isActive ? 'bg-[#EC4186] border-[#EE544A] shadow-[0_0_40px_rgba(236,65,134,0.6)] scale-110 z-50 text-white' :
                                isWaiting ? 'bg-amber-500/10 border-amber-500/30 text-amber-500' :
                                    node.state === 'returned' ? 'bg-emerald-500/5 border-emerald-500/20 opacity-60 text-emerald-400' :
                                        'bg-white/5 border-white/5 opacity-20 text-white'}
                        `}
                    >
                        <span className="text-[9px] font-black uppercase tracking-widest">{node.params.val}</span>
                        {node.state === 'returned' && (
                            <span className={`text-[7px] font-mono mt-1 ${isActive ? 'text-white' : 'text-emerald-400/80'}`}>
                                ret: {node.returnValue !== undefined ? node.returnValue : 'void'}
                            </span>
                        )}
                        {isActive && (
                            <motion.div
                                className="absolute -inset-1 rounded-2xl border-2 border-white/40"
                                animate={{ opacity: [0.2, 0.5, 0.2], scale: [1, 1.05, 1] }}
                                transition={{ repeat: Infinity, duration: 1.5 }}
                            />
                        )}
                    </motion.div>
                </foreignObject>
            </g>
        );
    };

    return (
        <div className="flex-1 overflow-auto p-12 border-l border-white/5 relative flex justify-center bg-black/40 backdrop-blur-3xl custom-scrollbar">
            <h3 className="absolute top-8 left-8 text-[10px] font-black text-[#EC4186] uppercase tracking-[0.3em] opacity-50">Recursive logic Trace</h3>
            <svg viewBox="0 0 1000 800" className="w-full h-auto min-w-[800px] py-12">
                {frameTree.map((root, idx) => (
                    <g key={`root-${idx}`}>
                        {renderExecutionNode(root, 500, 40, 0)}
                    </g>
                ))}
            </svg>
        </div>
    );
};

const DualTreeVisualizer: React.FC<DualTreeProps> = ({ is3DMode }) => {
    const { state } = useTimeline();

    // Convert frames map to array for rendering
    const framesArray = useMemo(() => {
        if (!state.frames) return [];
        return Object.values(state.frames).sort((a: any, b: any) => a.stepCreated - b.stepCreated);
    }, [state.frames]);

    return (
        <div
            className="flex-1 rounded-[40px] overflow-hidden flex transition-all duration-700 perspective-[1000px] h-full"
            style={{
                transformStyle: 'preserve-3d',
                transform: is3DMode ? 'rotateX(15deg) rotateY(-5deg) scale(0.95)' : 'none'
            }}
        >
            <ExecutionTree frames={framesArray} />
        </div>
    );
};

export default DualTreeVisualizer;
