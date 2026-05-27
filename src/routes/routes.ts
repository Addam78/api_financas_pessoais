import { FastifyInstance } from "fastify";

import { PrismaClient } from '../generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'
import fastifyJwt from "@fastify/jwt";
import { authenticate } from "../middleware/autenticate";
import "@fastify/cookie"

const pool = new pg.Pool({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'gyhkil987%',
  database: 'api_financas',
})

const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })




export async function routes(app:FastifyInstance) {

    app.get ('/',(req,reply)=>{
        return 'Hello world 1 2 3'
    })

    app.post('/login',async (req,reply)=>{
        const {email,password} = req.body

       const user = await prisma.user.findUnique({
        where: { email },
        });

        if (!user || user.password !== password) {
        // credenciais inválidas
        } 
        
        const token = app.jwt.sign({ id: user.id, email: user.email });

        reply.setCookie("token", token, {
        httpOnly: true,
        path: "/",
        secure: false, // true em produção com HTTPS
        sameSite: "lax",
        });

        return reply.send({ message: "login realizado" });
    })

    app.post('/insert',{preHandler:[authenticate]},async (req,reply)=>{
        const iduser = req.user.id
        const {value, description} = req.body
        
        const resuult = await prisma.transactions.create({
            data : {
                type: 'EXPENSE',
                description ,
                value,
                userId:iduser
            }
        })
    })
    
}