import {z} from 'zod'
import { createTransaction, findTransaction,updateTransaction, deleteTransaction } from '../repositories/transaction-repository'
import { tr } from 'zod/v4/locales'
 

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




const deleteTransactionSchema = z.object({
  id: z.string().nonempty(),
  userId: z.string().nonempty()
})

type DeleteTransactionRequest = z.infer<typeof deleteTransactionSchema>



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

export async function deleteTransactionService(data:DeleteTransactionRequest) {
  const parsed = deleteTransactionSchema.parse(data)
  const transaction = await deleteTransaction(parsed)
    return transaction
  
}