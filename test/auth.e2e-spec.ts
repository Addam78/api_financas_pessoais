import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { buildApp } from '../src/app'
import { prisma } from '../src/lib/prisma'

const app = buildApp()

const credentials = { email: 'login@mail.com', password: 'senha123' }

beforeAll(async () => {
  await app.ready()

  await app.inject({
    method: 'POST',
    url: '/users',
    payload: { name: 'Login', ...credentials },
  })
})

afterAll(async () => {
  await app.close()
  await prisma.$disconnect()
})

describe('[POST] /auth/login', () => {
  it('autentica e responde 200 com token', async () => {
    const response = await app.inject({ method: 'POST', url: '/auth/login', payload: credentials })

    expect(response.statusCode).toBe(200)
    expect(response.json()).toEqual({
      message: 'login realizado',
      token: expect.any(String),
    })
  })

  it('devolve o token também no cookie httpOnly', async () => {
    const response = await app.inject({ method: 'POST', url: '/auth/login', payload: credentials })

    expect(response.cookies).toContainEqual(
      expect.objectContaining({ name: 'token', httpOnly: true, path: '/' }),
    )
  })

  it('emite um JWT com o id do usuário', async () => {
    const response = await app.inject({ method: 'POST', url: '/auth/login', payload: credentials })

    const user = await prisma.user.findUniqueOrThrow({ where: { email: credentials.email } })
    const payload = app.jwt.verify<{ id: string; email: string }>(response.json().token)

    expect(payload).toMatchObject({ id: user.id, email: credentials.email })
  })

  it('responde 401 para senha errada', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/auth/login',
      payload: { ...credentials, password: 'senha-errada' },
    })

    expect(response.statusCode).toBe(401)
    expect(response.json()).toEqual({ error: 'Credenciais inválidas' })
  })

  it('responde 401 para usuário inexistente', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/auth/login',
      payload: { email: 'ninguem@mail.com', password: 'senha123' },
    })

    expect(response.statusCode).toBe(401)
  })

  it('usa a mesma mensagem para usuário inexistente e senha errada', async () => {
    const semUsuario = await app.inject({
      method: 'POST',
      url: '/auth/login',
      payload: { email: 'ninguem@mail.com', password: 'senha123' },
    })
    const senhaErrada = await app.inject({
      method: 'POST',
      url: '/auth/login',
      payload: { ...credentials, password: 'senha-errada' },
    })

    expect(semUsuario.json()).toEqual(senhaErrada.json())
  })

  it('responde 400 quando falta a senha', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/auth/login',
      payload: { email: credentials.email },
    })

    expect(response.statusCode).toBe(400)
  })
})
