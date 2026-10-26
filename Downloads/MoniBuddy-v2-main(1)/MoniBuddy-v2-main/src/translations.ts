import { Language, TabType } from './types';

export interface AudioGuideEntry {
  title: string;
  content: string;
  keyAdvice: string;
}

export interface TranslationStrings {
  appName: string;
  tagline: string;

  // Common UI & Actions
  cancel: string;
  close: string;
  save: string;
  clear: string;
  remove: string;
  copy: string;
  copied: string;
  hide: string;
  show: string;
  listen: string;
  stopAudio: string;
  audioGuide: string;
  audioGuideActive: string;
  audioGuideTranscript: string;
  largeTextLabel: string;
  largeTextTitle: string;
  languageLabel: string;
  lockAndSignOut: string;
  signedInAs: string;
  offlineBanner: string;
  localLedgerActive: string;
  offlineSavedOnPhone: string;
  encryptedAesBadge: string;
  savedAtPrefix: string;
  moreMenu: string;
  myMoneySection: string;
  guidePrivacySection: string;

  // Navigation
  navOverview: string;
  navIncomeExpenses: string;
  navBufferCredit: string;
  navScamGuard: string;
  nav2gSync: string;
  navTechnicalBrief: string;
  navPrivacyLegal: string;
  navShortPots: string;
  navShortCash: string;
  navShortLoan: string;
  navShortScam: string;

  // Auth & Login Page
  authHeroBadge: string;
  authHeroBody: string;
  authFeature1Title: string;
  authFeature1Body: string;
  authFeature2Title: string;
  authFeature2Body: string;
  authFeature3Title: string;
  authFeature3Body: string;
  authSignInTab: string;
  authRegisterTab: string;
  authSignInTitle: string;
  authSignInSubtitle: string;
  authRegisterTitle: string;
  authRegisterSubtitle: string;
  authNoAccountYet: string;
  authCreateOneLink: string;
  authMobileOrEmailLabel: string;
  authMobileLabel: string;
  authPinLabel: string;
  authShowPin: string;
  authHidePin: string;
  authPinPlaceholder: string;
  authRememberPhone: string;
  authUnlockButton: string;
  authUnlockingButton: string;
  authFullNameLabel: string;
  authFullNamePlaceholder: string;
  authCreatePinLabel: string;
  authConfirmPinLabel: string;
  authEmailOptionalLabel: string;
  authEmailOptionalPlaceholder: string;
  authCreateAccountButton: string;
  authCreatingButton: string;
  authFooterGuarantee: string;
  authFooterLeft: string;
  authFooterRight: string;
  authAudioSignIn: string;
  authAudioRegister: string;
  authErrMissingCredentials: string;
  authErrIncorrectCredentials: string;
  authErrPinLockedPrefix: string;
  authErrPinLockedSuffix: string;
  authErrAttemptsLeftPrefix: string;
  authErrPinMismatch: string;
  authErrMissingName: string;
  authErrInvalidPhone: string;
  authErrInvalidPinFormat: string;
  authErrAccountExists: string;
  authGoogleButton: string;
  googleBackupActive: string;
  googleBackupSync: string;
  googleLoginSuccess: string;
  googleLoginError: string;
  googleEmailPrompt: string;
  googleDetailsModalTitle: string;
  googleDetailsModalSubtitle: string;
  googleDetailsEmailLabel: string;
  googleDetailsNameLabel: string;
  googleDetailsPhoneLabel: string;
  googleDetailsPinLabel: string;
  googleDetailsConfirmPinLabel: string;
  googleDetailsSubmit: string;

  // Overview & Pots
  safeToSpend: string;
  safeToSpendDesc: string;
  overspentWarningTitle: string;
  overspentWarningDesc: string;
  startingBalance: string;
  setStartingCash: string;
  updateStartingCash: string;
  startingCashFirstTimePrompt: string;
  startingCashEditPrompt: string;
  saveStartingBalance: string;
  startingTotal: string;
  income: string;
  expenses: string;
  goalSavings: string;
  emergencyBuffer: string;
  forecastReadyPrefix: string;
  forecastReadySuffix: string;
  forecastPendingTitle: string;
  forecastPendingBody: string;
  zeroInterestSelfFunded: string;
  bufferCoversPrefix: string;
  bufferCoversWeeksUnit: string;
  bufferCoversSuffix: string;
  bufferEmptyPrompt: string;
  activePotsSuffix: string;
  potsSummaryDesc: string;
  microSavingsPots: string;
  potsSubtitle: string;
  newGoalPot: string;
  createFirstPot: string;
  noPotsYetTitle: string;
  emptyPotsMsg: string;
  goalLabel: string;
  savedPercentSuffix: string;
  goalReachedLabel: string;
  deposit: string;
  withdraw: string;
  howItWorks: string;
  howStep1Title: string;
  howStep1Body: string;
  howStep2Title: string;
  howStep2Body: string;
  howStep3Title: string;
  howStep3Body: string;
  howStep4Title: string;
  howStep4Body: string;
  addToBuffer: string;
  insufficientSafeCashError: string;
  insufficientBufferError: string;
  insufficientPotError: string;

  // Income & Expenses + Voice / Touch Pad
  cashLogTitle: string;
  cashLogSubtitle: string;
  totalMoneyIn: string;
  totalMoneyInSub: string;
  totalMoneyOut: string;
  totalMoneyOutSub: string;
  last7DaysTitle: string;
  last7DaysSub: string;
  sevenDayWindow: string;
  peakDayPrefix: string;
  manualEntryTitle: string;
  manualEntrySub: string;
  moneyOutBtn: string;
  moneyInBtn: string;
  commonCategoriesLabel: string;
  descriptionLabel: string;
  descriptionPlaceholder: string;
  amountRandLabel: string;
  dateLabel: string;
  saveEntryBtn: string;
  recordedTransactionsTitle: string;
  recordedTransactionsSub: string;
  recordsCountSuffix: string;
  noTransactionsTitle: string;
  noTransactionsBody: string;
  presetGroceries: string;
  presetTaxi: string;
  presetElectricity: string;
  presetSpaza: string;
  presetAirtime: string;
  presetWages: string;
  presetHustle: string;
  presetGrant: string;

  // Voice Capture & Touch Pad
  voiceNavBtn: string;
  voiceModalTitle: string;
  voiceModalSub: string;
  quickVoiceTouchTitle: string;
  voiceTabLabel: string;
  touchPadTabLabel: string;
  speakTransactionBtn: string;
  doneSpeakingBtn: string;
  stopListeningBtn: string;
  transcribingOfflineMsg: string;
  offlineVoicePackBtn: string;
  downloadingProgressPrefix: string;
  slangGuideShow: string;
  slangGuideHide: string;
  slangGuideHeading: string;
  listeningOfflineHint: string;
  onDeviceAudioBadge: string;
  spokenPhraseLabel: string;
  spokenPhrasePlaceholder: string;
  voiceNetworkLimitationNote: string;
  noAmountParsedError: string;
  openTouchPadBtn: string;
  entriesReadyTitle: string;
  recognizedSlangPrefix: string;
  emptyPreviewTouchHint: string;
  emptyPreviewVoiceHint: string;
  editInFormBtn: string;
  saveEntriesBtnPrefix: string;
  saveEntriesBtnSuffix: string;
  savedEntriesNoticePrefix: string;
  modeTouchActive: string;
  modeCloudSpeech: string;
  modeOnDeviceSpeech: string;
  modeOfflineSpeechReady: string;
  modeOfflinePackAvailable: string;
  packSavedStatus: string;
  packSavingPrefix: string;
  packWaitingWifi: string;
  packDataProtected: string;
  touchStep1Category: string;
  touchStep2Slang: string;
  touchZeroTyping: string;
  touchTapAboveBtn: string;
  touchAddItemPrefix: string;
  voicePackModalTitle: string;
  voicePackModalSub: string;
  voicePackModalBody: string;
  voicePackCellularWarn: string;
  voicePackOfflineWarn: string;
  voicePackDownloadNow: string;
  voicePackDownloadWifi: string;
  voicePackUseTouchPad: string;
  voicePackCancelDownload: string;
  voicePackUseTouchMeanwhile: string;

  // Emergency Buffer & Loan Shield (NCA Reg 42)
  loanShieldBadge: string;
  loanShieldTitle: string;
  loanShieldSubtitle: string;
  yourEmergencySavings: string;
  depositR100Btn: string;
  depositR250Btn: string;
  manageFundBtn: string;
  burnRateTitle: string;
  burnRateSub: string;
  perWeekSuffix: string;
  twoWeekTargetTitle: string;
  twoWeekTargetBodyPrefix: string;
  twoWeekTargetBodySuffix: string;
  oneMonthTargetTitle: string;
  oneMonthTargetBodyPrefix: string;
  oneMonthTargetBodySuffix: string;
  loanQuoteTitle: string;
  loanQuoteSubtitle: string;
  loanPrincipalLabel: string;
  loanInputModeRepayment: string;
  loanInputModeMonthlyRate: string;
  loanQuotedRepaymentLabel: string;
  loanMonthlyRateLabel: string;
  loanExtraFeesLabel: string;
  loanTermDaysLabel: string;
  loanFirstLoanToggle: string;
  loanQuoteCardTitle: string;
  loanNcaCapCardTitle: string;
  loanSelfBufferCardTitle: string;
  loanTotalRepayLabel: string;
  loanTotalCostLabel: string;
  loanEffectiveAprLabel: string;
  loanStatusExceedsCap: string;
  loanStatusWithinCap: string;
  loanOverchargeVsNcaLabel: string;
  loanSavedWithBufferLabel: string;
  loanNcaCitation: string;
  loanSaferAlternativesTitle: string;
  loanAlt1: string;
  loanAlt2: string;
  loanAlt3: string;
  loanEducationalDisclaimer: string;
  loanProtectionBannerTitle: string;
  loanProtectionBannerBody: string;
  loanPredatoryWarningBannerTitle: string;
  loanPredatoryWarningBannerBodyPrefix: string;
  loanPredatoryWarningBannerBodySuffix: string;
  loanLegalCautionBannerTitle: string;
  loanLegalCautionBannerBodyPrefix: string;
  loanLegalCautionBannerBodySuffix: string;

  // Scam Guard & Voice Confirmation Modal
  scamGuardTitle: string;
  scamGuardSub: string;
  scamRuleBasedDisclaimerTitle: string;
  scamRuleBasedDisclaimerBody: string;
  scamHighRiskBannerTitle: string;
  scamHighRiskBannerBody: string;
  scamCautionBannerTitle: string;
  scamCautionBannerBody: string;
  scamPasteLabel: string;
  scamClearChecker: string;
  scamPlaceholder: string;
  scamPaymentDetailsTitle: string;
  scamAddDetails: string;
  scamHideDetails: string;
  scamRecipientNameLabel: string;
  scamRecipientIdLabel: string;
  scamAmountRequestedLabel: string;
  scamPaymentTypeLabel: string;
  scamOpLoanFee: string;
  scamOpCashOut: string;
  scamOpP2P: string;
  scamOpMerchant: string;
  scamAgentFeeLabelPrefix: string;
  scamUnregisteredLenderCheck: string;
  scamNewRecipientCheck: string;
  scamReadyTitle: string;
  scamReadyBody: string;
  scamVerifyBtn: string;
  scamFraudReportBtn: string;
  scamHideReportBtn: string;
  scamWarningSignsHeading: string;
  scamNoKnownPatternAdvice: string;
  scamBlockAdvice: string;
  scamHelplinesTitle: string;
  scamHelplinesSub: string;
  scamModalHighRiskBadge: string;
  scamModalListenHeading: string;
  scamModalPlayBtn: string;
  scamModalStopBtn: string;
  scamModalMandatoryChecks: string;
  scamModalAckCheckbox: string;
  scamModalCancelBlockBtn: string;
  scamModalProceedBtn: string;

  // USSD & No-Data Simulator
  syncBadge: string;
  syncTitle: string;
  syncSub: string;
  ussdSimNoticeTitle: string;
  ussdSimNoticeBody: string;
  savedTransactionsLabel: string;
  activeSavingsPotsLabel: string;
  verifyLocalLedgerBtn: string;
  verifyingLocalLedgerBtn: string;
  offlineAirplaneGuarantee: string;
  installHomeScreenHint: string;
  ussdShortcodeCardTitle: string;
  ussdShortcodeCardBody: string;
  launchSimulatorBtn: string;
  copyShortcodeBtn: string;
  copiedShortcodeBtn: string;
  ussdSimulatorTag: string;
  ussdOpenMenuBtn: string;
  ussdCloseMenuBtn: string;
  ussdSendBtn: string;

  // How It Works & Sustainability (TechnicalBrief)
  techBadge: string;
  technicalBriefTitle: string;
  techSubtitle: string;
  techCap1Title: string;
  techCap1Body: string;
  techCap2Title: string;
  techCap2Body: string;
  techCap3Title: string;
  techCap3Body: string;
  techCap4Title: string;
  techCap4Body: string;
  sustainabilityTitle: string;
  sustainabilitySubtitle: string;
  sustModel1Title: string;
  sustModel1Body: string;
  sustModel2Title: string;
  sustModel2Body: string;
  sustModel3Title: string;
  sustModel3Body: string;
  dignityTitle: string;
  dignitySubtitle: string;
  dignity1Title: string;
  dignity1Body: string;
  dignity2Title: string;
  dignity2Body: string;
  dignity3Title: string;
  dignity3Body: string;

  // Privacy & Legal + Modals + PWA
  privacyBadge: string;
  privacyGuaranteeTitle: string;
  privacySubtitle: string;
  privacyMainHeading: string;
  privacyMainBody: string;
  privacyPoint1Title: string;
  privacyPoint1Body: string;
  privacyPoint2Title: string;
  privacyPoint2Body: string;
  privacyPoint3Title: string;
  privacyPoint3Body: string;
  downloadBackupBtn: string;
  restoreBackupBtn: string;
  eraseLedgerBtn: string;
  eraseConfirmTitle: string;
  eraseConfirmSub: string;
  eraseConfirmBody: string;
  eraseEverythingBtn: string;
  backupDownloadedMsg: string;
  backupRestoredMsg: string;
  backupInvalidMsg: string;
  ledgerErasedMsg: string;

  // Modals (New Pot, Pot Action, Buffer) & PWA Install
  modalCreatePotTitle: string;
  modalChooseIcon: string;
  modalSavingForLabel: string;
  modalSavingForPlaceholder: string;
  modalTargetAmountLabel: string;
  modalCategoryLabel: string;
  modalCreatePotSubmit: string;
  modalPutMoneyIn: string;
  modalTakeMoneyOut: string;
  modalCurrentlyInPot: string;
  modalAvailableSafeCash: string;
  modalSaveToPotBtn: string;
  modalTakeOutCashBtn: string;
  modalBufferTitle: string;
  modalBufferSub: string;
  modalUseBufferBtn: string;
  modalCurrentBufferLabel: string;
  modalReasonOptionalLabel: string;
  modalReasonPlaceholder: string;
  modalSaveToFundBtn: string;
  modalWithdrawCashBtn: string;
  pwaInstallOfflineApp: string;
  pwaInstallOnIphone: string;
  pwaIosGuideTitle: string;
  pwaIosStep1: string;
  pwaIosStep2: string;
  pwaGotIt: string;

  authErrLedgerDecryptFailed: string;
  warningUnencryptedLedger: string;
  authPinLengthHint: string;
  welcomeModalTitle: string;
  welcomeModalStep1Title: string;
  welcomeModalStep1Body: string;
  welcomeModalStep2Title: string;
  welcomeModalStep2Body: string;
  welcomeModalStep3Title: string;
  welcomeModalStep3Body: string;
  welcomeModalSkip: string;
  welcomeModalNext: string;
  welcomeModalFinish: string;
  scamGuardDisclaimer: string;
  loanAnnualisedCost: string;
  loanPrincipalMinError: string;
  loanTermMinError: string;
  ussdDemoNotice: string;
  ussdDemoBadge: string;
  sourceLabel: string;
  lastVerifiedLabel: string;
  unverifiedBadge: string;
  voiceOfflineNote: string;

  // Spoken Audio Guides per Tab
  audioGuides: Record<TabType, AudioGuideEntry>;
}

