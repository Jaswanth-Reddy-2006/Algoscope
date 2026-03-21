document.addEventListener('DOMContentLoaded', () => {
    const statusContainer = document.getElementById('connection-status');
    const historyContainer = document.getElementById('history-container');

    const syncContainer = document.getElementById('sync-container');
    const syncButton = document.getElementById('btn-sync-dash');

    // Load initial data
    chrome.storage.local.get(['algoscope_token', 'sync_history'], (data) => {
        updateStatus(data.algoscope_token);
        if (data.sync_history) renderHistory(data.sync_history);
    });

    syncButton.addEventListener('click', () => {
        chrome.tabs.create({ url: 'http://localhost:5173/settings' });
    });

    function updateStatus(token) {
        if (token) {
            statusContainer.innerHTML = `
                <span class="status-dot online"></span>
                <span class="status-text" style="color: #22c55e;">Neural Link Active</span>
            `;
            syncContainer.style.display = 'none';
        } else {
            statusContainer.innerHTML = `
                <span class="status-dot offline"></span>
                <span class="status-text">Disconnected (Login Required)</span>
            `;
            syncContainer.style.display = 'block';
        }
    }

    // Listen for sync updates
    chrome.runtime.onMessage.addListener((message) => {
        if (message.type === 'SYNC_TOKEN') {
            updateStatus(message.token);
        }
        if (message.type === 'SYNC_COMPLETE' && message.success) {
            chrome.storage.local.get(['sync_history'], (data) => {
                renderHistory(data.sync_history || []);
            });
        }
    });

    function renderHistory(history) {
        if (history.length === 0) return;

        historyContainer.innerHTML = history.map(item => `
            <div class="history-item">
                <div class="item-info">
                    <span class="item-title">${item.title}</span>
                    <span class="item-meta">${item.language} • ${item.runtime}</span>
                </div>
                <div class="item-status">Synced</div>
            </div>
        `).join('');
    }
});
