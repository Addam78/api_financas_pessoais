import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ZodError } from 'zod'
import { loginController } from '../../src/controller/auth-controller'
import { authenticateUser } from '../../src/service/auth-service'
import { makeReply, makeRequest } from '../helpers/fastify-mocks'

vi.mock('../../src/service/auth-service', () => ({
  authenticateUser: vi.fn(),
}))

const authenticateUserMock = vi.mocked(authenticateUser)

const credentials = { email: 'addam@mail.com', password: 'senha123' }

describe('loginController', () => {
  beforeEach(() => {
    authenticateUserMock.mockResolvedValue({ id: 'user-1', email: 'addam@mail.com' } as any)
  })

  afterEach(() => {
    delete process.env.NODE_ENV
  })

  it('autentica com o e-mail e a senha do corpo', async () => {
    await loginController(makeRequest({ body: credentials }), makeReply())

    expect(authenticateUserMock).toHaveBeenCalledWith('addam@mail.com', 'senha123')
  })

  it('assina o token com id e e-mail do usuário', async () => {
    const req = makeRequest({ body: credentials })

    await loginController(req, makeReply())

    expect(req.server.jwt.sign).toHaveBeenCalledWith({ id: 'user-1', email: 'addam@mail.com' })
  })

  it('responde com mensagem e token', async () => {
    const reply = makeReply()

    await loginController(makeRequest({ body: credentials }), reply)

    expect(reply.payload).toEqual({ message: 'login realizado', token: 'fake-jwt-token' })
  })

  it('grava o token em cookie httpOnly', async () => {
    const reply = makeReply()

    await loginController(makeRequest({ body: credentials }), reply)

    expect(reply.cookies[0]).toMatchObject({
      name: 'token',
      value: 'fake-jwt-token',
      options: { httpOnly: true, path: '/', sameSite: 'lax' },
    })
  })

  it('marca o cookie como secure em produção', async () => {
    process.env.NODE_ENV = 'production'
    const reply = makeReply()

    await loginController(makeRequest({ body: credentials }), reply)

    expect((reply.cookies[0].options as any).secure).toBe(true)
  })

  it('não marca o cookie como secure fora de produção', async () => {
    process.env.NODE_ENV = 'development'
    const reply = makeReply()

    await loginController(makeRequest({ body: credentials }), reply)

    expect((reply.cookies[0].options as any).secure).toBe(false)
  })

  it('rejeita corpo sem e-mail', async () => {
    await expect(
      loginController(makeRequest({ body: { password: 'senha123' } }), makeReply()),
    ).rejects.toThrow(ZodError)
  })

  it('rejeita senha com menos de 4 caracteres', async () => {
    await expect(
      loginController(makeRequest({ body: { ...credentials, password: '123' } }), makeReply()),
    ).rejects.toThrow(ZodError)
  })

  it('rejeita senha com mais de 20 caracteres', async () => {
    await expect(
      loginController(makeRequest({ body: { ...credentials, password: 'x'.repeat(21) } }), makeReply()),
    ).rejects.toThrow(ZodError)
  })

  it('não autentica quando o corpo é inválido', async () => {
    await loginController(makeRequest({ body: {} }), makeReply()).catch(() => undefined)

    expect(authenticateUserMock).not.toHaveBeenCalled()
  })

  it('propaga o erro de credenciais inválidas do service', async () => {
    authenticateUserMock.mockRejectedValue(
      Object.assign(new Error('Credenciais inválidas'), { statusCode: 401 }),
    )

    await expect(
      loginController(makeRequest({ body: credentials }), makeReply()),
    ).rejects.toMatchObject({ statusCode: 401 })
  })

  it('não define cookie quando a autenticação falha', async () => {
    authenticateUserMock.mockRejectedValue(new Error('Credenciais inválidas'))
    const reply = makeReply()

    await loginController(makeRequest({ body: credentials }), reply).catch(() => undefined)

    expect(reply.cookies).toHaveLength(0)
  })
})
