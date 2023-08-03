import '@/shims';
import fastify from 'fastify';
import path from 'path';
import { envSchema } from '@/validators/env';
import middleware from '@fastify/middie';
import multipart from '@fastify/multipart';
import cors from 'cors';
import * as database from '@/database';
import v1 from '@/routes/v1';
import { ValidationError } from 'yup';
import { json } from '@/helpers/response';
import { type ErrorHandler, type Route } from '@/types/routing';
import { HttpException } from '@/exceptions/http';
import { JsonWebTokenError } from 'jsonwebtoken';
import { loadEnv } from '@/lib/env';

const errorHandler = ((error, _, handler) => {
  if (error instanceof ValidationError) {
    json(handler, { error }, 422);
    return;
  } else if (error instanceof HttpException) {
    json(handler, error.message, error.statusCode);
    return;
  } else if (error instanceof JsonWebTokenError) {
    json(handler, { error: { message: error.message } }, 401);
  }

  handler.send(error);
}) satisfies ErrorHandler;

const route = (route: Route): Route => {
  return (fastify, _, done) => {
    fastify.setErrorHandler(errorHandler);
    route(fastify, _, done);
  };
};

async function main() {
  loadEnv();

  const env = await envSchema.validate(process.env, { abortEarly: false });

  const server = fastify({
    logger: true,
  });

  await server.register(middleware);
  await server.register(multipart);

  await server.register(route(v1), { prefix: 'v1' });

  await server.use(cors());

  const db = await database.connect(env);

  server.decorateRequest('db', { getter: () => db });
  server.decorateRequest('env', { getter: () => env });
  server.decorateRequest('config', {
    getter: () => ({
      storage: path.resolve(__dirname, './storage'),
    }),
  });

  server.setErrorHandler(errorHandler);

  const port = env.PORT ?? 8000;

  await server.listen({
    port,
  });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
