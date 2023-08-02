import type { Config } from 'drizzle-kit';

export default {
  schema: './src/models',
  out: './src/migrations',
  driver: 'mysql2',
  dbCredentials: {
    host: process.env.DB_HOST!,
    port: parseInt(process.env.DB_PORT!),
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME!,
  },
} satisfies Config;
