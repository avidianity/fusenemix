import fp from 'fastify-plugin';
import { Manager } from '@/lib/queue/manager';
import { Processor } from '@/lib/queue/processor';

export default fp(
  async (fastify) => {
    const manager = new Manager(fastify.redis);
    const processor = new Processor(fastify);

    await processor.readClasses();

    const bundle = {
      manager,
      processor,
    };

    fastify.decorate('queue', bundle);
  },
  { name: 'queue' },
);
