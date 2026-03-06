import React from 'react';
import { motion } from 'framer-motion';
import {
    Compass,
    Layers,
    ShieldCheck,
    ChevronRight
} from 'lucide-react';

interface Props {
    activeLevel: 'fundamentals' | 'patterns' | 'advanced';
    onLevelChange: (level: 'fundamentals' | 'patterns' | 'advanced') => void;
}

const levels = [
    {
        id: 'fundamentals',
        label: 'Level 1: Fundamentals',
        icon: Compass,
        color: 'text-green-400',
        bg: 'bg-green-400/10',
        description: 'Basics & Node Internal'
    },
    {
        id: 'patterns',
        label: 'Level 2: Pattern Usage',
        icon: Layers,
        color: 'text-accent-blue',
        bg: 'bg-accent-blue/10',
        description: 'Common Algos & Optimization'
    },
    {
        id: 'advanced',
        label: 'Level 3: Interview Mode',
        icon: ShieldCheck,
        color: 'text-purple-400',
        bg: 'bg-purple-400/10',
        description: 'Expert Tricks & efficiency'
    },
] as const;

export const ProgressionTabs: React.FC<Props> = ({ activeLevel, onLevelChange }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
            {levels.map((level) => {
                const isActive = activeLevel === level.id;
                const Icon = level.icon;

                return (
                    <button
                        key={level.id}
                        onClick={() => onLevelChange(level.id)}
                        className={`
              relative flex items-center gap-4 p-6 rounded-2xl border transition-all duration-300 group text-left
              ${isActive
                                ? `bg-white/[0.05] border-white/20 shadow-xl scale-[1.02]`
                                : 'bg-white/[0.02] border-white/5 hover:border-white/10 hover:bg-white/[0.03]'
                            }
            `}
                    >
                        {/* Active Indicator */}
                        {isActive && (
                            <motion.div
                                layoutId="activeTabGlow"
                                className="absolute inset-0 rounded-2xl bg-accent-blue/5 blur-xl pointer-events-none"
                            />
                        )}

                        <div className={`p-3 rounded-xl ${level.bg} ${level.color} group-hover:scale-110 transition-transform`}>
                            <Icon size={24} />
                        </div>

                        <div className="flex-1">
                            <div className={`text-xs font-bold uppercase tracking-widest mb-1 ${isActive ? 'text-white' : 'text-white/40'}`}>
                                {level.label}
                            </div>
                            <div className="text-sm text-white/60 group-hover:text-white transition-colors flex items-center gap-1">
                                {level.description}
                                <ChevronRight size={14} className={`opacity-0 group-hover:opacity-100 transition-all ${isActive ? 'translate-x-1' : ''}`} />
                            </div>
                        </div>

                        {isActive && (
                            <div className="w-1.5 h-1.5 rounded-full bg-accent-blue shadow-[0_0_10px_#EC4186]" />
                        )}
                    </button>
                );
            })}
        </div>
    );
};
