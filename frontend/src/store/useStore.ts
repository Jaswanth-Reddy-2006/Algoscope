import { create } from 'zustand'
import { Problem, AlgorithmType } from '../types'
import { generateFallbackSteps } from '../utils/algoGenerators'
import { getStrategyForProblem } from '../registry/problemStrategyRegistry'
import fallbackProblems from '../data/problems.json'

const API_BASE = (import.meta as any).env?.VITE_API_BASE || 'http://localhost:5000'

interface PatternStats {
    attempts: number
    bruteFirstCount: number
    replayCount: number
    thinkingGuideTime: number
    compareModeUsage: number
    checklistCompletionRate: number
    guideSectionCompletionRate: number
    avgTimeBeforeVisualization: number
    confidence: number
    totalChecklistItems: number
    totalGuideSections: number
    sessions: number
    lastPracticed: number
    foundationConfidence?: number
    appliedConfidence?: number
    transferScore?: number
    lastTransferUpdate?: number
    theoryScore?: number
    optimizationScore?: number
    edgeCaseScore?: number

    // New metrics for Phase 13
    totalAttempted: number
    avgThinkingTime: number
    visualizationReplays: number
    edgeCaseCompletionRate: number
    drillPerformance: number

    // Aggregates for Phase 15
    subPatternConfidence?: Record<string, number>
    patternConfidence?: Record<string, number>

    // Phase 17: Foundation Component Scores (0-100)
    visualizerScore?: number
    templateScore?: number
    recognitionScore?: number // "Mastery"
    drillScore?: number      // "Drills"
}

interface AlgoScopeState {
    currentProblem: Problem | null
    currentStepIndex: number
    isBruteForce: boolean
    compareMode: boolean
    isPlaying: boolean
    playbackSpeed: number
    customInput: string
    customTarget: string
    isLoading: boolean
    error: string | null
    isSidebarCollapsed: boolean
    problems: Problem[]
    isEngineInitialized: boolean
    patternStats: Record<string, PatternStats>
    startTime: number | null
    currentPage: number
    itemsPerPage: number
    drillProgress: Record<string, { // moduleId
        [subPatternId: string]: {
            answeredIds: string[],
            score: number,
            accuracy: number
        }
    }>

    setProblem: (problem: Problem) => void
    fetchAllProblems: () => Promise<void>
    fetchProblemBySlug: (slug: string) => Promise<void>
    setStep: (index: number) => void
    toggleApproach: () => void
    setCompareMode: (compare: boolean) => void
    setPlaying: (playing: boolean) => void
    setSpeed: (speed: number) => void
    setCustomInput: (input: string) => void
    setCustomTarget: (target: string) => void
    setSidebarCollapsed: (collapsed: boolean) => void
    refreshSteps: () => Promise<void>
    nextStep: () => void
    prevStep: () => void
    resetState: () => void
    trackActivity: (pattern: string, metric: keyof Omit<PatternStats, 'confidence'>, value?: number) => void
    finalizeThinkingTime: (slug: string) => void
    setCurrentPage: (page: number) => void
    nextPage: () => void
    prevPage: () => void
    generatePatternInsight: (slug: string) => string
    getAdaptiveBehavior: (slug: string) => AdaptiveBehavior
    updatePatternMastery: (algorithmType: string, performance: number, breakdown?: { theory: number, optimization: number, edgeCase: number }, subPattern?: string, component?: 'drill' | 'visualizer' | 'template' | 'recognition' | 'edge') => void
    checkSkillDecay: () => void
    getRecommendedAction: () => Recommendation | null
    calculateTransferScore: (slug: string) => void
    getPatternDependencies: (pattern: string) => { basePattern: string, confidence: number, isMet: boolean, message?: string } | null
    saveDrillProgress: (moduleId: string, subPatternId: string, answeredId: string, isCorrect: boolean) => void
    initializeStore: () => Promise<void>
}

