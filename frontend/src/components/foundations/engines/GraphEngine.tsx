import React, { useState, useEffect } from 'react'
import GraphVisualizer from '../../visualizers/GraphVisualizer'
import { Play, RotateCcw, Zap } from 'lucide-react'

interface Props {
    moduleId: string
}

const GraphEngine: React.FC<Props> = ({ moduleId }) => {
    const [status, setStatus] = useState<'idle' | 'running' | 'finished'>('idle')
    const [step, setStep] = useState(0)

    useEffect(() => {
        let timeout: any
        if (status === 'running') {
            if (step < 5) {
                timeout = setTimeout(() => setStep(s => s + 1), 1000)
            } else {
                setStatus('finished')
            }
        }
        return () => clearTimeout(timeout)
    }, [status, step])

    const getNodeStatus = (nodeId: string) => {
        if (status === 'idle') return 'unvisited'
        if (status === 'finished') return 'visited'

        const nodeOrder = ['1', '2', '3', '4', '5']
        const currentIdx = nodeOrder.indexOf(nodeId)
        if (step > currentIdx + 1) return 'visited'
        if (step === currentIdx + 1) return 'visiting'
        return 'unvisited'
    }

    const isEdgeVisited = (source: string, target: string) => {
        if (status === 'idle') return false
        if (status === 'finished') return true

        const edgeSteps: { [key: string]: number } = {
            '1-2': 2, '1-3': 3, '2-4': 4, '3-5': 5, '4-5': 6
        }
        const key = `${source}-${target}`
        return step >= (edgeSteps[key] || 99)
    }

    const nodes = [
        { id: '1', x: 200, y: 100, label: '1', status: getNodeStatus('1') },
        { id: '2', x: 100, y: 200, label: '2', status: getNodeStatus('2') },
        { id: '3', x: 300, y: 200, label: '3', status: getNodeStatus('3') },
        { id: '4', x: 100, y: 350, label: '4', status: getNodeStatus('4') },
        { id: '5', x: 300, y: 350, label: '5', status: getNodeStatus('5') }
    ]

    const edges = [
        { source: '1', target: '2', visited: isEdgeVisited('1', '2') },
        { source: '1', target: '3', visited: isEdgeVisited('1', '3') },
        { source: '2', target: '4', visited: isEdgeVisited('2', '4') },
        { source: '3', target: '5', visited: isEdgeVisited('3', '5') }
    ]

    const reset = () => {
        setStatus('idle')
        setStep(0)
    }

    return (
        <div className="w-full h-full flex flex-col">
            <div className="flex-1 flex items-center justify-center p-8 overflow-hidden bg-black/20 rounded-2xl m-8 border border-white/5">
                <GraphVisualizer nodes={nodes as any} edges={edges as any} />
            </div>

            <div className="h-24 bg-black/40 border-t border-white/5 px-8 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setStatus('running')}
                        className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform"
                    >
                        <Play size={20} className="ml-1" />
                    </button>
                    <button onClick={reset} className="w-10 h-10 rounded-full bg-white/5 text-white/60 flex items-center justify-center hover:bg-white/10 transition-colors">
                        <RotateCcw size={18} />
                    </button>
                </div>
                <div className="flex-1 px-12 text-center">
                    <p className="text-sm text-white/80 font-light italic">
                        {status === 'idle' ? `Visualize ${moduleId.replace(/_/g, ' ').toUpperCase()} on a sample graph.` :
                            status === 'running' ? `Traversing nodes (Step ${step}/5)...` : 'Traversal complete.'}
                    </p>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-500">
                    <Zap size={14} />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Graph Engine</span>
                </div>
            </div>
        </div>
    )
}

export default GraphEngine
