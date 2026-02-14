import {
    ResponsiveContainer,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Radar,
    Tooltip
} from 'recharts'
import { useStore } from '../../store/useStore'
import foundationsData from '../../data/foundations.json'

const FoundationsRadarChart = () => {
    const patternStats = useStore(state => state.patternStats)

    // Calculate mastery per family
    const data = Object.values(foundationsData).map((category: any) => {
        const modules = category.modules || []
        if (modules.length === 0) return { subject: category.title, A: 0, fullMark: 100 }

        let totalScore = 0
        let theoryTotal = 0
        let optTotal = 0
        let edgeTotal = 0

        modules.forEach((m: any) => {
            const stats = patternStats[m.id]
            if (stats) {
                // Base confidence is the legacy fallback
                const conf = stats.confidence || 0

                // If 3D stats exist, use them, otherwise fallback to confidence
                const theory = stats.theoryScore || conf
                const opt = stats.optimizationScore || conf
                const edge = stats.edgeCaseScore || conf

                theoryTotal += theory
                optTotal += opt
                edgeTotal += edge

                // Weighted pattern mastery
                totalScore += (theory + opt + edge) / 3
            }
        })

        const count = modules.length
        return {
            subject: category.title.split(' ')[0], // Short name
            A: Math.round(totalScore / count),
            theory: Math.round(theoryTotal / count),
            optimization: Math.round(optTotal / count),
            edge: Math.round(edgeTotal / count),
            fullMark: 100
        }
    })

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const d = payload[0].payload
            return (
                <div className="bg-black/80 backdrop-blur-md border border-white/10 p-4 rounded-xl shadow-xl">
                    <p className="font-bold text-white mb-2">{d.subject}</p>
                    <div className="space-y-1 text-xs font-mono">
                        <div className="flex justify-between gap-4">
                            <span className="text-emerald-400">Theory</span>
                            <span className="text-white">{d.theory}%</span>
                        </div>
                        <div className="flex justify-between gap-4">
                            <span className="text-amber-400">Optimization</span>
                            <span className="text-white">{d.optimization}%</span>
                        </div>
                        <div className="flex justify-between gap-4">
                            <span className="text-rose-400">Edge Cases</span>
                            <span className="text-white">{d.edge}%</span>
                        </div>
                        <div className="h-[1px] bg-white/10 my-1" />
                        <div className="flex justify-between gap-4 font-bold">
                            <span className="text-accent-blue">Overall</span>
                            <span className="text-white">{d.A}%</span>
                        </div>
                    </div>
                </div>
            )
        }
        return null
    }

    return (
        <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
                    <PolarGrid stroke="rgba(255,255,255,0.1)" />
                    <PolarAngleAxis
                        dataKey="subject"
                        tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10, fontWeight: 'bold' }}
                    />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar
                        name="Mastery"
                        dataKey="A"
                        stroke="#00B0FA"
                        strokeWidth={3}
                        fill="#00B0FA"
                        fillOpacity={0.2}
                    />
                    <Tooltip content={<CustomTooltip />} />
                </RadarChart>
            </ResponsiveContainer>
        </div>
    )
}

export default FoundationsRadarChart
