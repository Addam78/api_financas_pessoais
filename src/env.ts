import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(3333),
  DATABASE_URL: z.string({ error: 'DATABASE_URL é obrigatória' }).min(1, 'DATABASE_URL é obrigatória'),
  JWT_SECRET: z.string({ error: 'JWT_SECRET é obrigatória' }).min(1, 'JWT_SECRET é obrigatória'),
})

const parsed = envSchema.safeParse(process.env)

if (!parsed.success) {
  console.error('Variáveis de ambiente inválidas ou ausentes:')
  for (const issue of parsed.error.issues) {
    console.error(`  - ${issue.path.join('.')}: ${issue.message}`)
  }
  process.exit(1)
}

export const env = parsed.data
