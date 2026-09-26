import fastify from 'fastify'
import { describe, expect, it } from 'vitest'
import { healthRoutes } from '../../src/routes/health-routes'

describe('GET /health', () => {
  it('responde 200 com status ok, sem autenticação', async () => {
    const app = fastify()
    app.register(healthRoutes)

    const response = await app.inject({ method: 'GET', url: '/health' })

    expect(response.statusCode).toBe(200)
    expect(response.json()).toEqual({ status: 'ok' })
  })
})
