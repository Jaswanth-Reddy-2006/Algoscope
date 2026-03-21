import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Trash2, Zap } from 'lucide-react';
import { TrieEngine } from '../../visualizer/engines/TrieEngine';

interface TrieNode {
    id: string;
    char: string | null;
    isEndOfWord: boolean;
    children: { [char: string]: string };
}

const TrieVisualizer: React.FC = () => {
    const [nodes, setNodes] = useState<{ [id: string]: TrieNode }>({
        'root': { id: 'root', char: null, isEndOfWord: false, children: {} }
    });
    const [inputValue, setInputValue] = useState('');
    const [activeNodeId, setActiveNodeId] = useState<string | undefined>();
    const [message, setMessage] = useState('Add words to the Trie to see the structure grow.');

    const insertWord = async (word: string) => {
        if (!word) return;
        const newNodes = { ...nodes };
        let currId = 'root';

        for (let i = 0; i < word.length; i++) {
            const char = word[i].toUpperCase();
            setActiveNodeId(currId);
            setMessage(`Checking path for "${char}"...`);
            await new Promise(r => setTimeout(r, 600));

            if (!newNodes[currId].children[char]) {
                const newId = `node-${Math.random().toString(36).substr(2, 9)}`;
                newNodes[currId].children[char] = newId;
                newNodes[newId] = {
                    id: newId,
                    char,
                    isEndOfWord: false,
                    children: {}
                };
                setMessage(`Created new node for "${char}"`);
                setNodes({ ...newNodes });
                await new Promise(r => setTimeout(r, 400));
            }
            currId = newNodes[currId].children[char];
        }

        newNodes[currId].isEndOfWord = true;
        setNodes({ ...newNodes });
        setActiveNodeId(currId);
        setMessage(`Word "${word.toUpperCase()}" inserted successfully!`);
        setTimeout(() => setActiveNodeId(undefined), 2000);
    };

    const handleInsert = () => {
        const word = inputValue.trim();
        if (word) {
            insertWord(word);
            setInputValue('');
        }
    };

    const handleClear = () => {
        setNodes({ 'root': { id: 'root', char: null, isEndOfWord: false, children: {} } });
        setMessage('Trie cleared.');
    };

    return (
        <div className="w-full h-full flex flex-col bg-[#2b0d38]/20 backdrop-blur-xl rounded-3xl border border-white/5 overflow-hidden">
            {/* Display Area */}
            <div className="flex-1 relative overflow-hidden flex items-center justify-center p-8">
                <TrieEngine 
                    nodes={nodes} 
                    rootId="root" 
                    activeNodeId={activeNodeId} 
                />

                {/* Status Overlay */}
                <div className="absolute top-8 left-8 flex flex-col gap-4">
                    <motion.div
                        key={message}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md"
                    >
                        <p className="text-xs text-white/60 font-medium italic">{message}</p>
                    </motion.div>
                </div>
            </div>

            {/* Controls Area */}
            <div className="p-8 bg-black/40 border-t border-white/5">
                <div className="max-w-xl mx-auto flex flex-col gap-6">
                    <div className="flex gap-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleInsert()}
                                placeholder="E.g. APPLE, APP..."
                                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white font-mono placeholder:text-white/10 focus:outline-none focus:border-[#EC4186]/50 transition-all"
                            />
                        </div>
                        <button
                            onClick={handleInsert}
                            className="px-8 py-4 bg-gradient-to-br from-[#EC4186] to-[#EE544A] text-white font-black rounded-2xl uppercase tracking-widest text-[10px] shadow-lg shadow-[#EC4186]/20 hover:scale-105 transition-all flex items-center gap-2"
                        >
                            <Plus size={16} />
                            Insert
                        </button>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                                <Zap size={14} />
                                <span className="text-[10px] font-bold uppercase tracking-wider">Dynamic Engine</span>
                            </div>
                            <span className="text-[10px] text-white/20 uppercase font-black tracking-[0.2em]">Complexity: O(word_length)</span>
                        </div>

                        <button
                            onClick={handleClear}
                            className="p-3 rounded-xl bg-white/5 border border-white/10 text-white/40 hover:bg-rose-500/20 hover:text-rose-400 hover:border-rose-500/30 transition-all"
                            title="Clear Trie"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrieVisualizer;
