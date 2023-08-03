import { envSchema } from '@/validators/env';
import * as database from '@/database';
import * as models from '@/models';

async function main() {
  const env = await envSchema.validate(process.env, { abortEarly: false });

  const db = await database.connect(env);

  for (const model of Object.values(models)) {
    await db.delete(model);
  }
}

main()
  .catch(console.error)
  .finally(() => {
    process.exit(0);
  });