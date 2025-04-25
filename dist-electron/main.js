"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path = __importStar(require("path"));
const url = __importStar(require("url"));
const ws_1 = __importDefault(require("ws"));
// Keep a global reference of the window object to prevent it from being garbage collected
let mainWindow = null;
// WebSocket server for UE5 game to connect to
let wss = null;
// Store the latest player stats
let playerStats = {};
// Track if a game is currently connected
let isGameConnected = false;
function createWindow() {
    // Create the browser window
    mainWindow = new electron_1.BrowserWindow({
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
    wss = new ws_1.default.Server({ port: 8080 });
    console.log('WebSocket server started on port 8080');
    // Handle connections
    wss.on('connection', (ws) => {
        console.log('UE5 game connected to WebSocket server');
        isGameConnected = true;
        // Notify the renderer about connection status change
        if (mainWindow) {
            mainWindow.webContents.send('connection-status-update', true);
        }
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
            }
            catch (error) {
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
// This method will be called when Electron has finished initialization
electron_1.app.whenReady().then(() => {
    createWindow();
    setupWebSocketServer();
    // Set up a timer to send player stats to the renderer process every second
    // but only if a game is connected
    setInterval(() => {
        if (mainWindow && isGameConnected) {
            mainWindow.webContents.send('player-stats-update', playerStats);
        }
    }, 1000);
    // On macOS it's common to re-create a window when the dock icon is clicked
    electron_1.app.on('activate', () => {
        if (mainWindow === null) {
            createWindow();
        }
    });
});
// Quit when all windows are closed, except on macOS
electron_1.app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        electron_1.app.quit();
    }
});
// Clean up WebSocket server when app is about to quit
electron_1.app.on('before-quit', () => {
    if (wss) {
        wss.close();
    }
});
// Handle IPC messages from renderer process
electron_1.ipcMain.on('get-player-stats', (event) => {
    // Send connection status along with player stats
    event.reply('connection-status-update', isGameConnected);
    // Only send player stats if actually connected
    if (isGameConnected) {
        event.reply('player-stats-update', playerStats);
    }
});
