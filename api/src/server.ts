import { main } from '@/main';

main({
  logger: {
    level: 'info',
    transport: {
      target: 'pino-pretty',
    },
  },
})
  .then(({ server, env }) => {
    server.listen({
      host: '0.0.0.0',
      port: env.PORT ?? 8000,
    });
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
