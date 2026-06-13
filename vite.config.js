import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Served at the domain root on GitHub Pages (https://dinmukhamet-murat.github.io/).
// Asset paths are base-aware via src/lib/asset.js, so a sub-path base also works.
// Preview the production build locally with `npm run preview`.
export default defineConfig({
  base: '/',
  plugins: [react()],
  server: { port: 8092, host: true },
  build: { target: 'es2020', sourcemap: false },
});
