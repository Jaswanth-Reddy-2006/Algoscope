import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    ArrowLeft,
    AlertTriangle
} from 'lucide-react'
import foundationsData from '../../data/foundations.json'
import { FoundationCategory, FoundationModule as FoundationModuleType } from '../../types/foundation'
import { FoundationHero } from './FoundationHero'
import { ProgressionTabs } from './ProgressionTabs'
import { ProgressionContent } from './ProgressionContent'
import { ComparisonMode } from './ComparisonMode'
import { CorePatternLayout } from './CorePatternLayout'


const breadcrumbMap: Record<string, { parentRoute: string; parentLabel: string }> = {
    "two_pointers": { parentRoute: "/foundations/core_patterns", parentLabel: "Core Patterns" },
    "sliding_window": { parentRoute: "/foundations/core_patterns", parentLabel: "Core Patterns" },
    "binary_search": { parentRoute: "/foundations/core_patterns", parentLabel: "Core Patterns" },
    "monotonic_stack": { parentRoute: "/foundations/core_patterns", parentLabel: "Core Patterns" },
    "fast_slow_pointers": { parentRoute: "/foundations/core_patterns", parentLabel: "Core Patterns" },
    "cyclic_sort": { parentRoute: "/foundations/core_patterns", parentLabel: "Core Patterns" },
    "bit_manipulation": { parentRoute: "/foundations/basics", parentLabel: "Mathematics & Basics" }
}

const FoundationModule = () => {
    // patternId comes from the new strict route
    // activeTab comes from the new strict route
    // moduleId comes from legacy route
    const { category, moduleId, patternId, activeTab, subPatternId } = useParams<{
        category: string;
        moduleId: string;
        patternId: string;
        activeTab: string;
        subPatternId: string;
    }>()

    const navigate = useNavigate()

    // Resolve the actual ID we are working with
    const resolvedId = patternId || moduleId

    const [progressionLevel, setProgressionLevel] = useState<'fundamentals' | 'patterns' | 'advanced'>('fundamentals')

    // Load module from foundations data
    const categories = foundationsData as any as FoundationCategory[]
    let module: FoundationModuleType | undefined

    if (categories && Array.isArray(categories)) {
        for (const category of categories) {
            const found = category.modules?.find((m: any) => m.id === resolvedId)
            if (found) {
                module = found as FoundationModuleType
                break
            }
        }
    }

    // Effect for redirect logic 
    useEffect(() => {
        if (!resolvedId) {
            navigate('/foundations')
            return
        }
    }, [resolvedId, navigate])

    // Core Pattern Logic - Redirect to default tab if missing
    const CORE_PATTERN_IDS = ['sliding_window', 'two_pointers', 'binary_search', 'monotonic_stack', 'fast_slow_pointers', 'cyclic_sort', 'recursion', 'backtracking']
    const isCorePattern = module?.family === 'Core Patterns' || (resolvedId && CORE_PATTERN_IDS.includes(resolvedId))

    useEffect(() => {
        if (isCorePattern && !activeTab && patternId) {
            // If we hit /foundations/core_patterns/:id but no tab, default to mental
            navigate(`/foundations/core_patterns/${patternId}/mental`, { replace: true })
        }
    }, [isCorePattern, activeTab, patternId, navigate])


    if (!module) {
        return (
            <div className="min-h-screen bg-[#2b0d38] flex items-center justify-center p-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md w-full text-center space-y-8 p-10 rounded-3xl bg-white/[0.02] border border-white/10 backdrop-blur-xl shadow-2xl"
                >
                    <div className="w-20 h-20 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto border border-red-500/20">
                        <AlertTriangle size={40} className="text-red-400" />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold text-white tracking-tight">System Interruption</h2>
                        <p className="text-white/40 leading-relaxed">
                            The requested foundation module <code className="text-red-400 bg-red-400/5 px-1.5 py-0.5 rounded italic">{resolvedId}</code> is currently offline or does not exist in our registry.
                        </p>
                    </div>
                    <button
                        onClick={() => navigate('/foundations')}
                        className="w-full py-4 bg-accent-blue/10 hover:bg-accent-blue/20 border border-accent-blue/20 rounded-2xl text-accent-blue font-bold uppercase tracking-widest transition-all duration-300"
                    >
                        Return to Command Center
                    </button>
                </motion.div>
            </div>
        )
    }

    // Breadcrumb lookup
    const breadcrumb = resolvedId ? breadcrumbMap[resolvedId as keyof typeof breadcrumbMap] : null
    const parentRoute = category ? `/foundations/${category}` : (breadcrumb?.parentRoute ?? '/foundations')
    const parentLabel = breadcrumb?.parentLabel ?? 'Foundations'

    if (isCorePattern) {
        // Map 'mental' -> 'mental_model', 'sub-patterns' -> 'sub_patterns', etc if URL is different from internal ID
        // The user requested: /mental, /sub-patterns, /code, /edge-cases, /drills
        // Internal IDs: mental_model, sub_patterns, code, edge_cases, drill

        let normalizedTab = activeTab
        if (activeTab === 'mental') normalizedTab = 'mental_model'
        if (activeTab === 'sub-patterns') normalizedTab = 'sub_patterns'
        if (activeTab === 'edge-cases') normalizedTab = 'edge_cases'
        if (activeTab === 'drills') normalizedTab = 'drill'

        return (
            <CorePatternLayout
                patternId={resolvedId!}
                module={module}
                parentLabel={parentLabel}
                parentRoute={parentRoute}
                activeTab={normalizedTab || 'mental_model'}
                activeSubPatternId={subPatternId || null}
            />
        )
    }


    return (
        <div className="min-h-screen bg-[#2b0d38] text-white">
            <div className="max-w-7xl mx-auto px-6 py-12">
                {/* Header / Breadcrumbs */}
                <div className="mb-12">
                    <button
                        onClick={() => navigate(parentRoute)}
                        className="flex items-center gap-2 text-white/40 hover:text-white transition-colors mb-6 group"
                    >
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="text-sm font-medium tracking-wide">Back to {parentLabel}</span>
                    </button>
                </div>

                {/* Phase 2: Hero Section */}
                <FoundationHero module={module} />

                {/* Phase 2: Progression Tabs */}
                <ProgressionTabs
                    activeLevel={progressionLevel}
                    onLevelChange={setProgressionLevel}
                />

                {/* Progression Content */}
                <div className="mt-12 min-h-[600px]">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={progressionLevel}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <ProgressionContent
                                module={module}
                                level={progressionLevel}
                                onVisualize={() => console.log('Launch Visualizer')}
                            />
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Phase 2: Comparison Mode */}
                <ComparisonMode comparisons={module.comparisons} />
            </div>
        </div>
    )
}

export default FoundationModule
