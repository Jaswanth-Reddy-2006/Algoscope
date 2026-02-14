import { motion } from 'framer-motion'

interface TreeNode {
    id: string
    value: string | number
    children?: TreeNode[]
    status?: 'pending' | 'active' | 'completed' | 'skipped'
}

interface RecursionTreeVisualizerProps {
    data: TreeNode
    animationSpeed?: number
}

const TreeNodeComponent = ({ node, depth = 0 }: { node: TreeNode, depth?: number }) => {
    return (
        <div className="flex flex-col items-center">
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{
                    scale: node.status === 'active' ? 1.2 : 1,
                    opacity: 1,
                    backgroundColor: node.status === 'active' ? 'rgba(59, 130, 246, 0.5)' :
                        node.status === 'completed' ? 'rgba(16, 185, 129, 0.5)' :
                            'rgba(255, 255, 255, 0.1)'
                }}
                className={`w-12 h-12 rounded-full flex items-center justify-center border border-white/10 text-white font-mono text-sm relative z-10
                    ${node.status === 'active' ? 'border-blue-500 shadow-glow-blue' : ''}
                    ${node.status === 'completed' ? 'border-green-500 shadow-glow-green' : ''}
                `}
            >
                {node.value}
            </motion.div>

            {node.children && node.children.length > 0 && (
                <div className="flex gap-8 mt-8 relative">
                    {/* Connecting lines would go here - simplified for CSS-only layout first */}
                    {/* SVG connections could be overlayed, but for now using simple flex layout */}
                    {node.children.map((child) => (
                        <div key={child.id} className="relative">
                            {/* Vertical Line */}
                            <div className="absolute top-[-32px] left-1/2 w-px h-8 bg-white/10 -translate-x-1/2" />
                            <TreeNodeComponent node={child} depth={depth + 1} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

const RecursionTreeVisualizer = ({ data }: RecursionTreeVisualizerProps) => {
    return (
        <div className="w-full h-[400px] overflow-auto custom-scrollbar flex items-start justify-center p-8 bg-black/20 rounded-xl border border-white/5">
            <TreeNodeComponent node={data} />
        </div>
    )
}

export default RecursionTreeVisualizer
