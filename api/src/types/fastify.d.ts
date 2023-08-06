import type { Env } from '@/validators/env';
import type { Database } from '@/types/database';
import type { User } from '@/models/users';
import type { Server } from 'socket.io';
import type { RedisClient } from '@/types/redis';
import type { AxiosInstance } from 'axios';

declare module 'fastify' {
  interface FastifyInstance {
    db: Database;
    env: Env;
    io: Server;
    redis: RedisClient;
    http: AxiosInstance;
    config: {
      storage: string;
    };
  }

  export interface FastifyRequest {
    user: User;
  }
}
