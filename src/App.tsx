import React, { useEffect, useState } from 'react';
import { CapacitorSQLite, SQLiteConnection } from '@capacitor-community/sqlite';
import { create } from 'zustand';

const sqlite = new SQLiteConnection(CapacitorSQLite);

const useOfflineStore = create((set, get) => ({
  isDbReady: false,
  smoothedIncome: 3995.00,
  isAuthenticated: false,
  scamAnalysis: null,
  
  initDatabase: async () => {
    try {
      const isConn = (await sqlite.isConnection('monibuddy_db', false)).result;
      let db;
      if (isConn) {
        db = await sqlite.createConnection('monibuddy_db', false, 'no-encryption', 1, false);
      } else {
        db = await sqlite.createConnection('monibuddy_db', false, 'no-encryption', 1, false);
      }
      
      await db.open();
      
      const schema = 
        CREATE TABLE IF NOT EXISTS transactions (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          amount REAL NOT NULL,
          type TEXT NOT NULL,
          date TEXT NOT NULL
        );
        CREATE TABLE IF NOT EXISTS audit_logs (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          event TEXT NOT NULL,
          timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        );
      ;
      await db.execute(schema);
      console.log('Live SQLite Database and Schema Initialized Successfully.');
      set({ isDbReady: true });
    } catch (e) {
      console.error('Native SQLite Initialization Error:', e);
      set({ isDbReady: false });
    }
  },

  authenticate: (pin) => {
    if (pin === '0000') {
      set({ isAuthenticated: true });
    } else {
      alert('Local Auth Failed: Invalid PIN');
    }
  },

  runScamParser: (text) => {
    if (!text.trim()) return set({ scamAnalysis: null });
    const riskWords = ['urgent', 'bank', 'blocked', 'link', 'verify', 'account', 'password'];
    const matches = riskWords.filter(word => text.toLowerCase().includes(word));
    const riskLevel = matches.length > 1 ? 'High' : (matches.length === 1 ? 'Medium' : 'Low');
    set({ scamAnalysis: { level: riskLevel, triggers: matches } });
  }
}));

export default function App() {
  const { 
    isDbReady, initDatabase, 
    smoothedIncome, 
    isAuthenticated, authenticate,
    scamAnalysis, runScamParser
  } = useOfflineStore();

  const [pinInput, setPinInput] = useState('');
  const [smsInput, setSmsInput] = useState('');

  useEffect(() => {
    initDatabase();
  }, []);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-neutral-900 flex items-center justify-center p-6">
        <div className="bg-neutral-800 p-6 rounded-lg border border-neutral-700 w-full max-w-sm">
          <h2 className="text-2xl font-bold text-white mb-4 text-center">Local Authentication</h2>
          <input 
            type="password" 
            placeholder="Enter PIN (Try 0000)" 
            className="w-full p-3 mb-4 bg-neutral-900 border border-neutral-600 rounded text-white text-center tracking-widest"
            value={pinInput}
            onChange={(e) => setPinInput(e.target.value)}
          />
          <button 
            onClick={() => authenticate(pinInput)}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 rounded transition-colors">
            Unlock Vault
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-900 text-white p-6 font-sans">
      <header className="mb-6 border-b border-neutral-800 pb-4">
        <h1 className="text-3xl font-bold text-emerald-400">MoniBuddy Security Core</h1>
        <p className="text-sm text-neutral-400">Zero-Trust Vault Unlocked</p>
      </header>

      <main className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-neutral-800 p-4 rounded border border-neutral-700">
            <h2 className="text-lg font-semibold mb-1">SQLite Schema</h2>
            <p className={isDbReady ? 'text-emerald-400 text-sm' : 'text-yellow-500 text-sm'}>
              {isDbReady ? 'LIVE & MOUNTED' : 'CONNECTING NATIVE...'}
            </p>
          </div>
          <div className="bg-neutral-800 p-4 rounded border border-neutral-700">
            <h2 className="text-lg font-semibold mb-1">Income Engine</h2>
            <p className="text-blue-400 font-mono text-sm">R{smoothedIncome.toFixed(2)}</p>
          </div>
        </div>

        <div className="bg-neutral-800 p-4 rounded border border-neutral-700">
          <h2 className="text-xl font-semibold mb-4">Zero-Trust Scam Parser</h2>
          <textarea 
            className="w-full h-24 p-3 bg-neutral-900 border border-neutral-600 rounded text-white mb-3 text-sm"
            placeholder="Paste suspicious SMS here..."
            value={smsInput}
            onChange={(e) => setSmsInput(e.target.value)}
          />
          <button 
            onClick={() => runScamParser(smsInput)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm font-bold w-full">
            Analyze Threat
          </button>

          {scamAnalysis && (
            <div className="mt-4 p-3 bg-neutral-900 rounded border border-neutral-700">
              <p className="text-sm text-neutral-300 mb-1">Risk Assessment:</p>
              <p className={ont-bold }>
                {scamAnalysis.level.toUpperCase()}
              </p>
              {scamAnalysis.triggers.length > 0 && (
                <p className="text-xs text-neutral-500 mt-2">Detected triggers: {scamAnalysis.triggers.join(', ')}</p>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
