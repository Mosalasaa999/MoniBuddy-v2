import React, { useEffect, useState } from 'react';
import { initDB } from './core/db/sqlite';
import { runMigrations } from './core/db/schema';
import { useLedgerStore } from './core/store/zustand';
import { LedgerView } from './ui/ledger/LedgerView';

const App: React.FC = () => {
  const [isBooted, setIsBooted] = useState(false);
  const [bootError, setBootError] = useState<string | null>(null);
  const hydrate = useLedgerStore((state) => state.hydrate);

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const start = performance.now();
        await initDB();
        await runMigrations();
        await hydrate();
        const duration = performance.now() - start;
        console.log(`[BOOT] Cold boot to hydrated state in ${duration.toFixed(2)}ms`);
        setIsBooted(true);
      } catch (err: any) {
        setBootError(err.message || 'Fatal initialization error.');
      }
    };
    bootstrap();
  }, [hydrate]);

  if (bootError) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-6 flex flex-col items-center justify-center gpu-accelerate">
        <div className="bg-red-950/80 border border-red-500 rounded-2xl p-5 max-w-sm w-full text-center shadow-2xl">
          <h2 className="text-lg font-bold text-red-400 mb-1">Architecture Exception</h2>
          <p className="text-xs text-red-200 font-mono break-words">{bootError}</p>
        </div>
      </div>
    );
  }

  if (!isBooted) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-400 flex flex-col items-center justify-center gap-3 gpu-accelerate">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs font-mono uppercase tracking-widest text-gray-500">Mounting MoniBuddy SQLite...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-900 text-white pt-8 pb-12 px-2 selection:bg-emerald-500 selection:text-white">
      <header className="text-center mb-4">
        <h1 className="text-xl font-black tracking-tight text-white">MoniBuddy</h1>
        <p className="text-[11px] text-gray-400 tracking-wider uppercase font-semibold">Township Financial Engine</p>
      </header>
      <LedgerView />
    </main>
  );
};

export default App;
