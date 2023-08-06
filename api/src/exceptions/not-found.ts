import { HttpException } from '@/exceptions/http';

export class NotFoundException extends HttpException {
  constructor(payload: any) {
    super(payload, 404);
  }
}
