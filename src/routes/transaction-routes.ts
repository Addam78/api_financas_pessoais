import { createTransactionController, deleteTransactionController, findTransactionController, updateTransactionController } from '../controller/transaction-controller'
import { FastifyInstance } from 'fastify'
import { authenticate } from '../middleware/autenticate'
import { createTransactionSchema, findTransactionSchema, updateTransactionSchema, deleteTransactionSchema } from '../docs/schemas/transaction-schema'

export async function transactionRoutes(app: FastifyInstance) {
    app.post('/insert', { preHandler: [authenticate], schema: createTransactionSchema }, createTransactionController)
}

export async function findTransactionRoutes(app: FastifyInstance) {
    app.get('/search', { preHandler: [authenticate], schema: findTransactionSchema }, findTransactionController)
}

export async function updateTransactionRoutes(app: FastifyInstance) {
    app.patch('/update/:id', { onRequest: [authenticate], schema: updateTransactionSchema }, updateTransactionController)
}

export async function deleteTransactionRoutes(app: FastifyInstance) {
    app.delete('/delete/:id', { onRequest: [authenticate], schema: deleteTransactionSchema }, deleteTransactionController)
}