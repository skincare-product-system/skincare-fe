import globals from 'globals'
import pluginJs from '@eslint/js'
import pluginReact from 'eslint-plugin-react'

export default [
  { files: ['src/**/*.{js,jsx}'] },
  {
    languageOptions: {
      globals: {
        ...globals.browser
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      }
    }
  },
  {
    ignores: ['node_modules/', 'dist/', 'build/']
  },
  pluginJs.configs.recommended,
  pluginReact.configs.flat.recommended,

  {
    rules: {
      'no-unused-vars': 'warn',
      'react/jsx-uses-vars': 'warn',
      'react/jsx-uses-react': 'warn'
    }
  },
  {
    settings: {
      react: {
        version: 'detect'
      }
    }
  }
]
