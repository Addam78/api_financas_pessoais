import { prisma } from '../lib/prisma'

export async function revokeToken(jti: string, expiresAt: Date) {
  await prisma.revokedToken.create({ data: { jti, expiresAt } })
}

export async function isTokenRevoked(jti: string) {
  const revoked = await prisma.revokedToken.findUnique({ where: { jti } })
  return revoked !== null
}
