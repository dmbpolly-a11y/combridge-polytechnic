import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
    plugins: [react()],
    root: '.',
    // publicDir false avoids Vite warning about outDir inside publicDir
    publicDir: false,
    build: {
        outDir: 'public/react',
        emptyOutDir: true,
        rollupOptions: {
            input: 'index.html',
        },
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'resources/js'),
        },
    },
    server: {
        port: 5173,
        // In dev, serve static files from public/ alongside the React app
        fs: {
            allow: ['.'],
        },
        proxy: {
            '/api': {
                target: 'http://localhost:8000',
                changeOrigin: true,
                secure: false,
            },
            '/sanctum': {
                target: 'http://localhost:8000',
                changeOrigin: true,
                secure: false,
            },
        },
    },
});
