import { describe, expect, it } from 'vitest'
import { AppError } from '../../src/errors/app-error'

describe('AppError', () => {
  it('guarda mensagem e statusCode', () => {
    const error = new AppError('Não encontrado', 404)

    expect(error.message).toBe('Não encontrado')
    expect(error.statusCode).toBe(404)
  })

  it('define o name como AppError', () => {
    expect(new AppError('x', 400).name).toBe('AppError')
  })

  it('é uma instância de Error', () => {
    const error = new AppError('x', 400)

    expect(error).toBeInstanceOf(Error)
    expect(error).toBeInstanceOf(AppError)
  })

  it('preserva o stack trace', () => {
    expect(new AppError('x', 500).stack).toBeDefined()
  })
})
