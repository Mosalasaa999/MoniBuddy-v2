import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  AlertTriangle,
  ShieldCheck,
  ShieldAlert,
  PhoneCall,
  CheckCircle2,
  XCircle,
  MessageSquareWarning,
  SlidersHorizontal,
  Volume2,
  FileText,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  Info
} from 'lucide-react';
import {
  getOfficialMaxAgentFeeZar,
  type TransactionOperationType
} from '../scamParser';
import {
  SEPEDI_SCAM_BANNER_COPY,
  deduceScamAndBuildIncidentReport,
  getLocalizedSignalDescription,
  type SupportedWarningLanguage
} from '../scamDeductionEngine';
import { translations } from '../translations';
import { VoiceConfirmationModal } from '../components/VoiceConfirmationModal';

export const ScamGuard: React.FC = () => {
  const { language, t } = useApp();
  const [messageText, setMessageText] = useState('');
  const [showContextFields, setShowContextFields] = useState(false);

  // Payment context inputs
  const [recipientName, setRecipientName] = useState('');
  const [recipientIdentifier, setRecipientIdentifier] = useState('');
  const [amountInput, setAmountInput] = useState('');
  const [operationType, setOperationType] =
    useState<TransactionOperationType>('loan_fee_payment');
  const [isRegisteredLender, setIsRegisteredLender] = useState(false);
  const [isNewRecipient, setIsNewRecipient] = useState(true);
  const [agentFeeZarInput, setAgentFeeZarInput] = useState<number>(0);

  // Sync warning language with global UI language (with Sepedi option preserved)
  const [warningLang, setWarningLang] = useState<SupportedWarningLanguage>(language);
  useEffect(() => {
    setWarningLang(language);
  }, [language]);

  // Resolve UI copy in the active Scam Guard language so switching isiZulu/Sesotho in-tab updates banners immediately
  const activeT = warningLang === 'nso' ? t : translations[warningLang];
  const highRiskBannerTitle =
    warningLang === 'nso'
      ? SEPEDI_SCAM_BANNER_COPY.highRiskTitle
      : activeT.scamHighRiskBannerTitle;
  const highRiskBannerBody =
    warningLang === 'nso'
      ? SEPEDI_SCAM_BANNER_COPY.highRiskBody
      : activeT.scamHighRiskBannerBody;
  const cautionBannerTitle =
    warningLang === 'nso'
      ? SEPEDI_SCAM_BANNER_COPY.cautionTitle
      : activeT.scamCautionBannerTitle;
  const cautionBannerBody =
    warningLang === 'nso'
      ? SEPEDI_SCAM_BANNER_COPY.cautionBody
      : activeT.scamCautionBannerBody;

  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);
  const [showSummaryReport, setShowSummaryReport] = useState(false);
  const [copiedReport, setCopiedReport] = useState(false);

  const deductionResult = useMemo(() => {
    const parsedAmount = parseFloat(amountInput);
    const hasAmount = !isNaN(parsedAmount) && parsedAmount > 0;

    return deduceScamAndBuildIncidentReport({
      transcriptOrMessage: messageText,
      telemetry: showContextFields
        ? {
            recipientId: recipientIdentifier.trim() || 'UNSPECIFIED_RECIPIENT',
            recipientName: recipientName.trim() || undefined,
            amountZar: hasAmount ? parsedAmount : 0,
            recipientAccountAgeDays: isNewRecipient ? 1 : 180,
            isNewlyAddedRecipient: isNewRecipient,
            recentTransferCountLastHour: 1,
            operationType,
            agentFeeChargedZar:
              agentFeeZarInput > 0 ? agentFeeZarInput : undefined,
            isRegisteredCreditProvider: isRegisteredLender
          }
        : undefined,
      preferredLanguage: warningLang
    });
  }, [
    messageText,
    recipientName,
    recipientIdentifier,
    amountInput,
    operationType,
    isRegisteredLender,
    isNewRecipient,
    agentFeeZarInput,
    showContextFields,
    warningLang
  ]);

  const riskPercent = Math.round(deductionResult.evaluation.riskScore * 100);
  const severity = deductionResult.evaluation.severity;
  const isCritical = severity === 'CRITICAL' || severity === 'HIGH';
  const isCaution = severity === 'MEDIUM' || severity === 'LOW';

  const hasActiveEvaluation =
    messageText.trim().length > 0 ||
    recipientName.trim().length > 0 ||
    recipientIdentifier.trim().length > 0 ||
    (parseFloat(amountInput) > 0 && showContextFields);

  const handleOpenInterception = () => {
    setActionFeedback(null);
    setIsVoiceModalOpen(true);
  };

  const handleClearAll = () => {
    setMessageText('');
    setRecipientName('');
    setRecipientIdentifier('');
    setAmountInput('');
    setAgentFeeZarInput(0);
    setActionFeedback(null);
    setShowSummaryReport(false);
  };

  const buildPlainTextSummary = () => {
    const lines = [
      `${activeT.appName} — ${activeT.scamGuardTitle} (${new Date().toLocaleDateString('en-ZA')})`,
      `Risk Score: ${riskPercent}/100 (${severity})`,
      `Classification: ${deductionResult.localizedTitle}`,
      recipientName.trim()
        ? `${activeT.scamRecipientNameLabel}: ${recipientName.trim()}`
        : null,
      recipientIdentifier.trim()
        ? `${activeT.scamRecipientIdLabel}: ${recipientIdentifier.trim()}`
        : null,
      parseFloat(amountInput) > 0
        ? `${activeT.scamAmountRequestedLabel}: R${parseFloat(amountInput).toFixed(2)}`
        : null,
      '',
      `${activeT.scamWarningSignsHeading}:`,
      ...deductionResult.evaluation.signals.map(
        (sig, i) => `${i + 1}. ${getLocalizedSignalDescription(sig, warningLang)}`
      ),
      '',
      ...deductionResult.localizedActions.map((step) => `- ${step}`)
    ].filter((line): line is string => line !== null);

    return lines.join('\n');
  };

  const handleCopyReport = async () => {
    try {
      await navigator.clipboard.writeText(buildPlainTextSummary());
      setCopiedReport(true);
      setTimeout(() => setCopiedReport(false), 2500);
    } catch {
      setCopiedReport(false);
    }
  };

  const warningLanguages: { code: SupportedWarningLanguage; label: string }[] = [
    { code: 'en', label: 'English' },
    { code: 'zu', label: 'isiZulu' },
    { code: 'xh', label: 'isiXhosa' },
    { code: 'st', label: 'Sesotho' },
    { code: 'af', label: 'Afrikaans' },
    { code: 'nso', label: 'Sepedi' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">
            {activeT.scamGuardTitle}
          </h1>
          <p className="text-sm text-slate-600 mt-1">{activeT.scamGuardSub}</p>
        </div>

        {/* Warning Language Selector */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto rounded-xl border border-slate-200 bg-white p-1 shadow-xs flex-wrap">
          {warningLanguages.map((lang) => (
            <button
              key={lang.code}
              type="button"
              onClick={() => setWarningLang(lang.code)}
              className={`min-h-[38px] px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                warningLang === lang.code
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {lang.label}
            </button>
          ))}
        </div>
      </div>

      {/* Explicit Rule-Based Heuristic Disclaimer */}
      <div className="rounded-2xl border border-amber-200 bg-amber-50/80 p-4 flex items-start gap-3">
        <Info className="h-5 w-5 text-amber-800 shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs leading-relaxed">
          <p className="font-extrabold text-amber-950">
            {activeT.scamRuleBasedDisclaimerTitle}
          </p>
          <p className="text-amber-900">{activeT.scamRuleBasedDisclaimerBody}</p>
        </div>
      </div>

      {/* Dynamic Active Threat Warning Banner (High-Risk / Caution) */}
      {hasActiveEvaluation && isCritical && (
        <div
          role="alert"
          className="rounded-2xl border-2 border-rose-500 bg-rose-50 p-4 flex items-start gap-3"
        >
          <ShieldAlert className="h-6 w-6 text-rose-700 shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs leading-relaxed">
            <p className="font-extrabold text-rose-950">{highRiskBannerTitle}</p>
            <p className="text-rose-900">{highRiskBannerBody}</p>
          </div>
        </div>
      )}

      {hasActiveEvaluation && !isCritical && isCaution && (
        <div
          role="alert"
          className="rounded-2xl border-2 border-amber-400 bg-amber-50 p-4 flex items-start gap-3"
        >
          <AlertTriangle className="h-5 w-5 text-amber-800 shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs leading-relaxed">
            <p className="font-extrabold text-amber-950">{cautionBannerTitle}</p>
            <p className="text-amber-900">{cautionBannerBody}</p>
          </div>
        </div>
      )}

      {/* Action Feedback Banner */}
      {actionFeedback && (
        <div
          role="status"
          className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 flex items-center justify-between gap-3"
        >
          <div className="flex items-center gap-2.5 text-sm font-semibold text-emerald-900">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
            <span>{actionFeedback}</span>
          </div>
          <button
            type="button"
            onClick={() => setActionFeedback(null)}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-900"
          >
            {activeT.close}
          </button>
        </div>
      )}

      {/* Interactive Checker Box */}
      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
          {/* SMS / WhatsApp Message Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <label
                htmlFor="scam-message-input"
                className="flex items-center gap-2 text-sm font-bold text-slate-900"
              >
                <MessageSquareWarning className="h-4 w-4 text-amber-600" />
                <span>{activeT.scamPasteLabel}</span>
              </label>

              {hasActiveEvaluation && (
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-800"
                >
                  {activeT.scamClearChecker}
                </button>
              )}
            </div>

            <textarea
              id="scam-message-input"
              rows={4}
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder={activeT.scamPlaceholder}
              className="w-full rounded-xl border border-slate-200 p-3.5 text-sm text-slate-800 focus:border-emerald-600 focus:outline-none"
            />
          </div>

          {/* Collapsible Structured Payment Context */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/70">
            <button
              type="button"
              onClick={() => setShowContextFields((prev) => !prev)}
              className="w-full min-h-[48px] flex items-center justify-between px-4 py-3 text-left"
            >
              <span className="flex items-center gap-2 text-xs font-bold text-slate-800">
                <SlidersHorizontal className="h-4 w-4 text-slate-500" />
                <span>{activeT.scamPaymentDetailsTitle}</span>
              </span>
              <span className="flex items-center gap-1 text-xs font-semibold text-emerald-700">
                {showContextFields ? (
                  <>
                    <span>{activeT.scamHideDetails}</span>
                    <ChevronUp className="h-4 w-4" />
                  </>
                ) : (
                  <>
                    <span>{activeT.scamAddDetails}</span>
                    <ChevronDown className="h-4 w-4" />
                  </>
                )}
              </span>
            </button>

            {showContextFields && (
              <div className="px-4 pb-4 pt-1 border-t border-slate-200/80 grid sm:grid-cols-2 gap-3.5">
                <div>
                  <label
                    htmlFor="scam-recipient-name"
                    className="block text-xs font-bold text-slate-700 mb-1"
                  >
                    {activeT.scamRecipientNameLabel}
                  </label>
                  <input
                    id="scam-recipient-name"
                    type="text"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    placeholder="CashQuick Agents"
                    className="w-full min-h-[42px] rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 focus:border-emerald-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label
                    htmlFor="scam-recipient-id"
                    className="block text-xs font-bold text-slate-700 mb-1"
                  >
                    {activeT.scamRecipientIdLabel}
                  </label>
                  <input
                    id="scam-recipient-id"
                    type="text"
                    value={recipientIdentifier}
                    onChange={(e) => setRecipientIdentifier(e.target.value)}
                    placeholder="071 000 0000"
                    className="w-full min-h-[42px] rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 focus:border-emerald-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label
                    htmlFor="scam-amount"
                    className="block text-xs font-bold text-slate-700 mb-1"
                  >
                    {activeT.scamAmountRequestedLabel}
                  </label>
                  <input
                    id="scam-amount"
                    type="number"
                    min="0"
                    step="10"
                    value={amountInput}
                    onChange={(e) => setAmountInput(e.target.value)}
                    placeholder="450"
                    className="w-full min-h-[42px] rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-mono text-slate-800 focus:border-emerald-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label
                    htmlFor="scam-payment-type"
                    className="block text-xs font-bold text-slate-700 mb-1"
                  >
                    {activeT.scamPaymentTypeLabel}
                  </label>
                  <select
                    id="scam-payment-type"
                    value={operationType}
                    onChange={(e) =>
                      setOperationType(e.target.value as TransactionOperationType)
                    }
                    className="w-full min-h-[42px] rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-800 focus:border-emerald-600 focus:outline-none"
                  >
                    <option value="loan_fee_payment">{activeT.scamOpLoanFee}</option>
                    <option value="cash_out">{activeT.scamOpCashOut}</option>
                    <option value="p2p_transfer">{activeT.scamOpP2P}</option>
                    <option value="merchant_payment">{activeT.scamOpMerchant}</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="scam-fee-slider"
                    className="block text-xs font-bold text-slate-700 mb-1"
                  >
                    {activeT.scamAgentFeeLabelPrefix}: R {agentFeeZarInput}
                    {parseFloat(amountInput) > 0
                      ? ` (≤ R${getOfficialMaxAgentFeeZar(parseFloat(amountInput))})`
                      : ''}
                  </label>
                  <input
                    id="scam-fee-slider"
                    type="range"
                    min="0"
                    max="300"
                    step="10"
                    value={agentFeeZarInput}
                    onChange={(e) => setAgentFeeZarInput(Number(e.target.value))}
                    className="w-full accent-slate-900"
                  />
                </div>

                <div className="flex flex-col justify-center gap-2 pt-1">
                  <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!isRegisteredLender}
                      onChange={(e) => setIsRegisteredLender(!e.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 text-rose-600"
                    />
                    <span>{activeT.scamUnregisteredLenderCheck}</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isNewRecipient}
                      onChange={(e) => setIsNewRecipient(e.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 text-amber-600"
                    />
                    <span>{activeT.scamNewRecipientCheck}</span>
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Verdict & Defensive Action Panel */}
        <div className="lg:col-span-2">
          {!hasActiveEvaluation ? (
            <div className="h-full rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-6 flex flex-col items-center justify-center text-center space-y-3">
              <ShieldCheck className="h-10 w-10 text-emerald-600" />
              <h3 className="text-sm font-bold text-slate-800">
                {activeT.scamReadyTitle}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {activeT.scamReadyBody}
              </p>
            </div>
          ) : (
            <div
              className={`h-full rounded-2xl border-2 p-6 flex flex-col justify-between space-y-4 ${
                isCritical
                  ? 'border-rose-500 bg-rose-50/80'
                  : isCaution
                  ? 'border-amber-400 bg-amber-50/80'
                  : 'border-emerald-400 bg-emerald-50/80'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {isCritical ? (
                      <XCircle className="h-6 w-6 text-rose-600 shrink-0" />
                    ) : isCaution ? (
                      <ShieldAlert className="h-6 w-6 text-amber-600 shrink-0" />
                    ) : (
                      <CheckCircle2 className="h-6 w-6 text-emerald-600 shrink-0" />
                    )}
                    <h3
                      className={`text-sm font-extrabold leading-snug ${
                        isCritical
                          ? 'text-rose-900'
                          : isCaution
                          ? 'text-amber-900'
                          : 'text-emerald-900'
                      }`}
                    >
                      {deductionResult.localizedTitle}
                    </h3>
                  </div>

                  <span
                    className={`shrink-0 rounded-lg px-2.5 py-1 font-mono text-xs font-extrabold ${
                      isCritical
                        ? 'bg-rose-200/80 text-rose-900'
                        : isCaution
                        ? 'bg-amber-200/80 text-amber-900'
                        : 'bg-emerald-200/80 text-emerald-900'
                    }`}
                  >
                    {riskPercent}/100
                  </span>
                </div>

                {/* User-Friendly Plain Language Reasons */}
                {deductionResult.evaluation.signals.length > 0 ? (
                  <div className="space-y-2 pt-1">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-600">
                      {activeT.scamWarningSignsHeading}:
                    </p>
                    <ul className="space-y-1.5">
                      {deductionResult.evaluation.signals.map((sig) => (
                        <li
                          key={sig.ruleId}
                          className="flex items-start gap-2 text-xs font-medium text-slate-800 bg-white/90 rounded-lg p-2.5 border border-black/5"
                        >
                          <AlertTriangle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
                          <span>{getLocalizedSignalDescription(sig, warningLang)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <p className="text-xs text-emerald-900 leading-relaxed">
                    {activeT.scamNoKnownPatternAdvice}
                  </p>
                )}

                {/* Vernacular Actionable Next Steps */}
                <div className="space-y-1.5 pt-1">
                  <ul className="space-y-1">
                    {deductionResult.localizedActions.map((step, idx) => (
                      <li
                        key={idx}
                        className="text-xs text-slate-800 flex items-start gap-1.5"
                      >
                        <span className="font-bold text-slate-900">•</span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                {deductionResult.requiresVoiceConfirmationModal && (
                  <button
                    type="button"
                    onClick={handleOpenInterception}
                    className="w-full min-h-[48px] flex items-center justify-center gap-2 rounded-xl bg-rose-700 hover:bg-rose-800 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition-colors"
                  >
                    <Volume2 className="h-4 w-4" />
                    <span>{activeT.scamVerifyBtn}</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setShowSummaryReport((prev) => !prev)}
                  className="w-full min-h-[44px] flex items-center justify-center gap-2 rounded-xl bg-white/90 hover:bg-white border border-slate-200/80 px-4 py-2 text-xs font-bold text-slate-800 transition-colors"
                >
                  <FileText className="h-4 w-4 text-slate-600" />
                  <span>
                    {showSummaryReport
                      ? activeT.scamHideReportBtn
                      : activeT.scamFraudReportBtn}
                  </span>
                </button>

                <div className="rounded-xl bg-white/90 p-3 text-xs text-slate-700 border border-black/5">
                  <strong>
                    {severity === 'SAFE'
                      ? activeT.scamNoKnownPatternAdvice
                      : activeT.scamBlockAdvice}
                  </strong>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Shareable Fraud Summary Report */}
      {hasActiveEvaluation && showSummaryReport && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white">
                <FileText className="h-4 w-4" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  {activeT.scamFraudReportBtn}
                </h2>
                <p className="text-xs text-slate-500">
                  {deductionResult.localizedTitle}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleCopyReport}
              className="flex min-h-[44px] items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 px-3.5 py-2 text-xs font-bold text-slate-800 transition-colors"
            >
              {copiedReport ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                  <span className="text-emerald-700">{activeT.copied}</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5 text-slate-600" />
                  <span>{activeT.copy}</span>
                </>
              )}
            </button>
          </div>

          <pre className="whitespace-pre-wrap rounded-xl border border-slate-200 bg-slate-50 p-4 font-sans text-xs text-slate-800 leading-relaxed">
            {buildPlainTextSummary()}
          </pre>
        </div>
      )}

      {/* Official South African Fraud & Debt Helplines */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <PhoneCall className="h-5 w-5 text-emerald-700" />
          <h2 className="text-base font-bold text-slate-900">
            {activeT.scamHelplinesTitle}
          </h2>
        </div>
        <p className="text-xs text-slate-600">{activeT.scamHelplinesSub}</p>

        <div className="grid sm:grid-cols-3 gap-4">
          <div className="rounded-xl bg-slate-50 p-4 border border-slate-200 space-y-1">
            <span className="text-xs font-bold uppercase text-emerald-800">
              National Credit Regulator (NCR)
            </span>
            <p className="text-base font-extrabold font-mono text-slate-900">
              0860 627 627
            </p>
          </div>

          <div className="rounded-xl bg-slate-50 p-4 border border-slate-200 space-y-1">
            <span className="text-xs font-bold uppercase text-emerald-800">
              SASSA Official Toll-Free
            </span>
            <p className="text-base font-extrabold font-mono text-slate-900">
              0800 60 10 11
            </p>
          </div>

          <div className="rounded-xl bg-slate-50 p-4 border border-slate-200 space-y-1">
            <span className="text-xs font-bold uppercase text-emerald-800">
              SA Fraud Prevention Service
            </span>
            <p className="text-base font-extrabold font-mono text-slate-900">
              011 867 2234
            </p>
          </div>
        </div>
      </div>

      {/* High-Risk Voice Confirmation Interception Modal */}
      <VoiceConfirmationModal
        isOpen={isVoiceModalOpen}
        deduction={deductionResult}
        initialLanguage={warningLang}
        onClose={() => setIsVoiceModalOpen(false)}
        onCancelAndBlock={() => {
          setIsVoiceModalOpen(false);
          setActionFeedback(activeT.scamBlockAdvice);
        }}
        onAcknowledgeProceed={() => {
          setIsVoiceModalOpen(false);
        }}
      />
    </div>
  );
};
