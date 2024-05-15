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
    watch: {
      usePolling: true,
    },
  },
})
