import { main } from '@/main';
import tap from 'tap';
import * as utils from 'tests/utils';
import * as os from '@/helpers/os';
import _ from 'lodash';
import path from 'path';
import FormData from 'form-data';
import request from 'request';
import MockAdapter from 'axios-mock-adapter';

tap.test('download', async (t) => {
  t.plan(3);

  const { server } = await main({
    logger: false,
  });

  t.teardown(() => {
    server.close();
  });

  await server.listen();

  const fileName = `${_.snakeCase(utils.faker.lorem.words())}.txt`;
  const filePath = path.resolve(server.config.storage, fileName);
  const content = utils.faker.lorem.text();

  await os.writeFile(filePath, content);

  const client = utils.createClient(server);

  const response = await client.get('/v1/file/download', {
    params: {
      fileName,
    },
    responseType: 'text',
  });

  await os.unlink(filePath);

  t.equal(response.status, 200);
  t.equal(response.data, content);
  t.equal(response.headers['content-type'], 'application/octet-stream');
});

tap.test('pdf to docx', async (t) => {
  t.plan(2);

  const { server } = await main({
    logger: false,
  });

  const mock = new MockAdapter(server.http);

  mock
    .onPost('https://api.cloudmersive.com/convert/pdf/to/docx')
    .reply(200, utils.faker.lorem.text());

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

  const isArray = Array.isArray(response.data.data);

  t.equal(response.status, 200);
  t.ok(isArray);

  if (isArray) {
    for (const { fileName } of response.data.data) {
      await os.unlink(path.resolve(server.config.storage, fileName));
    }
  }
});
