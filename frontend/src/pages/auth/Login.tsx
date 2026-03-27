import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, ArrowRight, User, Mail, Lock, Sparkles, Database, Eye, EyeOff, Code, Gauge, Binary, Layers } from 'lucide-react';
import { authService, API_BASE_URL } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../utils/cn';

const AlgorithmVisualizer = ({ activeField, data }: { activeField: string | null, data: any }) => {
    return (
        <div className="w-full h-full flex items-center justify-center relative min-h-[400px]">
            <AnimatePresence mode="wait">
                {(!activeField || (activeField !== 'username' && activeField !== 'login' && activeField !== 'password' && activeField !== 'email')) && (
                    <motion.div
                        key="default"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.1 }}
                        className="relative w-64 h-64"
                    >
                        <div className="absolute inset-0 rounded-full border-2 border-dashed border-[#EC4186]/20 animate-[spin_20s_linear_infinite]" />
                        <div className="absolute inset-8 rounded-full border border-[#EE544A]/30 animate-[spin_15s_linear_infinite_reverse]" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Binary size={48} className="text-[#EC4186] animate-pulse" />
                        </div>
                        {/* Orbiting nodes */}
                        {[0, 72, 144, 216, 288].map((angle, i) => (
                            <motion.div
                                key={i}
                                className="absolute w-3 h-3 rounded-full bg-gradient-to-r from-[#EC4186] to-[#EE544A]"
                                animate={{
                                    x: Math.cos(angle * Math.PI / 180) * 120,
                                    y: Math.sin(angle * Math.PI / 180) * 120,
                                }}
                                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                            />
                        ))}
                    </motion.div>
                )}

                {(activeField === 'username' || activeField === 'login') && (
                    <motion.div
                        key="sorting"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="flex items-end gap-2 h-48"
                    >
                        {Array.from({ length: 12 }).map((_, i) => {
                            const val = (data.username || data.login || "").length;
                            const height = Math.min(100, (i + 1) * 8 + (val * 2));
                            const isActive = i < val;
                            return (
                                <motion.div
                                    key={i}
                                    className={cn(
                                        "w-4 rounded-t-lg transition-colors duration-500",
                                        isActive ? "bg-gradient-to-t from-[#EC4186] to-[#EE544A]" : "bg-white/5"
                                    )}
                                    animate={{ height: `${height}%` }}
                                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                />
                            );
                        })}
                        <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 text-[10px] font-black text-[#EC4186] uppercase tracking-[0.3em]">
                            Neural Sequence Sorting
                        </div>
                    </motion.div>
                )}

                {activeField === 'password' && (
                    <motion.div
                        key="tree"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.1 }}
                        className="relative w-80 h-80 flex items-center justify-center"
                    >
                        <div className="relative">
                            <motion.div 
                                className="w-16 h-16 rounded-2xl bg-[#EC4186] flex items-center justify-center shadow-[0_0_30px_rgba(236,65,134,0.4)] z-10 relative"
                                animate={{ scale: [1, 1.05, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                <Lock size={24} className="text-white" />
                            </motion.div>
                            
                            {/* Branching nodes based on password length */}
                            {Array.from({ length: Math.min(8, data.password.length) }).map((_, i) => {
                                const angle = (i * 45) * (Math.PI / 180);
                                const dist = 80;
                                return (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, scale: 0 }}
                                        animate={{ opacity: 1, scale: 1, x: Math.cos(angle) * dist, y: Math.sin(angle) * dist }}
                                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-xl bg-white/10 border border-white/20 backdrop-blur-sm flex items-center justify-center"
                                    >
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#EE544A]" />
                                    </motion.div>
                                );
                            })}
                            
                            {/* Lines */}
                            <svg className="absolute inset-[-100px] w-[200px] h-[200px] pointer-events-none opacity-20">
                                {Array.from({ length: Math.min(8, data.password.length) }).map((_, i) => (
                                    <motion.line
                                        key={i}
                                        x1="100" y1="100"
                                        x2={100 + Math.cos((i * 45) * (Math.PI / 180)) * 80}
                                        y2={100 + Math.sin((i * 45) * (Math.PI / 180)) * 80}
                                        stroke="white"
                                        strokeWidth="1"
                                        initial={{ pathLength: 0 }}
                                        animate={{ pathLength: 1 }}
                                    />
                                ))}
                            </svg>
                        </div>
                        <div className="absolute bottom-0 text-[10px] font-black text-[#EC4186] uppercase tracking-[0.3em]">
                            Entropy Tree Generation
                        </div>
                    </motion.div>
                )}

                {activeField === 'email' && (
                    <motion.div
                        key="network"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="relative w-full max-w-xs h-40 flex items-center justify-center gap-4"
                    >
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="relative">
                                <motion.div
                                    className={cn(
                                        "w-12 h-12 rounded-xl flex items-center justify-center border-2",
                                        i < data.email.length / 5 ? "border-[#EC4186] bg-[#EC4186]/10" : "border-white/5 bg-white/5"
                                    )}
                                    animate={i < data.email.length / 5 ? { scale: [1, 1.1, 1] } : {}}
                                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.1 }}
                                >
                                    <Layers size={18} className={i < data.email.length / 5 ? "text-[#EC4186]" : "text-white/10"} />
                                </motion.div>
                                {i < 4 && (
                                    <div className="absolute left-full top-1/2 -translate-y-1/2 w-4 h-0.5 bg-white/5" />
                                )}
                            </div>
                        ))}
                        <div className="absolute -bottom-8 text-[10px] font-black text-[#EC4186] uppercase tracking-[0.3em]">
                            Packet Stream Validation
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const GlowOrbs = () => (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div
            className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-[#EC4186]/8 blur-[180px] rounded-full"
            animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
            className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-[#EE544A]/8 blur-[180px] rounded-full"
            animate={{ scale: [1.1, 1, 1.1], opacity: [0.6, 0.4, 0.6] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40%] h-[40%] bg-[#6b21a8]/10 blur-[120px] rounded-full"
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        />
        <div className="absolute inset-0 opacity-[0.03]"
            style={{
                backgroundImage: 'linear-gradient(rgba(236, 65, 134, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(236, 65, 134, 0.5) 1px, transparent 1px)',
                backgroundSize: '60px 60px'
            }}
        />
    </div>
);

const ParticleField = () => {
    const particles = Array.from({ length: 24 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 1,
        delay: Math.random() * 4,
        duration: Math.random() * 6 + 4,
    }));

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
            {particles.map(p => (
                <motion.div
                    key={p.id}
                    className="absolute rounded-full bg-[#EC4186]/30"
                    style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size }}
                    animate={{ y: [-20, 20, -20], opacity: [0.2, 0.8, 0.2] }}
                    transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
                />
            ))}
        </div>
    );
};

