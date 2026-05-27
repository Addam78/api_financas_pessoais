import { FastifyInstance } from "fastify";

import { PrismaClient } from '../generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'
import fastifyJwt from "@fastify/jwt";
import { authenticate } from "../middleware/autenticate";
import "@fastify/cookie"
import z from 'zod'
import { createECDH } from "node:crypto";
import { relative } from "node:path";
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
                const createUserBodySchema = z.object({
                email:z.string().nonempty().min(2),
                password:z.string().min(4).max(20)
            })

        const {email,password} = createUserBodySchema.parse(req.body)

       const user = await prisma.user.findUnique({
        where: { email },
        });

        if (!user || user.password !== password) {
         return reply.status(401).send({message :'Credenciais invalidas'})
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

         const createUserBodySchema = z.object({
            type: z.enum(['INCOME','EXPENSE']),
            description: z.string().nonempty(),
            value:z.number()
        })

        const { type,description,value} = createUserBodySchema.parse(req.body)
        
        const result = await prisma.transactions.create({
            data : {
                type,
                description ,
                value,
                userId:iduser
            }

        
        })

        return reply.send(result)
    })
    
}