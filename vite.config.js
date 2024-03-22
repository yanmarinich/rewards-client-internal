import { defineConfig } from 'vite'
import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
// import react from '@vitejs/plugin-react-swc'

import * as os from "node:os";

// 'aix', 'darwin', 'freebsd','linux','openbsd', 'sunos', 'win32'
const host = (os.platform() === 'win32') ? '127.0.0.1' : '0.0.0.0';


// https://vitejs.dev/config/
export default ({ mode }) => {
  return defineConfig({
    plugins: [react()],
    build: {
      outDir: "./build",
    },
    server: {
      host,
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





