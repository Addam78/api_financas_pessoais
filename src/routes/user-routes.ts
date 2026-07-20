import { createUserController } from "../controller/user-controller";
import { FastifyInstance } from 'fastify'
import { createUserSchema } from '../docs/schemas/user-schema'

export async function userRoutes(app: FastifyInstance) {
    app.post('/users', { schema: createUserSchema }, createUserController)
}