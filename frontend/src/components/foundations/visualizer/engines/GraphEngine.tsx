import React from 'react';
import { motion } from 'framer-motion';

interface Node {
    id: string;
    label: string;
    x: number;
    y: number;
}

interface Edge {
    source: string;
    target: string;
    weight?: number;
}

interface Props {
    nodes: Node[];
    edges: Edge[];
    activeNodeId?: string;
    highlightEdges?: Edge[];
    type?: 'directed' | 'undirected';
}

export const GraphEngine: React.FC<Props> = ({
    nodes,
    edges,
    activeNodeId,
    highlightEdges = [],
    type = 'undirected'
}) => {
    return (
        <div className="relative w-full h-[350px] flex items-center justify-center">
            <div className="relative w-full h-full max-w-2xl px-12">
                {/* Draw edges first */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
                    <defs>
                        <marker
                            id="arrowhead"
                            markerWidth="10"
                            markerHeight="7"
                            refX="15"
                            refY="3.5"
                            orient="auto"
                        >
                            <polygon points="0 0, 10 3.5, 0 7" fill="rgba(236, 65, 134,0.4)" />
                        </marker>
                    </defs>

                    {edges.map((edge, i) => {
                        const source = nodes.find(n => n.id === edge.source);
                        const target = nodes.find(n => n.id === edge.target);
                        if (!source || !target) return null;

                        const isHighlighted = highlightEdges.some(
                            e => (e.source === edge.source && e.target === edge.target) ||
                                (type === 'undirected' && e.source === edge.target && e.target === edge.source)
                        );

                        return (
                            <g key={`edge-${i}`}>
                                <motion.line
                                    initial={{ pathLength: 0, opacity: 0 }}
                                    animate={{ pathLength: 1, opacity: 1 }}
                                    x1={`${source.x}%`}
                                    y1={source.y}
                                    x2={`${target.x}%`}
                                    y2={target.y}
                                    stroke={isHighlighted ? '#EC4186' : '#EC4186'}
                                    strokeWidth={isHighlighted ? 3 : 2}
                                    strokeOpacity={isHighlighted ? 0.6 : 0.2}
                                    markerEnd={type === 'directed' ? "url(#arrowhead)" : ""}
                                />
                                {edge.weight !== undefined && (
                                    <text
                                        x={`${(source.x + target.x) / 2}%`}
                                        y={(source.y + target.y) / 2 - 10}
                                        textAnchor="middle"
                                        fill="white"
                                        fillOpacity="0.4"
                                        fontSize="10"
                                        className="font-mono font-bold"
                                    >
                                        {edge.weight}
                                    </text>
                                )}
                            </g>
                        );
                    })}
                </svg>

                {/* Draw Nodes */}
                {nodes.map((node) => {
                    const isActive = activeNodeId === node.id;

                    return (
                        <motion.div
                            key={node.id}
                            layout
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            style={{ left: `${node.x}%`, top: node.y }}
                            className={`
                absolute -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-2xl border-2 flex items-center justify-center font-bold font-mono transition-all duration-300
                ${isActive
                                    ? 'bg-accent-blue/20 border-accent-blue shadow-[0_0_20px_rgba(236, 65, 134,0.4)] scale-110 z-10 text-white'
                                    : 'bg-white/5 border-white/10 text-white/40'
                                }
              `}
                        >
                            {node.label}

                            {/* Pulse effect for active node */}
                            {isActive && (
                                <div className="absolute inset-0 rounded-2xl border-2 border-accent-blue animate-ping opacity-20" />
                            )}
                        </motion.div>
                    );
                })}
            </div>

            {/* Simulation Info */}
            <div className="absolute top-4 right-4 text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">
                Force-Directed Layout v1.0
            </div>
        </div>
    );
};
