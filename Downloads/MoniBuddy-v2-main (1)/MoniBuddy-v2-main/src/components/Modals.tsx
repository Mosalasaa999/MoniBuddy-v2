import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { GoalPot } from '../types';
import { getLocalIsoDate } from '../cryptoLedger';
import { AccessibleModal } from './AccessibleModal';
import { VoiceCapturePanel } from './VoiceCapturePanel';
import {
  X,
  ShoppingBasket,
  GraduationCap,
  Store,
  Bus,
  HeartPulse,
  Sparkles,
  Mic,
  AlertTriangle
} from 'lucide-react';

interface NewPotModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewPotModal: React.FC<NewPotModalProps> = ({ isOpen, onClose }) => {
  const { createPot, t } = useApp();
  const [name, setName] = useState('');
  const [target, setTarget] = useState('');
  const [category, setCategory] = useState('Essential');
  const [icon, setIcon] = useState('Basket');
  const [color, setColor] = useState<GoalPot['color']>('emerald');

  const icons = [
    { id: 'Basket', icon: ShoppingBasket, color: 'emerald' as const },
    { id: 'School', icon: GraduationCap, color: 'amber' as const },
    { id: 'Store', icon: Store, color: 'blue' as const },
    { id: 'Bus', icon: Bus, color: 'purple' as const },
    { id: 'Heart', icon: HeartPulse, color: 'rose' as const },
    { id: 'Sparkles', icon: Sparkles, color: 'emerald' as const }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(target);
    if (!name.trim() || isNaN(num) || num <= 0) return;

    createPot({
      name: name.trim(),
      targetAmount: num,
      category,
      icon,
      color
    });
    setName('');
    setTarget('');
    onClose();
  };

