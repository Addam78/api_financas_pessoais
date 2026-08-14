import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ZodError } from 'zod'
import {
  createTransactionController,
  deleteTransactionController,
  findTransactionController,
  updateTransactionController,
} from '../../src/controller/transaction-controller'
import {
  createTransactionService,
  deleteTransactionService,
  findTransactionService,
  updateTransactionService,
} from '../../src/service/transaction-service'
import { makeReply, makeRequest } from '../helpers/fastify-mocks'

vi.mock('../../src/service/transaction-service', () => ({
  createTransactionService: vi.fn(),
  findTransactionService: vi.fn(),
  updateTransactionService: vi.fn(),
  deleteTransactionService: vi.fn(),
}))

const createServiceMock = vi.mocked(createTransactionService)
const findServiceMock = vi.mocked(findTransactionService)
const updateServiceMock = vi.mocked(updateTransactionService)
const deleteServiceMock = vi.mocked(deleteTransactionService)

const user = { id: 'user-1' }
const body = { type: 'INCOME' as const, description: 'Salário', value: 5000 }

describe('createTransactionController', () => {
  beforeEach(() => {
    createServiceMock.mockResolvedValue({ id: 'tx-1', ...body, userId: 'user-1' } as any)
  })

  it('responde 201 com a transação criada', async () => {
    const reply = makeReply()

    await createTransactionController(makeRequest({ body, user }), reply)

    expect(reply.statusCode).toBe(201)
    expect(reply.payload).toMatchObject({ id: 'tx-1' })
  })

  it('usa o userId do token, não do corpo', async () => {
    await createTransactionController(
      makeRequest({ body: { ...body, userId: 'outro-usuario' }, user }),
      makeReply(),
    )

    expect(createServiceMock).toHaveBeenCalledWith(expect.objectContaining({ userId: 'user-1' }))
  })

  it('repassa tipo, descrição e valor', async () => {
    await createTransactionController(makeRequest({ body, user }), makeReply())

    expect(createServiceMock).toHaveBeenCalledWith({
      type: 'INCOME',
      description: 'Salário',
      value: 5000,
      userId: 'user-1',
    })
  })

  it('rejeita valor zero', async () => {
    await expect(
      createTransactionController(makeRequest({ body: { ...body, value: 0 }, user }), makeReply()),
    ).rejects.toThrow(ZodError)
  })

  it('rejeita valor negativo', async () => {
    await expect(
      createTransactionController(makeRequest({ body: { ...body, value: -1 }, user }), makeReply()),
    ).rejects.toThrow(ZodError)
  })

  it('rejeita tipo inválido', async () => {
    await expect(
      createTransactionController(
        makeRequest({ body: { ...body, type: 'TRANSFER' }, user }),
        makeReply(),
      ),
    ).rejects.toThrow(ZodError)
  })

  it('rejeita descrição vazia', async () => {
    await expect(
      createTransactionController(
        makeRequest({ body: { ...body, description: '' }, user }),
        makeReply(),
      ),
    ).rejects.toThrow(ZodError)
  })

  it('não chama o service quando a validação falha', async () => {
    await createTransactionController(makeRequest({ body: {}, user }), makeReply()).catch(
      () => undefined,
    )

    expect(createServiceMock).not.toHaveBeenCalled()
  })
})

describe('findTransactionController', () => {
  it('responde 200 com a lista do usuário autenticado', async () => {
    const rows = [{ id: 'tx-1', description: 'Salário', type: 'INCOME', value: 5000 }]
    findServiceMock.mockResolvedValue(rows as any)
    const reply = makeReply()

    await findTransactionController(makeRequest({ user }), reply)

    expect(reply.statusCode).toBe(200)
    expect(reply.payload).toBe(rows)
  })

  it('consulta apenas as transações do usuário do token', async () => {
    findServiceMock.mockResolvedValue([] as any)

    await findTransactionController(makeRequest({ user: { id: 'user-42' } }), makeReply())

    expect(findServiceMock).toHaveBeenCalledWith('user-42')
  })

  it('responde 200 com lista vazia', async () => {
    findServiceMock.mockResolvedValue([] as any)
    const reply = makeReply()

    await findTransactionController(makeRequest({ user }), reply)

    expect(reply.payload).toEqual([])
  })
})

describe('updateTransactionController', () => {
  beforeEach(() => {
    updateServiceMock.mockResolvedValue({ id: 'tx-1', ...body, userId: 'user-1' } as any)
  })

  it('responde 200 com a transação atualizada', async () => {
    const reply = makeReply()

    await updateTransactionController(makeRequest({ params: { id: 'tx-1' }, body, user }), reply)

    expect(reply.statusCode).toBe(200)
    expect(reply.payload).toMatchObject({ id: 'tx-1' })
  })

  it('combina id dos params com userId do token', async () => {
    await updateTransactionController(
      makeRequest({ params: { id: 'tx-1' }, body, user }),
      makeReply(),
    )

    expect(updateServiceMock).toHaveBeenCalledWith({
      id: 'tx-1',
      type: 'INCOME',
      description: 'Salário',
      value: 5000,
      userId: 'user-1',
    })
  })

  it('rejeita id vazio nos params', async () => {
    await expect(
      updateTransactionController(makeRequest({ params: { id: '' }, body, user }), makeReply()),
    ).rejects.toThrow(ZodError)
  })

  it('rejeita valor não positivo', async () => {
    await expect(
      updateTransactionController(
        makeRequest({ params: { id: 'tx-1' }, body: { ...body, value: 0 }, user }),
        makeReply(),
      ),
    ).rejects.toThrow(ZodError)
  })

  it('propaga o 404 vindo do service', async () => {
    updateServiceMock.mockRejectedValue(
      Object.assign(new Error('Transação não encontrada'), { statusCode: 404 }),
    )

    await expect(
      updateTransactionController(makeRequest({ params: { id: 'tx-1' }, body, user }), makeReply()),
    ).rejects.toMatchObject({ statusCode: 404 })
  })
})

describe('deleteTransactionController', () => {
  beforeEach(() => {
    deleteServiceMock.mockResolvedValue({ id: 'tx-1', description: 'Salário' } as any)
  })

  it('responde 200 ao deletar', async () => {
    const reply = makeReply()

    await deleteTransactionController(makeRequest({ params: { id: 'tx-1' }, user }), reply)

    expect(reply.statusCode).toBe(200)
  })

  it('inclui descrição e id na mensagem de confirmação', async () => {
    const reply = makeReply()

    await deleteTransactionController(makeRequest({ params: { id: 'tx-1' }, user }), reply)

    expect((reply.payload as any).message).toBe(
      'Transação "Salário" (ID: tx-1) deletada com sucesso.',
    )
  })

  it('deleta escopado ao usuário do token', async () => {
    await deleteTransactionController(
      makeRequest({ params: { id: 'tx-1' }, user: { id: 'user-42' } }),
      makeReply(),
    )

    expect(deleteServiceMock).toHaveBeenCalledWith({ id: 'tx-1', userId: 'user-42' })
  })

  it('rejeita id vazio', async () => {
    await expect(
      deleteTransactionController(makeRequest({ params: { id: '' }, user }), makeReply()),
    ).rejects.toThrow(ZodError)
  })

  it('propaga o 404 vindo do service', async () => {
    deleteServiceMock.mockRejectedValue(
      Object.assign(new Error('Transação não encontrada'), { statusCode: 404 }),
    )

    await expect(
      deleteTransactionController(makeRequest({ params: { id: 'tx-1' }, user }), makeReply()),
    ).rejects.toMatchObject({ statusCode: 404 })
  })
})
