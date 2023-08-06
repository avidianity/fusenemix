import { ulid, varchar } from '@/lib/drizzle';
import { relations, type InferModel } from 'drizzle-orm';
import { mysqlTable, timestamp } from 'drizzle-orm/mysql-core';
import { financeTransactions } from '@/models/finance-transactions';

export const users = mysqlTable('users', {
  id: ulid('id').primaryKey(),
  firstName: varchar('first_name').notNull(),
  lastName: varchar('last_name').notNull(),
  email: varchar('email').notNull(),
  password: varchar('password').notNull(),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  financeTransactions: many(financeTransactions),
}));

export type User = InferModel<typeof users, 'select'>;

export type NewUser = InferModel<typeof users, 'insert'>;
