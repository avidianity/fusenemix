import { type Handler } from '@/types/routing';
import * as models from '@/models';
import { json } from '@/helpers/response';
import { modelIdSchema } from '@/validators/controllers/model';
import { type SQL, and, eq, gte, lte } from 'drizzle-orm';
import { NotFoundException } from '@/exceptions/not-found';
import { financeTransactionSchema } from '@/validators/models/finance-transaction';
import { type NewFinanceTransaction } from '@/models/finance-transactions';
import { ulid } from 'ulid';
import { indexQuerySchema } from '@/validators/controllers/v1/finance/transaction';

export const index: Handler = async function (request, response) {
  const params = await indexQuerySchema.validate(request.query, {
    abortEarly: false,
  });

  const filters: SQL[] = [
    eq(models.financeTransactions.userId, request.user.id),
  ];

  if (params.from) {
    filters.push(gte(models.financeTransactions.date, params.from));
  }

  if (params.to) {
    filters.push(lte(models.financeTransactions.date, params.to));
  }

  const query = this.db
    .select()
    .from(models.financeTransactions)
    .where(and(...filters));

  const transactions = await query;

  json(response, {
    data: transactions,
  });
};

export const show: Handler = async function (request, response) {
  const { id } = await modelIdSchema.validate(request.params);

  const [transaction] = await this.db
    .select()
    .from(models.financeTransactions)
    .where(
      and(
        eq(models.financeTransactions.id, id),
        eq(models.financeTransactions.userId, request.user.id),
      ),
    )
    .limit(1);

  if (!transaction) {
    throw new NotFoundException({
      error: {
        message: 'Transaction not found.',
      },
    });
  }

  json(response, {
    data: transaction,
  });
};

export const store: Handler = async function (request, response) {
  const data = await financeTransactionSchema.validate(request.body, {
    abortEarly: false,
  });

  const id = ulid();

  const payload: NewFinanceTransaction = {
    id,
    userId: request.user.id,
    ...data,
  };

  await this.db.insert(models.financeTransactions).values(payload);

  const [transaction] = await this.db
    .select()
    .from(models.financeTransactions)
    .where(
      and(
        eq(models.financeTransactions.id, id),
        eq(models.financeTransactions.userId, request.user.id),
      ),
    )
    .limit(1);

  json(
    response,
    {
      data: transaction,
    },
    201,
  );
};

export const update: Handler = async function (request, response) {
  const { id } = await modelIdSchema.validate(request.params);
  const data = await financeTransactionSchema.partial().validate(request.body, {
    abortEarly: false,
  });

  const [exists] = await this.db
    .select()
    .from(models.financeTransactions)
    .where(
      and(
        eq(models.financeTransactions.id, id),
        eq(models.financeTransactions.userId, request.user.id),
      ),
    )
    .limit(1);

  if (!exists) {
    throw new NotFoundException({
      error: {
        message: 'Transaction not found.',
      },
    });
  }

  await this.db
    .update(models.financeTransactions)
    .set(data)
    .where(
      and(
        eq(models.financeTransactions.id, id),
        eq(models.financeTransactions.userId, request.user.id),
      ),
    );

  const [transaction] = await this.db
    .select()
    .from(models.financeTransactions)
    .where(
      and(
        eq(models.financeTransactions.id, id),
        eq(models.financeTransactions.userId, request.user.id),
      ),
    )
    .limit(1);

  json(response, {
    data: transaction,
  });
};

export const destroy: Handler = async function (request, response) {
  const { id } = await modelIdSchema.validate(request.params);

  const [transaction] = await this.db
    .select()
    .from(models.financeTransactions)
    .where(eq(models.financeTransactions.id, id))
    .where(eq(models.financeTransactions.userId, request.user.id))
    .limit(1);

  if (!transaction) {
    throw new NotFoundException({
      error: {
        message: 'Transaction not found.',
      },
    });
  }

  await this.db
    .delete(models.financeTransactions)
    .where(
      and(
        eq(models.financeTransactions.userId, request.user.id),
        eq(models.financeTransactions.id, id),
      ),
    );

  response.status(204);
};
