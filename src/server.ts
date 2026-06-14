import 'dotenv/config'
import dotenv from 'dotenv'
import fastify from 'fastify'
import fastifyFormbody from '@fastify/formbody'
import fastifyCookie from "@fastify/cookie";
import fastifyJwt from "@fastify/jwt";
import fastifySwagger from '@fastify/swagger'
import scalarApiReference from '@scalar/fastify-api-reference'

import { authRoutes } from './routes/auth-routes'
import { deleteTransactionRoutes, findTransactionRoutes, transactionRoutes, updateTransactionRoutes } from './routes/transaction-routes';
import { userRoutes } from './routes/user-routes';

dotenv.config()
const app = fastify()

app.register(fastifySwagger, {
  openapi: {
    openapi: '3.0.0',
    info: {
      title: 'API Finanças',
      description: 'API REST para gerenciamento de transações financeiras pessoais',
      version: '1.0.0',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
})

app.register(scalarApiReference, {
  routePrefix: '/docs',
  configuration: {
    title: 'API Finanças',
    theme: 'purple',
  },
})

app.register(fastifyFormbody)
app.register(fastifyJwt, { secret: process.env.JWT_SECRET! });
app.register(fastifyCookie);
app.register(authRoutes)
app.register(transactionRoutes)
app.register(userRoutes)
app.register(findTransactionRoutes)
app.register(updateTransactionRoutes)
app.register(deleteTransactionRoutes)

app.listen({ port: Number(process.env.PORT) || 3333, host: '0.0.0.0' }, (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`Servidor rodando em ${address}`)
  console.log(`Documentação disponível em ${address}/docs`)
})

export default app