import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ZodError } from 'zod'
import {
  createTransactionService,
  deleteTransactionService,
  findTransactionService,
  updateTransactionService,
} from '../../src/service/transaction-service'
import {
  createTransaction,
  deleteTransaction,
  findTransaction,
  updateTransaction,
} from '../../src/repositories/transaction-repository'

vi.mock('../../src/repositories/transaction-repository', () => ({
  createTransaction: vi.fn(),
  findTransaction: vi.fn(),
  updateTransaction: vi.fn(),
  deleteTransaction: vi.fn(),
}))

const createTransactionMock = vi.mocked(createTransaction)
const findTransactionMock = vi.mocked(findTransaction)
const updateTransactionMock = vi.mocked(updateTransaction)
const deleteTransactionMock = vi.mocked(deleteTransaction)

const validCreate = {
  type: 'INCOME' as const,
  description: 'Salário',
  value: 5000,
  userId: 'user-1',
}

const validUpdate = { id: 'tx-1', ...validCreate }

describe('createTransactionService', () => {
  beforeEach(() => {
    createTransactionMock.mockImplementation(async (data: any) => ({ id: 'tx-1', ...data }))
  })

  it('cria a transação e devolve o registro', async () => {
    await expect(createTransactionService(validCreate)).resolves.toMatchObject({ id: 'tx-1' })
  })

  it('repassa exatamente os campos validados ao repositório', async () => {
    await createTransactionService(validCreate)

    expect(createTransactionMock).toHaveBeenCalledWith({
      type: 'INCOME',
      description: 'Salário',
      value: 5000,
      userId: 'user-1',
    })
  })

  it('ignora campos extras não previstos no schema', async () => {
    await createTransactionService({ ...validCreate, hacker: true } as any)

    expect(createTransactionMock.mock.calls[0][0]).not.toHaveProperty('hacker')
  })

  it('aceita o tipo EXPENSE', async () => {
    await expect(
      createTransactionService({ ...validCreate, type: 'EXPENSE' }),
    ).resolves.toBeDefined()
  })

  it('rejeita tipo desconhecido', async () => {
    await expect(createTransactionService({ ...validCreate, type: 'OUTRO' as any })).rejects.toThrow(
      ZodError,
    )
  })

  it('rejeita descrição vazia', async () => {
    await expect(createTransactionService({ ...validCreate, description: '' })).rejects.toThrow(
      ZodError,
    )
  })

  it('rejeita userId vazio', async () => {
    await expect(createTransactionService({ ...validCreate, userId: '' })).rejects.toThrow(ZodError)
  })

  it('rejeita value não numérico', async () => {
    await expect(createTransactionService({ ...validCreate, value: '100' as any })).rejects.toThrow(
      ZodError,
    )
  })

  it('aceita valor negativo (regra de sinal fica no controller)', async () => {
    await expect(createTransactionService({ ...validCreate, value: -10 })).resolves.toBeDefined()
  })

  it('não chama o repositório quando a validação falha', async () => {
    await createTransactionService({ ...validCreate, description: '' }).catch(() => undefined)

    expect(createTransactionMock).not.toHaveBeenCalled()
  })
})

describe('findTransactionService', () => {
  it('devolve a lista retornada pelo repositório', async () => {
    const rows = [{ id: 'tx-1', description: 'Salário', type: 'INCOME', value: 5000 }]
    findTransactionMock.mockResolvedValue(rows as any)

    await expect(findTransactionService('user-1')).resolves.toBe(rows)
  })

  it('consulta pelo userId informado', async () => {
    findTransactionMock.mockResolvedValue([] as any)

    await findTransactionService('user-42')

    expect(findTransactionMock).toHaveBeenCalledWith('user-42')
  })

  it('devolve lista vazia quando não há transações', async () => {
    findTransactionMock.mockResolvedValue([] as any)

    await expect(findTransactionService('user-1')).resolves.toEqual([])
  })

  it('propaga erro do repositório', async () => {
    findTransactionMock.mockRejectedValue(new Error('db offline'))

    await expect(findTransactionService('user-1')).rejects.toThrow('db offline')
  })
})

describe('updateTransactionService', () => {
  beforeEach(() => {
    updateTransactionMock.mockImplementation(async (data: any) => data)
  })

  it('atualiza e devolve o registro', async () => {
    await expect(updateTransactionService(validUpdate)).resolves.toMatchObject({ id: 'tx-1' })
  })

  it('repassa id e userId ao repositório (escopo do dono)', async () => {
    await updateTransactionService(validUpdate)

    expect(updateTransactionMock).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'tx-1', userId: 'user-1' }),
    )
  })

  it('rejeita id vazio', async () => {
    await expect(updateTransactionService({ ...validUpdate, id: '' })).rejects.toThrow(ZodError)
  })

  it('rejeita userId vazio', async () => {
    await expect(updateTransactionService({ ...validUpdate, userId: '' })).rejects.toThrow(ZodError)
  })

  it('rejeita tipo inválido', async () => {
    await expect(updateTransactionService({ ...validUpdate, type: 'X' as any })).rejects.toThrow(
      ZodError,
    )
  })

  it('propaga AppError 404 vindo do repositório', async () => {
    updateTransactionMock.mockRejectedValue(
      Object.assign(new Error('Transação não encontrada'), { statusCode: 404 }),
    )

    await expect(updateTransactionService(validUpdate)).rejects.toMatchObject({ statusCode: 404 })
  })
})

describe('deleteTransactionService', () => {
  beforeEach(() => {
    deleteTransactionMock.mockImplementation(async (data: any) => ({
      ...data,
      description: 'Salário',
    }))
  })

  it('deleta e devolve o registro removido', async () => {
    await expect(deleteTransactionService({ id: 'tx-1', userId: 'user-1' })).resolves.toMatchObject({
      id: 'tx-1',
    })
  })

  it('repassa id e userId ao repositório', async () => {
    await deleteTransactionService({ id: 'tx-1', userId: 'user-1' })

    expect(deleteTransactionMock).toHaveBeenCalledWith({ id: 'tx-1', userId: 'user-1' })
  })

  it('rejeita id vazio', async () => {
    await expect(deleteTransactionService({ id: '', userId: 'user-1' })).rejects.toThrow(ZodError)
  })

  it('rejeita userId vazio', async () => {
    await expect(deleteTransactionService({ id: 'tx-1', userId: '' })).rejects.toThrow(ZodError)
  })

  it('não chama o repositório quando a validação falha', async () => {
    await deleteTransactionService({ id: '', userId: '' }).catch(() => undefined)

    expect(deleteTransactionMock).not.toHaveBeenCalled()
  })
})
