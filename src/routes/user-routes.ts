import { createUserController} from "../controller/user-controller";
import { FastifyInstance } from 'fastify'

export async function userRoutes(app:FastifyInstance) {
    app.post('/create',createUserController)
    
}