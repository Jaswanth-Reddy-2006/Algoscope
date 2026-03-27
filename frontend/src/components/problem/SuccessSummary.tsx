import React from 'react'
import { motion } from 'framer-motion'
import { Trophy, Clock, Database, RotateCcw, ArrowRight, BookOpen, X, ChevronDown, ChevronUp } from 'lucide-react'
import { useNavigate, Link } from 'react-router-dom'
import { useStore } from '../../store/useStore'
import { Problem, Step } from '../../types'

interface SuccessSummaryProps {
    problem: Problem
    step: Step
    onReset: () => void
    onClose: () => void
}

const SimilarQuestionsDropdown: React.FC<{ currentProblem: Problem, onClose: () => void }> = ({ currentProblem, onClose }) => {
    const [isOpen, setIsOpen] = React.useState(false)
    const problems = useStore(state => state.problems)

    const similar = problems.filter(p => 
        p.id !== currentProblem.id && 
        (p.algorithmType === currentProblem.algorithmType || 
         p.tags.some(t => currentProblem.tags.includes(t)))
    ).slice(0, 5)

    if (similar.length === 0) return null

    return (
        <div className="w-full">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between py-3 px-5 bg-white/[0.03] border border-white/5 rounded-xl text-white/40 hover:text-white/80 hover:bg-white/5 transition-all text-[9px] font-black uppercase tracking-[0.2em]"
            >
                <span>Discover Similar Logic</span>
                {isOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            </button>
            {isOpen && (
                <div className="mt-2 bg-black/40 border border-white/5 rounded-2xl overflow-hidden backdrop-blur-xl">
                    {similar.map(p => (
                        <Link
                            key={p.slug}
                            to={`/problems/${p.slug}`}
                            onClick={onClose}
                            className="flex items-center justify-between p-4 hover:bg-white/5 border-b border-white/5 last:border-0 transition-colors group"
                        >
                            <span className="text-[10px] font-bold text-white/50 group-hover:text-[#EC4186] transition-colors line-clamp-1">{p.title}</span>
                            <span className="text-[8px] font-mono text-white/20 uppercase">{p.difficulty}</span>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    )
}

const SuccessSummary: React.FC<SuccessSummaryProps> = ({ problem, step, onReset, onClose }) => {
    const navigate = useNavigate()
    const isBruteForce = useStore(state => state.isBruteForce)

    if (!step || !step.state) return null
    const { state: stepState } = step

    const isFound = stepState.found || problem.algorithmType === 'tree' || !!stepState.finalAnswer

    return (
        <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            className={`w-full max-w-2xl glass-card border ${isFound ? 'border-[#EC4186]/20' : 'border-white/10'} p-8 relative overflow-y-auto max-h-[85vh] custom-scrollbar shadow-[0_20px_50px_rgba(0,0,0,0.5)] bg-[#1b062b]/95 backdrop-blur-xl rounded-3xl mx-auto`}
        >
            {/* Close Button */}
            <button
                onClick={onClose}
                className="absolute top-6 right-6 p-2 text-white/20 hover:text-white hover:bg-white/5 rounded-lg transition-all z-20"
            >
                <X size={20} />
            </button>

            {/* Background Glows */}
            <div className={`absolute -top-12 -right-12 w-32 h-32 ${isFound ? 'bg-accent-blue/10' : 'bg-white/5'} rounded-full blur-[60px]`} />

            <div className="text-center mb-8 relative z-10">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    className={`w-16 h-16 ${isFound ? 'bg-[#EC4186]/10 border-[#EC4186]/30 shadow-[0_0_30px_rgba(236,65,134,0.2)]' : 'bg-white/5 border-white/10'} rounded-2xl flex items-center justify-center mx-auto mb-6 border transition-all`}
                >
                    <Trophy className={`${isFound ? 'text-[#EC4186]' : 'text-white/20'} w-8 h-8`} />
                </motion.div>

                <h2 className="text-2xl font-bold tracking-tight mb-2 text-white">
                    {isFound ? "Analysis Completed" : "Search Completed"}
                </h2>
                <div className="h-1 w-24 bg-[#EC4186]/20 mx-auto rounded-full mt-4">
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: '100%' }}
                        className="h-full bg-[#EC4186]"
                    />
                </div>
            </div>

            <div className="space-y-4 mb-8 relative z-10">
                <div className={`p-5 bg-white/[0.03] border ${isFound ? 'border-[#EC4186]/10' : 'border-white/10'} rounded-[24px]`}>
                    <div className="flex items-center gap-2 mb-3">
                        <span className={`text-[9px] font-bold ${isFound ? 'text-[#EC4186]' : 'text-white/40'} uppercase tracking-[0.2em]`}>
                            {isFound ? "Final Simulation Output" : "Final State"}
                        </span>
                        <div className={`h-px flex-1 ${isFound ? 'bg-[#EC4186]/10' : 'bg-white/5'}`} />
                    </div>
                    <div className={`text-xl font-black font-mono tracking-tighter ${isFound ? 'text-white/90' : 'text-white/30'} mb-2`}>
                        {isFound 
                            ? (typeof stepState.finalAnswer === 'object' ? JSON.stringify(stepState.finalAnswer) : String(stepState.finalAnswer ?? 'Completed'))
                            : "No matching result found within these parameters."
                        }
                    </div>
                    {stepState.explanation && (
                        <p className="text-[10px] text-white/40 leading-relaxed italic font-light">
                            "{stepState.explanation}"
                        </p>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <KPICard
                        icon={Clock}
                        color="text-[#EE544A]"
                        label="Computational Depth"
                        value={isBruteForce ? (problem.efficiency?.brute?.time || "O(N²)") : (problem.efficiency?.optimal?.time || "O(N)")}
                    />
                    <KPICard
                        icon={Database}
                        color="text-[#EC4186]"
                        label="Memory Footprint"
                        value={isBruteForce ? (problem.efficiency?.brute?.space || "O(1)") : (problem.efficiency?.optimal?.space || "O(1)")}
                    />
                </div>
            </div>

            <div className="flex flex-col gap-3 relative z-10">
                <div className="grid grid-cols-2 gap-3">
                    <button
                        onClick={onReset}
                        className="flex items-center justify-center gap-2 py-4 px-4 bg-white/5 text-white/80 font-black text-[9px] uppercase tracking-widest rounded-2xl border border-white/5 hover:bg-white/10 hover:border-white/20 transition-all"
                    >
                        <RotateCcw size={12} />
                        <span>Re-simulate</span>
                    </button>
                    <button
                        onClick={() => {
                           useStore.getState().toggleApproach();
                           onReset();
                        }}
                        className="flex items-center justify-center gap-2 py-4 px-4 bg-[#EC4186]/10 text-[#EC4186] font-black text-[9px] uppercase tracking-widest rounded-2xl border border-[#EC4186]/20 hover:bg-[#EC4186]/20 transition-all"
                    >
                        <ArrowRight size={12} />
                        <span>Check {isBruteForce ? 'Optimal' : 'Brute Force'}</span>
                    </button>
                </div>

                <div className="relative">
                   <SimilarQuestionsDropdown currentProblem={problem} onClose={onClose} />
                </div>

                <button
                    onClick={() => navigate('/problems')}
                    className="flex items-center justify-center gap-3 py-4 px-6 bg-white/[0.02] text-white/40 font-black text-[9px] uppercase tracking-widest rounded-2xl border border-white/5 hover:text-white hover:bg-white/5 transition-all text-center"
                >
                    <BookOpen size={12} />
                    <span>Back to Patterns</span>
                </button>
            </div>
        </motion.div>
    )
}

const KPICard = ({ icon: Icon, color, label, value }: any) => (
    <div className="p-4 bg-white/[0.03] border border-white/5 rounded-xl flex flex-col gap-2">
        <div className={`w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center ${color}`}>
            <Icon size={14} />
        </div>
        <div>
            <div className="text-[8px] font-bold text-white/20 uppercase tracking-[0.1em] mb-1">{label}</div>
            <div className="text-xs font-bold font-mono text-white/70">{value}</div>
        </div>
    </div>
)
export default SuccessSummary
