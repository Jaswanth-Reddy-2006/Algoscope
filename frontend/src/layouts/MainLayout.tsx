import React from 'react'
import Sidebar from '../components/navigation/Sidebar'
import ErrorBoundary from '../components/common/ErrorBoundary'
import { useLocation } from 'react-router-dom'

interface MainLayoutProps {
    children: React.ReactNode
}

import { useStore } from '../store/useStore'

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    const fetchAllProblems = useStore(state => state.fetchAllProblems)
    const location = useLocation()
    const isAuthPage = location.pathname === '/login'
    const isLandingPage = location.pathname === '/'

    React.useEffect(() => {
        fetchAllProblems()
    }, [fetchAllProblems])

    return (
        <div className="flex h-screen w-full bg-background text-foreground overflow-hidden">
            <div id="algoscope-auth-token" data-token={localStorage.getItem('algoscope_token')} style={{ display: 'none' }}></div>
            {!isLandingPage && !isAuthPage && <Sidebar />}
            <main className={`flex-1 relative flex flex-col min-w-0 overflow-y-auto mesh-bg ${isLandingPage ? 'scroll-smooth' : ''}`}>
                <ErrorBoundary>
                    {children}
                </ErrorBoundary>
            </main>
        </div>
    )
}

export default MainLayout
