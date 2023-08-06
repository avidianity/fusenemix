import { main } from '@/main';
import tap from 'tap';
import * as utils from 'tests/utils';
import FormData from 'form-data';
import request from 'request';
import MockAdapter from 'axios-mock-adapter';

tap.test('pdf to docx', async (t) => {
  t.plan(2);

  const { server } = await main({
    logger: false,
  });

  const mock = new MockAdapter(server.http);

  // mock
  //   .onPost('https://api.cloudmersive.com/convert/pdf/to/docx')
  //   .reply(200, utils.faker.lorem.text());
  t.teardown(() => {
    mock.restore();
    server.close();
  });

  await server.listen();

  const client = utils.createClient(server);

  const payload = new FormData();

  payload.append(
    'file',
    request(
      'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    ),
  );

  const response = await client.post('/v1/file/pdf/to/docx', payload);

  t.equal(response.status, 200);
  t.ok(Array.isArray(response.data.data));
});
