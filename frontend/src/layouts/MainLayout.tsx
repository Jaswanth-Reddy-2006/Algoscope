import React from 'react'
import Sidebar from '../components/navigation/Sidebar'
import ErrorBoundary from '../components/common/ErrorBoundary'

interface MainLayoutProps {
    children: React.ReactNode
}

import { useStore } from '../store/useStore'

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    const fetchAllProblems = useStore(state => state.fetchAllProblems)

    React.useEffect(() => {
        fetchAllProblems()
    }, [fetchAllProblems])

    return (
        <div className="flex h-screen w-full bg-background text-foreground overflow-hidden">
            <Sidebar />
            <main className="flex-1 relative flex flex-col min-w-0 overflow-y-auto mesh-bg">
                <ErrorBoundary>
                    {children}
                </ErrorBoundary>
            </main>
        </div>
    )
}

export default MainLayout
