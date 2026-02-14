import React, { useState, useEffect } from 'react'
import RecursionTreeVisualizer from '../../visualizers/RecursionTreeVisualizer'
import { Play, RotateCcw, Zap } from 'lucide-react'

interface Props {
    moduleId: string
}

const RecursionEngine: React.FC<Props> = ({ moduleId }) => {
    const [status, setStatus] = useState<'idle' | 'running' | 'finished'>('idle')
    const [step, setStep] = useState(0)

    // Animate the tree expansion
    useEffect(() => {
        let timeout: any
        if (status === 'running') {
            if (step < 7) {
                timeout = setTimeout(() => setStep(s => s + 1), 1000)
            } else {
                setStatus('finished')
            }
        }
        return () => clearTimeout(timeout)
    }, [status, step])

    const getStatus = (nodeStep: number) => {
        if (status === 'finished') return 'completed'
        if (status === 'idle') return 'pending'
        return step >= nodeStep ? (step === nodeStep ? 'active' : 'completed') : 'pending'
    }

    const modelData = {
        id: '1',
        value: 'f(4)',
        status: getStatus(1),
        children: [
            {
                id: '2',
                value: 'f(3)',
                status: getStatus(2),
                children: [
                    { id: '4', value: 'f(2)', status: getStatus(4) },
                    { id: '5', value: 'f(1)', status: getStatus(5) }
                ]
            },
            {
                id: '3',
                value: 'f(2)',
                status: getStatus(3),
                children: [
                    { id: '6', value: 'f(1)', status: getStatus(6) },
                    { id: '7', value: 'f(0)', status: getStatus(7) }
                ]
            }
        ]
    }

    const reset = () => {
        setStatus('idle')
        setStep(0)
    }

    return (
        <div className="w-full h-full flex flex-col">
            <div className="flex-1 flex items-center justify-center p-8 overflow-auto">
                <div className="min-w-[500px]">
                    <RecursionTreeVisualizer data={modelData as any} />
                </div>
            </div>

            <div className="h-24 bg-black/40 border-t border-white/5 px-8 flex items-center justify-between">
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
                        {status === 'idle' ? `Visualize the call tree for ${moduleId.replace('_', ' ')}.` :
                            status === 'running' ? `Expanding call stack (Step ${step}/7)...` : 'Recursive expansion complete.'}
                    </p>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-500">
                    <Zap size={14} />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Recursive Stack</span>
                </div>
            </div>
        </div>
    )
}

export default RecursionEngine
