import * as database from '@/database';
import * as models from '@/models';
import { type NewUser } from '@/models/users';
import { envSchema } from '@/validators/env';
import { eq } from 'drizzle-orm';
import { ulid } from 'ulid';
import * as hash from '@/lib/hash';
import { loadEnv } from '@/lib/env';

export async function main() {
  await loadEnv();

  const env = await envSchema.validate(process.env);

  const { db } = await database.connect(env);

  const [user] = await db
    .select()
    .from(models.users)
    .where(eq(models.users.email, 'manlupigjohnmichael@gmail.com'))
    .limit(1);

  if (!user) {
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

main()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
