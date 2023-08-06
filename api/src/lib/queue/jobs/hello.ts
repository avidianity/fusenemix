import type { JobContract } from '@/types/contracts/job';

export class Hello implements JobContract {
  constructor(protected name: string) {
    //
  }

  handle() {
    console.log(`hello ${this.name} job`);
  }
}
