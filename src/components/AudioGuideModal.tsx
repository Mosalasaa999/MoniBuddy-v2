import React from 'react';
import { useApp } from '../context/AppContext';
import { TabType } from '../types';
import { AccessibleModal } from './AccessibleModal';
import { Volume2, VolumeX, X, Sparkles } from 'lucide-react';

interface AudioGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTab: TabType;
}

export const AudioGuideModal: React.FC<AudioGuideModalProps> = ({
  isOpen,
  onClose,
  currentTab
}) => {
  const { isSpeaking, speakText, stopSpeaking, t } = useApp();

  const guide = t.audioGuides[currentTab];

  const handlePlay = () => {
    if (isSpeaking) {
      stopSpeaking();
    } else {
      speakText(`${guide.title}. ${guide.content} ${guide.keyAdvice}`);
    }
  };

  const handleClose = () => {
    stopSpeaking();
    onClose();
  };

  return (
    <AccessibleModal
      isOpen={isOpen}
      onClose={handleClose}
      labelledBy="audio-guide-modal-title"
      maxWidthClass="max-w-lg"
    >
      <div className="p-6 space-y-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800">
              <Volume2 className="h-5 w-5" />
            </div>
            <div>
              <h2
                id="audio-guide-modal-title"
                className="text-base font-extrabold text-slate-900"
              >
                {guide.title}
              </h2>
              <p className="text-xs text-slate-500">{t.audioGuideTranscript}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            aria-label={t.close}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200 space-y-3">
          <p className="text-sm text-slate-800 leading-relaxed">{guide.content}</p>
          <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 flex items-start gap-2 text-xs text-emerald-950 font-semibold">
            <Sparkles className="h-4 w-4 text-emerald-700 shrink-0 mt-0.5" />
            <span>{guide.keyAdvice}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handlePlay}
            className={`flex-1 min-h-[48px] flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-white shadow-sm transition-colors ${
              isSpeaking
                ? 'bg-amber-600 hover:bg-amber-700'
                : 'bg-emerald-700 hover:bg-emerald-800'
            }`}
          >
            {isSpeaking ? (
              <>
                <VolumeX className="h-4 w-4" />
                <span>{t.stopAudio}</span>
              </>
            ) : (
              <>
                <Volume2 className="h-4 w-4" />
                <span>{t.listen}</span>
              </>
            )}
          </button>
          <button
            type="button"
            onClick={handleClose}
            className="min-h-[48px] rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50"
          >
            {t.close}
          </button>
        </div>
      </div>
    </AccessibleModal>
  );
};
