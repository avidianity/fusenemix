import fp from 'fastify-plugin';
import type { Env } from '@/validators/env';
import * as database from '@/database';

export default fp<Env>(
  async (fastify, env) => {
    const { db, connection } = await database.connect(env);

    fastify.decorate('db', db);

    fastify.addHook('onClose', (_, done) => {
      connection.destroy();
      done();
    });
  },
  { name: 'database' },
);
