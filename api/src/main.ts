import fastify from 'fastify';
import dotenv from 'dotenv';
import path from 'path';
import { envSchema } from '@/validators/env';
import middleware from '@fastify/middie';
import cors from 'cors';
import * as database from '@/database';
import v1 from '@/routes/v1';
import { ValidationError } from 'yup';
import { json } from '@/helpers/response';
import { ErrorHandler, Route } from '@/types/routing';
import { HttpException } from '@/exceptions/http';

const errorHandler = ((error, _, handler) => {
  if (error instanceof ValidationError) {
    return json(handler, { error }, 422);
  } else if (error instanceof HttpException) {
    return json(handler, error.message, error.statusCode);
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
  dotenv.config({
    path: path.resolve(__dirname, '../.env'),
  });

  const env = await envSchema.validate(process.env, { abortEarly: false });

  const server = fastify({
    logger: true,
  });

  await server.register(middleware);

  server.register(route(v1), { prefix: 'v1' });

  await server.use(cors());

  const db = await database.connect(env);

  server.decorateRequest('db', { getter: () => db });
  server.decorateRequest('env', { getter: () => env });

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
