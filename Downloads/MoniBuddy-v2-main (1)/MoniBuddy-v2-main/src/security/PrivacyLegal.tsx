import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { getLocalIsoDate } from '../cryptoLedger';
import { AccessibleModal } from './AccessibleModal';
import {
  Scale,
  Lock,
  Trash2,
  Download,
  Upload,
  CheckCircle2,
  AlertTriangle,
  X
} from 'lucide-react';

export const PrivacyLegal: React.FC = () => {
  const {
    t,
    resetAllData,
    importBackupData,
    transactions,
    pots,
    startingBalance,
    emergencyBuffer,
    burnRate
  } = useApp();

  const [downloaded, setDownloaded] = useState(false);
  const [confirmResetOpen, setConfirmResetOpen] = useState(false);
  const [statusNotice, setStatusNotice] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleExportMyData = () => {
    const payload = {
      app: 'MoniBuddy',
      version: '3.0',
      exportedAt: new Date().toISOString(),
      financialState: {
        startingBalance,
        emergencyBuffer,
        burnRate,
        pots,
        transactions
      }
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `monibuddy-backup-${getLocalIsoDate()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setDownloaded(true);
    setStatusNotice({
      type: 'success',
      text: t.backupDownloadedMsg
    });
    setTimeout(() => setDownloaded(false), 3000);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const raw = typeof reader.result === 'string' ? reader.result : '';
      const result = importBackupData(raw);
      setStatusNotice({
        type: result.success ? 'success' : 'error',
        text: result.success ? t.backupRestoredMsg : t.backupInvalidMsg
      });
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleConfirmErase = () => {
    resetAllData();
    setConfirmResetOpen(false);
    setStatusNotice({
      type: 'success',
      text: t.ledgerErasedMsg
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800 mb-2">
          <Scale className="h-3.5 w-3.5" />
          <span>{t.privacyBadge}</span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900">
          {t.privacyGuaranteeTitle}
        </h1>
        <p className="text-sm text-slate-600 max-w-3xl">{t.privacySubtitle}</p>
      </div>

      {statusNotice && (
        <div
          role="status"
          className={`rounded-2xl border p-4 flex items-center justify-between gap-3 text-xs font-semibold ${
            statusNotice.type === 'success'
              ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
              : 'border-rose-200 bg-rose-50 text-rose-900'
          }`}
        >
          <div className="flex items-center gap-2">
            {statusNotice.type === 'success' ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertTriangle className="h-4 w-4 text-rose-600 shrink-0" />
            )}
            <span>{statusNotice.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setStatusNotice(null)}
            className="text-slate-500 hover:text-slate-800"
            aria-label={t.close}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Privacy Card */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-700 text-white">
            <Lock className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-slate-900">{t.privacyMainHeading}</h2>
            <p className="text-xs text-slate-600 leading-relaxed">{t.privacyMainBody}</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 pt-2">
          <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200 space-y-1.5">
            <h3 className="text-xs font-extrabold uppercase text-slate-800">
              {t.privacyPoint1Title}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t.privacyPoint1Body}
            </p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200 space-y-1.5">
            <h3 className="text-xs font-extrabold uppercase text-slate-800">
              {t.privacyPoint2Title}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t.privacyPoint2Body}
            </p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200 space-y-1.5">
            <h3 className="text-xs font-extrabold uppercase text-slate-800">
              {t.privacyPoint3Title}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t.privacyPoint3Body}
            </p>
          </div>
        </div>

        {/* User Sovereignty Controls */}
        <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={handleExportMyData}
              className="inline-flex min-h-[46px] items-center gap-2 rounded-xl bg-slate-900 hover:bg-slate-800 px-4 py-2.5 text-xs font-bold text-white transition-colors"
            >
              {downloaded ? (
                <>
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  <span>{t.copied}</span>
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  <span>{t.downloadBackupBtn}</span>
                </>
              )}
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="application/json,.json"
              onChange={handleImportFile}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex min-h-[46px] items-center gap-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-4 py-2.5 text-xs font-bold text-slate-800 transition-colors"
            >
              <Upload className="h-4 w-4 text-emerald-700" />
              <span>{t.restoreBackupBtn}</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => setConfirmResetOpen(true)}
            className="inline-flex min-h-[46px] items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 px-4 py-2.5 text-xs font-bold text-rose-700 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
            <span>{t.eraseLedgerBtn}</span>
          </button>
        </div>
      </div>

      {/* Accessible Confirmation Modal for Erasing Data */}
      <AccessibleModal
        isOpen={confirmResetOpen}
        onClose={() => setConfirmResetOpen(false)}
        labelledBy="erase-ledger-modal-title"
      >
        <div className="p-6 space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100 text-rose-700">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h3
                  id="erase-ledger-modal-title"
                  className="text-base font-bold text-slate-900"
                >
                  {t.eraseConfirmTitle}
                </h3>
                <p className="text-xs text-slate-500">{t.eraseConfirmSub}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setConfirmResetOpen(false)}
              aria-label={t.close}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            {t.eraseConfirmBody}
          </p>

          <div className="grid grid-cols-2 gap-2.5 pt-2">
            <button
              type="button"
              onClick={() => setConfirmResetOpen(false)}
              className="min-h-[46px] rounded-xl border border-slate-200 bg-white hover:bg-slate-50 py-2.5 text-xs font-bold text-slate-700"
            >
              {t.cancel}
            </button>
            <button
              type="button"
              onClick={handleConfirmErase}
              className="min-h-[46px] rounded-xl bg-rose-600 hover:bg-rose-700 py-2.5 text-xs font-bold text-white"
            >
              {t.eraseEverythingBtn}
            </button>
          </div>
        </div>
      </AccessibleModal>
    </div>
  );
};
