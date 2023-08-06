import { type Writable } from 'drizzle-orm';
import {
  type MySqlVarCharConfig,
  char,
  varchar as baseVarchar,
} from 'drizzle-orm/mysql-core';

export function ulid(name: string) {
  return char(name, { length: 26 });
}

export function varchar<
  TName extends string,
  U extends string,
  T extends Readonly<[U, ...U[]]>,
>(name: TName, options: MySqlVarCharConfig<T | Writable<T>> = { length: 256 }) {
  return baseVarchar(name, options);
}
