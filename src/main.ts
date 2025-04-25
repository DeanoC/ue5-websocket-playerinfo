// Interface for player stats
interface PlayerStats {
  health: number;
  mana: number;
  stamina: number;
  position: {
    x: number;
    y: number;
    z: number;
  };
  level: number;
  experience: number;
  [key: string]: any; // Allow for additional properties
}

// Default player stats
const defaultPlayerStats: PlayerStats = {
  health: 100,
  mana: 100,
  stamina: 100,
  position: { x: 0, y: 0, z: 0 },
  level: 1,
  experience: 0
};

// Current player stats
let currentPlayerStats: PlayerStats = { ...defaultPlayerStats };

/**
 * Set up the player stats display
 * @param element The HTML element to display the stats in
 */
export function setupPlayerStatsDisplay(element: HTMLElement) {
  // Function to update the UI with player stats
  const updateStatsDisplay = (stats: PlayerStats) => {
    console.log('Updating stats display with:', stats);

    // Create HTML for the stats' display
    let statsHtml = `
      <div class="stat-item">
        <span class="stat-label">Health:</span>
        <span class="stat-value">${stats.health}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Mana:</span>
        <span class="stat-value">${stats.mana}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Stamina:</span>
        <span class="stat-value">${stats.stamina}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Position:</span>
        <span class="stat-value">X: ${stats.position.x.toFixed(2)}, Y: ${stats.position.y.toFixed(2)}, Z: ${stats.position.z.toFixed(2)}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Level:</span>
        <span class="stat-value">${stats.level}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Experience:</span>
        <span class="stat-value">${stats.experience}</span>
      </div>
    `;

    // Add any additional stats that might be sent from the game
    for (const [key, value] of Object.entries(stats)) {
      if (!['health', 'mana', 'stamina', 'position', 'level', 'experience'].includes(key)) {
        statsHtml += `
          <div class="stat-item">
            <span class="stat-label">${key.charAt(0).toUpperCase() + key.slice(1)}:</span>
            <span class="stat-value">${typeof value === 'object' ? JSON.stringify(value) : value}</span>
          </div>
        `;
      }
    }

    // Update the element with the stats HTML
    element.innerHTML = statsHtml;
  };

  // Initialize with default stats
  updateStatsDisplay(currentPlayerStats);

  // Listen for player stats updates from the main process
  console.log('Electron IPC is available, setting up listeners');

  window.electron.ipcRenderer.on('player-stats-update', (stats: PlayerStats) => {
    console.log('Received player stats update:', stats);
    currentPlayerStats = stats;
    updateStatsDisplay(currentPlayerStats);
  });

  // Listen for connection status updates
  window.electron.ipcRenderer.on('connection-status-update', (isConnected: boolean) => {
    console.log('Connection status update:', isConnected);
    const connectionStatus = document.getElementById('connection-status');
    if (connectionStatus) {
      if (isConnected) {
        connectionStatus.textContent = 'Connected to UE5 game';
        connectionStatus.classList.remove('disconnected');
        connectionStatus.classList.add('connected');
      } else {
        connectionStatus.textContent = 'Waiting for UE5 game connection...';
        connectionStatus.classList.remove('connected');
        connectionStatus.classList.add('disconnected');
      }
    }
  });

  // Request initial stats
  console.log('Requesting initial player stats');
  window.electron.ipcRenderer.send('get-player-stats');
}

// Initialize the player stats display in any environment including Electron
console.log('Initializing player stats display');
if (typeof document !== 'undefined') {
  // Function to initialize when DOM is ready
  const initializeStatsDisplay = () => {
    const playerStatsElement = document.getElementById('player-stats');
    if (playerStatsElement) {
      console.log('Found player stats element, setting up display');
      setupPlayerStatsDisplay(playerStatsElement);
    } else {
      console.warn('Player stats element not found in the DOM');
    }
  };

  // Check if document is already loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeStatsDisplay);
  } else {
    // DOM already loaded, run initialization directly
    initializeStatsDisplay();
  }
}

// Add type definition for Electron IPC
declare global {
  interface Window {
    electron: {
      ipcRenderer: {
        on: (channel: string, listener: (...args: any[]) => void) => void;
        send: (channel: string, ...args: any[]) => void;
      };
    };
  }
}