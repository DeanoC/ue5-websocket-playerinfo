import { Middleware } from 'redux';
import { updatePlayerStats } from '../store/playerStatsSlice';
import { setConnectionStatus } from '../store/connectionSlice';

const ipcMiddleware: Middleware = store => next => action => {
  // Process the action normally
  const result = next(action);

  // Set up IPC listeners when the middleware is first used
  if (!window.ipcListenersInitialized) {
    window.electron.ipcRenderer.on('player-stats-update', (stats) => {
      store.dispatch(updatePlayerStats(stats));
    });

    window.electron.ipcRenderer.on('connection-status-update', (isConnected) => {
      store.dispatch(setConnectionStatus(isConnected));
    });

    // Request initial stats
    window.electron.ipcRenderer.send('get-player-stats');

    // Mark that we've initialized the listeners
    window.ipcListenersInitialized = true;
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