import { motion } from 'framer-motion'

interface Node {
    id: string
    x: number
    y: number
    label: string
    status: 'unvisited' | 'visiting' | 'visited' | 'target'
}

interface Edge {
    source: string
    target: string
    visited: boolean
}

interface GraphVisualizerProps {
    nodes: Node[]
    edges: Edge[]
}

const GraphVisualizer = ({ nodes, edges }: GraphVisualizerProps) => {
    return (
        <div className="w-full h-[400px] relative bg-black/20 rounded-xl border border-white/5 overflow-hidden">
            <svg className="w-full h-full absolute inset-0 pointer-events-none">
                {edges.map((edge, i) => {
                    const sourceNode = nodes.find(n => n.id === edge.source)
                    const targetNode = nodes.find(n => n.id === edge.target)
                    if (!sourceNode || !targetNode) return null

                    return (
                        <motion.line
                            key={i}
                            x1={sourceNode.x}
                            y1={sourceNode.y}
                            x2={targetNode.x}
                            y2={targetNode.y}
                            stroke={edge.visited ? "#10b981" : "rgba(255,255,255,0.2)"}
                            strokeWidth="2"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 0.5 }}
                        />
                    )
                })}
            </svg>

            {nodes.map((node) => (
                <motion.div
                    key={node.id}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    style={{
                        left: node.x,
                        top: node.y,
                        x: '-50%',
                        y: '-50%'
                    }}
                    className={`absolute w-10 h-10 rounded-full flex items-center justify-center border font-bold text-sm transition-colors
                        ${node.status === 'visiting' ? 'bg-blue-500/20 border-blue-500 text-blue-400 shadow-glow-blue' :
                            node.status === 'visited' ? 'bg-green-500/20 border-green-500 text-green-400' :
                                node.status === 'target' ? 'bg-amber-500/20 border-amber-500 text-amber-400' :
                                    'bg-black/40 border-white/20 text-white/40'}
                    `}
                >
                    {node.label}
                </motion.div>
            ))}
        </div>
    )
}

export default GraphVisualizer
