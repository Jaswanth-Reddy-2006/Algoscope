import React, { Suspense, lazy } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import { AnimatePresence } from 'framer-motion'
import { useStore } from './store/useStore'
import { problemStrategyRegistry } from './registry/problemStrategyRegistry'

// Lazy Load Pages
const Home = lazy(() => import('./pages/Home'))
const ProblemList = lazy(() => import('./pages/ProblemList'))
const ProblemLab = lazy(() => import('./pages/ProblemLab'))
const PatternProfile = lazy(() => import('./pages/PatternProfile'))
const PatternMastery = lazy(() => import('./pages/PatternMastery'))
const FoundationsLayout = lazy(() => import('./pages/FoundationsLayout'))
const FoundationModule = lazy(() => import('./components/foundations/FoundationModule'))
const NotFound = lazy(() => import('./pages/NotFound'))

const PageLoader = () => (
    <div className="flex-1 flex items-center justify-center mesh-bg">
        <div className="w-12 h-12 border-2 border-accent-blue/10 border-t-accent-blue rounded-full animate-spin" />
    </div>
)

const AnimatedRoutes = () => {
    const location = useLocation()
    return (
        <AnimatePresence mode="wait">
            <Suspense fallback={<PageLoader />}>
                <Routes location={location} key={location.pathname}>
                    <Route path="/" element={<Home />} />
                    <Route path="/problems" element={<ProblemList />} />
                    <Route path="/problems/:slug" element={<ProblemLab />} />
                    <Route path="/pattern-profile" element={<PatternProfile />} />
                    <Route path="/mastery/:pattern" element={<PatternMastery />} />

                    {/* Foundations - Standard Redirect */}
                    <Route path="/foundations" element={<FoundationsLayout />} />

                    {/* Core Patterns - Strict Nesting */}
                    <Route path="/foundations/core_patterns/:patternId" element={<FoundationModule />} />
                    <Route path="/foundations/core_patterns/:patternId/:activeTab" element={<FoundationModule />} />
                    <Route path="/foundations/core_patterns/:patternId/:activeTab/:subPatternId" element={<FoundationModule />} />

                    {/* Basic Patterns / Legacy Fallback */}
                    <Route path="/foundations/:category" element={<FoundationsLayout />} />
                    <Route path="/foundations/:category/:moduleId" element={<FoundationModule />} />

                    <Route path="*" element={<NotFound />} />
                </Routes>
            </Suspense>
        </AnimatePresence>
    )
}


const App: React.FC = () => {
    const checkSkillDecay = useStore(state => state.checkSkillDecay)
    const initializeStore = useStore(state => state.initializeStore)
    const problems = useStore(state => state.problems)

    React.useEffect(() => {
        initializeStore()
        checkSkillDecay()
    }, [checkSkillDecay, initializeStore])

    // Strict Strategy Validation (Master Fix)
    React.useEffect(() => {
        problems.forEach(problem => {
            if (!problemStrategyRegistry[problem.slug]) {
                console.warn(`[Stabilization] Missing visualization strategy for: ${problem.title} (${problem.slug})`)
            }
        });
    }, [problems])

    return (
        <Router>
            <MainLayout>
                <AnimatedRoutes />
            </MainLayout>
        </Router>
    )
}

export default App
