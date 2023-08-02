import { HttpException } from './http';

export class UnauthenticatedException extends HttpException {
  constructor(message: string) {
    super({ message }, 401);
  }
}
