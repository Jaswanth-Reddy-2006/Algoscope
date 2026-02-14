import React, { useState } from 'react'
import { Code, Clock, Database } from 'lucide-react'
import { codeTemplates } from './codeTemplates'

interface Props {
    mode: string
    language?: 'javascript' | 'python'
}

const CodePanel: React.FC<Props> = ({ mode, language = 'javascript' }) => {
    const [activeLang, setActiveLang] = useState<'javascript' | 'python'>(language)
    const template = codeTemplates[mode]

    if (!template) return null

    const code = activeLang === 'javascript' ? template.javascript : template.python

    return (
        <div className="flex flex-col h-full bg-black/40 backdrop-blur-md border-l border-white/5 w-[350px]">
            {/* Header */}
            <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2 text-white/60">
                    <Code size={16} />
                    <span className="text-xs font-bold uppercase tracking-widest">Implementation</span>
                </div>

                {/* Lang Switcher */}
                <div className="flex bg-white/5 rounded-lg p-0.5">
                    <button
                        onClick={() => setActiveLang('javascript')}
                        className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase transition-all ${activeLang === 'javascript' ? 'bg-accent-blue text-black' : 'text-white/40 hover:text-white'}`}
                    >
                        JS
                    </button>
                    <button
                        onClick={() => setActiveLang('python')}
                        className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase transition-all ${activeLang === 'python' ? 'bg-accent-blue text-black' : 'text-white/40 hover:text-white'}`}
                    >
                        PY
                    </button>
                </div>
            </div>

            {/* Code View */}
            <div className="flex-1 overflow-auto p-6 font-mono text-sm relative">
                <div className="absolute top-6 left-6 bottom-6 w-px bg-white/10" />
                <pre className="pl-6 text-white/70 leading-relaxed whitespace-pre-wrap">
                    {code}
                </pre>
            </div>

            {/* Complexity Footer */}
            <div className="p-6 border-t border-white/5 bg-white/5">
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-white/40 text-[10px] font-bold uppercase tracking-widest">
                            <Clock size={12} /> Time
                        </div>
                        <span className="text-emerald-400 font-mono font-bold text-lg">{template.timeComplexity}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-white/40 text-[10px] font-bold uppercase tracking-widest">
                            <Database size={12} /> Space
                        </div>
                        <span className="text-blue-400 font-mono font-bold text-lg">{template.spaceComplexity}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CodePanel
