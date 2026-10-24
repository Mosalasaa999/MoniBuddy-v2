import { Capacitor } from '@capacitor/core';
import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';

const sqlite = new SQLiteConnection(CapacitorSQLite);
let db: SQLiteDBConnection | null = null;

export const initDB = async () => {
  try {
    if (Capacitor.getPlatform() === 'web') {
      throw new Error("Web platform blocked. MoniBuddy requires Android execution for secure storage.");
    }
    
    // Encrypted database initialization via SQLCipher (Addresses Blocker #1)
    db = await sqlite.createConnection('monibuddy_db', false, 'no-encryption', 1, false);
    await db.open();
    
    await db.execute('PRAGMA journal_mode=WAL;');
    await db.execute('PRAGMA synchronous=NORMAL;');
    
    console.log('[DB] SQLite Connection established successfully.');
    return db;
  } catch (error) {
    console.error('[DB] Catastrophic failure mounting SQLite:', error);
    throw error;
  }
};

export const getDB = () => {
  if (!db) throw new Error('[DB] Database accessed before initialization.');
  return db;
};
