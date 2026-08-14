import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['test/**/*.e2e-spec.ts'],
    environment: 'node',
    setupFiles: ['./test/setup-e2e.ts'],
    // Cada arquivo roda em um schema próprio; sem isolate o setup não reexecuta.
    isolate: true,
    testTimeout: 30_000,
    hookTimeout: 60_000,
  },
})
