import type { FastifyRequest } from 'fastify';
import type { Env } from '@/validators/env';
import { Database } from '@/types/database';

declare module 'fastify' {
  export interface FastifyRequest {
    db: Database;
    env: Env;
  }
}
