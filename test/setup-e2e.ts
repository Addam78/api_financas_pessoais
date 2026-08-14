import 'dotenv/config'
import { randomUUID } from 'node:crypto'
import { execSync } from 'node:child_process'
import pg from 'pg'
import { afterAll, beforeAll } from 'vitest'

function generateUniqueDatabaseURL(schemaId: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error('Please provider a DATABASE_URL environment variable.')
  }

  const url = new URL(process.env.DATABASE_URL)

  url.searchParams.set('schema', schemaId)

  return url.toString()
}

const schemaId = `test_${randomUUID().replaceAll('-', '')}`

const databaseURL = generateUniqueDatabaseURL(schemaId)

// Precisa acontecer antes de qualquer import de src/lib/prisma, que lê
// DATABASE_URL no momento em que o módulo é carregado.
process.env.DATABASE_URL = databaseURL

beforeAll(() => {
  execSync('npx prisma migrate deploy', { stdio: 'pipe' })
})

afterAll(async () => {
  const pool = new pg.Pool({ connectionString: databaseURL })

  await pool.query(`DROP SCHEMA IF EXISTS "${schemaId}" CASCADE`)
  await pool.end()
})
