import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { buildApp } from '../src/app'
import { prisma } from '../src/lib/prisma'

const app = buildApp()

let token: string
let userId: string
let outroToken: string

async function criarUsuario(email: string) {
  await app.inject({
    method: 'POST',
    url: '/users',
    payload: { name: 'Dono', email, password: 'senha123' },
  })

  const login = await app.inject({
    method: 'POST',
    url: '/auth/login',
    payload: { email, password: 'senha123' },
  })

  return login.json().token as string
}

function auth(jwt: string) {
  return { authorization: `Bearer ${jwt}` }
}

async function criarTransacao(jwt: string, description = 'Salário') {
  const response = await app.inject({
    method: 'POST',
    url: '/transactions',
    headers: auth(jwt),
    payload: { type: 'INCOME', description, value: 5000 },
  })

  return response.json() as { id: string; description: string }
}

beforeAll(async () => {
  await app.ready()

  token = await criarUsuario('dono@mail.com')
  outroToken = await criarUsuario('intruso@mail.com')

  userId = app.jwt.verify<{ id: string }>(token).id
})

afterAll(async () => {
  await app.close()
  await prisma.$disconnect()
})

describe('[POST] /transactions', () => {
  it('cria a transação e responde 201', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/transactions',
      headers: auth(token),
      payload: { type: 'INCOME', description: 'Freela', value: 1200 },
    })

    expect(response.statusCode).toBe(201)
    expect(response.json()).toMatchObject({ description: 'Freela', value: 1200 })
  })

  it('vincula a transação ao usuário do token', async () => {
    const created = await criarTransacao(token, 'Vinculada')

    const row = await prisma.transactions.findUniqueOrThrow({ where: { id: created.id } })

    expect(row.userId).toBe(userId)
  })

  it('ignora userId enviado no corpo', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/transactions',
      headers: auth(token),
      payload: {
        type: 'EXPENSE',
        description: 'Tentativa',
        value: 10,
        userId: '00000000-0000-0000-0000-000000000000',
      },
    })

    const row = await prisma.transactions.findUniqueOrThrow({
      where: { id: response.json().id },
    })

    expect(row.userId).toBe(userId)
  })

  it('responde 401 sem token', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/transactions',
      payload: { type: 'INCOME', description: 'Sem auth', value: 100 },
    })

    expect(response.statusCode).toBe(401)
  })

  it('responde 400 para valor não positivo', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/transactions',
      headers: auth(token),
      payload: { type: 'INCOME', description: 'Zero', value: 0 },
    })

    expect(response.statusCode).toBe(400)
  })

  it('responde 400 para tipo inválido', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/transactions',
      headers: auth(token),
      payload: { type: 'TRANSFER', description: 'X', value: 10 },
    })

    expect(response.statusCode).toBe(400)
  })
})

describe('[GET] /transactions', () => {
  it('lista apenas as transações do usuário autenticado', async () => {
    await criarTransacao(token, 'Minha')
    await criarTransacao(outroToken, 'Do intruso')

    const response = await app.inject({ method: 'GET', url: '/transactions', headers: auth(token) })

    const descriptions = response.json().map((t: { description: string }) => t.description)
    expect(descriptions).toContain('Minha')
    expect(descriptions).not.toContain('Do intruso')
  })

  it('responde 200 e não expõe o userId', async () => {
    const response = await app.inject({ method: 'GET', url: '/transactions', headers: auth(token) })

    expect(response.statusCode).toBe(200)
    expect(response.json()[0]).not.toHaveProperty('userId')
  })

  it('responde 401 sem token', async () => {
    const response = await app.inject({ method: 'GET', url: '/transactions' })

    expect(response.statusCode).toBe(401)
  })
})

