import { vi } from 'vitest'
import type { FastifyReply, FastifyRequest } from 'fastify'

/**
 * Reply falso: cada método devolve o próprio objeto, permitindo encadeamento
 * (reply.status(201).send(...)) e inspeção do que foi enviado.
 */
export function makeReply() {
  const reply = {
    statusCode: undefined as number | undefined,
    payload: undefined as unknown,
    cookies: [] as Array<{ name: string; value: string; options?: unknown }>,
    status: vi.fn(function (this: any, code: number) {
      reply.statusCode = code
      return reply
    }),
    send: vi.fn(function (this: any, payload: unknown) {
      reply.payload = payload
      return reply
    }),
    setCookie: vi.fn(function (this: any, name: string, value: string, options?: unknown) {
      reply.cookies.push({ name, value, options })
      return reply
    }),
  }

  return reply as typeof reply & FastifyReply
}

export function makeRequest(overrides: Partial<Record<string, unknown>> = {}) {
  return {
    body: {},
    params: {},
    cookies: {},
    user: undefined,
    server: {
      jwt: {
        sign: vi.fn(() => 'fake-jwt-token'),
        verify: vi.fn(() => ({ id: 'user-1', email: 'user@mail.com' })),
      },
    },
    jwtVerify: vi.fn(async () => undefined),
    ...overrides,
  } as unknown as FastifyRequest & {
    jwtVerify: ReturnType<typeof vi.fn>
    server: { jwt: { sign: ReturnType<typeof vi.fn>; verify: ReturnType<typeof vi.fn> } }
  }
}
