import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'
import prettier from 'eslint-plugin-prettier'
import prettierConfig from 'eslint-config-prettier'

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
  ]),
  // Prettier integration (add this after Next.js configs)
  {
    plugins: {
      prettier,
    },
    rules: {
      // Run Prettier as ESLint rule → violations show as errors
      'prettier/prettier': 'error',

      // Turn off all rules that conflict with Prettier
      ...prettierConfig.rules,
    },
  },
])

export default eslintConfig
