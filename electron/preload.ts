import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    send: (channel: string, ...args: any[]) => {
      // Whitelist channels
      const validChannels = ['get-player-stats'];
      if (validChannels.includes(channel)) {
        ipcRenderer.send(channel, ...args);
      }
    },
    on: (channel: string, listener: (...args: any[]) => void) => {
      // Whitelist channels
      const validChannels = ['player-stats-update', 'connection-status-update'];
      if (validChannels.includes(channel)) {
        ipcRenderer.on(channel, (_event, ...args) => listener(...args));
      }
    }
  }
});