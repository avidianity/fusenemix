import { main } from '@/main';
import tap from 'tap';
import * as utils from '@/tests/utils';

tap.test('login', async (t) => {
  t.plan(2);

  const { server } = await main({
    logger: false,
  });

  t.teardown(() => {
    server.close();
  });

  await server.listen();

  const client = utils.createClient(server);

  const payload = {
    email: 'manlupigjohnmichael@gmail.com',
    password: 'password',
  };

  const response = await client.post('/v1/auth/login', payload);

  t.equal(response.status, 200);
  t.has(response.data, {
    data: {
      email: 'manlupigjohnmichael@gmail.com',
    },
  });
});

tap.test('register', async (t) => {
  t.plan(2);

  const { server } = await main({
    logger: false,
  });

  t.teardown(() => {
    server.close();
  });

  await server.listen();

  const client = utils.createClient(server);

  const payload = {
    firstName: utils.faker.person.firstName(),
    lastName: utils.faker.person.lastName(),
    email: utils.faker.internet.email(),
    password: 'password',
  };

  const response = await client.post('/v1/auth/register', payload);

  t.equal(response.status, 200);
  t.has(response.data, {
    data: {
      email: payload.email,
    },
  });
});
