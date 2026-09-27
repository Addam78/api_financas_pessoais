import { FastifyInstance } from 'fastify'
import { loginController, logoutController } from '../controller/auth-controller'
import { authenticate } from '../middleware/autenticate'
import { loginSchema, logoutSchema } from '../docs/schemas/auth-schema'

export async function authRoutes(app: FastifyInstance) {
    app.post('/auth/login', { schema: loginSchema }, loginController)
    app.post('/auth/logout', { preHandler: [authenticate], schema: logoutSchema }, logoutController)
}