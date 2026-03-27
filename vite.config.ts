import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: './',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Split heavy modules into separate chunks for parallel loading
          'generators': ['./src/utils/generateMission.ts'],
          'diagrams': [
            './src/utils/renderDiagram.tsx',
            './src/components/diagrams/AnimatedCoordinatePlane.tsx',
            './src/components/diagrams/AnimatedQuadraticPlane.tsx',
            './src/components/diagrams/AnimatedNumberLine.tsx',
            './src/components/diagrams/CoordinatePlane.tsx',
          ],
          'katex': ['katex'],
          'motion': ['motion/react'],
          'missions-y7':  ['./src/data/missions/y7.ts'],
          'missions-y8':  ['./src/data/missions/y8.ts'],
          'missions-y9':  ['./src/data/missions/y9.ts'],
          'missions-y10': ['./src/data/missions/y10.ts'],
          'missions-y11': ['./src/data/missions/y11.ts'],
          'missions-y12': ['./src/data/missions/y12.ts'],
          'lucide': ['lucide-react'],
          'supabase': ['@supabase/supabase-js'],
        },
      },
    },
  },
});
