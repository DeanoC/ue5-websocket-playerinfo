# Technical Implementation Guide: React & Redux Migration

This document provides detailed technical guidance for implementing the migration from direct DOM manipulation to React with Redux in the UE5 Player Stats Monitor application.

## 1. Project Setup

### 1.1 Install Dependencies

```bash
# Install React and related packages
npm install react react-dom

# Install Redux and related packages
npm install redux react-redux @reduxjs/toolkit

# Install TypeScript types
npm install --save-dev @types/react @types/react-dom
```

### 1.2 Update Vite Configuration

Update `vite.config.ts` to support React:

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import electron from 'vite-plugin-electron';

export default defineConfig({
  plugins: [
    react(),
    electron({
      main: {
        entry: 'electron/main.ts',
      },
      preload: {
        input: 'electron/preload.ts',
      },
    }),
  ],
});
```

### 1.3 Update TypeScript Configuration

Update `tsconfig.json` to support React:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

## 2. Redux Implementation

### 2.1 Create Connection Slice

Create `src/store/connectionSlice.ts`:

```typescript
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ConnectionState {
  isConnected: boolean;
}

const initialState: ConnectionState = {
  isConnected: false,
};

export const connectionSlice = createSlice({
  name: 'connection',
  initialState,
  reducers: {
    setConnectionStatus: (state, action: PayloadAction<boolean>) => {
      state.isConnected = action.payload;
    },
  },
});

export const { setConnectionStatus } = connectionSlice.actions;
export default connectionSlice.reducer;
```

### 2.2 Create Player Stats Slice

Create `src/store/playerStatsSlice.ts`:

```typescript
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface PlayerStats {
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

const initialState: PlayerStats = {
  health: 100,
  mana: 100,
  stamina: 100,
  position: { x: 0, y: 0, z: 0 },
  level: 1,
  experience: 0,
};

export const playerStatsSlice = createSlice({
  name: 'playerStats',
  initialState,
  reducers: {
    updatePlayerStats: (state, action: PayloadAction<PlayerStats>) => {
      return { ...state, ...action.payload };
    },
  },
});

export const { updatePlayerStats } = playerStatsSlice.actions;
export default playerStatsSlice.reducer;
```

### 2.3 Configure Redux Store

Create `src/store/index.ts`:

```typescript
import { configureStore } from '@reduxjs/toolkit';
import connectionReducer from './connectionSlice';
import playerStatsReducer from './playerStatsSlice';
import ipcMiddleware from '../utils/ipcMiddleware';

export const store = configureStore({
  reducer: {
    connection: connectionReducer,
    playerStats: playerStatsReducer,
  },
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware().concat(ipcMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

## 3. IPC Middleware

Create `src/utils/ipcMiddleware.ts`:

```typescript
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
    ipcListenersInitialized?: boolean;
  }
}

export default ipcMiddleware;
```

## 4. React Components

### 4.1 Main Entry Point

Create `src/main.tsx`:

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('app')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
```

### 4.2 App Component

Create `src/App.tsx`:

```tsx
import React from 'react';
import Header from './components/Header';
import PlayerStatsDisplay from './components/PlayerStatsDisplay';
import Footer from './components/Footer';

const App: React.FC = () => {
  return (
    <>
      <Header />
      <main>
        <h2 className="title">Real-time Player Statistics</h2>
        <PlayerStatsDisplay />
      </main>
      <Footer />
    </>
  );
};

export default App;
```

### 4.3 Header Component

Create `src/components/Header.tsx`:

```tsx
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="logo">
      <h1>UE5 Player Stats Monitor</h1>
    </header>
  );
};

export default Header;
```

### 4.4 Footer Component

Create `src/components/Footer.tsx`:

```tsx
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer>
      <p>Connect your UE5 game to WebSocket server at ws://localhost:8080</p>
    </footer>
  );
};

export default Footer;
```

### 4.5 PlayerStatsDisplay Component

Create `src/components/PlayerStatsDisplay.tsx`:

```tsx
import React from 'react';
import ConnectionStatus from './ConnectionStatus';
import StatsList from './StatsList';

const PlayerStatsDisplay: React.FC = () => {
  return (
    <section className="player-stats">
      <div className="player-stats-info">
        <p className="player-stats-text">Current Player Stats:</p>
        <StatsList />
      </div>
      <ConnectionStatus />
    </section>
  );
};

export default PlayerStatsDisplay;
```

### 4.6 ConnectionStatus Component

Create `src/components/ConnectionStatus.tsx`:

```tsx
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

const ConnectionStatus: React.FC = () => {
  const isConnected = useSelector((state: RootState) => state.connection.isConnected);
  
  return (
    <div 
      className={`connection-status ${isConnected ? 'connected' : 'disconnected'}`}
      id="connection-status"
    >
      {isConnected 
        ? 'Connected to UE5 game' 
        : 'Waiting for UE5 game connection...'}
    </div>
  );
};

