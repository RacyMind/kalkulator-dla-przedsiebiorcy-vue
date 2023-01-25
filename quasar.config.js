/* eslint-env node */

/*
 * This file runs in a Node context (it's NOT transpiled by Babel), so use only
 * the ES6 features that are supported by your Node version. https://node.green/
 */

// Configuration for your app
// https://v2.quasar.dev/quasar-cli-vite/quasar-config-js


// eslint-disable-next-line @typescript-eslint/no-var-requires
const {configure} = require('quasar/wrappers')

module.exports = configure(function (ctx) {
  return {

// animations: 'all', // --- includes all animations
// https://v2.quasar.dev/options/animations
    animations: [],

    // Full list of options: https://v2.quasar.dev/quasar-cli-vite/developing-browser-extensions/configuring-bex
    bex: {
      contentScripts: [
        'my-content-script',
      ],

      // extendBexScriptsConf (esbuildConf) {}
      // extendBexManifestJson (json) {}
    },

// https://v2.quasar.dev/quasar-cli-vite/prefetch-feature
// preFetch: true,
// app boot file (/src/boot)
// --> boot files are part of "main.js"
// https://v2.quasar.dev/quasar-cli-vite/boot-files
    boot: [
      'google-analytics',
    ],

    // Full list of options: https://v2.quasar.dev/quasar-cli-vite/quasar-config-js#build
    build: {
      target: {
        browser: ['es2019', 'edge88', 'firefox78', 'chrome87', 'safari13.1'],
        node: 'node16',
      },
      publicPath: ctx.dev ? '' : 'app',
      vueRouterMode: 'hash',

      // vueRouterBase,
      // vueDevtools,
      // vueOptionsAPI: false,

      // rebuildCache: true, // rebuilds Vite/linter/etc cache on startup

      // publicPath: '/',
      // analyze: true,
      // env: {},
      // rawDefine: {}
      // ignorePublicFolder: true,
      // minify: false,
      // polyfillModulePreload: true,
      // distDir

      // extendViteConf (viteConf) {},
      // viteVuePluginOptions: {},

      // vitePlugins: [
      //   [ 'package-name', { ..options.. } ]
      // ]
    },


// Full list of options: https://v2.quasar.dev/quasar-cli-vite/developing-capacitor-apps/configuring-capacitor
    capacitor: {
      hideSplashscreen: true,
    },

// Full list of options: https://v2.quasar.dev/quasar-cli-vite/developing-cordova-apps/configuring-cordova
    cordova: {
      // noIosLegacyBuildFlag: true, // uncomment only if you know what you are doing
    },

// https://v2.quasar.dev/quasar-cli-vite/quasar-config-js#css
    css: [
      'app.scss',
    ],

// Full list of options: https://v2.quasar.dev/quasar-cli-vite/quasar-config-js#devServer
    devServer: {
      // https: true
      open: true, // opens browser window automatically
    },


// Full list of options: https://v2.quasar.dev/quasar-cli-vite/developing-electron-apps/configuring-electron
    electron: {
      builder: {
        // https://www.electron.build/configuration/configuration
        appId: 'kalkulator-finansowy',
      },
      bundler: 'packager',

      // extendElectronMainConf (esbuildConf)
// extendElectronPreloadConf (esbuildConf)
      inspectPort: 5858,

      // 'packager' or 'builder'
      packager: {
        // https://github.com/electron-userland/electron-packager/blob/master/docs/api.md#options

        // OS X / Mac App Store
        // appBundleId: '',
        // appCategoryType: '',
        // osxSign: '',
        // protocol: 'myapp://path',

        // Windows only
        // win32metadata: { ... }
      },
    },


    eslint: {
      errors: true,
      // fix: true,
// include = [],
// exclude = [],
// rawOptions = {},
      warnings: true,
    },


// https://github.com/quasarframework/quasar/tree/dev/extras
    extras: [
      // 'ionicons-v4',
      // 'mdi-v5',
      // 'fontawesome-v6',
      // 'eva-icons',
      // 'themify',
      // 'line-awesome',
      // 'roboto-font-latin-ext', // this or either 'roboto-font', NEVER both!
      'roboto-font-latin-ext', // this or either 'roboto-font', NEVER both!

      'material-icons-outlined',
      // 'roboto-font', // optional, you are not bound to it
      'material-icons', // optional, you are not bound to it
    ],


// https://v2.quasar.dev/quasar-cli-vite/quasar-config-js#framework
    framework: {
      config: {},
      cssAddon: true,
      iconSet: 'material-icons', // Quasar icon set
      lang: 'pl', // Quasar language pack

      // For special cases outside of where the auto-import strategy can have an impact
      // (like functional components as one of the examples),
      // you can manually specify Quasar components/directives to be available everywhere:
      //
      // components: [],
      // directives: [],

      // Quasar plugins
      plugins: [
        'Notify',
      ],
    },


// https://v2.quasar.dev/quasar-cli-vite/developing-pwa/configuring-pwa
    pwa: {
      workboxMode: 'generateSW',
      manifestFilename: './manifest.json',
      workboxOptions: {
        skipWaiting: false,
        clientsClaim: false,
      },
      extendGenerateSWOptions (cfg) {
        cfg.skipWaiting = false
        cfg.clientsClaim = false
      },
      extendInjectManifestOptions (cfg) {},
      extendManifestJson (json) {},
      extendPWACustomSWConf (esbuildConf) {},
    },



// https://v2.quasar.dev/quasar-cli-vite/quasar-config-js#sourcefiles
// sourceFiles: {
//   rootComponent: 'src/App.vue',
//   router: 'src/router/index',
//   store: 'src/store/index',
//   registerServiceWorker: 'src-pwa/register-service-worker',
//   serviceWorker: 'src-pwa/custom-service-worker',
//   pwaManifestFile: 'src-pwa/manifest.json',
//   electronMain: 'src-electron/electron-main',
//   electronPreload: 'src-electron/electron-preload'
// },
// https://v2.quasar.dev/quasar-cli-vite/developing-ssr/configuring-ssr
    ssr: {


// The default port that the production server should use
// (gets superseded if process.env.PORT is specified at runtime)
      middlewares: [
        'render', // keep this as last one
      ],


// manualStoreHydration: true,
// manualPostHydrationTrigger: true,
      prodPort: 3000,


      // ssrPwaHtmlFilename: 'offline.html', // do NOT use index.html as name!
// will mess up SSR
// extendSSRWebserverConf (esbuildConf) {},
// extendPackageJson (json) {},
      // pwa: false,
    },
  }
})
