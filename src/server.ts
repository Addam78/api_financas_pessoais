import 'dotenv/config'
import dotenv from 'dotenv'
import { buildApp } from './app'

dotenv.config()

const app = buildApp()

app.listen({ port: Number(process.env.PORT) || 3333, host: '0.0.0.0' }, (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`Servidor rodando em ${address}`)
  console.log(`Documentação disponível em ${address}/docs`)
})

export default app
