import { type JobContract } from '@/types/contracts/job';
import { MissingMappingException } from '@/exceptions/queue/missing-mapping';
import { type Constructable } from '@/types/classes';
import { classes } from '@/lib/queue/classes';
import type { FastifyInstance } from 'fastify';

export class Processor {
  protected mapping = new Map<string, Constructable<JobContract>>(
    classes.map((Job) => [Job.name, Job]),
  );

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

  protected async process(job: JobContract) {
    try {
      await job.handle(this.fastify);

      job.onSuccess?.();
    } catch (error) {
      if (error instanceof Error) {
        job.onError?.(error);
      }
    }
  }
}
