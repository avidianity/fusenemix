import type { FastifyInstance } from 'fastify';

type ReturnType = Promise<void> | void;

export interface JobContract {
  handle(fastify: FastifyInstance): ReturnType;
  onSuccess?: () => ReturnType;
  onError?: (error: Error) => ReturnType;
}
