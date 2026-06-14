import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { authenticateUser } from '../service/auth-service'
import app from '../server'

const loginBodySchema = z.object({
  email: z.string().nonempty().min(2),
  password: z.string().min(4).max(20),
})

export async function loginController(req: FastifyRequest, reply: FastifyReply) {
  const { email, password } = loginBodySchema.parse(req.body)

  const user = await authenticateUser(email, password)

  const token = app.jwt.sign({ id: user.id, email: user.email })

  reply.setCookie('token', token, {
    httpOnly: true,
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  })

  return reply.send({ message: 'login realizado' })
}