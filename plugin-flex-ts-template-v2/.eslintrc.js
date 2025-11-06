module.exports = {
  root: true,
  extends: ['twilio', 'plugin:@typescript-eslint/recommended'],
  ignorePatterns: ['/*', '!/src'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint'],
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx', '.d.ts'],
    },
  },
  rules: {
    camelcase: 'off',
    complexity: 'off',
    'import/extensions': 'off',
    'import/no-extraneous-dependencies': 'off',
    'import/no-mutable-exports': 'off',
    'import/no-unresolved': 'off',
    'import/no-unused-modules': 'off',
    'multiline-comment-style': 'off',
    'no-alert': 'off',
    'no-console': 'off',
    'no-duplicate-imports': 'off',
    'no-nested-ternary': 'off',
    'no-restricted-imports': [
      'error',
      {
        paths: [
          {
            name: '@twilio-paste/core',
            message:
              'Importing Paste this way bloats plugin size. Instead, use specific imports such as `@twilio-paste/core/button`.',
          },
          {
            name: 'lodash',
            message:
              'Importing lodash this way bloats plugin size. Instead, use specific imports such as `lodash/sortBy`.',
          },
        ],
      },
    ],
    'no-restricted-syntax': [
      'error',
      {
        selector: 'MethodDefinition[kind="constructor"]',
        message:
          'Constructor methods are not allowed, as singleton constructors execute within a disabled feature. You may ignore this if your constructor validates that the feature is enabled or if it is not exported as a singleton.',
      },
    ],
    'prefer-destructuring': 'off',
    'prefer-named-capture-group': 'off',
    'prefer-promise-reject-errors': 'off',
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto',
      },
    ],
    'sonarjs/cognitive-complexity': 'off',
    'sonarjs/no-identical-functions': 'off',
    'sonarjs/no-duplicate-string': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-floating-promises': 'off',
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        argsIgnorePattern: '^_',
      },
    ],
    '@typescript-eslint/no-use-before-define': 'off',
    '@typescript-eslint/require-array-sort-compare': 'off',

    // Items below are from the unmaintained eslint-config-twilio-ts package

    // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-shadow.md
    'no-shadow': 'off',

    // We use Interface instead of PropTypes in TS
    'react/prop-types': 'off',

    // Methods are sorted based on their modifiers, not React method ordering
    'react/sort-comp': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/member-ordering': 'error',
    '@typescript-eslint/no-empty-interface': [
      'error',
      {
        allowSingleExtends: false,
      },
    ],

    // We must disable the base rule as it can report incorrect errors.
    'no-extra-parens': 'off',

    '@typescript-eslint/parameter-properties': [
      'error',
      {
        allow: ['readonly'],
      },
    ],
    '@typescript-eslint/no-require-imports': 'error',

    // Turning this rule off until https://github.com/typescript-eslint/typescript-eslint/pull/1163 gets merged.
    '@typescript-eslint/no-unnecessary-condition': 'off',

    // We must disable the base rule as it can report incorrect errors.
    'no-useless-constructor': 'off',
    '@typescript-eslint/no-useless-constructor': 'error',
    '@typescript-eslint/no-inferrable-types': 'off',
    '@typescript-eslint/prefer-for-of': 'error',
    '@typescript-eslint/prefer-function-type': 'error',
    '@typescript-eslint/promise-function-async': 'error',
    '@typescript-eslint/restrict-plus-operands': 'error',
    '@typescript-eslint/typedef': 'off',
    '@typescript-eslint/unified-signatures': 'error',

    // See https://github.com/typescript-eslint/typescript-eslint/blob/v4.13.0/packages/eslint-plugin/docs/rules/no-use-before-define.md
    'no-use-before-define': 'off',

    // These are the rules that are unnecessary or might conflict with Prettier.
    '@typescript-eslint/indent': 'off',
    '@typescript-eslint/member-delimiter-style': 'off',
    '@typescript-eslint/no-extra-parens': 'off',
    '@typescript-eslint/type-annotation-spacing': 'off',
  },
};
