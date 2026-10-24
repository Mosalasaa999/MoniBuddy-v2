import { getDB } from './sqlite';

export const runMigrations = async () => {
  const db = getDB();
  const schema = `
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
  `;
  await db.execute(schema);
  console.log('[DB] Migrations applied successfully.');
};
