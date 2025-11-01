import { SqlJsDialect } from '@zenstackhq/kysely-sql-js';
import { ZenStackClient } from '@zenstackhq/orm';
import { SchemaDef } from '@zenstackhq/orm/schema';
import initSqlJs from 'sql.js';

export async function createClient<Schema extends SchemaDef>(schema: Schema) {
    // initialize sql.js engine
    const SQL = await initSqlJs();

    // create database client with sql.js dialect
    const db = new ZenStackClient(schema, {
        dialect: new SqlJsDialect({ sqlJs: new SQL.Database() }),
    } as any);

    // push schema to the database
    // the `$pushSchema` API is for testing purposes only
    await db.$pushSchema();

    return db;
}
