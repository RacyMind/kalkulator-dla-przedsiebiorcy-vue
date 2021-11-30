const { resolve } = require('path')
module.exports = {
  // https://eslint.org/docs/user-guide/configuring#configuration-cascading-and-hierarchy
  // This option interrupts the configuration hierarchy at this file
  // Remove this if you have an higher level ESLint config file (it usually happens into a monorepos)
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    parser: "@typescript-eslint/parser",
    sourceType: "module",
    tsconfigRootDir: __dirname,
    project: resolve(__dirname, './tsconfig.json'),
    extraFileExtensions: ['.vue'],
    ecmaFeatures: {
      jsx: true
    }
  },

  env: {
    browser: true,
  },


  // Rules order is important, please avoid shuffling them
  extends: [
    // Base ESLint recommended rules
    'eslint:recommended',
    "@vue/typescript",

    // https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/eslint-plugin#usage
    // ESLint typescript rules
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    // consider disabling this class of rules if linting takes too long
    'plugin:@typescript-eslint/recommended-requiring-type-checking',

    // https://eslint.vuejs.org/rules/#priority-a-essential-error-prevention
    // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules
    'plugin:vue/essential',
  ],

  overrides: [{
    files: ['*.ts', '*.tsx'],
    rules: {
      // The core 'no-unused-vars' rules (in the eslint:recommeded ruleset)
      // does not work with type definitions
      'no-unused-vars': 'off',
    }
  }],

  plugins: [
    // required to apply rules which need type information
    '@typescript-eslint',

    // https://eslint.vuejs.org/user-guide/#why-doesn-t-it-work-on-vue-file
    // required to lint *.vue files
    'vue',
  ],


  globals: {
    ga: true, // Google Analytics
    cordova: true,
    __statics: true,
    process: true,
    Capacitor: true,
    chrome: true,
  },

  // add your custom rules here

  rules: {
    'max-len': 0,
    // TODO: Remove when https://github.com/babel/babel-eslint/issues/530 is fixed
    'template-curly-spacing': 'off',
    // TODO: Remove when https://github.com/babel/babel-eslint/issues/530 is fixed
    indent: 'off',
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'warn',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    'no-unreachable': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    'vue/no-unused-components': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    'no-unused-vars': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    'no-useless-concat': 0,
    'no-param-reassign': 0,
    semi: ['error', 'never'],
    'no-shadow': 0,
    'no-alert': 0,
    'import/prefer-default-export': 0,
    'import/no-extraneous-dependencies': 0,
    'prefer-destructuring': 0,
    'prefer-spread': 0,
    'no-lonely-if': 0,
    'no-plusplus': 0,
    'comma-dangle': [
      'error',
      'always-multiline',
    ],
    'vue/html-indent': ['error', 2, {
      attribute: 1,
      baseIndent: 1,
      closeBracket: 0,
      alignAttributesVertically: true,
      ignores: [],
    }],
    'vue/multiline-html-element-content-newline': ['error', {
      ignoreWhenEmpty: true,
      allowEmptyLines: false,
    }],
    'vue/max-attributes-per-line': 1,
    'vue/component-name-in-template-casing': [
      'error',
      'PascalCase',
    ],
    'prefer-promise-reject-errors': 0,
    'vue/no-v-html': 'off',
    'func-names': 0,
    'vue/order-in-components': [
      'error',
      {
        order: [
          'el',
          'name',
          'parent',
          'functional',
          [
            'comments',
            'delimiters',
          ],
          'extends',
          'mixins',
          'inheritAttrs',
          'model',
          [
            'props',
            'propsData',
          ],
          'asyncData',
          'data',
          'head',
          'LIFECYCLE_HOOKS',
          'computed',
          'watch',
          'methods',
          [
            'components',
            'directives',
            'filters',
          ],
          [
            'render',
            'template',
          ],
          'renderError',
        ],
      },
    ],

    // TypeScript
    "no-unsafe-any": 'off',
    'quotes': ['warn', 'single'],
    '@typescript-eslint/explicit-function-return-type': 'off',
  },
}
