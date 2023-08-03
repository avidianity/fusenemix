import { UnauthenticatedException } from '@/exceptions/unauthenticated';
import { type Middleware } from '@/types/routing';
import { authSchema } from '@/validators/middleware/auth';
import * as lib from '@/lib/auth';
import { ValidationError } from 'yup';

export const auth: Middleware = async (request, _, next) => {
  try {
    const validated = await authSchema.validate(request.headers);

    const fragments = validated.authorization.split(' ');

    const token = fragments[1];

    const user = await lib.decodeToken(token, request.db, request.env);

    request.user = user;

    next();
  } catch (error) {
    if (error instanceof ValidationError) {
      next(new UnauthenticatedException('Token is missing.'));
      return;
    }

    next(error as Error);
  }
};
