import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,             // Exposes Vite to your network
    allowedHosts: true,     // CRITICAL: Tells Vite to accept all tunnel URLs (like loca.lt)
    strictPort: true,       // Locks down the port to exactly 5173
  }
})
