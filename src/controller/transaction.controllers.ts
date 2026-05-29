import { authenticate } from "../middleware/autenticate";
import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { createTransactionService } from "../service/transaction-services";
import '@fastify/jwt'

export async function createTransactionController(req: FastifyRequest, reply: FastifyReply) {
  const bodySchema = z.object({
    type: z.enum(['INCOME', 'EXPENSE']),
    description: z.string().nonempty(),
    value: z.number().positive(),
  })

   const { type, description, value } = bodySchema.parse(req.body)

   const userId = req.user.id

   const result = await createTransactionService({
    type,
    description,
    value,
    userId
   })

   return reply.status(201).send(result)

    
}