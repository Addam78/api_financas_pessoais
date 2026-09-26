import fastify from 'fastify'
import { describe, expect, it } from 'vitest'
import { healthRoutes } from '../../src/routes/health-routes'

describe('rotas de sistema', () => {
  it('GET /health responde 200 com status ok, sem autenticação', async () => {
    const app = fastify()
    app.register(healthRoutes)

    const response = await app.inject({ method: 'GET', url: '/health' })

    expect(response.statusCode).toBe(200)
    expect(response.json()).toEqual({ status: 'ok' })
  })

  it('GET / redireciona para /docs', async () => {
    const app = fastify()
    app.register(healthRoutes)

    const response = await app.inject({ method: 'GET', url: '/' })

    expect(response.statusCode).toBe(302)
    expect(response.headers.location).toBe('/docs')
  })
})
