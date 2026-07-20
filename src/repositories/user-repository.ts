import { prisma } from '../lib/prisma'
import { Prisma } from '../generated/prisma/client'
import { AppError } from '../errors/app-error'


interface CreateUser {
  name    : string
  password :string
  email  :string
}


export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } })
}

export async function createUser(data:CreateUser) {
  try {
    return await prisma.user.create({
      data:{
        name: data.name,
        password: data.password,
        email: data.email
      }
    })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      throw new AppError('Este e-mail já está cadastrado', 409)
    }
    throw error
  }
}