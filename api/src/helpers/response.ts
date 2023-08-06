import { type FastifyReply } from 'fastify';

export function json(handler: FastifyReply, data: unknown, code?: number) {
  const response = handler.header('Content-Type', 'application/json');

  if (typeof code === 'number') {
    response.code(code);
  }

  return response.send(data);
}
