import {z} from 'zod'
import { createTransaction, findTransaction,updateTransaction } from '../repositories/transaction-repository'
 

const createUserBodySchema = z.object({
            type: z.enum(['INCOME','EXPENSE']),
            description: z.string().nonempty(),
            value:z.number(),
            userId:z.string().nonempty()
        })

type CreateTransactionRequest = z.infer<typeof createUserBodySchema >   


const updateTransactionSchema = z.object({
  id: z.string().nonempty(),
  type: z.enum(['INCOME', 'EXPENSE']),
  description: z.string().nonempty(),
  value: z.number(),
  userId: z.string().nonempty()
})

type UpdateTransactionRequest = z.infer<typeof updateTransactionSchema>

export async function createTransactionService(data: CreateTransactionRequest) {
  const parsed = createUserBodySchema.parse(data)

  const transaction = await createTransaction({
    type: parsed.type,
    description: parsed.description,
    value: parsed.value,
    userId: parsed.userId,
  })

  return transaction
}


export async function findTransactionService(userId: string) {
  const transactions = await findTransaction(userId)
  return transactions
}

export async function updateTransactionService (data: UpdateTransactionRequest) {
  const parsed = updateTransactionSchema.parse(data)
  const transaction = await updateTransaction(parsed)
  return transaction
} 