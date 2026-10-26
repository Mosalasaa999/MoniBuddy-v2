import React, { useEffect, useState } from 'react';
import {
  ShieldAlert,
  Volume2,
  VolumeX,
  X,
  Ban,
  CheckCircle2
} from 'lucide-react';
import {
  ScamDeductionResult,
  SupportedWarningLanguage
} from '../scamDeductionEngine';
import { useApp } from '../context/AppContext';
import { translations } from '../translations';
import { AccessibleModal } from './AccessibleModal';

interface VoiceConfirmationModalProps {
  isOpen: boolean;
  deduction: ScamDeductionResult | null;
  initialLanguage?: SupportedWarningLanguage;
  onCancelAndBlock: () => void;
  onAcknowledgeProceed: () => void;
  onClose: () => void;
}

export const VoiceConfirmationModal: React.FC<VoiceConfirmationModalProps> = ({
  isOpen,
  deduction,
  initialLanguage = 'en',
  onCancelAndBlock,
  onAcknowledgeProceed,
  onClose
}) => {
  const { speakText, stopSpeaking, isSpeaking, t } = useApp();
  const [selectedLang, setSelectedLang] =
    useState<SupportedWarningLanguage>(initialLanguage);
  const [confirmedUnderstand, setConfirmedUnderstand] =
    useState<boolean>(false);

  useEffect(() => {
    setSelectedLang(initialLanguage);
  }, [initialLanguage]);

  if (!deduction) return null;

  const modalT = selectedLang === 'nso' ? t : translations[selectedLang];
  const activeScript = deduction.audioWarningScripts[selectedLang];
  const activeTitle = deduction.template.title[selectedLang];
  const activeActions = deduction.template.recommendedActions[selectedLang];

  const handleToggleSpeech = () => {
    if (isSpeaking) {
      stopSpeaking();
    } else {
      const langLocale =
        selectedLang === 'zu'
          ? 'zu-ZA'
          : selectedLang === 'xh'
          ? 'xh-ZA'
          : selectedLang === 'st'
          ? 'st-ZA'
          : selectedLang === 'af'
          ? 'af-ZA'
          : 'en-ZA';
      speakText(activeScript, langLocale);
    }
  };

  const handleBlockClick = () => {
    stopSpeaking();
    setConfirmedUnderstand(false);
    onCancelAndBlock();
  };

  const handleProceedClick = () => {
    if (!confirmedUnderstand) return;
    stopSpeaking();
    setConfirmedUnderstand(false);
    onAcknowledgeProceed();
  };

  const handleModalClose = () => {
    stopSpeaking();
    setConfirmedUnderstand(false);
    onClose();
  };

  const languageOptions: { code: SupportedWarningLanguage; label: string }[] = [
    { code: 'en', label: 'English' },
    { code: 'zu', label: 'isiZulu' },
    { code: 'xh', label: 'isiXhosa' },
    { code: 'st', label: 'Sesotho' },
    { code: 'af', label: 'Afrikaans' },
    { code: 'nso', label: 'Sepedi' }
  ];

  return (
    <AccessibleModal
      isOpen={isOpen}
      onClose={handleModalClose}
      labelledBy="voice-scam-modal-title"
      maxWidthClass="max-w-lg"
    >
      {/* Top Danger Header */}
      <div className="bg-rose-700 px-6 py-4 text-white flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/15">
            <ShieldAlert className="h-6 w-6 text-white" />
          </div>
          <div>
            <span className="inline-block rounded-md bg-rose-900/70 px-2 py-0.5 text-xs font-extrabold uppercase tracking-wider text-rose-100">
              {modalT.scamModalHighRiskBadge} • {Math.round(deduction.evaluation.riskScore * 100)}/100
            </span>
            <h2
              id="voice-scam-modal-title"
              className="text-base font-extrabold leading-snug mt-0.5"
            >
              {activeTitle}
            </h2>
          </div>
        </div>

        <button
          type="button"
          onClick={handleModalClose}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-rose-100 hover:bg-white/10 transition-colors"
          aria-label={modalT.close}
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Body */}
      <div className="p-6 space-y-5">
        {/* Language Switcher */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
            {modalT.scamModalListenHeading}
          </span>
          <div className="flex flex-wrap rounded-xl bg-slate-100 p-1 gap-1">
            {languageOptions.map((lang) => (
              <button
                key={lang.code}
                type="button"
                onClick={() => {
                  stopSpeaking();
                  setSelectedLang(lang.code);
                }}
                className={`min-h-[34px] px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                  selectedLang === lang.code
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </div>

        {/* Vernacular Audio Script Box */}
        <div className="rounded-xl border border-rose-200 bg-rose-50/70 p-4 space-y-3">
          <p className="text-sm font-medium text-slate-900 leading-relaxed">
            “{activeScript}”
          </p>

          <button
            type="button"
            onClick={handleToggleSpeech}
            className={`w-full min-h-[48px] flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition-colors ${
              isSpeaking
                ? 'bg-slate-900 text-white hover:bg-slate-800'
                : 'bg-rose-600 text-white hover:bg-rose-700'
            }`}
          >
            {isSpeaking ? (
              <>
                <VolumeX className="h-4 w-4" />
                <span>{modalT.scamModalStopBtn}</span>
              </>
            ) : (
              <>
                <Volume2 className="h-4 w-4" />
                <span>{modalT.scamModalPlayBtn}</span>
              </>
            )}
          </button>
        </div>

        {/* Recommended Steps */}
        <div className="space-y-2">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-600">
            {modalT.scamModalMandatoryChecks}
          </p>
          <ul className="space-y-1.5">
            {activeActions.map((step, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2 text-xs font-medium text-slate-700"
              >
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{step}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Friction Acknowledgment */}
        <label className="flex items-start gap-2.5 rounded-xl border border-slate-200 bg-slate-50 p-3 cursor-pointer">
          <input
            type="checkbox"
            checked={confirmedUnderstand}
            onChange={(e) => setConfirmedUnderstand(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-slate-300 text-rose-600 focus:ring-rose-500"
          />
          <span className="text-xs text-slate-700 leading-relaxed">
            {modalT.scamModalAckCheckbox}
          </span>
        </label>

        {/* Actions */}
        <div className="grid sm:grid-cols-2 gap-3 pt-1">
          <button
            type="button"
            onClick={handleBlockClick}
            className="min-h-[48px] flex items-center justify-center gap-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 px-4 py-3 text-sm font-bold text-white shadow-sm transition-colors"
          >
            <Ban className="h-4 w-4" />
            <span>{modalT.scamModalCancelBlockBtn}</span>
          </button>

          <button
            type="button"
            disabled={!confirmedUnderstand}
            onClick={handleProceedClick}
            className={`min-h-[48px] rounded-xl px-4 py-3 text-xs font-bold border transition-colors ${
              confirmedUnderstand
                ? 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                : 'border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed'
            }`}
          >
            {modalT.scamModalProceedBtn}
          </button>
        </div>
      </div>
    </AccessibleModal>
  );
};
