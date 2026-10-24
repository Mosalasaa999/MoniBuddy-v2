import { getDB } from './sqlite';

export const runMigrations = async (): Promise<void> => {
  const db = getDB();

  const ddl = `
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      phone_hash TEXT UNIQUE NOT NULL,
      display_name TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      deleted_at TEXT,
      device_id TEXT NOT NULL,
      schema_version INTEGER DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS income_events (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      amount_cents INTEGER NOT NULL,
      received_at TEXT NOT NULL,
      source TEXT NOT NULL,
      confidence TEXT CHECK(confidence IN ('ESTIMATE', 'CONFIRMED')),
      note TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      deleted_at TEXT,
      device_id TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS obligations (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      category TEXT NOT NULL,
      amount_cents INTEGER NOT NULL,
      due_date TEXT,
      recurrence TEXT,
      priority INTEGER DEFAULT 1,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      deleted_at TEXT,
      device_id TEXT NOT NULL
    );
  `;

  await db.execute(ddl);
  console.log('[DB] Core DDL schemas mounted successfully.');
};
