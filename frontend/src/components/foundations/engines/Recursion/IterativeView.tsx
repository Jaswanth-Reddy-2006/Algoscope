import React from 'react';
import { motion } from 'framer-motion';
import { Database } from 'lucide-react';

const IterativeView: React.FC<{ algorithmId: string }> = ({ algorithmId }) => {
    const code = algorithmId === 'factorial' ? `function iterativeFactorial(n) {
  let stack = [];
  let result = 1;
  while (n > 1) {
    stack.push(n);
    n--;
  }
  while (stack.length > 0) {
    result *= stack.pop();
  }
  return result;
}` : `function iterativeFibonacci(n) {
  let stack = [n];
  let result = 0;
  while (stack.length > 0) {
    let curr = stack.pop();
    if (curr <= 1) result += curr;
    else {
      stack.push(curr - 1);
      stack.push(curr - 2);
    }
  }
  return result;
}`;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full h-full bg-[#2b0d38] border border-amber-500/20 rounded-3xl p-8 flex flex-col gap-6"
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
                        <Database size={20} />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-white uppercase tracking-widest">Explicit Stack Implementation</h3>
                        <p className="text-[10px] text-white/40 font-mono">Simulating recursion with a manual stack</p>
                    </div>
                </div>
            </div>

            <div className="flex-1 bg-black/40 rounded-2xl border border-white/5 p-6 font-mono text-xs leading-relaxed overflow-auto">
                <pre className="text-white/80">
                    {code}
                </pre>
            </div>

            <div className="p-6 rounded-2xl bg-amber-500/5 border border-amber-500/10">
                <div className="flex items-center gap-2 text-amber-500 mb-2">
                    <Database size={14} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Core Insight</span>
                </div>
                <p className="text-xs text-white/60 leading-relaxed italic">
                    All recursive functions can be rewritten using a <strong>while-loop</strong> and an <strong>explicit stack</strong>. Recursion is just "syntactic sugar" for this process provided by the language's call stack.
                </p>
            </div>
        </motion.div>
    );
};

export default IterativeView;
