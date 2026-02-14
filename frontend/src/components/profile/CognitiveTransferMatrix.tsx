import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { GitMerge, AlertTriangle, CheckCircle2 } from 'lucide-react'
import { useStore } from '../../store/useStore'

const CognitiveTransferMatrix = () => {
    const patternStats = useStore(state => state.patternStats)

    // Filter items that have transfer data
    const transferItems = useMemo(() => {
        return Object.entries(patternStats)
            .filter(([_, stats]) => stats.transferScore !== undefined)
            .map(([slug, stats]) => ({
                slug,
                transferScore: stats.transferScore || 0,
                foundationConf: stats.foundationConfidence || 0,
                appliedConf: stats.appliedConfidence || 0,
                status: (stats.transferScore || 0) > 75 ? 'Synced' : (stats.transferScore || 0) < 50 ? 'Disconnect' : 'Developing'
            }))
            .sort((a, b) => b.transferScore - a.transferScore)
    }, [patternStats])

    if (transferItems.length === 0) return null

    return (
        <div className="glass-card p-6 border border-white/5 bg-white/[0.02] rounded-2xl">
            <div className="flex items-center gap-3 mb-6">
                <GitMerge size={18} className="text-accent-blue" />
                <h2 className="text-sm font-bold uppercase tracking-widest text-white/60">Cognitive Transfer Matrix</h2>
            </div>

            <div className="space-y-4">
                {transferItems.map((item) => (
                    <div key={item.slug} className="p-4 rounded-xl bg-white/5 border border-white/5">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-sm font-bold text-white capitalize">{item.slug.replace(/[-_]/g, ' ')}</span>

                            <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${item.status === 'Synced' ? 'bg-green-500/10 text-green-400' :
                                item.status === 'Disconnect' ? 'bg-red-500/10 text-red-400' :
                                    'bg-blue-500/10 text-blue-400'
                                }`}>
                                {item.status === 'Synced' && <CheckCircle2 size={12} />}
                                {item.status === 'Disconnect' && <AlertTriangle size={12} />}
                                {item.status}
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            {/* Foundation Side */}
                            <div className="flex-1 text-center">
                                <div className="text-[10px] uppercase font-bold text-white/40 mb-1">Theory</div>
                                <div className="text-xl font-mono font-bold text-white">{Math.round(item.foundationConf)}%</div>
                            </div>

                            {/* Connection Line */}
                            <div className="flex-1 flex flex-col items-center">
                                <div className="w-full h-1 bg-white/10 rounded-full relative overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        whileInView={{ width: `${item.transferScore}%` }}
                                        className={`h-full rounded-full ${item.transferScore > 75 ? 'bg-green-500' :
                                            item.transferScore < 50 ? 'bg-red-500' : 'bg-blue-500'
                                            }`}
                                    />
                                </div>
                                <span className="text-[10px] font-mono text-white/40 mt-1">Transfer {Math.round(item.transferScore)}</span>
                            </div>

                            {/* Applied Side */}
                            <div className="flex-1 text-center">
                                <div className="text-[10px] uppercase font-bold text-white/40 mb-1">Applied</div>
                                <div className="text-xl font-mono font-bold text-white">{Math.round(item.appliedConf)}%</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default CognitiveTransferMatrix
