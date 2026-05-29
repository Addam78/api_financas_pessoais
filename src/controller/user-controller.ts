import { FastifyRequest, FastifyReply } from 'fastify'
import {z} from 'zod'
import { createUserService } from '../service/user-service'

export async function createUserController(req: FastifyRequest, reply: FastifyReply) {
  const bodySchema = z.object({
    name: z.string().nonempty(),
    password: z.string().nonempty().min(5),
    email: z.string().email()
  })

  
  const {name,email,password} = bodySchema.parse(req.body)

    const result = await createUserService({
        name,
        email,
        password
    })


  return reply.status(201).send(result)


}
