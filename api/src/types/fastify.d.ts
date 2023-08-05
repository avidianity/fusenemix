import type { Env } from '@/validators/env';
import { type Database } from '@/types/database';
import { type User } from '@/models/users';
import { type Server } from 'socket.io';

declare module 'fastify' {
  interface FastifyInstance {
    io: Server;
  }

  export interface FastifyRequest {
    db: Database;
    env: Env;
    user: User;
    config: {
      storage: string;
    };
    io: Server;
  }
}
