import { env } from './env'
import { buildApp } from './app'

const app = buildApp()

app.listen({ port: env.PORT, host: '0.0.0.0' }, (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`Servidor rodando em ${address}`)
  console.log(`Documentação disponível em ${address}/docs`)
})

export default app
