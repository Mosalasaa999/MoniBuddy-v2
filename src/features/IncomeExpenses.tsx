import React, { useState, useMemo, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { getLocalIsoDate } from '../cryptoLedger';
import {
  ArrowUpCircle,
  ArrowDownCircle,
  Trash2,
  Plus,
  CheckCircle2,
  Calendar,
  BarChart3
} from 'lucide-react';
import { VoiceCapturePanel } from './VoiceCapturePanel';
import { ParsedVoiceEntry } from '../SlangDictionary';

export const IncomeExpenses: React.FC = () => {
  const { transactions, addTransaction, deleteTransaction, totalIncome, totalExpenses, t } =
    useApp();

  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Groceries');
  const [date, setDate] = useState(() => getLocalIsoDate());
  const manualFormRef = useRef<HTMLDivElement | null>(null);

  const handlePopulateFromVoice = (entry: ParsedVoiceEntry) => {
    setType(entry.type);
    setTitle(entry.title);
    setAmount(entry.amount.toString());
    setCategory(entry.category);
    manualFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const quickPresets =
    type === 'expense'
      ? [
          { label: t.presetGroceries, cat: 'Groceries' },
          { label: t.presetTaxi, cat: 'Transport' },
          { label: t.presetElectricity, cat: 'Utilities' },
          { label: t.presetSpaza, cat: 'Inventory' },
          { label: t.presetAirtime, cat: 'Connectivity' }
        ]
      : [
          { label: t.presetWages, cat: 'Wages' },
          { label: t.presetSpaza, cat: 'Sales' },
          { label: t.presetHustle, cat: 'Side Hustle' },
          { label: t.presetGrant, cat: 'Support' }
        ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(amount);
    if (!title.trim() || isNaN(num) || num <= 0) return;

    addTransaction({
      title: title.trim(),
      amount: num,
      type,
      category,
      date
    });

    setTitle('');
    setAmount('');
  };

  const formatZAR = (val: number) =>
    `R ${val.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  // Compute last 7 days spending chart using SAST-safe local ISO dates
  const last7Days = useMemo(() => {
    const days: { dateStr: string; label: string; spent: number; earned: number }[] = [];
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
      const iso = getLocalIsoDate(d);
      const label = d.toLocaleDateString('en-ZA', { weekday: 'short' });
      const spent = transactions
        .filter((tx) => tx.date === iso && tx.type === 'expense')
        .reduce((acc, tx) => acc + tx.amount, 0);
      const earned = transactions
        .filter((tx) => tx.date === iso && tx.type === 'income')
        .reduce((acc, tx) => acc + tx.amount, 0);
      days.push({ dateStr: iso, label, spent, earned });
    }
    return days;
  }, [transactions]);

  const maxDaily = Math.max(
    1,
    ...last7Days.map((d) => Math.max(d.spent, d.earned))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">{t.cashLogTitle}</h1>
        <p className="text-sm text-slate-600">{t.cashLogSubtitle}</p>
      </div>

      {/* Summary Cards */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-800">
              {t.totalMoneyIn}
            </p>
            <p className="text-2xl font-extrabold text-emerald-950 font-mono mt-1">
              {formatZAR(totalIncome)}
            </p>
            <p className="text-xs text-emerald-700 mt-1">{t.totalMoneyInSub}</p>
          </div>
          <ArrowUpCircle className="h-10 w-10 text-emerald-600 shrink-0" />
        </div>

        <div className="rounded-2xl border border-rose-200 bg-rose-50/60 p-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-rose-800">
              {t.totalMoneyOut}
            </p>
            <p className="text-2xl font-extrabold text-rose-950 font-mono mt-1">
              {formatZAR(totalExpenses)}
            </p>
            <p className="text-xs text-rose-700 mt-1">{t.totalMoneyOutSub}</p>
          </div>
          <ArrowDownCircle className="h-10 w-10 text-rose-600 shrink-0" />
        </div>
      </div>

      {/* 7-Day Cashflow Bar Chart */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-slate-600" />
            <h2 className="text-sm font-bold text-slate-900">{t.last7DaysTitle}</h2>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-emerald-700">
              <span className="h-2.5 w-2.5 rounded-sm bg-emerald-500" /> {t.income}
            </span>
            <span className="flex items-center gap-1.5 text-rose-700">
              <span className="h-2.5 w-2.5 rounded-sm bg-rose-500" /> {t.expenses}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2 items-end h-36 pt-4 px-1">
          {last7Days.map((day) => {
            const earnedPct = Math.round((day.earned / maxDaily) * 100);
            const spentPct = Math.round((day.spent / maxDaily) * 100);
            return (
              <div key={day.dateStr} className="flex flex-col items-center gap-1.5 h-full justify-end">
                <div className="flex items-end gap-1 w-full justify-center h-24">
                  <div
                    title={`${t.income}: ${formatZAR(day.earned)}`}
                    className="w-3 sm:w-4 rounded-t-md bg-emerald-500 transition-all"
                    style={{ height: `${Math.max(earnedPct, day.earned > 0 ? 8 : 2)}%` }}
                  />
                  <div
                    title={`${t.expenses}: ${formatZAR(day.spent)}`}
                    className="w-3 sm:w-4 rounded-t-md bg-rose-500 transition-all"
                    style={{ height: `${Math.max(spentPct, day.spent > 0 ? 8 : 2)}%` }}
                  />
                </div>
                <span className="text-xs font-semibold text-slate-500">{day.label}</span>
              </div>
            );
          })}
        </div>

        {transactions.length > 0 && (
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>{t.sevenDayWindow}</span>
            <span className="font-mono font-semibold text-slate-700">
              {t.peakDayPrefix}{' '}
              {formatZAR(Math.max(...last7Days.map((d) => Math.max(d.spent, d.earned))))}
            </span>
          </div>
        )}
      </div>

      {/* Vernacular Voice & Touch Entry */}
      <VoiceCapturePanel
        selectedDate={date}
        onPopulateManualForm={handlePopulateFromVoice}
      />

      {/* Add Transaction Form + Transaction List */}
      <div className="grid lg:grid-cols-5 gap-6">
        <div
          ref={manualFormRef}
          className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm h-fit space-y-4"
        >
          <div>
            <h2 className="text-base font-bold text-slate-900">{t.manualEntryTitle}</h2>
            <p className="text-xs text-slate-500 mt-0.5">{t.manualEntrySub}</p>
          </div>

          {/* Toggle Income / Expense */}
          <div className="grid grid-cols-2 rounded-xl bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => {
                setType('expense');
                setCategory('Groceries');
              }}
              className={`min-h-[44px] rounded-lg py-2 text-xs font-bold transition-all ${
                type === 'expense'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.moneyOutBtn}
            </button>
            <button
              type="button"
              onClick={() => {
                setType('income');
                setCategory('Wages');
              }}
              className={`min-h-[44px] rounded-lg py-2 text-xs font-bold transition-all ${
                type === 'income'
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.moneyInBtn}
            </button>
          </div>

          {/* Quick Tap Presets */}
          <div>
            <p className="text-xs font-semibold text-slate-500 mb-1.5">
              {t.commonCategoriesLabel}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {quickPresets.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => {
                    setTitle(preset.label);
                    setCategory(preset.cat);
                  }}
                  className="min-h-[40px] rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors"
                >
                  + {preset.label}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label
                htmlFor="tx-title"
                className="block text-xs font-semibold text-slate-700 mb-1"
              >
                {t.descriptionLabel}
              </label>
              <input
                id="tx-title"
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={t.descriptionPlaceholder}
                className="w-full min-h-[44px] rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:border-emerald-600 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="tx-amount"
                  className="block text-xs font-semibold text-slate-700 mb-1"
                >
                  {t.amountRandLabel}
                </label>
                <input
                  id="tx-amount"
                  type="number"
                  step="0.01"
                  min="0.01"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full min-h-[44px] rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-mono focus:border-emerald-600 focus:outline-none"
                />
              </div>
              <div>
                <label
                  htmlFor="tx-date"
                  className="block text-xs font-semibold text-slate-700 mb-1"
                >
                  {t.dateLabel}
                </label>
                <div className="relative">
                  <input
                    id="tx-date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full min-h-[44px] rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-emerald-600 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className={`w-full min-h-[48px] flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-white shadow-sm transition-colors ${
                type === 'income'
                  ? 'bg-emerald-700 hover:bg-emerald-800'
                  : 'bg-slate-900 hover:bg-slate-800'
              }`}
            >
              <Plus className="h-4 w-4" />
              <span>{t.saveEntryBtn}</span>
            </button>
          </form>
        </div>

        {/* Transaction History */}
        <div className="lg:col-span-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {t.recordedTransactionsTitle}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">{t.recordedTransactionsSub}</p>
            </div>
            <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600">
              {transactions.length} {t.recordsCountSuffix}
            </span>
          </div>

          {transactions.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 py-12 px-6 text-center space-y-2">
              <Calendar className="h-8 w-8 text-slate-400 mx-auto" />
              <h3 className="text-sm font-bold text-slate-800">{t.noTransactionsTitle}</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                {t.noTransactionsBody}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 max-h-[480px] overflow-y-auto pr-1">
              {transactions.map((tx) => {
                const isCashInflow =
                  tx.type === 'income' ||
                  tx.type === 'pot_withdraw' ||
                  tx.type === 'buffer_withdraw';

                return (
                  <div
                    key={tx.id}
                    className="py-3 flex items-center justify-between gap-3 group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs font-bold ${
                          isCashInflow
                            ? 'bg-emerald-50 text-emerald-700'
                            : tx.type === 'expense'
                            ? 'bg-rose-50 text-rose-700'
                            : 'bg-amber-50 text-amber-700'
                        }`}
                      >
                        {isCashInflow ? '+' : '-'}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-900 truncate">
                          {tx.title}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <span>{tx.category}</span>
                          <span>•</span>
                          <span>{tx.date}</span>
                          <span className="inline-flex items-center gap-0.5 text-emerald-700 font-semibold">
                            <CheckCircle2 className="h-3 w-3" /> {t.save}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span
                        className={`text-sm font-bold font-mono ${
                          isCashInflow
                            ? 'text-emerald-700'
                            : tx.type === 'expense'
                            ? 'text-rose-700'
                            : 'text-slate-700'
                        }`}
                      >
                        {isCashInflow ? '+' : '-'} {formatZAR(tx.amount)}
                      </span>
                      <button
                        type="button"
                        onClick={() => deleteTransaction(tx.id)}
                        title={t.remove}
                        aria-label={`${t.remove} ${tx.title}`}
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
