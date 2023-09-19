import { type JobContract } from '@/types/contracts/job';
import { MissingMappingException } from '@/exceptions/queue/missing-mapping';
import { type Constructable } from '@/types/classes';
import type { FastifyInstance } from 'fastify';
import { readdir } from 'fs/promises';
import { join } from 'path';

export class Processor {
  protected mapping = new Map<string, Constructable<JobContract>>();

  constructor(protected fastify: FastifyInstance) {
    //
  }

  public async handle(type: string, ...args: any[]) {
    const Job = this.mapping.get(type);

    if (!Job) {
      throw new MissingMappingException(`${type} is missing mapping.`);
    }

    const job = new Job(...args);

    await this.process(job);
  }

  public async readClasses() {
    const directory = join(__dirname, './jobs');

    const files = await readdir(directory);
    const exportedClasses: Array<Constructable<JobContract>> = [];

    for (const file of files) {
      const importedModule = await import(join(directory, `./${file}`));
      for (const key in importedModule) {
        const artifact = importedModule[key];

        if (
          typeof artifact === 'function' &&
          artifact.prototype &&
          artifact.prototype.constructor &&
          'handle' in artifact.prototype &&
          typeof artifact.prototype.handle === 'function'
        ) {
          exportedClasses.push(artifact);
        }
      }
    }

    for (const Job of exportedClasses) {
      this.mapping.set(Job.name, Job);
    }
  }

  protected async process(job: JobContract) {
    try {
      await job.handle(this.fastify);

      const success = job.onSuccess?.();

      if (success instanceof Promise) {
        success.catch((error) => {
          console.error(`[Job:${job.constructor.name}]`, error);
        });
      }
    } catch (error) {
      if (error instanceof Error) {
        job.onError?.(error);
      }
    }
  }
}
