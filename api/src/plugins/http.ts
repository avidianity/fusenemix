import fp from 'fastify-plugin';
import axios from 'axios';

export default fp(
  async (fastify) => {
    const http = axios.create({
      headers: {
        Accept: 'application/json',
        'User-Agent': 'fusenemix-http',
      },
    });

    fastify.decorate('http', http);
  },
  { name: 'http' },
);
