import { FastifyInstance } from 'fastify'
import { loginController } from '../controller/auth-controller'

export async function authRoutes(app: FastifyInstance) {
  app.post('/login', loginController)
}