import { json } from '@/helpers/response';
import { type Handler } from '@/types/routing';
import { loginSchema, registerSchema } from '@/validators/controllers/v1/auth';
import * as models from '@/models';
import { eq } from 'drizzle-orm';
import { BadRequestException } from '@/exceptions/bad-request';
import * as hash from '@/lib/hash';
import { omit } from 'lodash';
import * as auth from '@/lib/auth';
import { ulid } from 'ulid';

export const login: Handler = async function (request, response) {
  const payload = await loginSchema.validate(request.body, {
    abortEarly: false,
  });

  const [user] = await this.db
    .select()
    .from(models.users)
    .where(eq(models.users.email, payload.email))
    .limit(1);

  if (!user) {
    throw new BadRequestException({
      error: {
        message: 'User does not exist.',
      },
    });
  }

  if (!(await hash.check(user.password, payload.password))) {
    throw new BadRequestException({
      error: {
        message: 'Password does not match.',
      },
    });
  }

  const { token, expiry } = await auth.createToken(user, this.env);

  json(response, {
    data: omit(user, ['password']),
    access: {
      type: 'Bearer',
      token,
      expires: expiry,
    },
  });
};

export const check: Handler = async (request, response) => {
  json(response, {
    data: omit(request.user, ['password']),
  });
};

export const register: Handler = async function (request, response) {
  const payload = await registerSchema.validate(request.body, {
    abortEarly: false,
  });

  const exists = await this.db
    .select()
    .from(models.users)
    .where(eq(models.users.email, payload.email))
    .limit(1);

  if (exists.length > 0) {
    throw new BadRequestException({
      error: {
        message: 'Email already exists.',
      },
    });
  }

  const id = ulid();

  await this.db.insert(models.users).values({
    id,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...payload,
  });

  const [user] = await this.db
    .select()
    .from(models.users)
    .where(eq(models.users.id, id))
    .limit(1);

  const { token, expiry } = await auth.createToken(user, this.env);

  json(response, {
    data: omit(user, ['password']),
    access: {
      type: 'Bearer',
      token,
      expires: expiry,
    },
  });
};
