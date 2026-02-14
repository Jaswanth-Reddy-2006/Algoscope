import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Target,
    Layers,
    Code,
    AlertTriangle,
    Trophy,
    Box,
    ArrowLeft
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { FoundationModule } from '../../types/foundation'
import { MentalModelTab } from './MentalModelTab'
import { SubPatternTab } from './SubPatternTab'
import { EnhancedCodeTemplateTab } from './EnhancedCodeTemplateTab'
import { EnhancedEdgeCasesTab } from './EnhancedEdgeCasesTab'
import { EnhancedMicroDrillsTab } from './EnhancedMicroDrillsTab'

interface Props {
    patternId: string
    module: FoundationModule
    parentLabel: string
    parentRoute: string
    activeTab: string
    activeSubPatternId: string | null
}

const TABS = [
    { id: 'mental_model', label: 'Mental Model', icon: Target },
    { id: 'sub_patterns', label: 'Sub-Patterns', icon: Layers },
    { id: 'code', label: 'Code Templates', icon: Code },
    { id: 'edge_cases', label: 'Edge Cases', icon: AlertTriangle },
    { id: 'drill', label: 'Micro Drills', icon: Trophy }
]

export const CorePatternLayout: React.FC<Props> = ({
    patternId,
    module,
    parentLabel,
    parentRoute,
    activeTab,
    activeSubPatternId
}) => {
    const navigate = useNavigate()

    // Map UI tab IDs to URL paths if necessary, but here they seem 1:1 mapped in FoundationModule
    // FoundationModule maps 'mental_model' <-> 'mental' etc if needed, but here we receive the INTERNAL ID 'mental_model'

    const handleTabChange = (tabId: string) => {
        // Map internal ID to URL slug
        let slug = tabId
        if (tabId === 'mental_model') slug = 'mental'
        if (tabId === 'sub_patterns') slug = 'sub-patterns'
        if (tabId === 'edge_cases') slug = 'edge-cases'
        if (tabId === 'drill') slug = 'drills'

        // When changing tab, preserve subPatternId if applicable
        // Or should we clear it? 
        // User said: "Sub-pattern click must... Preserve active tab. Preserve active sub-pattern."
        // Implies state preservation.

        const url = `/foundations/core_patterns/${patternId}/${slug}${activeSubPatternId ? `/${activeSubPatternId}` : ''}`
        navigate(url)
    }

    const handleSubPatternChange = (id: string | null) => {
        // Map current tab to URL slug
        let slug = activeTab
        if (activeTab === 'mental_model') slug = 'mental'
        if (activeTab === 'sub_patterns') slug = 'sub-patterns'
        if (activeTab === 'edge_cases') slug = 'edge-cases'
        if (activeTab === 'drill') slug = 'drills'

        if (id) {
            navigate(`/foundations/core_patterns/${patternId}/${slug}/${id}`)
        } else {
            navigate(`/foundations/core_patterns/${patternId}/${slug}`)
        }
    }

    const renderTabContent = () => {
        const commonProps = {
            moduleId: patternId,
            module: module,
            activeSubPatternId,
            setActiveSubPatternId: handleSubPatternChange
        }

        switch (activeTab) {
            case 'mental_model':
                return <MentalModelTab {...commonProps} />
            case 'sub_patterns':
                return <SubPatternTab {...commonProps} />
            case 'code':
                return <EnhancedCodeTemplateTab {...commonProps} />
            case 'edge_cases':
                return <EnhancedEdgeCasesTab
                    moduleId={patternId}
                    module={module}
                    activeSubPatternId={activeSubPatternId}
                />
            case 'drill':
                return <EnhancedMicroDrillsTab {...commonProps} />
            default:
                return null
        }
    }

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
                        <div className="p-3 bg-accent-blue/10 rounded-xl border border-accent-blue/20">
                            <Box size={32} className="text-accent-blue" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-bold text-accent-blue uppercase tracking-widest">{parentLabel}</span>
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-accent-blue/20 text-accent-blue border border-accent-blue/30 uppercase">
                                    Core Pattern
                                </span>
                            </div>
                            <h1 className="text-4xl font-bold">{module.title}</h1>
                        </div>
                    </div>
                    <p className="text-white/60 text-lg max-w-3xl leading-relaxed">{module.description}</p>
                </div>

                {/* Tabs Navigation */}
                <div className="flex flex-wrap gap-2 mb-12 border-b border-white/10 pb-4">
                    {TABS.map(tab => {
                        const Icon = tab.icon
                        const isActive = activeTab === tab.id
                        return (
                            <button
                                key={tab.id}
                                onClick={() => handleTabChange(tab.id)}
                                className={`
                                    flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300
                                    ${isActive
                                        ? 'bg-accent-blue/20 text-accent-blue border border-accent-blue/30 shadow-[0_0_20px_rgba(0,176,250,0.1)]'
                                        : 'bg-white/5 text-white/50 border border-white/5 hover:bg-white/10 hover:text-white'
                                    }
                                `}
                            >
                                <Icon size={18} />
                                {tab.label}
                            </button>
                        )
                    })}
                </div>

                {/* Main Content Area */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab + (activeSubPatternId || 'none')}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="min-h-[600px]"
                    >
                        {renderTabContent()}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    )
}
