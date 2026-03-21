import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, Lock, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';
import { leetcodeService } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';

const LeetCodeConnect: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [error, setError] = useState('');
    const [syncMethod, setSyncMethod] = useState<'handle' | 'auth'>('handle');
    const [isConnected, setIsConnected] = useState(false);
    const [showDisconnectModal, setShowDisconnectModal] = useState(false);
    const navigate = useNavigate();
    const initializeStore = useStore(state => state.initializeStore);
    const fetchAllProblems = useStore(state => state.fetchAllProblems);
    const setHubOpen = useStore(state => state.setHubOpen);

    // Initial status check
    useEffect(() => {
        const checkStatus = async () => {
            try {
                const data = await leetcodeService.getStatus();
                if (data && data.username) {
                    setUsername(data.username);
                    setIsConnected(true);
                }
            } catch (err) {
                console.warn("Could not fetch connection status");
            }
        };
        checkStatus();
    }, []);

    const handleConnect = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!username) return;
        setLoading(true);
        setStatus('idle');
        setError('');

        try {
            if (syncMethod === 'handle') {
                await leetcodeService.connect(username);
            } else {
                await leetcodeService.connect(undefined, password); // password is the sessionToken
            }
            setStatus('success');
            setIsConnected(true);
            
            // Refresh global store data immediately
            await initializeStore();
            await fetchAllProblems();

            // Auto-close hub to show main sidebar
            setHubOpen(false);

            setTimeout(() => {
                navigate('/pattern-profile');
            }, 2000);
        } catch (err: any) {
            setStatus('error');
            const errorMsg = err.response?.data?.error || 'Could not establish neural link. Please verify credentials.';
            setError(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const handleDisconnect = async () => {
        setLoading(true);
        try {
            await leetcodeService.disconnect();
            setIsConnected(false);
            setUsername('');
            setStatus('idle');
        } catch (err) {
            setError('Failed to discard link');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex-1 flex flex-col gap-8 p-8 overflow-y-auto custom-scrollbar">
            {/* Header */}
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#EC4186]/10 flex items-center justify-center border border-[#EC4186]/20">
                    <Database size={24} className="text-[#EC4186]" />
                </div>
                <div>
                    <h1 className="text-2xl font-black text-white uppercase tracking-tight">Access Link</h1>
                    <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest">Cognitive Archive Integration</p>
                </div>
            </div>

            {/* Sync Notifications */}
            <AnimatePresence mode="wait">
                {status === 'success' && (
                    <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-4"
                    >
                        <CheckCircle2 size={16} className="text-emerald-500" />
                        <span className="text-xs font-bold text-emerald-500 uppercase tracking-widest">Neural Link Synchronized Successfully</span>
                    </motion.div>
                )}
                {status === 'error' && (
                    <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center gap-4"
                    >
                        <AlertCircle size={16} className="text-rose-500" />
                        <span className="text-xs font-bold text-rose-500 uppercase tracking-widest">{error}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Connection Status Card */}
            {isConnected && (
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-6 rounded-[32px] bg-white/[0.02] border border-[#EC4186]/30 shadow-[0_0_30px_rgba(236,65,134,0.05)] relative overflow-hidden"
                >
                    <div className="flex items-center justify-between relative z-10">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-[#EC4186]/20 flex items-center justify-center">
                                <CheckCircle2 size={24} className="text-[#EC4186]" />
                            </div>
                            <div>
                                <h3 className="text-sm font-black text-white tracking-widest mb-1">{username}</h3>
                                <p className="text-[9px] text-white/30 font-bold uppercase tracking-widest flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    Active Signal Established
                                </p>
                            </div>
                        </div>
                        <button 
                            onClick={() => setShowDisconnectModal(true)}
                            className="px-4 py-2 rounded-lg bg-white/5 hover:bg-rose-500/10 text-white/20 hover:text-rose-500 transition-all text-xs font-black uppercase tracking-widest border border-white/5 hover:border-rose-500/20"
                        >
                            Discard Link
                        </button>
                    </div>
                </motion.div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Method Alpha: Public Handle */}
                <motion.div 
                    whileHover={{ scale: 1.01 }}
                    className={`p-6 rounded-[32px] border transition-all duration-500 cursor-pointer group flex flex-col ${
                        syncMethod === 'handle' 
                        ? 'bg-[#EC4186]/5 border-[#EC4186]/30 shadow-[0_0_30px_rgba(236,65,134,0.1)]' 
                        : 'bg-white/[0.02] border-white/5 hover:border-white/10'
                    }`}
                    onClick={() => setSyncMethod('handle')}
                >
                    <div className="flex items-center justify-between mb-6">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                            syncMethod === 'handle' ? 'bg-[#EC4186] text-white' : 'bg-white/5 text-white/20'
                        }`}>
                            <Database size={20} />
                        </div>
                        <span className={`text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full ${
                            syncMethod === 'handle' ? 'bg-[#EC4186]/20 text-[#EC4186]' : 'bg-white/5 text-white/20'
                        }`}>Public Sync</span>
                    </div>
                    <div className="space-y-2 mb-6">
                        <h3 className="text-lg font-black text-white uppercase tracking-tight">Public Sync</h3>
                        <p className="text-[11px] text-white/30 font-medium leading-relaxed uppercase tracking-wider">
                            Sync via public handle. Simple tracking.
                        </p>
                    </div>
                    <div className="mt-auto space-y-4">
                        <input 
                            type="text" 
                            placeholder="LEETCODE HANDLE"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            disabled={syncMethod !== 'handle' || loading}
                            className="w-full bg-black/40 border border-white/10 rounded-xl py-4 px-5 text-sm font-bold text-white focus:border-[#EC4186] transition-colors outline-none disabled:opacity-20"
                        />
                        <button 
                            disabled={syncMethod !== 'handle' || loading}
                            onClick={handleConnect}
                            className={`w-full py-4 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all shadow-inner ${
                                syncMethod === 'handle' 
                                ? 'bg-[#EC4186] text-white hover:translate-y-[-2px]' 
                                : 'bg-white/5 text-white/20'
                            }`}
                        >
                            {loading && syncMethod === 'handle' ? 'Linking...' : 'Link Account'}
                        </button>
                    </div>
                </motion.div>

                {/* Method Omega: Omega Protocol */}
                <motion.div 
                    whileHover={{ scale: 1.01 }}
                    className={`p-6 rounded-[32px] border transition-all duration-500 cursor-pointer group flex flex-col ${
                        syncMethod === 'auth' 
                        ? 'bg-[#EE544A]/5 border-[#EE544A]/30 shadow-[0_0_30px_rgba(238,84,74,0.1)]' 
                        : 'bg-white/[0.02] border-white/5 hover:border-white/10'
                    }`}
                    onClick={() => setSyncMethod('auth')}
                >
                    <div className="flex items-center justify-between mb-6">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                            syncMethod === 'auth' ? 'bg-[#EE544A] text-white' : 'bg-white/5 text-white/20'
                        }`}>
                            <Lock size={20} />
                        </div>
                        <span className={`text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full ${
                            syncMethod === 'auth' ? 'bg-[#EE544A]/20 text-[#EE544A]' : 'bg-white/5 text-white/20'
                        }`}>Omega Protocol</span>
                    </div>
                    <div className="space-y-2 mb-6">
                        <h3 className="text-lg font-black text-white uppercase tracking-tight">Omega Protocol</h3>
                        <p className="text-[11px] text-white/30 font-medium leading-relaxed uppercase tracking-wider">
                            Direct session link for deep-slice mastery analytics.
                        </p>
                    </div>
                    <div className="mt-auto space-y-4">
                        <div className="space-y-2">
                             <input 
                                type="password" 
                                placeholder="LEETCODE_SESSION"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={syncMethod !== 'auth' || loading}
                                className="w-full bg-black/40 border border-white/10 rounded-xl py-4 px-5 text-sm font-bold text-white focus:border-[#EE544A] transition-colors outline-none disabled:opacity-20"
                            />
                            <p className="text-[8px] text-white/20 font-bold uppercase px-2 leading-relaxed">
                                Tip: Find this in browser Inspect - Application - Cookies - LEETCODE_SESSION
                            </p>
                        </div>
                        <button 
                            disabled={syncMethod !== 'auth' || loading}
                            onClick={handleConnect}
                            className={`w-full py-4 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all shadow-inner ${
                                syncMethod === 'auth' 
                                ? 'bg-[#EE544A] text-white hover:translate-y-[-2px]' 
                                : 'bg-white/5 text-white/20'
                            }`}
                        >
                            {loading && syncMethod === 'auth' ? 'Linking...' : 'Initialize Omega Link'}
                        </button>
                    </div>
                </motion.div>
            </div>

            <div className="text-center pb-4">
                <p className="text-[8px] font-black text-white/10 uppercase tracking-[0.8em]">Neural Stream Pipeline • Status: Optimal</p>
            </div>

            {/* Premium Disconnect Modal */}
            <AnimatePresence>
                {showDisconnectModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowDisconnectModal(false)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-xl"
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-md p-8 rounded-[40px] bg-[#121212] border border-white/5 shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#EC4186]/50 to-transparent" />
                            
                            <div className="flex flex-col items-center text-center gap-6">
                                <div className="w-16 h-16 rounded-3xl bg-rose-500/10 flex items-center justify-center border border-rose-500/20">
                                    <XCircle size={32} className="text-rose-500" />
                                </div>
                                
                                <div className="space-y-2">
                                    <h2 className="text-xl font-black text-white uppercase tracking-tight">Discard Neural Link?</h2>
                                    <p className="text-[11px] text-white/30 font-bold uppercase tracking-widest leading-relaxed">
                                        Terminating the connection will pause real-time telemetry. Your existing cognitive archive will remain intact.
                                    </p>
                                </div>

                                <div className="flex gap-4 w-full">
                                    <button 
                                        onClick={() => setShowDisconnectModal(false)}
                                        className="flex-1 py-4 rounded-2xl bg-white/5 hover:bg-white/10 text-white/30 hover:text-white text-[10px] font-black uppercase tracking-widest transition-all border border-white/5"
                                    >
                                        Retain Link
                                    </button>
                                    <button 
                                        onClick={() => {
                                            handleDisconnect();
                                            setShowDisconnectModal(false);
                                        }}
                                        className="flex-1 py-4 rounded-2xl bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white text-[10px] font-black uppercase tracking-widest transition-all border border-rose-500/20 hover:border-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.1)] hover:shadow-[0_0_30px_rgba(244,63,94,0.3)]"
                                    >
                                        Discard
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

        </div>
    );
};

export default LeetCodeConnect;
