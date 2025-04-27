import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// Standard import for the plugin
import electron from 'vite-plugin-electron';

// Log: Config file start
console.log('--- Reading vite.config.ts ---');

export default defineConfig({
  // Keep this for relative asset paths (fixes file not found)
  base: './', 
  plugins: [
    (() => {
      return react();
    })(),
    (() => {
      const electronPlugin = electron([
        {
          // Configuration for the Main Process
          entry: 'electron/main.ts', 
        },
        {
          // Configuration for the Preload Script
          entry: 'electron/preload.ts', 
          onstart(options) {
            // Optional: Reload the renderer process when the preload script changes.
            // Useful during development.
            options.reload(); 
          },
        },
      ]);
      return electronPlugin;
    })(),
  ],
  build: {
    // Ensure the output directory for the React app (renderer) is 'dist'
    outDir: 'dist' 
  },
});
