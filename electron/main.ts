import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import * as url from 'url';
import * as WebSocket from 'ws';

// Keep a global reference of the window object to prevent it from being garbage collected
let mainWindow: BrowserWindow | null = null;
// WebSocket server for UE5 game to connect to
let wss: WebSocket.Server | null = null;
// Store the latest player stats
let playerStats: any = {};

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

  // Load the index.html from the dist directory
  const indexPath = url.format({
    pathname: path.join(__dirname, '../dist/index.html'),
    protocol: 'file:',
    slashes: true,
  });

  mainWindow.loadURL(indexPath);

  // Open DevTools in development mode
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }

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
  wss.on('connection', (ws) => {
    console.log('UE5 game connected to WebSocket server');

    // Handle messages from UE5 game
    ws.on('message', (message) => {
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
    });
  });
}

// This method will be called when Electron has finished initialization
app.whenReady().then(() => {
  createWindow();
  setupWebSocketServer();

  // Set up a timer to send player stats to the renderer process every second
  setInterval(() => {
    if (mainWindow) {
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
  event.reply('player-stats-update', playerStats);
});
