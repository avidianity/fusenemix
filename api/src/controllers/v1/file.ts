import { json } from '@/helpers/response';
import { type Handler } from '@/types/routing';
import { resolve } from 'path';
import { ulid } from 'ulid';
import mimeTypes from 'mime-types';
import fs from 'fs';
import * as os from '@/helpers/os';
import { isAxiosError } from 'axios';
import { downloadSchema } from '@/validators/controllers/v1/file';
import { BadRequestException } from '@/exceptions/bad-request';
import FormData from 'form-data';

export const download: Handler = async function (request, response) {
  const validated = await downloadSchema.validate(request.query);

  try {
    const buffer = await os.readFile(
      resolve(this.config.storage, validated.fileName),
    );

    return await response.send(buffer);
  } catch (error) {
    const exception = new BadRequestException({
      message: 'File does not exist.',
    });

    exception.cause = error;

    throw exception;
  }
};

export const pdfToDocx: Handler = async function (request, response) {
  const files = request.files();
  const temp: Array<{
    id: string;
    fileName: string;
    realFileName: string;
    path: string;
  }> = [];
  const payload: any[] = [];
  const storage = this.config.storage;

  for await (const data of files) {
    const id = ulid();

    const extension = mimeTypes.extension(data.mimetype);

    const fileName = `${id}.${extension}`;

    const path = resolve(storage, `./${fileName}`);

    const stream = fs.createWriteStream(path);

    await os.pump(data.file, stream);

    if (!extension || extension !== 'pdf') {
      await os.unlink(path);
    } else {
      temp.push({ id, fileName, realFileName: data.filename, path });
    }
  }
  const apiKey = this.env.CLOUDMERSIVE_KEY;
  const url = 'https://api.cloudmersive.com/convert/pdf/to/docx';

  for (const entry of temp) {
    try {
      const pdfData = await os.readFile(entry.path);
      const fileName = `${entry.id}.docx`;
      const docxFilePath = resolve(storage, `./${fileName}`);

      const data = new FormData();

      data.append('inputFile', pdfData, 'file');

      const response = await this.http.post(url, data, {
        headers: {
          Apikey: apiKey,
        },
        responseType: 'arraybuffer',
      });

      await os.writeFile(docxFilePath, response.data);

      await os.unlink(entry.path);

      await os.sleep(1000);

      payload.push({
        id: entry.id,
        fileName,
      });
    } catch (error) {
      if (isAxiosError(error)) {
        json(response, error.response, error.response?.status ?? 500);
        return;
      }
      throw error;
    }
  }

  json(response, {
    data: payload,
  });
};
