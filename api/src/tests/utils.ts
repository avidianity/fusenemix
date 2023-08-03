import axios from 'axios';
import type { FastifyInstance } from 'fastify';
import { faker as fakerjs } from '@faker-js/faker';

export function createClient(server: FastifyInstance) {
  const address = server.server.address();

  const port = typeof address === 'object' ? address?.port : null;

  return axios.create({
    baseURL: port ? `http://localhost:${port}` : (address as string),
  });
}

export const faker = fakerjs;
