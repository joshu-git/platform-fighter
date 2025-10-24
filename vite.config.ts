import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  root: 'src', // your main JS code is in src/
  base: './',  // ensures relative paths work correctly
  build: {
    outDir: '../dist', // compiled files go here
    emptyOutDir: true,
    rollupOptions: {
      input: path.resolve(__dirname, 'src/main.js'), // entry point
      output: {
        // Keep file names clean
        entryFileNames: '[name].js',
        assetFileNames: '[name].[ext]',
        chunkFileNames: '[name].js',
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // so you can import from '@/data/characters.js'
    },
  },
  server: {
    port: 3000,
    open: true,
  },
});
