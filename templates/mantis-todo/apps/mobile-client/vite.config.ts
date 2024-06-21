/// <reference types="vitest" />

import analog from '@analogjs/platform';
import { defineConfig, splitVendorChunkPlugin } from 'vite';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    root: __dirname,
    publicDir: 'src/public',
    cacheDir: '`../../node_modules/.vitest',
    build: {
      outDir: '../../dist/apps/mobile-client/client',
      reportCompressedSize: true,
      target: ['es2020'],
    },
    ssr: {
      noExternal: ['@ionic/**', '@stencil/**', 'ionicons'],
    },
    server: {
      fs: {
        allow: ['.'],
      },
    },
    plugins: [
      analog({
        ssr: false,
        vite: {
          inlineStylesExtension: 'scss',
        },
      }),
      nxViteTsPaths(),
      splitVendorChunkPlugin(),
    ],
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['src/test-setup.ts'],
      include: ['**/*.spec.ts'],
      reporters: ['default'],
      server: {
        deps: {
          inline: ['@ionic/angular'],
        },
      },
    },
    define: {
      'import.meta.vitest': mode !== 'production',
    },
  };
});
