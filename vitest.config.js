import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['tests/{unit,integration}/**/*.test.js'], // unit + integration tests
    coverage: {
      reporter: ['text', 'json', 'html'],
      include: ['src/**'], // focus coverage only on backend source files
      exclude: [
        '**/node_modules/**',
        'server.js',
        'vitest.config.js',
        'public/**', // frontend files not tested yet
      ],
    },
  },
});