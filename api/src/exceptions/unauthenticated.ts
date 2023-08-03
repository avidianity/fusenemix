import { HttpException } from '@/exceptions/http';

export class UnauthenticatedException extends HttpException {
  constructor(message: string) {
    super({ message }, 401);
  }
}
