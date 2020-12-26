// .eslintrc.js
const { resolve } = require('path');

/** @type { import('eslint').Linter.Config } */
module.exports = {
  root: true,

  // Rules order is important, please avoid shuffling them
  extends: [
    // Base ESLint recommended rules
    'eslint:recommended',

    // `plugin:vue/essential` by default, consider switching to `plugin:vue/strongly-recommended`
    //  or `plugin:vue/recommended` for stricter rules.
    // See https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention


    // Usage with Prettier, provided by 'eslint-config-prettier'.
    // https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/eslint-plugin#usage-with-prettier
  ],

  plugins: [
    // Required to lint *.vue files
    // See https://eslint.vuejs.org/user-guide/#why-doesn-t-it-work-on-vue-file
    'vue'
    // Prettier has not been included as plugin to avoid performance impact
    // See https://github.com/typescript-eslint/typescript-eslint/issues/389#issuecomment-509292674
    // Add it as an extension
  ],

  parserOptions: {
    // extraFileExtensions: ['.vue'],
    ecmaVersion: 2018, // Allows for the parsing of modern ECMAScript features
    sourceType: 'module' // Allows for the use of imports
  },

  globals: {
    ga: true, // Google Analytics
    cordova: true,
    __statics: true,
    process: true
  },

  // add your custom rules here
  rules: {
    'indent': ['error', 2, { 'MemberExpression': 1, 'SwitchCase': 1 }],
    eqeqeq: ['error', 'always'],
    'prefer-const': 'error',
    'prefer-promise-reject-errors': 'off',
    'no-useless-escape': 'off',
    quotes: ['error', 'single'],
    semi: 'error',
    // allow console.log during development only
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    // allow debugger during development only
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    // Custom
    'newline-after-var': ['error', 'always'],
    'lines-between-class-members': ['error', 'always', { 'exceptAfterSingleLine': true }],
    'object-curly-newline': ['error', { 'multiline': true, 'consistent': true }],
    'object-curly-spacing': ['error', 'always'],
    'comma-spacing': ['error', { 'before': false, 'after': true }],
    'comma-dangle': ['error', 'never'],
    'computed-property-spacing': ['error', 'never'],
    'space-in-parens': ['error', 'never'],
    'block-spacing': 'error',
    'brace-style': ['error', '1tbs', { 'allowSingleLine': true }],
    'no-unused-vars': ['error', { 'varsIgnorePattern': '_', 'argsIgnorePattern': '^_', args: 'after-used' }],
    'key-spacing': ['error', { 'mode': 'strict' }],
    'keyword-spacing': ['error', { after: true, before: true }],
    'space-infix-ops': 'error'

    // Correct typescript linting until at least 2.0.0 major release
    // See https://github.com/typescript-eslint/typescript-eslint/issues/501
    // See https://github.com/typescript-eslint/typescript-eslint/issues/493
  },

  overrides: [
    {
      files: ['*.js'],
      env: {
        node: true,
        es6: true
      },
      parser: 'babel-eslint'
    },
    {
      // enable the rule specifically for TypeScript files
      files: ['*.ts', '*.tsx', '*.vue'],
      env: {
        browser: true,
        node: true
      },
      extends: [
        // ESLint typescript rules
        // See https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/eslint-plugin#usage
        'plugin:@typescript-eslint/eslint-recommended',
        // 'plugin:@typescript-eslint/recommended',
        'plugin:vue/recommended'
        // 'prettier',
        // 'prettier/@typescript-eslint',
        // 'prettier/vue'
      ],
      plugins: [
        // Required to apply rules which need type information
        '@typescript-eslint',
      ],
      // Must use parserOptions instead of "parser" to allow vue-eslint-parser to keep working
      // See https://eslint.vuejs.org/user-guide/#how-to-use-custom-parser
      // `parser: 'vue-eslint-parser'` is already included with any 'plugin:vue/**' config and should be omitted
      parserOptions: {
        extraFileExtensions: ['.vue'],
        parser: '@typescript-eslint/parser',
        project: resolve(__dirname, './tsconfig.json'),
        // tsconfigRootDir: __dirname,
        ecmaVersion: 2018, // Allows for the parsing of modern ECMAScript features
        sourceType: 'module' // Allows for the use of imports
      },
      rules: {
        'vue/html-closing-bracket-newline': ['error', {
          'singleline': 'never',
          'multiline': 'always'
        }],
        'vue/max-attributes-per-line': ['error', {
          'singleline': 10,
          'multiline': {
            'max': 1,
            'allowFirstLine': false
          }
        }],
        'vue/no-v-html': 0,
        'vue/prop-name-casing': ['error', 'camelCase'],
        'vue/block-tag-newline': ['error', {
          'singleline': 'consistent',
          'multiline': 'consistent',
          'maxEmptyLines': 0
        }],
        'vue/padding-line-between-blocks': ['error', 'always'],
        'vue/no-useless-v-bind': ['error', {
          'ignoreIncludesComment': false,
          'ignoreStringEscape': false
        }],
        'vue/no-useless-mustaches': ['error', {
          'ignoreIncludesComment': false,
          'ignoreStringEscape': false
        }],
        'vue/component-name-in-template-casing': ['error', 'kebab-case'],
        'vue/no-empty-component-block': ['error'],
        '@typescript-eslint/semi': ['error'],
        '@typescript-eslint/no-var-requires': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/indent': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/prefer-as-const': 'off',
        '@typescript-eslint/no-this-alias': [
          'error',
          {
            allowDestructuring: true, // Allow `const { props, state } = this`; false by default
            allowedNames: ['self'] // Allow `const self = this`; `[]` by default
          }
        ],
        '@typescript-eslint/lines-between-class-members': ['error', 'always', { exceptAfterSingleLine: true }],
        '@typescript-eslint/naming-convention': [
          'warn',
          // variable, function, parameter
          {
            selector: 'variableLike',
            format: ['camelCase', 'PascalCase'],
            leadingUnderscore: 'forbid',
            trailingUnderscore: 'forbid'
          },

          { selector: 'memberLike', modifiers: ['private'], format: ['camelCase'], leadingUnderscore: 'require' },
          // class, interface, typeAlias, enum, typeParameter
          { selector: 'typeLike', format: ['PascalCase'], leadingUnderscore: 'forbid', trailingUnderscore: 'forbid' },
          {
            selector: 'parameterProperty',
            format: ['camelCase'],
            leadingUnderscore: 'allow',
            trailingUnderscore: 'forbid'
          },
          { selector: 'variable', format: ['camelCase', 'UPPER_CASE', 'PascalCase'] },
          { selector: 'method', format: ['camelCase'], leadingUnderscore: 'allow' },
          { selector: 'parameter', format: ['camelCase', 'PascalCase'], leadingUnderscore: 'allow' },
          { selector: 'accessor', format: ['camelCase'] },
          {
            selector: 'property',
            format: ['camelCase', 'PascalCase'],
            leadingUnderscore: 'forbid',
            trailingUnderscore: 'forbid'
          },
          {
            selector: 'property',
            modifiers: ['static'],
            format: ['PascalCase', 'UPPER_CASE']
          },
          {
            selector: 'parameterProperty',
            format: ['camelCase', 'PascalCase'],
            leadingUnderscore: 'forbid',
            trailingUnderscore: 'forbid'
          },
          { selector: 'method', format: ['camelCase'], leadingUnderscore: 'forbid', trailingUnderscore: 'forbid' },
          {
            selector: 'function',
            format: ['camelCase', 'PascalCase'],
            leadingUnderscore: 'forbid',
            trailingUnderscore: 'forbid'
          },
          { selector: 'accessor', format: ['camelCase'], leadingUnderscore: 'forbid', trailingUnderscore: 'forbid' },
          {
            selector: 'enumMember',
            format: ['PascalCase', 'camelCase', 'UPPER_CASE'],
            leadingUnderscore: 'forbid',
            trailingUnderscore: 'forbid'
          }
        ],
        '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', args: 'after-used' }],
        '@typescript-eslint/explicit-member-accessibility': [
          'error',
          {
            accessibility: 'explicit',
            overrides: {
              accessors: 'no-public',
              constructors: 'no-public',
              methods: 'explicit',
              properties: 'explicit',
              parameterProperties: 'explicit'
            }
          }
        ],
        '@typescript-eslint/ban-types': [
          'error',
          {
            extendDefaults: true,
            types: {
              object: false
            }
          }
        ]
      }
    }
  ]
};
