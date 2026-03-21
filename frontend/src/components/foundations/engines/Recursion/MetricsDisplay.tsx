import React from 'react';
import { useTimeline } from './TimelineController';
import { Activity, Zap } from 'lucide-react';
import { CallFrame } from './RecursionSimulator';

const MetricsDisplay: React.FC = () => {
    const { state: { steps, frames, currentStepIndex: currentIndex } } = useTimeline();

    const stats = React.useMemo(() => {
        const visibleFrames = Object.values(frames).filter((f: CallFrame) => f.stepCreated <= currentIndex);
        const returnedFrames = visibleFrames.filter((f: CallFrame) => f.stepReturned !== undefined && f.stepReturned <= currentIndex);

        // Stack depth calculation
        let maxDepth = 0;
        const currentStack: string[] = [];
        for (let i = 0; i <= currentIndex; i++) {
            const step = steps[i];
            if (step.action === 'PUSH_FRAME') {
                currentStack.push(step.activeFrameId);
                maxDepth = Math.max(maxDepth, currentStack.length);
            } else if (step.action === 'POP_FRAME') {
                currentStack.pop();
            }
        }

        return {
            totalCalls: Object.keys(frames).length,
            currentCalls: visibleFrames.length,
            maxDepth,
            currentDepth: currentStack.length,
            returnedCount: returnedFrames.length
        };
    }, [steps, frames, currentIndex]);

    return (
        <div className="grid grid-cols-2 gap-4">
            <MetricCard
                label="Total Calls"
                value={stats.currentCalls}
                total={stats.totalCalls}
                icon={Zap}
                color="text-[#EE544A]"
            />
            <MetricCard
                label="Stack Depth"
                value={stats.currentDepth}
                total={stats.maxDepth}
                icon={Activity}
                color="text-amber-400"
            />
        </div>
    );
};

const MetricCard: React.FC<{ label: string; value: number; total: number; icon: any; color: string }> = ({ label, value, total, icon: Icon, color }) => (
    <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-3xl">
        <div className="flex items-center gap-2 mb-2 opacity-40">
            <Icon size={12} />
            <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
        </div>
        <div className="flex items-baseline gap-2">
            <span className={`text-2xl font-bold font-mono ${color}`}>{value}</span>
            <span className="text-xs text-white/20 font-mono">/ peak {total}</span>
        </div>
    </div>
);

export default MetricsDisplay;
