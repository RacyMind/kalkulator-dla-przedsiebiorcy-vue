/*
 * This file runs in a Node context (it's NOT transpiled by Babel), so use only
 * the ES6 features that are supported by your Node version. https://node.green/
 */

// Configuration for your app
// https://quasar.dev/quasar-cli/quasar-conf-js
/* eslint-env node */

module.exports = function (/* ctx */) {
  return {
    
    




// animations: 'all', // --- includes all animations
// https://quasar.dev/options/animations
animations: [],

    
    

    
    
    
    




// https://quasar.dev/quasar-cli/prefetch-feature
// preFetch: true,
// app boot file (/src/boot)
// --> boot files are part of "main.js"
// https://quasar.dev/quasar-cli/boot-files
boot: [
      'mixins',
      'google-analytics',
    ],

    
    




// Full list of options: https://quasar.dev/quasar-cli/quasar-conf-js#Property%3A-build
build: {
      // available values: 'hash', 'history'
// transpile: false,
// Add dependencies for transpiling with Babel (Array of string/regex)
// (from node_modules, which are by default not transpiled).
// Applies only if "transpile" is set to true.
// transpileDependencies: [],
// rtl: false, // https://quasar.dev/options/rtl-support
// preloadChunks: true,
// showProgress: false,
// gzip: true,
// analyze: true,
// Options below are automatically set depending on the env, set them if you want to override
// extractCSS: false,
// https://quasar.dev/quasar-cli/handling-webpack
extendWebpack (cfg) {
        cfg.module.rules.push({
          enforce: 'pre',
          exclude: /node_modules/,
          loader: 'eslint-loader',
          test: /\.(js|vue)$/,
        })
      }, 

      

      
      
      
      

      
      
      
      
      

      
      

      
      vueRouterMode: 'hash',
    },

    
    





// Full list of options: https://quasar.dev/quasar-cli/developing-capacitor-apps/configuring-capacitor
capacitor: {
      hideSplashscreen: true,
    },

    
    







// Full list of options: https://quasar.dev/quasar-cli/developing-cordova-apps/configuring-cordova
cordova: {
      // noIosLegacyBuildFlag: true, // uncomment only if you know what you are doing
    },

    
    






// https://quasar.dev/quasar-cli/quasar-conf-js#Property%3A-css
css: [
      'app.scss',
    ],

    
    





// Full list of options: https://quasar.dev/quasar-cli/quasar-conf-js#Property%3A-devServer
devServer: {
      https: false,
      open: true,
      port: 8080, // opens browser window automatically
    },

    
    
    




// Full list of options: https://quasar.dev/quasar-cli/developing-electron-apps/configuring-electron
electron: {
      builder: {
        // https://www.electron.build/configuration/configuration

        appId: 'kalkulator-dla-przedsiebiorcy-vue',
      }, 

      bundler: 'packager',

      
extendWebpack (/* cfg */) {
        // do something with Electron main process Webpack cfg
        // chainWebpack also available besides this extendWebpack
      },

      
      
// More info: https://quasar.dev/quasar-cli/developing-electron-apps/node-integration
nodeIntegration: true,

      
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

    
    






// https://github.com/quasarframework/quasar/tree/dev/extras
extras: [
      // 'ionicons-v4',
      // 'mdi-v5',
      // 'fontawesome-v5',
      // 'eva-icons',
      // 'themify',
      // 'line-awesome',
      'roboto-font-latin-ext', // this or either 'roboto-font', NEVER both!

      'material-icons-outlined',
      // 'roboto-font', // optional, you are not bound to it
      'material-icons', // optional, you are not bound to it
    ],

    
    







// https://quasar.dev/quasar-cli/quasar-conf-js#Property%3A-framework
framework: {
      // Quasar language pack
config: {}, 
      
cssAddon: true, 
      
iconSet: 'material-icons',
      
// Possible values for "importStrategy":
// * 'auto' - (DEFAULT) Auto-import needed Quasar components & directives
// * 'all'  - Manually specify what to import
importStrategy: 'auto',

      
      
      
      // Quasar icon set
lang: 'pl',

      // For special cases outside of where "auto" importStrategy can have an impact
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

    
    






// https://quasar.dev/quasar-cli/developing-pwa/configuring-pwa
pwa: {
      
      manifest: {
        background_color: '#ffffff',
        description: 'Kalkulator finansowy jest bezpłatnym programem umożliwiającym łatwe obliczenie wynagrodzeń.',
        display: 'minimal-ui',
        icons: [
          {
            sizes: '128x128',
            src: 'icons/icon-128x128.png',
            type: 'image/png',
          },
          {
            sizes: '192x192',
            src: 'icons/icon-192x192.png',
            type: 'image/png',
          },
          {
            sizes: '256x256',
            src: 'icons/icon-256x256.png',
            type: 'image/png',
          },
          {
            sizes: '384x384',
            src: 'icons/icon-384x384.png',
            type: 'image/png',
          },
          {
            sizes: '512x512',
            src: 'icons/favicon-512x512.png',
            type: 'image/png',
          },
        ],
        name: 'Kalkulator finansowy',
        orientation: 'portrait',
        short_name: 'Kalkulator finansowy',
        start_url: '/app/',
        theme_color: '#d12526',
        version: '4.0.0',
      },
      // workboxPluginMode: 'GenerateSW', // 'GenerateSW' or 'InjectManifest'
workboxOptions: { 
        clientsClaim: true,
        // only for GenerateSW
skipWaiting: true,
      },
    },

    
    




// https://quasar.dev/quasar-cli/developing-ssr/configuring-ssr
ssr: {
      pwa: false,
    },

    
    
// https://quasar.dev/quasar-cli/supporting-ts
supportTS: true,
  }
}
