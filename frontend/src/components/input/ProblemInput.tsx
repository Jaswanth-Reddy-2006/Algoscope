import React from 'react'
import { useStore } from '../../store/useStore'
import { Play } from 'lucide-react'

const ProblemInput: React.FC = () => {
    const { customInput, customTarget, setCustomInput, setCustomTarget, refreshSteps } = useStore()

    return (
        <div className="flex flex-col gap-4 p-4 bg-white/5 rounded-lg border border-white/10">
            <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Input Array</label>
                <input
                    type="text"
                    value={customInput}
                    onChange={(e) => setCustomInput(e.target.value)}
                    className="bg-black/40 border border-white/10 rounded px-3 py-2 text-sm font-mono focus:border-accent-blue outline-none transition-colors"
                    placeholder="[2, 7, 11, 15]"
                />
            </div>
            <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Target</label>
                <input
                    type="text"
                    value={customTarget}
                    onChange={(e) => setCustomTarget(e.target.value)}
                    className="bg-black/40 border border-white/10 rounded px-3 py-2 text-sm font-mono focus:border-accent-blue outline-none transition-colors"
                    placeholder="9"
                />
            </div>
            <button
                onClick={refreshSteps}
                className="mt-2 flex items-center justify-center gap-2 bg-accent-blue hover:bg-accent-blue/80 text-black font-bold py-2 rounded transition-all active:scale-95"
            >
                <Play size={16} fill="black" />
                <span className="text-xs uppercase tracking-wider">Run Visualization</span>
            </button>
        </div>
    )
}

export default ProblemInput
