import React from 'react'
import { AlertTriangle } from 'lucide-react'

export const WhenItFailsBox: React.FC = () => {
    return (
        <div className="p-6 rounded-2xl bg-red-500/[0.05] border-2 border-red-500/20">
            <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="text-red-400" size={20} />
                <h3 className="text-lg font-bold text-white">Do NOT use sliding window when:</h3>
            </div>

            <ul className="space-y-3">
                <li className="flex items-start gap-3 text-sm text-white/80">
                    <span className="text-red-400 shrink-0">•</span>
                    <span>Elements can be <strong className="text-white">negative</strong> (for sum constraints)</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-white/80">
                    <span className="text-red-400 shrink-0">•</span>
                    <span>Window validity is <strong className="text-white">non-monotonic</strong></span>
                </li>
                <li className="flex items-start gap-3 text-sm text-white/80">
                    <span className="text-red-400 shrink-0">•</span>
                    <span>Problem is <strong className="text-white">not contiguous</strong></span>
                </li>
            </ul>
        </div>
    )
}
