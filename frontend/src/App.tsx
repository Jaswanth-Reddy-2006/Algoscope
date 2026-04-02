import React, { Suspense, lazy } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom'
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
const LeetCodeConnect = lazy(() => import('./pages/LeetCodeConnect'))
const Analysis = lazy(() => import('./pages/Analysis'))
const Settings = lazy(() => import('./pages/Settings'))
const NotFound = lazy(() => import('./pages/NotFound'))

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    // Development Bypass: Authentication is disabled for now
    return <>{children}</>;
};

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
                    <Route path="/login" element={<Navigate to="/" replace />} />
                    <Route path="/auth-success" element={<Navigate to="/" replace />} />
                    
                    {/* Public Routes */}
                    <Route path="/problems" element={<ProblemList />} />
                    <Route path="/foundations" element={<FoundationsLayout />} />
                    <Route path="/foundations/:category" element={<FoundationsLayout />} />

                    {/* Protected Routes */}
                    <Route path="/problems/:slug" element={<ProtectedRoute><ProblemLab /></ProtectedRoute>} />
                    <Route path="/pattern-profile" element={<ProtectedRoute><PatternProfile /></ProtectedRoute>} />
                    <Route path="/mastery/:pattern" element={<ProtectedRoute><PatternMastery /></ProtectedRoute>} />
                    <Route path="/connect-leetcode" element={<ProtectedRoute><LeetCodeConnect /></ProtectedRoute>} />
                    <Route path="/analysis" element={<ProtectedRoute><Analysis /></ProtectedRoute>} />
                    <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />

                    {/* Core Patterns - Strict Nesting (Protected) */}
                    <Route path="/foundations/core_patterns/:patternId" element={<ProtectedRoute><FoundationModule /></ProtectedRoute>} />
                    <Route path="/foundations/core_patterns/:patternId/:activeTab" element={<ProtectedRoute><FoundationModule /></ProtectedRoute>} />
                    <Route path="/foundations/core_patterns/:patternId/:activeTab/:subPatternId" element={<ProtectedRoute><FoundationModule /></ProtectedRoute>} />

                    {/* Basic Patterns / Legacy Fallback (Protected) */}
                    <Route path="/foundations/:category/:moduleId" element={<ProtectedRoute><FoundationModule /></ProtectedRoute>} />

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
            if (!problemStrategyRegistry[problem.slug] && !problem.slug.startsWith('pattern-drill-')) {
                // Changing to debug to reduce noise in production, as fallback visualization is used
                console.debug(`[Stabilization] Missing visualization strategy for: ${problem.title} (${problem.slug})`)
            }
        });
    }, [problems])

    return (
        <Router basename={(import.meta as any).env.BASE_URL}>
            <MainLayout>
                <AnimatedRoutes />
            </MainLayout>
        </Router>
    )
}

export default App
