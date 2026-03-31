let authToken = null;
let syncHistory = [];

// Initialize data from storage
chrome.storage.local.get(['algoscope_token', 'sync_history'], (data) => {
    if (data.algoscope_token) {
        authToken = data.algoscope_token;
        console.log('Background: Auth token loaded from storage');
    }
    if (data.sync_history) {
        syncHistory = data.sync_history;
    }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'AUTH_TOKEN' || message.type === 'SYNC_TOKEN') {
        authToken = message.token;
        chrome.storage.local.set({ algoscope_token: authToken });
        console.log('Background: Algoscope token synchronized');
        // Broadcast to popup if open
        chrome.runtime.sendMessage({ type: 'SYNC_TOKEN', token: authToken });
    }

    if (message.type === 'SUBMISSION_SUCCESS') {
        if (!authToken) {
            console.error('Algoscope: No auth token found. Please login to Algoscope first.');
            chrome.runtime.sendMessage({ type: 'SYNC_COMPLETE', success: false, error: 'Login Required' });
            return;
        }

        const newEntry = {
            slug: message.slug,
            title: message.title,
            language: message.language,
            runtime: message.runtime,
            memory: message.memory,
            timestamp: message.timestamp
        };

        // Update history locally
        syncHistory = [newEntry, ...syncHistory].slice(0, 10);
        chrome.storage.local.set({ sync_history: syncHistory });

        // Forward to Algoscope Backend
        fetch('https://algoscope.me/api/leetcode/sync-submission', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify(newEntry)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Algoscope synced:', data);
            chrome.runtime.sendMessage({ type: 'SYNC_COMPLETE', success: true, entry: newEntry });
        })
        .catch(err => {
            console.error('Algoscope sync error:', err);
            chrome.runtime.sendMessage({ type: 'SYNC_COMPLETE', success: false, error: err.message });
        });
    }
});
