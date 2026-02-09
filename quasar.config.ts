// Configuration for your app
// https://v2.quasar.dev/quasar-cli-vite/quasar-config-js

import 'dotenv/config';
import { defineConfig } from '#q-app/wrappers';

export default defineConfig((ctx) => {
  return {
    // https://v2.quasar.dev/options/animations
    animations: [],

    // app boot file (/src/boot)
    // --> boot files are part of "main.js"
    // https://v2.quasar.dev/quasar-cli-vite/boot-files
    boot: [
      'google-analytics',
      'aria-describedby',
      ...('capacitor' in ctx.mode ? ['admob', 'review-prompt'] : []),
    ],

    // Full list of options: https://v2.quasar.dev/quasar-cli-vite/quasar-config-js#build
    build: {
      target: {
        browser: ['es2019', 'edge88', 'firefox78', 'chrome87', 'safari13.1'],
        node: 'node16',
      },
      publicPath: ctx.dev ? '' : 'app',
      vueRouterMode: 'hash',
      env: {
        VITE_GTM_ID: process.env.VITE_GTM_ID,
        VITE_ADSENSE_PUBLISHER_ID: process.env.VITE_ADSENSE_PUBLISHER_ID,
      },
      typescript: {
        strict: true,
        vueShim: true,
      },
      extendViteConf(viteConf) {
        if (!('capacitor' in ctx.mode)) {
          const capacitorStubs = [
            '@capacitor/core',
            '@capacitor-community/admob',
            '@capacitor-community/in-app-review',
            '@capacitor-firebase/analytics',
          ];
          const STUB_PREFIX = '\0capacitor-stub:';

          viteConf.plugins = viteConf.plugins || [];
          viteConf.plugins.push({
            name: 'capacitor-stub',
            enforce: 'pre' as const,
            resolveId(id: string) {
              if (
                capacitorStubs.some(
                  (stub) => id === stub || id.startsWith(stub + '/'),
                )
              ) {
                return STUB_PREFIX + id;
              }
            },
            load(id: string) {
              if (!id.startsWith(STUB_PREFIX)) {
                return;
              }
              const stubId = id.slice(STUB_PREFIX.length);
              if (stubId === '@capacitor/core') {
                return 'export const Capacitor = { isNativePlatform: () => false }; export const registerPlugin = () => ({}); export class WebPlugin {}; export default {};';
              }
              if (stubId === '@capacitor-firebase/analytics') {
                return 'export const FirebaseAnalytics = { logEvent: () => Promise.resolve(), setCurrentScreen: () => Promise.resolve() }; export default {};';
              }
              return 'export default {};';
            },
          });
        }

        viteConf.build = viteConf.build || {};
        viteConf.build.rollupOptions = viteConf.build.rollupOptions || {};
        viteConf.build.rollupOptions.output = {
          ...((viteConf.build.rollupOptions.output as object) || {}),
          manualChunks(id: string) {
            if (id.includes('node_modules/quasar/')) return 'vendor-quasar';
            if (
              id.includes('node_modules/vue') ||
              id.includes('node_modules/pinia') ||
              id.includes('node_modules/vue-router')
            )
              return 'vendor-vue';
            if (
              id.includes('node_modules/chart.js') ||
              id.includes('node_modules/vue-chartjs')
            )
              return 'vendor-charts';
          },
        };
      },
    },

    // Full list of options: https://v2.quasar.dev/quasar-cli-vite/developing-capacitor-apps/configuring-capacitor
    capacitor: {
      hideSplashscreen: true,
    },

    // Full list of options: https://v2.quasar.dev/quasar-cli-vite/developing-cordova-apps/configuring-cordova
    cordova: {},

    // https://v2.quasar.dev/quasar-cli-vite/quasar-config-js#css
    css: ['app.scss'],

    // Full list of options: https://v2.quasar.dev/quasar-cli-vite/quasar-config-js#devServer
    devServer: {
      open: true,
    },

    // Full list of options: https://v2.quasar.dev/quasar-cli-vite/developing-electron-apps/configuring-electron
    electron: {
      builder: {
        appId: 'kalkulator-finansowy',
      },
      bundler: 'packager',
      inspectPort: 5858,
      packager: {},
    },

    eslint: {
      errors: true,
      warnings: true,
    },

    // https://github.com/quasarframework/quasar/tree/dev/extras
    extras: [
      'roboto-font-latin-ext',
      'material-icons-outlined',
      'material-icons',
    ],

    // https://v2.quasar.dev/quasar-cli-vite/quasar-config-js#framework
    framework: {
      config: {
        brand: {
          primary: '#1565C0',
        },
      },
      cssAddon: true,
      iconSet: 'material-icons',
      lang: 'pl',
      plugins: ['Dark', 'Notify'],
    },

    // https://v2.quasar.dev/quasar-cli-vite/developing-pwa/configuring-pwa
    pwa: {
      workboxMode: 'GenerateSW',
      manifestFilename: './manifest.json',
      workboxOptions: {
        clientsClaim: true,
        runtimeCaching: [
          {
            urlPattern: /\.(?:woff2?|ttf|eot)$/,
            handler: 'CacheFirst' as const,
            options: {
              cacheName: 'fonts',
              expiration: { maxEntries: 20, maxAgeSeconds: 365 * 24 * 60 * 60 },
            },
          },
          {
            urlPattern: /\.(?:js|css)$/,
            handler: 'StaleWhileRevalidate' as const,
            options: {
              cacheName: 'static-resources',
              expiration: { maxEntries: 100, maxAgeSeconds: 30 * 24 * 60 * 60 },
            },
          },
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/,
            handler: 'CacheFirst' as const,
            options: {
              cacheName: 'images',
              expiration: { maxEntries: 50, maxAgeSeconds: 30 * 24 * 60 * 60 },
            },
          },
        ],
      },
    },

    // https://v2.quasar.dev/quasar-cli-vite/developing-ssr/configuring-ssr
    ssr: {
      middlewares: ['render'],
      prodPort: 3000,
    },
  };
});
