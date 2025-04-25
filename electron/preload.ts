import { contextBridge, ipcRenderer } from 'electron';

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
  'electron',
  {
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
        const validChannels = ['player-stats-update'];
        if (validChannels.includes(channel)) {
          // Deliberately strip event as it includes `sender` 
          ipcRenderer.on(channel, (_event, ...args) => listener(...args));
          
          // Return a function to remove the event listener
          return () => {
            ipcRenderer.removeListener(channel, (_event, ...args) => listener(...args));
          };
        }
        return () => {}; // Return empty function if channel is not valid
      }
    }
  }
);

// Update connection status when receiving player stats
ipcRenderer.on('player-stats-update', () => {
  const connectionStatus = document.getElementById('connection-status');
  if (connectionStatus) {
    connectionStatus.textContent = 'Connected to UE5 game';
    connectionStatus.classList.remove('disconnected');
    connectionStatus.classList.add('connected');
  }
});