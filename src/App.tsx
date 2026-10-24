import React, { useEffect, useState } from 'react';
import { initDB } from './core/db/sqlite';
import { runMigrations } from './core/db/schema';
import { LedgerView } from './ui/ledger/LedgerView';

const App: React.FC = () => {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const setup = async () => {
      try {
        await initDB();
        await runMigrations();
        setIsReady(true);
      } catch (err: any) {
        setError(err.message || 'Failed to init');
      }
    };
    setup();
  }, []);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-6 flex flex-col items-center justify-center gpu-accelerate">
        <div className="bg-red-900/50 p-4 rounded-lg border border-red-500 max-w-sm w-full text-center">
          <h1 className="text-xl font-bold text-red-400 mb-2">Web Browser Blocked</h1>
          <p className="text-red-200 font-mono text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (!isReady) return <div className="min-h-screen bg-gray-900 text-gray-400 flex items-center justify-center gpu-accelerate">Mounting Secure Ledger...</div>;

  return (
    <main className="min-h-screen bg-gray-900 text-white pt-12">
      <h1 className="text-center text-2xl font-bold mb-8 tracking-tight text-gray-100">MoniBuddy</h1>
      <LedgerView />
    </main>
  );
};
export default App;
