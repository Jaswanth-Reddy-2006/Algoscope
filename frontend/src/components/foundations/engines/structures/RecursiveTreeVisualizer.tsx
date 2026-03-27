import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RecursionNode } from '../../../../types';

interface Props {
    nodes: Record<string, RecursionNode>;
    rootId: string;
    activeNodeId?: string;
}

const RecursiveTreeVisualizer: React.FC<Props> = ({ nodes, rootId, activeNodeId }) => {
    // Basic level-order layout calculation
    const getLayout = () => {
        const levels: string[][] = [];
        const queue: { id: string; depth: number }[] = [{ id: rootId, depth: 0 }];

        while (queue.length > 0) {
            const { id, depth } = queue.shift()!;
            if (!levels[depth]) levels[depth] = [];
            levels[depth].push(id);

            const node = nodes[id];
            if (node) {
                node.children.forEach(childId => {
                    queue.push({ id: childId, depth: depth + 1 });
                });
            }
        }
        return levels;
    };

    const levels = getLayout();

    const getPosition = (id: string) => {
        let nodeDepth = -1;
        let indexInLevel = -1;

        for (let d = 0; d < levels.length; d++) {
            const idx = levels[d].indexOf(id);
            if (idx !== -1) {
                nodeDepth = d;
                indexInLevel = idx;
                break;
            }
        }

        if (nodeDepth === -1) return { x: 0, y: 0 };

        const itemsInLevel = levels[nodeDepth].length;
        // Total horizontal width relative to the SVG viewport
        const x = (100 / (itemsInLevel + 1)) * (indexInLevel + 1);
        // Continuous vertical spacing
        const y = nodeDepth * 100 + 60;

        return { x, y };
    };

    return (
        <div className="relative w-full h-full flex flex-col items-center p-12 overflow-auto custom-scrollbar">
            <div className="relative w-full min-h-[500px] max-w-6xl">
                {/* Visual Connector Layer (SVG) */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
                    <defs>
                        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="3" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                        <linearGradient id="parentChildGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="rgba(236, 65, 134, 0.2)" />
                            <stop offset="100%" stopColor="#EC4186" />
                        </linearGradient>
                    </defs>
                    <AnimatePresence>
                        {Object.entries(nodes).map(([id, node]) => {
                            return node.children.map(childId => {
                                const parentPos = getPosition(id);
                                const childPos = getPosition(childId);
                                const childNode = nodes[childId];
                                const isPathActive = childNode?.status === 'active' || childNode?.status === 'returning';
                                
                                return (
                                    <g key={`${id}-${childId}`}>
                                        <motion.path
                                            initial={{ pathLength: 0, opacity: 0 }}
                                            animate={{ 
                                                pathLength: 1, 
                                                opacity: isPathActive ? 1 : 0.3,
                                                stroke: isPathActive ? '#EC4186' : 'rgba(255,255,255,0.05)' 
                                            }}
                                            transition={{ duration: 0.8, ease: "easeInOut" }}
                                            d={`M ${parentPos.x}% ${parentPos.y} C ${parentPos.x}% ${(parentPos.y + childPos.y) / 2}, ${childPos.x}% ${(parentPos.y + childPos.y) / 2}, ${childPos.x}% ${childPos.y}`}
                                            fill="none"
                                            strokeWidth={isPathActive ? 3 : 1.5}
                                            filter={isPathActive ? "url(#glow)" : ""}
                                            className="transition-all duration-700"
                                        />
                                    </g>
                                );
                            });
                        })}
                    </AnimatePresence>
                </svg>

                {/* Nodes Layer (Relative Positioning) */}
                {Object.entries(nodes).map(([id, node]) => {
                    const pos = getPosition(id);
                    const isActive = activeNodeId === id;
                    
                    return (
                        <motion.div
                            key={id}
                            initial={{ opacity: 0, scale: 0.5, y: pos.y - 40 }}
                            animate={{ 
                                opacity: 1, 
                                scale: isActive ? 1.15 : 1,
                                x: `calc(${pos.x}% - 45px)`,
                                y: pos.y - 45,
                                zIndex: isActive ? 50 : 10
                            }}
                            transition={{ type: "spring", damping: 20, stiffness: 200 }}
                            className={`
                                absolute w-[90px] h-[90px] rounded-[28px] border flex flex-col items-center justify-center p-3 
                                transition-all duration-700 backdrop-blur-3xl group/node
                                ${isActive ? 'bg-gradient-to-br from-[#EC4186]/40 to-[#EE544A]/20 border-[#EC4186] shadow-[0_0_40px_rgba(236,65,134,0.5)] border-t-[rgba(255,255,255,0.4)]' : 
                                  node.status === 'completed' ? 'bg-emerald-500/5 border-emerald-500/20 shadow-lg shadow-emerald-500/5' : 
                                  node.status === 'returning' ? 'bg-gradient-to-tr from-amber-500/10 to-orange-500/10 border-amber-500/30' :
                                  node.status === 'pruned' ? 'opacity-20 grayscale scale-95' :
                                  'bg-white/[0.03] border-white/10 hover:border-white/20'
                                }
                            `}
                        >
                            {/* Recursive Signal Ring (for Active) */}
                            {isActive && (
                                <motion.div 
                                    animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.1, 0.3] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className="absolute inset-0 rounded-[28px] bg-[#EC4186]/20 -z-10"
                                />
                            )}

                            {/* Inner Label */}
                            <span className={`text-[11px] font-black tracking-widest uppercase leading-none mb-1.5 transition-colors ${isActive ? 'text-white' : 'text-white/30 group-hover/node:text-white/60'}`}>
                                {node.label}
                            </span>
                            
                            {/* Recursive Return value overlay */}
                            {node.result !== undefined && (
                                <motion.div 
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className={`
                                        mt-1 px-3 py-1 rounded-xl text-[10px] font-black transition-all shadow-sm
                                        ${isActive ? 'bg-white text-[#EC4186]' : 'bg-[#EC4186]/20 text-[#EC4186] border border-[#EC4186]/20'}
                                    `}
                                >
                                    {JSON.stringify(node.result)}
                                </motion.div>
                            )}

                            {/* Logic Wave (Pulse for Active) */}
                            {isActive && (
                                <div className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center">
                                     <div className="absolute inset-0 rounded-full bg-[#EC4186] animate-ping opacity-75" />
                                     <div className="relative w-3 h-3 rounded-full bg-white shadow-glow" />
                                </div>
                            )}
                        </motion.div>
                    );
                })}
            </div>

            {/* Legend / Info */}
            <div className="mt-20 flex gap-8 items-center justify-center">
                 <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#EC4186]" />
                    <span className="text-[10px] text-white/40 uppercase font-black tracking-widest">Active Call</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-md border border-emerald-500/30" />
                    <span className="text-[10px] text-white/40 uppercase font-black tracking-widest">Leaf Reached</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-md bg-rose-500/5 border border-rose-500/10 grayscale" />
                    <span className="text-[10px] text-white/40 uppercase font-black tracking-widest">Pruned / Shorted</span>
                 </div>
            </div>
        </div>
    );
};

export default RecursiveTreeVisualizer;
