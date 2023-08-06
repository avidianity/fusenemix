import '@/shims';
import fastify, {
  type FastifyBaseLogger,
  type FastifyHttpOptions,
} from 'fastify';
import path from 'path';
import { envSchema } from '@/validators/env';
import middleware from '@fastify/middie';
import multipart from '@fastify/multipart';
import cors from 'cors';
import v1 from '@/routes/v1';
import { ValidationError } from 'yup';
import { json } from '@/helpers/response';
import { type ErrorHandler, type Route } from '@/types/routing';
import { HttpException } from '@/exceptions/http';
import { JsonWebTokenError } from 'jsonwebtoken';
import { loadEnv } from '@/lib/env';
import type { Server } from 'http';
import formbody from '@fastify/formbody';
import qs from 'qs';
import socketIo from '@/plugins/socket-io';
import database from '@/plugins/database';
import redis from '@/plugins/redis';
import queue from '@/plugins/queue';
import http from '@/plugins/http';

const errorHandler = ((error, _, handler) => {
  if (error instanceof ValidationError) {
    json(handler, { error }, 422);
  } else if (error instanceof HttpException) {
    json(handler, error.message, error.statusCode);
  } else if (error instanceof JsonWebTokenError) {
    json(
      handler,
      {
        error: {
          message: error.message,
        },
      },
      401,
    );
  } else {
    handler.send(error);
  }
}) satisfies ErrorHandler;

const route = (route: Route): Route => {
  return (fastify, _, done) => {
    fastify.setErrorHandler(errorHandler);
    route(fastify, _, done);
  };
};

export async function main(
  options?: FastifyHttpOptions<Server, FastifyBaseLogger>,
) {
  await loadEnv();

  const env = await envSchema.validate(process.env, {
    abortEarly: false,
  });

  const server = fastify(options);

  await server.register(middleware);
  await server.register(multipart);
  await server.register(socketIo, {
    cors: {
      origin: (origin, callback) => {
        callback(null, origin);
      },
    },
    path: '/ws',
  });
  await server.register(formbody, {
    parser: (query) => qs.parse(query),
  });

  await server.register(route(v1), {
    prefix: 'v1',
  });

  await server.use(cors());

  await server.register(database, env);
  await server.register(redis, env);
  await server.register(queue);
  await server.register(http);

  server.decorate('env', env);
  server.decorate('config', {
    getter: () => ({
      storage: path.resolve(__dirname, './storage'),
    }),
  });

  server.setErrorHandler(errorHandler);

  server.ready((error) => {
    if (error) {
      throw error;
    }
  });

  return { server, env };
}
