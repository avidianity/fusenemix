import fp from 'fastify-plugin';
import type { Env } from '@/validators/env';
import { createClient } from 'redis';

export default fp<Env>(
  async (fastify, env) => {
    await new Promise<void>((resolve, reject) => {
      (async () => {
        try {
          let credentials = '';

          if (env.REDIS_USER && env.REDIS_PASS) {
            credentials = `${env.REDIS_USER}:${env.REDIS_PASS}@`;
          }

          const redis = createClient({
            url: `redis://${credentials}${env.REDIS_HOST}:${env.REDIS_PORT}`,
          });

          redis.on('error', reject);

          await redis.connect();

          fastify.decorate('redis', redis);

          fastify.addHook('onClose', async () => {
            await redis.quit();
          });

          resolve();
        } catch (error) {
          reject(error);
        }
      })();
    });
  },
  { name: 'redis' },
);
