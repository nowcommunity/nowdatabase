import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import istanbul from 'vite-plugin-istanbul';
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
      react(),
      istanbul({
          exclude: ["node_modules", "dist"],
      })
  ],
  resolve: {
    alias: [
      { find: '@', replacement: path.resolve(__dirname, './src/') },
      { find: '@components', replacement: path.resolve(__dirname, './src/components') },
      { find: '@util', replacement: path.resolve(__dirname, './src/util') },
      { find: '@backend', replacement: path.resolve(__dirname, '.,/src/') },
    ],
  },
  build: {
      sourcemap: true
  },
  server: {
    // NOTE: Polling is only enabled due to some developers using windows where hot reload in WSL-docker didnt work
    // and this was easier than moving the project in the filesystem - feel free to disable
    watch: {
      usePolling: true,
    },
  },
})
