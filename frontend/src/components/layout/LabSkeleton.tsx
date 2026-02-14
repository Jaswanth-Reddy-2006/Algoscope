import React from 'react'

const LabSkeleton: React.FC = () => {
    return (
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative animate-pulse font-outfit">
            {/* Header Skeleton */}
            <div className="h-16 px-8 flex items-center justify-between border-b border-white/5 bg-background/50 backdrop-blur-md z-10 shrink-0">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-8 bg-white/5 rounded-lg" />
                    <div className="w-48 h-4 bg-white/5 rounded-full" />
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
                {/* Left Panel Skeleton */}
                <div className="w-[400px] border-r border-white/5 p-8 flex flex-col gap-6 bg-background/30">
                    <div className="w-full h-12 bg-white/5 rounded-xl" />
                    <div className="w-3/4 h-4 bg-white/5 rounded-full" />
                    <div className="w-full h-32 bg-white/5 rounded-2xl" />
                    <div className="w-full h-64 bg-white/5 rounded-2xl" />
                </div>

                {/* Main Content Skeleton */}
                <div className="flex-1 flex flex-col min-w-0">
                    <div className="flex-1 border-b border-white/5 p-8">
                        <div className="w-full h-full bg-white/[0.02] rounded-3xl border border-white/5" />
                    </div>
                    <div className="h-[400px] flex">
                        <div className="flex-1 border-r border-white/5 p-8">
                            <div className="w-full h-full bg-white/[0.02] rounded-2xl" />
                        </div>
                        <div className="w-[350px] border-r border-white/5 p-8 flex flex-col gap-4">
                            <div className="w-full h-10 bg-white/5 rounded-xl" />
                            <div className="w-full h-full bg-white/[0.02] rounded-xl" />
                        </div>
                        <div className="w-[300px] p-8">
                            <div className="w-full h-full bg-white/[0.02] rounded-xl" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LabSkeleton
