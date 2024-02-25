/// <reference types="vitest" />
import { defineConfig } from 'vite';
import { configDefaults } from 'vitest/config';
import viteTsConfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [viteTsConfigPaths()],
  test: {
    include: ['**/*.spec.ts'],
    coverage: {
      exclude: [
        ...(configDefaults.coverage.exclude ?? []),
        'libs/ui/*',
        'apps/*',
        '**/index.ts',
      ],
    },
  },
});
