import {createTransactionController, findTransactionController,updateTransactionController} from '../controller/transaction-controller'
import { FastifyInstance } from 'fastify'
import { authenticate } from '../middleware/autenticate'

export async function transactionRoutes(app: FastifyInstance) {
    app.post('/insert',{preHandler: [authenticate]},createTransactionController)
}

export async function findTransactionRoutes(app: FastifyInstance) {
    app.get('/search',{preHandler:[authenticate]},findTransactionController)
    
}

export async function updateTransactionRoutes(app:FastifyInstance) {
    app.patch('/update/:id',{onRequest:[authenticate]} ,updateTransactionController)
}