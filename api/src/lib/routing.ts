import { type ResourceOptions } from '@/types/routing';

export function resource({
  fastify,
  path,
  controller,
  middleware,
}: ResourceOptions) {
  if (controller.index) {
    fastify.route({
      method: 'GET',
      url: path,
      preHandler: middleware,
      handler: controller.index,
    });
  }

  if (controller.show) {
    fastify.route({
      method: 'GET',
      url: `${path}/:id`,
      preHandler: middleware,
      handler: controller.show,
    });
  }

  if (controller.store) {
    fastify.route({
      method: 'POST',
      url: path,
      preHandler: middleware,
      handler: controller.store,
    });
  }

  if (controller.update) {
    fastify.route({
      method: ['PUT', 'PATCH'],
      url: `${path}/:id`,
      preHandler: middleware,
      handler: controller.update,
    });
  }

  if (controller.destroy) {
    fastify.route({
      method: 'DELETE',
      url: `${path}/:id`,
      preHandler: middleware,
      handler: controller.destroy,
    });
  }
}
