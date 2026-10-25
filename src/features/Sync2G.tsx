import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { getLocalIsoDate } from '../cryptoLedger';
import {
  Signal,
  Smartphone,
  CheckCircle2,
  Send,
  RefreshCw,
  HardDrive,
  Phone,
  Copy,
  Check,
  Info
} from 'lucide-react';

export const Sync2G: React.FC = () => {
  const {
    isReconciling,
    syncLedger,
    lastSavedAt,
    transactions,
    safeToSpend,
    emergencyBuffer,
    pots,
    addTransaction,
    addToBuffer,
    t
  } = useApp();

  const [ussdActive, setUssdActive] = useState(true);
  const [ussdScreen, setUssdScreen] = useState<'main' | 'log_expense' | 'save_buffer' | 'done'>(
    'main'
  );
  const [ussdInput, setUssdInput] = useState('');
  const [ussdMessage, setUssdMessage] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);

  const USSD_SHORTCODE = '*120*6664#';

  const formatZAR = (val: number) => {
    const sign = val < 0 ? '-' : '';
    return `${sign}R ${Math.abs(val).toFixed(2)}`;
  };

  const handleCopyShortcode = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(USSD_SHORTCODE).catch(() => {});
    }
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const resetUssd = () => {
    setUssdActive(true);
    setUssdScreen('main');
    setUssdInput('');
    setUssdMessage('');
  };

  const handleUssdSend = (e: React.FormEvent) => {
    e.preventDefault();
    const choice = ussdInput.trim();
    if (!choice) return;

    if (ussdScreen === 'main') {
      if (choice === '1') {
        setUssdScreen('done');
        setUssdMessage(
          `MoniBuddy (SIM):\n${t.safeToSpend}: ${formatZAR(safeToSpend)}\n${t.emergencyBuffer}: ${formatZAR(emergencyBuffer)}\n${t.goalSavings}: ${pots.length}\n\n0. Back`
        );
      } else if (choice === '2') {
        setUssdScreen('save_buffer');
      } else if (choice === '3') {
        setUssdScreen('log_expense');
      } else if (choice === '4') {
        addTransaction({
          title: 'Taxi Fare (USSD Simulator)',
          amount: 25,
          type: 'expense',
          category: 'Transport',
          date: getLocalIsoDate()
        });
        setUssdScreen('done');
        setUssdMessage(
          `Saved: R25.00 Taxi Fare.\nUpdated ${t.safeToSpend}: ${formatZAR(safeToSpend - 25)}\n\n0. Back`
        );
      } else {
        setUssdScreen('done');
        setUssdMessage('Invalid option. Reply 0 for Main Menu.');
      }
    } else if (ussdScreen === 'save_buffer') {
      if (choice === '0') {
        setUssdScreen('main');
      } else if (choice === '1') {
        const res = addToBuffer(50, 'USSD Simulator');
        setUssdScreen('done');
        if (res.ok) {
          setUssdMessage(
            `Saved R50.00 to ${t.emergencyBuffer}!\nNew Fund Balance: ${formatZAR(emergencyBuffer + 50)}\n\n0. Back`
          );
        } else {
          setUssdMessage(`${res.error || t.insufficientSafeCashError}\n\n0. Back`);
        }
      } else {
        setUssdScreen('main');
      }
    } else if (ussdScreen === 'log_expense') {
      const amt = parseFloat(choice);
      if (!isNaN(amt) && amt > 0) {
        addTransaction({
          title: 'Quick USSD Simulator Expense',
          amount: amt,
          type: 'expense',
          category: 'Daily Cash',
          date: getLocalIsoDate()
        });
        setUssdScreen('done');
        setUssdMessage(`Logged R${amt.toFixed(2)} expense locally.\n\n0. Back`);
      } else {
        setUssdScreen('main');
      }
    } else if (ussdScreen === 'done') {
      setUssdScreen('main');
      setUssdMessage('');
    }

    setUssdInput('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 rounded-lg bg-sky-100 px-3 py-1 text-xs font-bold text-sky-900 mb-2">
          <Signal className="h-3.5 w-3.5" />
          <span>{t.syncBadge}</span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900">{t.syncTitle}</h1>
        <p className="text-sm text-slate-600 max-w-2xl">{t.syncSub}</p>
      </div>

      {/* Truthful Simulation Notice Banner */}
      <div className="rounded-2xl border border-amber-300 bg-amber-50 p-4 flex items-start gap-3">
        <Info className="h-5 w-5 text-amber-800 shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs leading-relaxed">
          <p className="font-extrabold text-amber-950">{t.ussdSimNoticeTitle}</p>
          <p className="text-amber-900">{t.ussdSimNoticeBody}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left: Local Device Storage & USSD Concept */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <HardDrive className="h-5 w-5 text-emerald-700" />
                <h2 className="text-base font-bold text-slate-900">
                  {t.localLedgerActive}
                </h2>
              </div>
              <span className="rounded-lg bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-800">
                AES-256-GCM
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-slate-50 p-4 border border-slate-100">
                <p className="text-xs font-bold uppercase text-slate-500">
                  {t.savedTransactionsLabel}
                </p>
                <p className="text-2xl font-extrabold font-mono text-slate-900 mt-1">
                  {transactions.length}
                </p>
                <p className="text-xs text-emerald-700 mt-1">
                  {lastSavedAt ? `${t.savedAtPrefix} ${lastSavedAt}` : t.save}
                </p>
              </div>
              <div className="rounded-xl bg-slate-50 p-4 border border-slate-100">
                <p className="text-xs font-bold uppercase text-slate-500">
                  {t.activeSavingsPotsLabel}
                </p>
                <p className="text-2xl font-extrabold font-mono text-slate-900 mt-1">
                  {pots.length}
                </p>
                <p className="text-xs text-slate-500 mt-1">{t.zeroInterestSelfFunded}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={syncLedger}
              disabled={isReconciling}
              className="w-full min-h-[48px] flex items-center justify-center gap-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 py-3 text-sm font-bold text-white shadow-sm transition-colors"
            >
              <RefreshCw className={`h-4 w-4 ${isReconciling ? 'animate-spin' : ''}`} />
              <span>
                {isReconciling ? t.verifyingLocalLedgerBtn : t.verifyLocalLedgerBtn}
              </span>
            </button>
          </div>

          <div className="space-y-3">
            {/* USSD Shortcode Concept Card — No live tel: dialer hazard */}
            <div className="rounded-xl border border-slate-200 bg-slate-900 p-4 text-white space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                    {t.ussdShortcodeCardTitle}
                  </span>
                </div>
                <span className="font-mono text-sm font-extrabold text-white bg-white/10 px-2.5 py-0.5 rounded-lg">
                  {USSD_SHORTCODE}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {t.ussdShortcodeCardBody}
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={resetUssd}
                  className="flex-1 min-h-[44px] inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 px-3 py-2 text-xs font-extrabold text-slate-950 transition-colors"
                >
                  <Phone className="h-3.5 w-3.5" />
                  <span>{t.launchSimulatorBtn}</span>
                </button>
                <button
                  type="button"
                  onClick={handleCopyShortcode}
                  className="inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-xl bg-white/10 hover:bg-white/20 px-3 py-2 text-xs font-bold text-white transition-colors"
                >
                  {copiedCode ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                      <span>{t.copiedShortcodeBtn}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>{t.copyShortcodeBtn}</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-xs text-emerald-950 space-y-1.5">
              <p className="font-bold flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-700 shrink-0" />
                <span>{t.offlineAirplaneGuarantee}</span>
              </p>
              <p className="text-emerald-800 leading-relaxed">
                {t.installHomeScreenHint}
              </p>
            </div>
          </div>
        </div>

        {/* Right: Interactive *120*6664# USSD Simulator */}
        <div className="rounded-2xl border border-slate-200 bg-slate-900 p-6 text-white shadow-lg flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Smartphone className="h-5 w-5 text-emerald-400 shrink-0" />
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-base font-bold">{USSD_SHORTCODE}</h2>
                  <span className="rounded-md bg-amber-400 px-2 py-0.5 text-xs font-extrabold text-slate-950">
                    {t.ussdSimulatorTag}
                  </span>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                if (ussdActive) {
                  setUssdActive(false);
                } else {
                  resetUssd();
                }
              }}
              className="min-h-[40px] rounded-lg bg-white/10 hover:bg-white/20 px-3 py-1.5 text-xs font-bold text-emerald-300"
            >
              {ussdActive ? t.ussdCloseMenuBtn : t.ussdOpenMenuBtn}
            </button>
          </div>

          {!ussdActive ? (
            <div className="rounded-2xl bg-slate-800 border border-slate-700 p-8 text-center space-y-3 my-auto">
              <p className="font-mono text-lg font-bold text-emerald-400">
                {USSD_SHORTCODE}
              </p>
              <p className="text-xs text-slate-300 max-w-xs mx-auto">
                {t.ussdShortcodeCardBody}
              </p>
              <button
                type="button"
                onClick={resetUssd}
                className="min-h-[44px] rounded-xl bg-emerald-500 px-5 py-2 text-xs font-extrabold text-slate-950 hover:bg-emerald-400"
              >
                {t.launchSimulatorBtn}
              </button>
            </div>
          ) : (
            <div className="rounded-2xl bg-emerald-950/90 border-2 border-emerald-500/40 p-5 font-mono text-xs text-emerald-100 space-y-4 shadow-inner">
              {ussdScreen === 'main' && (
                <div className="space-y-1.5 leading-relaxed">
                  <p className="font-bold text-emerald-300">
                    MoniBuddy USSD ({t.ussdSimulatorTag})
                  </p>
                  <p>
                    {t.safeToSpend}: {formatZAR(safeToSpend)}
                  </p>
                  <div className="pt-2 space-y-1 text-white">
                    <p>1. Check All Balances</p>
                    <p>2. Save R50 to Emergency Buffer</p>
                    <p>3. Log Custom Expense Amount</p>
                    <p>4. Quick Log R25 Taxi Fare</p>
                  </div>
                </div>
              )}

              {ussdScreen === 'save_buffer' && (
                <div className="space-y-1.5">
                  <p className="font-bold text-emerald-300">Save to Emergency Buffer</p>
                  <p>Move R50.00 into your 0%-interest Emergency Fund?</p>
                  <p className="pt-2 text-white">1. Confirm R50 Save</p>
                  <p className="text-white">0. Cancel</p>
                </div>
              )}

              {ussdScreen === 'log_expense' && (
                <div className="space-y-1.5">
                  <p className="font-bold text-emerald-300">Log Cash Expense</p>
                  <p>Enter amount in Rand (e.g. 45):</p>
                </div>
              )}

              {ussdScreen === 'done' && (
                <pre className="whitespace-pre-wrap font-mono text-xs text-emerald-200 leading-relaxed">
                  {ussdMessage}
                </pre>
              )}

              <form onSubmit={handleUssdSend} className="flex gap-2 pt-2 border-t border-emerald-800">
                <input
                  type="text"
                  value={ussdInput}
                  onChange={(e) => setUssdInput(e.target.value)}
                  placeholder="1"
                  aria-label="USSD Reply"
                  className="flex-1 min-h-[44px] rounded-lg bg-slate-950/80 border border-emerald-600/50 px-3 py-2 text-xs text-white placeholder:text-emerald-300/40 focus:outline-none focus:border-emerald-400"
                />
                <button
                  type="submit"
                  className="inline-flex min-h-[44px] items-center gap-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 px-3.5 py-2 text-xs font-extrabold text-slate-950"
                >
                  <span>{t.ussdSendBtn}</span>
                  <Send className="h-3 w-3" />
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
