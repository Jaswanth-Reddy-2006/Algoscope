import React from 'react';
import { motion } from 'framer-motion';

interface TrieNode {
    id: string;
    char: string | null; // null for root
    isEndOfWord: boolean;
    children: { [char: string]: string };
}

interface Props {
    nodes: { [id: string]: TrieNode };
    rootId: string;
    activeNodeId?: string;
    highlightedWord?: string;
}

export const TrieEngine: React.FC<Props> = ({
    nodes,
    rootId,
    activeNodeId,
}) => {
    // Helper to get all nodes at each level for positioning
    const getLevels = () => {
        const levels: string[][] = [];
        const queue: { id: string; level: number }[] = [{ id: rootId, level: 0 }];

        while (queue.length > 0) {
            const { id, level } = queue.shift()!;
            if (!levels[level]) levels[level] = [];
            levels[level].push(id);

            const node = nodes[id];
            if (node) {
                Object.values(node.children).forEach(childId => {
                    queue.push({ id: childId, level: level + 1 });
                });
            }
        }
        return levels;
    };

    const levels = getLevels();

    const getPosition = (id: string) => {
        let nodeLevel = -1;
        let indexInLevel = -1;

        for (let l = 0; l < levels.length; l++) {
            const idx = levels[l].indexOf(id);
            if (idx !== -1) {
                nodeLevel = l;
                indexInLevel = idx;
                break;
            }
        }

        if (nodeLevel === -1) return { x: 0, y: 0 };

        const itemsInLevel = levels[nodeLevel].length;
        const xBase = 100 / (itemsInLevel + 1);
        const x = xBase * (indexInLevel + 1);
        const y = nodeLevel * 80 + 40;

        return { x, y };
    };

    return (
        <div className="relative w-full h-[350px] flex items-center justify-center p-8">
            <div className="relative w-full h-full max-w-4xl">
                {/* Edges */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
                    {Object.entries(nodes).map(([id, node]) => {
                        const parentPos = getPosition(id);
                        return Object.entries(node.children).map(([char, childId]) => {
                            const childPos = getPosition(childId);
                            return (
                                <g key={`${id}-${childId}`}>
                                    <line
                                        x1={`${parentPos.x}%`}
                                        y1={parentPos.y}
                                        x2={`${childPos.x}%`}
                                        y2={childPos.y}
                                        stroke="white"
                                        strokeWidth="1.5"
                                        strokeOpacity="0.1"
                                    />
                                    {/* Character Label on Edge */}
                                    <text
                                        x={`${(parentPos.x + childPos.x) / 2}%`}
                                        y={(parentPos.y + childPos.y) / 2 - 5}
                                        textAnchor="middle"
                                        fill="rgba(236, 65, 134,0.6)"
                                        fontSize="10"
                                        fontWeight="bold"
                                        className="font-mono"
                                    >
                                        {char}
                                    </text>
                                </g>
                            );
                        });
                    })}
                </svg>

                {/* Nodes */}
                {Object.entries(nodes).map(([id, node]) => {
                    const pos = getPosition(id);
                    const isActive = activeNodeId === id;

                    return (
                        <motion.div
                            key={id}
                            layout
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            style={{ left: `${pos.x}%`, top: pos.y }}
                            className={`
                absolute -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-xl border flex items-center justify-center font-bold font-mono transition-all duration-300
                ${isActive
                                    ? 'bg-accent-blue/20 border-accent-blue shadow-[0_0_15px_rgba(236, 65, 134,0.4)] scale-110 z-10 text-white'
                                    : node.isEndOfWord
                                        ? 'bg-green-500/10 border-green-500/40 text-green-400'
                                        : 'bg-white/5 border-white/10 text-white/40'
                                }
              `}
                        >
                            {node.char || '•'}

                            {node.isEndOfWord && (
                                <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.5)]" />
                            )}
                        </motion.div>
                    );
                })}
            </div>

            {/* Trie Legend */}
            <div className="absolute bottom-4 right-4 flex flex-col items-end gap-2 text-[10px] uppercase font-bold tracking-widest text-white/20">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    Word Complete
                </div>
            </div>
        </div>
    );
};
