import fp from 'fastify-plugin';
import { Server } from 'socket.io';

export default fp(
  async (fastify) => {
    const io = new Server(fastify.server, {
      cors: {
        origin: (origin, callback) => {
          callback(null, origin);
        },
      },
    });

    fastify.decorate('io', io);
    fastify.decorateRequest('io', {
      getter: () => io,
    });

    fastify.addHook('onClose', (fastify, done) => {
      fastify.io.close();
      done();
    });
  },
  { name: 'socket.io' },
);
