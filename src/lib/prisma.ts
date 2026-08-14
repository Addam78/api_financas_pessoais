import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'
import { PrismaClient } from '../generated/prisma/client'

const connectionString = process.env.DATABASE_URL

// O driver adapter usa o `pg` puro, que ignora o parâmetro `?schema=` da URL.
// Extraímos ele aqui e repassamos ao adapter — é o que permite que cada arquivo
// de teste e2e rode em um schema isolado (ver test/setup-e2e.ts).
const schema = connectionString
  ? new URL(connectionString).searchParams.get('schema') ?? undefined
  : undefined

const pool = new pg.Pool({ connectionString })

const adapter = new PrismaPg(pool, { schema })

export const prisma = new PrismaClient({ adapter })
