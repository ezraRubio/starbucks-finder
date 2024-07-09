import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api': 'https://geodata.ucdavis.edu/gadm/gadm4.1/json'
    }
  },
  plugins: [react()]
})
