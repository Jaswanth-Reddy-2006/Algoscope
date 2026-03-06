import {
    Zap,
    Target,
    Lightbulb,
    BarChart3,
    Database
} from 'lucide-react';
import { FoundationModule } from '../../types/foundation';

interface Props {
    module: FoundationModule;
}

export const FoundationHero: React.FC<Props> = ({ module }) => {
    const { hero, title, description } = module;

    return (
        <div className="relative overflow-hidden rounded-3xl bg-white/[0.02] border border-white/10 backdrop-blur-xl shadow-2xl p-8 lg:p-12 mb-12">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 bg-accent-blue/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="relative flex flex-col lg:flex-row gap-12 items-center">
                {/* Text Side */}
                <div className="flex-1 space-y-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-blue/10 border border-accent-blue/20 text-accent-blue text-xs font-bold uppercase tracking-widest">
                        <Database size={12} />
                        Foundations Lab
                    </div>

                    <div className="space-y-4">
                        <h1 className="text-5xl lg:text-7xl font-bold tracking-tight bg-gradient-to-r from-white via-white to-white/40 bg-clip-text text-transparent italic">
                            {title}
                        </h1>
                        <p className="text-xl text-white/60 leading-relaxed max-w-2xl">
                            {description}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                        <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/5 group hover:border-accent-blue/30 transition-colors">
                            <div className="p-3 rounded-xl bg-accent-blue/10 text-accent-blue">
                                <Target size={24} />
                            </div>
                            <div>
                                <h4 className="font-bold text-white group-hover:text-accent-blue transition-colors italic">Real-World Analogy</h4>
                                <p className="text-sm text-white/50">{hero?.analogy}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/5 group hover:border-green-400/30 transition-colors">
                            <div className="p-3 rounded-xl bg-green-400/10 text-green-400">
                                <Zap size={24} />
                            </div>
                            <div>
                                <h4 className="font-bold text-white group-hover:text-green-400 transition-colors italic">Use Case</h4>
                                <p className="text-sm text-white/50">{hero?.whenToUse[0]}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* efficiency Card */}
                <div className="w-full lg:w-80 space-y-4">
                    <div className="p-6 rounded-2xl bg-white/[0.05] border border-white/10 backdrop-blur-md">
                        <h3 className="text-sm font-bold text-white/40 uppercase tracking-widest mb-6 flex items-center gap-2">
                            <BarChart3 size={14} />
                            Quick Metrics
                        </h3>

                        <div className="space-y-6">
                            {hero?.quickefficiency.map((metric, idx) => (
                                <div key={idx} className="flex justify-between items-center group">
                                    <div className="space-y-1">
                                        <span className="text-xs text-white/30 uppercase font-bold tracking-tighter">{metric.operation}</span>
                                        <div className="text-lg font-mono font-bold text-accent-blue group-hover:text-white transition-colors">
                                            {metric.time}
                                        </div>
                                    </div>
                                    <div className="text-right space-y-1">
                                        <span className="text-[10px] text-white/20 uppercase font-bold">Space</span>
                                        <div className="text-sm font-mono text-white/40">{metric.space}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 rounded-xl bg-accent-blue/5 border border-accent-blue/10 text-accent-blue/80 text-sm">
                        <Lightbulb size={18} />
                        <span>Optimal for sparse data structures.</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
