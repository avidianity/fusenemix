import type { JobContract } from '@/types/contracts/job';

export class World implements JobContract {
  handle() {
    console.log('world job');
  }
}
