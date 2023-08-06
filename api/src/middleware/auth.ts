import { UnauthenticatedException } from '@/exceptions/unauthenticated';
import { type Middleware } from '@/types/routing';
import { authSchema } from '@/validators/middleware/auth';
import * as lib from '@/lib/auth';
import { ValidationError } from 'yup';

export const auth: Middleware = async function (request, _, __) {
  try {
    const validated = await authSchema.validate(request.headers);

    const fragments = validated.authorization.split(' ');

    const token = fragments[1];

    const user = await lib.decodeToken(token, this.db, this.env);

    request.user = user;
  } catch (error) {
    if (error instanceof ValidationError) {
      throw new UnauthenticatedException('Token is missing.');
    }

    throw error;
  }
};
