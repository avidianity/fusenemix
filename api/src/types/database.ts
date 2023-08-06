import { type MySql2Database } from 'drizzle-orm/mysql2';
import type * as schema from '@/models';

export type Database = MySql2Database<typeof schema>;
