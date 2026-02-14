import React, { useState, useRef, useEffect } from 'react'
import { Search, SlidersHorizontal, ArrowUpDown, ChevronDown, Check } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSearchParams } from 'react-router-dom'
import { useStore } from '../store/useStore'
import { getPatternInfo } from '../data/patternHierarchy'
import ProblemCard from '../components/problem/ProblemCard'

// --- Custom Filter Dropdown ---
interface FilterOption {
    label: string
    value: string
}

interface FilterDropdownProps {
    value: string
    options: FilterOption[]
    onChange: (val: string) => void
    icon: React.ElementType
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({ value, options, onChange, icon: Icon }) => {
    const [isOpen, setIsOpen] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)

    // Click outside handler
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const selectedLabel = options.find(o => o.value === value)?.label || value

    return (
        <div className="relative" ref={containerRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-2 px-4 h-12 rounded-xl border transition-all ${isOpen ? 'bg-white/10 border-white/20' : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }`}
            >
                <Icon size={16} className="text-white/40" />
                <span className="text-xs font-bold uppercase tracking-widest text-white/80 min-w-[60px] text-left">
                    {selectedLabel}
                </span>
                <ChevronDown size={14} className={`text-white/40 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        transition={{ duration: 0.1 }}
                        className="absolute top-full left-0 mt-2 w-48 bg-[#0a0a0a] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden backdrop-blur-xl"
                    >
                        <div className="max-h-60 overflow-y-auto custom-scrollbar py-1">
                            {options.map((option) => (
                                <button
                                    key={option.value}
                                    onClick={() => {
                                        onChange(option.value)
                                        setIsOpen(false)
                                    }}
                                    className={`w-full flex items-center justify-between px-4 py-3 text-xs font-bold uppercase tracking-widest transition-colors ${value === option.value
                                        ? 'bg-accent-blue/10 text-accent-blue'
                                        : 'text-white/60 hover:bg-white/5 hover:text-white'
                                        }`}
                                >
                                    <span>{option.label}</span>
                                    {value === option.value && <Check size={14} />}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

const ProblemList: React.FC = () => {
    const {
        problems,
        isLoading,
        patternStats,
        currentPage,
        itemsPerPage,
        setCurrentPage,
        nextPage,
        prevPage,
        fetchAllProblems
    } = useStore()
    const [searchParams] = useSearchParams()
    const patternFilter = searchParams.get('pattern')

    const [searchQuery, setSearchQuery] = React.useState('')
    const [difficulty, setDifficulty] = React.useState<string>('All')
    const [type, setType] = React.useState<string>(patternFilter || 'All')
    const [sortBy, setSortBy] = React.useState<'confidence' | 'difficulty' | 'recency' | 'id'>('id')

    React.useEffect(() => {
        fetchAllProblems()
    }, [fetchAllProblems])

    // Update filter if URL param changes
    React.useEffect(() => {
        if (patternFilter) {
            setType(patternFilter)
        }
    }, [patternFilter])

    // Search debouncing
    const [debouncedSearch, setDebouncedSearch] = React.useState(searchQuery)

    React.useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchQuery)
        }, 300)
        return () => clearTimeout(timer)
    }, [searchQuery])

    const subPatternFilter = searchParams.get('subPattern')

    const filtered = problems.filter(p => {
        const matchesSearch =
            p.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
            p.primaryPattern?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
            p.tags.some(t => t.toLowerCase().includes(debouncedSearch.toLowerCase()))

        const matchesDifficulty = difficulty === 'All' || p.difficulty === difficulty

        let matchesType = type === 'All'

        if (!matchesType) {
            // Normalized check
            const t = type.toLowerCase()
            const prim = p.primaryPattern?.toLowerCase() || ''
            const algo = (p.algorithmType as string)?.toLowerCase() || ''

            matchesType = prim === t || algo === t ||
                (t === 'two_pointers' && (algo === 'two pointers' || algo === 'two_pointer')) ||
                (t === 'sliding_window' && (algo === 'sliding window')) ||
                (t === 'binary_search' && (algo === 'binary search'))
        }

        const matchesSubPattern = !subPatternFilter || p.subPattern === subPatternFilter

        return matchesSearch && matchesDifficulty && matchesType && matchesSubPattern
    })

    const sorted = [...filtered].sort((a, b) => {
        const statsA = patternStats[a.slug]
        const statsB = patternStats[b.slug]

        if (sortBy === 'confidence') {
            return (statsB?.confidence || 0) - (statsA?.confidence || 0)
        }
        if (sortBy === 'difficulty') {
            const weights = { 'Easy': 1, 'Medium': 2, 'Hard': 3 }
            return (weights[b.difficulty as keyof typeof weights] || 0) - (weights[a.difficulty as keyof typeof weights] || 0)
        }
        if (sortBy === 'recency') {
            return (statsB?.lastPracticed || 0) - (statsA?.lastPracticed || 0)
        }
        if (sortBy === 'id') {
            return a.id - b.id
        }
        return 0
    })

    // Pagination
    const totalPages = Math.ceil(sorted.length / itemsPerPage)
    const paginatedProblems = sorted.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

    // Reset pagination on filter change
    React.useEffect(() => {
        setCurrentPage(1)
    }, [searchQuery, difficulty, type, sortBy, setCurrentPage])

    if (isLoading && problems.length === 0) {
        return (
            <div className="flex-1 flex items-center justify-center mesh-bg">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-2 border-accent-blue/10 border-t-accent-blue rounded-full animate-spin" />
                    <span className="text-[10px] font-bold text-white/20 uppercase tracking-[0.4em]">Synchronizing Registry...</span>
                </div>
            </div>
        )
    }

    // Filter Options
    const patternOptions = [
        { label: 'All Patterns', value: 'All' },
        { label: 'Array', value: 'Array' },
        { label: 'Two Pointers', value: 'two_pointers' },
        { label: 'Sliding Window', value: 'sliding_window' },
        { label: 'Binary Search', value: 'binary_search' },
        { label: 'Stack', value: 'stack' },
        { label: 'Linked List', value: 'linked_list' },
        { label: 'Graph', value: 'graph' },
        { label: 'Recursion', value: 'recursion' }
    ]

    const difficultyOptions = [
        { label: 'All Levels', value: 'All' },
        { label: 'Easy', value: 'Easy' },
        { label: 'Medium', value: 'Medium' },
        { label: 'Hard', value: 'Hard' }
    ]

    const sortOptions = [
        { label: 'Sort by ID', value: 'id' },
        { label: 'Difficulty', value: 'difficulty' },
        { label: 'Confidence', value: 'confidence' },
        { label: 'Recency', value: 'recency' }
    ]

    return (
        <div className="flex-1 overflow-y-auto custom-scrollbar mesh-bg page-padding font-outfit">
            <div className="max-w-7xl mx-auto">
                <motion.header
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12"
                >
                    <h1 className="text-4xl font-bold mb-3 tracking-tight">Code <span className="text-gradient">Explorer</span></h1>
                    <p className="text-white/30 max-w-2xl font-light">
                        The complete structured LeetCode 1–100 cognitive explorer. Focus on logic, not clutter.
                    </p>
                </motion.header>

                {/* Horizontal Filter Bar */}
                <div className="flex flex-wrap items-center gap-4 mb-10 pb-10 border-b border-white/5 relative z-20">
                    <div className="flex-1 min-w-[300px] relative group h-12">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-accent-blue transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Search by title or keyword..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full h-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 focus:outline-none focus:border-accent-blue/40 transition-all text-sm font-medium"
                        />
                    </div>

                    <div className="flex items-center gap-3">
                        <FilterDropdown
                            icon={SlidersHorizontal}
                            options={patternOptions}
                            value={type}
                            onChange={setType}
                        />
                        <FilterDropdown
                            icon={SlidersHorizontal}
                            options={difficultyOptions}
                            value={difficulty}
                            onChange={setDifficulty}
                        />
                        <FilterDropdown
                            icon={ArrowUpDown}
                            options={sortOptions}
                            value={sortBy}
                            onChange={(val) => setSortBy(val as any)}
                        />
                    </div>

                    <div className="w-full">
                        <AnimatePresence mode='popLayout'>
                            {getPatternInfo(type) && getPatternInfo(type)!.subPatterns.length > 0 ? (
                                <div className="space-y-12">
                                    {getPatternInfo(type)!.subPatterns.map((subPattern: string) => {
                                        const subProblems = sorted.filter(p => p.subPattern === subPattern)
                                        if (subProblems.length === 0) return null

                                        return (
                                            <div key={subPattern} className="space-y-6">
                                                <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm py-4 border-b border-white/5 flex items-center gap-3">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-accent-blue" />
                                                    <h2 className="text-sm font-bold uppercase tracking-widest text-white/80">
                                                        {subPattern.replace(/_/g, ' ')}
                                                        <span className="ml-2 text-white/30 text-[10px] font-mono">({subProblems.length})</span>
                                                    </h2>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-3 gap-6">
                                                    {subProblems.map((problem) => (
                                                        <ProblemCard
                                                            key={problem.id}
                                                            problem={problem}
                                                            stats={patternStats[problem.slug]}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        )
                                    })}

                                    {/* Render uncategorized or non-matching sub-patterns if any */}
                                    {sorted.filter(p => !p.subPattern || !getPatternInfo(type)!.subPatterns.includes(p.subPattern!)).length > 0 && (
                                        <div className="space-y-6">
                                            <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm py-4 border-b border-white/5 flex items-center gap-3">
                                                <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
                                                <h2 className="text-sm font-bold uppercase tracking-widest text-white/60">Other</h2>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-3 gap-6">
                                                {sorted.filter(p => !p.subPattern || !getPatternInfo(type)!.subPatterns.includes(p.subPattern!)).map((problem) => (
                                                    <ProblemCard
                                                        key={problem.id}
                                                        problem={problem}
                                                        stats={patternStats[problem.slug]}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <motion.div
                                    layout
                                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-3 gap-6"
                                >
                                    {paginatedProblems.map((problem) => (
                                        <ProblemCard
                                            key={problem.id}
                                            problem={problem}
                                            stats={patternStats[problem.slug]}
                                        />
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Hide pagination if grouped (simplification for now, or implement per-group pagination? No, just show all for grouped view since lists are small) */}
                        {!getPatternInfo(type) && sorted.length > 0 && (
                            <div className="flex items-center justify-between pt-10 border-t border-white/5">
                                <span className="text-[10px] font-bold text-white/10 uppercase tracking-widest">
                                    Page {currentPage} of {totalPages}
                                </span>
                                <div className="flex gap-2">
                                    <button
                                        onClick={prevPage}
                                        disabled={currentPage === 1}
                                        className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest disabled:opacity-20 hover:bg-white/10 transition-colors"
                                    >
                                        Prev
                                    </button>
                                    <div className="flex gap-1">
                                        {[...Array(totalPages)].map((_, i) => (
                                            <button
                                                key={i}
                                                onClick={() => setCurrentPage(i + 1)}
                                                className={`w-8 h-8 rounded-lg border text-[10px] font-bold transition-all ${currentPage === i + 1
                                                    ? 'bg-accent-blue/20 border-accent-blue/40 text-accent-blue'
                                                    : 'bg-white/5 border-white/10 text-white/20 hover:border-white/20'
                                                    }`}
                                            >
                                                {i + 1}
                                            </button>
                                        ))}
                                    </div>
                                    <button
                                        onClick={nextPage}
                                        disabled={currentPage === totalPages}
                                        className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest disabled:opacity-20 hover:bg-white/10 transition-colors"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        )}

                        {sorted.length === 0 && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center py-24 rounded-3xl border border-dashed border-white/10 bg-white/[0.01]"
                            >
                                <h3 className="mb-2 text-xl font-bold text-white/40">No problem localized</h3>
                                <p className="text-white/10 text-xs uppercase tracking-widest">Adjust filters to re-scan registry</p>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </div >
    )
}

export default ProblemList
