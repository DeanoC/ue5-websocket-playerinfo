import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import * as url from 'url';

// Use CommonJS require for the 'ws' library in the main process
const WebSocket = require('ws');

// Keep a global reference of the window object to prevent it from being garbage collected
let mainWindow: BrowserWindow | null = null;
// WebSocket server for UE5 game to connect to
let wss: WebSocket.Server | null = null;
// Store the latest player stats
let playerStats: any = {};
// Track if a game is currently connected
let isGameConnected: boolean = false;

function createWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

      // Add keyboard shortcut to open dev tools
      mainWindow.webContents.on('before-input-event', (event, input) => {
        if (input.control && input.key.toLowerCase() === 'i') {
          mainWindow?.webContents.openDevTools();
          event.preventDefault();
        }
      });
          
  // Load the index.html of the app.
  // VITE_DEV_SERVER_URL will be set if the Vite server is running (during development)
  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
    console.log('Loading renderer from Vite dev server:', process.env.VITE_DEV_SERVER_URL);

    // Open the DevTools automatically in development
    mainWindow.webContents.openDevTools();
  } else {
    // Load the index.html from the dist folder in production
    const indexPath = path.join(__dirname, '../dist/index.html');
    mainWindow.loadFile(indexPath);
    console.log('Loading renderer from file:', indexPath);
  }

  // Remove or comment out the separate DevTools check below this, 
  // as it's now handled within the `if` block above for development.
  // if (process.env.NODE_ENV === 'development') {
  //   mainWindow?.webContents.openDevTools();
  // }

  // Handle window being closed
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function setupWebSocketServer() {
  // Create WebSocket server on port 8080
  wss = new WebSocket.Server({ port: 8080 });

  console.log('WebSocket server started on port 8080');

  // Handle connections
  wss.on('connection', (ws: WebSocket) => {
    console.log('UE5 game connected to WebSocket server');
    isGameConnected = true;
    
    // Notify the renderer about connection status change
    if (mainWindow) {
      mainWindow.webContents.send('connection-status-update', true);
    }

    // Handle messages from UE5 game
    ws.on('message', (message: WebSocket.RawData) => {
      try {
        // Parse the message as JSON
        const data = JSON.parse(message.toString());
        console.log('Received player stats:', data);

        // Store the player stats
        playerStats = data;

        // Send the player stats to the renderer process
        if (mainWindow) {
          mainWindow.webContents.send('player-stats-update', playerStats);
        }
      } catch (error) {
        console.error('Error parsing message:', error);
      }
    });

    // Handle disconnection
    ws.on('close', () => {
      console.log('UE5 game disconnected from WebSocket server');
      isGameConnected = false;
      
      // Notify the renderer about connection status change
      if (mainWindow) {
        mainWindow.webContents.send('connection-status-update', false);
      }
    });
  });
}

// For debugging purposes
console.log('Main process starting');
console.log('Command line args:', process.argv);

// Add a debugger statement that will always pause execution when debugging
if (process.argv.includes('--inspect-brk')) {
  console.log('Debug mode detected, adding debugger statement');
  debugger;
}

try {
  // This method will be called when Electron has finished initialization
  app.whenReady().then(() => {
    console.log('App is ready');
    createWindow();
    console.log('Window created');
    setupWebSocketServer();
    console.log('WebSocket server initialized');

  // Set up a timer to send player stats to the renderer process every second
  // but only if a game is connected
  setInterval(() => {
    if (mainWindow && isGameConnected) {
      mainWindow.webContents.send('player-stats-update', playerStats);
    }
  }, 1000);

  // On macOS it's common to re-create a window when the dock icon is clicked
  app.on('activate', () => {
    if (mainWindow === null) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Clean up WebSocket server when app is about to quit
app.on('before-quit', () => {
  if (wss) {
    wss.close();
  }
});

// Handle IPC messages from renderer process
ipcMain.on('get-player-stats', (event) => {
  // Send connection status along with player stats
  event.reply('connection-status-update', isGameConnected);
  
  // Only send player stats if actually connected
  if (isGameConnected) {
    event.reply('player-stats-update', playerStats);
  }
});

// End of try block from the beginning of the file
} catch (error) {
  console.error('Fatal error in main process:', error);
}