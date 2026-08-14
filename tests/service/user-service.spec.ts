import { beforeEach, describe, expect, it, vi } from 'vitest'
import bcrypt from 'bcryptjs'
import { ZodError } from 'zod'
import { createUserService } from '../../src/service/user-service'
import { createUser } from '../../src/repositories/user-repository'

vi.mock('../../src/repositories/user-repository', () => ({
  createUser: vi.fn(),
}))

const createUserMock = vi.mocked(createUser)

const validInput = {
  name: 'Addam',
  email: 'addam@mail.com',
  password: 'senha123',
}

describe('createUserService', () => {
  beforeEach(() => {
    createUserMock.mockReset()
    createUserMock.mockImplementation(async (data: any) => ({ id: 'user-1', ...data }))
  })

  it('cria o usuário e devolve o registro do repositório', async () => {
    const user = await createUserService(validInput)

    expect(user).toMatchObject({ id: 'user-1', name: 'Addam', email: 'addam@mail.com' })
  })

  it('nunca persiste a senha em texto puro', async () => {
    await createUserService(validInput)

    const persisted = createUserMock.mock.calls[0][0]
    expect(persisted.password).not.toBe('senha123')
  })

  it('gera um hash bcrypt válido para a senha', async () => {
    await createUserService(validInput)

    const { password } = createUserMock.mock.calls[0][0]
    expect(await bcrypt.compare('senha123', password)).toBe(true)
  })

  it('repassa nome e e-mail sem alteração', async () => {
    await createUserService(validInput)

    expect(createUserMock.mock.calls[0][0]).toMatchObject({
      name: 'Addam',
      email: 'addam@mail.com',
    })
  })

  it('rejeita nome vazio', async () => {
    await expect(createUserService({ ...validInput, name: '' })).rejects.toThrow(ZodError)
  })

  it('rejeita e-mail inválido', async () => {
    await expect(createUserService({ ...validInput, email: 'nao-e-email' })).rejects.toThrow(ZodError)
  })

  it('rejeita senha com menos de 5 caracteres', async () => {
    await expect(createUserService({ ...validInput, password: '1234' })).rejects.toThrow(ZodError)
  })

  it('aceita senha com exatamente 5 caracteres', async () => {
    await expect(createUserService({ ...validInput, password: '12345' })).resolves.toBeDefined()
  })

  it('não chama o repositório quando a validação falha', async () => {
    await createUserService({ ...validInput, email: 'invalido' }).catch(() => undefined)

    expect(createUserMock).not.toHaveBeenCalled()
  })

  it('propaga erros lançados pelo repositório', async () => {
    createUserMock.mockRejectedValue(new Error('e-mail duplicado'))

    await expect(createUserService(validInput)).rejects.toThrow('e-mail duplicado')
  })
})
