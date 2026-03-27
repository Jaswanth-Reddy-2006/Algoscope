import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../../store/useStore'
import {
    Zap,
    Target,
    Sliders,
    Clock,
    Layout,
    Code2,
    RefreshCw,
    Dices,
    ListChecks,
    Play
} from 'lucide-react'
import { cn } from '../../utils/cn'
import { getStrategyForProblem } from '../../registry/problemStrategyRegistry'
import ProblemTreePreview from '../foundations/engines/Recursion/AdvancedBST/ProblemTreePreview'

// LeetCode style array to Tree parser
const parseLeetCodeTree = (input: string): any | null => {
    try {
        const arr = JSON.parse(input.replace(/none/gi, 'null'));
        if (!Array.isArray(arr) || arr.length === 0 || arr[0] === null) return null;

        const root: any = { val: arr[0] };
        const queue: (any | null)[] = [root];
        let i = 1;

        while (i < arr.length && queue.length > 0) {
            const curr = queue.shift();
            if (!curr) continue;

            // Left child
            if (i < arr.length) {
                if (arr[i] !== null) {
                    curr.left = { val: arr[i] };
                    queue.push(curr.left);
                } else {
                    queue.push(null);
                }
                i++;
            }

            // Right child
            if (i < arr.length) {
                if (arr[i] !== null) {
                    curr.right = { val: arr[i] };
                    queue.push(curr.right);
                } else {
                    queue.push(null);
                }
                i++;
            }
        }
        return root;
    } catch (e) {
        return null;
    }
};

