export class HttpException extends Error {
  constructor(payload: any, public statusCode: number) {
    super(typeof payload === 'string' ? payload : JSON.stringify(payload));
    this.name = 'HttpException';
  }

  public setStatusCode(code: number) {
    this.statusCode = code;
  }
}
