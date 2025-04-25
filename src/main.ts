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
 * Setup the player stats display
 * @param element The HTML element to display the stats in
 */
export function setupPlayerStatsDisplay(element: HTMLElement) {
  // Function to update the UI with player stats
  const updateStatsDisplay = (stats: PlayerStats) => {
    // Create HTML for the stats display
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
  if (window.electron) {
    window.electron.ipcRenderer.on('player-stats-update', (_event: any, stats: PlayerStats) => {
      currentPlayerStats = stats;
      updateStatsDisplay(currentPlayerStats);
    });

    // Request initial stats
    window.electron.ipcRenderer.send('get-player-stats');
  } else {
    console.warn('Electron IPC not available. Running in browser mode with mock data.');
    
    // If running in browser mode (not Electron), simulate stats updates
    setInterval(() => {
      // Simulate changing stats
      currentPlayerStats.health = Math.max(0, Math.min(100, currentPlayerStats.health + (Math.random() > 0.5 ? 1 : -1)));
      currentPlayerStats.mana = Math.max(0, Math.min(100, currentPlayerStats.mana + (Math.random() > 0.5 ? 1 : -1)));
      currentPlayerStats.stamina = Math.max(0, Math.min(100, currentPlayerStats.stamina + (Math.random() > 0.5 ? 1 : -1)));
      currentPlayerStats.position.x += (Math.random() - 0.5) * 2;
      currentPlayerStats.position.y += (Math.random() - 0.5) * 2;
      currentPlayerStats.position.z += (Math.random() - 0.5) * 2;
      
      updateStatsDisplay(currentPlayerStats);
    }, 1000);
  }
}

// Initialize the player stats display
setupPlayerStatsDisplay(document.getElementById('counter-value') as HTMLElement);

// Add type definition for Electron IPC in browser context
declare global {
  interface Window {
    electron?: {
      ipcRenderer: {
        on: (channel: string, listener: (event: any, ...args: any[]) => void) => void;
        send: (channel: string, ...args: any[]) => void;
      };
    };
  }
}