// Algoscope Tracker Content Script
console.log("Algoscope Tracker: Neural Link established.");

// 1. Auth Sync Logic
// Listen for custom events from the Algoscope web app
window.addEventListener('ALGO_SYNC_TOKEN', (event) => {
    const { token } = event.detail;
    if (token) {
        console.log("Algoscope Tracker: Auth Token received from platform.");
        chrome.runtime.sendMessage({ type: 'SYNC_TOKEN', token });
    }
});

// Detect Algoscope Dashboard for token extraction
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.hostname.includes('algoscope')) {
    const token = localStorage.getItem('algoscope_token') || localStorage.getItem('algoscope-auth-token');
    if (token) {
        console.log("Algoscope Tracker: Dashboard detected, synchronizing session...");
        chrome.runtime.sendMessage({ type: 'SYNC_TOKEN', token });
    }
}

// 2. LeetCode Submission Monitoring
function getSubmissionData() {
    try {
        // Detect 'Accepted' status on LeetCode
        const resultStatus = document.querySelector('[data-e2e-locator="submission-result-status"]');
        if (!resultStatus || !resultStatus.innerText.includes('Accepted')) return null;

        const runtime = document.querySelector('[data-e2e-locator="submission-result-runtime"]')?.innerText || 'N/A';
        const memory = document.querySelector('[data-e2e-locator="submission-result-memory"]')?.innerText || 'N/A';
        const language = document.querySelector('[data-e2e-locator="submission-result-language"]')?.innerText || 'N/A';
        
        // Extract problem info from URL and UI
        const problemSlug = window.location.pathname.split('/')[2];
        const problemTitle = document.querySelector('span.text-label-1.font-medium')?.innerText || problemSlug;

        return {
            type: 'SUBMISSION_SUCCESS',
            slug: problemSlug,
            title: problemTitle,
            runtime,
            memory,
            language,
            timestamp: Date.now()
        };
    } catch (e) {
        return null;
    }
}

// Observe DOM changes on LeetCode to catch the submission result overlay
const observer = new MutationObserver(() => {
    const data = getSubmissionData();
    if (data) {
        chrome.runtime.sendMessage(data);
    }
});

if (window.location.hostname === 'leetcode.com') {
    observer.observe(document.body, { childList: true, subtree: true });
}
