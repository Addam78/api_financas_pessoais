import bcrypt from 'bcryptjs'
import { findUserByEmail } from '../repositories/user-repository'
import { revokeToken } from '../repositories/revoked-token-repository'
import { AppError } from '../errors/app-error'

export async function authenticateUser(email: string, password: string) {
  const user = await findUserByEmail(email)

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new AppError('Credenciais inválidas', 401)
  }

  return user
}

export async function logoutUser(jti: string, expiresAt: Date) {
  await revokeToken(jti, expiresAt)
}