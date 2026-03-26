const fs = require('fs');

try {
    const data = JSON.parse(fs.readFileSync('frontend/src/data/foundations.json', 'utf8'));
    console.log('JSON parsed successfully.');

    let coreModules = [];

    if (Array.isArray(data)) {
        // Find the category that contains 'sliding_window' or has id 'core_patterns'
        const coreCat = data.find(cat => cat.id === 'core_patterns' || (cat.modules && cat.modules.find(m => m.id === 'sliding_window')));
        if (coreCat) {
            console.log(`Found Core Patterns category: ${coreCat.title} (${coreCat.id})`);
            coreModules = coreCat.modules;
        } else {
            // Maybe modules are directly at root? Unlikely based on file view.
            console.error("Could not find 'core_patterns' category or modules.");
            // Try to see if any root item IS the module
            const direct = data.find(m => m.id === 'sliding_window');
            if (direct) coreModules = data;
        }
    } else if (data.corePatterns) {
        coreModules = data.corePatterns;
    } else {
        console.error("Unknown JSON structure.");
        process.exit(1);
    }

    const patterns = ['sliding_window', 'two_pointers', 'binary_search', 'monotonic_stack'];
    let errors = [];

    patterns.forEach(pid => {
        const p = coreModules.find(cp => cp.id === pid);
        if (!p) {
            errors.push(`Missing pattern: ${pid}`);
            return;
        }

        if (!p.subPatterns) {
            errors.push(`Pattern ${pid} has no subPatterns.`);
            return;
        }

        p.subPatterns.forEach(sp => {
            const langs = ['python', 'javascript', 'java', 'cpp'];

            if (!sp.templates) {
                errors.push(`Missing templates object for ${pid}/${sp.id}`);
                return;
            }

            langs.forEach(lang => {
                const t = sp.templates[lang];
                if (!t) {
                    errors.push(`Missing template for ${pid}/${sp.id} in ${lang}`);
                } else if (typeof t === 'string') {
                    errors.push(`Template for ${pid}/${sp.id} in ${lang} is still a STRING (needs object with bruteForce/optimal)`);
                } else {
                    if (!t.bruteForce) errors.push(`Missing bruteForce for ${pid}/${sp.id} in ${lang}`);
                    if (!t.optimal) errors.push(`Missing optimal for ${pid}/${sp.id} in ${lang}`);
                }
            });
        });
    });

    if (errors.length > 0) {
        console.error('Validation Errors:\n' + errors.join('\n'));
        process.exit(1);
    } else {
        console.log('All Core Patterns (Sliding Window, Two Pointers, Binary Search, Monotonic Stack) are strictly compliant!');
    }

} catch (e) {
    console.error('JSON Syntax Error:', e.message);
    process.exit(1);
}
