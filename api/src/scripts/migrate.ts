import { envSchema } from '@/validators/env';
import { migrate } from 'drizzle-orm/mysql2/migrator';
import * as database from '@/database';
import path from 'path';

async function main() {
  const env = await envSchema.validate(process.env, { abortEarly: false });

  const db = await database.connect(env);

  await migrate(db, {
    migrationsFolder: path.resolve(__dirname, '../migrations'),
  });
}

main()
  .catch(console.error)
  .finally(() => {
    process.exit(0);
  });
