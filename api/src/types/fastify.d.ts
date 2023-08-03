import type { Env } from '@/validators/env';
import { type Database } from '@/types/database';
import { type User } from '@/models/users';

declare module 'fastify' {
  export interface FastifyRequest {
    db: Database;
    env: Env;
    user: User;
    config: {
      storage: string;
    };
  }
}
