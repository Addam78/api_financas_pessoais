import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import bcrypt from 'bcryptjs'
import { buildApp } from '../src/app'
import { prisma } from '../src/lib/prisma'

const app = buildApp()

beforeAll(async () => {
  await app.ready()
})

afterAll(async () => {
  await app.close()
  await prisma.$disconnect()
})

describe('[POST] /users', () => {
  it('cria o usuário e responde 201', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/users',
      payload: { name: 'Addam', email: 'novo@mail.com', password: 'senha123' },
    })

    expect(response.statusCode).toBe(201)
  })

  it('persiste o usuário no banco', async () => {
    await app.inject({
      method: 'POST',
      url: '/users',
      payload: { name: 'Persistido', email: 'persistido@mail.com', password: 'senha123' },
    })

    const user = await prisma.user.findUnique({ where: { email: 'persistido@mail.com' } })

    expect(user).toMatchObject({ name: 'Persistido' })
  })

  it('grava a senha com hash, nunca em texto puro', async () => {
    await app.inject({
      method: 'POST',
      url: '/users',
      payload: { name: 'Hash', email: 'hash@mail.com', password: 'senha123' },
    })

    const user = await prisma.user.findUniqueOrThrow({ where: { email: 'hash@mail.com' } })

    expect(user.password).not.toBe('senha123')
    expect(await bcrypt.compare('senha123', user.password)).toBe(true)
  })

  it('responde 409 para e-mail já cadastrado', async () => {
    const payload = { name: 'Duplicado', email: 'duplicado@mail.com', password: 'senha123' }

    await app.inject({ method: 'POST', url: '/users', payload })
    const response = await app.inject({ method: 'POST', url: '/users', payload })

    expect(response.statusCode).toBe(409)
    expect(response.json()).toEqual({ error: 'Este e-mail já está cadastrado' })
  })

  it('responde 400 para e-mail inválido', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/users',
      payload: { name: 'X', email: 'nao-e-email', password: 'senha123' },
    })

    expect(response.statusCode).toBe(400)
  })

  it('responde 400 para senha curta demais', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/users',
      payload: { name: 'X', email: 'curta@mail.com', password: '123' },
    })

    expect(response.statusCode).toBe(400)
  })

  it('não cria usuário quando o corpo é inválido', async () => {
    await app.inject({
      method: 'POST',
      url: '/users',
      payload: { name: '', email: 'vazio@mail.com', password: 'senha123' },
    })

    const user = await prisma.user.findUnique({ where: { email: 'vazio@mail.com' } })

    expect(user).toBeNull()
  })
})
