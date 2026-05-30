import { authenticate } from "../middleware/autenticate";
import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { createTransactionService, findTransactionService,updateTransactionService } from "../service/transaction-service";
import '@fastify/jwt'

export async function createTransactionController(req: FastifyRequest, reply: FastifyReply) {
  const bodySchema = z.object({
    type: z.enum(['INCOME', 'EXPENSE']),
    description: z.string().nonempty(),
    value: z.number().positive(),
  })

   const { type, description, value } = bodySchema.parse(req.body)

   const userId = (req.user as { id: string }).id

   const result = await createTransactionService({
    type,
    description,
    value,
    userId
   })

   return reply.status(201).send(result)

    
}


export async function findTransactionController(request: FastifyRequest, reply: FastifyReply) {
  const userId = (request.user as { id: string }).id

  const transactions = await findTransactionService(userId)

  return reply.status(200).send(transactions)
}





export async function updateTransactionController(req: FastifyRequest, reply: FastifyReply) {
  
  const paramsSchema = z.object({
    id: z.string().nonempty(),
  })

  const updatebodySchema = z.object({
    type: z.enum(['INCOME', 'EXPENSE']),
    description: z.string().nonempty(),
    value: z.number().positive(),
  })

  const { id } = paramsSchema.parse(req.params)
  const {type,description,value}= updatebodySchema.parse(req.body)
   const userId = (req.user as { id: string }).id

  const updateresult = await updateTransactionService({
      id,
      type,
      description,
      value,
      userId
  })

  return reply.status(200).send(updateresult)


}