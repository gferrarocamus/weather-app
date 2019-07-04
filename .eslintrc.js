module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: ['airbnb-base'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {
    'import/no-cycle': 'off',
    'import/prefer-default-export': 'off',
    'no-param-reassign': 'off',
    'prefer-destructuring': 'off',
    'no-alert': 'off',
    'no-restricted-globals': 'off',
    'no-unused-expressions': 'off',
    'radix': 'off',
  }
};
