module.exports = {
  env: {
    browser: true,
    es2017: true
  },
  extends: [
    'airbnb-base',
    'airbnb/rules/react',
    'airbnb/hooks'
  ],
  parser: 'babel-eslint',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 8,
    sourceType: 'module',
  },
  plugins: [
    'react'
  ],
  rules: {
    'comma-dangle': [
      'error',
      {
        arrays: 'only-multiline',
        objects: 'always',
        imports: 'only-multiline',
        exports: 'only-multiline',
        functions: 'never',
      }
    ],
    'no-multiple-empty-lines': ['error', { max: 2, }],
    'prefer-destructuring': ['error', { 'object': true, 'array': false }],
    'no-console': ['error', { allow: ['warn', 'error'] }],
    'lines-between-class-members': ['error', 'always', { 'exceptAfterSingleLine': true }]
  },
  globals: {
    // testing
    artifacts: 'readonly',
    contract: 'readonly',
    web3: 'readonly',
  },
};
