import { FastifyInstance } from "fastify";


import fastifyJwt from "@fastify/jwt";
import { authenticate } from "../middleware/autenticate";
import "@fastify/cookie"
import z from 'zod'
import { createECDH } from "node:crypto";
import { relative } from "node:path";

import { loginController } from '../controller/auth-controller'
import { prisma } from '../lib/prisma'



export async function routes(app:FastifyInstance) {

    app.get ('/',(req,reply)=>{
        return 'Hello world 1 2 3'
    })

    
}