export const translations: Record<Language, TranslationStrings> = {
  en: {
    appName: 'MoniBuddy',
    tagline: 'Simple Money Tracking That Works Without Data',

    cancel: 'Cancel',
    close: 'Close',
    save: 'Save',
    clear: 'Clear',
    remove: 'Remove',
    copy: 'Copy',
    copied: 'Copied',
    hide: 'Hide tips',
    show: 'Show tips',
    listen: 'Listen',
    stopAudio: 'Stop Audio',
    audioGuide: 'Listen',
    audioGuideActive: 'Speaking...',
    audioGuideTranscript: 'Spoken Guide',
    largeTextLabel: 'A+',
    largeTextTitle: 'Toggle large readable text',
    languageLabel: 'Language',
    lockAndSignOut: 'Lock Ledger & Sign Out',
    signedInAs: 'Signed in as',
    offlineBanner: 'Offline · Saving encrypted on this phone',
    localLedgerActive: 'Encrypted ledger active',
    offlineSavedOnPhone: 'Offline · Encrypted on phone',
    encryptedAesBadge: 'AES-256-GCM encrypted on device',
    savedAtPrefix: 'Saved at',
    moreMenu: 'More',
    myMoneySection: 'My Money',
    guidePrivacySection: 'Guide & Privacy',

    navOverview: 'Overview & Pots',
    navIncomeExpenses: 'Money In & Out',
    navBufferCredit: 'Emergency & Loan Shield',
    navScamGuard: 'Check Scams',
    nav2gSync: 'No-Data Simulator',
    navTechnicalBrief: 'How It Works',
    navPrivacyLegal: 'Privacy & Safety',
    navShortPots: 'Pots',
    navShortCash: 'Cash Log',
    navShortLoan: 'Loans',
    navShortScam: 'Scams',

    authHeroBadge: 'South African Personal Cash Ledger · Works Offline',
    authHeroBody:
      'Separate everyday spending cash from groceries, school fees, spaza stock, and your family emergency cushion — encrypted on your own phone without needing mobile data.',
    authFeature1Title: 'Encrypted Directly on Your Phone',
    authFeature1Body:
      'Your ledger is encrypted with AES-256-GCM using a key derived from your PIN (PBKDF2 100,000 iterations). Works with zero airtime.',
    authFeature2Title: 'Built-In Scam & Loan Cap Shield',
    authFeature2Body:
      'Check suspicious WhatsApp loan fees, fake SASSA messages, and National Credit Act short-term loan caps offline before paying.',
    authFeature3Title: 'No Bank Passwords or ID Uploads',
    authFeature3Body:
      'Each account on a shared family phone is strictly isolated and locked with a 5-attempt brute-force lockout.',
    authSignInTab: 'Sign In',
    authRegisterTab: 'Create Account',
    authSignInTitle: 'Unlock Your Encrypted Ledger',
    authSignInSubtitle: 'Enter your mobile number and security PIN to decrypt your ledger in memory.',
    authRegisterTitle: 'Create Your Local Account',
    authRegisterSubtitle: 'Set up your private encrypted offline ledger in seconds. No mobile data needed.',
    authNoAccountYet: 'No account has been created on this device yet.',
    authCreateOneLink: 'Create one →',
    authMobileOrEmailLabel: 'Mobile Number or Email',
    authMobileLabel: 'Mobile Number (South Africa)',
    authPinLabel: 'Security PIN',
    authShowPin: 'Show PIN',
    authHidePin: 'Hide PIN',
    authPinPlaceholder: '4 to 8 digits',
    authRememberPhone: 'Remember my phone number on this device',
    authUnlockButton: 'Unlock Encrypted Ledger',
    authUnlockingButton: 'Decrypting Ledger...',
    authFullNameLabel: 'Full Name',
    authFullNamePlaceholder: 'Your name',
    authCreatePinLabel: 'Create PIN (4–8 digits)',
    authConfirmPinLabel: 'Confirm PIN',
    authEmailOptionalLabel: 'Email Address (Optional)',
    authEmailOptionalPlaceholder: 'Optional recovery reference',
    authCreateAccountButton: 'Create Account & Encrypt Ledger',
    authCreatingButton: 'Securing Account...',
    authFooterGuarantee: 'AES-256-GCM encrypted on device · PBKDF2-SHA256 PIN · POPIA compliant',
    authFooterLeft: 'MoniBuddy Personal Cash & Savings Ledger',
    authFooterRight: 'Works 100% offline · Zero external network calls',
    authAudioSignIn:
      'Welcome back to MoniBuddy. Enter your mobile number and security PIN to decrypt and unlock your offline money ledger.',
    authAudioRegister:
      'Welcome to MoniBuddy. Enter your name, South African mobile number, and a 4 to 8 digit PIN to create an AES-256 encrypted money ledger on this phone. No internet bundle or bank login is required.',
    authErrMissingCredentials: 'Please enter your mobile number and security PIN.',
    authErrIncorrectCredentials: 'Incorrect mobile number or security PIN.',
    authErrPinLockedPrefix: 'Too many failed PIN attempts. Try again in',
    authErrPinLockedSuffix: 'seconds.',
    authErrAttemptsLeftPrefix: 'Attempts remaining before 60s lock:',
    authErrPinMismatch: 'The two security PINs do not match.',
    authErrMissingName: 'Please enter your full name.',
    authErrInvalidPhone: 'Please enter a valid South African mobile number.',
    authErrInvalidPinFormat: 'Security PIN must be 4 to 8 digits.',
    authErrAccountExists: 'An account with this mobile number already exists on this device. Please sign in.',
    authGoogleButton: 'Continue with Google & Backup',
    googleBackupActive: 'Google Cloud Backup Active',
    googleBackupSync: 'Sync Backup to Google',
    googleLoginSuccess: 'Signed in with Google successfully. Data backed up.',
    googleLoginError: 'Google sign-in cancelled or invalid email. Please try again.',
    googleEmailPrompt: 'Enter your Google email address for sign-in & cloud backup:',
    googleDetailsModalTitle: 'Google Sign-In & Offline Details',
    googleDetailsModalSubtitle: 'Enter your Google email and personal details so you can log in securely offline without network or data.',
    googleDetailsEmailLabel: 'Google Email Address',
    googleDetailsNameLabel: 'Full Name',
    googleDetailsPhoneLabel: 'Mobile Phone (for offline login)',
    googleDetailsPinLabel: 'Offline PIN (4–6 digits)',
    googleDetailsConfirmPinLabel: 'Confirm Offline PIN',
    googleDetailsSubmit: 'Save & Start Offline Ledger',

    safeToSpend: 'SAFE TO SPEND TODAY',
    safeToSpendDesc:
      'This is the cash you can spend freely today. Your grocery pots, school money, and emergency fund are already ring-fenced.',
    overspentWarningTitle: 'Overspent — Protected Pots or Cash Exceeded',
    overspentWarningDesc:
      'Your expenses and pot allocations exceed your recorded cash in. Log missing income, reduce spending, or withdraw from a pot to rebalance.',
    startingBalance: 'Your starting cash (R)',
    setStartingCash: 'Set Starting Cash',
    updateStartingCash: 'Update Starting Cash',
    startingCashFirstTimePrompt:
      'Start your ledger: How much total cash or bank balance do you have right now?',
    startingCashEditPrompt: 'Enter your current total cash or bank balance:',
    saveStartingBalance: 'Save Balance',
    startingTotal: 'STARTING CASH',
    income: 'MONEY IN',
    expenses: 'MONEY OUT',
    goalSavings: 'SAVINGS POTS',
    emergencyBuffer: 'EMERGENCY FUND',
    forecastReadyPrefix: 'Month-end projection: At your current daily spending pace, you are projected to finish the month at',
    forecastReadySuffix: 'safe cash.',
    forecastPendingTitle: 'Month-end forecast:',
    forecastPendingBody: 'Record daily expenses across at least 5 days to unlock an automatic month-end projection.',
    zeroInterestSelfFunded: 'Zero interest · Self-funded',
    bufferCoversPrefix: 'Covers approximately',
    bufferCoversWeeksUnit: 'weeks',
    bufferCoversSuffix: 'of essential household living costs.',
    bufferEmptyPrompt: 'Set aside R50 or R100 whenever you can to avoid high-interest informal loans.',
    activePotsSuffix: 'active',
    potsSummaryDesc: 'Ring-fenced cash for groceries, school fees, spaza stock, and family commitments.',
    microSavingsPots: 'My Savings Pots',
    potsSubtitle: 'Keep money set aside for food, spaza stock, school uniforms, or family events',
    newGoalPot: '+ New Pot',
    createFirstPot: 'Create Your First Savings Pot',
    noPotsYetTitle: 'No savings pots yet',
    emptyPotsMsg: 'You have not added any savings pots yet. Even setting aside R10 for food helps protect your household.',
    goalLabel: 'Goal:',
    savedPercentSuffix: '% saved',
    goalReachedLabel: 'Goal reached',
    deposit: '+ Add Money',
    withdraw: 'Take Out',
    howItWorks: 'How MoniBuddy Helps You',
    howStep1Title: '01. Savings Pots',
    howStep1Body: 'Ring-fence cash for groceries, spaza stock, and school needs separate from daily spending.',
    howStep2Title: '02. Emergency Cushion',
    howStep2Body: 'Build a self-funded buffer so emergencies never force you into illegal high-interest loans.',
    howStep3Title: '03. Scam Checker',
    howStep3Body: 'Check suspicious loan fees, WhatsApp offers, and agent cash-out charges offline on your phone.',
    howStep4Title: '04. No-Data Access',
    howStep4Body: 'Works completely offline as an installed app, plus an interactive USSD menu prototype.',
    addToBuffer: '+ Add to Emergency Fund',
    insufficientSafeCashError: 'Amount exceeds your available Safe-to-Spend cash. Record cash in or enter a smaller amount.',
    insufficientBufferError: 'Amount exceeds your current Emergency Fund balance.',
    insufficientPotError: 'Amount exceeds the cash currently saved in this pot.',

    cashLogTitle: 'Money In & Money Out',
    cashLogSubtitle: 'Record daily cash income and spending on your phone with zero mobile data',
    totalMoneyIn: 'Total Money In',
    totalMoneyInSub: 'Wages, piece jobs, sales, and grants',
    totalMoneyOut: 'Total Money Out',
    totalMoneyOutSub: 'Food, taxi fare, electricity, and stock',
    last7DaysTitle: 'Last 7 Days',
    last7DaysSub: 'Daily recorded cash flow',
    sevenDayWindow: '7-day window',
    peakDayPrefix: 'Peak day:',
    manualEntryTitle: 'Manual Entry',
    manualEntrySub: 'Type exact details and date',
    moneyOutBtn: '- Money Out',
    moneyInBtn: '+ Money In',
    commonCategoriesLabel: 'Common categories:',
    descriptionLabel: 'Description',
    descriptionPlaceholder: 'What was this cash for?',
    amountRandLabel: 'Amount (R)',
    dateLabel: 'Date',
    saveEntryBtn: 'Save Entry',
    recordedTransactionsTitle: 'Recorded Transactions',
    recordedTransactionsSub: 'Encrypted privately on this device',
    recordsCountSuffix: 'records',
    noTransactionsTitle: 'No transactions recorded yet',
    noTransactionsBody: 'Use Voice, the Touch Pad, or Manual Entry above to record your first income or expense.',
    presetGroceries: 'Groceries & Bread',
    presetTaxi: 'Taxi Fare',
    presetElectricity: 'Electricity Token',
    presetSpaza: 'Spaza Stock',
    presetAirtime: 'Airtime / Data',
    presetWages: 'Wages / Salary',
    presetHustle: 'Piece Job / Selling',
    presetGrant: 'SASSA Grant',

    voiceNavBtn: 'Voice Log',
    voiceModalTitle: 'Voice & Touch Capture',
    voiceModalSub: 'Log cash in or out using speech, South African slang, or the offline Touch Pad',
    quickVoiceTouchTitle: 'Quick Voice & Touch Entry',
    voiceTabLabel: 'Voice',
    touchPadTabLabel: 'Touch Pad',
    speakTransactionBtn: 'Speak Transaction',
    doneSpeakingBtn: 'Done Speaking',
    stopListeningBtn: 'Stop Listening',
    transcribingOfflineMsg: 'Transcribing offline on your phone...',
    offlineVoicePackBtn: 'Offline Voice Pack',
    downloadingProgressPrefix: 'Downloading',
    slangGuideShow: 'Slang guide',
    slangGuideHide: 'Hide slang guide',
    slangGuideHeading: 'Supported South African Slang Terms',
    listeningOfflineHint: 'Listening offline — tap Done Speaking when finished',
    onDeviceAudioBadge: 'On-device audio',
    spokenPhraseLabel: 'Spoken phrase or typed quick note',
    spokenPhrasePlaceholder: 'Speak above or type a phrase (e.g. "taxi to town R32" or "two choco for bread")',
    voiceNetworkLimitationNote:
      'Browser voice recognition uses network data unless on-device speech or the 35 MB Offline Voice Pack is saved. You can always type above or use the Touch Pad with zero data.',
    noAmountParsedError:
      'No Rand amount was found. Mention an amount (such as "taxi to town R32" or "two choco for taxi") or use the Touch Pad.',
    openTouchPadBtn: 'Open Touch Pad',
    entriesReadyTitle: 'Entries Ready to Save',
    recognizedSlangPrefix: 'Slang:',
    emptyPreviewTouchHint:
      'Select a category icon and tap slang notes (+1 Choco, +1 Clipa) or digits on the keypad.',
    emptyPreviewVoiceHint:
      'Tap Speak Transaction, type a quick note on the left, or switch to the Touch Pad.',
    editInFormBtn: 'Edit in form',
    saveEntriesBtnPrefix: 'Save',
    saveEntriesBtnSuffix: 'to Ledger',
    savedEntriesNoticePrefix: 'Saved to your encrypted ledger:',
    modeTouchActive: 'Touch keypad active (0 MB data)',
    modeCloudSpeech: 'Browser speech ready (uses network)',
    modeOnDeviceSpeech: 'On-device browser speech ready',
    modeOfflineSpeechReady: 'Offline WASM speech ready (0 MB data)',
    modeOfflinePackAvailable: 'Offline voice pack optional (35 MB)',
    packSavedStatus: 'Offline pack saved',
    packSavingPrefix: 'Saving pack',
    packWaitingWifi: 'Queued for Wi-Fi',
    packDataProtected: 'Prepaid data protected',
    touchStep1Category: '1. Tap category icon',
    touchStep2Slang: '2. Tap township slang or Rand notes',
    touchZeroTyping: 'Zero typing · Zero data',
    touchTapAboveBtn: 'Tap Slang or Digits Above',
    touchAddItemPrefix: 'Add',
    voicePackModalTitle: 'Offline Voice Pack Needed',
    voicePackModalSub: 'Protects your prepaid mobile data',
    voicePackModalBody:
      'To transcribe speech without internet, a 35 MB offline Whisper voice pack is required. Once saved on Wi-Fi, offline speech works with zero data.',
    voicePackCellularWarn:
      'You are on mobile data. MoniBuddy blocked automatic download so your prepaid airtime is never spent without your consent.',
    voicePackOfflineWarn:
      'You are currently offline. Queue the pack for Wi-Fi or use the Manual Touch Pad right now.',
    voicePackDownloadNow: 'Download Now (35 MB)',
    voicePackDownloadWifi: 'Download Later on Wi-Fi',
    voicePackUseTouchPad: 'Use Manual Touch Pad',
    voicePackCancelDownload: 'Cancel Download',
    voicePackUseTouchMeanwhile: 'Use Touch Pad Meanwhile',

    loanShieldBadge: 'Self-Funded Cushion · NCA Credit Cap Checker',
    loanShieldTitle: 'Emergency Fund & Loan Quote Shield',
    loanShieldSubtitle:
      'Build your own emergency cushion and test any loan quote against South African National Credit Act (NCA) legal caps.',
    yourEmergencySavings: 'Your Emergency Savings',
    depositR100Btn: '+ Save R100',
    depositR250Btn: '+ Save R250',
    manageFundBtn: 'Manage Fund',
    burnRateTitle: 'Essential Weekly Household Need',
    burnRateSub: 'Minimum weekly cost for food, transport, and prepaid electricity',
    perWeekSuffix: '/ week',
    twoWeekTargetTitle: '2-Week Target Cushion',
    twoWeekTargetBodyPrefix: 'Keep',
    twoWeekTargetBodySuffix: 'saved to cover two weeks if casual work or trading slows down.',
    oneMonthTargetTitle: '1-Month Target Cushion',
    oneMonthTargetBodyPrefix: 'Keep',
    oneMonthTargetBodySuffix: 'saved for a full month of household essentials without borrowing.',
    loanQuoteTitle: 'Check Any Loan Quote Against SA Legal Caps',
    loanQuoteSubtitle:
      'Enter the cash amount, fees, and repayment demanded by a lender or mashonisa to see the real APR and whether it exceeds NCA Regulation 42 short-term credit caps.',
    loanPrincipalLabel: 'Cash Borrowed (R)',
    loanInputModeRepayment: 'Enter Total Repayment (R)',
    loanInputModeMonthlyRate: 'Enter Monthly Interest (%)',
    loanQuotedRepaymentLabel: 'Total Repayment Demanded (R)',
    loanMonthlyRateLabel: 'Quoted Monthly Interest (%)',
    loanExtraFeesLabel: 'Admin / Initiation / Collection Fees (R)',
    loanTermDaysLabel: 'Loan Term (Days)',
    loanFirstLoanToggle: 'First short-term loan this year (5%/mo cap vs 3%/mo repeat cap)',
    loanQuoteCardTitle: 'Lender Quote Breakdown',
    loanNcaCapCardTitle: 'NCA Legal Maximum (Reg 42)',
    loanSelfBufferCardTitle: 'Your Emergency Cushion',
    loanTotalRepayLabel: 'Total Repaid',
    loanTotalCostLabel: 'Interest & Fees Cost',
    loanEffectiveAprLabel: 'Annualised Cost (APR)',
    loanStatusExceedsCap: 'Above the NCA short-term cap in this calculator. Check with the National Credit Regulator before you sign.',
    loanStatusWithinCap: 'Within NCA Short-Term Cap — Still Check Affordability',
    loanOverchargeVsNcaLabel: 'Above NCA legal cap by',
    loanSavedWithBufferLabel: 'Saved by using own buffer',
    loanNcaCitation:
      'Source: National Credit Act 34 of 2005, Regulation 42 Short-Term Credit Caps (GN R1080, Nov 2015 — max 5%/mo interest first loan or 3%/mo repeat, max R165 + 10% initiation capped at 15% of principal, max R60/mo service fee).',
    loanSaferAlternativesTitle: 'Safer Alternatives Before Borrowing',
    loanAlt1: 'Use your registered community stokvel emergency pool or family grocery pot first.',
    loanAlt2: 'Verify any credit provider with the National Credit Regulator (NCR: 0860 627 627) and never hand over your SASSA card, ID book, or PIN.',
    loanAlt3: 'Request a municipal, clinic, or school fee payment arrangement — formal institutions offer interest-free payment plans.',
    loanEducationalDisclaimer:
      'Educational Tool Only: Calculations are estimates based on NCA short-term credit caps for financial literacy and do not constitute formal financial or legal advice.',
    loanProtectionBannerTitle:
      'NCA Borrower Protection — Never Hand Over Your SASSA Card, ID, or PIN',
    loanProtectionBannerBody:
      'Under Sections 90 & 133 of the National Credit Act, it is a criminal offence for any mashonisa or lender to keep your bank card, SASSA card, ID book, or PIN as security, or demand upfront release fees.',
    loanPredatoryWarningBannerTitle:
      'Predatory Quote Warning — Exceeds South African NCA Legal Cap',
    loanPredatoryWarningBannerBodyPrefix: 'Stop before signing: This lender quote charges',
    loanPredatoryWarningBannerBodySuffix:
      'above the Regulation 42 statutory short-term ceiling. Do not pay upfront fees — report unlawful credit terms to the NCR on 0860 627 627.',
    loanLegalCautionBannerTitle:
      'Cost Caution — Within Legal NCA Cap, But Still Carries Interest & Fees',
    loanLegalCautionBannerBodyPrefix: 'Even within legal short-term caps, this loan costs',
    loanLegalCautionBannerBodySuffix:
      'extra in interest and fees versus R 0.00 using your own Emergency Savings.',

    scamGuardTitle: 'Scam & Fake Message Checker',
    scamGuardSub:
      'Check suspicious SMSs, WhatsApp loan offers, SASSA notices, job fees, and cash-out charges privately on your phone',
    scamRuleBasedDisclaimerTitle: 'On-Device Rule-Based Checker — Always Verify Independently',
    scamRuleBasedDisclaimerBody:
      'This tool checks known South African scam patterns offline on your phone. A low score does NOT guarantee a message or person is safe — new scams appear daily. Never share your PIN/OTP or pay upfront fees.',
    scamHighRiskBannerTitle:
      'High-Risk Scam Alert — Stop and Do Not Send Money or Vouchers',
    scamHighRiskBannerBody:
      'Multiple fraud indicators matched this request. Never pay upfront loan or job fees, never read out your PIN or OTP, and verify directly on an official number before acting.',
    scamCautionBannerTitle: 'Caution Warning — Suspicious Risk Signals Detected',
    scamCautionBannerBody:
      'Slow down and verify independently: Scammers use urgency and unverified numbers to rush cash transfers. Confirm by phone call before paying.',
    scamPasteLabel: 'Paste SMS, WhatsApp Message, or Payment Request',
    scamClearChecker: 'Clear checker',
    scamPlaceholder:
      'Paste the message here to check for advance-fee loan traps, job uniform fees, PIN/OTP phishing, fake SASSA links, or illegal cash-out charges...',
    scamPaymentDetailsTitle: 'Payment & Recipient Details (Optional)',
    scamAddDetails: 'Add payment details',
    scamHideDetails: 'Hide details',
    scamRecipientNameLabel: 'Recipient Name or Till',
    scamRecipientIdLabel: 'Recipient Phone or ID',
    scamAmountRequestedLabel: 'Amount Requested (R)',
    scamPaymentTypeLabel: 'Payment Type',
    scamOpLoanFee: 'Upfront Loan / Release Fee',
    scamOpCashOut: 'Cash-Out / eWallet / Voucher',
    scamOpP2P: 'Person-to-Person Transfer',
    scamOpMerchant: 'Normal Goods or Services',
    scamAgentFeeLabelPrefix: 'Agent Fee Demanded',
    scamUnregisteredLenderCheck: 'Unregistered lender (Non-NCR)',
    scamNewRecipientCheck: 'First-time / unknown recipient',
    scamReadyTitle: 'Ready to Check Your Message Offline',
    scamReadyBody:
      'Paste any SMS or WhatsApp message above. Your message stays 100% private on this phone and is never uploaded.',
    scamVerifyBtn: 'Verify Payment Safety',
    scamFraudReportBtn: 'Fraud Report',
    scamHideReportBtn: 'Hide Report',
    scamWarningSignsHeading: 'Warning Signs Detected',
    scamNoKnownPatternAdvice: 'No known pattern matched — still verify by phone before paying',
    scamBlockAdvice: 'Do NOT send money — Block payment',
    scamHelplinesTitle: 'Official South African Fraud & Credit Helplines',
    scamHelplinesSub:
      'Verified numbers to report banking fraud, illegal card retention, or extortion',
    scamModalHighRiskBadge: 'HIGH-RISK SCAM WARNING',
    scamModalListenHeading: 'Listen to Voice Warning Before Acting:',
    scamModalPlayBtn: 'Play Spoken Warning',
    scamModalStopBtn: 'Stop Spoken Warning',
    scamModalMandatoryChecks: 'Mandatory Safety Steps:',
    scamModalAckCheckbox:
      'I have verified this request directly via an official phone number and understand cash or vouchers cannot be reversed.',
    scamModalCancelBlockBtn: 'Cancel & Block Payment (Recommended)',
    scamModalProceedBtn: 'I Verified Directly — Proceed',

    syncBadge: 'Offline PWA Storage · Interactive USSD Prototype',
    syncTitle: 'No-Data Mode & USSD Simulator',
    syncSub:
      'Your ledger works offline right now on this phone. Explore the interactive *120*6664# USSD simulator showing how basic button phones connect.',
    ussdSimNoticeTitle: 'Interactive USSD Simulator (Prototype)',
    ussdSimNoticeBody:
      'The *120*6664# keypad on this screen is an in-app offline simulation connected to your local ledger — not a live carrier shortcode on cellular networks yet.',
    savedTransactionsLabel: 'Encrypted Transactions',
    activeSavingsPotsLabel: 'Active Savings Pots',
    verifyLocalLedgerBtn: 'Re-Verify & Save Encrypted Ledger',
    verifyingLocalLedgerBtn: 'Encrypting & verifying on phone...',
    offlineAirplaneGuarantee:
      'Your balances, pots, and transaction history work in Airplane Mode with zero airtime or external servers.',
    installHomeScreenHint:
      'Install MoniBuddy to your home screen so the entire app opens offline anytime.',
    ussdShortcodeCardTitle: 'Feature-Phone USSD Channel Concept (*120*6664#)',
    ussdShortcodeCardBody:
      'Test the interactive keypad to see how informal traders on non-smartphones check Safe-to-Spend balances, save R50 to Emergency Fund, or log R20 taxi fare.',
    launchSimulatorBtn: 'Launch USSD Simulator',
    copyShortcodeBtn: 'Copy *120*6664#',
    copiedShortcodeBtn: 'Copied code',
    ussdSimulatorTag: 'SIMULATOR · OFFLINE DEMO',
    ussdOpenMenuBtn: 'Start *120*6664# Simulator',
    ussdCloseMenuBtn: 'End Session',
    ussdSendBtn: 'Send',

    techBadge: 'Architecture, Sustainability & Safety Principles',
    technicalBriefTitle: 'How MoniBuddy Works & Scales',
    techSubtitle:
      'Engineered for South African informal earners: zero user fees, zero data drain, real AES-256 encryption, and sustainable B2B2C partnerships.',
    techCap1Title: 'AES-256-GCM Encrypted Offline Storage',
    techCap1Body:
      'Ledgers are encrypted locally using WebCrypto AES-256-GCM and PBKDF2-SHA256 (100,000 iterations) with self-hosted fonts and Service Worker caching.',
    techCap2Title: 'Prepaid Airtime Protection',
    techCap2Body:
      'Zero external requests on load. Optional 35 MB offline speech models never auto-download on cellular data — keeping daily data bundles safe.',
    techCap3Title: 'USSD & Low-Spec Accessibility',
    techCap3Body:
      'High-contrast Large Text mode, spoken audio guides, 5 South African languages, and a zero-typing slang Touch Pad built for entry-level Android phones.',
    techCap4Title: 'On-Device Scam & NCA Shield',
    techCap4Body:
      'Compound word-boundary fraud detection and National Credit Act Regulation 42 credit cap checks execute 100% locally in < 5ms.',
    sustainabilityTitle: 'Sustainability & Zero-User-Fee Revenue Path',
    sustainabilitySubtitle:
      'How MoniBuddy stays 100% free for informal earners while scaling sustainably across South Africa',
    sustModel1Title: '1. Sponsored Zero-Rated Bank & Telco Licensing (B2B2C)',
    sustModel1Body:
      'Retail banks, community micro-insurers, and mobile networks sponsor white-label financial wellness modules and zero-rated USSD/PWA hosting to onboard unbanked savers safely.',
    sustModel2Title: '2. Registered Stokvel & Cooperative Treasury Tier',
    sustModel2Body:
      'Individual budgeting is always free. Formalised stokvels, burial societies, and spaza cooperatives pay a small shared R49/month club fee for multi-signatory audit exports.',
    sustModel3Title: '3. Opt-In Voucher & Funeral Cover Marketplace Rebates',
    sustModel3Body:
      'Transparent, NCR/FSCA-regulated partner rebates when users voluntarily redeem goal pots at grocery retailers — zero predatory loan ads and zero personal data selling.',
    dignityTitle: 'Our Commitment to Financial Dignity',
    dignitySubtitle: 'Non-negotiable ethical guardrails protecting household cash',
    dignity1Title: 'Free Forever for Individuals',
    dignity1Body: 'Every pot, emergency buffer, voice/touch logger, and scam checker has zero subscription cost.',
    dignity2Title: 'Zero Data Brokerage',
    dignity2Body: 'We never sell spending records, display mashonisa ads, or share ledgers with credit bureaus.',
    dignity3Title: 'Built for Irregular Cash Flow',
    dignity3Body: 'Designed around piece jobs, spaza stock cycles, stokvels, and real South African township slang.',

    privacyBadge: 'POPIA Data Sovereignty · AES-256-GCM Local Encryption',
    privacyGuaranteeTitle: 'Your Privacy & Data Controls',
    privacySubtitle: 'Full ownership over your encrypted cash records, portable backups, and instant wipe.',
    privacyMainHeading: 'Your Records Stay Encrypted in Your Hands',
    privacyMainBody:
      'MoniBuddy never asks for bank passwords, ID uploads, or cloud logins. Each account on this device is isolated and encrypted at rest.',
    privacyPoint1Title: '01. PBKDF2-SHA256 + AES-256-GCM Encryption',
    privacyPoint1Body:
      'Your PIN is stretched with 100,000 PBKDF2-HMAC-SHA256 iterations and a unique random salt. Your ledger is encrypted with AES-256-GCM so raw balances never sit in plain text in storage.',
    privacyPoint2Title: '02. Zero Trackers, Ads, or Cloud Profiling',
    privacyPoint2Body:
      'Zero analytics scripts, external font CDNs, or third-party trackers are loaded. Nobody monitors your cash flow.',
    privacyPoint3Title: '03. Portable Backup & Instant Wipe',
    privacyPoint3Body:
      'Export a backup file before changing phones, restore a previous backup anytime, or permanently erase your records in one tap.',
    downloadBackupBtn: 'Download Backup (.json)',
    restoreBackupBtn: 'Restore Backup',
    eraseLedgerBtn: 'Erase Ledger Data',
    eraseConfirmTitle: 'Erase All Ledger Records?',
    eraseConfirmSub: 'This action cannot be undone',
    eraseConfirmBody:
      'This permanently removes your starting cash, savings pots, emergency fund, and transaction history for this account from this device.',
    eraseEverythingBtn: 'Erase Everything',
    backupDownloadedMsg: 'Backup file downloaded to your device. Keep this file private.',
    backupRestoredMsg: 'Your backup file has been restored and encrypted in your ledger.',
    backupInvalidMsg: 'Could not read backup file. Please choose a valid MoniBuddy .json backup.',
    ledgerErasedMsg: 'All financial records for this account have been erased from this device.',

    modalCreatePotTitle: 'Create a New Savings Pot',
    modalChooseIcon: 'Choose an Icon',
    modalSavingForLabel: 'What are you saving for?',
    modalSavingForPlaceholder: 'e.g. Groceries, Spaza stock, School shoes',
    modalTargetAmountLabel: 'Target Amount (R)',
    modalCategoryLabel: 'Category',
    modalCreatePotSubmit: 'Create Pot',
    modalPutMoneyIn: 'Put Money In',
    modalTakeMoneyOut: 'Take Money Out',
    modalCurrentlyInPot: 'Currently in this pot:',
    modalAvailableSafeCash: 'Available Safe-to-Spend:',
    modalSaveToPotBtn: 'Save to Pot',
    modalTakeOutCashBtn: 'Take Out Cash',
    modalBufferTitle: 'Emergency Fund',
    modalBufferSub: 'Your self-funded household cushion',
    modalUseBufferBtn: '- Use Emergency Money',
    modalCurrentBufferLabel: 'Current Emergency Fund:',
    modalReasonOptionalLabel: 'Reason (Optional)',
    modalReasonPlaceholder: 'e.g. Clinic visit, transport, rainy day',
    modalSaveToFundBtn: 'Save to Fund',
    modalWithdrawCashBtn: 'Withdraw Cash',
    pwaInstallOfflineApp: 'Install Offline App',
    pwaInstallOnIphone: 'Install on iPhone',
    pwaIosGuideTitle: 'Save MoniBuddy to Home Screen',
    pwaIosStep1: 'Tap the Share icon in your Safari toolbar.',
    pwaIosStep2: 'Tap Add to Home Screen to launch MoniBuddy anytime with zero data.',
    pwaGotIt: 'Got It',

    audioGuides: {
      overview: {
        title: 'Safe to Spend & Savings Pots',
        content:
          'Your Safe to Spend balance at the top shows cash you can use today after protecting your savings pots and emergency fund. If you spend more than your cash in, an overspend warning appears immediately.',
        keyAdvice: 'Tip: Setting aside even R20 a week into a grocery or school pot protects your household.'
      },
      income_expenses: {
        title: 'Money In and Out',
        content:
          'Log income and expenses using Voice, the zero-data Touch Pad, or Manual Entry. Deleting any pot or buffer transaction automatically reverses its balance.',
        keyAdvice: 'Tip: Use the Touch Pad whenever you are offline without the 35 megabyte voice pack.'
      },
      buffer_credit: {
        title: 'Emergency Fund & Loan Quote Shield',
        content:
          'Enter any loan quote to compare its cost against National Credit Act short-term caps and your own zero-interest emergency cushion.',
        keyAdvice: 'Tip: Registered lenders cannot charge more than 5 percent interest per month on a first short-term loan.'
      },
      scam_guard: {
        title: 'Scam & Fake Message Checker',
        content:
          'Paste any SMS or WhatsApp message to check known South African scam patterns offline. Remember that new scams appear daily, so always verify by phone.',
        keyAdvice: 'Tip: Never pay an upfront release, admin, or uniform fee via voucher.'
      },
      sync_2g: {
        title: 'No-Data Mode & USSD Simulator',
        content:
          'MoniBuddy saves your encrypted ledger directly on your phone. Try the interactive star 120 star 6664 hash USSD simulator to test basic-phone balance menus.',
        keyAdvice: 'Tip: Install MoniBuddy to your home screen for instant offline access.'
      },
      technical_brief: {
        title: 'How MoniBuddy Works & Sustains',
        content:
          'MoniBuddy combines AES-256 local encryption, prepaid airtime protection, and a zero-user-fee B2B2C sustainability model.',
        keyAdvice: 'Tip: Personal budgeting and scam protection remain 100 percent free for individuals.'
      },
      privacy_legal: {
        title: 'Your Privacy & Encrypted Backups',
        content:
          'Your PIN is protected with PBKDF2 and your ledger is encrypted with AES-256-GCM on this device. Export a backup before changing phones.',
        keyAdvice: 'Tip: Keep exported backup files safe, as they contain your personal cash history.'
      }
    },
    authErrLedgerDecryptFailed: 'Failed to decrypt secure ledger. Incorrect PIN or corrupted data.',
    warningUnencryptedLedger: 'Your data is NOT encrypted on this device because WebCrypto is unavailable.',
    authPinLengthHint: 'Recommended: 6 or more digits',
    welcomeModalTitle: 'Welcome to MoniBuddy',
    welcomeModalStep1Title: '1. Safe-to-Spend Balance',
    welcomeModalStep1Body: 'Your Safe-to-Spend amount shows cash you can use today after protecting your savings pots and emergency buffer.',
    welcomeModalStep2Title: '2. Log Income & Expenses',
    welcomeModalStep2Body: 'Record cash easily using offline voice recognition, the zero-data Touch Pad, or manual entry.',
    welcomeModalStep3Title: '3. Emergency Buffer & Scam Guard',
    welcomeModalStep3Body: 'Build your household safety cushion and check suspicious SMS or WhatsApp messages offline.',
    welcomeModalSkip: 'Skip',
    welcomeModalNext: 'Next',
    welcomeModalFinish: 'Get Started',
    scamGuardDisclaimer: 'Note: Rule-based scam detection is heuristic and local. A SAFE result does not guarantee a message or person is safe — new scams appear daily. Always verify by phone before paying.',
    loanAnnualisedCost: 'Annualised cost (simple)',
    loanPrincipalMinError: 'Principal amount must be at least R100.',
    loanTermMinError: 'Term must be between 1 and 180 days.',
    ussdDemoNotice: 'Demo USSD transaction simulated for offline testing.',
    ussdDemoBadge: 'USSD Demo',
    sourceLabel: 'Source',
    lastVerifiedLabel: 'Last Verified',
    unverifiedBadge: 'Unverified, check with NCR',
    voiceOfflineNote: 'Voice recognition requires a network connection or downloaded voice pack. Typing and touch pad always work offline.'
  },

  zu: {
    appName: 'MoniBuddy',
    tagline: 'Ukuphatha Imali Okulula Ngaphandle Kwedatha',

    cancel: 'Khansela',
    close: 'Vala',
    save: 'Gcina',
    clear: 'Sula',
    remove: 'Susa',
    copy: 'Kopisha',
    copied: 'Kukopishiwe',
    hide: 'Fihla amathiphu',
    show: 'Veza amathiphu',
    listen: 'Lalela',
    stopAudio: 'Misa Umsindo',
    audioGuide: 'Lalela',
    audioGuideActive: 'Iyakhuluma...',
    audioGuideTranscript: 'Umhlahlandlela Wezwi',
    largeTextLabel: 'A+',
    largeTextTitle: 'Khulisa usayizi wamagama',
    languageLabel: 'Ulimi',
    lockAndSignOut: 'Khiya & Phuma',
    signedInAs: 'Ungene njengo',
    offlineBanner: 'Ngaphandle kwe-inthanethi · Kubethelwe ocingweni',
    localLedgerActive: 'Ibhuku elibethelwe liyasebenza',
    offlineSavedOnPhone: 'Ngaphandle kwedatha · Igcinwe ocingweni',
    encryptedAesBadge: 'Ibethelwe nge-AES-256-GCM ocingweni',
    savedAtPrefix: 'Igcinwe ngo',
    moreMenu: 'Okuningi',
    myMoneySection: 'Imali Yami',
    guidePrivacySection: 'Umhlahlandlela & Ubumfihlo',

    navOverview: 'Ukubuka & Izimbiza',
    navIncomeExpenses: 'Imali Engenayo & Ephumayo',
    navBufferCredit: 'Isikhwama & Izikweletu',
    navScamGuard: 'Hlola Izinkohliso',
    nav2gSync: 'Isilingisi se-USSD',
    navTechnicalBrief: 'Indlela Esebenza Ngayo',
    navPrivacyLegal: 'Ubumfihlo & Ukuvikeleka',
    navShortPots: 'Izimbiza',
    navShortCash: 'Imali',
    navShortLoan: 'Izikweletu',
    navShortScam: 'Umkhonyovu',

    authHeroBadge: 'Ibhuku Lemali LaseNingizimu Afrika · Lisebenza Ngaphandle Kwedatha',
    authHeroBody:
      'Hlukanisa imali yokusebenzisa nsuku zonke nemali yokudla, eyesikole, isitoko se-spaza nesikhwama esiphuthumayo — kubethelwe ocingweni lwakho ngaphandle kwedatha.',
    authFeature1Title: 'Kubethelwe Ngqo Ocingweni Lwakho',
    authFeature1Body:
      'Imininingwane yakho ibethelwa nge-AES-256-GCM ne-PIN yakho (PBKDF2 100,000). Isebenza ngisho ungenayo i-airtime.',
    authFeature2Title: 'Isivikeli Semikhonyovu & Omashonisa',
    authFeature2Body:
      'Hlola imilayezo esolisayo ye-WhatsApp, izimali zokuvula isikweletu nemithetho ye-NCA ngaphandle kwedatha.',
    authFeature3Title: 'Azikho Izinombolo Zebhange noma ID',
    authFeature3Body:
      'I-akhawunti ngayinye ocingweni lomndeni ihlukanisiwe futhi ivikelwe ukukhiywa imizuzwana engu-60 emva kwemizamo engu-5.',
    authSignInTab: 'Ngena',
    authRegisterTab: 'Vula I-akhawunti',
    authSignInTitle: 'Vula Ibhuku Lakho Elibethelwe',
    authSignInSubtitle: 'Faka inombolo yakho yocingo ne-PIN ukuze uvule ibhuku lakho.',
    authRegisterTitle: 'Yakha I-akhawunti Yakho Ocingweni',
    authRegisterSubtitle: 'Zenzele ibhuku lemali eliyimfihlo ngemizuzwana. Ayikho idatha edingekayo.',
    authNoAccountYet: 'Ayikho i-akhawunti eseyenziwe kulolu cingo.',
    authCreateOneLink: 'Yakha manje →',
    authMobileOrEmailLabel: 'Inombolo Yocingo noma i-Email',
    authMobileLabel: 'Inombolo Yocingo (SA)',
    authPinLabel: 'I-PIN Yokuphepha',
    authShowPin: 'Veza i-PIN',
    authHidePin: 'Fihla i-PIN',
    authPinPlaceholder: 'Izinombolo ezingu-4 kuya ku-8',
    authRememberPhone: 'Khumbula inombolo yami kulolu cingo',
    authUnlockButton: 'Vula Ibhuku Lemali',
    authUnlockingButton: 'Iyavula...',
    authFullNameLabel: 'Igamaeligcwele',
    authFullNamePlaceholder: 'Igama lakho',
    authCreatePinLabel: 'Khetha i-PIN (4–8)',
    authConfirmPinLabel: 'Qinisekisa i-PIN',
    authEmailOptionalLabel: 'I-Email (Uma uthanda)',
    authEmailOptionalPlaceholder: 'Okokukhumbula nje',
    authCreateAccountButton: 'Yakha I-akhawunti & Bethela',
    authCreatingButton: 'Iyagcina...',
    authFooterGuarantee: 'Ibethelwe nge-AES-256-GCM · PBKDF2-SHA256 PIN · Iyahambisana ne-POPIA',
    authFooterLeft: 'MoniBuddy Ibhuku Lemali Nokonga',
    authFooterRight: 'Isebenza ngaphandle kwedatha 100%',
    authAudioSignIn:
      'Siyakwamukela futhi ku-MoniBuddy. Faka inombolo yakho yocingo ne-PIN ukuvula ibhuku lakho lemali.',
    authAudioRegister:
      'Siyakwamukela ku-MoniBuddy. Faka igama lakho, inombolo yocingo ne-PIN ukwakha ibhuku lemali elibethelwe ocingweni lwakho ngaphandle kwedatha.',
    authErrMissingCredentials: 'Sicela ufake inombolo yocingo ne-PIN.',
    authErrIncorrectCredentials: 'Inombolo yocingo noma i-PIN ayilungile.',
    authErrPinLockedPrefix: 'Imizamo eminingi engaphumelelanga. Zama futhi emva kwemizuzwana engu-',
    authErrPinLockedSuffix: '.',
    authErrAttemptsLeftPrefix: 'Imizamo esele ngaphambi kokukhiywa:',
    authErrPinMismatch: 'Ama-PIN amabili awafani.',
    authErrMissingName: 'Sicela ufake igama lakho eligcwele.',
    authErrInvalidPhone: 'Sicela ufake inombolo yocingo yaseNingizimu Afrika evumelekile.',
    authErrInvalidPinFormat: 'I-PIN kufanele ibe yizinombolo ezingu-4 kuya ku-8.',
    authErrAccountExists: 'Le nombolo yocingo isivele ikhona kulolu cingo. Sicela ungene.',
    authGoogleButton: 'Qhubeka no-Google nokulondoloza',
    googleBackupActive: 'Isipele Samafu sika-Google Sisebenza',
    googleBackupSync: 'Vumelanisa Isipele ku-Google',
    googleLoginSuccess: 'Ungene ngendlela no-Google. Idatha ilondoloziwe.',
    googleLoginError: 'Ukungena kuka-Google kukhanseliwe noma i-email ayilungile.',
    googleEmailPrompt: 'Faka ikheli lakho le-email lika-Google ukuze ungene futhi ulondoloze idatha:',
    googleDetailsModalTitle: 'Ukungena kuka-Google Nemininingwane Engaxhunyiwe',
    googleDetailsModalSubtitle: 'Faka i-email yakho ka-Google nemininingwane ukuze ukwazi ukungena ungaxhunyiwe ku-inthanethi.',
    googleDetailsEmailLabel: 'Ikheli le-email lika-Google',
    googleDetailsNameLabel: 'Igama Eliphelele',
    googleDetailsPhoneLabel: 'Ucingo Lweselula (lokungena ungaxhunyiwe)',
    googleDetailsPinLabel: 'I-PIN Engaxhunyiwe (amamaki angu-4-6)',
    googleDetailsConfirmPinLabel: 'Qinisekisa i-PIN Engaxhunyiwe',
    googleDetailsSubmit: 'Londoloza Futhi Uqale I-Ledger Engaxhunyiwe',

    safeToSpend: 'IMALI OKUPHEPHE UKUYISEBENZISA NAMUHLA',
    safeToSpendDesc:
      'Lena imali ongayisebenzisa namuhla ngaphandle kokuthinta izimbiza zokudla, eyesikole nesikhwama esiphuthumayo.',
    overspentWarningTitle: 'Usebenzise Ngaphezulu Kwemali Ekhona',
    overspentWarningDesc:
      'Izindleko zakho nezimbiza kweqa imali engenile. Bhala imali engenile esele, nciphisa izindleko, noma khipha embizeni.',
    startingBalance: 'Imali oqala ngayo (R)',
    setStartingCash: 'Faka Imali Yokuqala',
    updateStartingCash: 'Shintsha Imali Yokuqala',
    startingCashFirstTimePrompt: 'Qala ibhuku lakho: Unemali engakanani esandleni noma ebhange manje?',
    startingCashEditPrompt: 'Faka imali onayo esandleni noma ebhange manje:',
    saveStartingBalance: 'Gcina Imali',
    startingTotal: 'IMALI YOKUQALA',
    income: 'IMALI ENGENAYO',
    expenses: 'IMALI EPHUMAYO',
    goalSavings: 'IZIMBIZA ZOKONGA',
    emergencyBuffer: 'ISIKHWAMA ESIPHUTHUMAYO',
    forecastReadyPrefix: 'Isibikezelo sokuphela kwenyanga: Ngesivinini ohlenga ngaso, uzogcina u-',
    forecastReadySuffix: 'ekupheleni kwenyanga.',
    forecastPendingTitle: 'Isibikezelo senyanga:',
    forecastPendingBody: 'Bhala izindleko zansuku zonke izinsuku okungenani ezingu-5 ukuze ubone isibikezelo.',
    zeroInterestSelfFunded: 'Ayikho inzalo · Eyokuzibekela',
    bufferCoversPrefix: 'Imboza cishe:',
    bufferCoversWeeksUnit: 'amasonto',
    bufferCoversSuffix: 'ezindleko zasekhaya ezibalulekile.',
    bufferEmptyPrompt: 'Beka eceleni u-R50 noma u-R100 ukuze ugweme izikweletu zomashonisa.',
    activePotsSuffix: 'ziyasebenza',
    potsSummaryDesc: 'Imali ebekelwe ukudla, isikole, isitoko se-spaza nezidingo zomndeni.',
    microSavingsPots: 'Izimbiza Zami Zokonga',
    potsSubtitle: 'Gcina imali eceleni yokudla, isitoko se-spaza, imifaniswano yesikole noma umndeni',
    newGoalPot: '+ Imbiza Entsha',
    createFirstPot: 'Yakha Imbiza Yokuqala',
    noPotsYetTitle: 'Azikho izimbiza zokonga okwamanje',
    emptyPotsMsg: 'Awukenzi mbiza yokonga. Ngisho ukubeka u-R10 wokudla kuyasiza ekhaya.',
    goalLabel: 'Umgomo:',
    savedPercentSuffix: '% okongiwe',
    goalReachedLabel: 'Umgomo ufeziwe',
    deposit: '+ Faka Imali',
    withdraw: 'Khipha',
    howItWorks: 'Indlela I-MoniBuddy Ekusiza Ngayo',
    howStep1Title: '01. Izimbiza Zokonga',
    howStep1Body: 'Hlukanisa imali yokudla, isitoko nesikole emalini yokusebenzisa nsuku zonke.',
    howStep2Title: '02. Isikhwama Esiphuthumayo',
    howStep2Body: 'Zibekele isikhwama sakho ukuze izimo eziphuthumayo zingakufaki komashonisa.',
    howStep3Title: '03. Umlindi Wemikhonyovu',
    howStep3Body: 'Hlola imilayezo esolisayo nezimali zokukhipha imali ngaphandle kwedatha.',
    howStep4Title: '04. Ukusebenza Ngaphandle Kwedatha',
    howStep4Body: 'Isebenza ngokuphelele ngaphandle kwe-inthanethi kanye nesilingisi se-USSD.',
    addToBuffer: '+ Engeza Esikhwameni Esiphuthumayo',
    insufficientSafeCashError: 'Le mali yeqa imali yakho evumelekile ukusetshenziswa. Faka inaniincane noma bhala imali engenile.',
    insufficientBufferError: 'Le mali yeqa imali esesikhwameni esiphuthumayo.',
    insufficientPotError: 'Le mali yeqa imali ekhona kule mbiza.',

    cashLogTitle: 'Imali Engenayo & Ephumayo',
    cashLogSubtitle: 'Bhala imali engenayo nephumayo nsuku zonke ocingweni ngaphandle kwedatha',
    totalMoneyIn: 'Yonke Imali Engenile',
    totalMoneyInSub: 'Imiholo, amatoho, ukudayisa nesibonelelo',
    totalMoneyOut: 'Yonke Imali Ephumile',
    totalMoneyOutSub: 'Ukudla, itekisi, ugesi nesitoko',
    last7DaysTitle: 'Izinsuku Ezingu-7 Ezidlule',
    last7DaysSub: ' ukuhamba kwemali nsuku zonke',
    sevenDayWindow: 'Izinsuku ezingu-7',
    peakDayPrefix: 'Usuku oluphezulu:',
    manualEntryTitle: 'Ukubhala Ngezandla',
    manualEntrySub: 'Bhala imininingwane nosuku',
    moneyOutBtn: '- Imali Ephumayo',
    moneyInBtn: '+ Imali Engenayo',
    commonCategoriesLabel: 'Izigaba ezijwayelekile:',
    descriptionLabel: 'Incazelo',
    descriptionPlaceholder: 'Le mali ibiyeyani?',
    amountRandLabel: 'Inani (R)',
    dateLabel: 'Usuku',
    saveEntryBtn: 'Gcina Konke',
    recordedTransactionsTitle: 'Imali Ebhaliwe',
    recordedTransactionsSub: 'Ibethelwe ngasese kulolu cingo',
    recordsCountSuffix: 'okubhaliwe',
    noTransactionsTitle: 'Ayikho imali ebhaliwe okwamanje',
    noTransactionsBody: 'Sebenzisa Izwi, i-Touch Pad, noma Ukubhala ngenhla ukuze uqale.',
    presetGroceries: 'Ukudla Nesinkwa',
    presetTaxi: 'Imali Yetekisi',
    presetElectricity: 'Ugesi',
    presetSpaza: 'Isitoko se-Spaza',
    presetAirtime: 'I-Airtime / Idatha',
    presetWages: 'Umholo',
    presetHustle: 'Itoho / Ukudayisa',
    presetGrant: 'Isibonelelo se-SASSA',

    voiceNavBtn: 'Izwi',
    voiceModalTitle: 'Ukubhala Ngezwi & Ngezinkinobho',
    voiceModalSub: 'Bhala imali ngezwi, ngesitsotsi saseMzansi, noma nge-Touch Pad engenadatha',
    quickVoiceTouchTitle: 'Ukufaka Ngokushesha Ngezwi & Touch Pad',
    voiceTabLabel: 'Izwi',
    touchPadTabLabel: 'I-Touch Pad',
    speakTransactionBtn: 'Khuluma Manje',
    doneSpeakingBtn: 'Qeda Ukukhuluma',
    stopListeningBtn: 'Misa Ukulalela',
    transcribingOfflineMsg: 'iguqula izwi ocingweni ngaphandle kwedatha...',
    offlineVoicePackBtn: 'Iphakethe Lezwi',
    downloadingProgressPrefix: 'Iyadawuniloda',
    slangGuideShow: 'Amagama esitsotsi',
    slangGuideHide: 'Fihla amagama',
    slangGuideHeading: 'Amagama AseMzansi Amukelwayo',
    listeningOfflineHint: 'Iyalalela ngaphandle kwedatha — cindezela Qeda Ukukhuluma',
    onDeviceAudioBadge: 'Izwi locingo',
    spokenPhraseLabel: ' into oyishilo noma oyibhalile',
    spokenPhrasePlaceholder: 'Khuluma noma ubhale (isib. "taxi to town R32" noma "two choco for bread")',
    voiceNetworkLimitationNote:
      'Ukuqoshwa kwezwi kwesiphequluli kudinga i-inthanethi ngaphandle uma ugcine iphakethe lezwi elingu-35 MB. Ungabhala lapha noma usebenzise i-Touch Pad ngaphandle kwedatha.',
    noAmountParsedError:
      'Alikho inani lamaRandi elitholakele. Shono inani (njengo "R32 wetekisi" noma "two choco") noma usebenzise i-Touch Pad.',
    openTouchPadBtn: 'Vula i-Touch Pad',
    entriesReadyTitle: 'Okulungele Ukugcinwa',
    recognizedSlangPrefix: 'Isitsotsi:',
    emptyPreviewTouchHint: 'Khetha isithombe sesigaba bese ucindezela izinkinobho zemali (+1 Choco, +1 Clipa) noma izinombolo.',
    emptyPreviewVoiceHint: 'Cindezela Khuluma Manje, bhala amanothi, noma vula i-Touch Pad.',
    editInFormBtn: 'Hlela efomini',
    saveEntriesBtnPrefix: 'Gcina',
    saveEntriesBtnSuffix: 'Ebhukwini',
    savedEntriesNoticePrefix: 'Kugcinwe ebhukwini lakho elibethelwe:',
    modeTouchActive: 'I-Touch Pad iyasebenza (0 MB idatha)',
    modeCloudSpeech: 'Izwi lesiphequluli (lisebenzisa inethiwekhi)',
    modeOnDeviceSpeech: 'Izwi locingo liyasebenza',
    modeOfflineSpeechReady: 'Izwi elingenadatha liyasebenza (0 MB)',
    modeOfflinePackAvailable: 'Iphakethe lezwi elingenadatha (35 MB)',
    packSavedStatus: 'Iphakethe ligciniwe',
    packSavingPrefix: 'Igcina iphakethe',
    packWaitingWifi: 'Ilinde i-Wi-Fi',
    packDataProtected: 'Idatha ivikelekile',
    touchStep1Category: '1. Khetha isigaba',
    touchStep2Slang: '2. Cindezela isitsotsi noma amaRandi',
    touchZeroTyping: 'Akubhalwa lutho · 0 MB idatha',
    touchTapAboveBtn: 'Cindezela Imali Ngenhla',
    touchAddItemPrefix: 'Faka',
    voicePackModalTitle: 'Kudingeka Iphakethe Lezwi Elingenadatha',
    voicePackModalSub: 'Ivikele i-airtime nedatha yakho',
    voicePackModalBody:
      'Ukuze ukhulume ngaphandle kwe-inthanethi, kudingeka iphakethe lezwi elingu-35 MB. Uma seligcinwe nge-Wi-Fi, lisebenza njalo ngaphandle kwedatha.',
    voicePackCellularWarn:
      'Usebenzisa idatha yeselula. I-MoniBuddy ivimbele ukudawuniloda ngokuzenzakalelayo ukuze i-airtime yakho ingapheli.',
    voicePackOfflineWarn:
      'Awunayo i-inthanethi okwamanje. Hlela ukudawuniloda nge-Wi-Fi noma usebenzise i-Touch Pad manje.',
    voicePackDownloadNow: 'Dawuniloda Manje (35 MB)',
    voicePackDownloadWifi: 'Dawuniloda Kamuva nge-Wi-Fi',
    voicePackUseTouchPad: 'Sebenzisa i-Touch Pad',
    voicePackCancelDownload: 'Misa Ukudawuniloda',
    voicePackUseTouchMeanwhile: 'Sebenzisa i-Touch Pad Okwamanje',

    loanShieldBadge: 'Isikhwama Sakho · Ukuhlola Umthetho Wezikweletu (NCA)',
    loanShieldTitle: 'Isikhwama Esiphuthumayo & Isihlangu Sezikweletu',
    loanShieldSubtitle:
      'Zibekele isikhwama esiphuthumayo futhi uhlole noma yisiphi isikweletu ngokwemikhawulo yomthetho we-National Credit Act (NCA).',
    yourEmergencySavings: 'Imali Yakho Ephuthumayo',
    depositR100Btn: '+ Beka R100',
    depositR250Btn: '+ Beka R250',
    manageFundBtn: 'Phatha Isikhwama',
    burnRateTitle: 'Izindleko Zasekhaya NgeSonto',
    burnRateSub: 'Imali encane edingekayo ngesonto yokudla, itekisi nogesi',
    perWeekSuffix: '/ isonto',
    twoWeekTargetTitle: 'Umgomo Wamasonto Amabili',
    twoWeekTargetBodyPrefix: 'Gcina u-',
    twoWeekTargetBodySuffix: 'ukuze ukwazi ukuphila amasonto amabili uma amatoho engatholakali.',
    oneMonthTargetTitle: 'Umgomo Wenyanga Egcwele',
    oneMonthTargetBodyPrefix: 'Gcina u-',
    oneMonthTargetBodySuffix: 'ukuze ukwazi ukuthenga izidingo zenyanga yonke ngaphandle kokuboleka.',
    loanQuoteTitle: 'Hlola Isikweletu Ngokomthetho WaseNingizimu Afrika (NCA)',
    loanQuoteSubtitle:
      'Faka imali oyibolekayo, izimali zokuvula kanye nemali efunwa umbolekisi noma umashonisa ukuze ubone inzalo yangempela (APR) nokuthi yeqa umthetho we-NCA Regulation 42 yini.',
    loanPrincipalLabel: 'Imali Ebolekwayo (R)',
    loanInputModeRepayment: 'Faka Inani Olubuyisayo Lonke (R)',
    loanInputModeMonthlyRate: 'Faka Inzalo Ngenyanga (%)',
    loanQuotedRepaymentLabel: 'Imali Yonke Efunwa Umbolekisi (R)',
    loanMonthlyRateLabel: 'Inzalo Ngenyanga (%)',
    loanExtraFeesLabel: 'Izimali ze-Admin / Zokuvula / Zokuqoqa (R)',
    loanTermDaysLabel: 'Isikhathi Sokukhokha (Izinsuku)',
    loanFirstLoanToggle: 'Isikweletu sokuqala kulo nyaka (umkhawulo u-5% ngenyanga vs 3%)',
    loanQuoteCardTitle: 'Okufunwa Umbolekisi',
    loanNcaCapCardTitle: 'Umkhawulo Womthetho (NCA Reg 42)',
    loanSelfBufferCardTitle: 'Isikhwama Sakho Esiphuthumayo',
    loanTotalRepayLabel: 'Imali Ebuyiswayo Yonke',
    loanTotalCostLabel: 'Inzalo Nezimali Ngaphezulu',
    loanEffectiveAprLabel: 'Inzalo Ngonyaka (APR)',
    loanStatusExceedsCap: 'Ngaphezu komkhawulo we-NCA kulesi sibali. Hlola noMkhandlu Wezimali (NCR) ngaphambi kosayina. // TODO-NATIVE-REVIEW',
    loanStatusWithinCap: 'Ingaphakathi Komkhawulo We-NCA — Hlola Ukuthi Uzokwazi Yini Ukukhokha',
    loanOverchargeVsNcaLabel: 'Ngaphezulu komthetho we-NCA ngo-',
    loanSavedWithBufferLabel: 'Imali oyongayo ngesikhwama sakho',
    loanNcaCitation:
      'Umthombo: National Credit Act 34 ka-2005, Regulation 42 (GN R1080, Nov 2015 — inzalo enkulu ngu-5% ngenyanga esikweletini sokuqala noma u-3% kwezilandelayo, imali yokuvula u-R165 + 10% engadluli ku-15%, nemali yesevisi u-R60 ngenyanga).',
    loanSaferAlternativesTitle: 'Izindlela Eziphephile Ngaphambi Kokuboleka',
    loanAlt1: 'Sebenzisa isikhwama sesitokofela sangempela noma imbiza yomndeni kuqala.',
    loanAlt2: 'Qinisekisa ukuthi umbolekisi ubhalisiwe kwa-NCR (0860 627 627) futhi ungaze ushiye ikhadi lakho le-SASSA, umazisi (ID) noma i-PIN.',
    loanAlt3: 'Cela uhlelo lokukhokha kancane kancane esikoleni, emtholampilo noma kumasipala ngaphandle kwenzalo.',
    loanEducationalDisclaimer:
      'Ithuluzi Lokufundisa Kuphela: Lezi zibalo zenzelwe ukuqwashisa ngomthetho we-NCA futhi azisona iseluleko esisemthethweni sezezimali.',
    loanProtectionBannerTitle:
      'Isivikelo Somthetho We-NCA — Ungaze Ushiye Ikhadi Le-SASSA, ID Noma I-PIN',
    loanProtectionBannerBody:
      'Ngaphansi kweSigaba 90 no-133 somthetho we-National Credit Act, kuyicala eliboshisayo ukuthi umashonisa noma umbolekisi agcine ikhadi lakho lasebhange, ikhadi le-SASSA, umazisi (ID) noma i-PIN yakho njengesibambiso, noma afune imali yokuvula ngaphambili.',
    loanPredatoryWarningBannerTitle:
      'Isexwayiso Sesikweletu Esixhaphazayo — Seqe Umkhawulo Womthetho We-NCA',
    loanPredatoryWarningBannerBodyPrefix:
      'Yima ungakasayini: Lesi sikweletu sikukhokhisa u-',
    loanPredatoryWarningBannerBodySuffix:
      'ngaphezulu komkhawulo osemthethweni we-Regulation 42. Ungakhokhi mali yokuvula — bika lezi zimo ezingekho emthethweni kwa-NCR ku-0860 627 627.',
    loanLegalCautionBannerTitle:
      'Qaphela Izindleko — Ingaphakathi Komthetho We-NCA, Kodwa Inenzalo Nezimali',
    loanLegalCautionBannerBodyPrefix:
      'Ngisho ingaphakathi komkhawulo womthetho, lesi sikweletu sikubiza u-',
    loanLegalCautionBannerBodySuffix:
      'ngaphezulu ngenzalo nezimali kunokusebenzisa u-R 0.00 esikhwameni sakho esiphuthumayo.',

    scamGuardTitle: 'Umlindi Wemikhonyovu Nemilayezo Yombombayi',
    scamGuardSub:
      'Hlola ama-SMS asolisayo, izikweletu ze-WhatsApp, imilayezo ye-SASSA nezimali zokukhipha imali ngasese ocingweni lwakho',
    scamRuleBasedDisclaimerTitle: 'Ukuhlola Okusekelwe Emithethweni — Qinisekisa Ngocingo Njalo',
    scamRuleBasedDisclaimerBody:
      'Leli thuluzi lihlola izimpawu zemikhonyovu ezaziwayo ngaphandle kwedatha. Ukungatholi lutho AKUSHO ukuthi umlayezo uphephe 100% — imikhonyovu emisha iqhamuka nsuku zonke. Ungabelani nge-PIN noma i-OTP.',
    scamHighRiskBannerTitle:
      'Isexwayiso Esibomvu Somkhonyovu — Yima Ungathumeli Imali Noma Ivawusha',
    scamHighRiskBannerBody:
      'Izimpawu eziningi zomkhonyovu zitholakele kulesi sicelo. Ungakhokhi mali yokuvula isikweletu noma umsebenzi, ungaze usho i-PIN noma i-OTP yakho, futhi uqinisekise ngocingo olusemthethweni kuqala.',
    scamCautionBannerTitle:
      'Isexwayiso Sokuqaphela — Kukhona Izimpawu Ezisolisayo Ezitholakele',
    scamCautionBannerBody:
      'Yehlisa umoya uqinisekise ngokwakho: Abakhohlisi basebenzisa uvalo nezinombolo ezingaziwa ukukuxhamazelisa. Shayela umuntu ngqo ngaphambi kokukhokha.',
    scamPasteLabel: 'Namathisela i-SMS, Umlayezo we-WhatsApp noma Isicelo Semali',
    scamClearChecker: 'Sula konke',
    scamPlaceholder:
      'Namathisela umlayezo lapha ukuhlola imali yokuvula isikweletu, imifaniswano yomsebenzi, ukwebiwa kwe-PIN/OTP noma imilayezo ye-SASSA yombombayi...',
    scamPaymentDetailsTitle: 'Imininingwane Yenkokhelo Nomuntu (Uma uthanda)',
    scamAddDetails: 'Faka imininingwane',
    scamHideDetails: 'Fihla imininingwane',
    scamRecipientNameLabel: 'Igama Lomamukeli noma Isitolo',
    scamRecipientIdLabel: 'Inombolo Yocingo noma ID',
    scamAmountRequestedLabel: 'Imali Efunwayo (R)',
    scamPaymentTypeLabel: 'Uhlobo Lwenkokhelo',
    scamOpLoanFee: 'Imali Yokuvula Isikweletu Ngaphambili',
    scamOpCashOut: 'Ukukhipha Imali / eWallet / Ivawusha',
    scamOpP2P: 'Ukuthumelela Umuntu Imali',
    scamOpMerchant: 'Ukuthenga Izimpahla Noma Isevisi',
    scamAgentFeeLabelPrefix: 'Imali Ye-Agent Efunwayo',
    scamUnregisteredLenderCheck: 'Umbolekisi ongabhalisiwe kwa-NCR',
    scamNewRecipientCheck: 'Umuntu omusha / ongaziwa',
    scamReadyTitle: 'ikulungele Ukuhlola Umlayezo Ngaphandle Kwedatha',
    scamReadyBody:
      'Namathisela noma iyiphi i-SMS noma i-WhatsApp ngenhla. Umlayezo wakho uhlala uyimfihlo ocingweni lwakho kuphela.',
    scamVerifyBtn: 'Hlola Ukuphepha Kwenkokhelo',
    scamFraudReportBtn: 'Umbiko Womkhonyovu',
    scamHideReportBtn: 'Fihla Umbiko',
    scamWarningSignsHeading: 'Izimpawu Zengozi Ezitholakele',
    scamNoKnownPatternAdvice: 'Ayikho ingozi eyaziwayo etholakele — qinisekisa ngocingo kuqala',
    scamBlockAdvice: 'UNGATHUMELI IMALI — Vimba inkokhelo',
    scamHelplinesTitle: 'Izinombolo Zosizo Zomkhonyovu eNingizimu Afrika',
    scamHelplinesSub: 'Izinombolo ezisemthethweni zokubika ukukhwabanisa kwebhange noma omashonisa',
    scamModalHighRiskBadge: 'ISEXWAYISO ESIPHEZULU SOMKHONYOVU',
    scamModalListenHeading: 'Lalela Isexwayiso Sezwi Ngaphambi Kokukhokha:',
    scamModalPlayBtn: 'Dlala Isexwayiso Sezwi',
    scamModalStopBtn: 'Misa Isexwayiso Sezwi',
    scamModalMandatoryChecks: 'Izinyathelo Zokuphepha Ezibalulekile:',
    scamModalAckCheckbox:
      'Ngiqinisekisile ngokushayela inombolo esemthethweni futhi ngiyazi ukuthi imali noma ivawusha ayibuyeki.',
    scamModalCancelBlockBtn: 'Khansela & Vimba Inkokhelo (Kunconyiwe)',
    scamModalProceedBtn: 'Ngiqinisekisile Ngqo — Qhubeka',

    syncBadge: 'Ukugcinwa Ocingweni · Isilingisi se-USSD',
    syncTitle: 'Ukusebenza Ngaphandle Kwedatha & Isilingisi se-USSD',
    syncSub:
      'Ibhuku lakho lisebenza ngaphandle kwedatha ocingweni lwakho. Zama isilingisi se-*120*6664# esikhombisa ukuthi izingcingo zezinkinobho zisebenza kanjani.',
    ussdSimNoticeTitle: 'Isilingisi se-USSD Esingaphakathi Kohlelo (Prototype)',
    ussdSimNoticeBody:
      'Ikhodi ethi *120*6664# lapha iyisilingisi esisebenza ngaphandle kwedatha nebhuku lakho locingo — ayikabi ikhodi yamanethiwekhi omakhalekhukhwini.',
    savedTransactionsLabel: 'Okubhaliwe Okubethelwe',
    activeSavingsPotsLabel: 'Izimbiza Eziyasebenza',
    verifyLocalLedgerBtn: 'Qinisekisa & Gcina Ibhuku Elibethelwe',
    verifyingLocalLedgerBtn: 'Iyabethela futhi igcina ocingweni...',
    offlineAirplaneGuarantee:
      'Imali yakho, izimbiza nomlando wakho kuyasebenza ngisho uku-Airplane Mode ngaphandle kwe-airtime.',
    installHomeScreenHint:
      'Faka i-MoniBuddy kusikrini sasekhaya ukuze ivuleke noma nini ngaphandle kwedatha.',
    ussdShortcodeCardTitle: 'Umbono Wekhodi ye-USSD Yezingcingo Zezinkinobho (*120*6664#)',
    ussdShortcodeCardBody:
      'Sebenzisa izinkinobho kwesokudla ubone ukuthi abadayisi bangabheka kanjani imali yabo noma babeke u-R50 esikhwameni esiphuthumayo.',
    launchSimulatorBtn: 'Vula Isilingisi se-USSD',
    copyShortcodeBtn: 'Kopisha *120*6664#',
    copiedShortcodeBtn: 'Ikopishiwe',
    ussdSimulatorTag: 'ISILINGISI · IDEMO ENGENADATHA',
    ussdOpenMenuBtn: 'Qala Isilingisi *120*6664#',
    ussdCloseMenuBtn: 'Vala Imenyu',
    ussdSendBtn: 'Thumela',

    techBadge: 'Ukwakheka, Ukusimama & Ukuphepha',
    technicalBriefTitle: 'Indlela I-MoniBuddy Esebenza Futhi Ikhule Ngayo',
    techSubtitle:
      'Yakhelwe abantu baseNingizimu Afrika abahola ngendlela engajwayelekile: mahhala kubasebenzisi, ayiqedi datha, futhi ibethelwe nge-AES-256.',
    techCap1Title: 'Ukugcinwa Okubethelwe nge-AES-256-GCM',
    techCap1Body:
      'Ibhuku lakho libethelwa ocingweni nge-WebCrypto AES-256-GCM ne-PBKDF2-SHA256 (100,000) kanye namafonti agcinwe ngaphakathi.',
    techCap2Title: 'Ukuvikelwa Kwe-Airtime Nedatha',
    techCap2Body:
      'Alukho uxhumano lwangaphandle lapho uvula uhlelo. Iphakethe lezwi elingu-35 MB alidawunilodi ngedatha yeselula ngaphandle kwemvume yakho.',
    techCap3Title: 'Ukufinyeleleka Kalula Ngezilimi Ezingu-5',
    techCap3Body:
      'Amagama amakhulu (A+), umhlahlandlela wezwi, izilimi ezingu-5 zaseNingizimu Afrika ne-Touch Pad esebenza kalula.',
    techCap4Title: 'Isihlangu Semikhonyovu & Umthetho we-NCA',
    techCap4Body:
      'Ukuhlolwa kwemikhonyovu nemikhawulo yenzalo ye-NCA Regulation 42 kwenzeka ngaphakathi ocingweni lwakho.',
    sustainabilityTitle: 'Ukusimama Kohlelo Ngaphandle Kokukhokhisa Umsebenzisi',
    sustainabilitySubtitle:
      'Indlela i-MoniBuddy ehlala imahhala ngayo emphakathini ngenkathi ikhula ngokwebhizinisi (B2B2C)',
    sustModel1Title: '1. Ukuxhaswa Amabhange Namanethiwekhi (B2B2C)',
    sustModel1Body:
      'Amabhange, izinkampani zomshwalense namanethiwekhi omakhalekhukhwini akhokhela ukusingathwa kwe-PWA/USSD engenadatha ukusiza amakhasimende onge ngokuphepha.',
    sustModel2Title: '2. Izitokofela Ezibhalisiwe Namabhizinisi Omphakathi',
    sustModel2Body:
      'Ukusebenzisa komuntu ngamunye kumahhala njalo. Izitokofela ezinkulu zikhokha u-R49 ngenyanga wokuphatha amabhuku namasignisha amaningi.',
    sustModel3Title: '3. Ukubambisana Nezitolo Zokudla Ngokuzithandela',
    sustModel3Body:
      'Imivuzo regulated lapho umsebenzisi ekhetha ukuthenga ukudla ngezimbiza zakhe — azikho izikhangiso zomashonisa futhi imininingwane ayidayiswa.',
    dignityTitle: 'Isibopho Sethu Esithunzini Sezezimali',
    dignitySubtitle: 'Imigomo eqinile evikela imali yomndeni wakho',
    dignity1Title: 'Mahhala Njalo Kumuntu Ngamunye',
    dignity1Body: 'Izimbiza, isikhwama esiphuthumayo nesihloli semikhonyovu kumahhala ngokuphelele.',
    dignity2Title: 'Akudayiswa Mininingwane',
    dignity2Body: 'Asidayisi umlando wakho wemali futhi asifaki izikhangiso zezikweletu.',
    dignity3Title: 'Yakhelwe Imali Yamatoho Ne-Spaza',
    dignity3Body: 'Ihambisana nemiholo yamasonto, ukudayisa kwe-spaza, izitokofela nesitsotsi saseMzansi.',

    privacyBadge: 'Ilungelo le-POPIA · Ukubethelwa kwe-AES-256-GCM',
    privacyGuaranteeTitle: 'Ubumfihlo Bakho Nokulawula Idatha',
    privacySubtitle: 'Ubunini obugcwele phezu kwebhuku lakho elibethelwe, ama-backup nokusula.',
    privacyMainHeading: 'Imininingwane Yakho Ihlala Ibethelwe Ezandleni Zakho',
    privacyMainBody:
      'I-MoniBuddy ayiceli iphasiwedi yebhange noma ukuvula i-akhawunti yefu. I-akhawunti ngayinye ocingweni ibethelwe ngokwayo.',
    privacyPoint1Title: '01. Ukubethelwa kwe-PBKDF2-SHA256 + AES-256-GCM',
    privacyPoint1Body:
      'I-PIN yakho ivikelwe nge-PBKDF2 (100,000) kanti ibhuku lakho libethelwe nge-AES-256-GCM ukuze izinombolo zakho zingahlali obala.',
    privacyPoint2Title: '02. Azikho Izinhloli Noma Izikhangiso',
    privacyPoint2Body: 'Akukho okukulandelayo noma amafonti alandwa ngaphandle. Akekho obona ukuhamba kwemali yakho.',
    privacyPoint3Title: '03. I-Backup Ephathekayo Nokusula Ngokushesha',
    privacyPoint3Body:
      'Dawuniloda ifayela le-backup ngaphambi kokushintsha ucingo, buyisela i-backup noma usule konke ngokucindezela kanye.',
    downloadBackupBtn: 'Dawuniloda i-Backup (.json)',
    restoreBackupBtn: 'Buyisela i-Backup',
    eraseLedgerBtn: 'Sula Imininingwane Yebhuku',
    eraseConfirmTitle: 'Sula Konke Okusebhukwini?',
    eraseConfirmSub: 'Lokhu akukwazi ukuhlehliswa',
    eraseConfirmBody:
      'Lokhu kuzosula unomphela imali yokuqala, izimbiza, isikhwama esiphuthumayo nomlando wale akhawunti kulolu cingo.',
    eraseEverythingBtn: 'Sula Konke',
    backupDownloadedMsg: 'Ifayela le-backup lidawunilodiwe ocingweni lwakho. Ligcine liyimfihlo.',
    backupRestoredMsg: 'I-backup yakho ibuyiselwe futhi yabethelwa ebhukwini lakho.',
    backupInvalidMsg: 'Ifayela le-backup alifundeki. Sicela ukhethe ifayela le-MoniBuddy .json elivumelekile.',
    ledgerErasedMsg: 'Yonke imininingwane yale akhawunti isuliwe kulolu cingo.',

    modalCreatePotTitle: 'Yakha Imbiza Entsha Yokonga',
    modalChooseIcon: 'Khetha Upawu',
    modalSavingForLabel: 'Wongelani?',
    modalSavingForPlaceholder: 'isib. Ukudla, Isitoko se-spaza, Izicathulo zesikole',
    modalTargetAmountLabel: 'Umgomo Wemali (R)',
    modalCategoryLabel: 'Isigaba',
    modalCreatePotSubmit: 'Yakha Imbiza',
    modalPutMoneyIn: 'Faka Imali Embizeni',
    modalTakeMoneyOut: 'Khipha Imali Embizeni',
    modalCurrentlyInPot: ' Okukhona kule mbiza:',
    modalAvailableSafeCash: 'Imali ekhona ongayibeka:',
    modalSaveToPotBtn: 'Gcina Embizeni',
    modalTakeOutCashBtn: 'Khipha Imali',
    modalBufferTitle: 'Isikhwama Esiphuthumayo',
    modalBufferSub: 'Isivikeli somndeni sakho',
    modalUseBufferBtn: '- Sebenzisa Imali Ephuthumayo',
    modalCurrentBufferLabel: ' okusesikhwameni manje:',
    modalReasonOptionalLabel: 'Isizathu (Uma uthanda)',
    modalReasonPlaceholder: 'isib. Umtholampilo, uhambo oluphuthumayo',
    modalSaveToFundBtn: 'Gcina Esikhwameni',
    modalWithdrawCashBtn: 'Khipha Imali',
    pwaInstallOfflineApp: 'Faka Uhlelo Elingenadatha',
    pwaInstallOnIphone: 'Faka ku-iPhone',
    pwaIosGuideTitle: 'Gcina i-MoniBuddy Kusikrini Sasekhaya',
    pwaIosStep1: 'Cindezela uphawu lokwabelana (Share) ku-Safari.',
    pwaIosStep2: 'Khetha u-Add to Home Screen ukuze uvule i-MoniBuddy ngaphandle kwedatha.',
    pwaGotIt: 'Ngizwile',

    audioGuides: {
      overview: {
        title: 'Imali Ephephile & Izimbiza Zokonga',
        content:
          'Imali Ephephile phezulu ikhombisa ongayisebenzisa namuhla ungathinti izimbiza zokudla nesikhwama esiphuthumayo.',
        keyAdvice: 'Icebiso: Ukubeka ngisho u-R20 ngesonto kuyawuvikela umndeni wakho.'
      },
      income_expenses: {
        title: 'Imali Engenayo Nephumayo',
        content:
          'Bhala imali ngezwi, nge-Touch Pad engenadatha noma ngesandla. Ukusula okubhaliwe kubuyisela izibalo emuva ngokuzenzakalelayo.',
        keyAdvice: 'Icebiso: Sebenzisa i-Touch Pad uma ungenayo i-inthanethi.'
      },
      buffer_credit: {
        title: 'Isikhwama Esiphuthumayo & Umthetho we-NCA',
        content:
          'Hlola noma yisiphi isikweletu ngokwemikhawulo yomthetho we-National Credit Act kanye nesikhwama sakho.',
        keyAdvice: 'Icebiso: Abambolekisi abasemthethweni abavunyelwe ukubiza ngaphezu kuka-5% ngenyanga esikweletini sokuqala.'
      },
      scam_guard: {
        title: 'Umlindi Wemikhonyovu',
        content:
          'Namathisela umlayezo we-SMS noma i-WhatsApp ukuze uhlole izimpawu zomkhonyovu ngaphandle kwedatha. Qinisekisa ngocingo njalo.',
        keyAdvice: 'Icebiso: Ungakhokhi imali yokuvula isikweletu noma umsebenzi ngevawusha.'
      },
      sync_2g: {
        title: 'Imenyu Engenadatha & Isilingisi se-USSD',
        content:
          'Ibhuku lakho ligcinwe ocingweni lwakho. Zama isilingisi se-USSD ukuze ubone imenyu yezingcingo zezinkinobho.',
        keyAdvice: 'Icebiso: Faka uhlelo kusikrini sasekhaya ukuze lusebenze njalo.'
      },
      technical_brief: {
        title: 'Indlela Esebenza Futhi Isimame Ngayo',
        content:
          'I-MoniBuddy ivikela idatha yakho, ibethela ibhuku lakho nge-AES-256 futhi ihlala imahhala kubasebenzisi.',
        keyAdvice: 'Icebiso: Yonke imininingwane yakho ihlala ocingweni lwakho kuphela.'
      },
      privacy_legal: {
        title: 'Ubumfihlo & Ama-Backup',
        content:
          'I-PIN yakho ivikelwe nge-PBKDF2 kanti ibhuku libethelwe nge-AES-256-GCM. Dawuniloda i-backup ngaphambi kokushintsha ucingo.',
        keyAdvice: 'Icebiso: Gcina ifayela le-backup endaweni ephephile.'
      }
    },
    authErrLedgerDecryptFailed: 'Failed to decrypt secure ledger. Incorrect PIN or corrupted data. // TODO-NATIVE-REVIEW',
    warningUnencryptedLedger: 'Your data is NOT encrypted on this device because WebCrypto is unavailable. // TODO-NATIVE-REVIEW',
    authPinLengthHint: 'Recommended: 6 or more digits // TODO-NATIVE-REVIEW',
    welcomeModalTitle: 'Welcome to MoniBuddy // TODO-NATIVE-REVIEW',
    welcomeModalStep1Title: '1. Safe-to-Spend Balance // TODO-NATIVE-REVIEW',
    welcomeModalStep1Body: 'Your Safe-to-Spend amount shows cash you can use today after protecting your savings pots and emergency buffer. // TODO-NATIVE-REVIEW',
    welcomeModalStep2Title: '2. Log Income & Expenses // TODO-NATIVE-REVIEW',
    welcomeModalStep2Body: 'Record cash easily using offline voice recognition, the zero-data Touch Pad, or manual entry. // TODO-NATIVE-REVIEW',
    welcomeModalStep3Title: '3. Emergency Buffer & Scam Guard // TODO-NATIVE-REVIEW',
    welcomeModalStep3Body: 'Build your household safety cushion and check suspicious SMS or WhatsApp messages offline. // TODO-NATIVE-REVIEW',
    welcomeModalSkip: 'Skip // TODO-NATIVE-REVIEW',
    welcomeModalNext: 'Next // TODO-NATIVE-REVIEW',
    welcomeModalFinish: 'Get Started // TODO-NATIVE-REVIEW',
    scamGuardDisclaimer: 'Note: Rule-based scam detection is heuristic and local. A SAFE result does not guarantee a message or person is safe — new scams appear daily. Always verify by phone before paying. // TODO-NATIVE-REVIEW',
    loanAnnualisedCost: 'Annualised cost (simple) // TODO-NATIVE-REVIEW',
    loanPrincipalMinError: 'Principal amount must be at least R100. // TODO-NATIVE-REVIEW',
    loanTermMinError: 'Term must be between 1 and 180 days. // TODO-NATIVE-REVIEW',
    ussdDemoNotice: 'Demo USSD transaction simulated for offline testing. // TODO-NATIVE-REVIEW',
    ussdDemoBadge: 'USSD Demo // TODO-NATIVE-REVIEW',
    sourceLabel: 'Source // TODO-NATIVE-REVIEW',
    lastVerifiedLabel: 'Last Verified // TODO-NATIVE-REVIEW',
    unverifiedBadge: 'Unverified, check with NCR // TODO-NATIVE-REVIEW',
    voiceOfflineNote: 'Voice recognition requires a network connection or downloaded voice pack. Typing and touch pad always work offline. // TODO-NATIVE-REVIEW'
  },

  xh: {
    appName: 'MoniBuddy',
    tagline: 'Ukuphatha Imali Okulula Ngaphandle Kwedatha',

    cancel: 'Rhoxisa',
    close: 'Vala',
    save: 'Gcina',
    clear: 'Cima',
    remove: 'Susa',
    copy: 'Khuphela',
    copied: 'Ikhutshelwe',
    hide: 'Fihla amacebiso',
    show: 'Bonisa amacebiso',
    listen: 'Mamela',
    stopAudio: 'Misa Ilizwi',
    audioGuide: 'Mamela',
    audioGuideActive: 'Iyathetha...',
    audioGuideTranscript: 'Isikhokelo Selizwi',
    largeTextLabel: 'A+',
    largeTextTitle: 'Khulisa amagama',
    languageLabel: 'Ulwimi',
    lockAndSignOut: 'Tshixa & Phuma',
    signedInAs: 'Ungene njengo',
    offlineBanner: 'Ngaphandle kwe-intanethi · Iguqulelwe ngokufihlakeleyo efowunini',
    localLedgerActive: 'Incwadi efihliweyo iyasebenza',
    offlineSavedOnPhone: 'Ngaphandle kwedatha · Igcinwe efowunini',
    encryptedAesBadge: 'Ikhuselwe nge-AES-256-GCM efowunini',
    savedAtPrefix: 'Igcinwe ngo',
    moreMenu: 'Ezinye',
    myMoneySection: 'Imali Yam',
    guidePrivacySection: 'Isikhokelo & Ubumfihlo',

    navOverview: 'Isishwankathelo & Iimbiza',
    navIncomeExpenses: 'Imali Engenayo & Ephumayo',
    navBufferCredit: 'Uxakeka & Imali-mboleko',
    navScamGuard: 'Khangela Ubuqhophololo',
    nav2gSync: 'Isilinganisi se-USSD',
    navTechnicalBrief: 'Indlela Esebenza Ngayo',
    navPrivacyLegal: 'Ubumfihlo & Ukhuseleko',
    navShortPots: 'Iimbiza',
    navShortCash: 'Imali',
    navShortLoan: 'Iimboleko',
    navShortScam: 'Amaqhinga',

    authHeroBadge: 'Incwadi Yemali YaseMzantsi Afrika · Isebenza Ngaphandle Kwedatha',
    authHeroBody:
      'ahlula imali yokusebenzisa imihla ngemihla kwimali yokutya, eyesikolo, isitokhwe se-spaza kunye nesikhuseli sikaxakeka — ikhuselwe kwifowuni yakho ngaphandle kwedatha.',
    authFeature1Title: 'Ikhuselwe Ngqo Kwifowuni Yakho',
    authFeature1Body:
      'Incwadi yakho ikhuselwe nge-AES-256-GCM kunye ne-PIN yakho (PBKDF2 100,000). Isebenza ngaphandle kwe-airtime.',
    authFeature2Title: 'Isikhuseli Sobuqhophololo & Umthetho we-NCA',
    authFeature2Body:
      'Khangela iintlawulo zemali-mboleko ze-WhatsApp ezirhanelwayo, imiyalezo ye-SASSA yobuxoki kunye nemida ye-NCA ngaphandle kwedatha.',
    authFeature3Title: 'Akukho Ziphasiwedi Zebhanki okanye i-ID',
    authFeature3Body:
      'I-akhawunti nganye kwifowuni yosapho yahluliwe kwaye itshixwa imizuzwana engama-60 emva kwezilingo ezi-5.',
    authSignInTab: 'Ngena',
    authRegisterTab: 'Vula I-akhawunti',
    authSignInTitle: 'Vula Incwadi Yakho Ekhuselweyo',
    authSignInSubtitle: 'Faka inombolo yakho yefowuni kunye ne-PIN ukuvula incwadi yakho.',
    authRegisterTitle: 'Yenza I-akhawunti Yakho Efowunini',
    authRegisterSubtitle: 'Zenzele incwadi yemali eyimfihlo ngemizuzwana. Akukho datha ifunekayo.',
    authNoAccountYet: 'Akukho akhawunti isenziweyo kule fowuni.',
    authCreateOneLink: 'Yenza ngoku →',
    authMobileOrEmailLabel: 'Inombolo Yefowuni okanye i-Email',
    authMobileLabel: 'Inombolo Yefowuni (SA)',
    authPinLabel: 'I-PIN Yokhuseleko',
    authShowPin: 'Bonisa i-PIN',
    authHidePin: 'Fihla i-PIN',
    authPinPlaceholder: 'Amanani ama-4 ukuya kwisi-8',
    authRememberPhone: 'Khumbula inombolo yam kule fowuni',
    authUnlockButton: 'Vula Incwadi Yemali',
    authUnlockingButton: 'Iyavula...',
    authFullNameLabel: 'Igama Elipheleleyo',
    authFullNamePlaceholder: 'Igama lakho',
    authCreatePinLabel: 'Yenza i-PIN (4–8)',
    authConfirmPinLabel: 'Qinisekisa i-PIN',
    authEmailOptionalLabel: 'I-Email (Ukuba uyafuna)',
    authEmailOptionalPlaceholder: 'Isikhumbuzo nje',
    authCreateAccountButton: 'Yenza I-akhawunti & Khusela',
    authCreatingButton: 'Iyagcina...',
    authFooterGuarantee: 'Ikhuselwe nge-AES-256-GCM · PBKDF2-SHA256 PIN · Iyahambelana ne-POPIA',
    authFooterLeft: 'MoniBuddy Incwadi Yemali Nokonga',
    authFooterRight: 'Isebenza ngaphandle kwedatha 100%',
    authAudioSignIn:
      'Wamkelekile kwakhona ku-MoniBuddy. Faka inombolo yakho yefowuni kunye ne-PIN ukuvula incwadi yakho yemali.',
    authAudioRegister:
      'Wamkelekile ku-MoniBuddy. Faka igama lakho, inombolo yefowuni kunye ne-PIN ukwenza incwadi yemali ekhuselweyo kwifowuni yakho ngaphandle kwedatha.',
    authErrMissingCredentials: 'Nceda ufake inombolo yefowuni kunye ne-PIN.',
    authErrIncorrectCredentials: 'Inombolo yefowuni okanye i-PIN ayichanekanga.',
    authErrPinLockedPrefix: 'Izilingo ezininzi ezingaphumelelanga. Zama kwakhona emva kwemizuzwana engama-',
    authErrPinLockedSuffix: '.',
    authErrAttemptsLeftPrefix: 'Izilingo ezishiyekileyo phambi kokutshixwa:',
    authErrPinMismatch: 'Ii-PIN ezimbini azifani.',
    authErrMissingName: 'Nceda ufake igama lakho elipheleleyo.',
    authErrInvalidPhone: 'Nceda ufake inombolo yefowuni yaseMzantsi Afrika echanekileyo.',
    authErrInvalidPinFormat: 'I-PIN kufuneka ibe ngamanani ama-4 ukuya kwisi-8.',
    authErrAccountExists: 'Le nombolo yefowuni sele ikhona kule fowuni. Nceda ungene.',
    authGoogleButton: 'Qhubeka no-Google nokugcina',
    googleBackupActive: 'Ugcinelo Lwamafu luka-Google Lusebenza',
    googleBackupSync: 'Ngqamanisa Ugcinelo ku-Google',
    googleLoginSuccess: 'Ungene ngo-Google ngempumelelo. Idatha igciniwe.',
    googleLoginError: 'Ukungena ngo-Google kurhoxisiwe okanye i-email ayichanekanga.',
    googleEmailPrompt: 'Faka idilesi yakho ye-email yase-Google ukuze ungene kwaye ugcine idatha:',
    googleDetailsModalTitle: 'Ukungena kuka-Google Nenkcukacha Ezingaxhunywanga',
    googleDetailsModalSubtitle: 'Faka i-email yakho yase-Google neenkcukacha ukuze ukwazi ukungena ungaxhunywanga kwi-intanethi.',
    googleDetailsEmailLabel: 'Idilesi ye-email yase-Google',
    googleDetailsNameLabel: 'Igama Nezibongo',
    googleDetailsPhoneLabel: 'Umnxeba Weselula (wokungena ungaxhunywanga)',
    googleDetailsPinLabel: 'I-PIN Engaxhunywanga (amanani ama-4-6)',
    googleDetailsConfirmPinLabel: 'Qinisekisa i-PIN Engaxhunywanga',
    googleDetailsSubmit: 'Gcina kwaye Uqale I-Ledger Engaxhunywanga',

    safeToSpend: 'IMALI EKHUSELEKILEYO UKUSETYENZISWA NAMHLANJE',
    safeToSpendDesc:
      'Yimali ongayisebenzisa namhlanje ngaphandle kokuchukumisa iimbiza zokutya, ezesikolo kunye nesikhuseli sikaxakeka.',
    overspentWarningTitle: 'Usebenzise Ngaphezulu Kwemali Ekhoyo',
    overspentWarningDesc:
      'Iindleko zakho kunye neembiza zigqitha imali engenileyo. Bhala imali engenileyo, nciphisa iindleko okanye ukhuphe embizeni.',
    startingBalance: 'Imali oqala ngayo (R)',
    setStartingCash: 'Beka Imali Yokuqala',
    updateStartingCash: 'Hlaziya Imali Yokuqala',
    startingCashFirstTimePrompt: 'Qala incwadi yakho: Unamali engakanani esandleni okanye ebhankini ngoku?',
    startingCashEditPrompt: 'Faka imali onayo esandleni okanye ebhankini ngoku:',
    saveStartingBalance: 'Gcina Imali',
    startingTotal: 'IMALI YOKUQALA',
    income: 'IMALI ENGENAYO',
    expenses: 'IMALI EPHUMAYO',
    goalSavings: 'IIMBIZA ZOKONGA',
    emergencyBuffer: 'ISIKHUSELI SIKAXAKEKA',
    forecastReadyPrefix: 'Uqikelelo lokuphela kwenyanga: Ngesantya ochitha ngaso, uza kugqiba inyanga uno-',
    forecastReadySuffix: 'okhuselekileyo.',
    forecastPendingTitle: 'Uqikelelo lwenyanga:',
    forecastPendingBody: 'Bhala iindleko zemihla ngemihla iintsuku ezi-5 ukuze uvule uqikelelo.',
    zeroInterestSelfFunded: 'Akukho nzala · Eyokuzibekela',
    bufferCoversPrefix: 'Igquma malunga:',
    bufferCoversWeeksUnit: 'iiveki',
    bufferCoversSuffix: 'zeendleko zekhaya eziyimfuneko.',
    bufferEmptyPrompt: 'Beka ecaleni i-R50 okanye i-R100 ukuze uphephe oomashonisa.',
    activePotsSuffix: 'ziyasebenza',
    potsSummaryDesc: 'Imali ebekelwe ukutya, isikolo, isitokhwe se-spaza kunye nosapho.',
    microSavingsPots: 'Iimbiza Zam Zokonga',
    potsSubtitle: 'Gcina imali ecaleni yokutya, isitokhwe se-spaza, iimpahla zesikolo okanye usapho',
    newGoalPot: '+ Imbiza Entsha',
    createFirstPot: 'Yenza Imbiza Yokuqala',
    noPotsYetTitle: 'Akukho mbiza zokonga okwangoku',
    emptyPotsMsg: 'Awukenzi mbiza zokonga. Nokubeka i-R10 yokutya kuyalukhusela usapho.',
    goalLabel: ' Injongo:',
    savedPercentSuffix: '% egciniweyo',
    goalReachedLabel: 'Injongo ifezekisiwe',
    deposit: '+ Faka Imali',
    withdraw: 'Khupha',
    howItWorks: 'Indlela Ekunceda Ngayo i-MoniBuddy',
    howStep1Title: '01. Iimbiza Zokonga',
    howStep1Body: 'Gcina imali yokutya, isitokhwe nesikolo yahlukile kwimali yemihla ngemihla.',
    howStep2Title: '02. Isikhuseli Sikaxakeka',
    howStep2Body: 'Zibekele isikhuseli sakho ukuze uxakeka angakufaki koomashonisa.',
    howStep3Title: '03. Umlindi Wobuqhophololo',
    howStep3Body: 'Khangela iintlawulo zemali-mboleko ezirhanelwayo ngaphandle kwedatha.',
    howStep4Title: '04. Ukusebenza Ngaphandle Kwedatha',
    howStep4Body: 'Isebenza ngokupheleleyo ngaphandle kwe-intanethi kunye nesilinganisi se-USSD.',
    addToBuffer: '+ Yongeza Kwimali Kaxakeka',
    insufficientSafeCashError: 'Eli nani ligqitha imali yakho ekhuselekileyo ukusetyenziswa. Faka inani elincinci okanye ubhale imali engenileyo.',
    insufficientBufferError: 'Eli nani ligqitha imali ekwisikhuseli sikaxakeka.',
    insufficientPotError: 'Eli nani ligqitha imali ekhoyo kule mbiza.',

    cashLogTitle: 'Imali Engenayo & Ephumayo',
    cashLogSubtitle: 'Bhala imali engenayo nephumayo imihla ngemihla efowunini ngaphandle kwedatha',
    totalMoneyIn: 'Yonke Imali Engenileyo',
    totalMoneyInSub: 'Imivuzo, amatorho, intengiso kunye nezibonelelo',
    totalMoneyOut: 'Yonke Imali Ephumileyo',
    totalMoneyOutSub: 'Ukutya, iteksi, umbane kunye nesitokhwe',
    last7DaysTitle: 'Iintsuku Ezi-7 Ezidlulileyo',
    last7DaysSub: 'Ukuhamba kwemali imihla ngemihla',
    sevenDayWindow: 'Iintsuku ezi-7',
    peakDayPrefix: 'Usuku oluphezulu:',
    manualEntryTitle: 'Ukubhala Ngezandla',
    manualEntrySub: 'Chwetheza iinkcukacha kunye nomhla',
    moneyOutBtn: '- Imali Ephumayo',
    moneyInBtn: '+ Imali Engenayo',
    commonCategoriesLabel: 'Iindidi eziqhelekileyo:',
    descriptionLabel: 'Inkcazelo',
    descriptionPlaceholder: 'Yayiyeyantoni le mali?',
    amountRandLabel: 'Imali (R)',
    dateLabel: 'Umhla',
    saveEntryBtn: 'Gcina Ingxelo',
    recordedTransactionsTitle: 'Iingxelo Ezigciniweyo',
    recordedTransactionsSub: 'Ikhuselwe ngasese kule fowuni',
    recordsCountSuffix: 'iingxelo',
    noTransactionsTitle: 'Akukho ngxelo zibhaliweyo okwangoku',
    noTransactionsBody: 'Sebenzisa Ilizwi, i-Touch Pad, okanye Ukubhala ngentla ukuqala.',
    presetGroceries: 'Ukutya Nesonka',
    presetTaxi: 'Imali Yeteksi',
    presetElectricity: 'Umbane',
    presetSpaza: 'Isitokhwe se-Spaza',
    presetAirtime: 'I-Airtime / Idatha',
    presetWages: 'Umvuzo',
    presetHustle: 'Itorho / Ukuthengisa',
    presetGrant: 'Isibonelelo se-SASSA',

    voiceNavBtn: 'Ilizwi',
    voiceModalTitle: 'Ukubhala Ngelizwi & Touch Pad',
    voiceModalSub: 'Bhala imali ngelizwi, ngesitsotsi saseMzantsi, okanye nge-Touch Pad engenadatha',
    quickVoiceTouchTitle: 'Ukufaka Ngokukhawuleza Ngelizwi & Touch Pad',
    voiceTabLabel: 'Ilizwi',
    touchPadTabLabel: 'I-Touch Pad',
    speakTransactionBtn: 'Thetha Ngoku',
    doneSpeakingBtn: 'Ugqibile Ukuthetha',
    stopListeningBtn: 'Misa Ukumamela',
    transcribingOfflineMsg: 'Iguqula ilizwi efowunini ngaphandle kwedatha...',
    offlineVoicePackBtn: 'Iphakheji Yelizwi',
    downloadingProgressPrefix: 'Iyakhuphela',
    slangGuideShow: 'Amagama esitsotsi',
    slangGuideHide: 'Fihla amagama',
    slangGuideHeading: 'Amagama AseMzantsi Amkelwayo',
    listeningOfflineHint: 'Iyamamela ngaphandle kwedatha — cofa Ugqibile Ukuthetha',
    onDeviceAudioBadge: 'Ilizwi lefowuni',
    spokenPhraseLabel: 'Ibala elithethiweyo okanye elichwetheziweyo',
    spokenPhrasePlaceholder: 'Thetha okanye uchwetheze (umz. "taxi to town R32" okanye "two choco for bread")',
    voiceNetworkLimitationNote:
      'Ukuqondwa kwelizwi kwesikhangeli kufuna inethiwekhi ngaphandle kokuba ugcine iphakheji yelizwi engu-35 MB. Ungasoloko uchwetheza apha okanye usebenzise i-Touch Pad ngaphandle kwedatha.',
    noAmountParsedError:
      'Akukho mali yeeRandi ifumanekileyo. Xela inani (njenge "taxi to town R32" okanye "two choco") okanye usebenzise i-Touch Pad.',
    openTouchPadBtn: 'Vula i-Touch Pad',
    entriesReadyTitle: 'Ezilungele Ukugcinwa',
    recognizedSlangPrefix: 'Isitsotsi:',
    emptyPreviewTouchHint: 'Khetha udidi uze ucofe amaqhosha emali (+1 Choco, +1 Clipa) okanye amanani.',
    emptyPreviewVoiceHint: 'Cofa Thetha Ngoku, chwetheza inqaku, okanye uvule i-Touch Pad.',
    editInFormBtn: 'Hlela efomini',
    saveEntriesBtnPrefix: 'Gcina',
    saveEntriesBtnSuffix: 'Encwadini',
    savedEntriesNoticePrefix: 'Igcinwe kwincwadi yakho ekhuselweyo:',
    modeTouchActive: 'I-Touch Pad iyasebenza (0 MB idatha)',
    modeCloudSpeech: 'Ilizwi lesikhangeli (lisebenzisa inethiwekhi)',
    modeOnDeviceSpeech: 'Ilizwi lefowuni liyasebenza',
    modeOfflineSpeechReady: 'Ilizwi elingenadatha liyasebenza (0 MB)',
    modeOfflinePackAvailable: 'Iphakheji yelizwi engenadatha (35 MB)',
    packSavedStatus: 'Iphakheji igciniwe',
    packSavingPrefix: 'Igcina iphakheji',
    packWaitingWifi: 'Ilinde i-Wi-Fi',
    packDataProtected: 'Idatha ikhuselwe',
    touchStep1Category: '1. Cofa udidi',
    touchStep2Slang: '2. Cofa isitsotsi okanye iiRandi',
    touchZeroTyping: 'Akuchwethezwa · 0 MB idatha',
    touchTapAboveBtn: 'Cofa Imali Ngentla',
    touchAddItemPrefix: 'Faka',
    voicePackModalTitle: 'Kufuneka Iphakheji Yelizwi Engenadatha',
    voicePackModalSub: 'Ikhusela i-airtime nedatha yakho',
    voicePackModalBody:
      'Ukushicilela ilizwi ngaphandle kwe-intanethi kufuna iphakheji engu-35 MB. Xa sele igcinwe nge-Wi-Fi, isebenza rhoqo ngaphandle kwedatha.',
    voicePackCellularWarn:
      'Usebenzisa idatha yeselula. I-MoniBuddy ikuvimbele ukukhuphela ngokuzenzekelayo ukuze i-airtime yakho ingapheli.',
    voicePackOfflineWarn:
      'Awunayo i-intanethi ngoku. Cwangcisa ukukhuphela nge-Wi-Fi okanye usebenzise i-Touch Pad ngoku.',
    voicePackDownloadNow: 'Khuphela Ngoku (35 MB)',
    voicePackDownloadWifi: 'Khuphela Kamva nge-Wi-Fi',
    voicePackUseTouchPad: 'Sebenzisa i-Touch Pad',
    voicePackCancelDownload: 'Rhoxisa Ukukhuphela',
    voicePackUseTouchMeanwhile: 'Sebenzisa i-Touch Pad Okwangoku',

    loanShieldBadge: 'Isikhuseli Sakho · Ukuhlola Umthetho Weemboleko (NCA)',
    loanShieldTitle: 'Isikhuseli Sikaxakeka & Ukuhlola Imali-mboleko',
    loanShieldSubtitle:
      'Zibekele imali kaxakeka uze uvavanye nayiphi na imali-mboleko ngokwemida yomthetho we-National Credit Act (NCA).',
    yourEmergencySavings: 'Imali Yakho Kaxakeka',
    depositR100Btn: '+ Beka R100',
    depositR250Btn: '+ Beka R250',
    manageFundBtn: 'Lawula Ingxowa',
    burnRateTitle: 'Iindleko Zekhaya Ngeveki',
    burnRateSub: 'Imali encinci efunekayo ngeveki yokutya, iteksi nombane',
    perWeekSuffix: '/ iveki',
    twoWeekTargetTitle: 'Injongo Yeeveki Ezimbini',
    twoWeekTargetBodyPrefix: 'Gcina i-',
    twoWeekTargetBodySuffix: 'ukugquma iiveki ezimbini xa amatorho enqabile.',
    oneMonthTargetTitle: 'Injongo Yenyanga Epheleleyo',
    oneMonthTargetBodyPrefix: 'Gcina i-',
    oneMonthTargetBodySuffix: 'ukuthenga izinto zekhaya inyanga yonke ngaphandle kokuboleka.',
    loanQuoteTitle: 'Khangela Imali-mboleko Ngokomthetho WaseMzantsi Afrika (NCA)',
    loanQuoteSubtitle:
      'Faka imali oyibolekayo, iintlawulo kunye nemali efunwa ngumbolekisi okanye umashonisa ukuze ubone inzala yokwenene (APR) nokuba igqitha umthetho we-NCA Regulation 42.',
    loanPrincipalLabel: 'Imali Ebolekiweyo (R)',
    loanInputModeRepayment: 'Faka Imali Ebuyiswayo Yonke (R)',
    loanInputModeMonthlyRate: 'Faka Inzala Ngenyanga (%)',
    loanQuotedRepaymentLabel: 'Imali Yonke Efunwa Ngumbolekisi (R)',
    loanMonthlyRateLabel: 'Inzala Ngenyanga (%)',
    loanExtraFeesLabel: 'Iintlawulo ze-Admin / Zokuvula / Zokuqokelela (R)',
    loanTermDaysLabel: 'Ixesha Lokuhlawula (Iintsuku)',
    loanFirstLoanToggle: 'Imali-mboleko yokuqala kulo nyaka (umda u-5% ngenyanga vs 3%)',
    loanQuoteCardTitle: 'Okufunwa Ngumbolekisi',
    loanNcaCapCardTitle: 'Umda Womthetho (NCA Reg 42)',
    loanSelfBufferCardTitle: 'Isikhuseli Sakho Sikaxakeka',
    loanTotalRepayLabel: 'Imali Ebuyiswayo Yonke',
    loanTotalCostLabel: 'Inzala Neentlawulo',
    loanEffectiveAprLabel: 'Inzala Ngonyaka (APR)',
    loanStatusExceedsCap: 'Ngaphezu komda we-NCA kule kholkholitha. Jonga noLawuli Wezikweletu Ngaphambi kokutyikitya. // TODO-NATIVE-REVIEW',
    loanStatusWithinCap: 'Ingaphakathi Komda We-NCA — Qwalasela Ukuba Uyakwazi Ukuhlawula',
    loanOverchargeVsNcaLabel: 'Ngaphezulu komda we-NCA nge-',
    loanSavedWithBufferLabel: 'Imali oyigcinayo ngesikhuseli sakho',
    loanNcaCitation:
      'Umthombo: National Credit Act 34 ka-2005, Regulation 42 (GN R1080, Nov 2015 — umda wenzala ngu-5% ngenyanga kwimboleko yokuqala okanye u-3% kwezilandelayo, intlawulo yokuvula i-R165 + 10% engadluli ku-15%, nentlawulo yenkonzo i-R60 ngenyanga).',
    loanSaferAlternativesTitle: 'Iindlela Ezikhuselekileyo Phambi Kokuboleka',
    loanAlt1: 'Sebenzisa ingxowa yesitokfela esibhalisiweyo okanye imbiza yosapho kuqala.',
    loanAlt2: 'Qinisekisa ukuba umbolekisi ubhalisiwe kwa-NCR (0860 627 627) kwaye ungalokothi unikezele ngekhadi le-SASSA, i-ID okanye i-PIN.',
    loanAlt3: 'Cela isicwangciso sokuhlawula kancinci esikolweni, ekliniki okanye kumasipala ngaphandle kwenzala.',
    loanEducationalDisclaimer:
      'Isixhobo Sokufundisa Kuphela: Ezi zibalo zenzelwe ulwazi ngomthetho we-NCA kwaye azilulo icebiso elisemthethweni lezemali.',
    loanProtectionBannerTitle:
      'Ukhuseleko Lomthetho We-NCA — Ungalokothi Unikezele Ngekhadi Le-SASSA, ID Okanye I-PIN',
    loanProtectionBannerBody:
      'Ngaphantsi kweCandelo 90 no-133 lomthetho we-National Credit Act, lulwaphulo-mthetho ukuba umashonisa okanye umbolekisi agcine ikhadi lakho lebhanki, ikhadi le-SASSA, incwadi ye-ID okanye i-PIN yakho njengesibambiso, okanye afune imali yokuvula ngaphambili.',
    loanPredatoryWarningBannerTitle:
      'Isilumkiso Semali-mboleko Exhaphezayo — Igqitha Umda Womthetho We-NCA',
    loanPredatoryWarningBannerBodyPrefix:
      'Yima phambi kokutyikitya: Le mali-mboleko ikuhlawulisa i-',
    loanPredatoryWarningBannerBodySuffix:
      'ngaphezulu komda osemthethweni we-Regulation 42. Ungahlawuli mali yokuvula — xela imiqathango engekho mthethweni kwa-NCR ku-0860 627 627.',
    loanLegalCautionBannerTitle:
      'Qaphela Iindleko — Ingaphakathi Komthetho We-NCA, Kodwa Inenzala Neentlawulo',
    loanLegalCautionBannerBodyPrefix:
      'Nokuba ingaphakathi komda womthetho, le mali-mboleko ikubiza i-',
    loanLegalCautionBannerBodySuffix:
      'ngaphezulu ngenzala neentlawulo kunokusebenzisa u-R 0.00 kwisikhuseli sakho sikaxakeka.',

    scamGuardTitle: 'Umlindi Wobuqhophololo Nemiyalezo Yobuxoki',
    scamGuardSub:
      'Khangela ii-SMS ezirhanelwayo, iimboleko ze-WhatsApp, izaziso ze-SASSA kunye neentlawulo zokukhupha imali ngasese efowunini yakho',
    scamRuleBasedDisclaimerTitle: 'Uvavanyo Olusekelwe Kwimithetho — Qinisekisa Ngefowuni Rhoqo',
    scamRuleBasedDisclaimerBody:
      'Esi sixhobo sikhangela iimpawu zobuqhophololo ezaziwayo ngaphandle kwedatha. Amanqaku aphantsi AKATHELEKISI ukuba umyalezo ukhuselekile 100% — amaqhinga amatsha avela yonke imihla. Ungaze wabelane nge-PIN okanye i-OTP.',
    scamHighRiskBannerTitle:
      'Isilumkiso Esiphezulu Sobuqhophololo — Yima Ungathumeli Mali Okanye Ivawutsha',
    scamHighRiskBannerBody:
      'Iimpawu ezininzi zobuqhophololo zifunyenwe kwesi sicelo. Ungahlawuli mali yokuvula imboleko okanye umsebenzi, ungaze uxele i-PIN okanye i-OTP yakho, kwaye uqinisekise ngenombolo esemthethweni kuqala.',
    scamCautionBannerTitle:
      'Isilumkiso Sokulumka — Kukho Iimpawu Ezirhanelwayo Ezifunyenweyo',
    scamCautionBannerBody:
      'Yehlisa umoya uqinisekise ngokwakho: Abaqhophololi basebenzisa ukungxama neenombolo ezingaziwayo. Fowunela umntu ngqo phambi kokuhlawula.',
    scamPasteLabel: 'Ncamathisela i-SMS, Umyalezo we-WhatsApp okanye Isicelo sentlawulo',
    scamClearChecker: 'Cima konke',
    scamPlaceholder:
      'Ncamathisela umyalezo apha ukukhangela iintlawulo zokuvula imali-mboleko, iimpahla zomsebenzi, ubusela be-PIN/OTP okanye amakhonkco obuxoki e-SASSA...',
    scamPaymentDetailsTitle: 'Iinkcukacha Zentlawulo Nomamkeli (Ukuba uyafuna)',
    scamAddDetails: 'Faka iinkcukacha',
    scamHideDetails: 'Fihla iinkcukacha',
    scamRecipientNameLabel: 'Igama Lomamkeli okanye Ivenkile',
    scamRecipientIdLabel: 'Inombolo Yefowuni okanye ID',
    scamAmountRequestedLabel: 'Imali Ecelwayo (R)',
    scamPaymentTypeLabel: 'Udidi Lwentlawulo',
    scamOpLoanFee: 'Intlawulo Yokuvula Imali-mboleko Ngaphambili',
    scamOpCashOut: 'Ukukhupha Imali / eWallet / Ivawutsha',
    scamOpP2P: 'Ukuthumelela Umntu Imali',
    scamOpMerchant: 'Ukuthenga Iimpahla Okanye Inkonzo',
    scamAgentFeeLabelPrefix: 'Intlawulo Ye-Agent Ecelwayo',
    scamUnregisteredLenderCheck: 'Umbolekisi ongabhaliswanga kwa-NCR',
    scamNewRecipientCheck: 'Umamkeli omtsha / ongaziwayo',
    scamReadyTitle: 'Ilungele Ukukhangela Umyalezo Ngaphandle Kwedatha',
    scamReadyBody:
      'Ncamathisela nayiphi na i-SMS okanye i-WhatsApp ngentla. Umyalezo wakho uhlala uyimfihlo kwifowuni yakho kuphela.',
    scamVerifyBtn: 'Khangela Ukhuseleko Lwentlawulo',
    scamFraudReportBtn: 'Ingxelo Yobuqhophololo',
    scamHideReportBtn: 'Fihla Ingxelo',
    scamWarningSignsHeading: 'Iimpawu Zengozi Ezifunyenweyo',
    scamNoKnownPatternAdvice: 'Akukho phawu lwaziwayo lufunyenweyo — qinisekisa ngefowuni phambi kokuhlawula',
    scamBlockAdvice: 'UNGATHUMELI MALI — Thintela intlawulo',
    scamHelplinesTitle: 'Iinombolo Zedo Zobuqhophololo eMzantsi Afrika',
    scamHelplinesSub: 'Iinombolo ezisemthethweni zokuxela ubuqhophololo bebhanki okanye oomashonisa',
    scamModalHighRiskBadge: 'ISILUMKISO ESIPHEZULU SOBUQHOPHOLOLO',
    scamModalListenHeading: 'Mamela Isilumkiso Selizwi Phambi Kokuhlawula:',
    scamModalPlayBtn: 'Dlala Isilumkiso Selizwi',
    scamModalStopBtn: 'Misa Isilumkiso Selizwi',
    scamModalMandatoryChecks: 'Amanyathelo Okhuseleko Anyanzelekileyo:',
    scamModalAckCheckbox:
      'Ndiqinisekisile ngokufowunela inombolo esemthethweni kwaye ndiyaqonda ukuba imali okanye ivawutsha ayibuyiswa.',
    scamModalCancelBlockBtn: 'Rhoxisa & Thintela Intlawulo (Kuyacetyiswa)',
    scamModalProceedBtn: 'Ndiqinisekisile Ngqo — Qhubeka',

    syncBadge: 'Ukugcinwa Efowunini · Isilinganisi se-USSD',
    syncTitle: 'Imo Engenadatha & Isilinganisi se-USSD',
    syncSub:
      'Incwadi yakho isebenza ngaphandle kwedatha kwifowuni yakho. Zama isilinganisi se-*120*6664# esibonisa indlela iifowuni zamaqhosha ezisebenza ngayo.',
    ussdSimNoticeTitle: 'Isilinganisi se-USSD Sangaphakathi (Prototype)',
    ussdSimNoticeBody:
      'Ikhowudi ethi *120*6664# kwesi sikrini sisilinganisi esisebenza ngaphandle kwedatha kunye nencwadi yakho yefowuni — ayikabi yikhowudi yenethiwekhi yeselula.',
    savedTransactionsLabel: 'Iingxelo Ezikhuselweyo',
    activeSavingsPotsLabel: 'Iimbiza Ezisebenzayo',
    verifyLocalLedgerBtn: 'Qinisekisa & Gcina Incwadi Ekhuselweyo',
    verifyingLocalLedgerBtn: 'Iyakhusela kwaye igcina efowunini...',
    offlineAirplaneGuarantee:
      'Imali yakho, iimbiza kunyeembali zisebenza nakwi-Airplane Mode ngaphandle kwe-airtime.',
    installHomeScreenHint:
      'Faka i-MoniBuddy kwisikrini sasekhaya ukuze ivuleke nanini na ngaphandle kwedatha.',
    ussdShortcodeCardTitle: 'Umbono we-USSD Weefowuni Zamaqhosha (*120*6664#)',
    ussdShortcodeCardBody:
      'Vavanya amaqhosha ekunene ukubona indlela abarhwebi abajonga ngayo imali okanye babeke i-R50 kwisikhuseli sikaxakeka.',
    launchSimulatorBtn: 'Vula Isilinganisi se-USSD',
    copyShortcodeBtn: 'Khuphela *120*6664#',
    copiedShortcodeBtn: 'Ikhutshelwe',
    ussdSimulatorTag: 'ISILINGANISI · IDEMO ENGENADATHA',
    ussdOpenMenuBtn: 'Qala Isilinganisi *120*6664#',
    ussdCloseMenuBtn: 'Vala Imenyu',
    ussdSendBtn: 'Thumela',

    techBadge: 'Ukwakhiwa, Uzinzo & Ukhuseleko',
    technicalBriefTitle: 'Indlela Esebenza Nayo & Ukukhula kwe-MoniBuddy',
    techSubtitle:
      'Yakhelwe abantu baseMzantsi Afrika abanamangeniso angaqhelekanga: simahla kubasebenzisi, ayityi datha, kwaye ikhuselwe nge-AES-256.',
    techCap1Title: 'Ukugcinwa Okukhuselweyo nge-AES-256-GCM',
    techCap1Body:
      'Incwadi yakho ikhuselwa efowunini nge-WebCrypto AES-256-GCM kunye ne-PBKDF2-SHA256 (100,000) kunye neefonti ezigcinwe ngaphakathi.',
    techCap2Title: 'Ukukhuselwa Kwe-Airtime Nedatha',
    techCap2Body:
      'Akukho nxibelelwano lwangaphandle xa uvula usetyenziso. Iphakheji yelizwi engu-35 MB ayikhutshelwa ngedatha yeselula ngaphandle kwemvume yakho.',
    techCap3Title: 'Ukufikeleleka Ngeelwimi Ezi-5',
    techCap3Body:
      'Amagama amakhulu (A+), isikhokelo selizwi, iilwimi ezi-5 zaseMzantsi Afrika kunye ne-Touch Pad engenakuchwetheza.',
    techCap4Title: 'Isikhuseli Sobuqhophololo & Umthetho we-NCA',
    techCap4Body:
      'Ukukhangelwa kobuqhophololo kunye nemida yenzala ye-NCA Regulation 42 kwenzeka ngaphakathi efowunini yakho.',
    sustainabilityTitle: 'Uzinzo Loshishino Ngaphandle Kokuhlawulisa Umsebenzisi',
    sustainabilitySubtitle:
      'Indlela i-MoniBuddy ehlala isimahla ngayo eluntwini ngelixa ikhula ngokoshishino (B2B2C)',
    sustModel1Title: '1. Inkxaso Yeebhanki Namanethiwekhi (B2B2C)',
    sustModel1Body:
      'Iibhanki, iinkampani ze-inshurensi kunye namanethiwekhi zixhasa i-PWA/USSD engenadatha ukunceda abantu bonge ngokukhuselekileyo.',
    sustModel2Title: '2. Izitokfela Ezibhalisiweyo Neenkooperativu',
    sustModel2Body:
      'Ukusebenzisa komntu ngamnye kusimahla rhoqo. Izitokfela ezikhulu zihlawula i-R49 ngenyanga kwiingxelo zamaqela.',
    sustModel3Title: '3. Intsebenziswano Neevenkile Zokutya Ngokuzithandela',
    sustModel3Body:
      'Imivuzo esemthethweni xa abasebenzisi bethenga ukutya ngeembiza zabo — akukho zintengiso zoomashonisa kwaye akukho datha ithengiswayo.',
    dignityTitle: 'Isibophelelo Sethu Kwisidima Sezemali',
    dignitySubtitle: 'Imigaqo engagungqiyo ekhusela imali yekhaya lakho',
    dignity1Title: 'Simahla Rhoqo Ebantwini',
    dignity1Body: 'Iimbiza, isikhuseli sikaxakeka kunye nesikhangeli sobuqhophololo zisimahla.',
    dignity2Title: 'Akuthengiswa Nkcukacha',
    dignity2Body: 'Asithengisi iimbali zakho zemali kwaye asibonisi zintengiso zoomashonisa.',
    dignity3Title: 'Yakhelwe Amatorho Ne-Spaza',
    dignity3Body: 'Yenzelwe imivuzo yeveki, urhwebo lwe-spaza, izitokfela kunye nesitsotsi saseMzantsi.',

    privacyBadge: 'Ukhuseleko lwe-POPIA · AES-256-GCM Efowunini',
    privacyGuaranteeTitle: 'Ubumfihlo Bakho Nokulawula Idatha',
    privacySubtitle: 'Ubunini obupheleleyo kwincwadi yakho ekhuselweyo, ii-backup kunye nokucima.',
    privacyMainHeading: 'Iingxelo Zakho Zihlala Zikhuselwe Ezandleni Zakho',
    privacyMainBody:
      'I-MoniBuddy ayiceli ziphasiwedi zebhanki okanye i-ID. I-akhawunti nganye kule fowuni yahluliwe kwaye ikhuselwe.',
    privacyPoint1Title: '01. Ukhuseleko lwe-PBKDF2-SHA256 + AES-256-GCM',
    privacyPoint1Body:
      'I-PIN yakho ikhuselwe nge-PBKDF2 (100,000) kwaye incwadi yakho ikhuselwe nge-AES-256-GCM ukuze amanani akho angabonakali.',
    privacyPoint2Title: '02. Akukho Zintengiso Okanye Abacuphi',
    privacyPoint2Body: 'Akukho zikripthi zokucupha okanye iifonti zangaphandle. Akukho mntu ubona imali yakho.',
    privacyPoint3Title: '03. I-Backup Ephathekayo Nokucima Ngoko Nangoko',
    privacyPoint3Body:
      'Khuphela ifayile ye-backup phambi kokutshintsha ifowuni, buyisela i-backup okanye ucime konke ngokucofa kanye.',
    downloadBackupBtn: 'Khuphela i-Backup (.json)',
    restoreBackupBtn: 'Buyisela i-Backup',
    eraseLedgerBtn: 'Cima Idatha Yencwadi',
    eraseConfirmTitle: 'Cima Zonke Iingxelo Zencwadi?',
    eraseConfirmSub: 'Eli nyathelo alinakubuyiselwa umva',
    eraseConfirmBody:
      'Oku kuza kucima ngokupheleleyo imali yokuqala, iimbiza, isikhuseli sikaxakeka kunye nembali yale akhawunti kule fowuni.',
    eraseEverythingBtn: 'Cima Konke',
    backupDownloadedMsg: 'Ifayile ye-backup ikhutshelwe efowunini yakho. Yigcine iyimfihlo.',
    backupRestoredMsg: 'I-backup yakho ibuyiselwe kwaye yakhuselwa kwincwadi yakho.',
    backupInvalidMsg: 'Ifayile ye-backup ayifundeki. Nceda ukhethe ifayile ye-MoniBuddy .json echanekileyo.',
    ledgerErasedMsg: 'Zonke iingxelo zale akhawunti zicinyiwe kule fowuni.',

    modalCreatePotTitle: 'Yenza Imbiza Entsha Yokonga',
    modalChooseIcon: 'Khetha Umfanekiso',
    modalSavingForLabel: 'Wongela ntoni?',
    modalSavingForPlaceholder: 'umz. Ukutya, Isitokhwe se-spaza, Izihlangu zesikolo',
    modalTargetAmountLabel: 'Imali Ekujoliswe Kuyo (R)',
    modalCategoryLabel: 'Udidi',
    modalCreatePotSubmit: 'Yenza Imbiza',
    modalPutMoneyIn: 'Faka Imali Embizeni',
    modalTakeMoneyOut: 'Khupha Imali Embizeni',
    modalCurrentlyInPot: 'Okukhoyo kule mbiza:',
    modalAvailableSafeCash: 'Imali ekhoyo ongayibeka:',
    modalSaveToPotBtn: 'Gcina Embizeni',
    modalTakeOutCashBtn: 'Khupha Imali',
    modalBufferTitle: 'Isikhuseli Sikaxakeka',
    modalBufferSub: 'Ingxowa yekhaya lakho',
    modalUseBufferBtn: '- Sebenzisa Imali Kaxakeka',
    modalCurrentBufferLabel: 'Okukhoyo kwisikhuseli:',
    modalReasonOptionalLabel: 'Isizathu (Ukuba uyafuna)',
    modalReasonPlaceholder: 'umz. Ikliniki, uhambo olungxamisekileyo',
    modalSaveToFundBtn: 'Gcina Engxoweni',
    modalWithdrawCashBtn: 'Khupha Imali',
    pwaInstallOfflineApp: 'Faka Usetyenziso Olungenadatha',
    pwaInstallOnIphone: 'Faka kwi-iPhone',
    pwaIosGuideTitle: 'Gcina i-MoniBuddy Kwisikrini Sasekhaya',
    pwaIosStep1: 'Cofa uphawu lokwabelana (Share) kwi-Safari.',
    pwaIosStep2: 'Cofa Add to Home Screen ukuvula i-MoniBuddy ngaphandle kwedatha.',
    pwaGotIt: 'Ndiyifumene',

    audioGuides: {
      overview: {
        title: 'Imali Ekhuselekileyo & Iimbiza',
        content:
          'Imali Ekhuselekileyo phezulu ibonisa imali ongayisebenzisa namhlanje ungachukumisi iimbiza zokutya kunye nesikhuseli sikaxakeka.',
        keyAdvice: 'Icebiso: Ukubeka i-R20 ngeveki kuyalukhusela usapho lwakho.'
      },
      income_expenses: {
        title: 'Imali Engenayo Nephumayo',
        content:
          'Bhala imali ngelizwi, nge-Touch Pad engenadatha okanye ngesandla. Ukucima ingxelo kubuyisela izibalo umva ngokuzenzekelayo.',
        keyAdvice: 'Icebiso: Sebenzisa i-Touch Pad xa ungenayo i-intanethi.'
      },
      buffer_credit: {
        title: 'Isikhuseli Sikaxakeka & Umthetho we-NCA',
        content:
          'Khangela nayiphi na imali-mboleko ngokwemida yomthetho we-National Credit Act kunye nesikhuseli sakho.',
        keyAdvice: 'Icebiso: Abambolekisi abasemthethweni abavumelekanga ukubiza ngaphezu ko-5% ngenyanga kwimboleko yokuqala.'
      },
      scam_guard: {
        title: 'Umlindi Wobuqhophololo',
        content:
          'Ncamathisela i-SMS okanye i-WhatsApp ukukhangela ubuqhophololo ngaphandle kwedatha. Qinisekisa ngefowuni rhoqo.',
        keyAdvice: 'Icebiso: Ungaze uhlawule imali yokuvula imboleko ngevawutsha.'
      },
      sync_2g: {
        title: 'Imo Engenadatha & Isilinganisi se-USSD',
        content:
          'Incwadi yakho igcinwe kwifowuni yakho. Zama isilinganisi se-USSD ukubona imenyu yeefowuni zamaqhosha.',
        keyAdvice: 'Icebiso: Faka usetyenziso kwisikrini sasekhaya.'
      },
      technical_brief: {
        title: 'Indlela Esebenza Ngayo & Uzinzo',
        content:
          'I-MoniBuddy ikhusela idatha yakho, ikhusela incwadi yakho nge-AES-256 kwaye ihlala isimahla kubasebenzisi.',
        keyAdvice: 'Icebiso: Iinkcukacha zakho zihlala kwifowuni yakho kuphela.'
      },
      privacy_legal: {
        title: 'Ubumfihlo & Ii-Backup',
        content:
          'I-PIN yakho ikhuselwe nge-PBKDF2 kwaye incwadi ikhuselwe nge-AES-256-GCM. Khuphela i-backup phambi kokutshintsha ifowuni.',
        keyAdvice: 'Icebiso: Gcina ifayile ye-backup kwindawo ekhuselekileyo.'
      }
    },
    authErrLedgerDecryptFailed: 'Failed to decrypt secure ledger. Incorrect PIN or corrupted data. // TODO-NATIVE-REVIEW',
    warningUnencryptedLedger: 'Your data is NOT encrypted on this device because WebCrypto is unavailable. // TODO-NATIVE-REVIEW',
    authPinLengthHint: 'Recommended: 6 or more digits // TODO-NATIVE-REVIEW',
    welcomeModalTitle: 'Welcome to MoniBuddy // TODO-NATIVE-REVIEW',
    welcomeModalStep1Title: '1. Safe-to-Spend Balance // TODO-NATIVE-REVIEW',
    welcomeModalStep1Body: 'Your Safe-to-Spend amount shows cash you can use today after protecting your savings pots and emergency buffer. // TODO-NATIVE-REVIEW',
    welcomeModalStep2Title: '2. Log Income & Expenses // TODO-NATIVE-REVIEW',
    welcomeModalStep2Body: 'Record cash easily using offline voice recognition, the zero-data Touch Pad, or manual entry. // TODO-NATIVE-REVIEW',
    welcomeModalStep3Title: '3. Emergency Buffer & Scam Guard // TODO-NATIVE-REVIEW',
    welcomeModalStep3Body: 'Build your household safety cushion and check suspicious SMS or WhatsApp messages offline. // TODO-NATIVE-REVIEW',
    welcomeModalSkip: 'Skip // TODO-NATIVE-REVIEW',
    welcomeModalNext: 'Next // TODO-NATIVE-REVIEW',
    welcomeModalFinish: 'Get Started // TODO-NATIVE-REVIEW',
    scamGuardDisclaimer: 'Note: Rule-based scam detection is heuristic and local. A SAFE result does not guarantee a message or person is safe — new scams appear daily. Always verify by phone before paying. // TODO-NATIVE-REVIEW',
    loanAnnualisedCost: 'Annualised cost (simple) // TODO-NATIVE-REVIEW',
    loanPrincipalMinError: 'Principal amount must be at least R100. // TODO-NATIVE-REVIEW',
    loanTermMinError: 'Term must be between 1 and 180 days. // TODO-NATIVE-REVIEW',
    ussdDemoNotice: 'Demo USSD transaction simulated for offline testing. // TODO-NATIVE-REVIEW',
    ussdDemoBadge: 'USSD Demo // TODO-NATIVE-REVIEW',
    sourceLabel: 'Source // TODO-NATIVE-REVIEW',
    lastVerifiedLabel: 'Last Verified // TODO-NATIVE-REVIEW',
    unverifiedBadge: 'Unverified, check with NCR // TODO-NATIVE-REVIEW',
    voiceOfflineNote: 'Voice recognition requires a network connection or downloaded voice pack. Typing and touch pad always work offline. // TODO-NATIVE-REVIEW'
  },

  st: {
    appName: 'MoniBuddy',
    tagline: 'Taolo e Bonolo ea Chelete e Sebetsang Ntle le Datha',

    cancel: 'Hlakola',
    close: 'Koala',
    save: 'Boloka',
    clear: 'Hlakola',
    remove: 'Tlosa',
    copy: 'Kopitsa',
    copied: 'E kopisitsoe',
    hide: 'Pata likeletso',
    show: 'Bontša likeletso',
    listen: 'Mamela',
    stopAudio: 'Emisa Lentsoe',
    audioGuide: 'Mamela',
    audioGuideActive: 'Ea bua...',
    audioGuideTranscript: 'Tataiso ea Lentsoe',
    largeTextLabel: 'A+',
    largeTextTitle: 'Hodisa mongolo',
    languageLabel: 'Puo',
    lockAndSignOut: 'Notlela & Tsoa',
    signedInAs: 'U kene joalo ka',
    offlineBanner: 'Ntle le inthanete · E patiloe fonong ena',
    localLedgerActive: 'Buka e sirelelitsoeng ea sebetsa',
    offlineSavedOnPhone: 'Ntle le datha · E bolokiloe fonong',
    encryptedAesBadge: 'E sirelelitsoe ka AES-256-GCM fonong',
    savedAtPrefix: 'E bolokiloe ka',
    moreMenu: 'Tse Ling',
    myMoneySection: 'Chelete ea Ka',
    guidePrivacySection: 'Tataiso & Lekunutu',

    navOverview: 'Kakaretso & Lipitsa',
    navIncomeExpenses: 'Chelete e Kenang & e Tsoang',
    navBufferCredit: 'Tšohanyetso & Likoloto',
    navScamGuard: 'Hlahloba Bomenemene',
    nav2gSync: ' Setsi sa Teko sa USSD',
    navTechnicalBrief: 'Kamoo e Sebetsang',
    navPrivacyLegal: 'Lekunutu & Tšireletso',
    navShortPots: 'Lipitsa',
    navShortCash: 'Chelete',
    navShortLoan: 'Likoloto',
    navShortScam: 'Bomenemene',

    authHeroBadge: 'Buka ea Chelete ea Afrika Boroa · E Sebetsa Ntle le Datha',
    authHeroBody:
      'Arola chelete ea letsatsi le letsatsi ho ea lijo, sekolo, thepa ea spaza le letlole la tšohanyetso — li sirelelitsoe fonong ea hau ntle le ho hloka datha.',
    authFeature1Title: 'E Sirelelitsoe ka ho Otloloha Fonong ea Hau',
    authFeature1Body:
      'Buka ea hau e sirelelitsoe ka AES-256-GCM le PIN ea hau (PBKDF2 100,000). E sebetsa esita le ha u se na airtime.',
    authFeature2Title: 'Thebe ea Bomenemene & Molao oa NCA',
    authFeature2Body:
      'Hlahloba litefiso tsa likoloto tsa WhatsApp tse belaetsang, melaetsa ea bohata ea SASSA le melao ea NCA ntle le datha.',
    authFeature3Title: 'Ha ho Li-password tsa Banka kapa ID',
    authFeature3Body:
      'Akhaonto ka ’ngoe fonong ea lelapa e arotsoe ’me e notleloa metsotsoana e 60 ka mor’a liteko tse 5 tse fosahetseng.',
    authSignInTab: 'Kena',
    authRegisterTab: 'Theha Akhaonto',
    authSignInTitle: 'Bula Buka ea Hau e Sirelelitsoeng',
    authSignInSubtitle: 'Kenya nomoro ea hau ea mohala le PIN ho bula buka ea hau.',
    authRegisterTitle: 'Theha Akhaonto ea Hau Fonong',
    authRegisterSubtitle: 'Iketsetse buka ea chelete ea lekunutu ka metsotsoana. Ha ho hlokahale datha.',
    authNoAccountYet: 'Ha ho akhaonto e seng e entsoe fonong ena.',
    authCreateOneLink: 'Theha hona joale →',
    authMobileOrEmailLabel: 'Nomoro ea Mohala kapa Email',
    authMobileLabel: 'Nomoro ea Mohala (SA)',
    authPinLabel: 'PIN ea Tšireletso',
    authShowPin: 'Bontša PIN',
    authHidePin: 'Pata PIN',
    authPinPlaceholder: 'Linomoro tse 4 ho isa ho 8',
    authRememberPhone: 'Hopola nomoro ea ka fonong ena',
    authUnlockButton: 'Bula Buka ea Chelete',
    authUnlockingButton: 'Ea bula...',
    authFullNameLabel: 'Lebitso le Feletseng',
    authFullNamePlaceholder: 'Lebitso la hau',
    authCreatePinLabel: 'Theha PIN (4–8)',
    authConfirmPinLabel: 'Netefatsa PIN',
    authEmailOptionalLabel: 'Email (Haeba u batla)',
    authEmailOptionalPlaceholder: 'Boitsebiso feela',
    authCreateAccountButton: 'Theha Akhaonto & Sireletsa',
    authCreatingButton: 'Ea boloka...',
    authFooterGuarantee: 'E sirelelitsoe ka AES-256-GCM · PBKDF2-SHA256 PIN · E latela POPIA',
    authFooterLeft: 'MoniBuddy Buka ea Chelete le Poloko',
    authFooterRight: 'E sebetsa ntle le datha 100%',
    authAudioSignIn:
      'Rea u amohela hape ho MoniBuddy. Kenya nomoro ea hau ea mohala le PIN ho bula buka ea hau ea chelete.',
    authAudioRegister:
      'Rea u amohela ho MoniBuddy. Kenya lebitso la hau, nomoro ea mohala le PIN ho theha buka ea chelete e sirelelitsoeng fonong ena ntle le datha.',
    authErrMissingCredentials: 'Ka kopo kenya nomoro ea mohala le PIN.',
    authErrIncorrectCredentials: 'Nomoro ea mohala kapa PIN ha ea nepahala.',
    authErrPinLockedPrefix: 'Liteko tse ngata tse hlolehilyeng. Leka hape ka mor’a metsotsoana e',
    authErrPinLockedSuffix: '.',
    authErrAttemptsLeftPrefix: 'Liteko tse setseng pele e notleloa:',
    authErrPinMismatch: 'Li-PIN tse peli ha li tšoane.',
    authErrMissingName: 'Ka kopo kenya lebitso la hau le feletseng.',
    authErrInvalidPhone: 'Ka kopo kenya nomoro e nepahetseng ea mohala ea Afrika Boroa.',
    authErrInvalidPinFormat: 'PIN e tlameha ho ba linomoro tse 4 ho isa ho 8.',
    authErrAccountExists: 'Nomoro ena ea mohala e se e ntse e le teng fonong ena. Ka kopo kena.',
    authGoogleButton: 'Tsoela pele ka Google le Polokelo',
    googleBackupActive: 'Polokelo ea Maru ea Google ea Sebetsa',
    googleBackupSync: 'Bapisa Polokelo ho Google',
    googleLoginSuccess: 'Keno ka Google ka katleho. Lintlha li bolokiloe.',
    googleLoginError: 'Ho kena ka Google ho hlakotsoe kapa email ha ea nepahala.',
    googleEmailPrompt: 'Kenya aterese ea hau ea email ea Google ho kena le ho boloka lintlha:',
    googleDetailsModalTitle: 'Ho kena ka Google le Lintlha tsa Ntle ho Marang-rang',
    googleDetailsModalSubtitle: 'Kenya lengolo ea hau ea Google le lintlha ho lumella ho kena ntle le marang-rang.',
    googleDetailsEmailLabel: 'Aterese ea Email ea Google',
    googleDetailsNameLabel: 'Lebitso le Feletseng',
    googleDetailsPhoneLabel: 'Nomoro ea Mohala (ho kena ntle ho marang-rang)',
    googleDetailsPinLabel: 'PIN ea Ntle ho Marang-rang (ditshehetso tse 4-6)',
    googleDetailsConfirmPinLabel: 'Netefatsa PIN ea Ntle ho Marang-rang',
    googleDetailsSubmit: 'Boloka mme U qale Lintlha tsa Ntle ho Marang-rang',

    safeToSpend: 'CHELETE E BOLOKEHILENG HO SEBELISOA KAJENO',
    safeToSpendDesc:
      'Ena ke chelete eo u ka e sebelisang kajeno ntle le ho ama lipitsa tsa lijo, sekolo le letlole la tšohanyetso.',
    overspentWarningTitle: 'U Sebelisitse ho Feta Chelete e Teng',
    overspentWarningDesc:
      'Litsenyehelo tsa hau le lipitsa li feta chelete e keneng. Ngola chelete e keneng, fokotsa litsenyehelo kapa ntša pitseng.',
    startingBalance: 'Chelete eo u qalang ka eona (R)',
    setStartingCash: 'Beha Chelete ea Qalo',
    updateStartingCash: 'Fetola Chelete ea Qalo',
    startingCashFirstTimePrompt: 'Qala buka ea hau: U na le chelete e kae letsohong kapa bankeng hona joale?',
    startingCashEditPrompt: 'Kenya chelete eohle eo u nang le eona hona joale:',
    saveStartingBalance: 'Boloka Chelete',
    startingTotal: 'CHELETE EA QALO',
    income: 'CHELETE E KENANG',
    expenses: 'CHELETE E TSOANG',
    goalSavings: 'LIPITSA TSA POLOKO',
    emergencyBuffer: 'LETLOLE LA TŠOHANYETSO',
    forecastReadyPrefix: 'Khakanyo ea mafelo a khoeli: Ka lebelo leo u sebelisang chelete ka lona, u tla qeta khoeli u na le',
    forecastReadySuffix: 'e bolokehileng.',
    forecastPendingTitle: 'Khakanyo ea khoeli:',
    forecastPendingBody: 'Ngola litsenyehelo tsa letsatsi bonyane matsatsi a 5 ho bula khakanyo.',
    zeroInterestSelfFunded: 'Ha ho tsoala · U ipoloketse',
    bufferCoversPrefix: 'E koahela hoo e ka bang:',
    bufferCoversWeeksUnit: 'libeke',
    bufferCoversSuffix: 'tsa litlhoko tsa bohlokoa tsa lelapa.',
    bufferEmptyPrompt: 'Beha R50 kapa R100 ka thoko ho qoba likoloto tsa bomashonisa.',
    activePotsSuffix: 'lia sebetsa',
    potsSummaryDesc: 'Chelete e behetsoeng lijo, sekolo, thepa ea spaza le lelapa.',
    microSavingsPots: 'Lipitsa tsa Ka tsa Poloko',
    potsSubtitle: 'Beha chelete ka thoko bakeng sa lijo, thepa ea spaza, junifomo ea sekolo kapa lelapa',
    newGoalPot: '+ Pitsa e Ncha',
    createFirstPot: 'Etsa Pitsa ea Pele',
    noPotsYetTitle: 'Ha ho lipitsa tsa poloko hajoale',
    emptyPotsMsg: 'Ha u so etse lipitsa tsa poloko. Esita le ho beha R10 ea lijo ho sireletsa lelapa.',
    goalLabel: 'Sepheo:',
    savedPercentSuffix: '% e bolokiloeng',
    goalReachedLabel: 'Sepheo se fihletsoe',
    deposit: '+ Kenya Chelete',
    withdraw: 'Ntša',
    howItWorks: 'Kamoo MoniBuddy e u Thusang Kateng',
    howStep1Title: '01. Lipitsa tsa Poloko',
    howStep1Body: 'Beha chelete ea lijo, thepa le sekolo ka thoko ho chelete ea letsatsi.',
    howStep2Title: '02. Letlole la Tšohanyetso',
    howStep2Body: 'Iketsetse letlole la hau hore maemo a tšohanyetso a se u kenye ho bomashonisa.',
    howStep3Title: '03. Molebeli oa Bomenemene',
    howStep3Body: 'Hlahloba litefiso tsa likoloto tse belaetsang ntle le datha fonong ea hau.',
    howStep4Title: '04. Tšebeliso Ntle le Datha',
    howStep4Body: 'E sebetsa ka botlalo ntle le inthanete hammoho le setsi sa teko sa USSD.',
    addToBuffer: '+ Kenya Letloleng la Tšohanyetso',
    insufficientSafeCashError: 'Chelete ena e feta chelete ea hau e bolokehileng ho sebelisoa. Kenya chelete e nyane kapa ngola chelete e keneng.',
    insufficientBufferError: 'Chelete ena e feta letlole la hau la tšohanyetso.',
    insufficientPotError: 'Chelete ena e feta chelete e ka pitseng ena.',

    cashLogTitle: 'Chelete e Kenang & e Tsoang',
    cashLogSubtitle: 'Ngola chelete e kenang le e tsoang letsatsi le letsatsi fonong ntle le datha',
    totalMoneyIn: 'Chelete Eohle e Keneng',
    totalMoneyInSub: 'Meputso, likoropo, thekiso le lithuso tsa mmuso',
    totalMoneyOut: 'Chelete Eohle e Tsoileng',
    totalMoneyOutSub: 'Lijo, thekesi, motlakase le thepa',
    last7DaysTitle: 'Matsatsi a 7 a Fetileng',
    last7DaysSub: 'Phallo ea chelete ea letsatsi',
    sevenDayWindow: 'Matsatsi a 7',
    peakDayPrefix: 'Letsatsi le holimo:',
    manualEntryTitle: 'Ho Ngola ka Letsoho',
    manualEntrySub: 'Tlatsa lintlha le letsatsi',
    moneyOutBtn: '- Chelete e Tsoang',
    moneyInBtn: '+ Chelete e Kenang',
    commonCategoriesLabel: 'Mekhahlelo e tloaelehileng:',
    descriptionLabel: 'Tlhaloso',
    descriptionPlaceholder: 'Chelete ee e ne e le ea eng?',
    amountRandLabel: 'Chelete (R)',
    dateLabel: 'Letsatsi',
    saveEntryBtn: 'Boloka Tlaleho',
    recordedTransactionsTitle: 'Litlaleho tse Ngolisitsoeng',
    recordedTransactionsSub: 'E sirelelitsoe ka lekunutu fonong ena',
    recordsCountSuffix: 'litlaleho',
    noTransactionsTitle: 'Ha ho litlaleho tse ngolisitsoeng hajoale',
    noTransactionsBody: 'Sebelisa Lentsoe, Touch Pad, kapa Ho Ngola ka holimo ho qala.',
    presetGroceries: 'Lijo le Bohobe',
    presetTaxi: 'Chelete ea Thekesi',
    presetElectricity: 'Motlakase',
    presetSpaza: 'Thepa ea Spaza',
    presetAirtime: 'Airtime / Datha',
    presetWages: 'Moputso',
    presetHustle: 'Koropo / Thekiso',
    presetGrant: 'Thuso ea SASSA',

    voiceNavBtn: 'Lentsoe',
    voiceModalTitle: 'Ho Ngola ka Lentsoe & Touch Pad',
    voiceModalSub: 'Ngola chelete ka lentsoe, maleme a Mzansi, kapa Touch Pad e se nang datha',
    quickVoiceTouchTitle: 'Ho Kenya Kapele ka Lentsoe & Touch Pad',
    voiceTabLabel: 'Lentsoe',
    touchPadTabLabel: 'Touch Pad',
    speakTransactionBtn: 'Bua Hona Joale',
    doneSpeakingBtn: 'Qetile ho Bua',
    stopListeningBtn: 'Emisa ho Mamela',
    transcribingOfflineMsg: 'E fetolela lentsoe fonong ntle le datha...',
    offlineVoicePackBtn: 'Sephutheloana sa Lentsoe',
    downloadingProgressPrefix: 'Ea khoasolla',
    slangGuideShow: 'Tataiso ea slang',
    slangGuideHide: 'Pata slang',
    slangGuideHeading: 'Mantsoe a Mzansi a Tšehetsoang',
    listeningOfflineHint: 'Ea mamela ntle le datha — tobetsa Qetile ho Bua',
    onDeviceAudioBadge: 'Lentsoe la fono',
    spokenPhraseLabel: 'Polelo e builoeng kapa e ngotsoeng',
    spokenPhrasePlaceholder: 'Bua kapa ngola (mohl. "taxi to town R32" kapa "two choco for bread")',
    voiceNetworkLimitationNote:
      'Lentsoe la sebatli le hloka marang-rang ntle le haeba sephutheloana sa 35 MB se bolokiloe. U ka ngola mona kapa ua sebelisa Touch Pad ntle le datha.',
    noAmountParsedError:
      'Ha ho chelete ea Ranta e fumanoeng. Bolela chelete (joalo ka "taxi to town R32" kapa "two choco") kapa sebelisa Touch Pad.',
    openTouchPadBtn: 'Bula Touch Pad',
    entriesReadyTitle: 'Tse Loketseng ho Bolokoa',
    recognizedSlangPrefix: 'Slang:',
    emptyPreviewTouchHint: 'Khetha lebokose la mokhahlelo ebe u tobetsa chelete (+1 Choco, +1 Clipa) kapa linomoro.',
    emptyPreviewVoiceHint: 'Tobetsa Bua Hona Joale, ngola molaetsa, kapa fetohela ho Touch Pad.',
    editInFormBtn: 'Fetola foromong',
    saveEntriesBtnPrefix: 'Boloka',
    saveEntriesBtnSuffix: 'Bukeng',
    savedEntriesNoticePrefix: 'E bolokiloe bukeng ea hau e sirelelitsoeng:',
    modeTouchActive: 'Touch Pad ea sebetsa (0 MB datha)',
    modeCloudSpeech: 'Lentsoe la sebatli (le sebelisa inthanete)',
    modeOnDeviceSpeech: 'Lentsoe la fono lea sebetsa',
    modeOfflineSpeechReady: 'Lentsoe le se nang datha lea sebetsa (0 MB)',
    modeOfflinePackAvailable: 'Sephutheloana sa lentsoe (35 MB)',
    packSavedStatus: 'Sephutheloana se bolokiloe',
    packSavingPrefix: 'E boloka sephutheloana',
    packWaitingWifi: 'E emetse Wi-Fi',
    packDataProtected: 'Datha e sirelelitsoe',
    touchStep1Category: '1. Tobetsa mokhahlelo',
    touchStep2Slang: '2. Tobetsa slang kapa Ranta',
    touchZeroTyping: 'Ha ho tlanyo · 0 MB datha',
    touchTapAboveBtn: 'Tobetsa Chelete ka Holimo',
    touchAddItemPrefix: 'Kenya',
    voicePackModalTitle: 'Ho Hlokahala Sephutheloana sa Lentsoe',
    voicePackModalSub: 'E sireletsa airtime le datha ea hau',
    voicePackModalBody:
      'Ho mamela lentsoe ntle le inthanete ho hloka sephutheloana sa 35 MB. Ha se bolokiloe ka Wi-Fi, se sebetsa kamehla ntle le datha.',
    voicePackCellularWarn:
      'U sebelisa datha ea selefouno. MoniBuddy e thibetse ho khoasolla ka boeona hore airtime ea hau e se ke ea fela.',
    voicePackOfflineWarn:
      'Ha u na marang-rang hona joale. Rulaganya ho khoasolla ka Wi-Fi kapa sebelisa Touch Pad hona joale.',
    voicePackDownloadNow: 'Khoasolla Hona Joale (35 MB)',
    voicePackDownloadWifi: 'Khoasolla Hamorao ka Wi-Fi',
    voicePackUseTouchPad: 'Sebelisa Touch Pad',
    voicePackCancelDownload: 'Emisa ho Khoasolla',
    voicePackUseTouchMeanwhile: 'Sebelisa Touch Pad Hajoale',

    loanShieldBadge: 'Letlole la Hau · Tlhahlobo ea Molao oa NCA',
    loanShieldTitle: 'Letlole la Tšohanyetso & Thebe ea Likoloto',
    loanShieldSubtitle:
      'Iketsetse letlole la tšohanyetso ’me u hlahlobe koloto efe kapa efe khahlano le meeli ea molao oa National Credit Act (NCA).',
    yourEmergencySavings: 'Poloko ea Hau ea Tšohanyetso',
    depositR100Btn: '+ Boloka R100',
    depositR250Btn: '+ Boloka R250',
    manageFundBtn: 'Laola Letlole',
    burnRateTitle: 'Litlhoko tsa Lelapa ka Beke',
    burnRateSub: 'Chelete e tlase e hlokahalang ka beke bakeng sa lijo, thekesi le motlakase',
    perWeekSuffix: '/ beke',
    twoWeekTargetTitle: 'Sepheo sa Libeke tse Peli',
    twoWeekTargetBodyPrefix: 'Boloka',
    twoWeekTargetBodySuffix: 'ho koahela libeke tse peli ha likoropo li fokotseha.',
    oneMonthTargetTitle: 'Sepheo sa Khoeli e Tletseng',
    oneMonthTargetBodyPrefix: 'Boloka',
    oneMonthTargetBodySuffix: 'bakeng sa khoeli eohle ea litlhoko tsa lelapa ntle le ho kolota.',
    loanQuoteTitle: 'Hlahloba Koloto Khahlano le Meeli ea Molao oa SA (NCA)',
    loanQuoteSubtitle:
      'Kenya chelete eo u e alimang, litefiso le chelete e batloang ke mokolotisi kapa mashonisa ho bona tsoala ea ’nete (APR) le hore na e tlola molao oa NCA Regulation 42.',
    loanPrincipalLabel: 'Chelete e Alimoang (R)',
    loanInputModeRepayment: 'Kenya Chelete Eohle e Khutlisoang (R)',
    loanInputModeMonthlyRate: 'Kenya Tsoala ka Khoeli (%)',
    loanQuotedRepaymentLabel: 'Chelete Eohle e Batloang (R)',
    loanMonthlyRateLabel: 'Tsoala ka Khoeli (%)',
    loanExtraFeesLabel: 'Litefiso tsa Admin / Ho Bula / Pokello (R)',
    loanTermDaysLabel: 'Nako ea Tefo (Matsatsi)',
    loanFirstLoanToggle: 'Koloto ea pele selemong sena (moeli oa 5% ka khoeli vs 3%)',
    loanQuoteCardTitle: 'Seo Mokolotisi a se Batlang',
    loanNcaCapCardTitle: 'Moeli oa Molao (NCA Reg 42)',
    loanSelfBufferCardTitle: 'Letlole la Hau la Tšohanyetso',
    loanTotalRepayLabel: 'Chelete Eohle e Lefshoang',
    loanTotalCostLabel: 'Tsoala le Litefiso',
    loanEffectiveAprLabel: 'Tsoala ka Selemo (APR)',
    loanStatusExceedsCap: 'Ka holimo ho moeli oa NCA ho sebali sena. Lekola le Motsamaisi oa Melao ea Koloto pele o saena. // TODO-NATIVE-REVIEW',
    loanStatusWithinCap: 'E ka Hare ho Moeli oa NCA — Lekola Hore na u ka Khona ho Lefa',
    loanOverchargeVsNcaLabel: 'Ka holimo ho moeli oa NCA ka',
    loanSavedWithBufferLabel: 'Chelete eo u e bolokang ka letlole la hau',
    loanNcaCitation:
      'Mohloli: National Credit Act 34 ea 2005, Regulation 42 (GN R1080, Nov 2015 — tsoala e kholo ke 5% ka khoeli kolotong ea pele kapa 3% ho tse latelang, tefiso ea ho bula R165 + 10% e sa feteng 15%, le R60 ka khoeli ea tšebeletso).',
    loanSaferAlternativesTitle: 'Mekhoa e Sireletsehileng Pele u Kolota',
    loanAlt1: 'Sebelisa letlole la tšohanyetso la stokvel se ngolisitsoeng kapa pitsa ea lelapa pele.',
    loanAlt2: 'Netefatsa hore mokolotisi o ngolisitsoe ho NCR (0860 627 627) ’me u se ke ua fana ka karete ea SASSA, ID kapa PIN.',
    loanAlt3: 'Kopa tokisetso ea ho lefa butle sekolong, tleliniking kapa masepaleng ntle le tsoala.',
    loanEducationalDisclaimer:
      'Sesebelisoa sa Thuto Feela: Lipalo tsena li thehiloe molaong oa NCA bakeng sa tsebo ea lichelete ’me ha se keletso ea semolao ea lichelete.',
    loanProtectionBannerTitle:
      'Tšireletso ea Molao oa NCA — Le ka Mohla u se ke ua Fana ka Karete ea SASSA, ID kapa PIN',
    loanProtectionBannerBody:
      'Tlas’a Karolo ea 90 le 133 ea National Credit Act, ke tlolo ea molao hore mashonisa kapa mokolotisi a boloke karete ea hau ea banka, karete ea SASSA, bukana ea ID kapa PIN e le tšireletso, kapa a batle tefo ea pele ea ho bula.',
    loanPredatoryWarningBannerTitle:
      'Temoso ea Koloto e Hlekefetsang — E Feta Moeli oa Molao oa NCA',
    loanPredatoryWarningBannerBodyPrefix:
      'Ema pele u saena: Koloto ena e u lefisa',
    loanPredatoryWarningBannerBodySuffix:
      'ka holimo ho moeli oa molao oa Regulation 42. Se ke ua lefa chelete ea ho bula — tlalehela NCR ka mekhoa ena e seng molaong ho 0860 627 627.',
    loanLegalCautionBannerTitle:
      'Tlhokomeliso ea Litšenyehelo — E ka Hare ho Molao oa NCA, Empa e na le Tsoala le Litefiso',
    loanLegalCautionBannerBodyPrefix:
      'Le ha e le ka hare ho moeli oa molao, koloto ena e u ja',
    loanLegalCautionBannerBodySuffix:
      'ka holimo ka tsoala le litefiso ha ho bapisoa le R 0.00 ha u sebelisa Poloko ea Hau ea Tšohanyetso.',

    scamGuardTitle: 'Molebeli oa Bomenemene le Melaetsa ea Bohata',
    scamGuardSub:
      'Hlahloba li-SMS tse belaetsang, likoloto tsa WhatsApp, litsebiso tsa SASSA le litefiso tsa ho ntša chelete ka lekunutu fonong ea hau',
    scamRuleBasedDisclaimerTitle: 'Tlhahlobo e Thehiloeng Melaong — Netefatsa ka Mohala Kamehla',
    scamRuleBasedDisclaimerBody:
      'Sesebelisoa sena se hlahloba mekhoa e tsebahalang ea bomenemene ntle le datha. Lintlha tse tlase HA LI tiise hore molaetsa o bolokehile 100% — bomenemene bo bocha bo hlaha letsatsi le leng le le leng. Le ka mohla u se arolelane PIN kapa OTP.',
    scamHighRiskBannerTitle:
      'Temoso e Kotsi ea Bomenemene — Ema ’me u se ke ua Romela Chelete kapa Vouche',
    scamHighRiskBannerBody:
      'Matšoao a mangata a bomenemene a fumanoe kopong ena. Se ke ua lefa tefo ea pele ea kalimo kapa mosebetsi, u se ke ua bolela PIN kapa OTP ea hau, ’me u netefatse ka nomoro ea semmuso pele.',
    scamCautionBannerTitle:
      'Temoso ea Tlhokomelo — Ho Fumanoe Matšoao a Belaetsang a Kotsi',
    scamCautionBannerBody:
      'Theola maikutlo ’me u netefatse ka bouena: Bomenemene bo sebelisa potlako le linomoro tse sa tsejoeng ho u potlakisa. Letsetsa motho ka kotloloho pele u lefa.',
    scamPasteLabel: 'Beha SMS, Molaetsa oa WhatsApp kapa Kopo ea Tefo',
    scamClearChecker: 'Hlakola tsohle',
    scamPlaceholder:
      'Beha molaetsa mona ho hlahloba litefiso tsa pele tsa likoloto, litefiso tsa junifomo ea mosebetsi, bosholu ba PIN/OTP kapa melaetsa ea bohata ea SASSA...',
    scamPaymentDetailsTitle: 'Lintlha tsa Tefo le Moamoheli (Haeba u batla)',
    scamAddDetails: 'Kenya lintlha',
    scamHideDetails: 'Pata lintlha',
    scamRecipientNameLabel: 'Lebitso la Moamoheli kapa Lebenkele',
    scamRecipientIdLabel: 'Nomoro ea Mohala kapa ID',
    scamAmountRequestedLabel: 'Chelete e Kopoang (R)',
    scamPaymentTypeLabel: 'Mofuta oa Tefo',
    scamOpLoanFee: 'Tefo ea Pele ea ho Bula Kalimo',
    scamOpCashOut: 'Ho Ntša Chelete / eWallet / Vouche',
    scamOpP2P: 'Ho Romella Motho Chelete',
    scamOpMerchant: 'Theko ea Thepa kapa Litšebeletso',
    scamAgentFeeLabelPrefix: 'Tefiso ea Agent e Batloang',
    scamUnregisteredLenderCheck: 'Mokolotisi ea sa ngolisoang ho NCR',
    scamNewRecipientCheck: 'Motho e mocha / ea sa tsejoeng',
    scamReadyTitle: 'E Loketse ho Hlahloba Molaetsa Ntle le Datha',
    scamReadyBody:
      'Beha SMS kapa WhatsApp ka holimo. Molaetsa oa hau o lula e le lekunutu fonong ena feela.',
    scamVerifyBtn: 'Hlahloba Polokeho ea Tefo',
    scamFraudReportBtn: 'Tlaleho ea Bomenemene',
    scamHideReportBtn: 'Pata Tlaleho',
    scamWarningSignsHeading: 'Matšoao a Kotsi a Fumanoeng',
    scamNoKnownPatternAdvice: 'Ha ho letšoao le tsejoang le fumanoeng — netefatsa ka mohala pele u lefa',
    scamBlockAdvice: 'SE KE UA ROMELA CHELETE — Thibela tefo',
    scamHelplinesTitle: 'Linomoro tsa Thuso ea Bomenemene Afrika Boroa',
    scamHelplinesSub: 'Linomoro tsa semmuso tsa ho tlaleha bomenemene ba banka kapa bomashonisa',
    scamModalHighRiskBadge: 'TEMOSO E MATLA EA BOMENEMENE',
    scamModalListenHeading: 'Mamela Temoso ea Lentsoe Pele u Etsa Qeto:',
    scamModalPlayBtn: 'Bapala Temoso ea Lentsoe',
    scamModalStopBtn: 'Emisa Temoso ea Lentsoe',
    scamModalMandatoryChecks: 'Mehato ea Polokeho e Tlamang:',
    scamModalAckCheckbox:
      'Ke netefalitse kopo ena ka ho letsetsa nomoro ea semmuso ’me kea utloisisa hore chelete kapa vouche ha e khutlisoe.',
    scamModalCancelBlockBtn: 'Hlakola & Thibela Tefo (E Khothaletsoa)',
    scamModalProceedBtn: 'Ke Netefalitse ka ho Otloloha — Tsoela Pele',

    syncBadge: 'Poloko ea Fono · Setsi sa Teko sa USSD',
    syncTitle: 'Mokhoa o se Nang Datha & Setsi sa Teko sa USSD',
    syncSub:
      'Buka ea hau e sebetsa ntle le datha fonong ena. Leka setsi sa teko sa *120*6664# se bontšang kamoo lifono tsa likonopo li sebetsang kateng.',
    ussdSimNoticeTitle: 'Setsi sa Teko sa USSD se ka Hare ho App (Prototype)',
    ussdSimNoticeBody:
      'Khoutu ea *120*6664# mona ke teko e sebetsang ntle le datha le buka ea hau ea fono — ha e so be khoutu ea marang-rang a mehala.',
    savedTransactionsLabel: 'Litlaleho tse Sirelelitsoeng',
    activeSavingsPotsLabel: 'Lipitsa tse Sebetsang',
    verifyLocalLedgerBtn: 'Netefatsa & Boloka Buka e Sirelelitsoeng',
    verifyingLocalLedgerBtn: 'Ea sireletsa le ho boloka fonong...',
    offlineAirplaneGuarantee:
      'Chelete ea hau, lipitsa le nalane li sebetsa esita le ho Airplane Mode ntle le airtime.',
    installHomeScreenHint:
      'Kenya MoniBuddy skrineng sa lapeng hore e bulehe neng kapa neng ntle le datha.',
    ussdShortcodeCardTitle: 'Mohopolo oa USSD bakeng sa Lifono tsa Likonopo (*120*6664#)',
    ussdShortcodeCardBody:
      'Leka likonopo ka ho le letona ho bona kamoo bahoebi ba shebang chelete kapa ba bolokang R50 letloleng la tšohanyetso.',
    launchSimulatorBtn: 'Bula Teko ea USSD',
    copyShortcodeBtn: 'Kopitsa *120*6664#',
    copiedShortcodeBtn: 'E kopisitsoe',
    ussdSimulatorTag: 'TEKO · DEMO E SE NANG DATHA',
    ussdOpenMenuBtn: 'Qala Teko ea *120*6664#',
    ussdCloseMenuBtn: 'Koala Lenane',
    ussdSendBtn: 'Romela',

    techBadge: 'Moralo, Botsitso & Tšireletso',
    technicalBriefTitle: 'Kamoo MoniBuddy e Sebetsang le ho Hola Kateng',
    techSubtitle:
      'E etselitsoe batho ba Afrika Boroa ba amohelang chelete ka nako e sa tšoaneng: mahala ho basebelisi, ha e je datha, ebile e sirelelitsoe ka AES-256.',
    techCap1Title: 'Poloko e Sirelelitsoeng ka AES-256-GCM',
    techCap1Body:
      'Buka ea hau e sirelelitsoe fonong ka WebCrypto AES-256-GCM le PBKDF2-SHA256 (100,000) hammoho le mongolo o bolokiloeng ka hare.',
    techCap2Title: 'Tšireletso ea Airtime le Datha',
    techCap2Body:
      'Ha ho marang-rang a kantle ha u bula app. Sephutheloana sa lentsoe sa 35 MB ha se khoasolloe ka datha ea selefouno ntle le tumello ea hau.',
    techCap3Title: 'Phihlello ka Lipuo tse 5',
    techCap3Body:
      'Mongolo o moholo (A+), tataiso ea lentsoe, lipuo tse 5 tsa Afrika Boroa le Touch Pad e bonolo.',
    techCap4Title: 'Thebe ea Bomenemene & Molao oa NCA',
    techCap4Body:
      'Tlhahlobo ea bomenemene le meeli ea tsoala ea NCA Regulation 42 li etsahala ka hare ho fono ea hau.',
    sustainabilityTitle: 'Botsitso ba Khoebo Ntle le ho Lefisa Mosebelisi',
    sustainabilitySubtitle:
      'Kamoo MoniBuddy e lulang e le mahala sechabeng ha e ntse e hola ka tšebelisano (B2B2C)',
    sustModel1Title: '1. Tšehetso ea Libanka le Marang-rang (B2B2C)',
    sustModel1Body:
      'Libanka, inshorense ea sechaba le marang-rang a mehala li tšehetsa PWA/USSD e se nang datha ho thusa batho ho boloka ka polokeho.',
    sustModel2Title: '2. Li-Stokvel tse Ngolisitsoeng le Likoporasi',
    sustModel2Body:
      'Tšebeliso ea motho ka mong ke mahala kamehla. Li-stokvel tse kholo li lefa R49 ka khoeli bakeng sa litlaleho tsa sehlopha.',
    sustModel3Title: '3. Tšebelisano le Mabenkele a Lijo ka Boithaopo',
    sustModel3Body:
      'Meputso e laoloang ha basebelisi ba reka lijo ka lipitsa tsa bona — ha ho lipapatso tsa bomashonisa ebile ha ho datha e rekisoang.',
    dignityTitle: 'Boitlamo ba Rona ho Seriti sa Lichelete',
    dignitySubtitle: 'Melao e tiileng e sireletsang chelete ea lelapa la hau',
    dignity1Title: 'Mahala Kamehla ho Batho',
    dignity1Body: 'Lipitsa, letlole la tšohanyetso le molebeli oa bomenemene ke mahala ka botlalo.',
    dignity2Title: 'Ha ho Thekiso ea Lintlha',
    dignity2Body: 'Ha re rekise nalane ea hau ea chelete ebile ha re bontše lipapatso tsa likoloto.',
    dignity3Title: 'E Etselitsoe Likoropo le Spaza',
    dignity3Body: 'E lumellana le meputso ea beke, khoebo ea spaza, li-stokvel le mantsoe a Mzansi.',

    privacyBadge: 'Tokelo ea POPIA · AES-256-GCM Fonong',
    privacyGuaranteeTitle: 'Lekunutu la Hau le Taolo ea Datha',
    privacySubtitle: 'Boikarabello bo feletseng holim’a buka ea hau e sirelelitsoeng, li-backup le ho hlakola.',
    privacyMainHeading: 'Litlaleho tsa Hau li Lula li Sirelelitsoe Matsohong a Hau',
    privacyMainBody:
      'MoniBuddy ha e kope li-password tsa banka kapa ID. Akhaonto ka ’ngoe fonong ena e arotsoe ebile e sirelelitsoe.',
    privacyPoint1Title: '01. Tšireletso ea PBKDF2-SHA256 + AES-256-GCM',
    privacyPoint1Body:
      'PIN ea hau e sirelelitsoe ka PBKDF2 (100,000) ’me buka ea hau e sirelelitsoe ka AES-256-GCM hore linomoro tsa hau li se ke tsa hlaha pepeneneng.',
    privacyPoint2Title: '02. Ha ho Lipapatso kapa Lihloela',
    privacyPoint2Body: 'Ha ho lisebelisoa tsa ho latedisa kapa mongolo oa kantle. Ha ho motho ea bonang phallo ea chelete ea hau.',
    privacyPoint3Title: '03. Backup e Nkehang le ho Hlakola Hang-hang',
    privacyPoint3Body:
      'Khoasolla faele ea backup pele u fetola fono, khutlisetsa backup kapa hlakola tsohle ka ho tobetsa hang.',
    downloadBackupBtn: 'Khoasolla Backup (.json)',
    restoreBackupBtn: 'Khutlisetsa Backup',
    eraseLedgerBtn: 'Hlakola Datha ea Buka',
    eraseConfirmTitle: 'Hlakola Litlaleho Tsohle tsa Buka?',
    eraseConfirmSub: 'Ketso ena ha e khutlisetsoe morao',
    eraseConfirmBody:
      'Sena se tla hlakola ka ho sa feleng chelete ea qalo, lipitsa, letlole la tšohanyetso le nalane ea akhaonto ena fonong ena.',
    eraseEverythingBtn: 'Hlakola Tsohle',
    backupDownloadedMsg: 'Faele ea backup e khoasollotsoe fonong ea hau. E boloke e le lekunutu.',
    backupRestoredMsg: 'Backup ea hau e khutliselitsoe ’me ea sireletsoa bukeng ea hau.',
    backupInvalidMsg: 'Faele ea backup ha e balehe. Ka kopo khetha faele e nepahetseng ea MoniBuddy .json.',
    ledgerErasedMsg: 'Litlaleho tsohle tsa akhaonto ena li hlakotsoe fonong ena.',

    modalCreatePotTitle: 'Etsa Pitsa e Ncha ea Poloko',
    modalChooseIcon: 'Khetha Setšoantšo',
    modalSavingForLabel: 'U bolokela eng?',
    modalSavingForPlaceholder: 'mohl. Lijo, Thepa ea spaza, Lieta tsa sekolo',
    modalTargetAmountLabel: 'Sepheo sa Chelete (R)',
    modalCategoryLabel: 'Mokhahlelo',
    modalCreatePotSubmit: 'Etsa Pitsa',
    modalPutMoneyIn: 'Kenya Chelete Pitseng',
    modalTakeMoneyOut: 'Ntša Chelete Pitseng',
    modalCurrentlyInPot: 'Chelete e ka pitseng ena:',
    modalAvailableSafeCash: 'Chelete e bolokehileng e teng:',
    modalSaveToPotBtn: 'Boloka Pitseng',
    modalTakeOutCashBtn: 'Ntša Chelete',
    modalBufferTitle: 'Letlole la Tšohanyetso',
    modalBufferSub: 'Thebe ea lelapa la hau',
    modalUseBufferBtn: '- Sebelisa Chelete ea Tšohanyetso',
    modalCurrentBufferLabel: 'Letlole la Hajoale:',
    modalReasonOptionalLabel: 'Lebaka (Haeba u batla)',
    modalReasonPlaceholder: 'mohl. Tleliniki, leeto la tšohanyetso',
    modalSaveToFundBtn: 'Boloka Letloleng',
    modalWithdrawCashBtn: 'Ntša Chelete',
    pwaInstallOfflineApp: 'Kenya App e se Nang Datha',
    pwaInstallOnIphone: 'Kenya ho iPhone',
    pwaIosGuideTitle: 'Boloka MoniBuddy Skrineng sa Lapeng',
    pwaIosStep1: 'Tobetsa letšoao la Share ho Safari.',
    pwaIosStep2: 'Tobetsa Add to Home Screen ho bula MoniBuddy ntle le datha.',
    pwaGotIt: 'Ke Utloile',

    audioGuides: {
      overview: {
        title: 'Chelete e Bolokehileng & Lipitsa',
        content:
          'Chelete e Bolokehileng ka holimo e bontša chelete eo u ka e sebelisang kajeno ntle le ho ama lipitsa tsa lijo le letlole la tšohanyetso.',
        keyAdvice: 'Keletso: Ho beha R20 ka beke ho sireletsa lelapa la hau.'
      },
      income_expenses: {
        title: 'Chelete e Kenang le e Tsoang',
        content:
          'Ngola chelete ka lentsoe, Touch Pad e se nang datha kapa ka letsoho. Ho hlakola tlaleho ho khutlisetsa lipalo morao.',
        keyAdvice: 'Keletso: Sebelisa Touch Pad ha u se na marang-rang.'
      },
      buffer_credit: {
        title: 'Letlole la Tšohanyetso & Molao oa NCA',
        content:
          'Hlahloba koloto efe kapa efe khahlano le meeli ea molao oa National Credit Act le letlole la hau.',
        keyAdvice: 'Keletso: Bakolotisi ba ngolisitsoeng ha ba lumelloe ho lefisa ho feta 5% ka khoeli kolotong ea pele.'
      },
      scam_guard: {
        title: 'Molebeli oa Bomenemene',
        content:
          'Beha SMS kapa WhatsApp ho hlahloba bomenemene ntle le datha. Netefatsa ka mohala kamehla.',
        keyAdvice: 'Keletso: Le ka mohla u se lefe tefiso ea ho bula koloto ka vouche.'
      },
      sync_2g: {
        title: 'Mokhoa o se Nang Datha & Teko ea USSD',
        content:
          'Buka ea hau e bolokiloe fonong ea hau. Leka setsi sa teko sa USSD ho bona lenane la lifono tsa likonopo.',
        keyAdvice: 'Keletso: Kenya app skrineng sa lapeng.'
      },
      technical_brief: {
        title: 'Kamoo e Sebetsang le Botsitso',
        content:
          'MoniBuddy e sireletsa datha ea hau, e patela buka ea hau ka AES-256 ebile e lula e le mahala ho basebelisi.',
        keyAdvice: 'Keletso: Lintlha tsa hau li lula fonong ea hau feela.'
      },
      privacy_legal: {
        title: 'Lekunutu & Li-Backup',
        content:
          'PIN ea hau e sirelelitsoe ka PBKDF2 ’me buka e patiloe ka AES-256-GCM. Khoasolla backup pele u fetola fono.',
        keyAdvice: 'Keletso: Boloka faele ea backup sebakeng se bolokehileng.'
      }
    },
    authErrLedgerDecryptFailed: 'Failed to decrypt secure ledger. Incorrect PIN or corrupted data. // TODO-NATIVE-REVIEW',
    warningUnencryptedLedger: 'Your data is NOT encrypted on this device because WebCrypto is unavailable. // TODO-NATIVE-REVIEW',
    authPinLengthHint: 'Recommended: 6 or more digits // TODO-NATIVE-REVIEW',
    welcomeModalTitle: 'Welcome to MoniBuddy // TODO-NATIVE-REVIEW',
    welcomeModalStep1Title: '1. Safe-to-Spend Balance // TODO-NATIVE-REVIEW',
    welcomeModalStep1Body: 'Your Safe-to-Spend amount shows cash you can use today after protecting your savings pots and emergency buffer. // TODO-NATIVE-REVIEW',
    welcomeModalStep2Title: '2. Log Income & Expenses // TODO-NATIVE-REVIEW',
    welcomeModalStep2Body: 'Record cash easily using offline voice recognition, the zero-data Touch Pad, or manual entry. // TODO-NATIVE-REVIEW',
    welcomeModalStep3Title: '3. Emergency Buffer & Scam Guard // TODO-NATIVE-REVIEW',
    welcomeModalStep3Body: 'Build your household safety cushion and check suspicious SMS or WhatsApp messages offline. // TODO-NATIVE-REVIEW',
    welcomeModalSkip: 'Skip // TODO-NATIVE-REVIEW',
    welcomeModalNext: 'Next // TODO-NATIVE-REVIEW',
    welcomeModalFinish: 'Get Started // TODO-NATIVE-REVIEW',
    scamGuardDisclaimer: 'Note: Rule-based scam detection is heuristic and local. A SAFE result does not guarantee a message or person is safe — new scams appear daily. Always verify by phone before paying. // TODO-NATIVE-REVIEW',
    loanAnnualisedCost: 'Annualised cost (simple) // TODO-NATIVE-REVIEW',
    loanPrincipalMinError: 'Principal amount must be at least R100. // TODO-NATIVE-REVIEW',
    loanTermMinError: 'Term must be between 1 and 180 days. // TODO-NATIVE-REVIEW',
    ussdDemoNotice: 'Demo USSD transaction simulated for offline testing. // TODO-NATIVE-REVIEW',
    ussdDemoBadge: 'USSD Demo // TODO-NATIVE-REVIEW',
    sourceLabel: 'Source // TODO-NATIVE-REVIEW',
    lastVerifiedLabel: 'Last Verified // TODO-NATIVE-REVIEW',
    unverifiedBadge: 'Unverified, check with NCR // TODO-NATIVE-REVIEW',
    voiceOfflineNote: 'Voice recognition requires a network connection or downloaded voice pack. Typing and touch pad always work offline. // TODO-NATIVE-REVIEW'
  },

  af: {
    appName: 'MoniBuddy',
    tagline: 'Maklike Geldbestuur Wat Sonder Data Werk',

    cancel: 'Kanselleer',
    close: 'Sluit',
    save: 'Stoor',
    clear: 'Vee uit',
    remove: 'Verwyder',
    copy: 'Kopieer',
    copied: 'Gekopieer',
    hide: 'Versteek wenke',
    show: 'Wys wenke',
    listen: 'Luister',
    stopAudio: 'Stop Klank',
    audioGuide: 'Luister',
    audioGuideActive: 'Lees voor...',
    audioGuideTranscript: 'Oudiogids',
    largeTextLabel: 'A+',
    largeTextTitle: 'Wissel groot leesbare teks',
    languageLabel: 'Taal',
    lockAndSignOut: 'Sluit Boek & Teken Uit',
    signedInAs: 'Ingeteken as',
    offlineBanner: 'Vanlyn · Versleutel op hierdie foon gestoor',
    localLedgerActive: 'Versleutelde grootboek aktief',
    offlineSavedOnPhone: 'Vanlyn · Versleutel op foon',
    encryptedAesBadge: 'AES-256-GCM versleutel op toestel',
    savedAtPrefix: 'Gestoor om',
    moreMenu: 'Meer',
    myMoneySection: 'My Geld',
    guidePrivacySection: 'Gids & Privaatheid',

    navOverview: 'Oorsig & Potte',
    navIncomeExpenses: 'Geld In & Uit',
    navBufferCredit: 'Noodfonds & Leningskild',
    navScamGuard: 'Toets Bedrog',
    nav2gSync: 'Geen-Data Simulator',
    navTechnicalBrief: 'Hoe Dit Werk',
    navPrivacyLegal: 'Privaatheid & Veiligheid',
    navShortPots: 'Potte',
    navShortCash: 'Kontant',
    navShortLoan: 'Lenings',
    navShortScam: 'Bedrog',

    authHeroBadge: 'Suid-Afrikaanse Kontantgrootboek · Werk Vanlyn',
    authHeroBody:
      'Hou daaglikse sakgeld apart van kruideniersware, skoolfonds, spaza-voorraad en jou gesin se noodkussing — versleutel op jou eie foon sonder mobiele data.',
    authFeature1Title: 'Direk op Jou Foon Versleutel',
    authFeature1Body:
      'Jou grootboek word met AES-256-GCM versleutel deur jou PIN (PBKDF2 100,000 iterasies). Werk met nul lugtyd.',
    authFeature2Title: 'Ingeboude Bedrog- & NCA-Leningskild',
    authFeature2Body:
      'Toets verdagte WhatsApp-leningsfooie, vals SASSA-boodskappe en Nasionale Kredietwet-limiete vanlyn voor jy betaal.',
    authFeature3Title: 'Geen Bankwagwoorde of ID-Oplaaie Nie',
    authFeature3Body:
      'Elke rekening op ’n gedeelde gesinsfoon is streng geskei en beskerm met ’n 5-poging sluiting van 60 sekondes.',
    authSignInTab: 'Teken In',
    authRegisterTab: 'Skep Rekening',
    authSignInTitle: 'Ontsluit Jou Versleutelde Grootboek',
    authSignInSubtitle: 'Voer jou selfoonnommer en sekuriteits-PIN in om jou grootboek te ontsluit.',
    authRegisterTitle: 'Skep Jou Plaaslike Rekening',
    authRegisterSubtitle: 'Stel jou privaat versleutelde grootboek binne sekondes op. Geen data nodig nie.',
    authNoAccountYet: 'Nog geen rekening is op hierdie toestel geskep nie.',
    authCreateOneLink: 'Skep een →',
    authMobileOrEmailLabel: 'Selfoonnommer of E-pos',
    authMobileLabel: 'Selfoonnommer (Suid-Afrika)',
    authPinLabel: 'Sekuriteits-PIN',
    authShowPin: 'Wys PIN',
    authHidePin: 'Versteek PIN',
    authPinPlaceholder: '4 tot 8 syfers',
    authRememberPhone: 'Onthou my selfoonnommer op hierdie toestel',
    authUnlockButton: 'Ontsluit Grootboek',
    authUnlockingButton: 'Ontsluit tans...',
    authFullNameLabel: 'Volle Naam',
    authFullNamePlaceholder: 'Jou naam',
    authCreatePinLabel: 'Skep PIN (4–8 syfers)',
    authConfirmPinLabel: 'Bevestig PIN',
    authEmailOptionalLabel: 'E-posadres (Opsioneel)',
    authEmailOptionalPlaceholder: 'Opsionele verwysing',
    authCreateAccountButton: 'Skep Rekening & Versleutel',
    authCreatingButton: 'Beveilig tans...',
    authFooterGuarantee: 'AES-256-GCM versleutel op toestel · PBKDF2-SHA256 PIN · POPIA-voldoenend',
    authFooterLeft: 'MoniBuddy Kontant- & Spaargrootboek',
    authFooterRight: 'Werk 100% vanlyn · Nul eksterne netwerkoproepe',
    authAudioSignIn:
      'Welkom terug by MoniBuddy. Voer jou selfoonnommer en PIN in om jou vanlyn geldgrootboek te ontsluit.',
    authAudioRegister:
      'Welkom by MoniBuddy. Voer jou naam, Suid-Afrikaanse selfoonnommer en ’n 4 tot 8 syfer PIN in om ’n versleutelde grootboek op hierdie foon te skep sonder mobiele data.',
    authErrMissingCredentials: 'Voer asseblief jou selfoonnommer en sekuriteits-PIN in.',
    authErrIncorrectCredentials: 'Verkeerde selfoonnommer of sekuriteits-PIN.',
    authErrPinLockedPrefix: 'Te veel mislukte PIN-pogings. Probeer weer oor',
    authErrPinLockedSuffix: 'sekondes.',
    authErrAttemptsLeftPrefix: 'Pogings oor voor 60s-sluiting:',
    authErrPinMismatch: 'Die twee sekuriteits-PINs stem nie ooreen nie.',
    authErrMissingName: 'Voer asseblief jou volle naam in.',
    authErrInvalidPhone: 'Voer asseblief ’n geldige Suid-Afrikaanse selfoonnommer in.',
    authErrInvalidPinFormat: 'Sekuriteits-PIN moet 4 tot 8 syfers wees.',
    authErrAccountExists: '’n Rekening met hierdie nommer bestaan reeds op hierdie toestel. Teken asseblief in.',
    authGoogleButton: 'Gaan voort met Google en Rugsteun',
    googleBackupActive: 'Google Wolkrugsteun Aktief',
    googleBackupSync: 'Sinkroniseer Rugsteun na Google',
    googleLoginSuccess: 'Suksesvol aangeteken met Google. Data gerugsteun.',
    googleLoginError: 'Google-aanmelding gekanselleer of ongeldige e-pos. Probeer weer.',
    googleEmailPrompt: 'Voer jou Google-e-posadres in vir aanmelding en wolkrugsteun:',
    googleDetailsModalTitle: 'Google-aanmelding en Vanlyn Besonderhede',
    googleDetailsModalSubtitle: 'Voer jou Google-e-pos en persoonlike besonderhede in om vanlyn toegang sonder data moontlik te maak.',
    googleDetailsEmailLabel: 'Google-e-posadres',
    googleDetailsNameLabel: 'Volle Naam',
    googleDetailsPhoneLabel: 'Selfoonnommer (vir vanlyn aanmelding)',
    googleDetailsPinLabel: 'Vanlyn PIN (4–6 syfers)',
    googleDetailsConfirmPinLabel: 'Bevestig Vanlyn PIN',
    googleDetailsSubmit: 'Stoor en Begin Vanlyn Grootboek',

    safeToSpend: 'VEILIG OM VANDAG TE SPANDEER',
    safeToSpendDesc:
      'Hierdie kontant kan jy vandag vrylik gebruik. Jou kospotte, skoolgeld en noodfonds is reeds veilig eenkant gehou.',
    overspentWarningTitle: 'Oorbestee — Beskermde Potte of Kontant Oorskry',
    overspentWarningDesc:
      'Jou uitgawes en pot-toewysings oorskry jou aangetekende kontant in. Teken inkomste aan, verminder besteding of onttrek uit ’n pot.',
    startingBalance: 'Jou begingeld (R)',
    setStartingCash: 'Stel Begingeld Op',
    updateStartingCash: 'Dateer Begingeld Op',
    startingCashFirstTimePrompt:
      'Begin jou grootboek: Hoeveel totale kontant of banksaldo het jy op die oomblik?',
    startingCashEditPrompt: 'Voer jou huidige totale kontant of banksaldo in:',
    saveStartingBalance: 'Stoor Saldo',
    startingTotal: 'BEGINGELD',
    income: 'GELD IN',
    expenses: 'GELD UIT',
    goalSavings: 'SPAARPOTTE',
    emergencyBuffer: 'NOODFONDS',
    forecastReadyPrefix: 'Maandeinde-projeksie: Teen jou huidige daaglikse tempo sal jy die maand afsluit met',
    forecastReadySuffix: 'veilige kontant.',
    forecastPendingTitle: 'Maandeinde-voorspelling:',
    forecastPendingBody: 'Teken daaglikse uitgawes oor minstens 5 dae aan om ’n outomatiese voorspelling te sien.',
    zeroInterestSelfFunded: 'Nul rente · Selfbefonds',
    bufferCoversPrefix: 'Dek ongeveer',
    bufferCoversWeeksUnit: 'weke',
    bufferCoversSuffix: 'se noodsaaklike huishoudelike lewenskoste.',
    bufferEmptyPrompt: 'Sit R50 of R100 eenkant wanneer jy kan om hoë-rente informele lenings te vermy.',
    activePotsSuffix: 'aktief',
    potsSummaryDesc: 'Afgesonderde kontant vir kos, skoolgeld, spaza-voorraad en familiepligte.',
    microSavingsPots: 'My Spaarpotte',
    potsSubtitle: 'Hou geld eenkant vir kos, spaza-voorraad, skooluniforms of familiegeleenthede',
    newGoalPot: '+ Nuwe Pot',
    createFirstPot: 'Skep Jou Eerste Spaarpot',
    noPotsYetTitle: 'Nog geen spaarpotte nie',
    emptyPotsMsg: 'Jy het nog geen spaarpotte bygevoeg nie. Selfs R10 vir kos help om jou gesin te beskerm.',
    goalLabel: 'Doelwit:',
    savedPercentSuffix: '% gespaar',
    goalReachedLabel: 'Doelwit bereik',
    deposit: '+ Sit Geld In',
    withdraw: 'Trek Uit',
    howItWorks: 'Hoe MoniBuddy Jou Help',
    howStep1Title: '01. Spaarpotte',
    howStep1Body: 'Hou geld vir kos, voorraad en skool apart van daaglikse besteding.',
    howStep2Title: '02. Noodkussing',
    howStep2Body: 'Bou jou eie buffer sodat noodgevalle jou nooit in onwettige lenings dwing nie.',
    howStep3Title: '03. Bedrogtoetser',
    howStep3Body: 'Toets verdagte leningsfooie, WhatsApp-aanbiedinge en kontantfooie vanlyn op jou foon.',
    howStep4Title: '04. Geen-Data Toegang',
    howStep4Body: 'Werk heeltemal vanlyn as ’n geïnstalleerde app, plus ’n interaktiewe USSD-prototipe.',
    addToBuffer: '+ Voeg by Noodfonds',
    insufficientSafeCashError: 'Bedrag oorskry jou beskikbare Veilig-om-te-Spandeer kontant. Teken eers geld in aan of kies ’n kleiner bedrag.',
    insufficientBufferError: 'Bedrag oorskry jou huidige Noodfonds-saldo.',
    insufficientPotError: 'Bedrag oorskry die kontant wat tans in hierdie pot gespaar is.',

    cashLogTitle: 'Geld In & Geld Uit',
    cashLogSubtitle: 'Teken daaglikse kontantinkomste en -uitgawes op jou foon aan sonder mobiele data',
    totalMoneyIn: 'Totale Geld In',
    totalMoneyInSub: 'Lone, loswerkies, verkope en toelaes',
    totalMoneyOut: 'Totale Geld Uit',
    totalMoneyOutSub: 'Kos, taxigeld, krag en voorraad',
    last7DaysTitle: 'Laaste 7 Dae',
    last7DaysSub: 'Daaglikse kontantvloei aangeteken',
    sevenDayWindow: '7-dae venster',
    peakDayPrefix: 'Hoogste dag:',
    manualEntryTitle: 'Handmatige Inskrywing',
    manualEntrySub: 'Tik presiese besonderhede en datum',
    moneyOutBtn: '- Geld Uit',
    moneyInBtn: '+ Geld In',
    commonCategoriesLabel: 'Algemene kategorieë:',
    descriptionLabel: 'Beskrywing',
    descriptionPlaceholder: 'Waarvoor was hierdie kontant?',
    amountRandLabel: 'Bedrag (R)',
    dateLabel: 'Datum',
    saveEntryBtn: 'Stoor Inskrywing',
    recordedTransactionsTitle: 'Aangetekende Transaksies',
    recordedTransactionsSub: 'Privaat versleutel op hierdie toestel',
    recordsCountSuffix: 'rekords',
    noTransactionsTitle: 'Nog geen transaksies aangeteken nie',
    noTransactionsBody: 'Gebruik Stem, die Sleutelbord (Touch Pad), of Handmatige Inskrywing hierbo.',
    presetGroceries: 'Kruideniersware & Brood',
    presetTaxi: 'Taxigeld',
    presetElectricity: 'Kragbewys',
    presetSpaza: 'Spaza-voorraad',
    presetAirtime: 'Lugtyd / Data',
    presetWages: 'Loon / Salaris',
    presetHustle: 'Loswerk / Verkope',
    presetGrant: 'SASSA-toelae',

    voiceNavBtn: 'Stemlog',
    voiceModalTitle: 'Stem- & Sleutelbordinvoer',
    voiceModalSub: 'Teken kontant aan met spraak, Suid-Afrikaanse sleng of die vanlyn Touch Pad',
    quickVoiceTouchTitle: 'Vinnige Stem- & Sleutelbordinvoer',
    voiceTabLabel: 'Stem',
    touchPadTabLabel: 'Touch Pad',
    speakTransactionBtn: 'Praat Transaksie',
    doneSpeakingBtn: 'Klaar Gepraat',
    stopListeningBtn: 'Stop Luister',
    transcribingOfflineMsg: 'Skakel spraak vanlyn op jou foon om...',
    offlineVoicePackBtn: 'Vanlyn Stempakket',
    downloadingProgressPrefix: 'Laai tans af',
    slangGuideShow: 'Slenggids',
    slangGuideHide: 'Versteek slenggids',
    slangGuideHeading: 'Ondersteunde Suid-Afrikaanse Slengterme',
    listeningOfflineHint: 'Luister vanlyn — tik Klaar Gepraat wanneer jy klaar is',
    onDeviceAudioBadge: 'Op-toestel klank',
    spokenPhraseLabel: 'Gesproke frase of getikte nota',
    spokenPhrasePlaceholder: 'Praat hierbo of tik ’n frase (bv. "taxi to town R32" of "two choco for bread")',
    voiceNetworkLimitationNote:
      'Blaaier-spraakherkenning gebruik netwerkdata tensy op-toestel spraak of die 35 MB Vanlyn Stempakket gestoor is. Jy kan altyd hier tik of die Touch Pad met nul data gebruik.',
    noAmountParsedError:
      'Geen Rand-bedrag is gevind nie. Noem ’n bedrag (soos "taxi to town R32" of "two choco") of gebruik die Touch Pad.',
    openTouchPadBtn: 'Maak Touch Pad Oop',
    entriesReadyTitle: 'Inskrywings Gereed om te Stoor',
    recognizedSlangPrefix: 'Sleng:',
    emptyPreviewTouchHint:
      'Kies ’n kategorie-ikoon en tik slengnote (+1 Choco, +1 Clipa) of syfers op die sleutelbord.',
    emptyPreviewVoiceHint:
      'Tik Praat Transaksie, tik ’n vinnige nota links, of skakel oor na die Touch Pad.',
    editInFormBtn: 'Wysig in vorm',
    saveEntriesBtnPrefix: 'Stoor',
    saveEntriesBtnSuffix: 'in Grootboek',
    savedEntriesNoticePrefix: 'Gestoor in jou versleutelde grootboek:',
    modeTouchActive: 'Sleutelbord aktief (0 MB data)',
    modeCloudSpeech: 'Blaaierspraak gereed (gebruik netwerk)',
    modeOnDeviceSpeech: 'Op-toestel spraak gereed',
    modeOfflineSpeechReady: 'Vanlyn WASM-spraak gereed (0 MB data)',
    modeOfflinePackAvailable: 'Vanlyn stempakket opsioneel (35 MB)',
    packSavedStatus: 'Vanlyn pakket gestoor',
    packSavingPrefix: 'Stoor pakket',
    packWaitingWifi: 'Wag vir Wi-Fi',
    packDataProtected: 'Voorafbetaalde data beskerm',
    touchStep1Category: '1. Tik kategorie-ikoon',
    touchStep2Slang: '2. Tik sleng of Rand-note',
    touchZeroTyping: 'Geen tikwerk · Nul data',
    touchTapAboveBtn: 'Tik Sleng of Syfers Hierbo',
    touchAddItemPrefix: 'Voeg by',
    voicePackModalTitle: 'Vanlyn Stempakket Benodig',
    voicePackModalSub: 'Beskerm jou voorafbetaalde mobiele data',
    voicePackModalBody:
      'Om spraak sonder internet om te skakel, word ’n 35 MB vanlyn Whisper-stempakket benodig. Sodra dit op Wi-Fi gestoor is, werk vanlyn spraak sonder enige data.',
    voicePackCellularWarn:
      'Jy is op mobiele data. MoniBuddy het outomatiese aflaai geblokkeer sodat jou lugtyd nooit sonder toestemming gebruik word nie.',
    voicePackOfflineWarn:
      'Jy is tans vanlyn. Skeduleer die pakket vir Wi-Fi of gebruik nou dadelik die Touch Pad.',
    voicePackDownloadNow: 'Laai Nou Af (35 MB)',
    voicePackDownloadWifi: 'Laai Later Af op Wi-Fi',
    voicePackUseTouchPad: 'Gebruik Touch Pad',
    voicePackCancelDownload: 'Kanselleer Aflaai',
    voicePackUseTouchMeanwhile: 'Gebruik Intussen Touch Pad',

    loanShieldBadge: 'Selfbefondste Kussing · NCA-Kredietlimiettoetser',
    loanShieldTitle: 'Noodfonds & Leningskwotasie-skild',
    loanShieldSubtitle:
      'Bou jou eie noodkussing en toets enige leningskwotasie teen Suid-Afrika se Nasionale Kredietwet (NCA) limiete.',
    yourEmergencySavings: 'Jou Noodspaargeld',
    depositR100Btn: '+ Spaar R100',
    depositR250Btn: '+ Spaar R250',
    manageFundBtn: 'Bestuur Fonds',
    burnRateTitle: 'Noodsaaklike Weeklikse Huishoudelike Behoefte',
    burnRateSub: 'Minimum weeklikse koste vir kos, vervoer en voorafbetaalde krag',
    perWeekSuffix: '/ week',
    twoWeekTargetTitle: '2-Weke Teikenkussing',
    twoWeekTargetBodyPrefix: 'Hou',
    twoWeekTargetBodySuffix: 'gespaar om twee weke te dek as loswerk of handel afneem.',
    oneMonthTargetTitle: '1-Maand Teikenkussing',
    oneMonthTargetBodyPrefix: 'Hou',
    oneMonthTargetBodySuffix: 'gespaar vir ’n volle maand se basiese uitgawes sonder om te leen.',
    loanQuoteTitle: 'Toets Enige Leningskwotasie Teen SA Wettige Limiete',
    loanQuoteSubtitle:
      'Voer die geleende bedrag, fooie en terugbetaling van ’n uitlener of mashonisa in om die ware APR te sien en of dit NCA Regulasie 42 korttermynkredietlimiete oorskry.',
    loanPrincipalLabel: 'Kontant Geleen (R)',
    loanInputModeRepayment: 'Voer Totale Terugbetaling In (R)',
    loanInputModeMonthlyRate: 'Voer Maandelikse Rente In (%)',
    loanQuotedRepaymentLabel: 'Totale Terugbetaling Geëis (R)',
    loanMonthlyRateLabel: 'Gekwoteerde Maandelikse Rente (%)',
    loanExtraFeesLabel: 'Admin- / Inisiasie- / Invorderingsfooie (R)',
    loanTermDaysLabel: 'Leningstermyn (Dae)',
    loanFirstLoanToggle: 'Eerste korttermynlening vanjaar (5%/mnd limiet vs 3%/mnd herhaallimiet)',
    loanQuoteCardTitle: 'Uitlener Kwotasie-uiteensetting',
    loanNcaCapCardTitle: 'NCA Wettige Maksimum (Reg 42)',
    loanSelfBufferCardTitle: 'Jou Noodkussing',
    loanTotalRepayLabel: 'Totaal Terugbetaal',
    loanTotalCostLabel: 'Rente & Fooie Koste',
    loanEffectiveAprLabel: 'Jaarlikse Koers (APR)',
    loanStatusExceedsCap: 'Bo die NCA-korttermynlimiet in hierdie sakrekenaar. Gaan dit na by die Nasionale Kredietreguleerder voor jy teken.',
    loanStatusWithinCap: 'Binne NCA Korttermynlimiet — Kontroleer Steeds Bekostigbaarheid',
    loanOverchargeVsNcaLabel: 'Bo NCA wettige limiet met',
    loanSavedWithBufferLabel: 'Gespaar deur eie buffer te gebruik',
    loanNcaCitation:
      'Bron: Nasionale Kredietwet 34 van 2005, Regulasie 42 Korttermynkredietlimiete (GK R1080, Nov 2015 — maks 5%/mnd rente eerste lening of 3%/mnd herhaal, maks R165 + 10% inisiasie beperk tot 15% van hoofsom, maks R60/mnd diensfooi).',
    loanSaferAlternativesTitle: 'Veiliger Alternatiewe Voor Jy Leen',
    loanAlt1: 'Gebruik eers jou geregistreerde gemeenskap-stokvel se noodfonds of gesinskospot.',
    loanAlt2: 'Verifieer enige kredietverskaffer by die Nasionale Kredietreguleerder (NCR: 0860 627 627) en oorhandig nooit jou SASSA-kaart, ID-boek of PIN nie.',
    loanAlt3: 'Vra vir ’n munisipale, kliniek- of skoolfonds-afbetalingsreëling — formele instellings bied rentevrye planne.',
    loanEducationalDisclaimer:
      'Slegs Opvoedkundige Hulpmiddel: Berekeninge is ramings gebaseer op NCA-korttermynkredietlimiete vir finansiële geletterdheid en vorm nie formele finansiële of regsadvies nie.',
    loanProtectionBannerTitle:
      'NCA Lenerbeskerming — Oorhandig Nooit Jou SASSA-Kaart, ID of PIN Nie',
    loanProtectionBannerBody:
      'Ingevolge Artikels 90 & 133 van die Nasionale Kredietwet is dit ’n kriminele oortreding vir enige mashonisa of uitlener om jou bankkaart, SASSA-kaart, ID-boek of PIN as sekuriteit te hou, of vooraf-vrystellingsfooie te eis.',
    loanPredatoryWarningBannerTitle:
      'Uitbuitende Kwotasie-Waarskuwing — Oorskry SA NCA Wettige Limiet',
    loanPredatoryWarningBannerBodyPrefix:
      'Stop voor jy teken: Hierdie kwotasie vra',
    loanPredatoryWarningBannerBodySuffix:
      'bo die Regulasie 42 korttermynplafon. Moenie vooraf-fooie betaal nie — meld onwettige kredietvoorwaardes by die NCR aan op 0860 627 627.',
    loanLegalCautionBannerTitle:
      'Kostewaarskuwing — Binne Wettige NCA-Limiet, Maar Dra Steeds Rente & Fooie',
    loanLegalCautionBannerBodyPrefix:
      'Selfs binne wettige korttermynlimiete kos hierdie lening',
    loanLegalCautionBannerBodySuffix:
      'ekstra aan rente en fooie teenoor R 0.00 uit jou eie Noodspaargeld.',

    scamGuardTitle: 'Bedrog- & Vals Boodskap-toetser',
    scamGuardSub:
      'Toets verdagte SMS’e, WhatsApp-leningsaanbiedinge, SASSA-kennisgewings, werkfooie en kontantfooie privaat op jou foon',
    scamRuleBasedDisclaimerTitle: 'Op-Toestel Reëlgebaseerde Toetser — Verifieer Altyd Onafhanklik',
    scamRuleBasedDisclaimerBody:
      'Hierdie hulpmiddel toets bekende Suid-Afrikaanse bedrogpatrone vanlyn op jou foon. ’n Lae telling waarborg NIE dat ’n boodskap of persoon veilig is nie — nuwe slenters verskyn daagliks. Deel nooit jou PIN/OTP of betaal vooruitfooie nie.',
    scamHighRiskBannerTitle:
      'Hoërisiko Bedrogwaarskuwing — Stop en Stuur Geen Geld of Bewyse Nie',
    scamHighRiskBannerBody:
      'Verskeie bedrogtekens pas by hierdie versoek. Betaal nooit vooraf-lenings- of werkfooie nie, deel nooit jou PIN of OTP nie, en bevestig direk op ’n amptelike nommer.',
    scamCautionBannerTitle:
      'Versigtigheidswaarskuwing — Verdagte Risikotekens Opgespoor',
    scamCautionBannerBody:
      'Haal asem en bevestig self: Swendelaars gebruik dringendheid en onbekende nommers om oorplasings aan te jaag. Skakel eers direk voor jy betaal.',
    scamPasteLabel: 'Plak SMS, WhatsApp-Boodskap of Betalingsversoek',
    scamClearChecker: 'Vee toetser skoon',
    scamPlaceholder:
      'Plak die boodskap hier om te toets vir vooruitbetaalde leningslokvalle, werkuniformfooie, PIN/OTP-uitvissing, vals SASSA-skakels of onwettige kontantfooie...',
    scamPaymentDetailsTitle: 'Betaling- & Ontvangerbesonderhede (Opsioneel)',
    scamAddDetails: 'Voeg besonderhede by',
    scamHideDetails: 'Versteek besonderhede',
    scamRecipientNameLabel: 'Ontvangernaam of Kasregister',
    scamRecipientIdLabel: 'Ontvanger Foon of ID',
    scamAmountRequestedLabel: 'Bedrag Gevra (R)',
    scamPaymentTypeLabel: 'Betalingstipe',
    scamOpLoanFee: 'Vooraf-Lening / Vrystellingsfooi',
    scamOpCashOut: 'Kontant-Onttrekking / eWallet / Bewys',
    scamOpP2P: 'Persoon-tot-Persoon Oorplasing',
    scamOpMerchant: 'Gewone Goedere of Dienste',
    scamAgentFeeLabelPrefix: 'Agentfooi Geëis',
    scamUnregisteredLenderCheck: 'Ongeregistreerde uitlener (Nie-NCR)',
    scamNewRecipientCheck: 'Eerstekeer / onbekende ontvanger',
    scamReadyTitle: 'Gereed om Jou Boodskap Vanlyn te Toets',
    scamReadyBody:
      'Plak enige SMS of WhatsApp-boodskap hierbo. Jou boodskap bly 100% privaat op hierdie foon en word nooit opgelaai nie.',
    scamVerifyBtn: 'Verifieer Betalingsveiligheid',
    scamFraudReportBtn: 'Bedrogverslag',
    scamHideReportBtn: 'Versteek Verslag',
    scamWarningSignsHeading: 'Waarskuwingstekens Opgespoor',
    scamNoKnownPatternAdvice: 'Geen bekende patroon gevind — bevestig steeds telefonies voor betaling',
    scamBlockAdvice: 'MOENIE geld stuur nie — Blokkeer betaling',
    scamHelplinesTitle: 'Amptelike Suid-Afrikaanse Bedrog- & Krediethulplyne',
    scamHelplinesSub:
      'Geverifieerde nommers om bankbedrog, onwettige kaartterughouding of afpersing aan te meld',
    scamModalHighRiskBadge: 'HOËRISIKO BEDROGWAARSKUWING',
    scamModalListenHeading: 'Luister na Stemwaarskuwing Voor Jy Optree:',
    scamModalPlayBtn: 'Speel Stemwaarskuwing',
    scamModalStopBtn: 'Stop Stemwaarskuwing',
    scamModalMandatoryChecks: 'Verpligte Veiligheidstappe:',
    scamModalAckCheckbox:
      'Ek het hierdie versoek direk via ’n amptelike telefoonnommer bevestig en verstaan dat kontant of bewysstukke nie omgekeer kan word nie.',
    scamModalCancelBlockBtn: 'Kanselleer & Blokkeer Betaling (Aanbeveel)',
    scamModalProceedBtn: 'Ek Het Direk Bevestig — Gaan Voort',

    syncBadge: 'Vanlyn PWA-Berging · Interaktiewe USSD-Prototipe',
    syncTitle: 'Geen-Data Modus & USSD-Simulator',
    syncSub:
      'Jou grootboek werk reeds vanlyn op hierdie foon. Verken die interaktiewe *120*6664# USSD-simulator wat wys hoe knoppiefone inskakel.',
    ussdSimNoticeTitle: 'Interaktiewe USSD-Simulator (Prototipe)',
    ussdSimNoticeBody:
      'Die *120*6664# sleutelbord op hierdie skerm is ’n vanlyn simulasie gekoppel aan jou plaaslike grootboek — nog nie ’n lewendige netwerk-kortkode op selfoonnetwerke nie.',
    savedTransactionsLabel: 'Versleutelde Transaksies',
    activeSavingsPotsLabel: 'Aktiewe Spaarpotte',
    verifyLocalLedgerBtn: 'Herverifieer & Stoor Versleutelde Grootboek',
    verifyingLocalLedgerBtn: 'Versleutel & verifieer op foon...',
    offlineAirplaneGuarantee:
      'Jou saldo’s, potte en geskiedenis werk in Vliegtuigmodus sonder lugtyd of eksterne bedieners.',
    installHomeScreenHint:
      'Installeer MoniBuddy op jou tuisskerm sodat die hele app enige tyd vanlyn oopmaak.',
    ussdShortcodeCardTitle: 'Knoppiefoon USSD-Kanaalkonsep (*120*6664#)',
    ussdShortcodeCardBody:
      'Toets die interaktiewe sleutelbord om te sien hoe informele handelaars hul saldo nagaan, R50 na hul Noodfonds spaar, of R20 taxigeld aanteken.',
    launchSimulatorBtn: 'Begin USSD-Simulator',
    copyShortcodeBtn: 'Kopieer *120*6664#',
    copiedShortcodeBtn: 'Kode gekopieer',
    ussdSimulatorTag: 'SIMULATOR · VANLYN DEMO',
    ussdOpenMenuBtn: 'Begin *120*6664# Simulator',
    ussdCloseMenuBtn: 'Beëindig Sessie',
    ussdSendBtn: 'Stuur',

    techBadge: 'Argitektuur, Volhoubaarheid & Veiligheidsbeginsels',
    technicalBriefTitle: 'Hoe MoniBuddy Werk & Volhoubaar Groei',
    techSubtitle:
      'Gebou vir Suid-Afrikaanse informele verdieners: nul gebruikersfooie, nul dataverlies, ware AES-256-versleuteling en volhoubare B2B2C-vennootskappe.',
    techCap1Title: 'AES-256-GCM Versleutelde Vanlyn Berging',
    techCap1Body:
      'Grootboeke word plaaslik versleutel met WebCrypto AES-256-GCM en PBKDF2-SHA256 (100,000 iterasies) met selfgehuisveste lettertipes.',
    techCap2Title: 'Beskerming van Voorafbetaalde Lugtyd',
    techCap2Body:
      'Nul eksterne versoeke met oopmaak. Opsionele 35 MB vanlyn spraakmodelle laai nooit outomaties op mobiele data af nie.',
    techCap3Title: 'USSD- & Lae-Spesifikasie Toeganklikheid',
    techCap3Body:
      'Hoëkontras Groot Teks-modus, gesproke oudiogidse, 5 Suid-Afrikaanse tale en ’n sleng Touch Pad sonder tikwerk.',
    techCap4Title: 'Op-Toestel Bedrog- & NCA-Skild',
    techCap4Body:
      'Woordgrens-bedrogopsporing en Nasionale Kredietwet Regulasie 42 kredietlimiettoetse loop 100% plaaslik in < 5ms.',
    sustainabilityTitle: 'Volhoubaarheid & Nul-Gebruikersfooi Inkomstepad',
    sustainabilitySubtitle:
      'Hoe MoniBuddy 100% gratis bly vir informele verdieners terwyl dit volhoubaar oor Suid-Afrika skaal',
    sustModel1Title: '1. Geborgde Nul-Tarief Bank- & Telko-Lisensiëring (B2B2C)',
    sustModel1Body:
      'Kleinhandelbanke, mikro-versekeraars en selfoonnetwerke borg finansiële welstandmodules en nul-tarief USSD/PWA-gasheerdienste.',
    sustModel2Title: '2. Geregistreerde Stokvel- & Koöperasie-Tesourievlak',
    sustModel2Body:
      'Individuele begroting bly altyd gratis. Geformaliseerde stokvels, begrafnisverenigings en spaza-koöperasies betaal R49/maand vir gedeelde ouditstate.',
    sustModel3Title: '3. Inskryf-Koopbewys & Begrafnisdekking-Kortings',
    sustModel3Body:
      'Deursigtige, NCR/FSCA-gereguleerde handelaarkortings wanneer gebruikers vrywillig spaarpotte by kruidenierswinkels inwissel — nul woekerleningadvertensies.',
    dignityTitle: 'Ons Verbintenis tot Finansiële Waardigheid',
    dignitySubtitle: 'Ononderhandelbare etiese riglyne wat huishoudelike kontant beskerm',
    dignity1Title: 'Gratis vir Altyd vir Individue',
    dignity1Body: 'Elke spaarpot, noodbuffer, stem-/sleutelbordlogger en bedrogtoetser het nul intekenfooie.',
    dignity2Title: 'Nul Datamakelary',
    dignity2Body: 'Ons verkoop nooit bestedingsrekords, wys nooit mashonisa-advertensies of deel data met kredietburo’s nie.',
    dignity3Title: 'Gebou vir Onreëlmatige Kontantvloei',
    dignity3Body: 'Ontwerp rondom loswerkies, spaza-voorraadsiklusse, stokvels en Suid-Afrikaanse sleng.',

    privacyBadge: 'POPIA-Datasoewereiniteit · AES-256-GCM Plaaslike Versleuteling',
    privacyGuaranteeTitle: 'Jou Privaatheid & Databeheer',
    privacySubtitle: 'Volle eienaarskap oor jou versleutelde kontantrekords, rugsteune en onmiddellike uitwissing.',
    privacyMainHeading: 'Jou Rekords Bly Versleutel in Jou Eie Hande',
    privacyMainBody:
      'MoniBuddy vra nooit vir bankwagwoorde, ID-oplaaie of wolkaanmeldings nie. Elke rekening op hierdie toestel is geïsoleer en versleutel.',
    privacyPoint1Title: '01. PBKDF2-SHA256 + AES-256-GCM Versleuteling',
    privacyPoint1Body:
      'Jou PIN word versterk met 100,000 PBKDF2-HMAC-SHA256 iterasies en ’n unieke sout. Jou grootboek word met AES-256-GCM versleutel sodat saldo’s nooit in gewone teks gestoor word nie.',
    privacyPoint2Title: '02. Nul Spoorders, Advertensies of Wolkprofilering',
    privacyPoint2Body:
      'Nul analitiese skrifte, eksterne lettertipe-CDN’s of derdepartyspoorders word gelaai. Niemand monitor jou kontantvloei nie.',
    privacyPoint3Title: '03. Draagbare Rugsteun & Onmiddellike Uitwissing',
    privacyPoint3Body:
      'Voer ’n rugsteunlêer uit voor jy van foon verander, herstel ’n vorige rugsteun enige tyd, of vee jou rekords permanent uit.',
    downloadBackupBtn: 'Laai Rugsteun Af (.json)',
    restoreBackupBtn: 'Herstel Rugsteun',
    eraseLedgerBtn: 'Vee Grootboekdata Uit',
    eraseConfirmTitle: 'Vee Alle Grootboekrekords Uit?',
    eraseConfirmSub: 'Hierdie aksie kan nie ongedaan gemaak word nie',
    eraseConfirmBody:
      'Dit verwyder jou begingeld, spaarpotte, noodfonds en transaksiegeskiedenis vir hierdie rekening permanent van hierdie toestel.',
    eraseEverythingBtn: 'Vee Alles Uit',
    backupDownloadedMsg: 'Rugsteunlêer na jou toestel afgelaai. Hou hierdie lêer privaat.',
    backupRestoredMsg: 'Jou rugsteunlêer is herstel en in jou grootboek versleutel.',
    backupInvalidMsg: 'Kon nie rugsteunlêer lees nie. Kies asseblief ’n geldige MoniBuddy .json-rugsteun.',
    ledgerErasedMsg: 'Alle finansiële rekords vir hierdie rekening is van hierdie toestel uitgevee.',

    modalCreatePotTitle: 'Skep ’n Nuwe Spaarpot',
    modalChooseIcon: 'Kies ’n Ikoon',
    modalSavingForLabel: 'Waarvoor spaar jy?',
    modalSavingForPlaceholder: 'bv. Kruideniersware, Spaza-voorraad, Skoolskoene',
    modalTargetAmountLabel: 'Teikenbedrag (R)',
    modalCategoryLabel: 'Kategorie',
    modalCreatePotSubmit: 'Skep Pot',
    modalPutMoneyIn: 'Sit Geld In',
    modalTakeMoneyOut: 'Trek Geld Uit',
    modalCurrentlyInPot: 'Tans in hierdie pot:',
    modalAvailableSafeCash: 'Beskikbare Veilig-om-te-Spandeer:',
    modalSaveToPotBtn: 'Stoor in Pot',
    modalTakeOutCashBtn: 'Trek Kontant Uit',
    modalBufferTitle: 'Noodfonds',
    modalBufferSub: 'Jou selfbefondste huishoudelike kussing',
    modalUseBufferBtn: '- Gebruik Noodgeld',
    modalCurrentBufferLabel: 'Huidige Noodfonds:',
    modalReasonOptionalLabel: 'Rede (Opsioneel)',
    modalReasonPlaceholder: 'bv. Kliniekbesoek, vervoer, reëndag',
    modalSaveToFundBtn: 'Stoor in Fonds',
    modalWithdrawCashBtn: 'Onttrek Kontant',
    pwaInstallOfflineApp: 'Installeer Vanlyn App',
    pwaInstallOnIphone: 'Installeer op iPhone',
    pwaIosGuideTitle: 'Stoor MoniBuddy op Tuisskerm',
    pwaIosStep1: 'Tik die Deel-ikoon (Share) in jou Safari-nutsbalk.',
    pwaIosStep2: 'Tik Add to Home Screen om MoniBuddy enige tyd sonder data oop te maak.',
    pwaGotIt: 'Verstaan',

    audioGuides: {
      overview: {
        title: 'Veilig om te Spandeer & Spaarpotte',
        content:
          'Jou Veilig om te Spandeer-saldo bo-aan wys kontant wat jy vandag kan gebruik nadat jou spaarpotte en noodfonds beskerm is.',
        keyAdvice: 'Wenk: Selfs R20 per week in ’n kospot beskerm jou huishouding.'
      },
      income_expenses: {
        title: 'Geld In en Uit',
        content:
          'Teken inkomste en uitgawes aan met Stem, die nul-data Touch Pad of Handmatige Inskrywing. As jy ’n inskrywing uitvee, word die saldo outomaties teruggewerk.',
        keyAdvice: 'Wenk: Gebruik die Touch Pad wanneer jy vanlyn is sonder die stempakket.'
      },
      buffer_credit: {
        title: 'Noodfonds & Leningskwotasie-skild',
        content:
          'Voer enige leningskwotasie in om die koste teen Nasionale Kredietwet-limiete en jou eie nul-rente noodkussing te vergelyk.',
        keyAdvice: 'Wenk: Geregistreerde uitleners mag hoogstens 5 persent rente per maand op ’n eerste korttermynlening vra.'
      },
      scam_guard: {
        title: 'Bedrog- & Vals Boodskap-toetser',
        content:
          'Plak enige SMS of WhatsApp-boodskap om bekende Suid-Afrikaanse bedrogpatrone vanlyn te toets. Verifieer altyd telefonies.',
        keyAdvice: 'Wenk: Betaal nooit ’n vooruitbetaalde vrystellings- of uniformfooi per koopbewys nie.'
      },
      sync_2g: {
        title: 'Geen-Data Modus & USSD-Simulator',
        content:
          'MoniBuddy stoor jou versleutelde grootboek direk op jou foon. Toets die sterretjie 120 sterretjie 6664 hekkie USSD-simulator.',
        keyAdvice: 'Wenk: Installeer MoniBuddy op jou tuisskerm vir kitstoegang vanlyn.'
      },
      technical_brief: {
        title: 'Hoe MoniBuddy Werk & Volhoubaar Bly',
        content:
          'MoniBuddy kombineer AES-256 plaaslike versleuteling, lugtydbeskerming en ’n gratis B2B2C-volhoubaarheidsmodel.',
        keyAdvice: 'Wenk: Persoonlike begroting en bedrogbeskerming bly 100 persent gratis vir individue.'
      },
      privacy_legal: {
        title: 'Jou Privaatheid & Versleutelde Rugsteune',
        content:
          'Jou PIN word met PBKDF2 beskerm en jou grootboek is met AES-256-GCM versleutel. Laai ’n rugsteun af voor jy van foon verander.',
        keyAdvice: 'Wenk: Bewaar afgelaaide rugsteunlêers veilig.'
      }
    },
    authErrLedgerDecryptFailed: 'Kon nie veilige grootboek dekripteer nie. Verkeerde PIN of korrupte data.',
    warningUnencryptedLedger: 'Jou data is NIE op hierdie toestel versleutel nie omdat WebCrypto nie beskikbaar is nie.',
    authPinLengthHint: 'Aanbeveel: 6 of meer syfers',
    welcomeModalTitle: 'Welkom by MoniBuddy',
    welcomeModalStep1Title: '1. Veilig-om-te-spandeer Saldo',
    welcomeModalStep1Body: 'Jou Veilig-om-te-spandeer-saldo wys kontant wat jy vandag kan gebruik nadat jou spaarpotte en noodfonds beskerm is.',
    welcomeModalStep2Title: '2. Teken Inkomste & Uitgawes Aan',
    welcomeModalStep2Body: 'Teken kontant maklik aan met vanlyn stemherkenning, die nul-data Touch Pad of handmatige inskrywing.',
    welcomeModalStep3Title: '3. Noodfonds & Bedrogbeskerming',
    welcomeModalStep3Body: 'Bou jou huishoudelike noodkussing op en toets verdagte SMS- of WhatsApp-boodskappe vanlyn.',
    welcomeModalSkip: 'Slaan oor',
    welcomeModalNext: 'Volgende',
    welcomeModalFinish: 'Begin Nou',
    scamGuardDisclaimer: 'Let wel: Reëlgebaseerde bedrogbeskerming is heuristies en plaaslik. ’n Veilige resultaat waarborg nie dat ’n boodskap of persoon veilig is nie — nuwe bedrog verskyn daagliks. Verifieer altyd telefonies voor betaling.',
    loanAnnualisedCost: 'Jaarlikse koste (eenvoudig)',
    loanPrincipalMinError: 'Hoofsom moet ten minste R100 wees.',
    loanTermMinError: 'Termyn moet tussen 1 en 180 dae wees.',
    ussdDemoNotice: 'Demo USSD-transaksie gesimuleer vir vanlyn toetsing.',
    ussdDemoBadge: 'USSD Demo',
    sourceLabel: 'Bron',
    lastVerifiedLabel: 'Laas Geverifieer',
    unverifiedBadge: 'Ongeverifieer, kontak NCR',
    voiceOfflineNote: 'Stemherkenning vereis ’n netwerkverbinding of afgelaaide stempakket. Tik en raakpaneel werk altyd vanlyn.'
  }
};
