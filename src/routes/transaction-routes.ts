import { createTransactionController, deleteTransactionController, findTransactionController, updateTransactionController } from '../controller/transaction-controller'
import { FastifyInstance } from 'fastify'
import { authenticate } from '../middleware/autenticate'
import { createTransactionSchema, findTransactionSchema, updateTransactionSchema, deleteTransactionSchema } from '../docs/schemas/transaction-schema'

export async function transactionRoutes(app: FastifyInstance) {
    app.post('/transactions', { preHandler: [authenticate], schema: createTransactionSchema }, createTransactionController)
}

export async function findTransactionRoutes(app: FastifyInstance) {
    app.get('/transactions', { preHandler: [authenticate], schema: findTransactionSchema }, findTransactionController)
}

export async function updateTransactionRoutes(app: FastifyInstance) {
    app.patch('/transactions/:id', { onRequest: [authenticate], schema: updateTransactionSchema }, updateTransactionController)
}

export async function deleteTransactionRoutes(app: FastifyInstance) {
    app.delete('/transactions/:id', { onRequest: [authenticate], schema: deleteTransactionSchema }, deleteTransactionController)
}