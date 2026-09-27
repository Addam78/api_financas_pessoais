import { FastifyRequest, FastifyReply } from 'fastify'
import { randomUUID } from 'node:crypto'
import { z } from 'zod'
import { authenticateUser, logoutUser } from '../service/auth-service'

const loginBodySchema = z.object({
  email: z.string().nonempty().min(2),
  password: z.string().min(4).max(20),
})

export async function loginController(req: FastifyRequest, reply: FastifyReply) {
  const { email, password } = loginBodySchema.parse(req.body)

  const user = await authenticateUser(email, password)

  const jti = randomUUID()
  const token = req.server.jwt.sign({ id: user.id, email: user.email, jti })

  reply.setCookie('token', token, {
    httpOnly: true,
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  })

  return reply.send({ message: 'login realizado', token })
}

export async function logoutController(req: FastifyRequest, reply: FastifyReply) {
  const { jti, exp } = req.user as unknown as { jti: string; exp: number }

  await logoutUser(jti, new Date(exp * 1000))

  reply.clearCookie('token', { path: '/' })

  return reply.send({ message: 'logout realizado' })
}