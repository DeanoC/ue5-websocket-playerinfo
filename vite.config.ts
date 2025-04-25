import { defineConfig } from 'vite';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
      // Explicitly set public directory
      publicDir: 'public',
      // Support WebStorm's debugging
      optimizeDeps: {
    entries: [
      'src/main.ts'
    ]
      }
});
