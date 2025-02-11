import js from '@eslint/js'
import imports from 'eslint-plugin-import'
import eslintPluginPrettier from 'eslint-plugin-prettier'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import globals from 'globals'

export default [
  { ignores: ['dist', 'build', 'node_modules'] },
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021
      },
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: {
          jsx: true,
          impliedStrict: true
        },
        sourceType: 'module'
      }
    },
    settings: {
      react: {
        version: 'detect',
        componentWrapperFunctions: ['styled']
      },
      'import/resolver': {
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
          moduleDirectory: ['node_modules', 'src/']
        }
      }
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      prettier: eslintPluginPrettier,
      import: imports
    },
    rules: {
      // Base configurations
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      ...reactHooks.configs.recommended.rules,
      ...eslintPluginPrettier.configs.recommended.rules,

      // React specific rules
      'react/jsx-no-target-blank': ['warn', { enforceDynamicLinks: 'always' }],
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx', '.ts', '.tsx'] }],
      'react/function-component-definition': [
        2,
        {
          namedComponents: ['arrow-function', 'function-declaration'],
          unnamedComponents: ['arrow-function']
        }
      ],
      'react/jsx-props-no-spreading': 'off',
      'react/no-unknown-property': ['error', { ignore: ['css'] }],

      // React Hooks rules
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // React Refresh rules
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],

      // Import rules
      'import/prefer-default-export': 'off',
      'import/no-extraneous-dependencies': 'off',
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          'newlines-between': 'always',
          alphabetize: { order: 'asc' }
        }
      ],

      // Prettier configuration
      'prettier/prettier': [
        'error',
        {
          endOfLine: 'auto',
          singleQuote: true,
          tabWidth: 2
        }
      ],

      // General rules
      'no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_'
        }
      ],
      'no-console': ['warn', { allow: ['warn', 'error'] }]
    }
  }
]
