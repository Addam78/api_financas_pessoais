import { prisma } from '../lib/prisma'
import { PrismaClient } from '../generated/prisma/client'

export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } })
}