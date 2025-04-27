import { Middleware } from 'redux';
import { updatePlayerStats } from '../store/playerStatsSlice';
import { setConnectionStatus } from '../store/connectionSlice';

const ipcMiddleware: Middleware = store => next => action => {
  // Process the action normally first
  const result = next(action);

  // Log every time the middleware runs (for any action)
  // console.log('[ipcMiddleware] Action processed:', action.type);

  // Set up IPC listeners only once
  if (!window.ipcListenersInitialized) {
    console.log('[ipcMiddleware] Initializing IPC listeners...'); // <-- Add Log

    try {
      window.electron.ipcRenderer.on('player-stats-update', (stats) => {
        store.dispatch(updatePlayerStats(stats));
      });

      // Listener for Connection Status
      window.electron.ipcRenderer.on('connection-status-update', (isConnected) => {
        store.dispatch(setConnectionStatus(isConnected));
      });

      // Request initial state *after* listeners are set up
      window.electron.ipcRenderer.send('get-player-stats');

      // Mark as initialized
      window.ipcListenersInitialized = true;
    } catch (error) {
        console.error('[ipcMiddleware] Error setting up listeners:', error); // <-- Add Error Log
    }
  }

  return result;
};

// Add to global Window interface
declare global {
  interface Window {
    electron: {
      ipcRenderer: {
        send: (channel: string, ...args: any[]) => void;
        on: (channel: string, listener: (...args: any[]) => void) => void;
      };
    };
    ipcListenersInitialized?: boolean;
  }
}

export default ipcMiddleware;