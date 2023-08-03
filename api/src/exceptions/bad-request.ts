import { HttpException } from '@/exceptions/http';

export class BadRequestException extends HttpException {
  constructor(payload: any) {
    super(payload, 400);
    this.name = 'BadRequestException';
  }
}
