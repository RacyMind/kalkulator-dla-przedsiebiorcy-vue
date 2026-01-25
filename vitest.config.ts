import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vitest/config'
import { quasar, transformAssetUrls } from '@quasar/vite-plugin'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      'src': fileURLToPath(new URL('./src', import.meta.url)),
      'api': fileURLToPath(new URL('./src/api', import.meta.url)),
      'assets': fileURLToPath(new URL('./src/assets', import.meta.url)),
      'boot': fileURLToPath(new URL('./src/boot', import.meta.url)),
      'components': fileURLToPath(new URL('./src/components', import.meta.url)),
      'composables': fileURLToPath(new URL('./src/composables', import.meta.url)),
      'css': fileURLToPath(new URL('./src/css', import.meta.url)),
      'layouts': fileURLToPath(new URL('./src/layouts', import.meta.url)),
      'logic': fileURLToPath(new URL('./src/logic', import.meta.url)),
      'pages': fileURLToPath(new URL('./src/pages', import.meta.url)),
      'router': fileURLToPath(new URL('./src/router', import.meta.url)),
      'stores': fileURLToPath(new URL('./src/stores', import.meta.url)),
      '~': fileURLToPath(new URL('./', import.meta.url)),
    },
  },
  test: {
    environment: 'happy-dom',
    setupFiles: 'test/vitest/setup-file.ts',
    include: [
      // Matches vitest tests in any subfolder of 'src' or into 'test/vitest/__tests__'
      // Matches all files with extension 'js', 'jsx', 'ts' and 'tsx'
      'src/**/*.vitest.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
      'test/vitest/__tests__/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
    ],
  },
  plugins: ([
    vue({
      template: { transformAssetUrls },
    }),
    quasar({
      sassVariables: 'src/css/quasar.variables.scss',
    }),
  ] as unknown) as any,
})
