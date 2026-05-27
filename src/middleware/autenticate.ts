
import { FastifyRequest, FastifyReply } from "fastify";
import "@fastify/jwt";
import "@fastify/cookie"

export const authenticate = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    await req.jwtVerify(); // tenta header primeiro
  } catch {
    const token = req.cookies?.token;
    if (!token) return reply.status(401).send({ error: "Não autenticado" });

    const decoded = req.server.jwt.verify(token);
    req.user = decoded;
  }
};