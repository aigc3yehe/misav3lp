import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const AUTH_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InNlcnZpY2UiLCJpYXQiOjE3MzcyNjc3MTN9.4eH6D1kTce5iBTStnihaKFZEC6g6P9Sq2Pp62l7NGPo';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react()
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://43.153.39.36:5555',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      },
      '/studio-api': {
        target: 'http://43.153.40.155:5577',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/studio-api/, ''),
        // @ts-ignore
        configure: (proxy, options) => {
          // @ts-ignore
          proxy.on('proxyReq', (proxyReq, req, res) => {
            proxyReq.setHeader('Authorization', `Bearer ${AUTH_TOKEN}`);
          });
        }
      }
    }
  },
  build: {
    assetsInlineLimit: 0,
    chunkSizeWarningLimit: 2000,
    rollupOptions: {
      output: {
        manualChunks: undefined,
        assetFileNames: (assetInfo) => {
          const name = assetInfo.name || '';
          const info = name.split('.');
          const extType = info[info.length - 1];
          
          if (/\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/i.test(name)) {
            return `assets/media/[name]-[hash][extname]`;
          }
          if (/\.(woff2?|eot|ttf|otf)(\?.*)?$/i.test(name)) {
            return `assets/fonts/[name]-[hash][extname]`;
          }
          if (/\.(br)(\?.*)?$/i.test(name)) {
            return `[name].[hash][extname]`;
          }
          return `assets/${extType}/[name]-[hash][extname]`;
        }
      }
    }
  }
})
