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
