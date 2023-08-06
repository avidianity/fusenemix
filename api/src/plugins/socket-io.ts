import fp from 'fastify-plugin';
import { Server, type ServerOptions } from 'socket.io';

export default fp<Partial<ServerOptions>>(
  async (fastify, options) => {
    const io = new Server(fastify.server, options);

    fastify.decorate('io', io);

    fastify.addHook('onClose', (fastify, done) => {
      fastify.io.close();
      done();
    });
  },
  { name: 'socket.io' },
);
