import type { Manager as QueueManager } from '@/lib/queue/manager';
import type { Processor as QueueProcessor } from '@/lib/queue/processor';

declare module 'fastify' {
  interface FastifyInstance {
    queue: {
      manager: QueueManager;
      processor: QueueProcessor;
    };
  }
}
