import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
});

module.exports = [
  ...compat.config({
    extends: [
      'next',
      'next/core-web-vitals',
      'eslint:recommended',
      'plugin:prettier/recommended',
    ],
  }),
];
