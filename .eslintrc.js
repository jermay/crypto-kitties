module.exports = {
  env: {
    browser: true,
  },
  extends: [
    'airbnb-base',
    'airbnb/rules/react',
    'airbnb/hooks'
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 6,
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
  },
  globals: {
    // testing
    artifacts: 'readonly',
    contract: 'readonly',
    web3: 'readonly',
  },
};
