import { prisma } from '../lib/prisma'
import { PrismaClient } from '../generated/prisma/client'


interface CreateUser {
  name    : string
  password :string
  email  :string     
}


export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } })
}

export async function createUser(data:CreateUser) {
  return prisma.user.create({
    data:{
      name: data.name,
      password: data.password,
      email: data.email
    }
  })
}