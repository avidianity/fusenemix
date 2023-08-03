import axios from 'axios';
import type { FastifyInstance } from 'fastify';
import type { MySql2Database } from 'drizzle-orm/mysql2';
import { migrate as migrator } from 'drizzle-orm/mysql2/migrator';
import path from 'path';
import * as models from '@/models';
import * as hash from '@/lib/hash';
import type { NewUser } from '@/models/users';
import { eq } from 'drizzle-orm';
import { ulid } from 'ulid';

export function createClient(server: FastifyInstance) {
  const address = server.server.address();

  const port = typeof address === 'object' ? address?.port : null;

  return axios.create({
    baseURL: port ? `http://localhost:${port}` : (address as string),
  });
}

export async function migrate(db: MySql2Database) {
  await migrator(db, {
    migrationsFolder: path.resolve(__dirname, '../migrations'),
  });
}

export async function seed(db: MySql2Database) {
  const users = await db
    .select()
    .from(models.users)
    .where(eq(models.users.email, 'manlupigjohnmichael@gmail.com'))
    .limit(1);

  if (users.length === 0) {
    const payload: NewUser = {
      id: ulid(),
      firstName: 'John Michael',
      lastName: 'Manlupig',
      email: 'manlupigjohnmichael@gmail.com',
      password: await hash.make('password'),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.insert(models.users).values(payload);
  }
}
