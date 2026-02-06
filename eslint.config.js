import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import pluginVue from 'eslint-plugin-vue'
import eslintConfigPrettier from 'eslint-config-prettier'
import globals from 'globals'

const commonGlobals = {
  ...globals.browser,
  ...globals.node,
  ga: 'readonly',
  cordova: 'readonly',
  __statics: 'readonly',
  __QUASAR_SSR__: 'readonly',
  __QUASAR_SSR_SERVER__: 'readonly',
  __QUASAR_SSR_CLIENT__: 'readonly',
  __QUASAR_SSR_PWA__: 'readonly',
  Capacitor: 'readonly',
  chrome: 'readonly',
}

const commonRules = {
  'max-len': 'off',
  'template-curly-spacing': 'off',
  'indent': 'off',
  'no-unreachable': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
  'no-unused-vars': 'off',
  '@typescript-eslint/no-unused-vars': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
  'no-useless-concat': 'off',
  'no-param-reassign': 'off',
  'semi': ['error', 'never'],
  'no-shadow': 'off',
  'no-alert': 'off',
  'prefer-destructuring': 'off',
  'prefer-spread': 'off',
  'no-lonely-if': 'off',
  'no-plusplus': 'off',
  'comma-dangle': ['error', 'always-multiline'],
  'func-names': 'off',
  'prefer-promise-reject-errors': 'off',
  'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
  'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
  'no-unsafe-any': 'off',
  'quotes': ['warn', 'single'],
  '@typescript-eslint/explicit-function-return-type': 'off',
  '@typescript-eslint/no-explicit-any': 'off',
  '@typescript-eslint/no-unsafe-declaration-merging': 'off',
  '@typescript-eslint/no-empty-object-type': 'off',
  '@typescript-eslint/no-require-imports': 'off',
  'no-case-declarations': 'off',
  'no-empty': 'off',
  'no-undef': 'off',
  'no-constant-binary-expression': 'off',
  'valid-typeof': 'off',
  'vue/no-unused-components': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
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
  'vue/max-attributes-per-line': 'warn',
  'vue/component-name-in-template-casing': ['error', 'PascalCase'],
  'vue/no-v-html': 'off',
  'vue/multi-word-component-names': 'off',
}

export default [
  {
    ignores: [
      'dist/**',
      'src-capacitor/**',
      'src-cordova/**',
      '.quasar/**',
      'node_modules/**',
      'src-ssr/**',
      'quasar.config.*.temporary.compiled*',
      'babel.config.js',
      'src-pwa/.eslintrc.js',
      'eslint.config.js',
    ],
  },

  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginVue.configs['flat/essential'],
  eslintConfigPrettier,

  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tseslint.parser,
      globals: commonGlobals,
    },
    rules: commonRules,
  },

  {
    files: ['**/*.vue'],
    languageOptions: {
      globals: commonGlobals,
      parserOptions: {
        parser: tseslint.parser,
        extraFileExtensions: ['.vue'],
      },
    },
    rules: commonRules,
  },
]
