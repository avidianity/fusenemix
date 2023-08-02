import { auth } from '@/controllers';
import { Route } from '@/types/routing';

export default ((fastify, _, done) => {
  fastify.post('/auth/login', auth.login);

  done();
}) satisfies Route;
