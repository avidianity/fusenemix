import { HttpException } from '@/exceptions/http';

export class InternalServerErrorException extends HttpException {
  constructor(payload: any) {
    super(payload, 500);
    this.name = 'InternalServerErrorException';
  }
}
