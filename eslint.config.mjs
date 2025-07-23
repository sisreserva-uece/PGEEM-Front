import antfu from '@antfu/eslint-config';
import nextPlugin from '@next/eslint-plugin-next';
import jestDom from 'eslint-plugin-jest-dom';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import playwright from 'eslint-plugin-playwright';
import testingLibrary from 'eslint-plugin-testing-library';

export default antfu({
  react: true,
  typescript: true,
  lessOpinionated: true,
  isInEditor: false,
  stylistic: {
    semi: true,
  },
  formatters: {
    css: true,
  },
  ignores: [
    'migrations/**/*',
    'next-env.d.ts',
  ],
}, jsxA11y.flatConfigs.recommended, {
  plugins: {
    '@next/next': nextPlugin,
  },
  rules: {
    ...nextPlugin.configs.recommended.rules,
    ...nextPlugin.configs['core-web-vitals'].rules,
  },
}, {
  files: [
    '**/*.test.ts?(x)',
  ],
  ...testingLibrary.configs['flat/react'],
  ...jestDom.configs['flat/recommended'],
}, {
  files: [
    '**/*.spec.ts',
    '**/*.e2e.ts',
  ],
  ...playwright.configs['flat/recommended'],
}, {
  rules: {
    'antfu/no-top-level-await': 'off',
    'style/brace-style': ['error', '1tbs'],
    'ts/consistent-type-definitions': ['error', 'type'],
    'react/prefer-destructuring-assignment': 'off',
    'node/prefer-global/process': 'off',
    'test/padding-around-all': 'error',
    'test/prefer-lowercase-title': 'off',
  },
});
