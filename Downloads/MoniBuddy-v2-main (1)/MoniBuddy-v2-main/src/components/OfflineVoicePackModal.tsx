import React from 'react';
import { Download, Wifi, Grid3X3, X, AlertTriangle, Loader2 } from 'lucide-react';
import { ConnectionProfile, WasmVoicePackSnapshot } from '../VoiceRecorder';
import { useApp } from '../context/AppContext';
import { AccessibleModal } from './AccessibleModal';

interface OfflineVoicePackModalProps {
  isOpen: boolean;
  onClose: () => void;
  packState: WasmVoicePackSnapshot;
  connectionProfile: ConnectionProfile;
  onDownloadNow: () => void;
  onCancelDownload: () => void;
  onDownloadLaterOnWifi: () => void;
  onUseManualTouchPad: () => void;
}

export const OfflineVoicePackModal: React.FC<OfflineVoicePackModalProps> = ({
  isOpen,
  onClose,
  packState,
  connectionProfile,
  onDownloadNow,
  onCancelDownload,
  onDownloadLaterOnWifi,
  onUseManualTouchPad
}) => {
  const { t } = useApp();
  const isDownloading = packState.status === 'downloading';
  const isOffline = connectionProfile === 'offline';

  return (
    <AccessibleModal
      isOpen={isOpen}
      onClose={onClose}
      labelledBy="voice-pack-modal-title"
      preventClose={isDownloading}
    >
      <div className="p-5 sm:p-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-800 border border-amber-200/70">
              <Download className="h-5 w-5" />
            </div>
            <div>
              <h3
                id="voice-pack-modal-title"
                className="text-base font-bold text-slate-900"
              >
                {t.voicePackModalTitle}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {t.voicePackModalSub}
              </p>
            </div>
          </div>

          {!isDownloading && (
            <button
              type="button"
              onClick={onClose}
              aria-label={t.close}
              className="flex min-h-[44px] min-w-[44px] -m-1.5 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Body */}
        <div className="py-4 space-y-3.5 text-sm text-slate-700 leading-relaxed">
          <p>{t.voicePackModalBody}</p>

          {connectionProfile === 'cellular' && (
            <div className="rounded-xl border border-amber-200 bg-amber-50/80 p-3 text-xs text-amber-950 flex items-start gap-2.5">
              <AlertTriangle className="h-4 w-4 text-amber-700 shrink-0 mt-0.5" />
              <span>{t.voicePackCellularWarn}</span>
            </div>
          )}

          {isOffline && (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-700">
              {t.voicePackOfflineWarn}
            </div>
          )}

          {isDownloading && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-3.5 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-emerald-950">
                <span className="inline-flex items-center gap-1.5">
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-emerald-700" />
                  {t.downloadingProgressPrefix}...
                </span>
                <span className="font-mono tabular-nums">{packState.progress}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-emerald-200/70">
                <div
                  className="h-full bg-emerald-700 transition-all duration-200"
                  style={{ width: `${Math.max(4, packState.progress)}%` }}
                />
              </div>
            </div>
          )}

          {packState.error && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-900">
              {packState.error}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5 pt-2">
          {!isDownloading ? (
            <>
              <button
                type="button"
                disabled={isOffline}
                onClick={onDownloadNow}
                className="w-full min-h-[48px] flex items-center justify-center gap-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 disabled:bg-slate-200 disabled:text-slate-400 px-4 py-3 text-xs font-bold text-white transition-colors cursor-pointer disabled:cursor-not-allowed"
              >
                <Download className="h-4 w-4" />
                <span>{t.voicePackDownloadNow}</span>
              </button>

              <button
                type="button"
                onClick={onDownloadLaterOnWifi}
                className="w-full min-h-[48px] flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-4 py-3 text-xs font-bold text-slate-800 transition-colors cursor-pointer"
              >
                <Wifi className="h-4 w-4 text-emerald-700" />
                <span>{t.voicePackDownloadWifi}</span>
              </button>

              <button
                type="button"
                onClick={onUseManualTouchPad}
                className="w-full min-h-[48px] flex items-center justify-center gap-2 rounded-xl border border-slate-900 bg-slate-900 hover:bg-slate-800 px-4 py-3 text-xs font-bold text-white transition-colors cursor-pointer"
              >
                <Grid3X3 className="h-4 w-4" />
                <span>{t.voicePackUseTouchPad}</span>
              </button>
            </>
          ) : (
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={onCancelDownload}
                className="min-h-[48px] rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 px-4 py-2.5 text-xs font-bold text-rose-900 transition-colors cursor-pointer"
              >
                {t.voicePackCancelDownload}
              </button>
              <button
                type="button"
                onClick={onUseManualTouchPad}
                className="min-h-[48px] rounded-xl bg-slate-900 hover:bg-slate-800 px-4 py-2.5 text-xs font-bold text-white transition-colors cursor-pointer"
              >
                {t.voicePackUseTouchMeanwhile}
              </button>
            </div>
          )}
        </div>
      </div>
    </AccessibleModal>
  );
};
