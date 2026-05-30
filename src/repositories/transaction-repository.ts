// src/repositories/transactions-repository.ts

import { prisma } from '../lib/prisma'

interface CreateTransactionData {
  type: 'INCOME' | 'EXPENSE'
  description: string
  value: number
  userId: string
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