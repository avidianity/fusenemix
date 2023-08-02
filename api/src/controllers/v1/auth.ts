import { json } from '@/helpers/response';
import { Handler } from '@/types/routing';
import { loginSchema } from '@/validators/controllers/v1/auth';
import * as models from '@/models';
import { eq } from 'drizzle-orm';
import { BadRequestException } from '@/exceptions/bad-request';
import * as hash from '@/lib/hash';
import { omit } from 'lodash';
import * as auth from '@/lib/auth';

export const login: Handler = async (request, response) => {
  const payload = await loginSchema.validate(request.body, {
    abortEarly: false,
  });

  const result = await request.db
    .select()
    .from(models.users)
    .where(eq(models.users.email, payload.email))
    .limit(1);

  if (result.length === 0) {
    throw new BadRequestException({
      error: {
        message: 'User does not exist.',
      },
    });
  }

  const user = result[0];

  if (!(await hash.check(user.password, payload.password))) {
    throw new BadRequestException({
      error: {
        message: 'Password does not match.',
      },
    });
  }

  const { token, expiry } = await auth.createToken(user);

  json(response, {
    data: omit(user, ['password']),
    access: { token, type: 'Bearer', expires: expiry },
  });
};
