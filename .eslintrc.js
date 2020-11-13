module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  rules: {
    'prettier/prettier': 'off',
    'comma-dangle': 'off',
    'keyword-spacing': 'off',
    curly: 'off',
    'no-unreachable': 'off',
    'no-bitwise': 'off',
    'no-nested-ternary': 'warn',
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        vars: 'all',
        args: 'after-used',
        ignoreRestSiblings: false,
        argsIgnorePattern: '^_',
      },
    ],
    'eslint-comments/no-unused-disable': 'off',
  },
};
