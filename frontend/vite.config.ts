import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: '@', replacement: path.resolve(__dirname, './src/') },
      { find: '@components', replacement: path.resolve(__dirname, './src/components') },
      { find: '@util', replacement: path.resolve(__dirname, './src/util') },
      { find: '@backend', replacement: path.resolve(__dirname, '.,/src/') },
    ],
  },
  server: {
    // NOTE: Polling is only enabled due to some developers using windows where hot reload in WSL-docker didnt work
    // and this was easier than moving the project in the filesystem - feel free to disable
    watch: {
      usePolling: true,
    },
  },
})