export default ConnectionStatus;
```

### 4.7 StatsList Component

Create `src/components/StatsList.tsx`:

```tsx
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import StatItem from './StatItem';

const StatsList: React.FC = () => {
  const playerStats = useSelector((state: RootState) => state.playerStats);
  
  // Standard stats to display first
  const standardStats = ['health', 'mana', 'stamina', 'position', 'level', 'experience'];
  
  // Get custom stats (any stats not in the standard list)
  const customStats = Object.keys(playerStats).filter(
    key => !standardStats.includes(key)
  );
  
  return (
    <div className="player-stats-value" id="player-stats">
      {/* Standard stats */}
      {standardStats.map(statKey => {
        if (statKey === 'position' && playerStats.position) {
          return (
            <StatItem 
              key={statKey}
              label="Position"
              value={`X: ${playerStats.position.x.toFixed(2)}, Y: ${playerStats.position.y.toFixed(2)}, Z: ${playerStats.position.z.toFixed(2)}`}
            />
          );
        }
        
        if (playerStats[statKey] !== undefined) {
          return (
            <StatItem 
              key={statKey}
              label={statKey.charAt(0).toUpperCase() + statKey.slice(1)}
              value={playerStats[statKey]}
            />
          );
        }
        
        return null;
      })}
      
      {/* Custom stats */}
      {customStats.map(statKey => (
        <StatItem 
          key={statKey}
          label={statKey.charAt(0).toUpperCase() + statKey.slice(1)}
          value={typeof playerStats[statKey] === 'object' 
            ? JSON.stringify(playerStats[statKey]) 
            : playerStats[statKey]}
        />
      ))}
    </div>
  );
};

export default StatsList;
```

### 4.8 StatItem Component

Create `src/components/StatItem.tsx`:

```tsx
import React from 'react';

interface StatItemProps {
  label: string;
  value: string | number;
}

const StatItem: React.FC<StatItemProps> = ({ label, value }) => {
  return (
    <div className="stat-item">
      <span className="stat-label">{label}:</span>
      <span className="stat-value">{value}</span>
    </div>
  );
};

export default StatItem;
```

## 5. Update Preload Script

Update `electron/preload.ts` to remove direct DOM manipulation:

```typescript
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
        const validChannels = ['player-stats-update', 'connection-status-update'];
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
```

## 6. Update HTML

Update `index.html` to remove inline styles (move them to CSS files) and prepare for React:

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <link rel="icon" type="image/svg+xml" href="/webstorm-icon-logo.svg" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>UE5 Player Stats</title>
  <link rel="stylesheet" href="/style.css">
</head>
<body>
  <div id="app"></div>
  <script type="module" src="/src/main.tsx"></script>
</body>
</html>
```

## 7. Create CSS Files

Create `public/style.css` with all the styles from the inline CSS in the original HTML:

```css
body {
  font-family: Arial, sans-serif;
  background-color: #1e1e1e;
  color: #fff;
  margin: 0;
  padding: 20px;
}

.logo h1 {
  text-align: center;
  color: #61dafb;
}

.title {
  text-align: center;
  margin-bottom: 20px;
}

.player-stats {
  background-color: #2b2b2b;
  border-radius: 8px;
  padding: 20px;
  margin: 20px 0;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.stat-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  padding: 8px;
  background-color: #333;
  border-radius: 4px;
}

.stat-label {
  font-weight: bold;
  color: #ccc;
}

.stat-value {
  color: #fff;
}

.connection-status {
  padding: 10px;
  margin-top: 20px;
  border-radius: 4px;
  text-align: center;
}

.connected {
  background-color: #2e7d32;
  color: white;
}

.disconnected {
  background-color: #c62828;
  color: white;
}

footer {
  text-align: center;
  margin-top: 20px;
  color: #888;
}
```

## 8. Testing

### 8.1 Unit Tests for Redux Reducers

Create tests for Redux reducers to ensure they correctly update state based on actions.

### 8.2 Component Tests

Create tests for React components to ensure they render correctly and respond to state changes.

### 8.3 Integration Tests

Create tests for the integration between Redux and React components, as well as IPC communication.

## 9. Deployment

Update the build scripts in `package.json` to build the React application:

```json
{
  "scripts": {
    "electron:start": "tsc -p electron && vite build && electron .",
    "electron:dev": "cross-env NODE_ENV=development tsc -p electron && vite build && electron .",
    "electron:build": "tsc -p electron && vite build && electron-builder",
    "start": "npm run electron:start",
    "build": "npm run electron:build"
  }
}
```

## Conclusion

This technical implementation guide provides detailed instructions for migrating the UE5 Player Stats Monitor from direct DOM manipulation to React with Redux. By following these steps, you'll create a more maintainable and scalable application that preserves all existing functionality while providing a better foundation for future development.