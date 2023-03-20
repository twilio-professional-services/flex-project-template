module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'twilio'],
  rules: {
    "camelcase": "off",
    "import/extensions": "off",
    "import/no-extraneous-dependencies": "off",
    "import/no-unresolved": "off",
    "import/no-unused-modules": "off",
    "multiline-comment-style": "off",
    "no-alert": "off",
    "no-console": "off",
    "no-duplicate-imports": "off",
    "no-shadow": "off",
    "prefer-named-capture-group": "off",
    "@typescript-eslint/ban-ts-comment": "off",
    "@typescript-eslint/no-duplicate-imports": ["error"],
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }]
  }
};
