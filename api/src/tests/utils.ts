import axios from 'axios';
import type { FastifyInstance } from 'fastify';

export function createClient(server: FastifyInstance) {
  const address = server.server.address();

  const port = typeof address === 'object' ? address?.port : null;

  return axios.create({
    baseURL: port ? `http://localhost:${port}` : (address as string),
  });
}