  return (
    <AccessibleModal
      isOpen={isOpen}
      onClose={onClose}
      labelledBy="new-pot-modal-title"
    >
      <div className="p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h2 id="new-pot-modal-title" className="text-lg font-extrabold text-slate-900">
            {t.modalCreatePotTitle}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={t.close}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <p className="block text-xs font-bold text-slate-700 mb-1.5">
              {t.modalChooseIcon}
            </p>
            <div className="grid grid-cols-6 gap-2">
              {icons.map((item) => {
                const IconComp = item.icon;
                const active = icon === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    aria-label={item.id}
                    onClick={() => {
                      setIcon(item.id);
                      setColor(item.color);
                    }}
                    className={`flex h-11 items-center justify-center rounded-xl border transition-all ${
                      active
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-700 ring-2 ring-emerald-500/20'
                        : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    <IconComp className="h-5 w-5" />
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label
              htmlFor="new-pot-name"
              className="block text-xs font-bold text-slate-700 mb-1"
            >
              {t.modalSavingForLabel}
            </label>
            <input
              id="new-pot-name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t.modalSavingForPlaceholder}
              className="w-full min-h-[44px] rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:border-emerald-600 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="new-pot-target"
                className="block text-xs font-bold text-slate-700 mb-1"
              >
                {t.modalTargetAmountLabel}
              </label>
              <input
                id="new-pot-target"
                type="number"
                step="10"
                min="10"
                required
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                placeholder="1000"
                className="w-full min-h-[44px] rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-mono focus:border-emerald-600 focus:outline-none"
              />
            </div>
            <div>
              <label
                htmlFor="new-pot-category"
                className="block text-xs font-bold text-slate-700 mb-1"
              >
                {t.modalCategoryLabel}
              </label>
              <select
                id="new-pot-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full min-h-[44px] rounded-xl border border-slate-200 px-3 py-2.5 text-sm bg-white focus:border-emerald-600 focus:outline-none"
              >
                <option value="Essential">Essential</option>
                <option value="Education">Education</option>
                <option value="Business">Business / Stock</option>
                <option value="Family">Family</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="w-full min-h-[48px] rounded-xl bg-emerald-700 hover:bg-emerald-800 py-3 text-sm font-bold text-white shadow-sm transition-colors"
          >
            {t.modalCreatePotSubmit}
          </button>
        </form>
      </div>
    </AccessibleModal>
  );
};

interface PotActionModalProps {
  isOpen: boolean;
  pot: GoalPot | null;
  mode: 'deposit' | 'withdraw';
  onClose: () => void;
}

export const PotActionModal: React.FC<PotActionModalProps> = ({
  isOpen,
  pot,
  mode,
  onClose
}) => {
  const { depositToPot, withdrawFromPot, safeToSpend, t } = useApp();
  const [amount, setAmount] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setAmount('');
      setErrorMsg(null);
    }
  }, [isOpen, pot?.id, mode]);

  if (!pot) return null;

  const formatZAR = (val: number) => {
    const sign = val < 0 ? '-' : '';
    return `${sign}R ${Math.abs(val).toFixed(2)}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    const num = parseFloat(amount);
    if (isNaN(num) || num <= 0) return;

    const res =
      mode === 'deposit'
        ? depositToPot(pot.id, num)
        : withdrawFromPot(pot.id, num);

    if (!res.ok) {
      setErrorMsg(res.error || t.insufficientSafeCashError);
      return;
    }

    setAmount('');
    onClose();
  };

  return (
    <AccessibleModal
      isOpen={isOpen}
      onClose={onClose}
      labelledBy="pot-action-modal-title"
    >
      <div className="p-6 space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              {mode === 'deposit' ? t.modalPutMoneyIn : t.modalTakeMoneyOut}
            </span>
            <h2
              id="pot-action-modal-title"
              className="text-lg font-extrabold text-slate-900"
            >
              {pot.name}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t.close}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-200 text-xs flex justify-between gap-2">
          <span className="text-slate-600">
            {t.modalCurrentlyInPot}:{' '}
            <strong className="font-mono text-slate-900">
              {formatZAR(pot.currentAmount)}
            </strong>
          </span>
          <span className="text-slate-600">
            {t.modalAvailableSafeCash}:{' '}
            <strong className="font-mono text-emerald-700">
              {formatZAR(safeToSpend)}
            </strong>
          </span>
        </div>

        {errorMsg && (
          <div
            role="alert"
            className="rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-xs font-semibold text-rose-900 flex items-start gap-2"
          >
            <AlertTriangle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-2">
            {[50, 100, 200].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => {
                  setErrorMsg(null);
                  setAmount(preset.toString());
                }}
                className="flex-1 min-h-[42px] rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 py-2 text-xs font-bold font-mono text-slate-700"
              >
                R {preset}
              </button>
            ))}
          </div>

          <div>
            <label
              htmlFor="pot-action-amount"
              className="block text-xs font-bold text-slate-700 mb-1"
            >
              {t.amountRandLabel}
            </label>
            <input
              id="pot-action-amount"
              type="number"
              step="0.01"
              min="1"
              required
              value={amount}
              onChange={(e) => {
                setErrorMsg(null);
                setAmount(e.target.value);
              }}
              placeholder="0.00"
              className="w-full min-h-[46px] rounded-xl border border-slate-200 px-3.5 py-2.5 text-base font-mono focus:border-emerald-600 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className={`w-full min-h-[48px] rounded-xl py-3 text-sm font-bold text-white shadow-sm transition-colors ${
              mode === 'deposit'
                ? 'bg-emerald-700 hover:bg-emerald-800'
                : 'bg-slate-900 hover:bg-slate-800'
            }`}
          >
            {mode === 'deposit' ? t.modalSaveToPotBtn : t.modalTakeOutCashBtn}
          </button>
        </form>
      </div>
    </AccessibleModal>
  );
};

interface BufferModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BufferModal: React.FC<BufferModalProps> = ({ isOpen, onClose }) => {
  const { emergencyBuffer, safeToSpend, addToBuffer, withdrawFromBuffer, t } =
    useApp();
  const [mode, setMode] = useState<'deposit' | 'withdraw'>('deposit');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setAmount('');
      setNote('');
      setErrorMsg(null);
    }
  }, [isOpen]);

  const formatZAR = (val: number) => {
    const sign = val < 0 ? '-' : '';
    return `${sign}R ${Math.abs(val).toFixed(2)}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    const num = parseFloat(amount);
    if (isNaN(num) || num <= 0) return;

    const res =
      mode === 'deposit'
        ? addToBuffer(num, note.trim() || undefined)
        : withdrawFromBuffer(num, note.trim() || undefined);

    if (!res.ok) {
      setErrorMsg(res.error || t.insufficientSafeCashError);
      return;
    }

    setAmount('');
    setNote('');
    onClose();
  };

  return (
    <AccessibleModal
      isOpen={isOpen}
      onClose={onClose}
      labelledBy="buffer-modal-title"
    >
      <div className="p-6 space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2
              id="buffer-modal-title"
              className="text-lg font-extrabold text-slate-900"
            >
              {t.modalBufferTitle}
            </h2>
            <p className="text-xs text-slate-500">{t.modalBufferSub}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t.close}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid grid-cols-2 rounded-xl bg-slate-100 p-1">
          <button
            type="button"
            onClick={() => {
              setMode('deposit');
              setErrorMsg(null);
            }}
            className={`min-h-[42px] rounded-lg py-2 text-xs font-bold transition-all ${
              mode === 'deposit'
                ? 'bg-emerald-700 text-white shadow-sm'
                : 'text-slate-600'
            }`}
          >
            {t.addToBuffer}
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('withdraw');
              setErrorMsg(null);
            }}
            className={`min-h-[42px] rounded-lg py-2 text-xs font-bold transition-all ${
              mode === 'withdraw'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600'
            }`}
          >
            {t.modalUseBufferBtn}
          </button>
        </div>

        <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-200 text-xs flex justify-between gap-2">
          <span>
            {t.modalCurrentBufferLabel}:{' '}
            <strong className="font-mono">{formatZAR(emergencyBuffer)}</strong>
          </span>
          <span>
            {t.modalAvailableSafeCash}:{' '}
            <strong className="font-mono text-emerald-700">
              {formatZAR(safeToSpend)}
            </strong>
          </span>
        </div>

        {errorMsg && (
          <div
            role="alert"
            className="rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-xs font-semibold text-rose-900 flex items-start gap-2"
          >
            <AlertTriangle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="buffer-amount"
              className="block text-xs font-bold text-slate-700 mb-1"
            >
              {t.amountRandLabel}
            </label>
            <input
              id="buffer-amount"
              type="number"
              step="0.01"
              min="1"
              required
              value={amount}
              onChange={(e) => {
                setErrorMsg(null);
                setAmount(e.target.value);
              }}
              placeholder="100.00"
              className="w-full min-h-[46px] rounded-xl border border-slate-200 px-3.5 py-2.5 text-base font-mono focus:border-emerald-600 focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="buffer-note"
              className="block text-xs font-bold text-slate-700 mb-1"
            >
              {t.modalReasonOptionalLabel}
            </label>
            <input
              id="buffer-note"
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={t.modalReasonPlaceholder}
              className="w-full min-h-[44px] rounded-xl border border-slate-200 px-3.5 py-2 text-sm focus:border-emerald-600 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className={`w-full min-h-[48px] rounded-xl py-3 text-sm font-bold text-white shadow-sm transition-colors ${
              mode === 'deposit'
                ? 'bg-emerald-700 hover:bg-emerald-800'
                : 'bg-slate-900 hover:bg-slate-800'
            }`}
          >
            {mode === 'deposit' ? t.modalSaveToFundBtn : t.modalWithdrawCashBtn}
          </button>
        </form>
      </div>
    </AccessibleModal>
  );
};

interface VoiceCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VoiceCaptureModal: React.FC<VoiceCaptureModalProps> = ({
  isOpen,
  onClose
}) => {
  const { t } = useApp();
  const today = getLocalIsoDate();

  return (
    <AccessibleModal
      isOpen={isOpen}
      onClose={onClose}
      labelledBy="voice-capture-modal-title"
      maxWidthClass="max-w-3xl"
    >
      <div className="p-4 sm:p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
              <Mic className="h-4 w-4" />
            </div>
            <div>
              <h2
                id="voice-capture-modal-title"
                className="text-base font-extrabold text-slate-900"
              >
                {t.voiceModalTitle}
              </h2>
              <p className="text-xs text-slate-500">{t.voiceModalSub}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={t.close}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <VoiceCapturePanel selectedDate={today} />
      </div>
    </AccessibleModal>
  );
};
