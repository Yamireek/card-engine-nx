// vitest.workspace.ts
import { defineWorkspace } from 'vitest/config';

export default defineWorkspace([
  {
    extends: './vite.config.ts',
    test: {
      name: 'spec',
      include: ['{apps,libs}/**/*.spec.ts'],
      environment: 'node',
    },
  },
]);
