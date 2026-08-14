import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['tests/**/*.spec.ts'],
    exclude: ['**/node_modules/**', 'test/**'],
    environment: 'node',
    clearMocks: true,
    coverage: {
      include: ['src/**/*.ts'],
      exclude: ['src/generated/**', 'src/docs/**', 'src/@types/**', 'src/server.ts'],
    },
  },
})
