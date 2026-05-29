import { createUser } from "../repositories/user-repository";
import {z} from 'zod'

const createUserBodySchema = z.object({
            name: z.string().nonempty(),
            password: z.string().nonempty().min(5),
            email: z.string().email()
        })

type CreatUserRequest = z.infer<typeof createUserBodySchema >   


export async function createUserService(data: CreatUserRequest) {
  const parsed = createUserBodySchema.parse(data)

  const newUser = await createUser({
    name:parsed.name,
    password : parsed.password,
    email : parsed.email
  })

  return newUser
}