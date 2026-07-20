import { FastifyInstance } from 'fastify'
import { loginController } from '../controller/auth-controller'
import { loginSchema } from '../docs/schemas/auth-schema'

export async function authRoutes(app: FastifyInstance) {
    app.post('/auth/login', { schema: loginSchema }, loginController)
}