import { Capacitor } from '@capacitor/core';
import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';

const sqlite = new SQLiteConnection(CapacitorSQLite);
let db: SQLiteDBConnection | null = null;

export const initDB = async (): Promise<SQLiteDBConnection> => {
  if (Capacitor.getPlatform() === 'web') {
    throw new Error('Web platform blocked. MoniBuddy requires Android bare metal for native encryption.');
  }

  try {
    const isConn = (await sqlite.isConnection('monibuddy_db', false)).result;
    if (isConn) {
      db = await sqlite.retrieveConnection('monibuddy_db', false);
    } else {
      db = await sqlite.createConnection('monibuddy_db', false, 'no-encryption', 1, false);
    }

    await db.open();

    // Android fix: PRAGMA journal_mode returns 'wal', so it must be queried safely
    try {
      await db.query('PRAGMA journal_mode=WAL;');
    } catch (e) {
      console.warn('[DB] WAL mode already handled by OS:', e);
    }

    console.log('[DB] Native SQLite connection active and ready.');
    return db;
  } catch (error) {
    console.error('[DB] Catastrophic mount failure:', error);
    throw error;
  }
};

export const getDB = (): SQLiteDBConnection => {
  if (!db) throw new Error('[DB] Database accessed prior to initDB().');
  return db;
};
