import { main } from '@/main';
import tap from 'tap';
import * as utils from 'tests/utils';
import * as models from '@/models';
import { ulid } from 'ulid';
import { eq } from 'drizzle-orm';
import { createToken } from '@/lib/auth';

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

tap.test('check', async (t) => {
  t.plan(2);

  const { server } = await main({
    logger: false,
  });

  t.teardown(() => {
    server.close();
  });

  const id = ulid();

  await server.db.insert(models.users).values({
    id,
    firstName: utils.faker.person.firstName(),
    lastName: utils.faker.person.lastName(),
    email: utils.faker.internet.email(),
    password: utils.faker.internet.password(),
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  const [user] = await server.db
    .select()
    .from(models.users)
    .where(eq(models.users.id, id))
    .limit(1);

  const { token } = await createToken(user, server.env);

  await server.listen();

  const client = utils.createClient(server);

  const response = await client.get('/v1/auth/check', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  t.equal(response.status, 200);
  t.has(response.data, {
    data: {
      id: user.id,
    },
  });
});
