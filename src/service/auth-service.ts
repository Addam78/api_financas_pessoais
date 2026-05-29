import { findUserByEmail } from '../repositories/user-repository'

export async function authenticateUser(email: string, password: string) {
  const user = await findUserByEmail(email)

  if (!user || user.password !== password) {
    throw new Error('Credenciais inválidas')
  }

  return user
}