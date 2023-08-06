import { ulid, varchar } from '@/lib/drizzle';
import { relations, type InferModel } from 'drizzle-orm';
import { date, float, mysqlTable } from 'drizzle-orm/mysql-core';
import { users } from '@/models/users';

export const financeTransactions = mysqlTable('finance_transactions', {
  id: ulid('id').primaryKey(),
  date: date('date').notNull(),
  amount: float('amount').notNull(),
  category: varchar('category').notNull(),
  subCategory: varchar('sub_category'),
  paymentMethod: varchar('payment_method').notNull(),
  recipient: varchar('recipient').notNull(),
  type: varchar('type').notNull(),
  userId: ulid('user_id')
    .notNull()
    .references(() => users.id),
});

export const financeTransactionsRelations = relations(
  financeTransactions,
  ({ one }) => ({
    user: one(users, {
      fields: [financeTransactions.userId],
      references: [users.id],
    }),
  }),
);

export type FinanceTransaction = InferModel<
  typeof financeTransactions,
  'select'
>;

export type NewFinanceTransaction = InferModel<
  typeof financeTransactions,
  'insert'
>;
