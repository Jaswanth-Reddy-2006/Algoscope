import { CheckCircle2, Lock, Zap } from 'lucide-react'
import { useStore } from '../../store/useStore'
import { useNavigate } from 'react-router-dom'
import foundationsData from '../../data/foundations.json'

const EvolutionTimeline = () => {
    const navigate = useNavigate()
    const patternStats = useStore(state => state.patternStats)

    // Define Canonical Paths
    const paths = [
        {
            id: 'sorting',
            title: 'Sorting Evolution',
            steps: ['selection_sort', 'insertion_sort', 'merge_sort', 'quick_sort', 'heap_sort', 'radix_sort']
        },
        {
            id: 'searching',
            title: 'Search Refinement',
            steps: ['linear_search', 'binary_search', 'lower_bound', 'search_on_answer']
        },
        {
            id: 'traversal',
            title: 'Graph Traversal',
            steps: ['recursion', 'dfs_recursive', 'bfs_standard', '01_bfs', 'multi_source_bfs']
        }
    ]

    const getModuleTitle = (id: string) => {
        for (const cat of Object.values(foundationsData as any)) {
            const mod = (cat as any).modules.find((m: any) => m.id === id)
            if (mod) return mod.title
        }
        return id
    }

    const isMastered = (id: string) => {
        return (patternStats[id]?.confidence || 0) >= 80
    }

    const isUnlocked = (_: string, index: number, steps: string[]) => {
        if (index === 0) return true
        return isMastered(steps[index - 1])
    }

    return (
        <div className="space-y-8 overflow-x-auto pb-4 custom-scrollbar">
            {paths.map((path, i) => (
                <div key={i} className="min-w-[800px]">
                    <div className="flex items-center gap-3 mb-4">
                        <Zap size={16} className="text-accent-purple" />
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider">{path.title}</h3>
                    </div>

                    <div className="flex items-center relative">
                        {/* Connecting Line */}
                        <div className="absolute top-1/2 left-0 w-full h-[2px] bg-white/5 -z-10" />

                        {path.steps.map((stepId, index) => {
                            const mastered = isMastered(stepId)
                            const unlocked = isUnlocked(stepId, index, path.steps)
                            const current = unlocked && !mastered
                            const title = getModuleTitle(stepId)

                            return (
                                <div key={stepId} className="flex items-center flex-1 last:flex-none">
                                    <div className="relative group">
                                        <button
                                            disabled={!unlocked}
                                            onClick={() => {
                                                // Navigate logic: we need to find category first
                                                let category = ''
                                                for (const [key, cat] of Object.entries(foundationsData)) {
                                                    if ((cat as any).modules.find((m: any) => m.id === stepId)) {
                                                        category = key
                                                        break
                                                    }
                                                }
                                                if (category) navigate(`/foundations/${category}/${stepId}`)
                                            }}
                                            className={`
                                                w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all cursor-pointer relative z-10
                                                ${mastered
                                                    ? 'bg-accent-blue border-accent-blue text-black shadow-[0_0_15px_rgba(0,176,250,0.5)]'
                                                    : current
                                                        ? 'bg-black border-white text-white shadow-[0_0_15px_rgba(255,255,255,0.3)] animate-pulse'
                                                        : 'bg-black border-white/10 text-white/20'
                                                }
                                            `}
                                        >
                                            {mastered ? <CheckCircle2 size={20} /> : unlocked ? <div className="w-3 h-3 bg-current rounded-full" /> : <Lock size={16} />}
                                        </button>

                                        {/* Label */}
                                        <div className="absolute top-14 left-1/2 -translate-x-1/2 text-center w-32">
                                            <div className={`text-xs font-bold mb-1 ${unlocked ? 'text-white' : 'text-white/30'}`}>{title}</div>
                                            {current && <div className="text-[10px] text-accent-blue uppercase tracking-wider animate-bounce">Next Goal</div>}
                                        </div>
                                    </div>

                                    {index < path.steps.length - 1 && (
                                        <div className={`flex-1 h-[2px] mx-2 transition-colors ${mastered ? 'bg-accent-blue/50' : 'bg-white/5'}`} />
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </div>
            ))}
        </div>
    )
}

export default EvolutionTimeline
