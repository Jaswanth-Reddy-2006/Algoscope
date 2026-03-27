const fs = require('fs');
const file = 'c:/Users/Jaswanth Reddy/OneDrive/Desktop/Projects/Algoscope/frontend/src/pages/ProblemLab.tsx';
let content = fs.readFileSync(file, 'utf8');

// Add AlertCircle import
if (!content.includes('AlertCircle,')) {
    content = content.replace('RefreshCw,', 'RefreshCw,\n    AlertCircle,');
}

// Replace error redirect with error UI
const targetErrorReturn = 'if (error) return <Navigate to="/problems" replace />';
const newErrorReturn = `if (error) return (
        <div className="h-screen flex flex-col items-center justify-center bg-[#0a0212] text-white p-10 text-center gap-6">
            <div className="w-20 h-20 rounded-3xl bg-red-400/5 border border-red-500/20 flex items-center justify-center mb-4">
                <AlertCircle size={40} className="text-red-400" />
            </div>
            <div className="space-y-2 max-w-md">
                <h2 className="text-xl font-bold uppercase tracking-tight text-white/90">Navigation Interrupted</h2>
                <p className="text-sm text-white/40 leading-relaxed font-medium">
                    {error || "We encountered an unexpected issue while loading this problem strategy."}
                </p>
            </div>
            <Link 
                to="/problems" 
                onClick={() => useStore.getState().resetState()}
                className="px-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-white hover:bg-white/10 transition-all mt-4"
            >
                Back to Patterns Library
            </Link>
        </div>
    )`;

content = content.replace(targetErrorReturn, newErrorReturn);

fs.writeFileSync(file, content);
console.log('Update successful!');
