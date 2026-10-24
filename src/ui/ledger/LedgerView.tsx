import React, { useState } from 'react';
import { useLedgerStore } from '../../core/store/zustand';

export const LedgerView: React.FC = () => {
  const { balanceCents, addIncome } = useLedgerStore();
  const [amountRand, setAmountRand] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAddIncome = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amountRand || isNaN(Number(amountRand))) return;

    setIsProcessing(true);
    try {
      const cents = Math.round(Number(amountRand) * 100);
      await addIncome(cents, 'Cash');
      setAmountRand('');
    } catch (err) {
      console.error('Failed to add income:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="p-4 w-full max-w-md mx-auto gpu-accelerate">
      <div className="bg-gray-800 rounded-xl p-6 shadow-lg mb-6 border border-gray-700">
        <h2 className="text-gray-400 text-sm font-semibold uppercase tracking-wider mb-2">Available Balance</h2>
        <p className="text-4xl font-bold text-green-400">R {(balanceCents / 100).toFixed(2)}</p>
      </div>

      <form onSubmit={handleAddIncome} className="flex gap-2">
        <div className="relative flex-1">
          <span className="absolute left-3 top-3 text-gray-400 font-bold">R</span>
          <input
            type="number" step="0.01" min="0.01" value={amountRand}
            onChange={(e) => setAmountRand(e.target.value)}
            placeholder="0.00"
            className="w-full bg-gray-900 border border-gray-700 rounded-lg py-3 pl-8 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-green-500 gpu-accelerate"
            disabled={isProcessing}
          />
        </div>
        <button
          type="submit" disabled={isProcessing || !amountRand}
          className="bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-6 rounded-lg transition-colors gpu-accelerate disabled:opacity-50"
        >
          {isProcessing ? '...' : 'Add'}
        </button>
      </form>
    </div>
  );
};
