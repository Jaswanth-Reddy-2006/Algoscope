import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    Shield, Zap, Activity, Link2, ChevronRight,
    Trophy, Target, LogOut, Star, TrendingUp, BarChart3,
    CheckCircle, ArrowUpRight
} from 'lucide-react';
import { analyticsService } from '../services/api';
import { Link } from 'react-router-dom';

const StatCard = ({ icon: Icon, label, value, sub, color, delay }: any) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.5 }}
        className="relative p-6 rounded-2xl bg-white/[0.03] border border-white/[0.07] overflow-hidden group hover:border-white/15 transition-all duration-400"
    >
        {/* Hover glow */}
        <motion.div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
            style={{ background: `radial-gradient(circle at 30% 50%, ${color}12 0%, transparent 70%)` }}
        />
        <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${color}15` }}>
                    <Icon size={16} style={{ color }} />
                </div>
                <ArrowUpRight size={14} className="text-white/10 group-hover:text-white/30 transition-colors" />
            </div>
            <div className="text-3xl font-black text-white mb-1">{value}</div>
            <div className="text-[9px] font-bold text-white/40 uppercase tracking-widest">{label}</div>
            {sub && <div className="text-[8px] text-white/20 mt-1 uppercase font-bold tracking-widest">{sub}</div>}
        </div>
    </motion.div>
);

const DifficultyBadge = ({ count, label, color, bg, border }: any) => (
    <motion.div
        whileHover={{ scale: 1.02, y: -2 }}
        className={`p-5 rounded-2xl ${bg} ${border} flex flex-col items-center gap-2 border`}
    >
        <span className={`text-2xl font-black ${color}`}>{count}</span>
        <span className={`text-[8px] font-black uppercase tracking-[0.2em] ${color} opacity-60`}>{label}</span>
    </motion.div>
);

const Analysis: React.FC = () => {
    const [summary, setSummary] = useState<any>(null);
    const [proficiency, setProficiency] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const user = JSON.parse(localStorage.getItem('algoscope_user') || '{}');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [stats, prof] = await Promise.all([
                    analyticsService.getSummary(),
                    analyticsService.getProficiency()
                ]);
                setSummary(stats);
                setProficiency(prof);
            } catch (err) {
                console.error('Failed to fetch mastery data', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex-1 flex items-center justify-center bg-[#0c0218]">
                <div className="flex flex-col items-center gap-4">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-10 h-10 border-2 border-[#EC4186]/10 border-t-[#EC4186] rounded-full"
                    />
                    <span className="text-white/20 text-[9px] font-black uppercase tracking-[0.3em]">Syncing Neural Map...</span>
                </div>
            </div>
        );
    }

    const progressPct = Math.min(proficiency?.progress ?? 0, 100);

    return (
        <div className="flex-1 p-6 md:p-10 max-w-6xl mx-auto font-outfit overflow-y-auto">
            {/* Hero Profile Banner */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative p-8 rounded-3xl overflow-hidden mb-8 border border-white/[0.07]"
                style={{ background: 'linear-gradient(135deg, rgba(236,65,134,0.1) 0%, rgba(107,33,168,0.08) 50%, rgba(238,84,74,0.06) 100%)' }}
            >
                {/* Decorative background */}
                <div className="absolute -right-24 -top-24 w-80 h-80 bg-[#EC4186]/10 rounded-full blur-[100px]" />
                <div className="absolute -left-12 -bottom-12 w-48 h-48 bg-[#6b21a8]/10 rounded-full blur-[80px]" />

                <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8">
                    {/* Avatar */}
                    <div className="relative shrink-0">
                        <motion.div
                            animate={{ boxShadow: ['0 0 20px rgba(236,65,134,0.3)', '0 0 40px rgba(236,65,134,0.5)', '0 0 20px rgba(236,65,134,0.3)'] }}
                            transition={{ duration: 3, repeat: Infinity }}
                            className="w-24 h-24 rounded-[1.5rem] bg-gradient-to-br from-[#EC4186] to-[#EE544A] p-[2px]"
                        >
                            <div className="w-full h-full rounded-[calc(1.5rem-2px)] bg-[#0c0218] flex items-center justify-center text-4xl font-black text-white">
                                {(user.username || 'U')[0].toUpperCase()}
                            </div>
                        </motion.div>
                        <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-green-400 border-2 border-[#0c0218]"
                        />
                    </div>

                    {/* User Info */}
                    <div className="flex-1 text-center md:text-left space-y-2">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EC4186]/10 border border-[#EC4186]/20 mb-3">
                                <Star size={10} className="text-[#EC4186] fill-current" />
                                <span className="text-[9px] font-black text-[#EC4186] uppercase tracking-[0.3em]">{proficiency?.title || 'Initial Explorer'}</span>
                            </div>
                        </motion.div>
                        <h1 className="text-4xl font-black text-white tracking-tight">
                            {user.username || 'Practitioner'}
                        </h1>
                        <p className="text-white/40 text-sm">
                            Cognitive Level: <span className="text-white/60 font-bold capitalize">{user.experience || 'Beginner'}</span>
                            &nbsp;·&nbsp;
                            Primary Language: <span className="text-white/60 font-bold capitalize">{user.language || 'JavaScript'}</span>
                        </p>

                        {/* XP Progress bar */}
                        <div className="mt-4 max-w-xs">
                            <div className="flex items-center justify-between mb-1.5">
                                <span className="text-[8px] font-black text-white/30 uppercase tracking-widest">Level {proficiency?.level || 1} Progress</span>
                                <span className="text-[8px] font-black text-[#EC4186]">{progressPct.toFixed(0)}%</span>
                            </div>
                            <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progressPct}%` }}
                                    transition={{ duration: 1.5, ease: 'easeOut', delay: 0.5 }}
                                    className="h-full rounded-full bg-gradient-to-r from-[#EC4186] to-[#EE544A]"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-3 shrink-0">
                        <Link
                            to="/settings"
                            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all text-[10px] font-black uppercase tracking-widest group"
                        >
                            Settings
                            <ChevronRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                        </Link>
                        <button
                            onClick={() => {
                                localStorage.removeItem('algoscope_token');
                                localStorage.removeItem('algoscope_user');
                                window.location.href = '/login';
                            }}
                            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-red-500/5 border border-red-500/10 text-red-400/70 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/20 transition-all text-[10px] font-black uppercase tracking-widest"
                        >
                            <LogOut size={12} />
                            Log Out
                        </button>
                    </div>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left: Stats */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Metric Cards */}
                    <div className="grid grid-cols-2 gap-4">
                        <StatCard icon={Trophy} label="Mastery Score" value={proficiency?.score ?? 0} sub="+12% vs last cycle" color="#F59E0B" delay={0.1} />
                        <StatCard icon={Target} label="Problems Solved" value={summary?.Total ?? 0} sub="Total encoded" color="#EC4186" delay={0.15} />
                        <StatCard icon={TrendingUp} label="Current Level" value={`Lv. ${proficiency?.level ?? 1}`} sub="500 XP per level" color="#6b21a8" delay={0.2} />
                        <StatCard icon={Activity} label="Active Streak" value="—" sub="Connect LeetCode to track" color="#EE544A" delay={0.25} />
                    </div>

                    {/* Difficulty Breakdown */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.07]"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <BarChart3 className="text-[#EC4186]" size={16} />
                            <h2 className="text-sm font-black text-white uppercase tracking-widest">Neural Link Sync</h2>
                            <span className="ml-auto text-[8px] font-bold text-white/20 uppercase tracking-widest">By Difficulty</span>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                            <DifficultyBadge count={summary?.Easy ?? 0} label="Easy" color="text-emerald-400" bg="bg-emerald-500/5" border="border-emerald-500/10" />
                            <DifficultyBadge count={summary?.Medium ?? 0} label="Medium" color="text-[#EC4186]" bg="bg-[#EC4186]/5" border="border-[#EC4186]/10" />
                            <DifficultyBadge count={summary?.Hard ?? 0} label="Hard" color="text-[#EE544A]" bg="bg-[#EE544A]/5" border="border-[#EE544A]/10" />
                        </div>

                        {/* Progress bar total */}
                        {(summary?.Total ?? 0) > 0 && (
                            <div className="mt-6 space-y-2">
                                <div className="flex gap-1 h-2 rounded-full overflow-hidden bg-white/5">
                                    {['Easy', 'Medium', 'Hard'].map((d, i) => {
                                        const v = summary?.[d] ?? 0;
                                        const pct = summary?.Total > 0 ? (v / summary.Total) * 100 : 0;
                                        const colors = ['bg-emerald-400', 'bg-[#EC4186]', 'bg-[#EE544A]'];
                                        return (
                                            <motion.div
                                                key={d}
                                                initial={{ flex: 0 }}
                                                animate={{ flex: pct }}
                                                transition={{ duration: 1.2, delay: 0.4 + i * 0.1 }}
                                                className={`rounded-full ${colors[i]} min-w-0`}
                                            />
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </motion.div>
                </div>

                {/* Right: Side Panel */}
                <div className="space-y-4">
                    {/* LeetCode Sync Card */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.35 }}
                        className="p-6 rounded-2xl border border-[#EC4186]/20 bg-gradient-to-b from-[#EC4186]/5 to-transparent"
                    >
                        <div className="flex flex-col items-center text-center gap-5">
                            <motion.div
                                animate={{ rotate: [0, 10, -10, 0] }}
                                transition={{ duration: 5, repeat: Infinity }}
                                className="w-14 h-14 rounded-2xl bg-[#EC4186]/15 flex items-center justify-center"
                            >
                                <Link2 size={22} className="text-[#EC4186]" />
                            </motion.div>
                            <div>
                                <h3 className="text-base font-black text-white uppercase tracking-tight mb-1">Sync Accounts</h3>
                                <p className="text-white/30 text-[10px] leading-relaxed">Connect your LeetCode to synchronize progress automatically.</p>
                            </div>
                            <Link
                                to="/settings"
                                state={{ tab: 'leetcode' }}
                                className="w-full py-3.5 rounded-xl bg-[#EC4186] text-white text-[10px] font-black uppercase tracking-[0.2em] hover:bg-[#d63a78] transition-all shadow-[0_10px_30px_rgba(236,65,134,0.3)] flex items-center justify-center gap-2"
                            >
                                <Zap size={12} className="fill-current" />
                                Initiate Sync
                            </Link>
                        </div>
                    </motion.div>

                    {/* Node Security */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.45 }}
                        className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.07]"
                    >
                        <div className="flex items-center gap-2 mb-4">
                            <Shield className="text-white/20" size={14} />
                            <h4 className="text-[9px] font-black text-white/30 uppercase tracking-[0.25em]">Node Security</h4>
                        </div>
                        <div className="space-y-3">
                            {[
                                { label: 'Sync Encryption', status: 'ACTIVE', color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
                                { label: 'JWT Session', status: 'ACTIVE', color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
                                { label: 'Neuro-ID Verified', status: 'PENDING', color: 'text-white/30', bg: 'bg-white/5' },
                            ].map(item => (
                                <div key={item.label} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle size={11} className={item.color} />
                                        <span className="text-[10px] text-white/40">{item.label}</span>
                                    </div>
                                    <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${item.color} ${item.bg}`}>{item.status}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Quick links */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                        className="space-y-2"
                    >
                        {[
                            { label: 'Practice Problems', to: '/problems' },
                            { label: 'Learning Foundations', to: '/foundations' },
                        ].map(link => (
                            <Link
                                key={link.to}
                                to={link.to}
                                className="flex items-center justify-between w-full p-3.5 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-white/10 transition-all text-[10px] font-black text-white/50 hover:text-white uppercase tracking-wide group"
                            >
                                {link.label}
                                <ChevronRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                            </Link>
                        ))}
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Analysis;
