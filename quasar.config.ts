// Configuration for your app
// https://v2.quasar.dev/quasar-cli-vite/quasar-config-js

import { defineConfig } from '#q-app/wrappers'

export default defineConfig((ctx) => {
  return {
    // https://v2.quasar.dev/options/animations
    animations: [],

    // app boot file (/src/boot)
    // --> boot files are part of "main.js"
    // https://v2.quasar.dev/quasar-cli-vite/boot-files
    boot: [
      'google-analytics',
      ...('capacitor' in ctx.mode ? ['admob'] : []),
    ],

    // Full list of options: https://v2.quasar.dev/quasar-cli-vite/quasar-config-js#build
    build: {
      target: {
        browser: ['es2019', 'edge88', 'firefox78', 'chrome87', 'safari13.1'],
        node: 'node16',
      },
      publicPath: ctx.dev ? '' : 'app',
      vueRouterMode: 'hash',
      typescript: {
        strict: true,
        vueShim: true,
      },
      extendViteConf(viteConf) {
        if (!('capacitor' in ctx.mode)) {
          const capacitorStubs = ['@capacitor/core', '@capacitor-community/admob']
          const STUB_PREFIX = '\0capacitor-stub:'

          viteConf.plugins = viteConf.plugins || []
          viteConf.plugins.push({
            name: 'capacitor-stub',
            resolveId(id: string) {
              if (capacitorStubs.includes(id)) {
                return STUB_PREFIX + id
              }
            },
            load(id: string) {
              if (id.startsWith(STUB_PREFIX)) {
                return 'export const Capacitor = { isNativePlatform: () => false }; export default {};'
              }
            },
          })
        }
      },
    },

    // Full list of options: https://v2.quasar.dev/quasar-cli-vite/developing-capacitor-apps/configuring-capacitor
    capacitor: {
      hideSplashscreen: true,
    },

    // Full list of options: https://v2.quasar.dev/quasar-cli-vite/developing-cordova-apps/configuring-cordova
    cordova: {},

    // https://v2.quasar.dev/quasar-cli-vite/quasar-config-js#css
    css: [
      'app.scss',
    ],

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
      config: {},
      cssAddon: true,
      iconSet: 'material-icons',
      lang: 'pl',
      plugins: [
        'Notify',
      ],
    },

    // https://v2.quasar.dev/quasar-cli-vite/developing-pwa/configuring-pwa
    pwa: {
      workboxMode: 'GenerateSW',
      manifestFilename: './manifest.json',
      workboxOptions: {
        skipWaiting: true,
        clientsClaim: true,
      },
    },

    // https://v2.quasar.dev/quasar-cli-vite/developing-ssr/configuring-ssr
    ssr: {
      middlewares: [
        'render',
      ],
      prodPort: 3000,
    },
  }
})
