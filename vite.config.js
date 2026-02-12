import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    minify: 'esbuild',
    esbuild: {
      drop: ['console', 'debugger'],
    },
    rollupOptions: {
      output: {
        manualChunks: {
          // Firebase - large SDK, shared across app
          'firebase': ['firebase/app', 'firebase/auth', 'firebase/firestore', 'firebase/storage', 'firebase/functions'],
          // Charts - only needed on specific pages
          'charts': ['chart.js', 'react-chartjs-2', 'recharts'],
          // Animation library
          'animation': ['framer-motion'],
          // Maps - only needed on profile creation
          'maps': ['mapbox-gl'],
          // PDF generation - only for exports
          'pdf': ['jspdf', 'jspdf-autotable'],
          // Lunar calculations
          'lunar': ['lunar-javascript'],
          // Nivo charts - heavy, only used on specific pages
          'nivo': ['@nivo/bar', '@nivo/core', '@nivo/heatmap', '@nivo/line', '@nivo/pie', '@nivo/radar'],
          // D3 - used by wheel and Nivo internals
          'd3': ['d3']
        }
      }
    }
  }
})
