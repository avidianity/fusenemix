import type { NextHandleFunction } from '@fastify/middie';
import type {
  FastifyPluginOptions,
  RawServerDefault,
  FastifyTypeProvider,
  FastifyBaseLogger,
  FastifyPluginCallback,
  RouteHandlerMethod,
  FastifyError,
  FastifyRequest,
  FastifyReply,
} from 'fastify';

export type Route = FastifyPluginCallback<
  FastifyPluginOptions,
  RawServerDefault,
  FastifyTypeProvider,
  FastifyBaseLogger
>;

export type Handler = RouteHandlerMethod;

export type ErrorHandler = (
  error: FastifyError,
  request: FastifyRequest,
  handler: FastifyReply
) => void | Promise<void>;

export type Middleware = NextHandleFunction;
