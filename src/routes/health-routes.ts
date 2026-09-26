import { FastifyInstance } from 'fastify'
import { healthSchema } from '../docs/schemas/health-schema'

export async function healthRoutes(app: FastifyInstance) {
  app.get('/health', { schema: healthSchema }, async () => ({ status: 'ok' }))
}
