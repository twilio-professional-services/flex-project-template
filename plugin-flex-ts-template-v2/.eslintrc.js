module.exports = {
  root: true,
  extends: ['twilio-ts'],
  ignorePatterns: ['/*', '!/src', '*.test.ts', '*.test.tsx', './**/__mocks__/*.ts', './**/__mocks__/*.tsx'],
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
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
    '@typescript-eslint/no-duplicate-imports': ['error'],
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
  },
};
