module.exports = {
  // https://eslint.org/docs/user-guide/configuring#configuration-cascading-and-hierarchy
  // This option interrupts the configuration hierarchy at this file
  // Remove this if you have an higher level ESLint config file (it usually happens into a monorepos)
  root: true,

  parserOptions: {
    parser: 'babel-eslint',
    ecmaVersion: 2018, // Allows for the parsing of modern ECMAScript features
    sourceType: 'module' // Allows for the use of imports
  },

  env: {
    browser: true
  },

  // Rules order is important, please avoid shuffling them
  extends: [
    // Base ESLint recommended rules
    // 'eslint:recommended',


    // Uncomment any of the lines below to choose desired strictness,
    // but leave only one uncommented!
    // See https://eslint.vuejs.org/rules/#available-rules
    'plugin:vue/essential', // Priority A: Essential (Error Prevention)
    // 'plugin:vue/strongly-recommended', // Priority B: Strongly Recommended (Improving Readability)
    // 'plugin:vue/recommended', // Priority C: Recommended (Minimizing Arbitrary Choices and Cognitive Overhead)

    'standard'

  ],

  plugins: [
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
    chrome: true
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
    "vue/html-indent": ["error", 2, {
      "attribute": 1,
      "baseIndent": 1,
      "closeBracket": 0,
      "alignAttributesVertically": true,
      "ignores": []
    }],
    "vue/multiline-html-element-content-newline": ["error", {
      "ignoreWhenEmpty": true,
      "allowEmptyLines": false
    }],
    "vue/max-attributes-per-line": 1,
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
  },
}
