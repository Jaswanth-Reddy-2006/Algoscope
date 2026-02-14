import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useParams, useNavigate } from 'react-router-dom'
import {
    BookOpen,
    Database,
    Layers,
    Zap,
    ChevronRight,
    ArrowLeft
} from 'lucide-react'
import { useStore } from '../store/useStore'
import foundationsData from '../data/foundations.json'
import { FoundationCategory } from '../types/foundation'
import CategoryView from '../components/foundations/CategoryView'

const ICON_MAP: Record<string, any> = {
    Database,
    Layers,
    Zap
}

const FoundationsLayout = () => {
    const { category: categoryId } = useParams<{ category: string }>()
    const navigate = useNavigate()
    const patternStats = useStore(state => state.patternStats)
    const [selectedCategory, setSelectedCategory] = useState<FoundationCategory | null>(null)

    const categories = foundationsData as unknown as FoundationCategory[]

    // Sync state with URL
    useEffect(() => {
        if (categoryId) {
            const found = categories.find(c => c.id === categoryId)
            if (found) {
                setSelectedCategory(found)
            } else {
                setSelectedCategory(null)
                navigate('/foundations')
            }
        } else {
            setSelectedCategory(null)
        }
    }, [categoryId, categories, navigate])

    const getCategoryStats = (category: FoundationCategory) => {
        const total = category.modules.length
        const completed = category.modules.filter(m => (patternStats[m.id]?.confidence || 0) >= 80).length
        return { total, completed, accuracy: total > 0 ? Math.round((completed / total) * 100) : 0, percentage: total > 0 ? (completed / total) * 100 : 0 }
    }

    return (
        <div className="flex-1 flex flex-col min-w-0 bg-background font-outfit overflow-hidden">
            {/* Minimal Header */}
            <div className="h-20 px-8 flex items-center justify-between border-b border-white/5 bg-background/50 backdrop-blur-md z-10 shrink-0">
                <div className="flex items-center gap-4">
                    {selectedCategory && (
                        <button
                            onClick={() => navigate('/foundations')}
                            className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                        >
                            <ArrowLeft size={18} className="text-white/60" />
                        </button>
                    )}
                    <div className="w-10 h-10 rounded-2xl bg-accent-blue/10 flex items-center justify-center border border-accent-blue/20 shadow-glow-blue">
                        <BookOpen size={20} className="text-accent-blue" />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold tracking-widest text-white uppercase">
                            {selectedCategory ? selectedCategory.title : 'Algorithm Academy'}
                        </h1>
                        <p className="text-[10px] text-white/40 uppercase tracking-wider font-mono">
                            {selectedCategory ? 'Department View' : 'Foundations Home'}
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
                <div className="max-w-7xl mx-auto h-full">
                    <AnimatePresence mode="wait">
                        {!selectedCategory ? (
                            <motion.div
                                key="home"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="h-full flex flex-col justify-center"
                            >
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-auto lg:h-[600px] content-center">
                                    {categories.map((cat, idx) => {
                                        const Icon = ICON_MAP[cat.icon] || Layers
                                        const stats = getCategoryStats(cat)

                                        return (
                                            <motion.div
                                                key={cat.id}
                                                initial={{ opacity: 0, y: 30 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: idx * 0.1 }}
                                                onClick={() => navigate(`/foundations/${cat.id}`)}
                                                className="group cursor-pointer h-full"
                                            >
                                                <div className="relative h-full p-8 rounded-[32px] border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-500 flex flex-col items-start text-left overflow-hidden hover:shadow-2xl hover:shadow-accent-blue/5 hover:border-white/10">

                                                    {/* Card Header & Icon */}
                                                    <div className="w-full flex justify-between items-start mb-12">
                                                        <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-accent-blue/10 group-hover:scale-110 transition-all duration-500">
                                                            <Icon size={32} className="text-white/40 group-hover:text-accent-blue transition-colors" />
                                                        </div>
                                                        <div className="flex flex-col items-end">
                                                            <span className="text-4xl font-bold text-white/10 font-mono group-hover:text-white/20 transition-colors">0{idx + 1}</span>
                                                        </div>
                                                    </div>

                                                    {/* Title & Desc */}
                                                    <h3 className="text-3xl font-bold text-white mb-4 group-hover:text-accent-blue transition-colors tracking-tight">{cat.title}</h3>
                                                    <p className="text-white/40 text-base font-light mb-12 leading-relaxed flex-grow">
                                                        {cat.description}
                                                    </p>

                                                    {/* Metrics Grid */}
                                                    <div className="w-full grid grid-cols-2 gap-4 mb-8">
                                                        <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                                                            <span className="block text-2xl font-bold text-white mb-1">{stats.total}</span>
                                                            <span className="text-[10px] uppercase tracking-widest text-white/30">Modules</span>
                                                        </div>
                                                        <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                                                            <span className="block text-2xl font-bold text-white mb-1">{stats.completed}%</span>
                                                            <span className="text-[10px] uppercase tracking-widest text-white/30">Run Rate</span>
                                                        </div>
                                                    </div>

                                                    {/* Progress Bar */}
                                                    <div className="w-full space-y-2 mb-8">
                                                        <div className="flex justify-between items-end">
                                                            <span className="text-[10px] font-bold uppercase tracking-widest text-white/20">Course Progress</span>
                                                        </div>
                                                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                                            <div
                                                                className="h-full bg-accent-blue shadow-glow-blue transition-all duration-1000"
                                                                style={{ width: `${stats.percentage}%` }}
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* CTA */}
                                                    <div className="w-full pt-6 border-t border-white/5 flex items-center justify-between text-white/20 group-hover:text-white/40 transition-colors">
                                                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] group-hover:text-accent-blue transition-colors">Initialize</span>
                                                        <ChevronRight size={18} className="group-hover:translate-x-2 transition-transform duration-500 group-hover:text-accent-blue" />
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )
                                    })}
                                </div>
                            </motion.div>
                        ) : (
                            <CategoryView category={selectedCategory} />
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    )
}

export default FoundationsLayout
