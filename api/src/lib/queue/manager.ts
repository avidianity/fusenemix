import type { Constructable } from '@/types/classes';
import type { JobContract } from '@/types/contracts/job';
import type { RedisClient } from '@/types/redis';

export class Manager {
  constructor(protected redis: RedisClient) {
    //
  }

  async dispatch<T extends Constructable<JobContract>>(
    job: T,
    ...args: ConstructorParameters<T>
  ) {
    await this.redis.publish(
      'job',
      JSON.stringify({
        type: job.name,
        args,
      }),
    );
  }
}
