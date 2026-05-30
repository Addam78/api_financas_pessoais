import 'dotenv/config'
import dotenv from 'dotenv'
import fastify from 'fastify'
import fastifyFormbody from '@fastify/formbody'
import fastifyCookie from "@fastify/cookie";

import fastifyJwt from "@fastify/jwt";

import { authRoutes } from './routes/auth-routes'

import { findTransactionRoutes, transactionRoutes, updateTransactionRoutes } from './routes/transaction-routes';
import { userRoutes } from './routes/user-routes';

dotenv.config()
const app = fastify()


app.register(fastifyFormbody)
app.register(fastifyJwt, { secret: "sua-secret" });



app.register(fastifyCookie);
app.register(authRoutes)
app.register(transactionRoutes)
app.register(userRoutes)
app.register(findTransactionRoutes)
app.register(updateTransactionRoutes)

app.listen({ port:Number(process.env.PORT) || 3333, host: '0.0.0.0' }, (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`Servidor rodando em ${address}`)
})

export default app