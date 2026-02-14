import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    ArrowLeft,
    Target,
    Trophy,
    Box,
    Layers,
    Code,
    AlertTriangle
} from 'lucide-react'
import foundationsData from '../../data/foundations.json'
import { FoundationCategory, FoundationModule as FoundationModuleType } from '../../types/foundation'
import { MentalModelTab } from './MentalModelTab'
import { SubPatternTab } from './SubPatternTab'
import { EnhancedCodeTemplateTab } from './EnhancedCodeTemplateTab'
import { EnhancedEdgeCasesTab } from './EnhancedEdgeCasesTab'
import { EnhancedMicroDrillsTab } from './EnhancedMicroDrillsTab'
import { CorePatternLayout } from './CorePatternLayout'

// Define Tab Interface
interface TabDef {
    id: string
    label: string
    icon: React.ElementType
}

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

    // For legacy/basic patterns, we still use internal state if no route param
    const [legacyTab, setLegacyTab] = useState<string>('mental_model')
    const [internalSubId, setInternalSubId] = useState<string | null>(null)

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
    const CORE_PATTERN_IDS = ['sliding_window', 'two_pointers', 'binary_search', 'monotonic_stack', 'fast_slow_pointers', 'cyclic_sort']
    const isCorePattern = module?.family === 'Core Patterns' || (resolvedId && CORE_PATTERN_IDS.includes(resolvedId))

    useEffect(() => {
        if (isCorePattern && !activeTab && patternId) {
            // If we hit /foundations/core_patterns/:id but no tab, default to mental
            navigate(`/foundations/core_patterns/${patternId}/mental`, { replace: true })
        }
    }, [isCorePattern, activeTab, patternId, navigate])


    if (!module) {
        return (
            <div className="min-h-screen bg-[#0a0118] flex items-center justify-center p-6">
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

    // Default Layout for non-core patterns (Legacy/Basic)
    const tabs: TabDef[] = [
        { id: 'mental_model', label: 'Mental Model', icon: Target },
        { id: 'sub_patterns', label: 'Sub-Patterns', icon: Layers },
        { id: 'code', label: 'Code Templates', icon: Code },
        { id: 'edge_cases', label: 'Edge Cases', icon: AlertTriangle },
        { id: 'drill', label: 'Micro Drills', icon: Trophy }
    ]

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0a0118] via-[#0f0322] to-[#0a0118] text-white">
            <div className="max-w-7xl mx-auto px-6 py-12">
                {/* Header */}
                <div className="mb-12">
                    <button
                        onClick={() => navigate(parentRoute)}
                        className="flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-6 group"
                    >
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="text-sm">Back to {parentLabel}</span>
                    </button>
                    <div className="flex items-center gap-4 mb-4">
                        <Box size={32} className="text-accent-blue" />
                        <div>
                            <div className="text-xs font-bold text-accent-blue uppercase tracking-widest mb-1">{parentLabel}</div>
                            <h1 className="text-4xl font-bold">{module.title}</h1>
                        </div>
                    </div>
                    <p className="text-white/60 text-lg">{module.description}</p>
                </div>

                {/* Legacy Tabs */}
                <div className="flex flex-wrap gap-2 mb-12 border-b border-white/10 pb-4">
                    {tabs.map(tab => {
                        const Icon = tab.icon
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setLegacyTab(tab.id)}
                                className={`
                                    flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors
                                    ${legacyTab === tab.id
                                        ? 'bg-accent-blue/20 text-accent-blue border border-accent-blue/30'
                                        : 'bg-white/5 text-white/70 border border-white/10 hover:bg-white/10'
                                    }
                                `}
                            >
                                <Icon size={16} />
                                {tab.label}
                            </button>
                        )
                    })}
                </div>

                {/* Tab Content */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={legacyTab}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="space-y-12">
                            {legacyTab === 'mental_model' && (
                                <MentalModelTab
                                    moduleId={resolvedId}
                                    module={module}
                                    activeSubPatternId={internalSubId}
                                    setActiveSubPatternId={setInternalSubId}
                                />
                            )}
                            {legacyTab === 'sub_patterns' && (
                                <SubPatternTab
                                    moduleId={resolvedId}
                                    module={module}
                                    activeSubPatternId={internalSubId}
                                    setActiveSubPatternId={setInternalSubId}
                                />
                            )}
                            {legacyTab === 'code' && (
                                <EnhancedCodeTemplateTab
                                    moduleId={resolvedId}
                                    module={module}
                                    activeSubPatternId={internalSubId}
                                    setActiveSubPatternId={setInternalSubId}
                                />
                            )}
                            {legacyTab === 'edge_cases' && (
                                <EnhancedEdgeCasesTab
                                    moduleId={resolvedId}
                                    module={module}
                                    activeSubPatternId={internalSubId}
                                />
                            )}
                            {legacyTab === 'drill' && (
                                <EnhancedMicroDrillsTab
                                    moduleId={resolvedId}
                                    module={module}
                                    activeSubPatternId={internalSubId}
                                    setActiveSubPatternId={setInternalSubId}
                                />
                            )}
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    )
}

export default FoundationModule
