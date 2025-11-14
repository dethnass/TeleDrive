module.exports = {
  root: true,
  env: {
    node: true
  },
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
  ],
  extends: [
    'eslint:recommended',
    // 'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  rules: {
    '@typescript-eslint/naming-convention': [
      'error',
      {
        'selector': 'variable',
        'format': ['camelCase', 'UPPER_CASE', 'PascalCase'],
        'leadingUnderscore': 'allow'
      },
      {
        'selector': 'typeLike',
        'format': ['PascalCase']
      }
    ],
    // Note: These rules were deprecated in @typescript-eslint v6-v8 and replaced with ESLint core equivalents
    'indent': [
      'error',
      2
    ],
    '@typescript-eslint/prefer-namespace-keyword': 'error',
    'quotes': [
      'error',
      'single',
      {
        'avoidEscape': true
      }
    ],
    'semi': [
      'error',
      'never'
    ],
    // '@typescript-eslint/type-annotation-spacing': 'error', // Deprecated in v6+
    // '@typescript-eslint/member-delimiter-style': removed in favor of formatter
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        'vars': 'all',
        'args': 'all',
        'varsIgnorePattern': '^\_.*$',
        'argsIgnorePattern': '^\_.*$',
      }
    ],
    // '@typescript-eslint/no-extra-parens': 'error', // Deprecated
    // '@typescript-eslint/brace-style': 'error', // Deprecated
    '@typescript-eslint/no-use-before-define': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-namespace': 'off',
    '@typescript-eslint/no-inferrable-types': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/no-empty-interface': 'off',
    'no-null/no-null': 'off',
    'no-useless-escape': 'off',
    'no-trailing-spaces': 'error',
    'no-var': 'error',
    'prefer-const': 'error',
    'spaced-comment': 'error',
    'object-curly-spacing': ['error', 'always'],
    'space-in-parens': ['error', 'never'],
    'array-bracket-spacing': ['error', 'never'],
    'space-before-function-paren': [
      'error',
      {
        'named': 'never',
        'anonymous': 'always',
        'asyncArrow': 'always'
      }
    ],
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/no-require-imports': 'off',
    'no-unsafe-optional-chaining': 'warn' // Downgrade to warning
  }
}