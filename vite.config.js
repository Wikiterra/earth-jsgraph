import { resolve } from 'node:path';
import { defineConfig } from 'vite';

// Single multi-page build for GitHub Pages: landing + both apps into one dist/.
// base:'./' => relative asset URLs, so it works under any repo sub-path
// (user.github.io/<repo>/) without hardcoding the repo name.
// Both apps are ESM (js/main*.js) and bundle normally — no static-copy needed.
const root = import.meta.dirname;

export default defineConfig({
  base: './',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        index: resolve(root, 'index.html'),
        drop: resolve(root, 'apps/earth-drop-calc/index.html'),
        fed: resolve(root, 'apps/fed-wabis/index.html'),
      },
    },
  },
});
