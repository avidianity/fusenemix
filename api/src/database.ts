import { type Env } from '@/validators/env';
import mysql from 'mysql2/promise';
import { drizzle } from 'drizzle-orm/mysql2';
import * as schema from '@/models';

export async function connect(env: Env) {
  const connection = await mysql.createConnection({
    host: env.DB_HOST,
    port: env.DB_PORT,
    user: env.DB_USER,
    password: env.DB_PASS,
    database: env.DB_NAME,
    multipleStatements: true,
  });

  return {
    db: drizzle(connection, {
      logger: env.ENV === 'development',
      schema,
    }),
    connection,
  };
}
