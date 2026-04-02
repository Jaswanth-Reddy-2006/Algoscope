import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import {
    Settings as SettingsIcon, Link2, User, Bell, ChevronRight,
    Palette, Info, MessageSquare, Shield, Zap, Check,
    Globe, Mail, Layers, ArrowRight
} from 'lucide-react';
import LeetCodeConnect from './LeetCodeConnect';

const NAV_ITEMS = [
    { id: 'profile', icon: User, label: 'Profile', desc: 'Identity' },
    { id: 'leetcode', icon: Link2, label: 'Connect', desc: 'LeetCode' },
    { id: 'themes', icon: Palette, label: 'Interface', desc: 'Theme' },
    { id: 'notifications', icon: Bell, label: 'Alerts', desc: 'Notifications' },
    { id: 'about', icon: Info, label: 'About', desc: 'System' },
    { id: 'contact', icon: MessageSquare, label: 'Support', desc: 'Help' },
] as const;

type TabId = typeof NAV_ITEMS[number]['id'];

const themes = [
    { name: 'Nebula Dark', color: '#0f0314', accent: '#EC4186', active: true },
    { name: 'Deep Space', color: '#000000', accent: '#6366f1', active: false },
    { name: 'Cyber Blue', color: '#050a1f', accent: '#3b82f6', active: false },
    { name: 'Matrix Green', color: '#010801', accent: '#22c55e', active: false },
];

const alerts = [
    { label: 'Weekly Mastery Report', desc: 'Sync your progress insights to your email.', active: true },
    { label: 'Daily Challenge Pings', desc: 'Receive alerts for new cognitive challenges.', active: false },
    { label: 'System Updates', desc: 'Stay informed about laboratory upgrades.', active: true },
];

