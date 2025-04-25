"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
electron_1.contextBridge.exposeInMainWorld('electron', {
    ipcRenderer: {
        send: (channel, ...args) => {
            // Whitelist channels
            const validChannels = ['get-player-stats'];
            if (validChannels.includes(channel)) {
                electron_1.ipcRenderer.send(channel, ...args);
            }
        },
        on: (channel, listener) => {
            // Whitelist channels
            const validChannels = ['player-stats-update', 'connection-status-update'];
            if (validChannels.includes(channel)) {
                // Deliberately strip event as it includes `sender` 
                electron_1.ipcRenderer.on(channel, (_event, ...args) => listener(...args));
                // Return a function to remove the event listener
                return () => {
                    electron_1.ipcRenderer.removeListener(channel, (_event, ...args) => listener(...args));
                };
            }
            return () => { }; // Return empty function if channel is not valid
        }
    }
});
// Update connection status when connection status updates are received
electron_1.ipcRenderer.on('connection-status-update', (_, isConnected) => {
    const connectionStatus = document.getElementById('connection-status');
    if (connectionStatus) {
        if (isConnected) {
            connectionStatus.textContent = 'Connected to UE5 game';
            connectionStatus.classList.remove('disconnected');
            connectionStatus.classList.add('connected');
        }
        else {
            connectionStatus.textContent = 'Waiting for UE5 game connection...';
            connectionStatus.classList.remove('connected');
            connectionStatus.classList.add('disconnected');
        }
    }
});
// Update player stats when player stats updates are received
electron_1.ipcRenderer.on('player-stats-update', (_, stats) => {
    const playerStatsElement = document.getElementById('player-stats');
    if (playerStatsElement) {
        console.log('Preload: Updating player stats with:', stats);
        // Create HTML for the stats display
        let statsHtml = '';
        // Add standard stats
        if (stats.health !== undefined) {
            statsHtml += `
        <div class="stat-item">
          <span class="stat-label">Health:</span>
          <span class="stat-value">${stats.health}</span>
        </div>`;
        }
        if (stats.mana !== undefined) {
            statsHtml += `
        <div class="stat-item">
          <span class="stat-label">Mana:</span>
          <span class="stat-value">${stats.mana}</span>
        </div>`;
        }
        if (stats.stamina !== undefined) {
            statsHtml += `
        <div class="stat-item">
          <span class="stat-label">Stamina:</span>
          <span class="stat-value">${stats.stamina}</span>
        </div>`;
        }
        if (stats.position !== undefined) {
            statsHtml += `
        <div class="stat-item">
          <span class="stat-label">Position:</span>
          <span class="stat-value">X: ${stats.position.x.toFixed(2)}, Y: ${stats.position.y.toFixed(2)}, Z: ${stats.position.z.toFixed(2)}</span>
        </div>`;
        }
        if (stats.level !== undefined) {
            statsHtml += `
        <div class="stat-item">
          <span class="stat-label">Level:</span>
          <span class="stat-value">${stats.level}</span>
        </div>`;
        }
        if (stats.experience !== undefined) {
            statsHtml += `
        <div class="stat-item">
          <span class="stat-label">Experience:</span>
          <span class="stat-value">${stats.experience}</span>
        </div>`;
        }
        // Add any additional stats
        for (const [key, value] of Object.entries(stats)) {
            if (!['health', 'mana', 'stamina', 'position', 'level', 'experience'].includes(key)) {
                statsHtml += `
          <div class="stat-item">
            <span class="stat-label">${key.charAt(0).toUpperCase() + key.slice(1)}:</span>
            <span class="stat-value">${typeof value === 'object' ? JSON.stringify(value) : value}</span>
          </div>`;
            }
        }
        // Update the element with the stats HTML
        playerStatsElement.innerHTML = statsHtml;
    }
});
