import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Play, Filter, ChevronDown, X, Grid, List as ListIcon } from 'lucide-react'
import { Link, useSearchParams } from 'react-router-dom'
import { useStore } from '../store/useStore'
import { PATTERN_HIERARCHY } from '../data/patternHierarchy'

export default function ProblemList() {
    const {
        problems,
        isLoading,
        fetchAllProblems
    } = useStore()

    const [searchParams] = useSearchParams()
    const urlPattern = searchParams.get('pattern')

    const [searchQuery, setSearchQuery] = useState('')
    const [selectedTopics, setSelectedTopics] = useState<Set<string>>(new Set())
    const [selectedLevels, setSelectedLevels] = useState<Set<string>>(new Set())
    const [isFilterOpen, setIsFilterOpen] = useState(false)
    const [viewMode, setViewMode] = useState<'list' | 'pattern'>(urlPattern ? 'pattern' : 'list')

    useEffect(() => {
        fetchAllProblems()
    }, [fetchAllProblems])

    useEffect(() => {
        if (urlPattern) {
            setViewMode('pattern')
        }
    }, [urlPattern])

    const levels = ['Easy', 'Medium', 'Hard']

    // Available topics from hierarchy
    const availableTopics = useMemo(() => {
        const topics: { key: string; title: string }[] = []
        Object.values(PATTERN_HIERARCHY).forEach(group => {
            Object.entries(group.patterns).forEach(([key, pattern]) => {
                topics.push({ key, title: pattern.title })
            })
        })
        return topics
    }, [])

    // Pattern View: Group patterns from hierarchy with dynamic counts
    const allPatternGroups = useMemo(() =>
        Object.entries(PATTERN_HIERARCHY).flatMap(([_, levelGroup]) =>
            Object.entries(levelGroup.patterns).map(([patternKey, pattern]) => {
                // Dynamic count for this pattern: check primary, algorithmType, tags, and secondaryPatterns
                const count = problems.filter(p => {
                    const topicTitle = pattern.title.toLowerCase()
                    const prim = p.primaryPattern?.toLowerCase() || ''
                    const algo = (p.algorithmType as string)?.toLowerCase() || ''
                    const tags = p.tags.map(t => t.toLowerCase())
                    const secondary = (p.secondaryPatterns || []).map(s => s.toLowerCase())

                    return prim.includes(topicTitle) ||
                        algo.includes(topicTitle) ||
                        tags.some(tag => tag.includes(topicTitle)) ||
                        secondary.some(sec => sec.includes(topicTitle))
                }).length

                return {
                    key: patternKey,
                    title: pattern.title,
                    level: levelGroup.title,
                    count,
                    subPatterns: pattern.subPatterns || []
                }
            })
        ), [problems])

    const filteredProblems = useMemo(() => {
        return problems.filter(p => {
            const matchesSearch =
                p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.id.toString().includes(searchQuery) ||
                (p.primaryPattern && p.primaryPattern.toLowerCase().includes(searchQuery.toLowerCase())) ||
                p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))

            const matchesTopic = selectedTopics.size === 0 || Array.from(selectedTopics).some(topicId => {
                const topicTitle = availableTopics.find(t => t.key === topicId)?.title?.toLowerCase() || topicId.toLowerCase()
                const prim = p.primaryPattern?.toLowerCase() || ''
                const algo = (p.algorithmType as string)?.toLowerCase() || ''
                const tags = p.tags.map(t => t.toLowerCase())
                const secondary = (p.secondaryPatterns || []).map(s => s.toLowerCase())

                return prim.includes(topicTitle) ||
                    algo.includes(topicTitle) ||
                    tags.some(tag => tag.includes(topicTitle)) ||
                    secondary.some(sec => sec.includes(topicTitle)) ||
                    (topicId === 'two_pointers' && (prim.includes('pointer') || algo.includes('pointer'))) ||
                    (topicId === 'graph' && (prim.includes('graph') || algo.includes('graph') || tags.includes('graph')))
            })

            const matchesLevel = selectedLevels.size === 0 || selectedLevels.has(p.difficulty)

            return matchesSearch && matchesTopic && matchesLevel
        })
    }, [problems, searchQuery, selectedTopics, selectedLevels, availableTopics])

    const toggleTopic = (topicId: string) => {
        const newTopics = new Set(selectedTopics)
        if (newTopics.has(topicId)) newTopics.delete(topicId)
        else newTopics.add(topicId)
        setSelectedTopics(newTopics)
    }

    const toggleLevel = (level: string) => {
        const newLevels = new Set(selectedLevels)
        if (newLevels.has(level)) newLevels.delete(level)
        else newLevels.add(level)
        setSelectedLevels(newLevels)
    }

    const clearFilters = () => {
        setSelectedTopics(new Set())
        setSelectedLevels(new Set())
        setSearchQuery('')
    }

    if (isLoading) {
        return (
            <div className="flex-1 flex items-center justify-center bg-[#14051E]">
                <div className="flex flex-col items-center gap-6">
                    <div className="relative">
                        <div className="w-16 h-16 border-2 border-[#EC4186]/20 rounded-full" />
                        <div className="absolute inset-0 w-16 h-16 border-2 border-[#EC4186] border-t-transparent rounded-full animate-spin shadow-[0_0_15px_rgba(236,65,134,0.4)]" />
                    </div>
                    <span className="text-[10px] font-bold text-white/40 uppercase tracking-[0.5em] animate-pulse">Syncing Library System...</span>
                </div>
            </div>
        )
    }

    return (
        <div className="flex-1 flex flex-col bg-[#14051E] relative overflow-hidden font-outfit">
            {/* Ambient Background Elements */}
            <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-[#EC4186]/10 blur-[120px] rounded-full animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-[#EE544A]/10 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
                <div className="absolute top-[20%] right-[10%] w-[1px] h-[30%] bg-gradient-to-b from-transparent via-[#EC4186]/20 to-transparent rotate-12" />
                <div className="absolute bottom-[20%] left-[10%] w-[1px] h-[30%] bg-gradient-to-b from-transparent via-[#EE544A]/20 to-transparent -rotate-12" />
            </div>

            {/* Header Area */}
            <header className="relative z-10 px-10 pt-0 pb-6 backdrop-blur-md bg-[#14051E]/80 border-b border-white/5">
                <div className="flex justify-between items-end mb-8">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >

                        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-none">
                            Patterns <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#EC4186] to-[#EE544A]">Library</span>
                        </h1>
                        <p className="text-white/40 text-sm mt-3 font-medium tracking-wide">Decode the complex logic schemas of elite interview patterns.</p>
                    </motion.div>

                    <div className="flex items-center gap-5">
                        {/* Stats Summary */}
                        <div className="hidden lg:flex items-center gap-6 mr-6 border-r border-white/10 pr-6">
                            <div className="text-right">
                                <div className="text-white text-lg font-bold leading-none">{problems.length}</div>
                                <div className="text-white/30 text-[9px] uppercase tracking-widest mt-1">Modules</div>
                            </div>
                            <div className="text-right">
                                <div className="text-[#EC4186] text-lg font-bold leading-none">{availableTopics.length}</div>
                                <div className="text-white/30 text-[9px] uppercase tracking-widest mt-1">Schemas</div>
                            </div>
                        </div>

                        {/* View Toggle */}
                        <div className="bg-white/5 p-1 rounded-2xl flex border border-white/5 backdrop-blur-xl">
                            <button
                                onClick={() => setViewMode('list')}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 ${viewMode === 'list' ? 'bg-gradient-to-r from-[#EC4186] to-[#d63a78] text-white shadow-lg' : 'text-white/40 hover:text-white'}`}
                            >
                                <ListIcon size={14} />
                                List
                            </button>
                            <button
                                onClick={() => setViewMode('pattern')}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 ${viewMode === 'pattern' ? 'bg-gradient-to-r from-[#EE544A] to-[#d64a3a] text-white shadow-lg' : 'text-white/40 hover:text-white'}`}
                            >
                                <Grid size={14} />
                                Patterns
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex gap-5 relative z-20">
                    <div className="relative flex-1 group">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#EC4186] transition-colors" size={20} />
                        <input
                            type="text"
                            placeholder="Identify specific patterns or problems..."
                            className="w-full bg-white/5 border border-white/10 rounded-[24px] py-5 pl-14 pr-6 text-white placeholder:text-white/20 focus:outline-none focus:border-[#EC4186]/40 focus:bg-white/[0.08] transition-all duration-500 shadow-inner text-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                        className={`px-8 rounded-[24px] border flex items-center gap-3 font-bold transition-all duration-500 text-sm ${isFilterOpen ? 'bg-white/10 border-[#EC4186]/50 text-white shadow-[0_0_20px_rgba(236,65,134,0.1)]' : 'bg-white/5 border-white/10 text-white/60 hover:text-white hover:bg-white/8'}`}
                    >
                        <Filter size={18} className={isFilterOpen ? 'text-[#EC4186]' : ''} />
                        Logic Filter
                        {(selectedTopics.size > 0 || selectedLevels.size > 0) && (
                            <span className="w-5 h-5 rounded-full bg-[#EC4186] flex items-center justify-center text-[10px] text-white">
                                {selectedTopics.size + selectedLevels.size}
                            </span>
                        )}
                        <ChevronDown size={14} className={`transition-transform duration-500 ${isFilterOpen ? 'rotate-180' : ''}`} />
                    </button>
                </div>

                {/* Collapsible Filter Menu */}
                <AnimatePresence>
                    {isFilterOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0, y: -10 }}
                            animate={{ height: 'auto', opacity: 1, y: 0 }}
                            exit={{ height: 0, opacity: 0, y: -10 }}
                            className="overflow-hidden"
                        >
                            <div className="mt-5 p-8 bg-white/[0.03] border border-white/5 rounded-3xl grid grid-cols-1 md:grid-cols-2 gap-10 backdrop-blur-2xl">
                                {/* Levels */}
                                <div>
                                    <div className="flex items-center gap-2 mb-5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#EC4186]" />
                                        <h4 className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Bias</h4>
                                    </div>
                                    <div className="flex flex-wrap gap-3">
                                        {levels.map(l => (
                                            <button
                                                key={l}
                                                onClick={() => toggleLevel(l)}
                                                className={`px-5 py-2.5 rounded-2xl text-[11px] font-bold border transition-all duration-300 ${selectedLevels.has(l) ? 'bg-[#EC4186] border-[#EC4186] text-white shadow-[0_5px_15px_rgba(236,65,134,0.2)]' : 'bg-white/5 border-white/10 text-white/40 hover:text-white hover:bg-white/10'}`}
                                            >
                                                {l}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Topics */}
                                <div>
                                    <div className="flex justify-between items-center mb-5">
                                        <div className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-[#EE544A]" />
                                            <h4 className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Pattern Families</h4>
                                        </div>
                                        {(selectedTopics.size > 0 || selectedLevels.size > 0) && (
                                            <button
                                                onClick={clearFilters}
                                                className="text-[10px] font-black text-[#EE544A] hover:underline uppercase tracking-widest"
                                            >
                                                Clear Logic
                                            </button>
                                        )}
                                    </div>
                                    <div className="flex flex-wrap gap-2 pr-2 max-h-48 overflow-y-auto custom-scrollbar">
                                        {availableTopics.map(t => (
                                            <button
                                                key={t.key}
                                                onClick={() => toggleTopic(t.key)}
                                                className={`px-4 py-2 rounded-xl text-[11px] font-bold border transition-all duration-300 ${selectedTopics.has(t.key) ? 'bg-[#EE544A] border-[#EE544A] text-white shadow-[0_5px_15px_rgba(238,84,74,0.2)]' : 'bg-white/5 border-white/10 text-white/40 hover:text-white hover:bg-white/8'}`}
                                            >
                                                {t.title}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </header>

            {/* Scrollable Content */}
            <main className="flex-1 overflow-y-auto px-10 pb-16 custom-scrollbar relative z-10 pt-8">
                {viewMode === 'list' ? (
                    <motion.div
                        layout
                        className="space-y-4 max-w-6xl mx-auto"
                    >
                        {filteredProblems.map((problem, index) => {
                            const difficultyColor = problem.difficulty === 'Easy' ? '#00e699' : problem.difficulty === 'Medium' ? '#EC4186' : '#EE544A'
                            const primaryPattern = problem.primaryPattern || problem.algorithmType.replace(/_/g, ' ') || 'GENERAL'

                            return (
                                <motion.div
                                    key={problem.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.01 }}
                                    className="group relative"
                                >
                                    <Link to={`/problems/${problem.slug}`}>
                                        <div className="flex items-center justify-between p-6 bg-white/[0.02] border border-white/5 rounded-3xl hover:bg-white/[0.05] hover:border-[#EC4186]/40 transition-all duration-500 group overflow-hidden">
                                            {/* Hover Glow */}
                                            <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-[#EC4186] via-[#EE544A] to-[#EC4186] translate-y-full group-hover:translate-y-0 transition-transform duration-500 opacity-50" />

                                            {/* Name Section */}
                                            <div className="flex-1 min-w-0 pr-10">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <span className="text-[9px] font-bold text-white/20 font-mono">ID: {problem.id.toString().padStart(3, '0')}</span>
                                                    <div className="text-[9px] font-bold text-[#EC4186]/70 uppercase tracking-widest">{primaryPattern}</div>
                                                </div>
                                                <h3 className="text-xl font-bold text-white group-hover:text-[#EC4186] transition-colors truncate">
                                                    {problem.title}
                                                </h3>
                                                <div className="flex gap-4 mt-3">
                                                    {problem.tags.slice(0, 3).map(tag => (
                                                        <span key={tag} className="text-[10px] text-white/30 uppercase tracking-[0.1em] font-bold">
                                                            #{tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Status / Level */}
                                            <div className="flex items-center gap-10 shrink-0">
                                                <div className="flex flex-col items-end gap-1">
                                                    <span className="text-[8px] font-black text-white/20 uppercase tracking-[0.3em] mb-1">Status</span>
                                                    <span
                                                        className="text-[11px] font-black uppercase tracking-widest px-4 py-1.5 rounded-2xl"
                                                        style={{ color: difficultyColor, backgroundColor: `${difficultyColor}15`, border: `1px solid ${difficultyColor}40` }}
                                                    >
                                                        {problem.difficulty}
                                                    </span>
                                                </div>

                                                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-[#EC4186] group-hover:border-[#EC4186] group-hover:shadow-[0_0_25px_rgba(236,65,134,0.5)] transition-all duration-500">
                                                    <Play className="text-white fill-current translate-x-0.5 group-hover:scale-110 transition-transform" size={16} />
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            )
                        })}
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
                        {allPatternGroups.map((pattern, index) => (
                            <motion.div
                                key={pattern.key}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5, delay: index * 0.03 }}
                                whileHover={{ y: -8, scale: 1.02 }}
                                className="group bg-white/[0.02] border border-white/5 rounded-[40px] p-8 hover:bg-white/[0.06] hover:border-[#EC4186]/40 transition-all duration-500 cursor-pointer relative overflow-hidden"
                                onClick={() => {
                                    setSelectedTopics(new Set([pattern.key]))
                                    setViewMode('list')
                                }}
                            >
                                {/* Pattern specific accent glow */}
                                <div className="absolute -right-10 -top-10 w-32 h-32 bg-[#EC4186]/5 rounded-full blur-[60px] group-hover:bg-[#EC4186]/20 transition-all duration-700" />
                                <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-[#EE544A]/5 rounded-full blur-[60px] group-hover:bg-[#EE544A]/20 transition-all duration-700" />

                                <div className="relative z-10 h-full flex flex-col">
                                    <div className="flex justify-between items-start mb-8">
                                        <div className="w-16 h-16 rounded-[24px] bg-gradient-to-tr from-[#EC4186]/20 to-[#EE544A]/20 border border-white/10 flex items-center justify-center text-3xl group-hover:scale-110 group-hover:border-[#EC4186]/50 transition-all duration-500 shadow-xl backdrop-blur-md">
                                            {pattern.title.includes('Pointer') ? '👉' : pattern.title.includes('Window') ? '🗔' : pattern.title.includes('Binary') ? '🔍' : pattern.title.includes('Sort') ? '📊' : pattern.title.includes('Graph') ? '🕸️' : pattern.title.includes('Stack') ? '📚' : pattern.title.includes('Tree') ? '🌲' : '🧬'}
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mb-1">{pattern.level}</span>
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-3xl font-black text-white leading-none">{pattern.count}</span>
                                                <span className="text-[10px] text-white/30 uppercase font-black font-mono">LABS</span>
                                            </div>
                                        </div>
                                    </div>

                                    <h3 className="text-2xl font-black text-white mb-4 group-hover:text-[#EC4186] transition-colors leading-tight">{pattern.title}</h3>

                                    <div className="mt-auto pt-6 border-t border-white/5">
                                        <div className="flex flex-wrap gap-2">
                                            {pattern.subPatterns.slice(0, 4).map(sub => (
                                                <span key={sub} className="text-[9px] font-bold px-3 py-1.5 bg-white/5 border border-white/5 rounded-full text-white/50 group-hover:text-white/80 group-hover:border-[#EC4186]/30 transition-all uppercase tracking-tighter">
                                                    {sub}
                                                </span>
                                            ))}
                                            {pattern.subPatterns.length > 4 && (
                                                <span className="text-[10px] font-black text-[#EC4186] ml-1">+{pattern.subPatterns.length - 4}</span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mt-6 flex items-center gap-2 text-[10px] font-bold text-[#EC4186] opacity-0 group-hover:opacity-100 transition-opacity translate-x-[-10px] group-hover:translate-x-0 group-hover:transition-all">
                                        EXPLORE MODULE <ChevronDown size={14} className="-rotate-90" />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                {filteredProblems.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="py-32 text-center"
                    >
                        <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-8 text-white/10">
                            <X size={40} />
                        </div>
                        <h3 className="text-2xl font-black text-white mb-3">No Cognitive Signal Detected</h3>
                        <p className="text-white/40 text-lg max-w-md mx-auto mb-12">The logic you're searching for isn't in our current laboratory. Try adjusting the wavelength.</p>
                        <button
                            onClick={clearFilters}
                            className="bg-gradient-to-r from-[#EC4186] to-[#EE544A] text-white px-12 py-4 rounded-[20px] font-bold hover:shadow-[0_10px_30px_rgba(236,65,134,0.4)] transition-all uppercase tracking-widest text-sm"
                        >
                            Reset Logic System
                        </button>
                    </motion.div>
                )}
            </main>
        </div>
    )
}
