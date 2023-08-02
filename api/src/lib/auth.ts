import { User } from '@/models/users';
import { envSchema } from '@/validators/env';
import jwt from 'jsonwebtoken';
import dayjs from 'dayjs';
import { Database } from '@/types/database';
import * as models from '@/models';
import { eq } from 'drizzle-orm';
import { InvalidTokenException } from '@/exceptions/invalid-token';

export async function createToken(user: User) {
  const env = await envSchema.validate(process.env, { abortEarly: false });

  const expiry = dayjs().add(1, 'hour').unix();

  const token = jwt.sign(
    {
      sub: user.id,
      iat: dayjs().unix(),
      exp: expiry,
    },
    env.SECRET
  );

  return { token, expiry };
}

export async function decodeToken(token: string, db: Database) {
  const env = await envSchema.validate(process.env, { abortEarly: false });

  const decoded = jwt.verify(token, env.SECRET, { complete: true });

  const data = typeof decoded === 'string' ? JSON.parse(decoded) : decoded;

  const result = await db
    .select()
    .from(models.users)
    .where(eq(models.users.id, data.payload.sub))
    .limit(1);

  if (result.length === 0) {
    throw new InvalidTokenException('No user found.');
  }

  return result[0];
}
