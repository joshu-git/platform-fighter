import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  root: './', // project root
  base: './', // ensures assets load correctly on Netlify
  build: {
    outDir: 'dist', // build output
    rollupOptions: {
      input: path.resolve(__dirname, 'index.html'),
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // optional, if you put your JS/Scenes in src
    },
  },
  server: {
    open: true,
    port: 3000,
  },
});