const InputField = ({ label, icon: Icon, type = 'text', name, value, onChange, onFocus, onBlur, placeholder, required, rightElement }: any) => (
    <div className="space-y-1.5 px-2">
        <label className="text-[11px] font-bold text-[#EC4186] uppercase tracking-widest ml-1 flex items-center gap-1.5">
            {label}
        </label>
        <div className="relative group">
            <div className="absolute -inset-px rounded-xl bg-gradient-to-r from-[#EC4186]/10 via-[#EE544A]/10 to-[#EC4186]/10 opacity-0 group-focus-within:opacity-100 transition-all duration-500 blur-sm" />
            <div className="relative">
                <Icon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#EC4186] transition-all duration-300 z-10" />
                <input
                    name={name}
                    type={type}
                    value={value}
                    onChange={onChange}
                    onFocus={() => onFocus?.(name)}
                    onBlur={() => onBlur?.(null)}
                    placeholder={placeholder}
                    className="w-full bg-white/[0.04] border border-white/10 rounded-xl py-4 pl-12 pr-12 text-white text-sm focus:outline-none focus:border-[#EC4186]/50 transition-all duration-300 font-medium placeholder:text-white/15"
                    required={required}
                />
                {rightElement}
            </div>
        </div>
    </div>
);

const SelectField = ({ label, icon: Icon, name, value, onChange, children }: any) => (
    <div className="space-y-1.5 px-2">
        <label className="text-[11px] font-bold text-[#EC4186] uppercase tracking-widest ml-1 flex items-center gap-1.5">
            {label}
        </label>
        <div className="relative group">
            <Icon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#EC4186] transition-all duration-300 z-10" />
            <select
                name={name}
                value={value}
                onChange={onChange}
                className="w-full bg-white/[0.04] border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white text-sm focus:outline-none focus:border-[#EC4186]/50 transition-all duration-300 font-medium appearance-none cursor-pointer"
            >
                {children}
            </select>
            <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
        </div>
    </div>
);

