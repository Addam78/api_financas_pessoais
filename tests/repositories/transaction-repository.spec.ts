import { describe, expect, it, vi } from 'vitest'
import { Prisma } from '../../src/generated/prisma/client'
import { prisma } from '../../src/lib/prisma'
import {
  createTransaction,
  deleteTransaction,
  findTransaction,
  updateTransaction,
} from '../../src/repositories/transaction-repository'
import { AppError } from '../../src/errors/app-error'

vi.mock('../../src/lib/prisma', () => ({
  prisma: {
    transactions: {
      create: vi.fn(),
      findMany: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}))

const prismaMock = vi.mocked(prisma, true)

function knownRequestError(code: string) {
  return new Prisma.PrismaClientKnownRequestError('erro', {
    code,
    clientVersion: '7.8.0',
  })
}

const data = {
  type: 'INCOME' as const,
  description: 'Salário',
  value: 5000,
  userId: 'user-1',
}

describe('createTransaction', () => {
  it('persiste todos os campos da transação', async () => {
    prismaMock.transactions.create.mockResolvedValue({ id: 'tx-1', ...data } as any)

    await createTransaction(data)

    expect(prismaMock.transactions.create).toHaveBeenCalledWith({ data })
  })

  it('devolve a transação criada', async () => {
    const created = { id: 'tx-1', ...data }
    prismaMock.transactions.create.mockResolvedValue(created as any)

    await expect(createTransaction(data)).resolves.toBe(created)
  })
})

describe('findTransaction', () => {
  it('filtra pelo userId e seleciona apenas os campos públicos', async () => {
    prismaMock.transactions.findMany.mockResolvedValue([] as any)

    await findTransaction('user-1')

    expect(prismaMock.transactions.findMany).toHaveBeenCalledWith({
      where: { userId: 'user-1' },
      select: { id: true, description: true, type: true, value: true },
    })
  })

  it('não expõe o userId no select', async () => {
    prismaMock.transactions.findMany.mockResolvedValue([] as any)

    await findTransaction('user-1')

    const { select } = prismaMock.transactions.findMany.mock.calls[0][0] as any
    expect(select).not.toHaveProperty('userId')
  })

  it('devolve a lista do prisma', async () => {
    const rows = [{ id: 'tx-1', description: 'Salário', type: 'INCOME', value: 5000 }]
    prismaMock.transactions.findMany.mockResolvedValue(rows as any)

    await expect(findTransaction('user-1')).resolves.toBe(rows)
  })
})

describe('updateTransaction', () => {
  const input = { id: 'tx-1', ...data }

  it('restringe o update ao id e ao dono', async () => {
    prismaMock.transactions.update.mockResolvedValue(input as any)

    await updateTransaction(input)

    expect(prismaMock.transactions.update).toHaveBeenCalledWith({
      where: { id: 'tx-1', userId: 'user-1' },
      data: { type: 'INCOME', description: 'Salário', value: 5000 },
    })
  })

  it('não permite trocar o userId da transação', async () => {
    prismaMock.transactions.update.mockResolvedValue(input as any)

    await updateTransaction(input)

    const call = prismaMock.transactions.update.mock.calls[0][0] as any
    expect(call.data).not.toHaveProperty('userId')
  })

  it('converte P2025 em AppError 404', async () => {
    prismaMock.transactions.update.mockRejectedValue(knownRequestError('P2025'))

    await expect(updateTransaction(input)).rejects.toMatchObject({
      message: 'Transação não encontrada',
      statusCode: 404,
    })
  })

  it('propaga erros genéricos', async () => {
    const boom = new Error('db offline')
    prismaMock.transactions.update.mockRejectedValue(boom)

    await expect(updateTransaction(input)).rejects.toBe(boom)
  })

  it('não converte outros códigos do Prisma em AppError', async () => {
    prismaMock.transactions.update.mockRejectedValue(knownRequestError('P2002'))

    await expect(updateTransaction(input)).rejects.not.toBeInstanceOf(AppError)
  })
})

describe('deleteTransaction', () => {
  const input = { id: 'tx-1', userId: 'user-1' }

  it('restringe o delete ao id e ao dono', async () => {
    prismaMock.transactions.delete.mockResolvedValue({ id: 'tx-1' } as any)

    await deleteTransaction(input)

    expect(prismaMock.transactions.delete).toHaveBeenCalledWith({
      where: { id: 'tx-1', userId: 'user-1' },
    })
  })

  it('devolve a transação removida', async () => {
    const removed = { id: 'tx-1', description: 'Salário' }
    prismaMock.transactions.delete.mockResolvedValue(removed as any)

    await expect(deleteTransaction(input)).resolves.toBe(removed)
  })

  it('converte P2025 em AppError 404', async () => {
    prismaMock.transactions.delete.mockRejectedValue(knownRequestError('P2025'))

    await expect(deleteTransaction(input)).rejects.toMatchObject({
      message: 'Transação não encontrada',
      statusCode: 404,
    })
  })

  it('propaga erros genéricos', async () => {
    const boom = new Error('db offline')
    prismaMock.transactions.delete.mockRejectedValue(boom)

    await expect(deleteTransaction(input)).rejects.toBe(boom)
  })
})
