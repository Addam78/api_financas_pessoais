// src/repositories/transactions-repository.ts

import { prisma } from '../lib/prisma'

interface CreateTransactionData {
  type: 'INCOME' | 'EXPENSE'
  description: string
  value: number
  userId: string
}

interface UpdateTransactionData {
  id: string
  type: 'INCOME' | 'EXPENSE'
  description: string
  value: number
  userId : string
}

export async function createTransaction(data: CreateTransactionData) {
  const transaction = await prisma.transactions.create({
    data: {
      type: data.type,
      description: data.description,
      value: data.value,
      userId: data.userId,
    },
  })

  return transaction
}

export async function findTransaction(userId:string) {
    const transaction = await prisma.transactions.findMany({
      where: {
        userId,
      },
      select:{
        description:true,
        type: true,
        value: true
      }
    })

    return transaction
}

export async function updateTransaction(data:UpdateTransactionData) {
    const updtateTransaction = await prisma.transactions.update({
      where : {
        id: data.id,
        userId:data.userId
      },
      data: {
      type: data.type,
      description: data.description,
      value: data.value,
    },
  })

  return updtateTransaction
}