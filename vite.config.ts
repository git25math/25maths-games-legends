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
          'missions': ['./src/data/missions.ts'],
          'lucide': ['lucide-react'],
          'supabase': ['@supabase/supabase-js'],
        },
      },
    },
  },
});