describe('[PATCH] /transactions/:id', () => {
  it('atualiza a transação e responde 200', async () => {
    const created = await criarTransacao(token, 'Antes')

    const response = await app.inject({
      method: 'PATCH',
      url: `/transactions/${created.id}`,
      headers: auth(token),
      payload: { type: 'EXPENSE', description: 'Depois', value: 99 },
    })

    expect(response.statusCode).toBe(200)
    expect(response.json()).toMatchObject({ description: 'Depois', value: 99, type: 'EXPENSE' })
  })

  it('persiste a alteração no banco', async () => {
    const created = await criarTransacao(token, 'Persistir update')

    await app.inject({
      method: 'PATCH',
      url: `/transactions/${created.id}`,
      headers: auth(token),
      payload: { type: 'EXPENSE', description: 'Atualizada', value: 1 },
    })

    const row = await prisma.transactions.findUniqueOrThrow({ where: { id: created.id } })
    expect(row.description).toBe('Atualizada')
  })

  it('responde 404 ao tentar atualizar transação de outro usuário', async () => {
    const alheia = await criarTransacao(outroToken, 'Alheia')

    const response = await app.inject({
      method: 'PATCH',
      url: `/transactions/${alheia.id}`,
      headers: auth(token),
      payload: { type: 'EXPENSE', description: 'Invadida', value: 1 },
    })

    expect(response.statusCode).toBe(404)
  })

  it('não altera a transação de outro usuário', async () => {
    const alheia = await criarTransacao(outroToken, 'Intocada')

    await app.inject({
      method: 'PATCH',
      url: `/transactions/${alheia.id}`,
      headers: auth(token),
      payload: { type: 'EXPENSE', description: 'Invadida', value: 1 },
    })

    const row = await prisma.transactions.findUniqueOrThrow({ where: { id: alheia.id } })
    expect(row.description).toBe('Intocada')
  })

  it('responde 404 para id inexistente', async () => {
    const response = await app.inject({
      method: 'PATCH',
      url: '/transactions/00000000-0000-0000-0000-000000000000',
      headers: auth(token),
      payload: { type: 'EXPENSE', description: 'X', value: 1 },
    })

    expect(response.statusCode).toBe(404)
  })

  it('responde 401 sem token', async () => {
    const created = await criarTransacao(token, 'Sem auth patch')

    const response = await app.inject({
      method: 'PATCH',
      url: `/transactions/${created.id}`,
      payload: { type: 'EXPENSE', description: 'X', value: 1 },
    })

    expect(response.statusCode).toBe(401)
  })
})

describe('[DELETE] /transactions/:id', () => {
  it('deleta e responde 200 com a mensagem de confirmação', async () => {
    const created = await criarTransacao(token, 'Deletar')

    const response = await app.inject({
      method: 'DELETE',
      url: `/transactions/${created.id}`,
      headers: auth(token),
    })

    expect(response.statusCode).toBe(200)
    expect(response.json().message).toContain('Deletar')
  })

  it('remove de fato o registro do banco', async () => {
    const created = await criarTransacao(token, 'Sumir')

    await app.inject({
      method: 'DELETE',
      url: `/transactions/${created.id}`,
      headers: auth(token),
    })

    const row = await prisma.transactions.findUnique({ where: { id: created.id } })
    expect(row).toBeNull()
  })

  it('responde 404 ao tentar deletar transação de outro usuário', async () => {
    const alheia = await criarTransacao(outroToken, 'Alheia delete')

    const response = await app.inject({
      method: 'DELETE',
      url: `/transactions/${alheia.id}`,
      headers: auth(token),
    })

    expect(response.statusCode).toBe(404)
  })

  it('mantém intacta a transação de outro usuário', async () => {
    const alheia = await criarTransacao(outroToken, 'Sobrevivente')

    await app.inject({
      method: 'DELETE',
      url: `/transactions/${alheia.id}`,
      headers: auth(token),
    })

    const row = await prisma.transactions.findUnique({ where: { id: alheia.id } })
    expect(row).not.toBeNull()
  })

  it('responde 401 sem token', async () => {
    const created = await criarTransacao(token, 'Sem auth delete')

    const response = await app.inject({
      method: 'DELETE',
      url: `/transactions/${created.id}`,
    })

    expect(response.statusCode).toBe(401)
  })
})
