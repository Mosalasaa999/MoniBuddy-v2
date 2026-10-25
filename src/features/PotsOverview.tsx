import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { GoalPot } from '../types';
import {
  Plus,
  ShoppingBasket,
  GraduationCap,
  Store,
  Bus,
  HeartPulse,
  Sparkles,
  ArrowUpRight,
  ArrowDownLeft,
  ShieldAlert,
  TrendingUp,
  HelpCircle,
  CheckCircle2,
  Trash2,
  Edit3,
  AlertTriangle
} from 'lucide-react';

interface PotsOverviewProps {
  onOpenNewPotModal: () => void;
  onOpenBufferModal: () => void;
  onSelectPotForAction: (pot: GoalPot, mode: 'deposit' | 'withdraw') => void;
}

export const PotsOverview: React.FC<PotsOverviewProps> = ({
  onOpenNewPotModal,
  onOpenBufferModal,
  onSelectPotForAction
}) => {
  const {
    safeToSpend,
    isOverspent,
    startingBalance,
    setStartingBalance,
    totalIncome,
    totalExpenses,
    totalGoalSavings,
    emergencyBuffer,
    weeksBufferCovers,
    estimatedMonthEndSafe,
    pots,
    deletePot,
    transactions,
    t
  } = useApp();

  const isBrandNewLedger =
    startingBalance === 0 &&
    transactions.length === 0 &&
    pots.length === 0 &&
    emergencyBuffer === 0;

  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const [editingStart, setEditingStart] = useState(false);
  const [startInput, setStartInput] = useState(startingBalance.toString());

  const showStartingForm = editingStart || isBrandNewLedger;

  const formatZAR = (val: number) => {
    const sign = val < 0 ? '-' : '';
    return `${sign}R ${Math.abs(val).toLocaleString('en-ZA', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  };

  const getPotIcon = (iconName: string) => {
    switch (iconName) {
      case 'Basket':
        return <ShoppingBasket className="h-5 w-5" />;
      case 'School':
        return <GraduationCap className="h-5 w-5" />;
      case 'Store':
        return <Store className="h-5 w-5" />;
      case 'Bus':
        return <Bus className="h-5 w-5" />;
      case 'Heart':
        return <HeartPulse className="h-5 w-5" />;
      default:
        return <Sparkles className="h-5 w-5" />;
    }
  };

  const getColorClasses = (color: GoalPot['color']) => {
    switch (color) {
      case 'amber':
        return {
          bg: 'bg-amber-50 text-amber-700 border-amber-200',
          bar: 'bg-amber-500'
        };
      case 'blue':
        return {
          bg: 'bg-blue-50 text-blue-700 border-blue-200',
          bar: 'bg-blue-600'
        };
      case 'purple':
        return {
          bg: 'bg-purple-50 text-purple-700 border-purple-200',
          bar: 'bg-purple-600'
        };
      case 'rose':
        return {
          bg: 'bg-rose-50 text-rose-700 border-rose-200',
          bar: 'bg-rose-600'
        };
      default:
        return {
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          bar: 'bg-emerald-600'
        };
    }
  };

  const handleSaveStart = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseFloat(startInput);
    if (!isNaN(parsed) && parsed >= 0) {
      setStartingBalance(parsed);
      setEditingStart(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Overspend Warning Banner */}
      {isOverspent && (
        <div
          role="alert"
          className="rounded-2xl border-2 border-rose-300 bg-rose-50 p-4 flex items-start gap-3 shadow-sm"
        >
          <AlertTriangle className="h-5 w-5 text-rose-700 shrink-0 mt-0.5" />
          <div>
            <h2 className="text-sm font-extrabold text-rose-900">
              {t.overspentWarningTitle} ({formatZAR(safeToSpend)})
            </h2>
            <p className="mt-1 text-xs text-rose-800 leading-relaxed">
              {t.overspentWarningDesc}
            </p>
          </div>
        </div>
      )}

      {/* Hero Safe-To-Spend Card */}
      <div
        className={`relative overflow-hidden rounded-3xl p-6 sm:p-8 text-white shadow-xl ${
          isOverspent
            ? 'bg-gradient-to-br from-rose-950 via-rose-900 to-slate-900'
            : 'bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900'
        }`}
      >
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-lg bg-white/15 px-3 py-1 text-xs font-semibold text-emerald-100">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-300" />
              <span>{t.safeToSpend}</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight font-mono">
              {formatZAR(safeToSpend)}
            </h1>
            <p className="max-w-xl text-sm text-emerald-100/90 leading-relaxed">
              {t.safeToSpendDesc}
            </p>

            {/* Starting Balance Inline Editor */}
            <div className="pt-2">
              {showStartingForm ? (
                <form
                  onSubmit={handleSaveStart}
                  className="rounded-2xl bg-slate-950/45 border border-white/20 p-3.5 max-w-md space-y-2.5"
                >
                  <p className="text-xs font-semibold text-emerald-100">
                    {isBrandNewLedger
                      ? t.startingCashFirstTimePrompt
                      : t.startingCashEditPrompt}
                  </p>
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="relative flex-1 min-w-[140px]">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-emerald-200">
                        R
                      </span>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={startInput}
                        onChange={(e) => setStartInput(e.target.value)}
                        placeholder="0.00"
                        aria-label={t.startingBalance}
                        className="w-full min-h-[44px] rounded-xl bg-white/10 border border-white/30 pl-7 pr-3 py-2 text-sm text-white font-mono placeholder:text-emerald-200/50 focus:outline-none focus:ring-2 focus:ring-emerald-300"
                      />
                    </div>
                    <button
                      type="submit"
                      className="min-h-[44px] rounded-xl bg-emerald-400 px-4 py-2 text-xs font-extrabold text-emerald-950 hover:bg-emerald-300 transition-colors"
                    >
                      {t.saveStartingBalance}
                    </button>
                    {!isBrandNewLedger && (
                      <button
                        type="button"
                        onClick={() => setEditingStart(false)}
                        className="min-h-[44px] rounded-xl bg-white/10 px-3 py-2 text-xs font-semibold text-white hover:bg-white/20"
                      >
                        {t.cancel}
                      </button>
                    )}
                  </div>
                </form>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setStartInput(startingBalance.toString());
                    setEditingStart(true);
                  }}
                  className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl bg-white/10 hover:bg-white/20 px-3.5 py-2 text-xs font-semibold text-emerald-100 transition-colors"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                  <span>
                    {startingBalance === 0
                      ? t.setStartingCash
                      : `${t.startingBalance}: ${formatZAR(startingBalance)} (${t.updateStartingCash})`}
                  </span>
                </button>
              )}
            </div>
          </div>

          {/* Formula Pill Breakdown */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-3 bg-slate-950/40 rounded-2xl p-4 border border-white/15">
            <div>
              <p className="text-xs uppercase tracking-wider text-emerald-200/80">
                + {t.startingTotal}
              </p>
              <p className="text-sm font-bold font-mono">
                {formatZAR(startingBalance + totalIncome)}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-rose-200/90">
                - {t.expenses}
              </p>
              <p className="text-sm font-bold font-mono text-rose-200">
                {formatZAR(totalExpenses)}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-amber-200/90">
                - {t.goalSavings}
              </p>
              <p className="text-sm font-bold font-mono text-amber-200">
                {formatZAR(totalGoalSavings)}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-sky-200/90">
                - {t.emergencyBuffer}
              </p>
              <p className="text-sm font-bold font-mono text-sky-200">
                {formatZAR(emergencyBuffer)}
              </p>
            </div>
          </div>
        </div>

        {/* Month-end forecast bar */}
        <div className="mt-6 pt-4 border-t border-white/15 flex flex-wrap items-center justify-between gap-3 text-xs text-emerald-100/90">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-emerald-300 shrink-0" />
            {estimatedMonthEndSafe !== null ? (
              <span>
                {t.forecastReadyPrefix}{' '}
                <strong className="text-white font-mono">
                  {formatZAR(estimatedMonthEndSafe)}
                </strong>{' '}
                {t.forecastReadySuffix}
              </span>
            ) : (
              <span>
                <strong className="text-white">{t.forecastPendingTitle}:</strong>{' '}
                {t.forecastPendingBody}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={() => setShowHowItWorks(!showHowItWorks)}
            className="inline-flex min-h-[44px] items-center gap-1.5 font-semibold text-emerald-200 hover:text-white underline underline-offset-4"
          >
            <HelpCircle className="h-3.5 w-3.5" />
            <span>{t.howItWorks}</span>
          </button>
        </div>
      </div>

      {/* Collapsible How It Works */}
      {showHowItWorks && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-5 text-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-emerald-950">{t.howItWorks}</h3>
            <button
              type="button"
              onClick={() => setShowHowItWorks(false)}
              className="min-h-[44px] px-2 text-xs font-semibold text-emerald-700 hover:text-emerald-950"
            >
              {t.hide}
            </button>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs leading-relaxed">
            <div className="rounded-xl bg-white p-3.5 border border-emerald-100">
              <span className="font-bold text-emerald-800 block mb-1">
                {t.howStep1Title}
              </span>
              {t.howStep1Body}
            </div>
            <div className="rounded-xl bg-white p-3.5 border border-emerald-100">
              <span className="font-bold text-emerald-800 block mb-1">
                {t.howStep2Title}
              </span>
              {t.howStep2Body}
            </div>
            <div className="rounded-xl bg-white p-3.5 border border-emerald-100">
              <span className="font-bold text-emerald-800 block mb-1">
                {t.howStep3Title}
              </span>
              {t.howStep3Body}
            </div>
            <div className="rounded-xl bg-white p-3.5 border border-emerald-100">
              <span className="font-bold text-emerald-800 block mb-1">
                {t.howStep4Title}
              </span>
              {t.howStep4Body}
            </div>
          </div>
        </div>
      )}

      {/* Quick Summary Strip: Emergency Buffer & Total Pots */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm flex items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                {t.emergencyBuffer}
              </span>
              <span className="rounded-md bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-800">
                {t.zeroInterestSelfFunded}
              </span>
            </div>
            <p className="text-2xl font-extrabold text-slate-900 font-mono">
              {formatZAR(emergencyBuffer)}
            </p>
            <p className="text-xs text-slate-500">
              {emergencyBuffer > 0 ? (
                <>
                  {t.bufferCoversPrefix}{' '}
                  <strong className="text-slate-700">
                    {weeksBufferCovers.toFixed(1)} {t.bufferCoversWeeksUnit}
                  </strong>{' '}
                  {t.bufferCoversSuffix}
                </>
              ) : (
                t.bufferEmptyPrompt
              )}
            </p>
          </div>
          <button
            type="button"
            onClick={onOpenBufferModal}
            className="shrink-0 min-h-[48px] rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white hover:bg-slate-800 transition-colors"
          >
            {t.addToBuffer}
          </button>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm flex items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                {t.goalSavings}
              </span>
              <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-800">
                {pots.length} {t.activePotsSuffix}
              </span>
            </div>
            <p className="text-2xl font-extrabold text-slate-900 font-mono">
              {formatZAR(totalGoalSavings)}
            </p>
            <p className="text-xs text-slate-500">{t.potsSummaryDesc}</p>
          </div>
          <button
            type="button"
            onClick={onOpenNewPotModal}
            className="shrink-0 inline-flex min-h-[48px] items-center gap-1.5 rounded-xl bg-emerald-700 px-4 py-2.5 text-xs font-bold text-white hover:bg-emerald-800 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>{t.newGoalPot}</span>
          </button>
        </div>
      </div>

      {/* Micro-Savings Pots Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">{t.microSavingsPots}</h2>
            <p className="text-xs text-slate-500">{t.potsSubtitle}</p>
          </div>
        </div>

        {pots.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white p-10 text-center space-y-3">
            <ShieldAlert className="h-9 w-9 text-slate-400 mx-auto" />
            <div className="space-y-1 max-w-md mx-auto">
              <h3 className="text-sm font-bold text-slate-900">{t.noPotsYetTitle}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{t.emptyPotsMsg}</p>
            </div>
            <button
              type="button"
              onClick={onOpenNewPotModal}
              className="inline-flex min-h-[48px] items-center gap-2 rounded-xl bg-emerald-700 px-5 py-2.5 text-xs font-bold text-white hover:bg-emerald-800"
            >
              <Plus className="h-4 w-4" />
              <span>{t.createFirstPot}</span>
            </button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {pots.map((pot) => {
              const pct = Math.min(
                100,
                Math.round((pot.currentAmount / Math.max(1, pot.targetAmount)) * 100)
              );
              const colors = getColorClasses(pot.color);

              return (
                <div
                  key={pot.id}
                  className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-xl border ${colors.bg}`}
                        >
                          {getPotIcon(pot.icon)}
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-slate-900">{pot.name}</h3>
                          <span className="text-xs font-medium text-slate-500">
                            {pot.category}
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => deletePot(pot.id)}
                        title={t.remove}
                        aria-label={`${t.remove} ${pot.name}`}
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div>
                      <div className="flex items-baseline justify-between mb-1.5">
                        <span className="text-xl font-extrabold text-slate-900 font-mono">
                          {formatZAR(pot.currentAmount)}
                        </span>
                        <span className="text-xs font-semibold text-slate-500 font-mono">
                          {t.goalLabel} {formatZAR(pot.targetAmount)}
                        </span>
                      </div>
                      <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${colors.bar}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <div className="mt-1.5 flex items-center justify-between text-xs font-semibold text-slate-500">
                        <span>
                          {pct}
                          {t.savedPercentSuffix}
                        </span>
                        {pct >= 100 && (
                          <span className="text-emerald-700 font-bold">
                            {t.goalReachedLabel}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => onSelectPotForAction(pot, 'deposit')}
                      className="inline-flex min-h-[44px] items-center justify-center gap-1 rounded-xl bg-emerald-50 hover:bg-emerald-100 px-3 py-2 text-xs font-bold text-emerald-800 transition-colors"
                    >
                      <ArrowUpRight className="h-3.5 w-3.5" />
                      <span>{t.deposit}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onSelectPotForAction(pot, 'withdraw')}
                      disabled={pot.currentAmount <= 0}
                      className="inline-flex min-h-[44px] items-center justify-center gap-1 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-40 px-3 py-2 text-xs font-bold text-slate-700 transition-colors"
                    >
                      <ArrowDownLeft className="h-3.5 w-3.5" />
                      <span>{t.withdraw}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
