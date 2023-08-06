import { envSchema } from '@/validators/env';
import * as database from '@/database';
import * as models from '@/models';
import { loadEnv } from '@/lib/env';
export async function main() {
  await loadEnv();
  const env = await envSchema.validate(process.env, { abortEarly: false });

  const { db, connection } = await database.connect(env);

  await connection.query('SET foreign_key_checks = 0;');

  for (const model of Object.values(models)) {
    await db.delete(model);
  }

  const query = `SELECT table_name as tableName FROM information_schema.tables WHERE table_schema = '${env.DB_NAME}';`;

  const [tableNames] = await connection.query(query);

  if (Array.isArray(tableNames)) {
    await Promise.all(
      tableNames.map(
        async ({ tableName }: any) =>
          await connection.query(`DROP TABLE IF EXISTS ${tableName};`),
      ),
    );
  }

  await connection.query('SET foreign_key_checks = 1;');
}

main()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
