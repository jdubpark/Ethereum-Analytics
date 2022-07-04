module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  extends: [
    'airbnb-base',
    // 'plugin:jest/recommended',
    'plugin:security/recommended',
  ],
  parserOptions: {
    ecmaVersion: 12,
  },
  plugins: [], // '@typescript-eslint'
  overrides: [
    // only apply TS parser on TS files
    {
      files: ['*.ts'],
      extends: [
        'airbnb-typescript/base',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
      ],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: ['./tsconfig.json'], // Specify it only for TypeScript files
      },
      rules: {
        // typescripts
        '@typescript-eslint/semi': [1, 'never'],
        '@typescript-eslint/strict-boolean-expressions': 0,
        '@typescript-eslint/explicit-module-boundary-types': 0,
      },
    },
  ],
  rules: {
    // 1 is 'warning', 2 is 'error' (error prevents compiling)
    semi: [1, 'never'],
    'comma-dangle': [1, 'always-multiline'],
    'consistent-return': 'warn',
    'import/first': 'off',
    'import/no-extraneous-dependencies': [1, {
      devDependencies: false, optionalDependencies: false, peerDependencies: false,
    }],
    'import/prefer-default-export': 'off',
    'max-classes-per-file': 'off',
    'max-len': [1, { code: 200 }],
    'no-nested-ternary': 'off',
    'no-param-reassign': 'warn',
    'no-plusplus': 'off',
    'no-underscore-dangle': 'off',
    'no-unused-vars': 'warn',
    radix: 'off',
  },
}
