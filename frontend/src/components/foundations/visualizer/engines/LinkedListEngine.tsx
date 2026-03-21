import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface Node {
    id: string;
    value: string | number;
    next: string | null;
}

interface Props {
    nodes: Node[];
    headId: string | null;
    activeNodeId?: string | null;
    highlightNodeIds?: string[];
}

export const LinkedListEngine: React.FC<Props> = ({
    nodes,
    headId,
    activeNodeId,
    highlightNodeIds = []
}) => {
    // Sort or organize nodes based on headId for linear representation
    const orderedNodes: Node[] = [];
    let currentId = headId;
    const visited = new Set<string>();

    while (currentId && !visited.has(currentId)) {
        const node = nodes.find(n => n.id === currentId);
        if (node) {
            orderedNodes.push(node);
            visited.add(currentId);
            currentId = node.next;
        } else {
            break;
        }
    }

    return (
        <div className="flex flex-wrap items-center justify-center gap-y-12 gap-x-0 p-8 w-full">
            {orderedNodes.map((node, idx) => {
                const isActive = activeNodeId === node.id;
                const isHighlighted = highlightNodeIds.includes(node.id);
                const isLast = idx === orderedNodes.length - 1;

                return (
                    <React.Fragment key={node.id}>
                        <motion.div
                            layout
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className={`
                relative flex items-center
                ${isActive ? 'z-20' : 'z-10'}
              `}
                        >
                            {/* Node Visualization */}
                            <div
                                className={`
                  w-32 h-16 rounded-xl border-2 flex overflow-hidden transition-all duration-300
                  ${isActive
                                        ? 'bg-accent-blue/20 border-accent-blue shadow-[0_0_20px_rgba(236, 65, 134,0.4)] scale-110'
                                        : isHighlighted
                                            ? 'bg-purple-500/20 border-purple-500 shadow-[0_0_15px_rgba(236, 65, 134,0.3)]'
                                            : 'bg-white/5 border-white/10'
                                    }
                `}
                            >
                                {/* Data Part */}
                                <div className="flex-1 flex items-center justify-center border-r border-white/10 font-bold text-lg italic">
                                    {node.value}
                                </div>
                                {/* Pointer Part */}
                                <div className="w-8 bg-white/5 flex items-center justify-center">
                                    <div className={`w-2 h-2 rounded-full ${node.next ? 'bg-accent-blue shadow-[0_0_5px_#EC4186]' : 'bg-red-500/50'}`} />
                                </div>
                            </div>

                            {/* Labels */}
                            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-mono font-bold text-white/20">
                                ADDR: 0x{node.id.slice(0, 4).toUpperCase()}
                            </div>

                            {idx === 0 && (
                                <div className="absolute -top-6 left-2 text-[10px] font-bold text-accent-blue uppercase tracking-widest">
                                    Head
                                </div>
                            )}

                            {/* Active Marker */}
                            {isActive && (
                                <motion.div
                                    layoutId="ll-pointer"
                                    className="absolute -top-8 left-1/2 -translate-x-1/2 text-accent-blue"
                                >
                                    <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-accent-blue" />
                                </motion.div>
                            )}
                        </motion.div>

                        {/* Pointer Line */}
                        {!isLast && (
                            <motion.div
                                initial={{ width: 0, opacity: 0 }}
                                animate={{ width: 40, opacity: 1 }}
                                className="flex items-center justify-center text-accent-blue/40"
                            >
                                <ArrowRight size={24} />
                            </motion.div>
                        )}

                        {isLast && (
                            <div className="w-10 h-16 flex items-center justify-center">
                                <div className="w-6 h-[2px] bg-red-500/20 rotate-45 relative">
                                    <div className="absolute inset-0 bg-red-500/20 -rotate-90" />
                                </div>
                                <span className="ml-2 text-[10px] font-bold text-red-500/40 uppercase">NULL</span>
                            </div>
                        )}
                    </React.Fragment>
                );
            })}

            {orderedNodes.length === 0 && (
                <div className="text-white/20 italic">Empty Linked List</div>
            )}
        </div>
    );
};