interface AdaptiveBehavior {
    autoExpandGuide: boolean
    highlightSignals: boolean
    enableCompareByDefault: boolean
    showPatternCapsule: boolean
    reduceAssistance: boolean
    statusLabel: 'Focus Area' | 'Strong Pattern' | null
}

export interface Recommendation {
    type: 'decay' | 'weakness' | 'foundation'
    message: string
    link: string
    label: string
}



export const useStore = create<AlgoScopeState>((set, get) => ({
    currentProblem: null,
    currentStepIndex: 0,
    isBruteForce: false,
    compareMode: false,
    isPlaying: false,
    playbackSpeed: 500,
    customInput: '',
    customTarget: '',
    isLoading: false,
    error: null,
    isSidebarCollapsed: false,
    problems: [],
    patternStats: JSON.parse(localStorage.getItem('algoScope_patternStats') || '{}'),
    isEngineInitialized: false,
    startTime: null,
    currentPage: 1,
    itemsPerPage: 12,
    drillProgress: JSON.parse(localStorage.getItem('algoScope_drillProgress') || '{}'),

    trackActivity: (pattern: string, metric: keyof Omit<PatternStats, 'confidence'>, value = 1) => {
        set((state) => {
            const stats = state.patternStats[pattern] || {
                attempts: 0,
                bruteFirstCount: 0,
                replayCount: 0,
                thinkingGuideTime: 0,
                compareModeUsage: 0,
                checklistCompletionRate: 0,
                guideSectionCompletionRate: 0,
                avgTimeBeforeVisualization: 0,
                confidence: 0,
                totalChecklistItems: 0,
                totalGuideSections: 0,
                sessions: 0,
                lastPracticed: Date.now(),
                theoryScore: 0,
                optimizationScore: 0,
                edgeCaseScore: 0,
                totalAttempted: 0,
                avgThinkingTime: 0,
                visualizationReplays: 0,
                edgeCaseCompletionRate: 0,
                drillPerformance: 0,
                visualizerScore: 0,
                templateScore: 0,
                recognitionScore: 0,
                drillScore: 0
            }

            let newValue = ((stats[metric as keyof PatternStats] as any) || 0) + value

            // Overwrite logic for rates
            if (metric.includes('Rate')) {
                newValue = value
            }

            const newStats = { ...stats, [metric]: newValue }

            // Refined Confidence Calculation
            // factors: engagement (checklist/guide), efficiency (time), discipline (bruteFirst)
            const engagementScore = (newStats.checklistCompletionRate + newStats.guideSectionCompletionRate) / 2
            const disciplinePenalty = (newStats.bruteFirstCount / Math.max(1, newStats.attempts)) * 30
            const complexityPenalty = (newStats.replayCount / Math.max(1, newStats.attempts)) * 15
            const familiarityBonus = Math.min(25, newStats.attempts * 5)

            newStats.confidence = Math.min(100, Math.max(0,
                40 + engagementScore * 0.4 + familiarityBonus - disciplinePenalty - complexityPenalty
            ))

            const updatedPatternStats = { ...state.patternStats, [pattern]: { ...newStats, lastPracticed: Date.now() } }
            localStorage.setItem('algoScope_patternStats', JSON.stringify(updatedPatternStats))

            return { patternStats: updatedPatternStats }
        })
    },

    resetState: () => set({
        currentStepIndex: 0,
        isPlaying: false,
        compareMode: false,
        isBruteForce: false,
        error: null
    }),

    finalizeThinkingTime: (slug: string) => {
        const { startTime, patternStats } = get()
        if (!startTime) return

        const timeSpent = (Date.now() - startTime) / 1000 // seconds
        const stats = patternStats[slug]
        const currentAvg = stats?.avgTimeBeforeVisualization || 0
        const attempts = stats?.attempts || 1

        const newAvg = (currentAvg * (attempts - 1) + timeSpent) / attempts

        get().trackActivity(slug, 'avgTimeBeforeVisualization', newAvg)
        set({ startTime: null }) // Reset for this session
    },

    generatePatternInsight: (slug: string) => {
        const stats = get().patternStats[slug]
        if (!stats || stats.attempts < 1) return "Start exploring to generate cognitive insights."

        const insights = []

        // Brute force bias
        if (stats.bruteFirstCount / stats.attempts > 0.6) {
            insights.push("You often rely on naive strategies first. Try identifying the core constraint earlier.")
        }

        // Guide depth
        if (stats.guideSectionCompletionRate < 40) {
            insights.push("You frequently bypass the Thinking Guide. Deepening your mental model can reduce replays.")
        }

        // Replay/Confusion
        if (stats.replayCount / stats.attempts > 3) {
            insights.push("High replay count detected. Consider pausing to sketch the state transition transition.")
        }

        // Engagement
        if (stats.checklistCompletionRate > 80 && stats.confidence > 70) {
            insights.push("Excellent discipline. Your systematic approach is building strong pattern recognition.")
        }

        if (insights.length === 0) return "Maintain your current focus. Consistency is building neural familiarity."
        return insights[Math.floor(Math.random() * insights.length)]
    },

    getAdaptiveBehavior: (slug: string): AdaptiveBehavior => {
        const stats = get().patternStats[slug]
        const confidence = stats?.confidence || 0

        // Default: New or Neutral
        const behavior: AdaptiveBehavior = {
            autoExpandGuide: true,
            highlightSignals: false,
            enableCompareByDefault: false,
            showPatternCapsule: false,
            reduceAssistance: false,
            statusLabel: null
        }

        if (confidence < 50) {
            // Weak Pattern
            behavior.autoExpandGuide = true
            behavior.highlightSignals = true
            behavior.enableCompareByDefault = true
            behavior.showPatternCapsule = true
            behavior.statusLabel = 'Focus Area'
        } else if (confidence >= 80) {
            // Strong Pattern
            behavior.autoExpandGuide = false
            behavior.reduceAssistance = true
            behavior.statusLabel = 'Strong Pattern'
        }
        // 50-79: Neutral (Keep defaults)

        return behavior
    },

    updatePatternMastery: (algorithmType: string, performance: number, breakdown?: { theory: number, optimization: number, edgeCase: number }, subPattern?: string, component?: 'drill' | 'visualizer' | 'template' | 'recognition' | 'edge') => {
        set((state) => {
            const { patternStats } = state
            // Use algorithmType as the key (e.g. 'sliding_window')
            const stats = patternStats[algorithmType] || {
                attempts: 0, confidence: 0, lastPracticed: 0, sessions: 0,
                drillScore: 0, visualizerScore: 0, templateScore: 0, recognitionScore: 0, edgeCaseScore: 0
            } as PatternStats

            let newStats = { ...stats }

            // Update specific component score if provided
            const scoresToUpdate: any = {}
            if (component) {
                switch (component) {
                    case 'drill': newStats.drillScore = performance; scoresToUpdate.drill = performance; break;
                    case 'visualizer': newStats.visualizerScore = performance; scoresToUpdate.visualizer = performance; break;
                    case 'template': newStats.templateScore = performance; scoresToUpdate.template = performance; break;
                    case 'recognition': newStats.recognitionScore = performance; scoresToUpdate.recognition = performance; break;
                    case 'edge': newStats.edgeCaseScore = performance; scoresToUpdate.edge = performance; break;
                }
            } else if (breakdown) {
                // Backward compatibility or generic update
                newStats.theoryScore = (newStats.theoryScore || 0) * 0.7 + breakdown.theory * 0.3
            }

            // Calculate Weighted Confidence
            // Formula: 40% Drills, 20% Vis, 20% Recog, 10% Edge, 10% Templates
            const weightedConfidence = (
                ((newStats.drillScore || 0) * 0.4) +
                ((newStats.visualizerScore || 0) * 0.2) +
                ((newStats.recognitionScore || 0) * 0.2) +
                ((newStats.edgeCaseScore || 0) * 0.1) +
                ((newStats.templateScore || 0) * 0.1)
            )

            newStats.confidence = Math.min(100, Math.round(weightedConfidence))
            newStats.lastPracticed = Date.now()

            const updatedStats = { ...patternStats, [algorithmType]: newStats }

            // Sub-pattern Confidence Update (Granular)
            let subPatternData = undefined;
            if (subPattern) {
                const subMap = newStats.subPatternConfidence || {}
                subMap[subPattern] = performance || 0
                newStats.subPatternConfidence = { ...subMap }
                subPatternData = { id: subPattern, score: performance }
            }

            // Sync with Backend
            const userId = localStorage.getItem('algoScope_userId') || 'guest_' + Date.now()
            if (!localStorage.getItem('algoScope_userId')) localStorage.setItem('algoScope_userId', userId)

            fetch(`${API_BASE}/api/progress/update`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId,
                    moduleId: algorithmType,
                    scores: scoresToUpdate,
                    confidence: newStats.confidence,
                    subPattern: subPatternData
                })
            }).catch(err => console.warn("Sync failed (possibly offline/preview):", err))

            localStorage.setItem('algoScope_patternStats', JSON.stringify(updatedStats))
            return { patternStats: updatedStats }
        })
    },

    checkSkillDecay: () => {
        const { patternStats } = get()
        const now = Date.now()
        let updated = false
        const updatedStats = { ...patternStats }

        Object.keys(updatedStats).forEach(slug => {
            const stats = updatedStats[slug]
            if (!stats.lastPracticed) return

            const daysSincePractice = (now - stats.lastPracticed) / (1000 * 60 * 60 * 24)
            if (daysSincePractice > 14) {
                const decayAmount = Math.min(10, Math.floor(daysSincePractice - 14))
                if (decayAmount > 0) {
                    updatedStats[slug] = {
                        ...stats,
                        confidence: Math.max(0, stats.confidence - decayAmount)
                    }
                    updated = true
                }
            }
        })

        if (updated) {
            set({ patternStats: updatedStats })
            localStorage.setItem('algoScope_patternStats', JSON.stringify(updatedStats))
        }
    },

    getRecommendedAction: () => {
        const { patternStats, problems } = get()
        const now = Date.now()

        // 0. Check for Transfer Gaps (New Priority)
        // High Applied confidence, Low Foundation confidence -> Review Foundation
        // High Foundation confidence, Low Applied confidence -> Solve Problem

        for (const [, stats] of Object.entries(patternStats)) {
            const foundationConf = stats.foundationConfidence || 0
            const appliedConf = stats.appliedConfidence || 0

            // Knowledge Gap
            if (appliedConf > 70 && foundationConf < 50) {
                // Find mapping to get foundation name? 
                // We can't easily get the name here without the mapping object.
                // But we know 'slug' is likely an applied problem if it has foundationConfidence stats?
                // Actually, our calculateTransferScore updates SELF. 
                // So if we are looking at an Applied Problem, foundationConfidence IS the foundation's score.

                return {
                    type: 'foundation',
                    message: `Strong application, but weak theory detected in this area.`,
                    link: `/foundations`, // Ideally link to specific foundation
                    label: 'Review Theory'
                }
            }

            // Application Gap
            if (foundationConf > 70 && appliedConf < 50) {
                return {
                    type: 'weakness',
                    message: `Theory is strong, but application lags. Apply your knowledge now.`,
                    link: `/problems`, // Ideally specific problem
                    label: 'Solve Problems'
                }
            }
        }

        // 1. Check for Decay (High Priority)
        for (const [slug, stats] of Object.entries(patternStats)) {
            if (stats.lastPracticed && (now - stats.lastPracticed) > (14 * 24 * 60 * 60 * 1000)) {
                const problem = problems.find(p => p.slug === slug)
                if (problem) {
                    return {
                        type: 'decay',
                        message: `Skill Fade Detected: ${problem.algorithmType || problem.title}. Refresh your memory.`,
                        link: `/mastery/${problem.algorithmType}`,
                        label: 'Restore Skill'
                    }
                }
            }
        }

        // 2. Check for Low Confidence (General Improvement)
        let lowestConf = 100
        let targetSlug = ''

        Object.entries(patternStats).forEach(([slug, stats]) => {
            if (stats.attempts > 0 && stats.confidence < 60 && stats.confidence > 0) {
                if (stats.confidence < lowestConf) {
                    lowestConf = stats.confidence
                    targetSlug = slug
                }
            }
        })

        if (targetSlug) {
            const problem = problems.find(p => p.slug === targetSlug)
            if (problem) {
                return {
                    type: 'weakness',
                    message: `Confidence Low in ${problem.algorithmType || problem.title}. Boost it now.`,
                    link: `/mastery/${problem.algorithmType}`,
                    label: 'Train Now'
                }
            }
        }

        return null
    },

    calculateTransferScore: (slug: string) => {
        set((state) => {
            const { patternStats } = state
            const stats = patternStats[slug]
            if (!stats) return {}

            // Identify if this is a foundation or an applied problem
            // For now, we assume foundations have specific IDs known in data/foundations.json
            // But simpler heuristic: check if it matches a known mapped problem
            // We need a mapping. Let's hardcode the relationship here or import it.
            // For Phase 12, let's look up the mappings.

            // Mapping: Foundation -> Applied Problems (Slugs)
            const mapping: Record<string, string[]> = {
                'bubble_sort': ['sort-colors'],
                'merge_sort': ['sort-list', 'merge-k-sorted-lists'],
                'binary_search': ['median-of-two-sorted-arrays', 'search-in-rotated-sorted-array'],
                'graph_bfs': ['word-ladder', 'number-of-islands']
            }

            // Reverse Mapping: Applied Problem -> Foundation
            const reverseMapping: Record<string, string> = {}
            Object.entries(mapping).forEach(([foundation, problems]) => {
                problems.forEach(p => reverseMapping[p] = foundation)
            })

            let foundationConf = stats.foundationConfidence || 0
            let appliedConf = stats.appliedConfidence || 0
            let relatedProblems: string[] = []

            if (mapping[slug]) {
                // It is a Foundation
                foundationConf = stats.confidence
                relatedProblems = mapping[slug]

                if (relatedProblems.length > 0) {
                    const totalApplied = relatedProblems.reduce((acc, pSlug) => {
                        return acc + (patternStats[pSlug]?.confidence || 0)
                    }, 0)
                    appliedConf = totalApplied / relatedProblems.length
                }
            } else if (reverseMapping[slug]) {
                // It is an Applied Problem
                appliedConf = stats.confidence
                const foundationSlug = reverseMapping[slug]
                if (foundationSlug) {
                    foundationConf = patternStats[foundationSlug]?.confidence || 0
                }
            } else {
                return {} // No transfer logic applicable
            }

            // Calculate Transfer Score
            // Formula: min(F, A) - abs(F - A) * 0.5
            // High when both are high and close. Low if gap exists.
            const transferScore = Math.max(0, Math.min(foundationConf, appliedConf) - Math.abs(foundationConf - appliedConf) * 0.5)

            const updatedStats = {
                ...patternStats,
                [slug]: {
                    ...stats,
                    foundationConfidence: foundationConf,
                    appliedConfidence: appliedConf,
                    transferScore: transferScore,
                    lastTransferUpdate: Date.now()
                }
            }

            // Also update related items to keep them in sync? 
            // Ideally yes, but to avoid infinite loops, we only update self. 
            // Or we just update visuals on render. 
            // Let's persist self update.

            localStorage.setItem('algoScope_patternStats', JSON.stringify(updatedStats))
            return { patternStats: updatedStats }
        })
    },

    setProblem: (problem: Problem) => {
        let defaultInput = ''
        let defaultTarget = ''

        if (problem.id === 1) {
            defaultInput = '[2, 7, 11, 15]'
            defaultTarget = '9'
        } else if (problem.id === 3) {
            defaultInput = 'abcabcbb'
            defaultTarget = ''
        }

        set({
            currentProblem: problem,
            currentStepIndex: 0,
            isBruteForce: false,
            compareMode: false,
            isPlaying: false,
            customInput: defaultInput,
            customTarget: defaultTarget
        })

        // Track Attempt & Session
        get().trackActivity(problem.slug, 'attempts')
        get().trackActivity(problem.slug, 'sessions')
        set({ startTime: Date.now() })
    },

    fetchAllProblems: async () => {
        if (get().problems.length > 0) return
        try {
            const response = await fetch(`${API_BASE}/api/problems`)
            if (!response.ok) throw new Error('API Unavailable')
            let data: Problem[] = await response.json()

            // Validation Logic: Ensure IDs 1-100 exist and find duplicates
            const ids = data.map(p => p.id)
            const duplicates = ids.filter((item, index) => ids.indexOf(item) !== index)

            if (duplicates.length > 0) {
                console.error(`[Data Correction] Duplicate IDs found: ${Array.from(new Set(duplicates)).join(', ')}. Filtering duplicates.`)
                const seen = new Set()
                data = data.filter(p => {
                    const duplicate = seen.has(p.id)
                    seen.add(p.id)
                    return !duplicate
                })
            }

            const missingIds = []
            for (let i = 1; i <= 100; i++) {
                if (!ids.includes(i)) missingIds.push(i)
            }
            if (missingIds.length > 0) {
                console.warn(`[Data Warning] Missing Problem IDs in sequence 1-100: ${missingIds.join(', ')}`)
            }

            // Default Sort: ID Ascending
            data.sort((a, b) => a.id - b.id)

            // Normalize algorithmType for consistency
            const normalizedData = data.map(p => ({
                ...p,
                algorithmType: (p.algorithmType === 'two_pointer' ? 'two_pointers' : p.algorithmType) as AlgorithmType
            }))

            set({ problems: normalizedData as Problem[] })
        } catch (err) {
            console.warn("Using fallback problems (Offline Mode):", err)
            // Use fallback data and normalize names
            const data = (fallbackProblems as any[]).map(p => ({
                ...p,
                algorithmType: (p.algorithmType === 'two_pointer' ? 'two_pointers' : p.algorithmType) as AlgorithmType
            }))
            set({ problems: data as Problem[] })
        }
    },

    initializeStore: async () => {
        const userId = localStorage.getItem('algoScope_userId') || 'guest_' + Date.now()
        if (!localStorage.getItem('algoScope_userId')) localStorage.setItem('algoScope_userId', userId)

        try {
            // Fetch User Progress
            const response = await fetch(`${API_BASE}/api/progress/${userId}`)
            if (response.ok) {
                const progressData = await response.json()
                const newPatternStats = { ...get().patternStats }

                progressData.forEach((p: any) => {
                    newPatternStats[p.moduleId] = {
                        ...newPatternStats[p.moduleId],
                        // Granular scores
                        drillScore: p.drillScore || 0,
                        visualizerScore: p.visualizerScore || 0,
                        templateScore: p.templateScore || 0,
                        recognitionScore: p.recognitionScore || 0,
                        edgeCaseScore: p.edgeCaseScore || 0,

                        confidence: p.confidence || 0,
                        lastPracticed: p.lastPracticed ? new Date(p.lastPracticed).getTime() : Date.now(),

                        // Hydrate sub-patterns
                        subPatternConfidence: p.subPatternConfidence || {}
                    } as PatternStats
                })

                set({ patternStats: newPatternStats })
            }
        } catch (e) {
            console.error("Failed to load user progress:", e)
        }

        // Also fetch problems
        await get().fetchAllProblems()
    },

    fetchProblemBySlug: async (slug: string) => {
        const { problems, currentProblem } = get()

        if (currentProblem?.slug === slug) return

        set({ isLoading: true, error: null, isEngineInitialized: false })

        try {
            let data = problems.find(p => p.slug === slug)

            if (!data) {
                const response = await fetch(`${API_BASE}/api/problems/${slug}`)
                if (!response.ok) throw new Error('Problem not found')
                data = await response.json()
            }

            get().setProblem(data!)

            if (data?.status === 'complete') {
                await get().refreshSteps()
            }
            set({ isEngineInitialized: true })
        } catch (err: any) {
            set({ error: err.message })
        } finally {
            set({ isLoading: false })
        }
    },

    setStep: (index: number) => set({ currentStepIndex: index }),
    toggleApproach: () => set((state) => {
        if (!state.isBruteForce && state.currentProblem) {
            get().trackActivity(state.currentProblem.slug, 'bruteFirstCount')
        }
        return { isBruteForce: !state.isBruteForce, currentStepIndex: 0, compareMode: false, isPlaying: false }
    }),
    setCompareMode: (compare: boolean) => {
        if (compare && get().currentProblem) {
            get().trackActivity(get().currentProblem!.slug, 'compareModeUsage')
        }
        set({ compareMode: compare, isBruteForce: false, currentStepIndex: 0, isPlaying: false })
    },
    setPlaying: (playing: boolean) => set({ isPlaying: playing }),
    setSpeed: (speed: number) => set({ playbackSpeed: speed }),
    setCustomInput: (input: string) => set({ customInput: input }),
    setCustomTarget: (target: string) => set({ customTarget: target }),
    setSidebarCollapsed: (collapsed: boolean) => set({ isSidebarCollapsed: collapsed }),

    setCurrentPage: (page: number) => set({ currentPage: page }),
    nextPage: () => set((state) => ({ currentPage: state.currentPage + 1 })),
    prevPage: () => set((state) => ({ currentPage: Math.max(1, state.currentPage - 1) })),

    refreshSteps: async () => {
        const { currentProblem, customInput, customTarget } = get()
        if (!currentProblem) return

        try {
            // Priority 1: Local Strategy Registry (Strict Master Fix)
            const strategyPair = getStrategyForProblem(currentProblem.slug)

            // Parse input safely
            let parsedInput: any = {}
            try {
                if (currentProblem.algorithmType === 'two_pointer' || currentProblem.algorithmType === 'array') {
                    parsedInput = {
                        nums: JSON.parse(customInput || '[2, 7, 11, 15]'),
                        target: parseInt(customTarget || '9')
                    }
                } else if (currentProblem.algorithmType === 'sliding_window') {
                    parsedInput = customInput || "abcabcbb"
                } else {
                    parsedInput = customInput || ""
                }
            } catch (e) {
                console.warn("Input parsing failed, using defaults", e)
                parsedInput = { nums: [2, 7, 11, 15], target: 9 }
            }

            const bruteSteps = strategyPair.brute(parsedInput)
            const optimalSteps = strategyPair.optimal(parsedInput)

            // Debug Logging (Phase 2 Master Fix)
            if (window.location.search.includes('debug=true')) {
                console.group(`[Algorithmic Debug] ${currentProblem.slug}`)
                console.log("Input:", parsedInput)
                console.log("Brute Steps:", bruteSteps.length)
                console.log("Optimal Steps:", optimalSteps.length)
                console.groupEnd()
            }

            // If the registry has valid logic, use it
            if (bruteSteps.length > 0 && bruteSteps[0].description !== "Standard execution logic pending registration.") {
                set({
                    currentProblem: {
                        ...currentProblem,
                        brute_force_steps: bruteSteps,
                        optimal_steps: optimalSteps
                    },
                    currentStepIndex: 0,
                    isPlaying: false,
                    isEngineInitialized: true,
                    isLoading: false
                })
                return
            }

            // Priority 2: Backend Attempt (if local returned nothing or dummy)
            set({ isLoading: true })
            const response = await fetch(`${API_BASE}/api/problems/${currentProblem.id}/steps`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ input: customInput, target: customTarget })
            })

            if (!response.ok) throw new Error('Backend failure or missing implementation')
            const data = await response.json()

            set({
                currentProblem: {
                    ...currentProblem,
                    brute_force_steps: data.brute || [],
                    optimal_steps: data.optimal || []
                },
                currentStepIndex: 0,
                isPlaying: false,
                isLoading: false,
                isEngineInitialized: true
            })

        } catch (e) {
            console.error("Strategy execution failed, falling back to basic traversal:", e)

            // Safe manual fallback to prevent "No implementation Found"
            let fallbackItems: any[] = []
            try {
                fallbackItems = JSON.parse(customInput || '[1, 2, 3, 4, 5]')
            } catch {
                fallbackItems = [1, 2, 3, 4, 5]
            }
            if (!Array.isArray(fallbackItems)) fallbackItems = [fallbackItems]

            const fallback = generateFallbackSteps(fallbackItems)
            set({
                currentProblem: {
                    ...currentProblem,
                    brute_force_steps: fallback,
                    optimal_steps: fallback
                },
                currentStepIndex: 0,
                isPlaying: false,
                isLoading: false,
                isEngineInitialized: true
            })
        }
    },

    nextStep: () => set((state) => {
        const steps = state.isBruteForce ? state.currentProblem?.brute_force_steps : state.currentProblem?.optimal_steps
        if (!steps || steps.length === 0) return state
        return { currentStepIndex: Math.min(state.currentStepIndex + 1, steps.length - 1) }
    }),

    prevStep: () => set((state) => ({
        currentStepIndex: Math.max(state.currentStepIndex - 1, 0)
    })),

    getPatternDependencies: (pattern: string) => {
        const mapping: Record<string, string> = {
            'sliding_window': 'two_pointers',
            'cyclic_sort': 'array_basics',
            'fast_slow_pointers': 'two_pointers',
            'merge_intervals': 'sorting_basics',
            'tree_dfs': 'recursion_basics',
            'graph_traversal': 'queue_stack_basics'
        }
        const basePattern = mapping[pattern]
        if (!basePattern) return null

        const { patternStats } = get()
        const baseStats = patternStats[basePattern]
        if (!baseStats || baseStats.confidence < 60) {
            return {
                basePattern,
                confidence: baseStats?.confidence || 0,
                isMet: false,
                message: "Improve base pattern first."
            }
        }
        return { basePattern, confidence: baseStats.confidence, isMet: true }
    },

    saveDrillProgress: (moduleId: string, subPatternId: string, answeredId: string, isCorrect: boolean) => {
        set((state) => {
            const moduleProgress = state.drillProgress[moduleId] || {}
            const subPatternProgress = moduleProgress[subPatternId] || {
                answeredIds: [],
                score: 0,
                accuracy: 0
            }

            if (subPatternProgress.answeredIds.includes(answeredId)) return state

            const newAnsweredIds = [...subPatternProgress.answeredIds, answeredId]
            const newScore = isCorrect ? subPatternProgress.score + 10 : subPatternProgress.score
            const newAccuracy = (newAnsweredIds.length > 0)
                ? (newScore / (newAnsweredIds.length * 10)) * 100
                : 0

            const updatedProgress = {
                ...state.drillProgress,
                [moduleId]: {
                    ...moduleProgress,
                    [subPatternId]: {
                        answeredIds: newAnsweredIds,
                        score: newScore,
                        accuracy: Math.round(newAccuracy)
                    }
                }
            }

            localStorage.setItem('algoScope_drillProgress', JSON.stringify(updatedProgress))
            return { drillProgress: updatedProgress }
        })
    }
}))
