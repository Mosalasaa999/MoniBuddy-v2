import React, { useState } from 'react';
import { useLedgerStore } from '../../core/store/zustand';

export const LedgerView: React.FC = () => {
  const { balanceCents, transactions, addIncome } = useLedgerStore();
  const [randInput, setRandInput] = useState('');
  const [source, setSource] = useState('Cash');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseFloat(randInput);
    if (isNaN(parsed) || parsed <= 0) return;

    setIsSubmitting(true);
    const cents = Math.round(parsed * 100);

    try {
      const start = performance.now();
      await addIncome(cents, source);
      const delta = performance.now() - start;
      console.log(`[PERF] Native SQLite write completed in ${delta.toFixed(2)}ms`);
      setRandInput('');
    } catch (err) {
      console.error('[LEDGER] Failed writing transaction:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 flex flex-col gap-5 gpu-accelerate">
      {/* Balance Card */}
      <div className="bg-gray-800 border border-gray-700/80 rounded-2xl p-6 shadow-xl gpu-accelerate">
        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Available Balance</span>
        <div className="text-4xl font-black text-emerald-400 mt-2 font-mono">
          R {(balanceCents / 100).toFixed(2)}
        </div>
        <p className="text-xs text-gray-500 mt-2">Zero-Data Offline Ledger • FAIS Exempt</p>
      </div>

      {/* Transaction Entry Form */}
      <form onSubmit={handleSubmit} className="bg-gray-800/80 border border-gray-700 rounded-xl p-4 flex flex-col gap-3 gpu-accelerate">
        <label className="text-xs font-semibold text-gray-300">Log Cash Inflow</label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <span className="absolute left-3 top-3 text-gray-400 font-bold">R</span>
            <input
              type="number"
              step="any"
              min="1"
              value={randInput}
              onChange={(e) => setRandInput(e.target.value)}
              placeholder="150"
              disabled={isSubmitting}
              className="w-full bg-gray-900 border border-gray-600 rounded-lg py-2.5 pl-8 pr-3 text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500 font-mono text-lg gpu-accelerate"
              aria-label="Inflow in Rands"
            />
          </div>
          <select
            value={source}
            onChange={(e) => setSource(e.target.value)}
            disabled={isSubmitting}
            className="bg-gray-900 border border-gray-600 rounded-lg px-3 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-emerald-500 gpu-accelerate"
          >
            <option value="Cash">Cash</option>
            <option value="Taxi Fare">Taxi Fare</option>
            <option value="Spaza Sale">Spaza Sale</option>
            <option value="Stokvel Payout">Stokvel</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !randInput}
          className="w-full bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold py-3 rounded-lg transition-colors shadow-md disabled:opacity-40 font-semibold uppercase tracking-wider text-sm gpu-accelerate"
        >
          {isSubmitting ? 'Writing to SQLite...' : 'Record Cash'}
        </button>
      </form>

      {/* Recent Ledger History */}
      <div className="flex flex-col gap-2">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider px-1">Verified Local Records</h3>
        {transactions.length === 0 ? (
          <div className="p-4 bg-gray-800/40 border border-gray-800 rounded-xl text-center text-xs text-gray-500">
            No entries recorded yet. Test offline persistence by entering R150 above.
          </div>
        ) : (
          <div className="flex flex-col gap-2 max-h-60 overflow-y-auto">
            {transactions.map((tx) => (
              <div key={tx.id} className="bg-gray-800 border border-gray-700/60 rounded-xl p-3 flex justify-between items-center gpu-accelerate">
                <div>
                  <p className="text-sm font-semibold text-gray-100">{tx.source}</p>
                  <p className="text-[10px] text-gray-400 font-mono">{new Date(tx.receivedAt).toLocaleTimeString()}</p>
                </div>
                <span className="text-sm font-bold text-emerald-400 font-mono">
                  +R {(tx.amountCents / 100).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
