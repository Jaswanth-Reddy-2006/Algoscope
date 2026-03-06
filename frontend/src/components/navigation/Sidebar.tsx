import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
    Play,
    Menu,
    Boxes,
    Brain,
    Layers,
    ChevronLeft
} from 'lucide-react'
import { cn } from '../../utils/cn'
import { useStore } from '../../store/useStore'

const Sidebar: React.FC = () => {
    const isSidebarCollapsed = useStore(state => state.isSidebarCollapsed)
    const setSidebarCollapsed = useStore(state => state.setSidebarCollapsed)
    const [isMobileOpen, setIsMobileOpen] = React.useState(false)
    const location = useLocation()
    const [isHovered, setIsHovered] = React.useState(false)

    // Auto-collapse only for individual question pages (to give focus)
    // Foundations and main library remain manually controlled
    React.useEffect(() => {
        if (location.pathname.startsWith('/problems/') && location.pathname !== '/problems') {
            setSidebarCollapsed(true)
        }
    }, [location.pathname, setSidebarCollapsed])

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
                {/* Header */}
                <div className="h-24 px-6 flex items-center justify-between border-b border-white/5 shrink-0 overflow-hidden">
                    <Link to="/" className="flex items-center gap-4 group">
                        <div className="w-10 h-10 shrink-0 rounded-xl bg-[#EC4186]/20 flex items-center justify-center group-hover:shadow-[0_0_15px_rgba(236,65,134,0.3)] transition-all duration-500">
                            <Play size={20} className="text-[#EC4186] fill-current" />
                        </div>
                        <div className={cn(
                            "flex flex-col transition-all duration-300",
                            isExpanded ? "opacity-100 w-auto" : "opacity-0 w-0"
                        )}>
                            <span className="font-bold tracking-tight text-sm leading-tight text-white uppercase tracking-widest whitespace-nowrap">Algoscope</span>
                        </div>
                    </Link>

                    {/* Manual Collapse Button */}
                    {isExpanded && (
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                setSidebarCollapsed(true); // Collapse manually
                            }}
                            className="p-2.5 rounded-xl hover:bg-white/5 text-white/30 hover:text-[#EC4186] transition-all duration-300"
                            title="Collapse Sidebar"
                        >
                            <ChevronLeft size={20} />
                        </button>
                    )}
                </div>



                {/* Content */}
                <div className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-8 custom-scrollbar flex flex-col gap-10">
                    <div className="flex flex-col gap-1.5">
                        <NavItem to="/problems" icon={Boxes} label="Pattern Library" />
                        <NavItem to="/pattern-profile" icon={Brain} label="Pattern Profile" />
                        <NavItem to="/foundations" icon={Layers} label="Foundations Lab" />
                    </div>
                </div>

                {/* Footer / Profile */}
                <div className="p-4 border-t border-white/5 shrink-0 overflow-hidden">
                    <div className={cn(
                        "flex items-center gap-3 p-3 rounded-2xl bg-white/[0.02] border border-white/5 group cursor-pointer hover:bg-white/[0.04] transition-all",
                        !isExpanded && "justify-center px-0 bg-transparent border-none shadow-none"
                    )}>
                        <div className="w-8 h-8 shrink-0 rounded-lg bg-gradient-to-tr from-[#EC4186] to-[#EE544A] p-[1px]">
                            <div className="w-full h-full rounded-lg bg-[#38124A] flex items-center justify-center p-0.5 overflow-hidden">
                                <div className="w-full h-full rounded-md bg-gradient-to-tr from-[#EC4186] to-[#EE544A] opacity-80" />
                            </div>
                        </div>
                        <div className={cn(
                            "flex flex-col transition-all duration-300",
                            isExpanded ? "opacity-100 w-auto" : "opacity-0 w-0"
                        )}>
                            <span className="text-[10px] font-bold text-white whitespace-nowrap">Jaswanth R.</span>
                            <span className="text-[9px] text-white/50 font-medium whitespace-nowrap">Architect</span>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    )
}

export default Sidebar
