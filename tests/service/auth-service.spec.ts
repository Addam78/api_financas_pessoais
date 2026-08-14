import { beforeEach, describe, expect, it, vi } from 'vitest'
import bcrypt from 'bcryptjs'
import { authenticateUser } from '../../src/service/auth-service'
import { findUserByEmail } from '../../src/repositories/user-repository'
import { AppError } from '../../src/errors/app-error'

vi.mock('../../src/repositories/user-repository', () => ({
  findUserByEmail: vi.fn(),
}))

const findUserByEmailMock = vi.mocked(findUserByEmail)

function makeUser(overrides: Record<string, unknown> = {}) {
  return {
    id: 'user-1',
    name: 'Addam',
    email: 'addam@mail.com',
    password: bcrypt.hashSync('senha123', 4),
    ...overrides,
  } as any
}

describe('authenticateUser', () => {
  beforeEach(() => {
    findUserByEmailMock.mockReset()
  })

  it('retorna o usuário quando e-mail e senha estão corretos', async () => {
    const user = makeUser()
    findUserByEmailMock.mockResolvedValue(user)

    await expect(authenticateUser('addam@mail.com', 'senha123')).resolves.toBe(user)
  })

  it('busca o usuário pelo e-mail informado', async () => {
    findUserByEmailMock.mockResolvedValue(makeUser())

    await authenticateUser('addam@mail.com', 'senha123')

    expect(findUserByEmailMock).toHaveBeenCalledWith('addam@mail.com')
  })

  it('lança AppError 401 quando o usuário não existe', async () => {
    findUserByEmailMock.mockResolvedValue(null)

    await expect(authenticateUser('nao@existe.com', 'senha123')).rejects.toThrow(AppError)
    await expect(authenticateUser('nao@existe.com', 'senha123')).rejects.toMatchObject({
      message: 'Credenciais inválidas',
      statusCode: 401,
    })
  })

  it('lança AppError 401 quando a senha está incorreta', async () => {
    findUserByEmailMock.mockResolvedValue(makeUser())

    await expect(authenticateUser('addam@mail.com', 'senha-errada')).rejects.toMatchObject({
      message: 'Credenciais inválidas',
      statusCode: 401,
    })
  })

  it('não vaza qual dos dois campos está errado', async () => {
    findUserByEmailMock.mockResolvedValueOnce(null)
    const semUsuario = await authenticateUser('a@a.com', 'x').catch((e) => e.message)

    findUserByEmailMock.mockResolvedValueOnce(makeUser())
    const senhaErrada = await authenticateUser('addam@mail.com', 'x').catch((e) => e.message)

    expect(semUsuario).toBe(senhaErrada)
  })

  it('propaga erro inesperado do repositório', async () => {
    findUserByEmailMock.mockRejectedValue(new Error('conexão perdida'))

    await expect(authenticateUser('addam@mail.com', 'senha123')).rejects.toThrow('conexão perdida')
  })
})
