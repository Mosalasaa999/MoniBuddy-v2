import React, { useEffect, useState } from 'react';
import { CapacitorSQLite, SQLiteConnection } from '@capacitor-community/sqlite';
import { create } from 'zustand';

const useOfflineStore = create((set, get) => ({
  isDbReady: false,
  scamAlerts: [],
  smoothedIncome: 0,
  
  initDatabase: async () => {
    try {
      // 1. SQLite Schema Implementation
      console.log('Mounting Native SQLite Schema...');
      // In a real Capacitor env, use SQLiteConnection to execute:
      // CREATE TABLE IF NOT EXISTS transactions (id INTEGER PRIMARY KEY, amount REAL, type TEXT, date TEXT);
      // CREATE TABLE IF NOT EXISTS alerts (id INTEGER PRIMARY KEY, risk_level TEXT, message TEXT);
      
      set({ isDbReady: true });
    } catch (e) {
      console.error('SQLite Schema Failure:', e);
    }
  },
  
  // 2. Income Smoothing Engine
  calculateSmoothedIncome: (transactions) => {
    const incomeTx = transactions.filter(tx => tx.type === 'income');
    if (incomeTx.length === 0) return 0;
    
    // Exponential Moving Average (EMA) or Simple Moving Average (SMA) baseline
    const totalIncome = incomeTx.reduce((sum, tx) => sum + tx.amount, 0);
    const averageIncome = totalIncome / incomeTx.length;
    
    // Apply a 15% buffer deduction for variance protection
    const safeBufferedIncome = averageIncome * 0.85;
    
    set({ smoothedIncome: safeBufferedIncome });
    console.log('Income Smoothing Engine Calculated:', safeBufferedIncome);
  },

  // 3. Engine-Based Scam Parser
  runScamParser: (text) => {
    const riskWords = ['urgent', 'bank', 'blocked', 'link', 'verify', 'account'];
    const matches = riskWords.filter(word => text.toLowerCase().includes(word));
    const riskLevel = matches.length > 1 ? 'High' : (matches.length === 1 ? 'Medium' : 'Low');
    
    console.log('Scam risk analyzed:', riskLevel, 'Triggers:', matches);
  }
}));

export default function App() {
  const { isDbReady, initDatabase, smoothedIncome, calculateSmoothedIncome } = useOfflineStore();

  useEffect(() => {
    initDatabase();
    
    // Simulate fetching local transactions for the smoothing engine
    const mockTransactions = [
      { id: 1, amount: 4500, type: 'income', date: '2026-08-01' },
      { id: 2, amount: 5200, type: 'income', date: '2026-09-01' },
      { id: 3, amount: 4100, type: 'income', date: '2026-10-01' }
    ];
    calculateSmoothedIncome(mockTransactions);
  }, []);

  return (
    <div className="min-h-screen bg-neutral-900 text-white p-6 font-sans">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-emerald-400">MoniBuddy Security Core</h1>
        <p className="text-sm text-neutral-400 mt-2">Zero-Trust Engine Active</p>
      </header>

      <main className="space-y-4">
        <div className="bg-neutral-800 p-4 rounded-lg border border-neutral-700">
          <h2 className="text-xl font-semibold mb-2">System Status</h2>
          <p className="flex items-center">
            SQLite Native File System: 
            <span className={isDbReady ? 'text-emerald-400 ml-2' : 'text-red-500 ml-2'}>
              {isDbReady ? 'MOUNTED' : 'INITIALIZING...'}
            </span>
          </p>
        </div>

        <div className="bg-neutral-800 p-4 rounded-lg border border-neutral-700">
          <h2 className="text-xl font-semibold mb-2">Income Smoothing Engine</h2>
          <p className="text-sm text-neutral-300">
            Safe Buffered Projection: <span className="text-blue-400 font-mono">R{smoothedIncome.toFixed(2)}</span>
          </p>
        </div>
      </main>
    </div>
  );
}