const ProblemInfo: React.FC = () => {
    const currentProblem = useStore(state => state.currentProblem)
    const isBruteForce = useStore(state => state.isBruteForce)
    const compareMode = useStore(state => state.compareMode)
    const setSimulationMode = useStore(state => state.setSimulationMode)
    const customInput = useStore(state => state.customInput)
    const customTarget = useStore(state => state.customTarget)
    const setCustomInput = useStore(state => state.setCustomInput)
    const setCustomTarget = useStore(state => state.setCustomTarget)
    const refreshSteps = useStore(state => state.refreshSteps)
    const selectedVariantIndex = useStore(state => state.selectedVariantIndex)
    const setVariantIndex = useStore(state => state.setVariantIndex)
    const labInputs = useStore(state => state.labInputs)
    const setLabInput = useStore(state => state.setLabInput)
    const activePseudoLine = useStore(state => state.activePseudoLine)
    const observationText = useStore(state => state.observationText)

    if (!currentProblem) return null;

    const strategyPair = getStrategyForProblem(currentProblem.slug)

    const treeData = React.useMemo(() =>
        currentProblem?.algorithmType === 'tree' ? parseLeetCodeTree(customInput) : null
        , [customInput, currentProblem?.algorithmType]);

    const activeNodeVal = null; // Placeholder as it's not currently in store

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            refreshSteps()
        }
    }

    const resetLabInputs = useStore(state => state.resetLabInputs)

    const setRandomExample = () => {
        // Priority 0: Problem-specific random generators
        if (currentProblem.slug === 'two-sum') {
            const size = Math.floor(Math.random() * 6) + 4; // 4 to 10
            const nums = Array.from({ length: size }, () => Math.floor(Math.random() * 50) + 1);
            const idx1 = Math.floor(Math.random() * size);
            let idx2 = Math.floor(Math.random() * size);
            while (idx1 === idx2) idx2 = Math.floor(Math.random() * size);
            const target = nums[idx1] + nums[idx2];
            
            resetLabInputs({
                nums: JSON.stringify(nums),
                target: String(target)
            });
            setTimeout(() => refreshSteps(), 100);
            return;
        }

        if (currentProblem.slug === 'add-two-numbers') {
            const l1 = Array.from({ length: Math.floor(Math.random() * 3) + 2 }, () => Math.floor(Math.random() * 10));
            const l2 = Array.from({ length: Math.floor(Math.random() * 3) + 2 }, () => Math.floor(Math.random() * 10));
            resetLabInputs({
                l1: JSON.stringify(l1),
                l2: JSON.stringify(l2)
            });
            setTimeout(() => refreshSteps(), 100);
            return;
        }

        if (currentProblem.slug === 'longest-substring-without-repeating-characters') {
            const charPool = "abcde";
            const s = Array.from({ length: 8 }, () => charPool[Math.floor(Math.random() * charPool.length)]).join('');
            resetLabInputs({ s: `"${s}"` });
            setTimeout(() => refreshSteps(), 100);
            return;
        }

        // Priority 1: Use structuredExamples from store
        if (currentProblem.structuredExamples) {
            try {
                const examples = typeof currentProblem.structuredExamples === 'string' ? JSON.parse(currentProblem.structuredExamples) : currentProblem.structuredExamples;
                if (Array.isArray(examples) && examples.length > 0) {
                    const randomEx = examples[Math.floor(Math.random() * examples.length)];
                    if (randomEx.input && typeof randomEx.input === 'object') {
                        const newInputs: Record<string, any> = {};
                        Object.entries(randomEx.input).forEach(([key, value]) => {
                            newInputs[key] = typeof value === 'object' ? JSON.stringify(value) : String(value);
                        });
                        resetLabInputs(newInputs);
                        setTimeout(() => refreshSteps(), 100);
                        return;
                    }
                }
            } catch (e) {
                console.warn("Failed to use structuredExamples for randomization:", e);
            }
        }

        // Priority 2: Fallback to parsing raw examples strings
        if (!currentProblem.examples || currentProblem.examples.length === 0) return;
        const randomEx = currentProblem.examples[Math.floor(Math.random() * currentProblem.examples.length)];
        
        let rawInput = typeof randomEx === 'string' ? randomEx : randomEx.input || '';
        const newInputs: Record<string, any> = {};

        if (currentProblem.labConfig) {
            try {
                const config = typeof currentProblem.labConfig === 'string' ? JSON.parse(currentProblem.labConfig) : currentProblem.labConfig;
                if (config.parameters) {
                    if (typeof rawInput === 'object' && rawInput !== null) {
                        config.parameters.forEach((param: any) => {
                            if (rawInput[param.name] !== undefined) {
                                newInputs[param.name] = typeof rawInput[param.name] === 'object' ? JSON.stringify(rawInput[param.name]) : String(rawInput[param.name]);
                            }
                        });
                    } else {
                        const exString = String(rawInput);
                        config.parameters.forEach((param: any) => {
                            const regex = new RegExp(`(?:^|,|\\s)${param.name}\\s*=\\s*(\\[[\\s\\S]*?\\\]|{[\\s\\S]*?}|\\".*?\\"|[^,\\n]+)`, 'i');
                            const match = exString.match(regex);
                            if (match) {
                                let val = match[1].trim();
                                if (val.endsWith(',')) val = val.slice(0, -1).trim();
                                newInputs[param.name] = val;
                            }
                        });
                    }
                }
            } catch (e) {
                console.warn("Failed to parse labConfig for examples:", e);
            }
        }
        
        if (Object.keys(newInputs).length > 0) {
            resetLabInputs(newInputs);
        } else {
            // Last resort: extract anything that looks like an array or string
            let extractedInput = '';
            const exString = typeof rawInput === 'object' ? JSON.stringify(rawInput) : String(rawInput);
            const arrMatch = exString.match(/\[.*?\]/);
            const strMatch = exString.match(/"(.*?)"/);
            
            if (arrMatch) extractedInput = arrMatch[0];
            else if (strMatch) extractedInput = strMatch[0];
            else {
                const parts = exString.split('=');
                extractedInput = parts.length > 1 ? parts[1].split(',')[0].trim() : exString;
            }
            resetLabInputs({ input1: extractedInput });
        }
        
        setTimeout(() => refreshSteps(), 100);
    }

    const getTreePseudocode = (mode: string) => {
        const visitLabel = mode === 'inorder' ? 'Visit Root' : mode === 'preorder' ? 'Visit Root (High-Level)' : 'Visit Root (Post-Process)';
        return `void ${mode}(Node root) {
  // 1. Base Case
  if (root == null) return;

  ${mode === 'preorder' ? 'visit(root.val); // ' + visitLabel : mode === 'inorder' ? mode + '(root.left);' : mode + '(root.left);'}
  ${mode === 'preorder' ? mode + '(root.left);' : mode === 'inorder' ? 'visit(root.val); // ' + visitLabel : mode + '(root.right);'}
  ${mode === 'preorder' ? mode + '(root.right);' : mode === 'inorder' ? mode + '(root.right);' : 'visit(root.val); // ' + visitLabel}
}`;
    };

    const brutePseudocode = currentProblem.algorithmType === 'tree' ?
        `// Iterative Tree Traversal using Stack
void iterative(Node root) {
  Stack stack = new Stack();
  Node curr = root;
  while (curr != null || !stack.isEmpty()) {
    while (curr != null) {
      stack.push(curr);
      curr = curr.left;
    }
    curr = stack.pop();
    visit(curr.val);
    curr = curr.right;
  }
}` : (currentProblem.pseudocode?.brute ||
            (currentProblem.thinking_guide as any)?.naive_approach?.join('\n') ||
            (currentProblem.brute_force_steps as any[])?.map(s => s.description).join('\n') ||
            "")
    const optimalPseudocode = currentProblem.algorithmType === 'tree' ?
        getTreePseudocode(currentProblem.slug?.includes('preorder') ? 'preorder' : currentProblem.slug?.includes('postorder') ? 'postorder' : 'inorder') :
        (currentProblem.optimal_variants?.[selectedVariantIndex]?.pseudocode ||
            currentProblem.pseudocode?.optimal ||
            (currentProblem.thinking_guide as any)?.approach_blueprint?.join('\n') ||
            (currentProblem.optimal_steps as any[])?.map(s => s.description).join('\n') ||
            "")

    const expectedOutput = React.useMemo(() => {
        try {
            const parseInput = (val: any) => {
                if (typeof val === 'string') {
                    try { return JSON.parse(val); } catch { return val; }
                }
                return val;
            };

            const slug = currentProblem.slug.toLowerCase();

            if (slug === 'fibonacci-number') {
                const n = Number(labInputs.n || 0);
                const fib = (num: number): number => num <= 1 ? num : fib(num - 1) + fib(num - 2);
                return fib(n);
            }
            if (slug === 'two-sum') {
                const nums = parseInput(labInputs.nums) || [];
                const target = Number(labInputs.target || 0);
                const map = new Map();
                for (let i = 0; i < nums.length; i++) {
                    const diff = target - nums[i];
                    if (map.has(diff)) return [map.get(diff), i];
                    map.set(nums[i], i);
                }
                return "No solution";
            }
            if (slug === 'add-two-numbers') {
                const l1 = parseInput(labInputs.l1) || [];
                const l2 = parseInput(labInputs.l2) || [];
                let carry = 0, res = [], i = 0, j = 0;
                while (i < l1.length || j < l2.length || carry) {
                    const v1 = i < l1.length ? l1[i++] : 0;
                    const v2 = j < l2.length ? l2[j++] : 0;
                    const sum = v1 + v2 + carry;
                    res.push(sum % 10);
                    carry = Math.floor(sum / 10);
                }
                return res;
            }
            if (slug === 'longest-substring-without-repeating-characters') {
                const s = String(labInputs.s || "").replace(/^"|"$/g, '');
                let max = 0, start = 0, map = new Map();
                for (let end = 0; end < s.length; end++) {
                    if (map.has(s[end])) start = Math.max(map.get(s[end]) + 1, start);
                    map.set(s[end], end);
                    max = Math.max(max, end - start + 1);
                }
                return max;
            }
            if (slug === '3sum' || slug === 'three-sum') {
                const nums = parseInput(labInputs.nums) || [];
                if (!Array.isArray(nums)) return null;
                nums.sort((a, b) => a - b);
                const res = [];
                for (let i = 0; i < nums.length - 2; i++) {
                    if (i > 0 && nums[i] === nums[i - 1]) continue;
                    let left = i + 1, right = nums.length - 1;
                    while (left < right) {
                        const sum = nums[i] + nums[left] + nums[right];
                        if (sum === 0) {
                            res.push([nums[i], nums[left], nums[right]]);
                            while (left < right && nums[left] === nums[left + 1]) left++;
                            while (left < right && nums[right] === nums[right - 1]) right--;
                            left++; right--;
                        } else if (sum < 0) left++;
                        else right--;
                    }
                }
                return res;
            }
            if (slug === 'container-with-most-water') {
                const height = parseInput(labInputs.height) || [];
                if (!Array.isArray(height)) return null;
                let maxArea = 0, left = 0, right = height.length - 1;
                while (left < right) {
                    maxArea = Math.max(maxArea, Math.min(height[left], height[right]) * (right - left));
                    if (height[left] < height[right]) left++;
                    else right--;
                }
                return maxArea;
            }

            // Generic heuristic: Look for match in `examples` payload
            if (currentProblem.examples && currentProblem.examples.length > 0) {
                const inputValues = Object.values(labInputs).map(v => String(v).replace(/\s/g, ''));
                if (inputValues.length > 0) {
                    for (const ex of currentProblem.examples) {
                        const exInputStr = typeof ex.input === 'string' ? ex.input : JSON.stringify(ex.input);
                        const cleanEx = exInputStr.replace(/\s/g, '');
                        // If all our labInput values are found in this example's input representation
                        if (inputValues.every(valStr => cleanEx.includes(valStr))) {
                            return ex.output;
                        }
                    }
                }
            }

        } catch (e) { return null; }
        return null;
    }, [currentProblem.slug, labInputs]);

    return (
        <div className="flex flex-col gap-8 pb-32 px-1">
            {/* 1️⃣ Problem & Data context */}
            <section className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Target size={14} className="text-accent-blue" />
                        <h3 className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-black">Problem Context</h3>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className={cn(
                            "badge-premium font-bold tracking-[0.2em] py-1 px-3 text-[8px]",
                            currentProblem.difficulty === 'Easy' ? 'text-[#EE544A] border-[#EE544A]/20 bg-[#EE544A]/10' :
                                currentProblem.difficulty === 'Medium' ? 'text-[#EC4186] border-[#EC4186]/20 bg-[#EC4186]/10' :
                                    'text-[#FF6B6B] border-[#FF6B6B]/20 bg-[#FF6B6B]/10'
                        )}>
                            {currentProblem.difficulty}
                        </span>
                    </div>
                </div>


                <div className="p-6 rounded-[24px] bg-white/[0.03] border border-white/10 relative overflow-hidden group hover:border-white/20 transition-all font-sans problem-description-content">
                    <style>{`
                        .problem-description-content p { margin-bottom: 1em; color: rgba(255,255,255,0.8); line-height: 1.6; font-size: 13px; font-weight: 500; word-break: break-word; }
                        .problem-description-content strong { color: white; font-weight: 900; }
                        .problem-description-content pre { background: rgba(0,0,0,0.4); padding: 12px; border-radius: 8px; font-family: monospace; font-size: 11px; color: #EC4186; margin-top: 10px; margin-bottom: 10px; border: 1px solid rgba(255,255,255,0.05); overflow-x: auto; max-width: 100%; }
                        .problem-description-content code { font-family: monospace; color: #EC4186; font-size: 12px; background: rgba(255,255,255,0.05); padding: 2px 4px; border-radius: 4px; word-break: break-all; }
                        .problem-description-content ul { list-style-type: disc; padding-left: 20px; margin-bottom: 1em; color: rgba(255,255,255,0.7); font-size: 13px; }
                        .problem-description-content li { margin-bottom: 0.5em; }
                    `}</style>
                    <div dangerouslySetInnerHTML={{ __html: currentProblem.problem_statement || '' }} />
                </div>

                {/* Lab Configuration (Data Structure Input) */}
                <div className="p-6 rounded-[24px] bg-white/[0.02] border border-white/5 space-y-5">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Sliders size={12} className="text-[#EC4186]" />
                            <span className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em]">Lab Parameters</span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {/* Dynamic Parameters */}
                        {(() => {
                            if (currentProblem.labConfig) {
                                try {
                                    const config = typeof currentProblem.labConfig === 'string' ? JSON.parse(currentProblem.labConfig) : currentProblem.labConfig
                                    if (config.parameters) {
                                        return config.parameters.map((param: any) => (
                                            <div key={param.name} className="space-y-2">
                                                <label className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em] pl-1">
                                                    {param.label || param.name}
                                                </label>
                                                <input
                                                    type={param.type === 'number' ? 'number' : 'text'}
                                                    value={labInputs[param.name] ?? ''}
                                                    min={param.min}
                                                    max={param.max}
                                                    onChange={(e) => {
                                                        const val = e.target.value;
                                                        if (param.type === 'number') {
                                                            const num = Number(val);
                                                            if (param.min !== undefined && num < param.min) return;
                                                            if (param.max !== undefined && num > param.max) return;
                                                        }
                                                        setLabInput(param.name, val);
                                                    }}
                                                    onKeyDown={handleKeyDown}
                                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-xs font-mono text-white focus:border-[#EC4186]/40 outline-none transition-all placeholder:text-white/10"
                                                    placeholder={param.defaultValue ?? ""}
                                                />
                                            </div>
                                        ))
                                    }
                                } catch (e) {
                                    console.warn("LabConfig render failed:", e)
                                }
                            }
                            
                            // Legacy Fallback
                            return (
                                <>
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em] pl-1">
                                            {currentProblem.algorithmType === 'tree' ? "Binary Tree Array" : (currentProblem.input_settings?.input1.label || "Dataset")}
                                        </label>
                                        <input
                                            type="text"
                                            value={customInput}
                                            onChange={(e) => setCustomInput(e.target.value)}
                                            onKeyDown={handleKeyDown}
                                            className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-xs font-mono text-white focus:border-[#EC4186]/40 outline-none transition-all placeholder:text-white/10"
                                            placeholder={currentProblem.input_settings?.input1.placeholder || "[1,2,3,null,4,5]"}
                                        />
                                    </div>

                                    {currentProblem.algorithmType === 'tree' && treeData && (
                                        <div className="pt-2">
                                            <ProblemTreePreview treeData={treeData} activeNodeVal={activeNodeVal} />
                                        </div>
                                    )}

                                    {currentProblem.algorithmType !== 'tree' && (
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em] pl-1">
                                                {currentProblem.input_settings?.input2.label || "Constraint Variable"}
                                            </label>
                                            <input
                                                type="text"
                                                value={customTarget}
                                                onChange={(e) => setCustomTarget(e.target.value)}
                                                onKeyDown={handleKeyDown}
                                                className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-xs font-mono text-white focus:border-[#EC4186]/40 outline-none transition-all"
                                                placeholder={currentProblem.input_settings?.input2.placeholder || ""}
                                            />
                                        </div>
                                    )}
                                </>
                            )
                        })()}

                        {/* Expected Output Preview */}
                        {expectedOutput !== null && (
                            <div className="p-4 rounded-2xl bg-[#EC4186]/5 border border-[#EC4186]/10 space-y-2">
                                <div className="flex items-center gap-2">
                                    <ListChecks size={12} className="text-[#EC4186]" />
                                    <span className="text-[9px] font-black text-[#EC4186]/60 uppercase tracking-[0.2em]">Expected Result</span>
                                </div>
                                <div className="text-xs font-mono font-bold text-white/90 pl-1">
                                    {typeof expectedOutput === 'object' ? JSON.stringify(expectedOutput) : String(expectedOutput)}
                                </div>
                            </div>
                        )}

                        <div className="pt-4 flex gap-3">
                            <button
                                onClick={refreshSteps}
                                className="flex-1 py-4 bg-[#EC4186] text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-[0_10px_20px_rgba(236,65,134,0.3)] hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-3 border border-white/20"
                            >
                                <Play size={14} fill="white" />
                                Execute Logic
                            </button>
                            {currentProblem.examples && currentProblem.examples.length > 0 && (
                                <button
                                    onClick={setRandomExample}
                                    className="px-6 py-4 rounded-2xl bg-white/[0.05] border border-white/10 hover:bg-white/[0.1] transition-all text-[#EC4186] flex items-center justify-center"
                                    title="Randomize Parameters"
                                >
                                    <Dices size={18} />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* 2️⃣ Strategy Selector */}
            <section className="space-y-4 pt-4 border-t border-white/10">
                <div className="flex items-center gap-2">
                    <Layout size={14} className="text-accent-blue" />
                    <h3 className="text-[10px] uppercase tracking-[0.2em] text-white/50 font-black">Strategical Section</h3>
                </div>

                <div className="flex items-center gap-2 bg-black/40 p-1.5 rounded-[20px] border border-white/10 w-full font-sans">
                    <button
                        onClick={() => setSimulationMode('brute')}
                        className={cn(
                            "flex-1 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all",
                            isBruteForce && !compareMode ? "bg-[#EE544A] text-white shadow-[0_0_15px_rgba(238,84,74,0.4)]" : "text-white/30 hover:text-white/60"
                        )}
                    >
                        Brute Force
                    </button>
                    <button
                        onClick={() => setSimulationMode('optimal')}
                        className={cn(
                            "flex-1 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all",
                            !isBruteForce && !compareMode ? "bg-[#EC4186] text-white shadow-[0_0_15px_rgba(236,65,134,0.4)]" : "text-white/30 hover:text-white/60"
                        )}
                    >
                        Optimal
                    </button>
                    <button
                        onClick={() => setSimulationMode('compare')}
                        className={cn(
                            "flex-1 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all",
                            compareMode ? "bg-white text-black font-black" : "text-white/30 hover:text-white/60"
                        )}
                    >
                        Compare
                    </button>
                </div>

                {/* Optimal Variants Selector */}
                {!isBruteForce && !compareMode && strategyPair && strategyPair.variants && strategyPair.variants.length > 1 && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-wrap gap-2 pt-2"
                    >
                        {strategyPair.variants.map((variant: any, idx: number) => (
                            <button
                                key={variant.name}
                                onClick={() => setVariantIndex(idx)}
                                className={cn(
                                    "px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-wider border transition-all",
                                    selectedVariantIndex === idx
                                        ? "bg-[#EC4186]/20 border-[#EC4186] text-[#EC4186] shadow-[0_0_10px_rgba(236,65,134,0.2)]"
                                        : "bg-white/[0.02] border-white/10 text-white/40 hover:text-white/60 hover:border-white/20"
                                )}
                            >
                                {variant.name}
                            </button>
                        ))}
                    </motion.div>
                )}

                <AnimatePresence mode="wait">
                    <motion.div
                        key={compareMode ? 'compare' : isBruteForce ? 'brute' : 'optimal'}
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        className={cn(
                            "p-6 rounded-[28px] border transition-all duration-500",
                            compareMode ? "bg-purple-500/5 border-purple-500/20" :
                                isBruteForce ? "bg-red-500/5 border-red-500/20" : "bg-[#EC4186]/5 border-[#EC4186]/20"
                        )}
                    >
                        <div className="flex items-center gap-2 mb-4">
                            <Zap size={14} className={compareMode ? "text-white" : isBruteForce ? "text-[#EE544A]" : "text-[#EC4186]"} />
                            <span className={cn(
                                "text-[11px] uppercase font-black tracking-[0.2em]",
                                compareMode ? "text-white" : isBruteForce ? "text-[#EE544A]" : "text-[#EC4186]"
                            )}>
                                {compareMode ? "Performance Delta" : isBruteForce ? "Naive Mechanism" : "Optimal Strategy"}
                            </span>
                        </div>
                        <p className="text-[12px] text-white/60 leading-relaxed font-bold uppercase tracking-wider">
                            {compareMode
                                ? "Analyzing efficiency gains. Adaptive strategies typically reduce redundant work by leveraging problem-specific properties."
                                : isBruteForce
                                    ? (currentProblem.brute_force_explanation || "Focuses on explicit state management, often sacrificing performance for algorithmic simplicity.")
                                    : (currentProblem.optimal_variants?.[selectedVariantIndex]?.explanation || currentProblem.optimal_explanation || "Leverages recursive structures or dynamic data patterns to minimize computational overhead.")
                            }
                        </p>
                    </motion.div>
                </AnimatePresence>
            </section>

            {/* 3️⃣ Abstract Logic (Pseudocode) */}
            <section className="space-y-4 pt-4 border-t border-white/10">
                <div className="flex items-center gap-2">
                    <Code2 size={14} className="text-accent-blue" />
                    <h3 className="text-[10px] uppercase tracking-[0.2em] text-white/50 font-black">Abstract Logic</h3>
                </div>

                <AnimatePresence>
                    {observationText && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="p-4 rounded-2xl bg-[#EC4186]/10 border border-[#EC4186]/20 mb-4 shadow-lg"
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <RefreshCw size={10} className="text-[#EC4186] animate-spin" />
                                <span className="text-[8px] font-black text-[#EC4186] uppercase tracking-[0.2em]">Live Sync</span>
                            </div>
                            <p className="text-[11px] text-white font-bold italic">
                                "{observationText}"
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="space-y-4">
                    <AnimatePresence mode="wait">
                        {isBruteForce && !compareMode && brutePseudocode && (
                            <motion.div
                                key="brute"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="rounded-2xl bg-black/60 border border-[#EE544A]/20 overflow-hidden shadow-xl"
                            >
                                <div className="bg-[#EE544A]/10 border-b border-[#EE544A]/20 px-4 py-2 flex items-center gap-2">
                                    <span className="text-[9px] font-black text-[#EE544A] uppercase tracking-widest">Brute Force Logic</span>
                                </div>
                                {brutePseudocode.split('\n').filter((l: string) => l.trim()).map((line: string, idx: number) => {
                                    const lineNum = idx + 1;
                                    const isActive = activePseudoLine === lineNum;
                                    return (
                                        <div
                                            key={idx}
                                            className={cn(
                                                "px-6 py-2 flex gap-4 font-mono text-[10px] transition-all border-l-4",
                                                isActive ? "bg-[#EE544A]/30 text-white border-[#EE544A]" : "text-white/30 border-transparent hover:text-white/50 hover:bg-white/[0.02]"
                                            )}
                                        >
                                            <span className="w-4 opacity-20 text-right">{lineNum}</span>
                                            <span className="whitespace-pre-wrap">{line}</span>
                                        </div>
                                    );
                                })}
                            </motion.div>
                        )}
                        {!isBruteForce && !compareMode && optimalPseudocode && (
                            <motion.div
                                key="optimal"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="rounded-2xl bg-black/60 border border-[#EC4186]/20 overflow-hidden shadow-xl"
                            >
                                <div className="bg-[#EC4186]/10 border-b border-[#EC4186]/20 px-4 py-2 flex items-center gap-2">
                                    <span className="text-[9px] font-black text-[#EC4186] uppercase tracking-widest">Optimal Logic</span>
                                </div>
                                {optimalPseudocode.split('\n').filter((l: string) => l.trim()).map((line: string, idx: number) => {
                                    const lineNum = idx + 1;
                                    const isActive = activePseudoLine === lineNum;
                                    return (
                                        <div
                                            key={idx}
                                            className={cn(
                                                "px-6 py-2 flex gap-4 font-mono text-[10px] transition-all border-l-4",
                                                isActive ? "bg-[#EC4186]/30 text-white border-[#EC4186]" : "text-white/30 border-transparent hover:text-white/50 hover:bg-white/[0.02]"
                                            )}
                                        >
                                            <span className="w-4 opacity-20 text-right">{lineNum}</span>
                                            <span className="whitespace-pre-wrap">{line}</span>
                                        </div>
                                    );
                                })}
                            </motion.div>
                        )}
                        {compareMode && (
                            <div className="flex flex-col gap-4">
                                {brutePseudocode && (
                                    <div className="rounded-2xl bg-black/60 border border-[#EE544A]/20 overflow-hidden shadow-xl">
                                        <div className="bg-[#EE544A]/10 border-b border-[#EE544A]/20 px-4 py-2">
                                            <span className="text-[9px] font-black text-[#EE544A] uppercase tracking-widest">Brute Force</span>
                                        </div>
                                        <div className="p-4 text-[10px] text-white/40 italic">
                                            Switch to Brute Force mode to view full logic.
                                        </div>
                                    </div>
                                )}
                                {optimalPseudocode && (
                                    <div className="rounded-2xl bg-black/60 border border-[#EC4186]/20 overflow-hidden shadow-xl">
                                        <div className="bg-[#EC4186]/10 border-b border-[#EC4186]/20 px-4 py-2">
                                            <span className="text-[9px] font-black text-[#EC4186] uppercase tracking-widest">Optimal</span>
                                        </div>
                                        <div className="p-4 text-[10px] text-white/40 italic">
                                            Switch to Optimal mode to view full logic.
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </section>



            {/* 6️⃣ Constraints & Edge Cases */}
            {((currentProblem.constraints && currentProblem.constraints.length > 0) || (currentProblem.edgeCases && currentProblem.edgeCases.length > 0)) && (
                <section className="space-y-4 pt-4 border-t border-white/10">
                    <div className="grid grid-cols-2 gap-4">
                        {(currentProblem.constraints && currentProblem.constraints.length > 0) && (
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <ListChecks size={14} className="text-accent-blue" />
                                    <h3 className="text-[10px] uppercase tracking-[0.2em] text-white/50 font-black">Constraints</h3>
                                </div>
                                <div className="space-y-2">
                                    {currentProblem.constraints.map((c: string, i: number) => (
                                        <div key={i} className="px-4 py-2 rounded-xl bg-white/[0.02] border border-white/5 text-[11px] text-white/40 font-mono">
                                            {c}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        {(currentProblem.edgeCases && currentProblem.edgeCases.length > 0) && (
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <Zap size={14} className="text-[#EE544A]" />
                                    <h3 className="text-[10px] uppercase tracking-[0.2em] text-white/50 font-black">Edge Cases</h3>
                                </div>
                                <div className="space-y-2">
                                    {currentProblem.edgeCases.map((e: string, i: number) => (
                                        <div key={i} className="px-4 py-2 rounded-xl bg-white/[0.02] border border-white/5 text-[11px] text-white/40 font-mono">
                                            {e}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </section>
            )}

            {/* 6️⃣ Hints & Heuristics */}
            {currentProblem.thinking_guide?.hints && currentProblem.thinking_guide.hints.length > 0 && (
                <section className="space-y-4 pt-4 border-t border-white/10">
                    <div className="flex items-center gap-2">
                        <Zap size={14} className="text-[#EC4186]" />
                        <h3 className="text-[10px] uppercase tracking-[0.2em] text-white/50 font-black">Hints & Heuristics</h3>
                    </div>
                    <div className="grid grid-cols-1 gap-3">
                        {currentProblem.thinking_guide.hints.map((hint: string, hIdx: number) => (
                            <div key={hIdx} className="p-5 rounded-[24px] bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all problem-description-content">
                                <h4 className="text-[10px] font-black text-white/30 mb-2 uppercase tracking-tight">Heuristic #{hIdx + 1}</h4>
                                <div 
                                    className="text-[12px] text-white/70 font-medium leading-[1.6]"
                                    dangerouslySetInnerHTML={{ __html: hint }} 
                                />
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* 5️⃣ Comparative Metrics */}
            <section className="space-y-6 pt-4 border-t border-white/10">
                <div className="flex items-center gap-2">
                    <Clock size={14} className="text-accent-blue" />
                    <h3 className="text-[10px] uppercase tracking-[0.2em] text-white/50 font-black">Performance Benchmarks</h3>
                </div>

                <div className="rounded-[28px] bg-[#0A0A0A] border border-white/10 overflow-hidden shadow-2xl">
                    <div className="grid grid-cols-3 bg-white/[0.04] text-[10px] font-black text-white/40 uppercase tracking-[0.2em] border-b border-white/10">
                        <div className="px-6 py-5 border-r border-white/10">Approach</div>
                        <div className="px-6 py-5 border-r border-white/10 text-center">Time</div>
                        <div className="px-6 py-5 text-center">Space</div>
                    </div>

                    <div className="divide-y divide-white/[0.05]">
                        <div className={cn("grid grid-cols-3 items-center transition-colors", isBruteForce && "bg-red-500/5")}>
                            <div className="px-6 py-5 border-r border-white/10 bg-white/[0.01]">
                                <span className="text-[9px] font-black uppercase text-[#EE544A]/60 tracking-widest">Brute Force</span>
                            </div>
                            <div className="px-6 py-5 border-r border-white/10 text-center">
                                <span className="text-[#EE544A] font-mono text-xs font-black">
                                    {(() => {
                                        try {
                                            const comp = typeof currentProblem.complexity === 'string' ? JSON.parse(currentProblem.complexity) : currentProblem.complexity;
                                            return comp?.brute?.time || 'O(N²)';
                                        } catch { return 'O(N²)'; }
                                    })()}
                                </span>
                            </div>
                            <div className="px-6 py-5 text-center">
                                <span className="text-white/40 font-mono text-[10px] uppercase">
                                    {(() => {
                                        try {
                                            const comp = typeof currentProblem.complexity === 'string' ? JSON.parse(currentProblem.complexity) : currentProblem.complexity;
                                            return comp?.brute?.space || 'O(1)';
                                        } catch { return 'O(1)'; }
                                    })()}
                                </span>
                            </div>
                        </div>

                        {(() => {
                            const optimals = currentProblem.optimal_variants && currentProblem.optimal_variants.length > 0
                                ? currentProblem.optimal_variants
                                : [{
                                    name: 'Optimal Strategy',
                                    complexity: {
                                        time: currentProblem.time_complexity || 'O(N)',
                                        space: currentProblem.space_complexity || 'O(1)'
                                    }
                                }];

                            return optimals.map((variant: any, idx: number) => (
                                <div key={idx} className={cn("grid grid-cols-3 items-center transition-colors", !isBruteForce && selectedVariantIndex === idx && !compareMode && "bg-[#EC4186]/5")}>
                                    <div className="px-6 py-5 border-r border-white/10 bg-white/[0.01]">
                                        <span className="text-[9px] font-black uppercase text-[#EC4186]/60 tracking-widest">{variant.name || `Optimal ${idx + 1}`}</span>
                                    </div>
                                    <div className="px-6 py-5 border-r border-white/10 text-center">
                                        <span className="text-[#EC4186] font-mono text-xs font-black">{variant.complexity?.time || variant.efficiency?.time || 'O(N)'}</span>
                                    </div>
                                    <div className="px-6 py-5 text-center">
                                        <span className="text-accent-blue font-mono text-xs font-black">{variant.complexity?.space || variant.efficiency?.space || 'O(1)'}</span>
                                    </div>
                                </div>
                            ));
                        })()}
                    </div>
                </div>
            </section>

            {/* 7️⃣ Resources */}
            {currentProblem.external_links && (
                <section className="space-y-4 pt-4 border-t border-white/10">
                    <div className="flex items-center gap-2">
                        <Code2 size={14} className="text-accent-blue" />
                        <h3 className="text-[10px] uppercase tracking-[0.2em] text-white/50 font-black">Resources</h3>
                    </div>
                    <div className="grid grid-cols-1 gap-3">
                        {Object.entries(currentProblem.external_links).map(([key, url]) => (
                            <a
                                key={key}
                                href={url as string}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.08] hover:border-[#EC4186]/40 transition-all flex items-center justify-between group"
                            >
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black text-white/90 uppercase tracking-widest">{key}</span>
                                    <span className="text-[9px] text-white/30 truncate max-w-[200px]">{url as string}</span>
                                </div>
                                <Zap size={14} className="text-white/20 group-hover:text-[#EC4186] transition-colors" />
                            </a>
                        ))}
                    </div>
                </section>
            )}

            {/* industrial context (Optional/Extra) */}
            {currentProblem.real_time_applications && (
                <section className="space-y-4 pt-4 border-t border-white/10">
                    <div className="flex items-center gap-2">
                        <Zap size={14} className="text-accent-blue" />
                        <h3 className="text-[10px] uppercase tracking-[0.2em] text-white/50 font-black">Industrial Context</h3>
                    </div>
                    <div className="grid grid-cols-1 gap-3">
                        {currentProblem.real_time_applications.map((app, i) => (
                            <div key={i} className="p-5 rounded-[24px] bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all">
                                <h4 className="text-[11px] font-bold text-white mb-2 uppercase tracking-tight">{app.title}</h4>
                                <p className="text-[11px] text-white/40 font-serif leading-relaxed italic">
                                    {app.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </div>
    )
}

export default ProblemInfo
