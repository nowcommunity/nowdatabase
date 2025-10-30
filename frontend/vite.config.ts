import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import istanbul from 'vite-plugin-istanbul'
import path from 'path'

const parsePort = (value?: string) => {
  const numericValue = Number(value)
  return Number.isFinite(numericValue) && numericValue > 0 ? numericValue : undefined
}

const serverPort = parsePort(process.env.VITE_SERVER_PORT) ?? parsePort(process.env.PORT) ?? 5173
const hmrPort = parsePort(process.env.VITE_HMR_PORT) ?? serverPort

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    istanbul({
      exclude: ['node_modules', 'dist'],
    }),
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
    sourcemap: true,
  },
  server: {
    host: true,
    port: serverPort,
    strictPort: true,
    hmr: {
      protocol: 'ws',
      port: hmrPort,
      clientPort: hmrPort,
    },
    // NOTE: Polling is only enabled due to some developers using windows where hot reload in WSL-docker didnt work
    // and this was easier than moving the project in the filesystem - feel free to disable
    watch: {
      usePolling: true,
    },
  },
})
