import { drizzle } from 'drizzle-orm/node-postgres'
import pg from 'pg'
import * as schema from './db/schema.js'
import 'dotenv/config'
import './features/admin/analytics/cron.js'

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL!,
})

export const db = drizzle(pool, { schema })
