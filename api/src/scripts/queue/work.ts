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

  app.redis.subscribe('job', (payload) => {
    (async () => {
      const { type, args } = await jobEventSchema
        .validate(JSON.parse(payload), {
          abortEarly: false,
        })
        .catch(async (error) => {
          console.error('Job did not pass validation', { error, payload });

          return { type: null, args: null };
        });

      if (!type && !args) {
        return;
      }

      try {
        console.info(`[Job:${type}] Processing`);

        await app.queue.processor.handle(type, ...args);

        console.info(`[Job:${type}] Processed`);
      } catch (error) {
        console.error('Unable to handle job', {
          error,
          type,
          args,
        });
      }
    })().catch((error) => {
      console.error('Unable to handle job', {
        error,
        payload,
      });
    });
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
