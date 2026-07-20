// src/repositories/transactions-repository.ts

import { prisma } from '../lib/prisma'
import { Prisma } from '../generated/prisma/client'
import { AppError } from '../errors/app-error'

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

interface DeleteTransaction {
  id: string
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
        id: true,
        description:true,
        type: true,
        value: true
      }
    })

    return transaction
}

export async function updateTransaction(data:UpdateTransactionData) {
  try {
    return await prisma.transactions.update({
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
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      throw new AppError('Transação não encontrada', 404)
    }
    throw error
  }
}


export async function deleteTransaction(data:DeleteTransaction) {
  try {
    return await prisma.transactions.delete({
      where : {
        id: data.id,
        userId:data.userId
      },
    })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      throw new AppError('Transação não encontrada', 404)
    }
    throw error
  }
}