import { loadEnv } from '@/lib/env';
import database from '@/plugins/database';
import queue from '@/plugins/queue';
import redis from '@/plugins/redis';
import { envSchema } from '@/validators/env';
import { jobEventSchema } from '@/validators/queue/job';
import fastify from 'fastify';

export async function main() {
  const app = fastify();

  await loadEnv();

  const env = await envSchema.validate(process.env, {
    abortEarly: false,
  });

  await app.register(database, env);
  await app.register(redis, env);
  await app.register(queue);

  app.redis.subscribe('job', async (payload) => {
    const { type, args } = await jobEventSchema
      .validate(JSON.parse(payload))
      .catch(async (error) => {
        console.error('job did not pass validation', { error, payload });

        return { type: null, args: null };
      });

    if (!type && !args) {
      return;
    }

    try {
      await app.queue.processor.handle(type, ...args);
    } catch (error) {
      console.error('Unable to handle job', {
        error,
        type,
        args,
      });
    }
  });

  process.on('SIGINT', () => {
    app.redis.quit().finally(() => process.exit(0));
  });

  console.info('Queue worker running');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
