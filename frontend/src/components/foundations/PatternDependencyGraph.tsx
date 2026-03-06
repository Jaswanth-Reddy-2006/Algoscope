import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Network, ArrowRight, Info, Zap } from 'lucide-react';
import { DependencyGraph, DependencyNode, DependencyEdge } from '../../types/foundation';

interface Props {
    graph: DependencyGraph;
    moduleId: string;
}

export const PatternDependencyGraph: React.FC<Props> = ({ graph, moduleId }) => {
    const [selectedNode, setSelectedNode] = useState<DependencyNode | null>(null);
    const [hoveredNode, setHoveredNode] = useState<string | null>(null);

    const { nodes, edges } = graph;

    // Simple layout calculation (radial/circular)
    const getPosition = (index: number, total: number, isRoot: boolean) => {
        if (isRoot) return { x: 50, y: 50 };

        const angle = (index / (total - 1)) * Math.PI * 1.5 - Math.PI * 0.75;
        const radius = 35;
        return {
            x: 50 + radius * Math.cos(angle),
            y: 50 + radius * Math.sin(angle)
        };
    };

    return (
        <div className="relative w-full aspect-video rounded-3xl bg-[#21092b] border border-white/10 overflow-hidden shadow-2xl flex flex-col">
            <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-[#EC4186]/20 text-[#EC4186]">
                        <Network size={20} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-white tracking-tight">Interactive Pattern Map</h3>
                        <p className="text-xs text-white/40 uppercase tracking-widest font-medium">Structure Evolution Flow</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] text-white/60 font-mono">
                    <Zap size={12} className="text-[#EE544A]" />
                    FORCE-DIRECTED LAYOUT ACTIVE
                </div>
            </div>

            <div className="flex-1 relative overflow-hidden bg-grid-white/[0.02]">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#14051e]/80 pointer-events-none" />

                <svg viewBox="0 0 100 100" className="w-full h-full p-12">
                    {/* Animated Edges */}
                    {edges.map((edge: DependencyEdge, idx: number) => {
                        const fromNode = nodes.find((n: DependencyNode) => n.id === edge.from);
                        const toNode = nodes.find((n: DependencyNode) => n.id === edge.to);
                        if (!fromNode || !toNode) return null;

                        const fromIdx = nodes.indexOf(fromNode);
                        const toIdx = nodes.indexOf(toNode);

                        const startPos = getPosition(fromIdx, nodes.length, fromNode.type === 'root');
                        const endPos = getPosition(toIdx, nodes.length, toNode.type === 'root');

                        const isHovered = hoveredNode === edge.from || hoveredNode === edge.to;

                        return (
                            <g key={`edge-${idx}`}>
                                <motion.line
                                    x1={startPos.x}
                                    y1={startPos.y}
                                    x2={endPos.x}
                                    y2={endPos.y}
                                    stroke={isHovered ? "rgba(236, 65, 134, 0.5)" : "rgba(255, 255, 255, 0.1)"}
                                    strokeWidth={0.5}
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    transition={{ duration: 1, delay: idx * 0.2 }}
                                />
                                {isHovered && (
                                    <motion.circle
                                        r={0.4}
                                        fill="#EE544A"
                                        initial={{ offsetDistance: "0%" }}
                                        animate={{ offsetDistance: "100%" }}
                                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                        style={{
                                            offsetPath: `path('M ${startPos.x} ${startPos.y} L ${endPos.x} ${endPos.y}')`
                                        }}
                                    />
                                )}
                                <text
                                    x={(startPos.x + endPos.x) / 2}
                                    y={(startPos.y + endPos.y) / 2 - 2}
                                    textAnchor="middle"
                                    fill="rgba(255,255,255,0.3)"
                                    fontSize="2"
                                    className="font-mono italic"
                                >
                                    {edge.label}
                                </text>
                            </g>
                        );
                    })}

                    {/* Nodes */}
                    {nodes.map((node: DependencyNode, idx: number) => {
                        const pos = getPosition(idx, nodes.length, node.type === 'root');
                        const isHovered = hoveredNode === node.id;

                        return (
                            <motion.g
                                key={node.id}
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ type: 'spring', damping: 12, delay: idx * 0.1 }}
                                onHoverStart={() => setHoveredNode(node.id)}
                                onHoverEnd={() => setHoveredNode(null)}
                                onClick={() => setSelectedNode(node)}
                                className="cursor-pointer"
                            >
                                {/* Outer Glow */}
                                <motion.circle
                                    cx={pos.x}
                                    cy={pos.y}
                                    r={node.type === 'root' ? 6 : 4.5}
                                    fill={node.type === 'root' ? "rgba(238, 84, 74, 0.2)" : "rgba(236, 65, 134, 0.2)"}
                                    animate={{
                                        scale: isHovered ? 1.2 : 1,
                                        opacity: isHovered ? 0.8 : 0.4
                                    }}
                                />

                                {/* Main Node */}
                                <circle
                                    cx={pos.x}
                                    cy={pos.y}
                                    r={node.type === 'root' ? 4 : 3}
                                    fill={node.type === 'root' ? "#EE544A" : "#14051e"}
                                    stroke={node.type === 'root' ? "none" : "#EC4186"}
                                    strokeWidth={0.5}
                                />

                                {/* Internal Icon/Label Pulse */}
                                {isHovered && (
                                    <circle
                                        cx={pos.x}
                                        cy={pos.y}
                                        r={node.type === 'root' ? 5 : 4}
                                        fill="none"
                                        stroke={node.type === 'root' ? "#EE544A" : "#EC4186"}
                                        strokeWidth={0.2}
                                        className="animate-ping"
                                    />
                                )}

                                <text
                                    x={pos.x}
                                    y={pos.y + (node.type === 'root' ? 8 : 6)}
                                    textAnchor="middle"
                                    fill={isHovered ? "white" : "rgba(255,255,255,0.6)"}
                                    fontSize={node.type === 'root' ? "3" : "2.5"}
                                    fontWeight={node.type === 'root' ? "bold" : "normal"}
                                    className="tracking-wider uppercase"
                                >
                                    {node.label}
                                </text>
                            </motion.g>
                        );
                    })}
                </svg>

                {/* Node Detail Popup */}
                <AnimatePresence>
                    {selectedNode && (
                        <motion.div
                            initial={{ opacity: 0, y: 20, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 20, scale: 0.9 }}
                            className="absolute bottom-6 left-6 right-6 p-6 rounded-2xl bg-white/[0.05] border border-[#EC4186]/20 backdrop-blur-2xl z-30 flex items-start justify-between shadow-[0_10px_40px_-10px_rgba(236,65,134,0.3)]"
                        >
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-widest ${selectedNode.type === 'root' ? 'bg-[#EE544A]/20 text-[#EE544A]' : 'bg-[#EC4186]/20 text-[#EC4186]'}`}>
                                        {selectedNode.type} node
                                    </span>
                                    <h4 className="text-xl font-bold text-white uppercase italic">{selectedNode.label}</h4>
                                </div>
                                <p className="text-sm text-white/60 max-w-xl">
                                    {selectedNode.type === 'root'
                                        ? `The foundational structure for the ${moduleId} module. Click on patterns to see how it transforms.`
                                        : `This pattern leverages the internal memory layout of ${moduleId} to achieve optimal time efficiency.`}
                                </p>
                                <button className="flex items-center gap-2 text-[#EC4186] text-xs font-bold uppercase tracking-widest hover:underline pt-2">
                                    Learn Pattern Strategy <ArrowRight size={14} />
                                </button>
                            </div>
                            <button
                                onClick={() => setSelectedNode(null)}
                                className="p-2 rounded-xl hover:bg-white/10 text-white/40 transition-colors"
                            >
                                CLOSE
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="p-4 bg-white/[0.02] border-t border-white/10 flex items-center gap-6 overflow-x-auto">
                <div className="flex items-center gap-2 text-[10px] text-white/40 whitespace-nowrap">
                    <Info size={12} />
                    <span>LEGEND:</span>
                </div>
                <div className="flex items-center gap-4 text-[10px] whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-[#EE544A]" />
                        <span className="text-white/60 uppercase">Foundational Unit</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full border border-[#EC4186]" />
                        <span className="text-white/60 uppercase">Derived Algorithmic Pattern</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-4 h-[1px] bg-white/20" />
                        <span className="text-white/60 uppercase">Functional dependency</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
