import { envSchema } from '@/validators/env';
import { migrate } from 'drizzle-orm/mysql2/migrator';
import * as database from '@/database';
import path from 'path';
import { loadEnv } from '@/lib/env';

async function main() {
  loadEnv();
  const env = await envSchema.validate(process.env, { abortEarly: false });

  const db = await database.connect(env);

  await migrate(db, {
    migrationsFolder: path.resolve(__dirname, '../migrations'),
  });
}

main()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
