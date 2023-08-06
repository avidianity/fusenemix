import { HttpException } from '@/exceptions/http';

export class InvalidTokenException extends HttpException {
  constructor(payload: any) {
    super(payload, 401);
    this.name = 'InvalidTokenException';
  }
}
