import { describe, expect, it, vi } from 'vitest'
import { authenticate } from '../../src/middleware/autenticate'
import { makeReply, makeRequest } from '../helpers/fastify-mocks'

describe('authenticate', () => {
  it('passa direto quando o JWT do header é válido', async () => {
    const req = makeRequest()
    const reply = makeReply()

    await authenticate(req, reply)

    expect(req.jwtVerify).toHaveBeenCalled()
    expect(reply.status).not.toHaveBeenCalled()
  })

  it('não olha o cookie quando o header já autenticou', async () => {
    const req = makeRequest({ cookies: { token: 'cookie-token' } })

    await authenticate(req, makeReply())

    expect(req.server.jwt.verify).not.toHaveBeenCalled()
  })

  it('cai para o cookie quando o header falha', async () => {
    const req = makeRequest({ cookies: { token: 'cookie-token' } })
    req.jwtVerify.mockRejectedValue(new Error('sem header'))

    await authenticate(req, makeReply())

    expect(req.server.jwt.verify).toHaveBeenCalledWith('cookie-token')
  })

  it('popula req.user com o payload do cookie', async () => {
    const req = makeRequest({ cookies: { token: 'cookie-token' } })
    req.jwtVerify.mockRejectedValue(new Error('sem header'))

    await authenticate(req, makeReply())

    expect(req.user).toEqual({ id: 'user-1', email: 'user@mail.com' })
  })

  it('responde 401 quando não há header nem cookie', async () => {
    const req = makeRequest()
    req.jwtVerify.mockRejectedValue(new Error('sem header'))
    const reply = makeReply()

    await authenticate(req, reply)

    expect(reply.statusCode).toBe(401)
    expect(reply.payload).toEqual({ error: 'Não autenticado' })
  })

  it('responde 401 quando cookies é undefined', async () => {
    const req = makeRequest({ cookies: undefined })
    req.jwtVerify.mockRejectedValue(new Error('sem header'))
    const reply = makeReply()

    await authenticate(req, reply)

    expect(reply.statusCode).toBe(401)
  })

  it('não define req.user quando não autentica', async () => {
    const req = makeRequest()
    req.jwtVerify.mockRejectedValue(new Error('sem header'))

    await authenticate(req, makeReply())

    expect(req.user).toBeUndefined()
  })

  it('propaga erro quando o token do cookie é inválido', async () => {
    const req = makeRequest({ cookies: { token: 'token-corrompido' } })
    req.jwtVerify.mockRejectedValue(new Error('sem header'))
    req.server.jwt.verify.mockImplementation(() => {
      throw new Error('token inválido')
    })

    await expect(authenticate(req, makeReply())).rejects.toThrow('token inválido')
  })
})