const Login: React.FC = () => {
    const [mode, setMode] = useState<'login' | 'register'>('login');
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        username: '', email: '', password: '', login: '', experience: 'beginner', language: 'javascript'
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [focusedField, setFocusedField] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleGoogleLogin = () => {
        window.location.href = `${API_BASE_URL}/auth/google`;
    };

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            let data;
            if (mode === 'register') {
                data = await authService.register({
                    username: formData.username, email: formData.email,
                    password: formData.password, experience: formData.experience, language: formData.language
                });
            } else {
                data = await authService.login({ login: formData.login, password: formData.password });
            }
            localStorage.setItem('algoscope_token', data.token);
            localStorage.setItem('algoscope_user', JSON.stringify(data.user));
            navigate('/problems');
        } catch (err: any) {
            setError(err.response?.data?.error || 'Authentication sequence failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex-1 min-h-screen flex flex-col lg:flex-row bg-[#0c0218] overflow-hidden relative font-outfit">
            <GlowOrbs />
            <ParticleField />

            {/* Left Side: Brand & Visualizer (Desktop Only) */}
            <div className="hidden lg:flex flex-1 flex-col relative z-10 p-20 justify-center border-r border-white/5 bg-black/20">
                <motion.div
                    initial={{ opacity: 0, x: -40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-2xl"
                >
                    <div className="mb-16">
                        <h1 className="text-6xl font-black text-white leading-tight tracking-tighter uppercase mb-6">
                            Algoscope <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#EC4186] to-[#EE544A] italic">Lab</span>
                        </h1>
                        <p className="text-white/50 text-xl leading-relaxed max-w-lg font-medium">
                            Visualizing algorithms, decoding complexity.
                        </p>
                    </div>

                    {/* Reactive Animation Area */}
                    <div className="w-full aspect-video rounded-3xl bg-white/[0.02] border border-white/5 flex items-center justify-center relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#EC4186]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                        <AlgorithmVisualizer activeField={focusedField} data={formData} />
                    </div>
                </motion.div>
            </div>

            {/* Right Side: Auth Form */}
            <div className="w-full lg:w-[500px] flex flex-col items-center justify-center min-h-[100dvh] lg:min-h-screen p-6 sm:p-12 relative z-10 overflow-y-auto bg-[#0c0218]/50 lg:bg-transparent backdrop-blur-sm lg:backdrop-blur-0">
                <motion.div
                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full max-w-[390px]"
                >
                    {/* Logo Mobile Only */}
                    <div className="lg:hidden text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#EC4186] to-[#EE544A] mb-5 shadow-[0_0_40px_rgba(236,65,134,0.5)] p-[2px]">
                            <div className="w-full h-full rounded-[14px] bg-[#0c0218] flex items-center justify-center">
                                <Sparkles className="text-[#EC4186]" size={26} />
                            </div>
                        </div>
                        <h1 className="text-white text-2xl font-black tracking-tighter uppercase mb-1">
                            Algoscope <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#EC4186] to-[#EE544A] italic">Lab</span>
                        </h1>
                    </div>

                    {/* Card Container */}
                    <div className="relative group/card">
                        <div className="absolute -inset-[1px] rounded-[32px] bg-gradient-to-b from-white/20 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-700 pointer-events-none" />
                        <div className="absolute -inset-[1px] rounded-[32px] bg-gradient-to-b from-white/10 to-white/5 opacity-50" />
                        <div className="relative rounded-[32px] bg-[#15052a]/80 backdrop-blur-3xl border border-white/[0.08] p-8 lg:p-10 shadow-[0_30px_100px_-20px_rgba(0,0,0,0.9)] flex flex-col items-stretch">

                            {/* Mode Tabs */}
                            <div className="flex p-1.5 bg-black/30 rounded-2xl border border-white/5 mb-8">
                                {(['login', 'register'] as const).map(m => (
                                    <button
                                        key={m}
                                        onClick={() => { setMode(m); setError(''); }}
                                        className="relative flex-1 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all duration-300"
                                    >
                                        {mode === m && (
                                            <motion.div
                                                layoutId="tab-pill"
                                                className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#EC4186] to-[#EE544A] shadow-[0_4px_15px_rgba(236,65,134,0.4)]"
                                            />
                                        )}
                                        <span className={cn("relative z-10 transition-colors duration-300", mode === m ? "text-white" : "text-white/30 hover:text-white/60")}>
                                            {m}
                                        </span>
                                    </button>
                                ))}
                            </div>

                            {/* Error Alert */}
                            <AnimatePresence>
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                                        animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
                                        exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-black uppercase tracking-[0.15em] text-center flex items-center justify-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                                            {error}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Form */}
                            <form onSubmit={handleAuth}>
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={mode}
                                        initial={{ opacity: 0, x: mode === 'login' ? -15 : 15 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: mode === 'login' ? 15 : -15 }}
                                        transition={{ duration: 0.25 }}
                                        className="space-y-5 mb-6"
                                    >
                                        {mode === 'register' && (
                                            <>
                                                <InputField label="Username" icon={User} name="username" value={formData.username} onChange={handleInputChange} onFocus={setFocusedField} onBlur={() => setFocusedField(null)} placeholder="e.g. monolith_88" required />
                                                <InputField label="Email" icon={Mail} type="email" name="email" value={formData.email} onChange={handleInputChange} onFocus={setFocusedField} onBlur={() => setFocusedField(null)} placeholder="user@algoscope.io" required />
                                                <div className="grid grid-cols-2 gap-4">
                                                    <SelectField label="Level" icon={Gauge} name="experience" value={formData.experience} onChange={(e: any) => setFormData({ ...formData, experience: e.target.value })}>
                                                        <option value="beginner" className="bg-[#0c0218]">Beginner</option>
                                                        <option value="intermediate" className="bg-[#0c0218]">Intermediate</option>
                                                        <option value="expert" className="bg-[#0c0218]">Expert</option>
                                                    </SelectField>
                                                    <SelectField label="Language" icon={Code} name="language" value={formData.language} onChange={(e: any) => setFormData({ ...formData, language: e.target.value })}>
                                                        <option value="javascript" className="bg-[#0c0218]">JS</option>
                                                        <option value="python" className="bg-[#0c0218]">Python</option>
                                                        <option value="cpp" className="bg-[#0c0218]">C++</option>
                                                        <option value="java" className="bg-[#0c0218]">Java</option>
                                                    </SelectField>
                                                </div>
                                            </>
                                        )}

                                        {mode === 'login' && (
                                            <InputField label="Username or Email" icon={User} name="login" value={formData.login} onChange={handleInputChange} onFocus={setFocusedField} onBlur={() => setFocusedField(null)} placeholder="Email or Username" required />
                                        )}

                                        <InputField
                                            label="Password"
                                            icon={Lock}
                                            type={showPassword ? 'text' : 'password'}
                                            name="password"
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            onFocus={setFocusedField}
                                            onBlur={() => setFocusedField(null)}
                                            placeholder="••••••••"
                                            required
                                            rightElement={
                                                <button type="button" onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/60 transition-colors z-10">
                                                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                                                </button>
                                            }
                                        />
                                    </motion.div>
                                </AnimatePresence>

                                <motion.button
                                    type="submit"
                                    disabled={loading}
                                    whileHover={{ 
                                        scale: 1.02, 
                                        boxShadow: '0 20px 50px rgba(236,65,134,0.5)',
                                        filter: 'brightness(1.1)'
                                    }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full h-14 py-4 rounded-xl bg-gradient-to-r from-[#EC4186] via-[#EE544A] to-[#EC4186] bg-[length:200%_auto] hover:bg-right text-white font-black uppercase tracking-[0.2em] text-[11px] flex items-center justify-center gap-3 transition-all duration-500 shadow-[0_10px_30px_rgba(236,65,134,0.3)] group relative overflow-hidden"
                                >
                                    {/* Shimmer effect */}
                                    <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500">
                                        <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white to-transparent" />
                                    </div>
                                    
                                    {loading ? (
                                        <div className="flex items-center gap-3">
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            <span className="animate-pulse">Syncing Neural Map...</span>
                                        </div>
                                    ) : (
                                        <>
                                            <Sparkles size={14} className="group-hover:rotate-12 transition-transform duration-300" />
                                            <span>{mode === 'login' ? 'Initialize Session' : 'Create Profile'}</span>
                                            <ArrowRight size={16} className="group-hover:translate-x-1.5 transition-transform duration-300" />
                                        </>
                                    )}
                                </motion.button>
                            </form>

                            {/* Divider */}
                            <div className="relative my-8">
                                <div className="absolute inset-0 flex items-center px-2">
                                    <div className="w-full border-t border-white/5" />
                                </div>
                                <div className="relative flex justify-center text-[8px] font-black uppercase tracking-[0.4em]">
                                    <span className="px-4 bg-[#15052a] text-white/20">OR</span>
                                </div>
                            </div>

                            {/* Google Button */}
                            <motion.button
                                type="button"
                                onClick={handleGoogleLogin}
                                whileHover={{ 
                                    scale: 1.01, 
                                    backgroundColor: 'rgba(255,255,255,0.06)',
                                    borderColor: 'rgba(236,65,134,0.3)'
                                }}
                                whileTap={{ scale: 0.98 }}
                                className="mx-2 py-4 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center gap-3 transition-all duration-300 group shadow-inner"
                            >
                                <div className="relative">
                                    <div className="absolute -inset-2 bg-[#4285F4]/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full" />
                                    <svg className="w-4 h-4 group-hover:scale-110 transition-transform relative z-10" viewBox="0 0 24 24">
                                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                    </svg>
                                </div>
                                <span className="text-[11px] font-black uppercase tracking-[0.2em] text-white/40 group-hover:text-white/90 transition-colors">Connect via Google</span>
                            </motion.button>
                        </div>
                    </div>

                    {/* Footer badges */}
                    <div className="mt-8 flex items-center justify-center gap-6 px-2">
                        <div className="flex items-center gap-2 text-white/20">
                            <ShieldCheck size={12} />
                            <span className="text-[8px] font-bold uppercase tracking-widest text-[#EC4186]/50">End-to-End Encrypted</span>
                        </div>
                        <div className="w-px h-3 bg-white/5" />
                        <div className="flex items-center gap-2 text-white/20">
                            <Database size={12} />
                            <span className="text-[8px] font-bold uppercase tracking-widest text-[#EC4186]/50">Secure Node Sync</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Login;
