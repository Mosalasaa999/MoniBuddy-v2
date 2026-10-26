import React, { useMemo, useState } from 'react';
import { useApp } from '../context/AppContext';
import { evaluateNcaShortTermLoan } from '../ledgerEngine';
import {
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Plus,
  Calculator,
  CheckCircle2,
  Flame,
  Info,
  Scale
} from 'lucide-react';

interface BufferCreditProps {
  onOpenBufferModal: () => void;
}

export const BufferCredit: React.FC<BufferCreditProps> = ({ onOpenBufferModal }) => {
  const {
    emergencyBuffer,
    burnRate,
    setBurnRate,
    weeksBufferCovers,
    addToBuffer,
    t
  } = useApp();

  const [quickSaveError, setQuickSaveError] = useState<string | null>(null);

  // Loan Quote & NCA Regulation 42 Cap Checker State
  const [principalInput, setPrincipalInput] = useState<string>('1000');
  const [quoteMode, setQuoteMode] = useState<'repayment' | 'monthly_rate'>('repayment');
  const [quotedRepaymentInput, setQuotedRepaymentInput] = useState<string>('1500');
  const [quotedRateInput, setQuotedRateInput] = useState<string>('40');
  const [extraFeesInput, setExtraFeesInput] = useState<string>('0');
  const [termDaysInput, setTermDaysInput] = useState<string>('30');
  const [isFirstLoanThisYear, setIsFirstLoanThisYear] = useState<boolean>(true);

  const evaluation = useMemo(
    () =>
      evaluateNcaShortTermLoan({
        principalZar: parseFloat(principalInput) || 1000,
        mode: quoteMode,
        quotedTotalRepaymentZar: parseFloat(quotedRepaymentInput) || 1000,
        quotedMonthlyRatePercent: parseFloat(quotedRateInput) || 0,
        extraFeesZar: parseFloat(extraFeesInput) || 0,
        termDays: parseInt(termDaysInput, 10) || 30,
        isFirstShortTermLoanThisYear: isFirstLoanThisYear
      }),
    [
      principalInput,
      quoteMode,
      quotedRepaymentInput,
      quotedRateInput,
      extraFeesInput,
      termDaysInput,
      isFirstLoanThisYear
    ]
  );

  const formatZAR = (val: number) =>
    `R ${val.toLocaleString('en-ZA', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;

  const handleQuickDeposit = (amount: number) => {
    setQuickSaveError(null);
    const res = addToBuffer(amount);
    if (!res.ok) {
      setQuickSaveError(res.error || t.insufficientSafeCashError);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800 mb-2">
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>{t.loanShieldBadge}</span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900">{t.loanShieldTitle}</h1>
        <p className="text-sm text-slate-600 max-w-2xl">{t.loanShieldSubtitle}</p>
      </div>

      {/* NCA Borrower Protection Warning Banner (Anti-Card/PIN Confiscation & Upfront Fees) */}
      <div
        role="region"
        aria-label={t.loanProtectionBannerTitle}
        className="rounded-2xl border border-amber-300 bg-amber-50 p-4 flex items-start gap-3"
      >
        <ShieldAlert className="h-5 w-5 text-amber-800 shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs leading-relaxed">
          <p className="font-extrabold text-amber-950">{t.loanProtectionBannerTitle}</p>
          <p className="text-amber-900">{t.loanProtectionBannerBody}</p>
        </div>
      </div>

      {/* Hero Buffer Status */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-3xl bg-slate-900 p-6 sm:p-8 text-white shadow-lg flex flex-col justify-between space-y-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                {t.yourEmergencySavings}
              </p>
              <h2 className="text-4xl font-extrabold font-mono mt-1">
                {formatZAR(emergencyBuffer)}
              </h2>
              <p className="text-xs text-slate-300 mt-2">
                {emergencyBuffer > 0 ? (
                  <>
                    {t.bufferCoversPrefix}{' '}
                    <strong className="text-emerald-300 font-mono">
                      {weeksBufferCovers.toFixed(1)} {t.bufferCoversWeeksUnit}
                    </strong>{' '}
                    {t.bufferCoversSuffix}
                  </>
                ) : (
                  t.bufferEmptyPrompt
                )}
              </p>
            </div>
            <div className="rounded-2xl bg-white/10 p-4 border border-white/15 text-right">
              <p className="text-xs uppercase tracking-wider text-slate-300">
                {t.zeroInterestSelfFunded}
              </p>
              <p className="text-xl font-extrabold text-emerald-400 font-mono">0% APR</p>
            </div>
          </div>

          {quickSaveError && (
            <div
              role="alert"
              className="rounded-xl border border-amber-400/50 bg-amber-950/70 px-3.5 py-2.5 text-xs font-semibold text-amber-200 flex items-start gap-2"
            >
              <AlertTriangle className="h-4 w-4 text-amber-300 shrink-0 mt-0.5" />
              <span>{quickSaveError}</span>
            </div>
          )}

          {/* Quick Save Buttons */}
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2.5">
              <button
                type="button"
                onClick={() => handleQuickDeposit(100)}
                className="min-h-[46px] rounded-xl bg-white/10 hover:bg-emerald-600 px-4 py-2 text-xs font-bold text-white border border-white/15 transition-colors"
              >
                {t.depositR100Btn}
              </button>
              <button
                type="button"
                onClick={() => handleQuickDeposit(250)}
                className="min-h-[46px] rounded-xl bg-white/10 hover:bg-emerald-600 px-4 py-2 text-xs font-bold text-white border border-white/15 transition-colors"
              >
                {t.depositR250Btn}
              </button>
              <button
                type="button"
                onClick={onOpenBufferModal}
                className="inline-flex min-h-[46px] items-center gap-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 px-4 py-2 text-xs font-extrabold text-slate-950 transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>{t.manageFundBtn}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Burn Rate Adjuster */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-amber-700">
              <Flame className="h-5 w-5" />
              <h3 className="text-sm font-bold text-slate-900">{t.burnRateTitle}</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">{t.burnRateSub}</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-extrabold text-slate-900 font-mono">
                {formatZAR(burnRate)}
              </span>
              <span className="text-xs font-semibold text-slate-500">
                {t.perWeekSuffix}
              </span>
            </div>
            <input
              type="range"
              min={200}
              max={2500}
              step={50}
              aria-label={t.burnRateTitle}
              value={burnRate}
              onChange={(e) => setBurnRate(Number(e.target.value))}
              className="w-full accent-emerald-700 cursor-pointer"
            />
            <div className="flex justify-between text-xs text-slate-400 font-mono">
              <span>R 200</span>
              <span>R 1,200</span>
              <span>R 2,500</span>
            </div>
          </div>

          <div className="rounded-xl bg-slate-50 p-3 border border-slate-100 text-xs text-slate-700 space-y-1">
            <p>
              <strong>{t.twoWeekTargetTitle}:</strong>{' '}
              <span className="font-mono font-bold text-slate-900">
                {formatZAR(burnRate * 2)}
              </span>{' '}
              — {t.twoWeekTargetBodyPrefix} {t.twoWeekTargetBodySuffix}
            </p>
            <p>
              <strong>{t.oneMonthTargetTitle}:</strong>{' '}
              <span className="font-mono font-bold text-slate-900">
                {formatZAR(burnRate * 4)}
              </span>{' '}
              — {t.oneMonthTargetBodyPrefix} {t.oneMonthTargetBodySuffix}
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Loan Quote & NCA Regulation 42 Cap Calculator */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-rose-700">
              <Calculator className="h-5 w-5" />
              <h2 className="text-lg font-bold text-slate-900">{t.loanQuoteTitle}</h2>
            </div>
            <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
              {t.loanQuoteSubtitle}
            </p>
          </div>

          {/* Quote Mode Switcher */}
          <div className="inline-flex rounded-xl border border-slate-200 bg-slate-100 p-1 self-start">
            <button
              type="button"
              onClick={() => setQuoteMode('repayment')}
              className={`min-h-[40px] rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${
                quoteMode === 'repayment'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.loanInputModeRepayment}
            </button>
            <button
              type="button"
              onClick={() => setQuoteMode('monthly_rate')}
              className={`min-h-[40px] rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${
                quoteMode === 'monthly_rate'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.loanInputModeMonthlyRate}
            </button>
          </div>
        </div>

        {/* User Quote Input Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
          <div>
            <label
              htmlFor="loan-principal"
              className="block text-xs font-bold text-slate-700 mb-1"
            >
              {t.loanPrincipalLabel}
            </label>
            <input
              id="loan-principal"
              type="number"
              min={100}
              max={50000}
              step={50}
              value={principalInput}
              onChange={(e) => setPrincipalInput(e.target.value)}
              className="w-full min-h-[44px] rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-sm font-mono font-bold text-slate-900 focus:border-emerald-600 focus:outline-none"
            />
          </div>

          {quoteMode === 'repayment' ? (
            <div>
              <label
                htmlFor="loan-repayment"
                className="block text-xs font-bold text-slate-700 mb-1"
              >
                {t.loanQuotedRepaymentLabel}
              </label>
              <input
                id="loan-repayment"
                type="number"
                min={100}
                step={25}
                value={quotedRepaymentInput}
                onChange={(e) => setQuotedRepaymentInput(e.target.value)}
                className="w-full min-h-[44px] rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-sm font-mono font-bold text-slate-900 focus:border-emerald-600 focus:outline-none"
              />
            </div>
          ) : (
            <div>
              <label
                htmlFor="loan-rate"
                className="block text-xs font-bold text-slate-700 mb-1"
              >
                {t.loanMonthlyRateLabel}
              </label>
              <input
                id="loan-rate"
                type="number"
                min={0}
                max={200}
                step={1}
                value={quotedRateInput}
                onChange={(e) => setQuotedRateInput(e.target.value)}
                className="w-full min-h-[44px] rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-sm font-mono font-bold text-slate-900 focus:border-emerald-600 focus:outline-none"
              />
            </div>
          )}

          <div>
            <label
              htmlFor="loan-extra-fees"
              className="block text-xs font-bold text-slate-700 mb-1"
            >
              {t.loanExtraFeesLabel}
            </label>
            <input
              id="loan-extra-fees"
              type="number"
              min={0}
              step={10}
              value={extraFeesInput}
              onChange={(e) => setExtraFeesInput(e.target.value)}
              className="w-full min-h-[44px] rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-sm font-mono font-bold text-slate-900 focus:border-emerald-600 focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="loan-term-days"
              className="block text-xs font-bold text-slate-700 mb-1"
            >
              {t.loanTermDaysLabel}
            </label>
            <input
              id="loan-term-days"
              type="number"
              min={1}
              max={180}
              step={1}
              value={termDaysInput}
              onChange={(e) => setTermDaysInput(e.target.value)}
              className="w-full min-h-[44px] rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-sm font-mono font-bold text-slate-900 focus:border-emerald-600 focus:outline-none"
            />
          </div>

          <div className="sm:col-span-2 lg:col-span-4 pt-1">
            <label className="inline-flex items-center gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isFirstLoanThisYear}
                onChange={(e) => setIsFirstLoanThisYear(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-emerald-700 focus:ring-emerald-600"
              />
              <span className="text-xs font-semibold text-slate-700">
                {t.loanFirstLoanToggle}
              </span>
            </label>
          </div>
        </div>

        {/* Dynamic Loan Quote Warning Banner (Predatory NCA Violation vs Legal Cost Caution) */}
        {evaluation.exceedsNcaCap ? (
          <div
            role="alert"
            className="rounded-2xl border-2 border-rose-400 bg-rose-50 p-4 flex items-start gap-3"
          >
            <AlertTriangle className="h-5 w-5 text-rose-700 shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs leading-relaxed">
              <p className="font-extrabold text-rose-950">
                {t.loanPredatoryWarningBannerTitle}
              </p>
              <p className="text-rose-900">
                {t.loanPredatoryWarningBannerBodyPrefix}{' '}
                <strong className="font-mono font-extrabold text-rose-950">
                  {formatZAR(evaluation.overchargeVsNcaZar)}
                </strong>{' '}
                {t.loanPredatoryWarningBannerBodySuffix}
              </p>
            </div>
          </div>
        ) : (
          evaluation.quoteTotalCostZar > 0 && (
            <div
              role="status"
              className="rounded-2xl border border-amber-300 bg-amber-50/80 p-4 flex items-start gap-3"
            >
              <Info className="h-5 w-5 text-amber-800 shrink-0 mt-0.5" />
              <div className="space-y-1 text-xs leading-relaxed">
                <p className="font-extrabold text-amber-950">
                  {t.loanLegalCautionBannerTitle}
                </p>
                <p className="text-amber-900">
                  {t.loanLegalCautionBannerBodyPrefix}{' '}
                  <strong className="font-mono font-extrabold text-amber-950">
                    {formatZAR(evaluation.quoteTotalCostZar)}
                  </strong>{' '}
                  {t.loanLegalCautionBannerBodySuffix}
                </p>
              </div>
            </div>
          )
        )}

        {/* 3-Column Comparison: Quoted Offer vs NCA Statutory Max vs Self-Funded Buffer */}
        <div className="grid md:grid-cols-3 gap-4">
          {/* Card 1: User's Quoted Loan */}
          <div
            className={`rounded-2xl border p-5 space-y-3 ${
              evaluation.exceedsNcaCap
                ? 'border-rose-300 bg-rose-50/70'
                : 'border-amber-200 bg-amber-50/50'
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                {t.loanQuoteCardTitle}
              </span>
              <span
                className={`rounded-md px-2 py-0.5 text-xs font-extrabold ${
                  evaluation.exceedsNcaCap
                    ? 'bg-rose-200 text-rose-950'
                    : 'bg-emerald-100 text-emerald-900'
                }`}
              >
                {evaluation.exceedsNcaCap
                  ? t.loanStatusExceedsCap
                  : t.loanStatusWithinCap}
              </span>
            </div>

            <div>
              <p className="text-xs text-slate-600">{t.loanTotalRepayLabel}</p>
              <p className="text-2xl font-extrabold font-mono text-slate-950">
                {formatZAR(evaluation.quoteTotalRepaymentZar)}
              </p>
            </div>

            <div className="space-y-1 pt-2 border-t border-slate-200/70 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-600">{t.loanTotalCostLabel}:</span>
                <span className="font-mono font-bold text-rose-800">
                  + {formatZAR(evaluation.quoteTotalCostZar)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">{t.loanEffectiveAprLabel}:</span>
                <span className="font-mono font-bold text-slate-900">
                  {evaluation.effectiveAprPercent}%
                </span>
              </div>
              {evaluation.exceedsNcaCap && (
                <div className="flex justify-between pt-1 text-rose-900 font-bold">
                  <span>{t.loanOverchargeVsNcaLabel}:</span>
                  <span className="font-mono">
                    + {formatZAR(evaluation.overchargeVsNcaZar)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Card 2: South African NCA Regulation 42 Legal Ceiling */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                {t.loanNcaCapCardTitle}
              </span>
              <Scale className="h-4 w-4 text-slate-600 shrink-0" />
            </div>

            <div>
              <p className="text-xs text-slate-600">{t.loanTotalRepayLabel}</p>
              <p className="text-2xl font-extrabold font-mono text-slate-900">
                {formatZAR(evaluation.ncaMaxTotalRepaymentZar)}
              </p>
            </div>

            <div className="space-y-1 pt-2 border-t border-slate-200 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-600">{t.loanTotalCostLabel}:</span>
                <span className="font-mono font-bold text-slate-800">
                  {formatZAR(evaluation.ncaMaxTotalCostZar)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">{t.loanEffectiveAprLabel}:</span>
                <span className="font-mono font-bold text-slate-800">
                  {evaluation.ncaAprPercent}%
                </span>
              </div>
            </div>
          </div>

          {/* Card 3: MoniBuddy Self-Funded Emergency Buffer */}
          <div className="rounded-2xl border-2 border-emerald-500 bg-emerald-50/70 p-5 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-900">
                {t.loanSelfBufferCardTitle}
              </span>
              <CheckCircle2 className="h-4 w-4 text-emerald-700 shrink-0" />
            </div>

            <div>
              <p className="text-xs text-emerald-800">{t.loanTotalRepayLabel}</p>
              <p className="text-2xl font-extrabold font-mono text-emerald-950">
                {formatZAR(evaluation.principalZar)}
              </p>
            </div>

            <div className="space-y-1 pt-2 border-t border-emerald-200 text-xs">
              <div className="flex justify-between">
                <span className="text-emerald-800">{t.loanTotalCostLabel}:</span>
                <span className="font-mono font-bold text-emerald-950">R 0.00</span>
              </div>
              <div className="flex justify-between font-bold text-emerald-900 pt-1">
                <span>{t.loanSavedWithBufferLabel}:</span>
                <span className="font-mono">
                  {formatZAR(evaluation.savedUsingSelfBufferZar)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Safer Alternatives & Sourced NCA Disclaimer */}
        <div className="grid md:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4 space-y-2">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-emerald-950">
              {t.loanSaferAlternativesTitle}
            </h3>
            <ul className="space-y-1.5 text-xs text-slate-700 leading-relaxed list-disc pl-4">
              <li>{t.loanAlt1}</li>
              <li>{t.loanAlt2}</li>
              <li>{t.loanAlt3}</li>
            </ul>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2 text-xs text-slate-600 leading-relaxed">
            <p className="font-semibold text-slate-800">{t.loanNcaCitation}</p>
            <div className="flex items-start gap-2 pt-1 text-slate-600">
              <Info className="h-4 w-4 text-slate-500 shrink-0 mt-0.5" />
              <p>{t.loanEducationalDisclaimer}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
