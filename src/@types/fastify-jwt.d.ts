import '@fastify/jwt'

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: { id: string; email: string; jti: string }
    user: { id: string; email: string; jti: string }
  }
}