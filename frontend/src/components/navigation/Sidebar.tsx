import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Play,
    Menu,
    Boxes,
    Layers,
    ChevronLeft,
    Activity,
    User as UserIcon,
    LayoutGrid,
    X,
    Palette,
    Bell,
    MessageSquare,
    Info,
    Link2
} from 'lucide-react'
import { cn } from '../../utils/cn'
import { useStore } from '../../store/useStore'

const Sidebar: React.FC = () => {
    const navigate = useNavigate()
    const isSidebarCollapsed = useStore(state => state.isSidebarCollapsed)
    const setSidebarCollapsed = useStore(state => state.setSidebarCollapsed)
    const [isMobileOpen, setIsMobileOpen] = React.useState(false)
    const location = useLocation()
    const [isHovered, setIsHovered] = React.useState(false)
    const isHubOpen = useStore(state => state.isHubOpen)
    const setHubOpen = useStore(state => state.setHubOpen)

    // Auto-collapse only for individual question pages (to give focus)
    // Foundations and main library remain manually controlled
    React.useEffect(() => {
        if (location.pathname.startsWith('/problems/') && location.pathname !== '/problems') {
            setSidebarCollapsed(true)
        } else {
            // Uncollapse when leaving a problem page to restore navigation
            setSidebarCollapsed(false)
        }
    }, [location.pathname, setSidebarCollapsed])

    const user = React.useMemo(() => {
        const userData = localStorage.getItem('algoscope_user')
        return userData ? JSON.parse(userData) : null
    }, [])


    // Derived state: effectively open if not collapsed OR if hovered
    const isExpanded = !isSidebarCollapsed || isHovered

    const NavItem = ({ to, icon: Icon, label, badge }: { to: string, icon: any, label: string, badge?: string }) => {
        const isActive = location.pathname.startsWith(to) && to !== '/' || (to === '/' && location.pathname === '/')

        return (
            <Link
                to={to}
                className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all group relative overflow-hidden shrink-0",
                    isActive
                        ? "bg-[#EC4186]/20 text-[#EC4186] shadow-inner"
                        : "text-white/50 hover:text-white hover:bg-white/[0.03]"
                )}
                onClick={() => {
                    setIsMobileOpen(false)
                    setSidebarCollapsed(false) // Click to lock/open
                }}
            >
                <Icon size={20} className={cn("shrink-0", isActive ? "text-[#EC4186]" : "text-inherit")} />
                <div className={cn(
                    "flex-1 flex items-center justify-between overflow-hidden transition-all duration-300",
                    isExpanded ? "w-auto opacity-100" : "w-0 opacity-0"
                )}>
                    <span className="text-sm font-semibold truncate whitespace-nowrap">{label}</span>
                    {badge && (
                        <span className="text-[9px] font-bold bg-[#EC4186] text-white px-1.5 py-0.5 rounded uppercase tracking-widest">
                            {badge}
                        </span>
                    )}
                </div>
                {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#EC4186] rounded-r-full shadow-[0_0_10px_rgba(236,65,134,0.5)]" />
                )}
            </Link>
        )
    }

    return (
        <>
            {/* Mobile Header Toggle */}
            <div className="lg:hidden fixed top-0 left-0 w-full h-20 px-8 flex items-center justify-between z-40 bg-[#38124A]/80 backdrop-blur-xl border-b border-white/5">
                <div className="flex items-center gap-3 group">
                    <div className="w-10 h-10 rounded-xl bg-[#EC4186]/20 flex items-center justify-center">
                        <Play size={20} className="text-[#EC4186]" />
                    </div>
                    <span className="font-bold tracking-tight text-lg text-white uppercase tracking-widest">Algoscope</span>
                </div>
                <button
                    onClick={() => setIsMobileOpen(true)}
                    className="p-3 bg-white/5 rounded-xl text-white/60 hover:text-white"
                >
                    <Menu size={24} />
                </button>
            </div>

            {/* Backdrop for mobile */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 lg:hidden"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            <aside
                onMouseEnter={() => {
                    if (isSidebarCollapsed) setIsHovered(true)
                }}
                onMouseLeave={() => {
                    setIsHovered(false)
                }}
                className={cn(
                    "fixed inset-y-0 left-0 z-50 bg-[#38124A]/50 backdrop-blur-2xl border-r border-white/5 flex flex-col transition-all duration-300 ease-in-out font-outfit",
                    "lg:relative lg:translate-x-0 h-screen overflow-hidden",
                    isExpanded ? "w-[240px]" : "w-[72px]",
                    isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
                    isHovered && isSidebarCollapsed && "bg-[#38124A]/95 shadow-2xl"
                )}
            >
                {/* Header / Branding */}
                <div className="h-24 px-6 flex items-center justify-between border-b border-white/5 shrink-0 overflow-hidden">
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 shrink-0 rounded-xl bg-[#EC4186]/20 flex items-center justify-center group-hover:bg-[#EC4186]/30 transition-all duration-500 shadow-glow">
                             <Play size={18} className="text-[#EC4186] fill-current" />
                        </div>
                        <div className={cn(
                            "flex flex-col transition-all duration-300",
                            isExpanded ? "opacity-100 w-auto" : "opacity-0 w-0"
                        )}>
                            <span className="font-black tracking-tighter text-lg text-white uppercase tracking-[0.2em] whitespace-nowrap">
                                Algoscope
                            </span>
                        </div>
                    </Link>

                    {/* Manual Collapse Button */}
                    {isExpanded && (
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                setSidebarCollapsed(true);
                            }}
                            className="p-2 rounded-xl hover:bg-white/5 text-white/30 hover:text-[#EC4186] transition-all duration-300"
                        >
                            <ChevronLeft size={16} />
                        </button>
                    )}
                </div>

                {/* Main Navigation */}
                <div className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-6 custom-scrollbar flex flex-col gap-8">
                    <div className="flex flex-col gap-1.5">
                        <NavItem to="/problems" icon={Boxes} label="Patterns Library" />
                        <NavItem to="/pattern-profile" icon={Activity} label="Pattern Profile" />
                        <NavItem to="/foundations" icon={Layers} label="Foundations Lab" />
                    </div>
                </div>

                {/* User Profile Footer / Login */}
                <div className="mt-auto border-t border-white/5 p-4 shrink-0">
                    <button
                        onClick={() => {
                            setHubOpen(true);
                            navigate('/settings?tab=profile&hub=true');
                        }}
                        className={cn(
                            "w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-300",
                            "bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-white/10 group/profile"
                        )}
                    >
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#EC4186] to-[#EE544A] p-[1px] shrink-0">
                            <div className="w-full h-full rounded-lg bg-[#38124A] flex items-center justify-center">
                                <UserIcon size={14} className="text-white/40 group-hover/profile:text-white transition-colors" />
                            </div>
                        </div>
                        <div className={cn(
                            "flex-1 text-left transition-all duration-300 overflow-hidden",
                            isExpanded ? "opacity-100 w-auto" : "opacity-0 w-0"
                        )}>
                            <p className="text-xs font-bold text-white truncate uppercase tracking-tighter">
                                {user?.username || 'Guest'}
                            </p>
                        </div>
                    </button>
                </div>

                {/* Profile Side Drawer (Overlay) */}
                <AnimatePresence>
                    {isHubOpen && user && (
                        <>
                            {/* Backdrop */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setHubOpen(false)}
                                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[45]"
                            />
                            
                            {/* Drawer */}
                            <motion.div
                                initial={{ x: '-100%' }}
                                animate={{ x: 0 }}
                                exit={{ x: '-100%' }}
                                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                                className="fixed inset-y-0 left-0 w-[300px] bg-[#0f0314] border-r border-white/5 z-[70] shadow-2xl flex flex-col p-8 font-outfit"
                            >
                                <div className="flex items-center justify-between mb-12">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#EC4186] to-[#EE544A] p-0.5 shadow-glow">
                                            <div className="w-full h-full rounded-[14px] bg-[#0f0314] flex items-center justify-center text-xl">
                                                🧬
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-black text-white uppercase tracking-tighter">
                                                {user?.username || 'Guest'}
                                            </h3>
                                            <p className="text-[10px] text-[#EC4186] font-bold uppercase tracking-widest leading-none">
                                                {user?.experience || 'Explorer'}
                                            </p>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => setHubOpen(false)}
                                        className="p-2 rounded-xl bg-white/5 text-white/20 hover:text-white transition-all"
                                    >
                                        <X size={18} />
                                    </button>
                                </div>

                                <div className="flex-1 space-y-1 overflow-y-auto custom-scrollbar pr-2">
                                    <DrawerItem 
                                        to="/settings?tab=profile&hub=true" 
                                        icon={UserIcon} 
                                        label="Master Profile" 
                                    />
                                    <DrawerItem 
                                        to="/settings?tab=leetcode&hub=true" 
                                        icon={Link2} 
                                        label="Connect" 
                                    />
                                    <DrawerItem 
                                        to="/settings?tab=themes&hub=true" 
                                        icon={Palette} 
                                        label="Interface" 
                                    />
                                    <DrawerItem 
                                        to="/settings?tab=notifications&hub=true" 
                                        icon={Bell} 
                                        label="Alerts" 
                                    />
                                    <DrawerItem 
                                        to="/settings?tab=about&hub=true" 
                                        icon={Info} 
                                        label="About" 
                                    />
                                    <DrawerItem 
                                        to="/settings?tab=contact&hub=true" 
                                        icon={MessageSquare} 
                                        label="Support" 
                                    />
                                    
                                    <div className="pt-6 mt-6 border-t border-white/5">
                                        <button 
                                            onClick={() => {
                                                setHubOpen(false)
                                                if (location.pathname === '/settings') {
                                                    navigate('/problems')
                                                }
                                            }}
                                            className={cn(
                                                "w-full flex items-center gap-3 p-4 rounded-2xl transition-all duration-300",
                                                "bg-[#EC4186] text-white font-black uppercase tracking-[0.2em] text-[10px] shadow-glow hover:scale-[1.02] active:scale-[0.98]"
                                            )}
                                        >
                                            <LayoutGrid size={16} />
                                            <span>Exit Hub</span>
                                        </button>
                                    </div>
                                </div>

                                <div className="pt-8 text-center text-[8px] font-black text-white/10 uppercase tracking-[0.5em]">
                                    Neural Link Protocol Active
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </aside>
        </>
    )
}

const DrawerItem = ({ to, icon: Icon, label }: { to: string, icon: any, label: string }) => {
    const location = useLocation()
    const isActive = location.pathname + location.search === to

    return (
        <Link
            to={to}
            className={cn(
                "flex items-center gap-4 p-4 rounded-2xl transition-all group border",
                isActive 
                    ? "bg-[#EC4186]/10 border-[#EC4186]/20 text-white shadow-inner" 
                    : "text-white/40 hover:text-white hover:bg-white/5 border-transparent hover:border-white/5"
            )}
        >
            <Icon size={18} className={isActive ? "text-[#EC4186]" : "group-hover:text-[#EC4186] transition-colors"} />
            <span className="text-xs font-bold uppercase tracking-[0.2em]">{label}</span>
            <ChevronLeft size={14} className={cn("ml-auto transition-all rotate-180", isActive ? "text-[#EC4186] opacity-100" : "opacity-0 group-hover:opacity-100")} />
        </Link>
    )
}

export default Sidebar
