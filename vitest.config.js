import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['tests/{unit,integration}/**/*.test.js'], // Includes both unit and integration tests
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: ['**/node_modules/**'],
    },
  },
});