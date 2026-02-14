import { useState, useMemo } from 'react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'
import { AlertTriangle, Clock, Zap } from 'lucide-react'

interface PerformanceData {
    complexityGraph: { inputSize: number, time: number }[]
    bestCase: string
    averageCase: string
    worstCase: string
}

const PerformanceSimulator = ({ data }: { data: PerformanceData }) => {
    // Log scale slider value (1 = 10, 7 = 10^7)
    const [sliderValue, setSliderValue] = useState(3)

    // Calculate N based on slider
    const n = Math.round(Math.pow(10, sliderValue))

    // Interpolate or estimate time
    // This is a rough estimation for visualization
    const estimatedTime = useMemo(() => {
        // Find closest data points
        const graph = data.complexityGraph
        if (!graph || graph.length === 0) return 0

        // Simple linear interpolation for demo (in reality, curve fitting is better)
        // For standard complexities, we can just use the formula logic if we parsed O(N) etc.
        // But here we rely on the graph points provided in JSON.

        // Find upper and lower bound in graph
        let lower = graph[0]
        let upper = graph[graph.length - 1]

        for (let i = 0; i < graph.length - 1; i++) {
            if (n >= graph[i].inputSize && n <= graph[i + 1].inputSize) {
                lower = graph[i]
                upper = graph[i + 1]
                break
            }
        }

        if (n > upper.inputSize) {
            // Extrapolate linearly from last segment (rough approximation)
            const slope = (upper.time - lower.time) / (upper.inputSize - lower.inputSize)
            return upper.time + slope * (n - upper.inputSize)
        }

        // Interpolate
        const range = upper.inputSize - lower.inputSize
        if (range === 0) return lower.time
        const percentage = (n - lower.inputSize) / range
        return lower.time + (percentage * (upper.time - lower.time))

    }, [n, data.complexityGraph])

    const isTLE = estimatedTime > 1000 // > 1 second (approx) or whatever the scale is. 
    // Let's assume the 'time' in JSON is "operations" or "microseconds". 
    // If we assume abstract "ops", 10^8 is usually the limit. 
    // Let's adjust scale: 10^8 ops ~ 1 second.

    const opsLabel = useMemo(() => {
        if (estimatedTime > 1000000000) return `${(estimatedTime / 1000000000).toFixed(1)}B ops`
        if (estimatedTime > 1000000) return `${(estimatedTime / 1000000).toFixed(1)}M ops`
        if (estimatedTime > 1000) return `${(estimatedTime / 1000).toFixed(1)}K ops`
        return `${Math.round(estimatedTime)} ops`
    }, [estimatedTime])

    // Normalize Graph Data for Recharts
    const chartData = data.complexityGraph.map(p => ({
        n: p.inputSize,
        ops: p.time,
        logN: Math.log10(p.inputSize)
    }))

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="p-3 bg-blue-500/10 rounded-lg text-blue-400">
                    <Clock size={24} />
                </div>
                <div>
                    <div className="text-xs text-white/40 font-bold uppercase tracking-wider">Estimated Runtime</div>
                    <div className={`text-2xl font-mono font-bold ${isTLE ? 'text-red-500' : 'text-emerald-400'}`}>
                        ~{opsLabel}
                    </div>
                </div>
                <div className="mx-4 h-8 w-[1px] bg-white/10" />
                <div>
                    <div className="text-xs text-white/40 font-bold uppercase tracking-wider">Result</div>
                    <div className={`text-lg font-bold flex items-center gap-2 ${isTLE ? 'text-red-500' : 'text-emerald-400'}`}>
                        {isTLE ? <><AlertTriangle size={18} /> TLE Risk</> : <><Zap size={18} /> Accepted</>}
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex justify-between items-center text-sm font-mono text-white/60">
                    <span>Input Size (N)</span>
                    <span className="text-white font-bold">10^{sliderValue} ({n.toLocaleString()})</span>
                </div>
                <input
                    type="range"
                    min="1"
                    max="7"
                    step="0.1"
                    value={sliderValue}
                    onChange={(e) => setSliderValue(parseFloat(e.target.value))}
                    className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-accent-blue hover:accent-accent-purple transition-colors"
                />
                <div className="flex justify-between text-[10px] text-white/20 font-mono uppercase">
                    <span>10 (Tiny)</span>
                    <span>100K (Standard)</span>
                    <span>10M (High Load)</span>
                </div>
            </div>

            <div className="h-64 mt-8 glass-card p-4 rounded-xl border border-white/5 bg-black/20">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                        <defs>
                            <linearGradient id="colorOps" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <XAxis
                            dataKey="n"
                            scale="log"
                            domain={['auto', 'auto']}
                            tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }}
                            tickFormatter={(val: number) => `10^${Math.round(Math.log10(val))}`}
                        />
                        <YAxis
                            hide
                        />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#000', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                            itemStyle={{ color: '#fff' }}
                            labelStyle={{ color: 'rgba(255,255,255,0.5)' }}
                            formatter={(value: any) => [`${(value || 0).toFixed(0)} ops`, 'Cost']}
                        />
                        <Area
                            type="monotone"
                            dataKey="ops"
                            stroke="#8b5cf6"
                            fillOpacity={1}
                            fill="url(#colorOps)"
                            strokeWidth={3}
                        />
                        {/* Current Selection Reference Line */}
                        <ReferenceLine x={n} stroke="#00B0FA" strokeDasharray="3 3" />
                        {/* TLE Threshold Reference Line (Simulated at 10^8 ops) */}
                        {/* <ReferenceLine y={100000000} stroke="#ef4444" strokeDasharray="5 5" label="TLE Limit" /> */}
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-3 gap-2 mt-4">
                <div className="p-3 bg-white/5 rounded-lg border border-white/5 text-center">
                    <div className="text-[10px] text-white/40 uppercase mb-1">Best Case</div>
                    <div className="font-mono text-emerald-400 text-sm">{data.bestCase}</div>
                </div>
                <div className="p-3 bg-white/5 rounded-lg border border-white/5 text-center">
                    <div className="text-[10px] text-white/40 uppercase mb-1">Average</div>
                    <div className="font-mono text-yellow-400 text-sm">{data.averageCase}</div>
                </div>
                <div className="p-3 bg-white/5 rounded-lg border border-white/5 text-center">
                    <div className="text-[10px] text-white/40 uppercase mb-1">Worst Case</div>
                    <div className="font-mono text-red-400 text-sm">{data.worstCase}</div>
                </div>
            </div>
        </div>
    )
}

export default PerformanceSimulator
