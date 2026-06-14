import bcrypt from 'bcryptjs'
import { findUserByEmail } from '../repositories/user-repository'

export async function authenticateUser(email: string, password: string) {
  const user = await findUserByEmail(email)

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new Error('Credenciais inválidas')
  }

  return user
}