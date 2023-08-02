import { Env } from '@/validators/env';
import mysql from 'mysql2/promise';
import { drizzle } from 'drizzle-orm/mysql2';

export async function connect(env: Env) {
  return drizzle(
    await mysql.createConnection({
      host: env.DB_HOST,
      port: env.DB_PORT,
      user: env.DB_USER,
      password: env.DB_PASS,
      database: env.DB_NAME,
      multipleStatements: true,
    }),
    {
      logger: env.ENV === 'development',
    }
  );
}
