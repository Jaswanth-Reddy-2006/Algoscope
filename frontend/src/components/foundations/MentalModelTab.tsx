import { ProblemStatement } from './ProblemStatement'
import { MentalModelStatsCard } from './MentalModelStatsCard'
import { MentalModelPrincipleCard } from './MentalModelPrincipleCard'
import { TwoPointerComparison } from './engines/TwoPointers/visual/TwoPointerComparison'
import { SlidingWindowComparison } from './engines/SlidingWindowEngine/visual/SlidingWindowComparison'
import { FoundationModule } from '../../types/foundation'

interface Props {
    moduleId?: string
    module: FoundationModule
    activeSubPatternId: string | null
    setActiveSubPatternId: (id: string | null) => void
}

export const MentalModelTab: React.FC<Props> = ({ moduleId, module, activeSubPatternId }) => {
    const mentalModel = module.mentalModel

    if (!mentalModel) return null

    const renderSimulation = () => {
        if (moduleId === 'two_pointers') {
            return <TwoPointerComparison subPatternId={activeSubPatternId || 'two_sum_sorted'} />
        }
        if (moduleId === 'sliding_window') {
            return <SlidingWindowComparison />
        }
        // Add more patterns as they are implemented
        return (
            <div className="p-20 text-center border-2 border-dashed border-white/5 rounded-3xl bg-white/[0.01]">
                <p className="text-white/40 italic">Interactive simulation coming soon for {module.title}</p>
            </div>
        )
    }

    return (
        <div className="max-w-7xl mx-auto space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* SECTION A: Context & Efficiency */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {mentalModel.problemStatement && (
                    <ProblemStatement
                        definition={mentalModel.problemStatement.definition}
                        returnValue={mentalModel.problemStatement.returnValue}
                        constraints={mentalModel.problemStatement.constraints}
                    />
                )}
                {mentalModel.efficiencyComparison && (
                    <MentalModelStatsCard
                        bruteForce={mentalModel.efficiencyComparison.bruteForce}
                        optimal={mentalModel.efficiencyComparison.optimal}
                        gain={mentalModel.efficiencyComparison.gain}
                    />
                )}
            </div>

            {/* SECTION B: Interactive Simulation */}
            <div className="space-y-8">
                <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-12">
                    <h2 className="text-3xl font-bold text-white mb-4">Patterns in Motion</h2>
                    <p className="text-white/50 leading-relaxed">
                        Experiment with custom inputs and compare how the {module.title} strategy
                        outperforms brute-force scans in real-time.
                    </p>
                </div>
                {renderSimulation()}
            </div>

            {/* SECTION C: Concept Principle Card */}
            <div className="pt-16 border-t border-white/10">
                <div className="mb-10 text-center">
                    <span className="text-xs font-bold text-accent-blue uppercase tracking-[0.2em]">The Insight</span>
                    <h3 className="text-2xl font-bold text-white mt-2">Core Pattern Philosophy</h3>
                </div>
                <MentalModelPrincipleCard
                    analogy={mentalModel.analogy}
                    coreInsight={mentalModel.coreInsight}
                    realWorldExample={mentalModel.realWorldExample}
                />
            </div>
        </div>
    )
}

