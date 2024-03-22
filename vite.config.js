import { defineConfig } from 'vite'
import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
// import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default ({ mode }) => {
  return defineConfig({
    plugins: [react()],
    build: {
      outDir: "./build",
    },
    server: {
      // host: "127.0.0.1",
      host: "0.0.0.0",
      open: mode === "development",
    },
    resolve: {
      alias: [
        {
          find: '@app',
          replacement: fileURLToPath(new URL('./src', import.meta.url))
        },
      ]
    }
  });
};





