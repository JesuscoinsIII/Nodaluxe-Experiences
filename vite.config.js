import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  root: 'src/checkout',
  base: '/dist/checkout/',
  build: {
    outDir: '../../dist/checkout',
    emptyOutDir: true,
  },
});