const Toggle = ({ active, onToggle }: { active: boolean; onToggle: () => void }) => (
    <motion.button
        onClick={onToggle}
        className={`relative w-11 h-6 rounded-full transition-colors duration-300 ${active ? 'bg-[#EC4186]' : 'bg-white/10'}`}
    >
        <motion.div
            layout
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-md"
            style={{ left: active ? 'calc(100% - 20px)' : '4px' }}
        />
        {active && (
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute inset-0 rounded-full bg-[#EC4186]/20 blur-md"
            />
        )}
    </motion.button>
);

const contentVariants = {
    initial: { opacity: 0, x: 20, filter: 'blur(4px)' },
    animate: { opacity: 1, x: 0, filter: 'blur(0px)' },
    exit: { opacity: 0, x: -20, filter: 'blur(4px)' },
};

const Settings: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const initialTab = (searchParams.get('tab') as TabId) || 'profile';
    const [activeTab, setActiveTab] = useState<TabId>(initialTab);
    const [alertStates, setAlertStates] = useState(alerts.map(a => a.active));
    const [selectedTheme, setSelectedTheme] = useState(0);
    const isHub = searchParams.get('hub') === 'true';

    // Assuming useStore is a custom hook that provides the token
    // If not, replace with localStorage.getItem('algoscope_token')
    // Assuming useStore is a custom hook that provides the token
    // If not, replace with localStorage.getItem('algoscope_token')
    const { token } = { token: localStorage.getItem('algoscope_token') }; // Placeholder for useStore()

    // Sync token with browser extension
    useEffect(() => {
        if (token) {
            window.dispatchEvent(new CustomEvent('ALGO_SYNC_TOKEN', { detail: { token } }));
        }
    }, [token]);

    useEffect(() => {
        const tab = searchParams.get('tab') as TabId;
        if (tab && NAV_ITEMS.some(i => i.id === tab)) setActiveTab(tab);
    }, [searchParams]);

    const handleTabChange = (id: TabId) => {
        setActiveTab(id);
        setSearchParams({ tab: id });
    };

    const user = JSON.parse(localStorage.getItem('algoscope_user') || '{}');


    return (
        <div className="flex-1 min-h-screen bg-gradient-to-b from-[#0c0218] to-[#0f0314] font-outfit overflow-y-auto">
            {/* Ambient Background */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#EC4186]/5 blur-[150px] rounded-full" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#6b21a8]/5 blur-[150px] rounded-full" />
            </div>

            <div className="relative z-10 max-w-5xl mx-auto p-8 pb-16">
                {/* Page Header */}
                <AnimatePresence>
                    {!isHub && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="flex items-center justify-between mb-10"
                        >
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <div className="absolute inset-0 rounded-2xl bg-[#EC4186] blur-md opacity-30" />
                                    <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-br from-[#EC4186] to-[#EE544A] flex items-center justify-center">
                                        <SettingsIcon size={20} className="text-white" />
                                    </div>
                                </div>
                                <div>
                                    <h1 className="text-2xl font-black text-white uppercase tracking-tight">User Settings</h1>
                                    <p className="text-white/30 text-[9px] font-bold uppercase tracking-[0.25em]">Account & Preferences</p>
                                </div>
                            </div>
        
                        </motion.div>
                    )}
                </AnimatePresence>


                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Sidebar */}
                    {!isHub && (
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="lg:col-span-1"
                        >
                            {/* User mini card */}
                            <div className="mb-4 p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#EC4186] to-[#EE544A] flex items-center justify-center text-white font-black text-sm">
                                        {(user.username || 'U')[0].toUpperCase()}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-white font-bold text-sm truncate">{user.username || 'Explorer'}</p>
                                        <p className="text-[#EC4186] text-[9px] font-black uppercase tracking-widest">{user.experience || 'Neophyte'}</p>
                                    </div>
                                </div>
                            </div>

                            <nav className="space-y-1">
                                {NAV_ITEMS.map((item, i) => {
                                    const isActive = activeTab === item.id;
                                    return (
                                        <motion.button
                                            key={item.id}
                                            initial={{ opacity: 0, x: -15 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.05 * i }}
                                            onClick={() => handleTabChange(item.id)}
                                            className={`w-full flex items-center justify-between p-3.5 rounded-xl transition-all duration-300 group ${
                                                isActive
                                                    ? 'bg-[#EC4186]/10 border border-[#EC4186]/20 text-[#EC4186]'
                                                    : 'text-white/40 hover:text-white hover:bg-white/[0.04] border border-transparent'
                                            }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors duration-300 ${
                                                    isActive ? 'bg-[#EC4186]/20' : 'bg-white/5 group-hover:bg-white/10'
                                                }`}>
                                                    <item.icon size={14} />
                                                </div>
                                                <div className="text-left">
                                                    <p className="text-[11px] font-black uppercase tracking-wider">{item.label}</p>
                                                    <p className={`text-[8px] font-medium uppercase tracking-widest ${isActive ? 'text-[#EC4186]/60' : 'text-white/20'}`}>{item.desc}</p>
                                                </div>
                                            </div>
                                            <motion.div
                                                animate={{ opacity: isActive ? 1 : 0, x: isActive ? 0 : -4 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                <ChevronRight size={12} />
                                            </motion.div>
                                        </motion.button>
                                    );
                                })}
                            </nav>
                        </motion.div>
                    )}

                    {/* Content Panel */}
                    <div className={isHub ? "lg:col-span-4" : "lg:col-span-3"}>
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                variants={contentVariants}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                                transition={{ duration: 0.25 }}
                                className="relative rounded-[32px] bg-white/[0.02] border border-white/[0.07] backdrop-blur-xl overflow-hidden min-h-[520px] shadow-[0_20px_60px_rgba(0,0,0,0.4)]"
                            >
                                {/* Subtle gradient top accent */}
                                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#EC4186]/30 to-transparent" />

                                <div className={activeTab === 'leetcode' ? '' : 'p-8'}>

                                    {/* PROFILE TAB */}
                                    {activeTab === 'profile' && (
                                        <div className="space-y-8">
                                            <div className="flex items-center gap-2 mb-6">
                                                <User size={14} className="text-[#EC4186]" />
                                                <h2 className="text-[11px] font-black text-white/40 uppercase tracking-widest">Profile Information</h2>
                                            </div>

                                            {/* Avatar & name */}
                                            <div className="flex items-center gap-6 p-6 rounded-2xl bg-gradient-to-r from-[#EC4186]/5 to-transparent border border-[#EC4186]/10">
                                                <div className="relative group cursor-pointer">
                                                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#EC4186] to-[#EE544A] p-[2px] shadow-[0_0_30px_rgba(236,65,134,0.3)]">
                                                        <div className="w-full h-full rounded-[14px] bg-[#0f0314] flex items-center justify-center text-3xl font-black text-white">
                                                            {(user.username || 'U')[0].toUpperCase()}
                                                        </div>
                                                    </div>
                                                    <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#EC4186] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <Zap size={10} className="text-white" />
                                                    </div>
                                                </div>
                                                <div>
                                                    <h2 className="text-2xl font-black text-white tracking-tight">{user.username || 'Explorer'}</h2>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className="text-[#EC4186] text-[9px] font-black uppercase tracking-widest bg-[#EC4186]/10 px-2 py-0.5 rounded-full border border-[#EC4186]/20">
                                                            {user.experience || 'Neophyte'}
                                                        </span>
                                                        <span className="text-white/20 text-[9px] font-bold uppercase tracking-widest">•</span>
                                                        <span className="text-white/30 text-[9px] font-bold uppercase tracking-widest">{user.language || 'js'}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Details grid */}
                                            <div className="grid grid-cols-2 gap-4">
                                                {[
                                                    { label: 'Email Address', value: user.email || 'Not verified', icon: Mail },
                                                    { label: 'Preferred Language', value: user.language || 'JavaScript', icon: Globe },
                                                    { label: 'Experience Level', value: user.experience || 'Beginner', icon: Zap },
                                                    { label: 'Member Since', value: '2026', icon: Shield },
                                                ].map((field, i) => (
                                                    <motion.div
                                                        key={field.label}
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: i * 0.07 }}
                                                        className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl group hover:border-white/10 transition-all duration-300"
                                                    >
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <field.icon size={11} className="text-white/20 group-hover:text-[#EC4186] transition-colors" />
                                                            <label className="text-[11px] font-black text-white/20 uppercase tracking-widest">{field.label}</label>
                                                        </div>
                                                        <p className="text-white/70 text-sm font-medium truncate">{field.value}</p>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* LEETCODE TAB */}
                                    {activeTab === 'leetcode' && (
                                        <div className="-m-0">
                                            <LeetCodeConnect />
                                        </div>
                                    )}

                                    {/* THEMES TAB */}
                                    {activeTab === 'themes' && (
                                        <div className="space-y-8">
                                            <div className="flex items-center gap-2">
                                                <Palette size={14} className="text-[#EC4186]" />
                                                <h2 className="text-[11px] font-black text-white/40 uppercase tracking-widest">Interface Theme</h2>
                                            </div>

                                            <div className="grid grid-cols-2 gap-3">
                                                {themes.map((theme, i) => (
                                                    <motion.button
                                                        key={theme.name}
                                                        initial={{ opacity: 0, scale: 0.95 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        transition={{ delay: i * 0.07 }}
                                                        onClick={() => setSelectedTheme(i)}
                                                        className={`p-5 rounded-2xl border flex items-start justify-between transition-all duration-300 ${
                                                            selectedTheme === i
                                                                ? 'border-[#EC4186]/40 bg-[#EC4186]/5 shadow-[0_0_20px_rgba(236,65,134,0.1)]'
                                                                : 'border-white/5 bg-white/[0.02] hover:border-white/10'
                                                        }`}
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <div className="relative w-10 h-10 rounded-xl border border-white/10 overflow-hidden"
                                                                style={{ backgroundColor: theme.color }}>
                                                                <div className="absolute bottom-0 left-0 right-0 h-3"
                                                                    style={{ backgroundColor: theme.accent, opacity: 0.6 }} />
                                                            </div>
                                                            <span className={`text-xs font-black uppercase tracking-wider ${selectedTheme === i ? 'text-white' : 'text-white/40'}`}>
                                                                {theme.name}
                                                            </span>
                                                        </div>
                                                        <AnimatePresence>
                                                            {selectedTheme === i && (
                                                                <motion.div
                                                                    initial={{ scale: 0 }}
                                                                    animate={{ scale: 1 }}
                                                                    exit={{ scale: 0 }}
                                                                    className="w-5 h-5 rounded-full bg-[#EC4186] flex items-center justify-center shadow-[0_0_10px_#EC4186]"
                                                                >
                                                                    <Check size={10} className="text-white" />
                                                                </motion.div>
                                                            )}
                                                        </AnimatePresence>
                                                    </motion.button>
                                                ))}
                                            </div>

                                            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5">
                                                <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest">Note: Additional themes coming in the next neural engine update.</p>
                                            </div>
                                        </div>
                                    )}

                                    {/* NOTIFICATIONS TAB */}
                                    {activeTab === 'notifications' && (
                                        <div className="space-y-8">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-xl bg-[#EC4186]/10 flex items-center justify-center">
                                                    <Bell size={16} className="text-[#EC4186]" />
                                                </div>
                                                <h2 className="text-[12px] font-black text-white uppercase tracking-widest">Neural Alert Protocols</h2>
                                            </div>

                                            <div className="space-y-4">
                                                {alerts.map((item, i) => (
                                                    <motion.div
                                                        key={item.label}
                                                        initial={{ opacity: 0, x: -10 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: i * 0.08 }}
                                                        className="p-6 rounded-[28px] bg-white/[0.02] border border-white/5 hover:border-white/10 hover:bg-white/[0.03] transition-all duration-300 relative overflow-hidden group"
                                                    >
                                                        <div className="flex items-center justify-between relative z-10">
                                                            <div className="space-y-1.5">
                                                                <div className="flex items-center gap-3">
                                                                    <div className={`w-2 h-2 rounded-full shadow-[0_0_10px_currentColor] ${alertStates[i] ? 'text-[#EC4186] bg-[#EC4186]' : 'text-white/20 bg-white/20'}`} />
                                                                    <p className="text-sm font-black text-white uppercase tracking-wider group-hover:text-[#EC4186] transition-colors">{item.label}</p>
                                                                </div>
                                                                <p className="text-[11px] text-white/30 ml-5 font-medium leading-relaxed max-w-sm">{item.desc}</p>
                                                            </div>
                                                            <div className="px-4">
                                                                <Toggle
                                                                    active={alertStates[i]}
                                                                    onToggle={() => {
                                                                        const next = [...alertStates];
                                                                        next[i] = !next[i];
                                                                        setAlertStates(next);
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                        {alertStates[i] && (
                                                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#EC4186]/5 blur-[60px] rounded-full pointer-events-none" />
                                                        )}
                                                    </motion.div>
                                                ))}
                                            </div>

                                            <div className="p-6 rounded-[24px] bg-white/[0.02] border border-white/5 border-dashed">
                                                <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em] text-center italic">Encryption Key: SHA-256 Enabled for all transmissions</p>
                                            </div>
                                        </div>
                                    )}                                    {/* ABOUT TAB */}
                                    {activeTab === 'about' && (
                                        <div className="space-y-10">
                                            <div className="text-center py-6">
                                                <motion.div
                                                    animate={{ 
                                                        rotate: [0, 10, -10, 0], 
                                                        scale: [1, 1.1, 1],
                                                        boxShadow: [
                                                            '0 0 20px rgba(236,65,134,0.3)',
                                                            '0 0 60px rgba(236,65,134,0.6)',
                                                            '0 0 20px rgba(236,65,134,0.3)'
                                                        ]
                                                    }}
                                                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                                                    className="w-24 h-24 rounded-[2rem] bg-gradient-to-br from-[#EC4186] via-[#EE544A] to-[#38124A] flex items-center justify-center mx-auto mb-8 relative overflow-hidden group"
                                                >
                                                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.4),transparent)]" />
                                                    <Zap size={44} className="text-white relative z-10 group-hover:scale-110 transition-transform" />
                                                </motion.div>                                                <h2 className="text-4xl font-black text-white tracking-tighter uppercase mb-4">Core <span className="text-[#EC4186]">Engine</span></h2>
                                                 <p className="text-white/40 text-[11px] max-w-lg mx-auto leading-relaxed font-bold uppercase tracking-wider">
                                                     Algoscope is a next-generation platform designed to bridge the gap between abstract algorithmic theory and intuitive visualization.
                                                 </p>
                                             </div>

                                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                 <div className="p-6 rounded-[32px] bg-white/[0.02] border border-white/5 space-y-4 shadow-inner">
                                                     <div className="p-3 rounded-2xl bg-[#EC4186]/10 w-fit">
                                                         <Layers size={20} className="text-[#EC4186]" />
                                                     </div>
                                                     <h3 className="text-lg font-black text-white uppercase tracking-tight">System Integrity</h3>
                                                     <p className="text-[10px] text-white/30 font-bold tracking-widest leading-relaxed uppercase">
                                                         Zero-latency pattern recognition for all data streams. Distributed neural buffers ensure consistent performance.
                                                     </p>
                                                 </div>
                                                 <div className="p-6 rounded-[32px] bg-white/[0.02] border border-white/5 space-y-4 shadow-inner">
                                                     <div className="p-3 rounded-2xl bg-[#EE544A]/10 w-fit">
                                                         <Shield size={20} className="text-[#EE544A]" />
                                                     </div>
                                                     <h3 className="text-lg font-black text-white uppercase tracking-tight">Encryption Profile</h3>
                                                     <p className="text-[10px] text-white/30 font-bold tracking-widest leading-relaxed uppercase">
                                                         Secure synchronization with military-grade protocols to protect your cognitive archive and history.
                                                     </p>
                                                 </div>
                                             </div>

                                             <div className="p-8 rounded-[40px] bg-white/[0.02] border border-white/5 relative overflow-hidden shadow-glow">
                                                 <div className="flex items-center justify-between mb-8">
                                                     <div className="flex items-center gap-3">
                                                         <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                                         <span className="text-[9px] font-black text-white/40 uppercase tracking-[0.4em]">Tracker Module Interface</span>
                                                     </div>
                                                     <span className="text-[9px] font-black text-white/20 uppercase">Core Status: ACTIVE</span>
                                                 </div>
                                                 <div className="space-y-4">
                                                     <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-lg bg-[#EC4186]/20 flex items-center justify-center">
                                                                <Zap size={14} className="text-[#EC4186]" />
                                                            </div>
                                                            <span className="text-[11px] font-bold text-white uppercase tracking-wider">Browser Companion</span>
                                                        </div>
                                                        <span className="text-[9px] font-black text-[#22c55e] uppercase tracking-widest">CONNECTED</span>
                                                     </div>
                                                     <p className="text-[10px] text-white/30 leading-relaxed font-bold px-2 uppercase tracking-wide">
                                                         Fully integrated with the LeetCode cognitive stream. Synchronization active for all solved nodes.
                                                      </p>
                                                 </div>
                                             </div>

                                            <div className="flex items-center gap-4">
                                                <button className="flex-1 py-4 rounded-2xl bg-[#EC4186]/5 border border-[#EC4186]/10 hover:bg-[#EC4186]/10 text-[#EC4186]/70 hover:text-[#EC4186] font-black text-[10px] uppercase tracking-widest transition-all">Protocol Documentation</button>
                                                <button className="flex-1 py-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] text-white/40 hover:text-white font-black text-[10px] uppercase tracking-widest transition-all">Open-Source License</button>
                                            </div>
                                        </div>
                                    )}

                                    {/* CONTACT/SUPPORT TAB */}
                                    {activeTab === 'contact' && (
                                        <div className="space-y-8">
                                            <div className="flex items-center gap-3">
                                               <div className="w-10 h-10 rounded-2xl bg-[#EC4186]/10 flex items-center justify-center border border-[#EC4186]/20">
                                                   <MessageSquare size={20} className="text-[#EC4186]" />
                                               </div>
                                               <h2 className="text-lg font-black text-white uppercase tracking-tight">Technical Dispatch</h2>
                                            </div>

                                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                               {/* Left: Direct Signals */}
                                               <div className="space-y-4">
                                                   <div className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mb-4">Urgent Signals</div>
                                                   {[
                                                       { label: 'Neural Mailbox', value: 'dispatch@algoscope.io', icon: Mail },
                                                       { label: 'Tactical Radio', value: '@algoscope_support', icon: Zap },
                                                   ].map((item, i) => (
                                                       <div key={i} className="p-5 rounded-3xl bg-white/[0.02] border border-white/5 flex items-center justify-between group cursor-pointer hover:bg-white/[0.04] transition-all">
                                                           <div className="flex items-center gap-4">
                                                               <div className="p-3 rounded-xl bg-white/5 group-hover:bg-[#EC4186]/20 transition-colors">
                                                                   <item.icon size={16} className="text-white/40 group-hover:text-[#EC4186]" />
                                                               </div>
                                                               <div>
                                                                   <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">{item.label}</p>
                                                                   <p className="text-xs font-bold text-white group-hover:text-[#EC4186] transition-colors">{item.value}</p>
                                                               </div>
                                                           </div>
                                                           <ArrowRight size={14} className="text-white/10 group-hover:text-[#EC4186] group-hover:translate-x-1 transition-all" />
                                                       </div>
                                                   ))}
                                                </div>

                                                {/* Right: Anomaly Report Form */}
                                                <div className="p-8 rounded-[40px] bg-white/[0.03] border border-white/10 relative overflow-hidden group">
                                                    <div className="relative z-10 space-y-6">
                                                        <div className="space-y-1">
                                                            <h3 className="text-xl font-black text-white uppercase tracking-tight">Anomaly Report</h3>
                                                            <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest">Protocol Version: Alpha-Omega</p>
                                                        </div>
                                                        
                                                        <div className="space-y-4">
                                                            <div className="space-y-2">
                                                                <label className="text-[9px] font-black text-[#EC4186] uppercase tracking-[0.2em] ml-1">Subject Matter</label>
                                                                <select className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-[11px] font-bold text-white uppercase focus:border-[#EC4186] outline-none appearance-none cursor-pointer">
                                                                    <option>SYSTEM ANOMALY (BUG)</option>
                                                                    <option>FEATURE ENHANCEMENT</option>
                                                                    <option>VISUALIZATION GLITCH</option>
                                                                    <option>NEURAL SYNC ISSUE</option>
                                                                </select>
                                                            </div>
                                                            <div className="space-y-2">
                                                                <label className="text-[9px] font-black text-[#EC4186] uppercase tracking-[0.2em] ml-1">Evidence / Description</label>
                                                                <textarea 
                                                                   placeholder="DESCRIBE THE COGNITIVE DISSONANCE..."
                                                                   className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-[11px] font-bold text-white uppercase focus:border-[#EC4186] outline-none min-h-[140px] resize-none"
                                                                />
                                                            </div>
                                                            <button className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#EC4186] to-[#EE544A] text-white text-[11px] font-black uppercase tracking-[0.3em] shadow-glow hover:scale-[1.02] transition-all">Submit Signal</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="p-8 rounded-[32px] bg-gradient-to-br from-[#EC4186]/5 to-transparent border border-white/5 text-center">
                                                <p className="text-[11px] font-bold text-white/40 uppercase tracking-[0.2em] mb-4">Laboratory Uptime</p>
                                                <div className="flex justify-center gap-1.5 h-8 items-end max-w-lg mx-auto">
                                                    {[1,1,1,1,0.8,1,1,1,1,1,0.9,1,1,1,1,1,1,0.95,1,1,1,1,1,1,1,1,1,1,1,1].map((v, i) => (
                                                        <div key={i} className="flex-1 rounded-full group relative" style={{ opacity: v, backgroundColor: v === 1 ? '#22c55e' : v > 0.9 ? '#eab308' : '#EC4186', height: `${v*100}%` }}>
                                                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-2 bg-black border border-white/10 rounded-lg text-[8px] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                                                                Day {30-i}: {v === 1 ? '100% Nominal' : (v*100).toFixed(1)+'% Anomaly'}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
