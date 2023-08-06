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
  preHandlerHookHandler,
  preHandlerAsyncHookHandler,
  FastifyInstance,
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
  handler: FastifyReply,
) => void | Promise<void>;

export type Middleware = preHandlerHookHandler | preHandlerAsyncHookHandler;

export interface ResourceController {
  index?: Handler;
  show?: Handler;
  store?: Handler;
  update?: Handler;
  destroy?: Handler;
}

export interface ResourceOptions {
  fastify: FastifyInstance;
  path: string;
  controller: ResourceController;
  middleware?: Middleware;
}
