
import { FastifyRequest, FastifyReply } from "fastify";
import "@fastify/jwt";
import "@fastify/cookie"
import { isTokenRevoked } from "../repositories/revoked-token-repository";

export const authenticate = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    await req.jwtVerify(); // tenta header primeiro
  } catch {
    const token = req.cookies?.token;
    if (!token) return reply.status(401).send({ error: "Não autenticado" });

    const decoded = req.server.jwt.verify<{ id: string; email: string; jti: string }>(token);
    req.user = decoded;
  }

  if (await isTokenRevoked(req.user.jti)) {
    return reply.status(401).send({ error: "Não autenticado" });
  }
};