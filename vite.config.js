import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Firebase - large SDK, shared across app
          'firebase': ['firebase/app', 'firebase/auth', 'firebase/firestore', 'firebase/storage', 'firebase/functions'],
          // Charts - only needed on specific pages
          'charts': ['chart.js', 'react-chartjs-2', 'recharts'],
          // Animation libraries
          'animation': ['framer-motion', 'gsap', '@react-spring/web'],
          // Maps - only needed on profile creation
          'maps': ['mapbox-gl'],
          // PDF generation - only for exports
          'pdf': ['jspdf', 'jspdf-autotable'],
          // Lunar calculations
          'lunar': ['lunar-javascript']
        }
      }
    },
    chunkSizeWarningLimit: 600 // Increase limit slightly since Firebase chunk will be large
  },
  server: {
    proxy: {
      // Proxy Claude API requests to avoid CORS issues
      '/api/claude': {
        target: 'https://api.anthropic.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/claude/, '/v1/messages'),
        headers: {
          'anthropic-version': '2023-06-01'
        }
      }
    }
  }
})
