import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false
      }
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          utils: ['axios', 'swr']
        },
        assetFileNames: (assetInfo) => {
          if (assetInfo.name) {
            let extType = assetInfo.name.split('.')[1];
            if (extType && /png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
              extType = 'img';
            }
            return `assets/${extType}/[name]-[hash][extname]`;
          }
          return 'assets/[name]-[hash][extname]';
        },
        entryFileNames: 'assets/js/[name]-[hash].js',
        chunkFileNames: 'assets/js/[name]-[hash].js'
      }
    }
  },
  base: '/'
});