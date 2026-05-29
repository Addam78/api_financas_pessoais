import {createTransactionController} from '../controller/transaction-controller'
import { FastifyInstance } from 'fastify'
import { authenticate } from '../middleware/autenticate'

export async function transactionRoutes(app: FastifyInstance) {
    app.post('/insert',{preHandler: [authenticate]},createTransactionController)
}