const { resolve } = require('path')

module.exports = {
  root: true,

  parserOptions: {
    parser: '@typescript-eslint/parser',
    sourceType: 'module', // Allows for the use of imports
  },

  env: {
    browser: true,
    node: true
  },

  // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
  // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
  extends: [
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:vue/essential'
  ],

  // required to lint *.vue files
  plugins: [
    "sort-keys-fix",
    'vue',
    '@typescript-eslint',
  ],

  globals: {
    ga: true, // Google Analytics
    cordova: true,
    __statics: true,
    process: true
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
    'prefer-promise-reject-errors': 'off',

    // allow console.log during development only
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    // allow debugger during development only
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',

    // TypeScript
    "no-unsafe-any": 'off',
    'quotes': ['warn', 'single'],
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-explicit-any': "off",
    "sort-keys-fix/sort-keys-fix": ["warn", "asc", {"natural": true}],
  }
};
