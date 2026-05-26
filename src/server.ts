import fastify from 'fastify'
import fastifyFormbody from '@fastify/formbody'
import dotenv from 'dotenv'

dotenv.config()
const app = fastify()
app.register(fastifyFormbody)


app.get('/',async(req,reply)=>{
    return 'Hello world'
})

app.listen({ port:Number(process.env.PORT) || 3333, host: '0.0.0.0' }, (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`Servidor rodando em ${address}`)
})