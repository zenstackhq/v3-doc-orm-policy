import { SqlJsDialect } from '@zenstackhq/kysely-sql-js';
import { ZenStackClient } from '@zenstackhq/runtime';
import initSqlJs from 'sql.js';
import { schema } from './zenstack/schema';

export async function createClient() {
  // initialize sql.js engine
  const SQL = await initSqlJs();

  // create database client with sql.js dialect
  const db = new ZenStackClient(schema, {
    dialect: new SqlJsDialect({ sqlJs: new SQL.Database() }),
  });

  // push schema to the database
  // the `$pushSchema` API is for testing purposes only
  await db.$pushSchema();

  return db;
}
