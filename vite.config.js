"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vite_1 = require("vite");
var path_1 = require("path");
// https://vitejs.dev/config/
exports.default = (0, vite_1.defineConfig)({
    build: {
        outDir: 'dist',
        emptyOutDir: true,
    },
    resolve: {
        alias: {
            '@': (0, path_1.resolve)(__dirname, './src'),
        },
    },
    // Explicitly set public directory
    publicDir: 'public',
    // Support WebStorm's debugging
    optimizeDeps: {
        entries: [
            'src/main.tsx'
        ]
    }
});
