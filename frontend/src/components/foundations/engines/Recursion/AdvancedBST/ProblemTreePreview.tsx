import React from 'react';

interface ProblemTreePreviewProps {
    treeData: any;
    activeNodeVal: number | string | null;
}

const ProblemTreePreview: React.FC<ProblemTreePreviewProps> = ({ treeData, activeNodeVal }) => {
    // Recursive render helper
    const renderNode = (node: any, x: number, y: number, level: number) => {
        if (!node) return null;

        const offset = 60 / (level + 1);
        const isActive = String(activeNodeVal) === String(node.val);

        return (
            <g key={`prob-node-${node.val}`}>
                {/* Edges */}
                {node.left && (
                    <line x1={x} y1={y} x2={x - offset} y2={y + 40} stroke="rgba(236,65,134,0.1)" strokeWidth="1.5" />
                )}
                {node.right && (
                    <line x1={x} y1={y} x2={x + offset} y2={y + 40} stroke="rgba(236,65,134,0.1)" strokeWidth="1.5" />
                )}

                {/* Node Circles */}
                <circle
                    cx={x}
                    cy={y}
                    r="12"
                    fill={isActive ? '#EC4186' : '#1e293b'}
                    stroke={isActive ? '#EE544A' : 'rgba(255,255,255,0.1)'}
                    strokeWidth="1.5"
                    className="transition-all duration-300"
                />
                <text
                    x={x}
                    y={y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="white"
                    className="text-[8px] font-black pointer-events-none"
                >
                    {node.val}
                </text>

                {/* Subtrees */}
                {renderNode(node.left, x - offset, y + 40, level + 1)}
                {renderNode(node.right, x + offset, y + 40, level + 1)}
            </g>
        );
    };

    if (!treeData) return null;

    return (
        <div className="w-full flex flex-col items-center justify-center p-4 bg-black/20 rounded-2xl border border-white/5 overflow-hidden">
            <span className="text-[7px] font-black text-[#EC4186]/50 uppercase tracking-[0.2em] mb-4">Structure Preview</span>
            <svg viewBox="0 0 300 220" className="w-full h-auto max-w-[240px]">
                {renderNode(treeData, 150, 30, 0)}
            </svg>
        </div>
    );
};

export default ProblemTreePreview;
