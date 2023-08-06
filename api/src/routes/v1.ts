import { v1 } from '@/controllers';
import { type Route } from '@/types/routing';
import * as middleware from '@/middleware';
import { resource } from '@/lib/routing';

export default ((fastify, _, done) => {
  fastify.post('/auth/login', v1.auth.login);
  fastify.post('/auth/register', v1.auth.register);
  fastify.route({
    method: 'GET',
    url: '/auth/check',
    preHandler: middleware.auth,
    handler: v1.auth.check,
  });

  fastify.get('/file/download', v1.file.download);
  fastify.post('/file/pdf/to/docx', v1.file.pdfToDocx);

  fastify.get('/youtube/mp3', v1.youtube.mp3);

  resource({
    fastify,
    controller: v1.finance.transactions,
    path: '/finance/transactions',
    middleware: middleware.auth,
  });

  done();
}) satisfies Route;
