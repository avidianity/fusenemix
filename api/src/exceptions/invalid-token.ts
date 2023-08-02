import { HttpException } from './http';

export class InvalidTokenException extends HttpException {
  constructor(message: string) {
    super({ message }, 400);
    this.name = 'InvalidTokenException';
  }
}
