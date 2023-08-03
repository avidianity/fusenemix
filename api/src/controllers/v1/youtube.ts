import { type Handler } from '@/types/routing';
import { mp3Schema } from '@/validators/controllers/v1/youtube';
import ytdl from 'ytdl-core';
import { InternalServerErrorException } from '@/exceptions/internal-server-error';
import Downloader from 'youtube-mp3-downloader';
import * as os from '@/helpers/os';
import { ulid } from 'ulid';
import { type VideoInfo } from '@/types/youtube';

export const mp3: Handler = async (request, response) => {
  const payload = await mp3Schema.validate(request.query);

  const storage = request.config.storage;

  try {
    const info = await ytdl.getInfo(payload.url);
    const { title, videoId } = info.videoDetails;

    const downloader = new Downloader({
      ffmpegPath: await os.findBinary('ffmpeg'),
      outputPath: storage,
      queueParallelism: 1,
      progressTimeout: 2000,
    });

    const fileName = `${ulid()}.mp3`;

    downloader.download(videoId, fileName);

    const results = await new Promise<VideoInfo>((resolve, reject) => {
      downloader.on('finished', (error, data) => {
        if (error instanceof Error) {
          reject(error);
          return;
        }

        resolve(data);
      });

      downloader.on('error', (error) => {
        reject(error);
      });
    });

    const buffer = await os.readFile(results.file, 'utf8');

    os.unlink(results.file).catch(console.error);

    return await response
      .header('Content-Disposition', `attachment; filename="${title}.mp3"`)
      .header('Content-Type', 'audio/mpeg')
      .send(buffer);
  } catch (error) {
    console.error(error);
    const exception = new InternalServerErrorException({
      error,
    });

    exception.cause = error;

    throw exception;
  }
};
