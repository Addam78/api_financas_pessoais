import { describe, expect, it, vi } from 'vitest'
import { Prisma } from '../../src/generated/prisma/client'
import { prisma } from '../../src/lib/prisma'
import { createUser, findUserByEmail } from '../../src/repositories/user-repository'
import { AppError } from '../../src/errors/app-error'

vi.mock('../../src/lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
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

const newUser = { name: 'Addam', password: 'hash', email: 'addam@mail.com' }

describe('findUserByEmail', () => {
  it('consulta o usuário pelo e-mail', async () => {
    prismaMock.user.findUnique.mockResolvedValue(null as any)

    await findUserByEmail('addam@mail.com')

    expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
      where: { email: 'addam@mail.com' },
    })
  })

  it('devolve o usuário encontrado', async () => {
    const user = { id: 'user-1', ...newUser }
    prismaMock.user.findUnique.mockResolvedValue(user as any)

    await expect(findUserByEmail('addam@mail.com')).resolves.toBe(user)
  })

  it('devolve null quando não existe', async () => {
    prismaMock.user.findUnique.mockResolvedValue(null as any)

    await expect(findUserByEmail('nao@existe.com')).resolves.toBeNull()
  })
})

describe('createUser', () => {
  it('persiste nome, senha e e-mail', async () => {
    prismaMock.user.create.mockResolvedValue({ id: 'user-1', ...newUser } as any)

    await createUser(newUser)

    expect(prismaMock.user.create).toHaveBeenCalledWith({ data: newUser })
  })

  it('devolve o usuário criado', async () => {
    const created = { id: 'user-1', ...newUser }
    prismaMock.user.create.mockResolvedValue(created as any)

    await expect(createUser(newUser)).resolves.toBe(created)
  })

  it('converte P2002 em AppError 409', async () => {
    prismaMock.user.create.mockRejectedValue(knownRequestError('P2002'))

    await expect(createUser(newUser)).rejects.toMatchObject({
      message: 'Este e-mail já está cadastrado',
      statusCode: 409,
    })
    await expect(createUser(newUser)).rejects.toBeInstanceOf(AppError)
  })

  it('não converte outros códigos do Prisma', async () => {
    prismaMock.user.create.mockRejectedValue(knownRequestError('P2003'))

    await expect(createUser(newUser)).rejects.not.toBeInstanceOf(AppError)
  })

  it('propaga erros genéricos sem alteração', async () => {
    const boom = new Error('conexão perdida')
    prismaMock.user.create.mockRejectedValue(boom)

    await expect(createUser(newUser)).rejects.toBe(boom)
  })
})
