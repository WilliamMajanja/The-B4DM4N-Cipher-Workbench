
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, './', '');

  return {
    plugins: [react()],
    define: {
      // Vite replaces this with the actual value at build time, making it available in browser-side code.
      'process.env.API_KEY': JSON.stringify(env.VITE_API_KEY)
    },
    server: {
      port: 5173, // Set a default port
      open: true // Automatically open in the browser
    }
  };
});
