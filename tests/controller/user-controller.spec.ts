import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ZodError } from 'zod'
import { createUserController } from '../../src/controller/user-controller'
import { createUserService } from '../../src/service/user-service'
import { makeReply, makeRequest } from '../helpers/fastify-mocks'

vi.mock('../../src/service/user-service', () => ({
  createUserService: vi.fn(),
}))

const createUserServiceMock = vi.mocked(createUserService)

const body = { name: 'Addam', email: 'addam@mail.com', password: 'senha123' }

describe('createUserController', () => {
  beforeEach(() => {
    createUserServiceMock.mockResolvedValue({ id: 'user-1', ...body } as any)
  })

  it('responde 201 ao criar o usuário', async () => {
    const reply = makeReply()

    await createUserController(makeRequest({ body }), reply)

    expect(reply.statusCode).toBe(201)
  })

  it('devolve o usuário criado no corpo', async () => {
    const reply = makeReply()

    await createUserController(makeRequest({ body }), reply)

    expect(reply.payload).toMatchObject({ id: 'user-1', email: 'addam@mail.com' })
  })

  it('repassa nome, e-mail e senha ao service', async () => {
    await createUserController(makeRequest({ body }), makeReply())

    expect(createUserServiceMock).toHaveBeenCalledWith({
      name: 'Addam',
      email: 'addam@mail.com',
      password: 'senha123',
    })
  })

  it('ignora campos extras do corpo', async () => {
    await createUserController(makeRequest({ body: { ...body, role: 'ADMIN' } }), makeReply())

    expect(createUserServiceMock.mock.calls[0][0]).not.toHaveProperty('role')
  })

  it('rejeita nome vazio', async () => {
    await expect(
      createUserController(makeRequest({ body: { ...body, name: '' } }), makeReply()),
    ).rejects.toThrow(ZodError)
  })

  it('rejeita e-mail inválido', async () => {
    await expect(
      createUserController(makeRequest({ body: { ...body, email: 'invalido' } }), makeReply()),
    ).rejects.toThrow(ZodError)
  })

  it('rejeita senha curta demais', async () => {
    await expect(
      createUserController(makeRequest({ body: { ...body, password: '123' } }), makeReply()),
    ).rejects.toThrow(ZodError)
  })

  it('rejeita corpo vazio', async () => {
    await expect(createUserController(makeRequest({ body: {} }), makeReply())).rejects.toThrow(
      ZodError,
    )
  })

  it('não chama o service quando a validação falha', async () => {
    await createUserController(makeRequest({ body: {} }), makeReply()).catch(() => undefined)

    expect(createUserServiceMock).not.toHaveBeenCalled()
  })

  it('propaga o conflito de e-mail duplicado', async () => {
    createUserServiceMock.mockRejectedValue(
      Object.assign(new Error('Este e-mail já está cadastrado'), { statusCode: 409 }),
    )

    await expect(
      createUserController(makeRequest({ body }), makeReply()),
    ).rejects.toMatchObject({ statusCode: 409 })
  })
})
