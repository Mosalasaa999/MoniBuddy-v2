import React, { createContext, useContext, useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Transaction, GoalPot, Language, NetworkMode, User, LedgerActionResult } from '../types';
import { translations } from '../translations';
import {
  PlainLedgerPayload,
  clearPinLockout,
  decryptLedgerEnvelope,
  deriveLedgerAesKey,
  derivePbkdf2PinHash,
  encryptLedgerPayload,
  generateRandomSaltHex,
  getPinLockoutRemainingSeconds,
  hasWebCryptoSubtle,
  isEncryptedLedgerEnvelope,
  parseLocalIsoDateMs,
  recordFailedPinAttempt,
  roundMoney,
  timingSafeEqualHex
} from '../cryptoLedger';
import {
  LedgerStateSnapshot,
  applyAddTransaction,
  applyBufferDeposit,
  applyBufferWithdraw,
  applyDeletePot,
  applyDeleteTransaction,
  applyPotDeposit,
  applyPotWithdraw,
  computeLedgerTotals
} from '../ledgerEngine';
import confetti from 'canvas-confetti';

interface BackupPayload {
  app?: string;
  version?: string;
  financialState?: {
    startingBalance?: number;
    emergencyBuffer?: number;
    burnRate?: number;
    pots?: GoalPot[];
    transactions?: Transaction[];
  };
}

export interface AuthAttemptResult {
  success: boolean;
  message?: string;
  lockedSeconds?: number;
}

interface AppContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  isLedgerEncrypted: boolean;
  hasRegisteredAccounts: boolean;
  rememberedIdentifier: string;
  login: (
    phoneOrEmail: string,
    pin: string,
    rememberIdentifier?: boolean
  ) => Promise<AuthAttemptResult>;
  register: (
    name: string,
    phone: string,
    pin: string,
    email?: string
  ) => Promise<AuthAttemptResult>;
  loginWithGoogle: (
    googleEmail: string,
    googleName?: string,
    phone?: string,
    pin?: string
  ) => Promise<AuthAttemptResult>;
  syncGoogleBackup: () => Promise<void>;
  logout: () => void;

  language: Language;
  setLanguage: (lang: Language) => void;
  largeText: boolean;
  toggleLargeText: () => void;

  networkMode: NetworkMode;
  isOnline: boolean;
  lastSavedAt: string | null;
  isReconciling: boolean;
  syncLedger: () => Promise<void>;

  startingBalance: number;
  setStartingBalance: (val: number) => void;

  emergencyBuffer: number;
  addToBuffer: (amount: number, note?: string) => LedgerActionResult;
  withdrawFromBuffer: (amount: number, note?: string) => LedgerActionResult;

  burnRate: number;
  setBurnRate: (val: number) => void;

  pots: GoalPot[];
  createPot: (pot: Omit<GoalPot, 'id' | 'createdAt' | 'currentAmount'>) => void;
  depositToPot: (potId: string, amount: number) => LedgerActionResult;
  withdrawFromPot: (potId: string, amount: number) => LedgerActionResult;
  deletePot: (potId: string) => void;

  transactions: Transaction[];
  addTransaction: (tx: Omit<Transaction, 'id' | 'timestamp' | 'synced'>) => void;
  deleteTransaction: (id: string) => void;

  // Computed values
  totalIncome: number;
  totalExpenses: number;
  totalGoalSavings: number;
  safeToSpend: number;
  isOverspent: boolean;
  weeksBufferCovers: number;
  estimatedMonthEndSafe: number | null;

  // Audio Guide
  isSpeaking: boolean;
  activeSpeechText: string | null;
  speakText: (text: string, langOverride?: string) => void;
  stopSpeaking: () => void;

  // Data Sovereignty Controls
  resetAllData: () => void;
  importBackupData: (rawJson: string) => { success: boolean; message: string };
  t: (typeof translations)['en'];
}

const AppContext = createContext<AppContextType | null>(null);

const REMEMBERED_ID_KEY = 'monibuddy_remembered_id_v3';
const USERS_STORAGE_KEY = 'monibuddy_accounts_v3';
const LEGACY_USERS_KEY = 'monibuddy_accounts_v2';
const LANGUAGE_STORAGE_KEY = 'monibuddy_language_v2';
const LARGE_TEXT_STORAGE_KEY = 'monibuddy_large_text_v1';

const getLedgerStorageKey = (userId: string) => `monibuddy_ledger_v3_${userId}`;
const getLegacyLedgerStorageKey = (userId: string) => `monibuddy_ledger_v2_${userId}`;

interface NetworkInfoLike extends EventTarget {
  readonly effectiveType?: 'slow-2g' | '2g' | '3g' | '4g';
}

const detectLiveNetworkMode = (): NetworkMode => {
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    return 'offline';
  }
  const nav = navigator as Navigator & {
    connection?: NetworkInfoLike;
    mozConnection?: NetworkInfoLike;
    webkitConnection?: NetworkInfoLike;
  };
  const conn = nav.connection ?? nav.mozConnection ?? nav.webkitConnection;
  if (conn?.effectiveType === 'slow-2g' || conn?.effectiveType === '2g') {
    return '2g';
  }
  return '4g';
};

// Legacy synchronous SHA-256 fallback ONLY for migrating existing v2 accounts or non-HTTPS LAN dev origins
const SHA256_K = new Uint32Array([
  0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
  0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
  0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
  0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
  0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
  0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
  0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
  0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
]);

const rotr = (x: number, n: number) => (x >>> n) | (x << (32 - n));

const legacySha256Hex = (input: string): string => {
  const bytes = new TextEncoder().encode(input);
  const bitLen = bytes.length * 8;
  const paddedLen = Math.ceil((bytes.length + 9) / 64) * 64;
  const buf = new Uint8Array(paddedLen);
  buf.set(bytes);
  buf[bytes.length] = 0x80;
  const view = new DataView(buf.buffer);
  view.setUint32(paddedLen - 4, bitLen >>> 0, false);
  view.setUint32(paddedLen - 8, Math.floor(bitLen / 0x100000000), false);

  let h0 = 0x6a09e667;
  let h1 = 0xbb67ae85;
  let h2 = 0x3c6ef372;
  let h3 = 0xa54ff53a;
  let h4 = 0x510e527f;
  let h5 = 0x9b05688c;
  let h6 = 0x1f83d9ab;
  let h7 = 0x5be0cd19;

  const w = new Uint32Array(64);
  for (let offset = 0; offset < paddedLen; offset += 64) {
    for (let i = 0; i < 16; i++) {
      w[i] = view.getUint32(offset + i * 4, false);
    }
    for (let i = 16; i < 64; i++) {
      const s0 = rotr(w[i - 15], 7) ^ rotr(w[i - 15], 18) ^ (w[i - 15] >>> 3);
      const s1 = rotr(w[i - 2], 17) ^ rotr(w[i - 2], 19) ^ (w[i - 2] >>> 10);
      w[i] = (w[i - 16] + s0 + w[i - 7] + s1) >>> 0;
    }

    let a = h0;
    let b = h1;
    let c = h2;
    let d = h3;
    let e = h4;
    let f = h5;
    let g = h6;
    let h = h7;

    for (let i = 0; i < 64; i++) {
      const S1 = rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25);
      const ch = (e & f) ^ (~e & g);
      const temp1 = (h + S1 + ch + SHA256_K[i] + w[i]) >>> 0;
      const S0 = rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22);
      const maj = (a & b) ^ (a & c) ^ (b & c);
      const temp2 = (S0 + maj) >>> 0;

      h = g;
      g = f;
      f = e;
      e = (d + temp1) >>> 0;
      d = c;
      c = b;
      b = a;
      a = (temp1 + temp2) >>> 0;
    }

    h0 = (h0 + a) >>> 0;
    h1 = (h1 + b) >>> 0;
    h2 = (h2 + c) >>> 0;
    h3 = (h3 + d) >>> 0;
    h4 = (h4 + e) >>> 0;
    h5 = (h5 + f) >>> 0;
    h6 = (h6 + g) >>> 0;
    h7 = (h7 + h) >>> 0;
  }

  return [h0, h1, h2, h3, h4, h5, h6, h7]
    .map(n => n.toString(16).padStart(8, '0'))
    .join('');
};

const normalizePhoneDigits = (phone: string): string => phone.replace(/\s+/g, '').trim();

const hashLegacyUserPin = (phone: string, pin: string): string =>
  legacySha256Hex(`monibuddy_pin_v2:${normalizePhoneDigits(phone)}:${pin.trim()}`);

const EMPTY_LEDGER: LedgerStateSnapshot = {
  startingBalance: 0,
  emergencyBuffer: 0,
  burnRate: 250,
  pots: [],
  transactions: []
};

const loadInitialUsers = (): User[] => {
  try {
    const v3Raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (v3Raw) {
      const parsed = JSON.parse(v3Raw);
      if (Array.isArray(parsed)) return parsed;
    }
    const legacyRaw = localStorage.getItem(LEGACY_USERS_KEY);
    if (legacyRaw) {
      const parsed = JSON.parse(legacyRaw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    // ignore
  }
  return [];
};

const loadRememberedIdentifier = (): string => {
  try {
    return localStorage.getItem(REMEMBERED_ID_KEY) ?? '';
  } catch {
    return '';
  }
};

const loadInitialLanguage = (): Language => {
  try {
    const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (saved === 'en' || saved === 'zu' || saved === 'xh' || saved === 'st' || saved === 'af') {
      return saved;
    }
  } catch {
    // ignore
  }
  return 'en';
};

const loadInitialLargeText = (): boolean => {
  try {
    return localStorage.getItem(LARGE_TEXT_STORAGE_KEY) === '1';
  } catch {
    return false;
  }
};

const triggerMilestoneConfetti = () => {
  if (
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  ) {
    return;
  }
  try {
    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.6 }
    });
  } catch {
    // ignore
  }
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [registeredUsers, setRegisteredUsers] = useState<User[]>(loadInitialUsers);
  // Never auto-authenticate without PIN entry because AES-256-GCM key lives strictly in RAM
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [rememberedIdentifier, setRememberedIdentifier] = useState<string>(
    loadRememberedIdentifier
  );
  const [isLedgerEncrypted, setIsLedgerEncrypted] = useState<boolean>(false);

  const [language, setLanguageState] = useState<Language>(loadInitialLanguage);
  const [largeText, setLargeText] = useState<boolean>(loadInitialLargeText);
  const [networkMode, setNetworkMode] = useState<NetworkMode>(detectLiveNetworkMode);
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
  const [isReconciling, setIsReconciling] = useState<boolean>(false);

  const [ledger, setLedger] = useState<LedgerStateSnapshot>(EMPTY_LEDGER);

  const activeAesKeyRef = useRef<CryptoKey | null>(null);
  const hydratedUserIdRef = useRef<string | null>(null);
  const saveSequenceRef = useRef<number>(0);

  // Audio Guide state
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [activeSpeechText, setActiveSpeechText] = useState<string | null>(null);

  const t = translations[language];

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
    } catch {
      // ignore
    }
  };

  const toggleLargeText = () => {
    setLargeText(prev => {
      const next = !prev;
      try {
        localStorage.setItem(LARGE_TEXT_STORAGE_KEY, next ? '1' : '0');
      } catch {
        // ignore
      }
      return next;
    });
  };

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('large-text', largeText);
      document.documentElement.lang = language;
    }
  }, [largeText, language]);

  // Monitor real browser & carrier connection state
  useEffect(() => {
    const handleConnectionChange = () => {
      setNetworkMode(detectLiveNetworkMode());
    };
    window.addEventListener('online', handleConnectionChange);
    window.addEventListener('offline', handleConnectionChange);

    const nav = navigator as Navigator & {
      connection?: NetworkInfoLike;
      mozConnection?: NetworkInfoLike;
      webkitConnection?: NetworkInfoLike;
    };
    const conn = nav.connection ?? nav.mozConnection ?? nav.webkitConnection;
    conn?.addEventListener?.('change', handleConnectionChange);

    return () => {
      window.removeEventListener('online', handleConnectionChange);
      window.removeEventListener('offline', handleConnectionChange);
      conn?.removeEventListener?.('change', handleConnectionChange);
    };
  }, []);

  const persistEncryptedLedger = useCallback(
    async (userId: string, snapshot: LedgerStateSnapshot, key: CryptoKey | null) => {
      const seq = ++saveSequenceRef.current;
      const nowFormatted = new Date().toLocaleTimeString('en-ZA', {
        hour: '2-digit',
        minute: '2-digit'
      });

      const payload: PlainLedgerPayload = {
        startingBalance: roundMoney(snapshot.startingBalance),
        emergencyBuffer: roundMoney(snapshot.emergencyBuffer),
        burnRate: roundMoney(snapshot.burnRate),
        pots: snapshot.pots,
        transactions: snapshot.transactions,
        updatedAt: nowFormatted
      };

      try {
        if (key && hasWebCryptoSubtle()) {
          const envelope = await encryptLedgerPayload(payload, key);
          if (seq !== saveSequenceRef.current) return;
          localStorage.setItem(getLedgerStorageKey(userId), JSON.stringify(envelope));
          localStorage.removeItem(getLegacyLedgerStorageKey(userId));
          setIsLedgerEncrypted(true);
        } else {
          localStorage.setItem(getLedgerStorageKey(userId), JSON.stringify(payload));
          setIsLedgerEncrypted(false);
        }
        setLastSavedAt(nowFormatted);
      } catch {
        // ignore storage quota errors
      }
    },
    []
  );

  // Persist isolated encrypted ledger whenever authenticated user's data changes
  useEffect(() => {
    if (!currentUser || hydratedUserIdRef.current !== currentUser.id) return;
    void persistEncryptedLedger(currentUser.id, ledger, activeAesKeyRef.current);
  }, [currentUser, ledger, persistEncryptedLedger]);

  // Computed values using exact integer-cent math
  const { totalIncome, totalExpenses, totalGoalSavings, safeToSpend, isOverspent } = useMemo(
    () => computeLedgerTotals(ledger),
    [ledger]
  );

  const weeksBufferCovers = useMemo(() => {
    if (ledger.burnRate <= 0) return 0;
    return Number((ledger.emergencyBuffer / ledger.burnRate).toFixed(1));
  }, [ledger.emergencyBuffer, ledger.burnRate]);

  const estimatedMonthEndSafe = useMemo(() => {
    const expenseTx = ledger.transactions.filter(tx => tx.type === 'expense');
    if (expenseTx.length < 3) return null;

    const timestamps = expenseTx
      .map(tx => parseLocalIsoDateMs(tx.date))
      .sort((a, b) => a - b);
    const daySpan = Math.max(
      1,
      (timestamps[timestamps.length - 1] - timestamps[0]) / (1000 * 60 * 60 * 24)
    );

    if (daySpan < 5) return null;

    const dailyExpenseRate = totalExpenses / daySpan;
    const now = new Date();
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const daysRemaining = Math.max(1, daysInMonth - now.getDate());
    const projectedRemainingExpenses = dailyExpenseRate * daysRemaining;

    return roundMoney(safeToSpend - projectedRemainingExpenses);
  }, [ledger.transactions, totalExpenses, safeToSpend]);

  // Auth Handlers (Async PBKDF2-HMAC-SHA256 100k iterations + AES-256-GCM key derivation + 5-attempt lockout)
  const login = async (
    phoneOrEmail: string,
    pin: string,
    rememberIdentifier = true
  ): Promise<AuthAttemptResult> => {
    const cleanQuery = phoneOrEmail.trim().toLowerCase();
    const cleanPhoneDigits = normalizePhoneDigits(phoneOrEmail);
    const cleanPin = pin.trim();

    if (!cleanQuery || !cleanPin) {
      return { success: false, message: t.authErrMissingCredentials };
    }

    const lockoutKey = cleanPhoneDigits || cleanQuery;
    const lockedRemaining = getPinLockoutRemainingSeconds(lockoutKey);
    if (lockedRemaining > 0) {
      return {
        success: false,
        lockedSeconds: lockedRemaining,
        message: `${t.authErrPinLockedPrefix} ${lockedRemaining} ${t.authErrPinLockedSuffix}`
      };
    }

    const candidateUser = registeredUsers.find(u => {
      const userPhoneDigits = normalizePhoneDigits(u.phone);
      return (
        userPhoneDigits === cleanPhoneDigits ||
        Boolean(u.email && u.email.toLowerCase() === cleanQuery)
      );
    });

    if (!candidateUser) {
      const fail = recordFailedPinAttempt(lockoutKey);
      if (fail.locked) {
        return {
          success: false,
          lockedSeconds: fail.remainingSeconds,
          message: `${t.authErrPinLockedPrefix} ${fail.remainingSeconds} ${t.authErrPinLockedSuffix}`
        };
      }
      return {
        success: false,
        message: `${t.authErrIncorrectCredentials} ${t.authErrAttemptsLeftPrefix} ${fail.attemptsLeft}`
      };
    }

    let pinVerified = false;
    let upgradedUser = candidateUser;
    let derivedAesKey: CryptoKey | null = null;

    if (
      candidateUser.kdf === 'PBKDF2-SHA256-100K' &&
      candidateUser.pinSalt &&
      hasWebCryptoSubtle()
    ) {
      const candidateHash = await derivePbkdf2PinHash(cleanPin, candidateUser.pinSalt);
      pinVerified = timingSafeEqualHex(candidateHash, candidateUser.pinHash);
      if (pinVerified) {
        const ledgerSalt = candidateUser.ledgerSalt || candidateUser.pinSalt;
        derivedAesKey = await deriveLedgerAesKey(cleanPin, ledgerSalt);
      }
    } else {
      // Legacy SHA-256 verification and automatic transparent upgrade to PBKDF2 + AES-256-GCM
      const legacyHash = hashLegacyUserPin(candidateUser.phone, cleanPin);
      pinVerified = timingSafeEqualHex(legacyHash, candidateUser.pinHash);
      if (pinVerified && hasWebCryptoSubtle()) {
        const newPinSalt = generateRandomSaltHex(16);
        const newLedgerSalt = generateRandomSaltHex(16);
        const upgradedPinHash = await derivePbkdf2PinHash(cleanPin, newPinSalt);
        derivedAesKey = await deriveLedgerAesKey(cleanPin, newLedgerSalt);
        upgradedUser = {
          ...candidateUser,
          pinHash: upgradedPinHash,
          pinSalt: newPinSalt,
          ledgerSalt: newLedgerSalt,
          kdf: 'PBKDF2-SHA256-100K'
        };
        const nextUsers = registeredUsers.map(u =>
          u.id === upgradedUser.id ? upgradedUser : u
        );
        setRegisteredUsers(nextUsers);
        try {
          localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(nextUsers));
          localStorage.removeItem(LEGACY_USERS_KEY);
        } catch {
          // ignore
        }
      }
    }

    if (!pinVerified) {
      const fail = recordFailedPinAttempt(lockoutKey);
      if (fail.locked) {
        return {
          success: false,
          lockedSeconds: fail.remainingSeconds,
          message: `${t.authErrPinLockedPrefix} ${fail.remainingSeconds} ${t.authErrPinLockedSuffix}`
        };
      }
      return {
        success: false,
        message: `${t.authErrIncorrectCredentials} ${t.authErrAttemptsLeftPrefix} ${fail.attemptsLeft}`
      };
    }

    clearPinLockout(lockoutKey);

    // Decrypt or migrate user's isolated ledger before unlocking UI
    let loadedSnapshot: LedgerStateSnapshot = EMPTY_LEDGER;
    let loadedUpdatedAt: string | null = null;

    try {
      const rawV3 = localStorage.getItem(getLedgerStorageKey(upgradedUser.id));
      const rawLegacy = localStorage.getItem(getLegacyLedgerStorageKey(upgradedUser.id));
      const rawSource = rawV3 ?? rawLegacy;

      if (rawSource) {
        const parsed = JSON.parse(rawSource);
        if (isEncryptedLedgerEnvelope(parsed) && derivedAesKey) {
          const decrypted = await decryptLedgerEnvelope(parsed, derivedAesKey);
          loadedSnapshot = {
            startingBalance:
              typeof decrypted.startingBalance === 'number'
                ? roundMoney(decrypted.startingBalance)
                : 0,
            emergencyBuffer:
              typeof decrypted.emergencyBuffer === 'number'
                ? roundMoney(decrypted.emergencyBuffer)
                : 0,
            burnRate:
              typeof decrypted.burnRate === 'number' ? roundMoney(decrypted.burnRate) : 250,
            pots: Array.isArray(decrypted.pots) ? decrypted.pots : [],
            transactions: Array.isArray(decrypted.transactions) ? decrypted.transactions : []
          };
          loadedUpdatedAt =
            typeof decrypted.updatedAt === 'string' ? decrypted.updatedAt : null;
        } else if (parsed && typeof parsed === 'object') {
          loadedSnapshot = {
            startingBalance:
              typeof parsed.startingBalance === 'number'
                ? roundMoney(parsed.startingBalance)
                : 0,
            emergencyBuffer:
              typeof parsed.emergencyBuffer === 'number'
                ? roundMoney(parsed.emergencyBuffer)
                : 0,
            burnRate:
              typeof parsed.burnRate === 'number' ? roundMoney(parsed.burnRate) : 250,
            pots: Array.isArray(parsed.pots) ? parsed.pots : [],
            transactions: Array.isArray(parsed.transactions) ? parsed.transactions : []
          };
          loadedUpdatedAt = typeof parsed.updatedAt === 'string' ? parsed.updatedAt : null;
        }
      }
    } catch {
      loadedSnapshot = EMPTY_LEDGER;
    }

    activeAesKeyRef.current = derivedAesKey;
    setIsLedgerEncrypted(Boolean(derivedAesKey && hasWebCryptoSubtle()));
    setLedger(loadedSnapshot);
    setLastSavedAt(loadedUpdatedAt);
    hydratedUserIdRef.current = upgradedUser.id;
    setCurrentUser(upgradedUser);

    try {
      if (rememberIdentifier) {
        localStorage.setItem(REMEMBERED_ID_KEY, upgradedUser.phone);
        setRememberedIdentifier(upgradedUser.phone);
      } else {
        localStorage.removeItem(REMEMBERED_ID_KEY);
        setRememberedIdentifier('');
      }
    } catch {
      // ignore
    }

    return { success: true };
  };

  const register = async (
    name: string,
    phone: string,
    pin: string,
    email?: string
  ): Promise<AuthAttemptResult> => {
    const cleanName = name.trim();
    const cleanPhone = phone.trim();
    const cleanPin = pin.trim();

    if (!cleanName) {
      return { success: false, message: t.authErrMissingName };
    }
    const cleanDigits = normalizePhoneDigits(cleanPhone);
    if (cleanDigits.length < 9) {
      return { success: false, message: t.authErrInvalidPhone };
    }
    if (!/^\d{4,8}$/.test(cleanPin)) {
      return { success: false, message: t.authErrInvalidPinFormat };
    }

    const existing = registeredUsers.find(u => normalizePhoneDigits(u.phone) === cleanDigits);
    if (existing) {
      return { success: false, message: t.authErrAccountExists };
    }

    let pinHash: string;
    let pinSalt: string | undefined;
    let ledgerSalt: string | undefined;
    let kdf: User['kdf'];
    let derivedAesKey: CryptoKey | null = null;

    if (hasWebCryptoSubtle()) {
      pinSalt = generateRandomSaltHex(16);
      ledgerSalt = generateRandomSaltHex(16);
      pinHash = await derivePbkdf2PinHash(cleanPin, pinSalt);
      derivedAesKey = await deriveLedgerAesKey(cleanPin, ledgerSalt);
      kdf = 'PBKDF2-SHA256-100K';
    } else {
      pinHash = hashLegacyUserPin(cleanPhone, cleanPin);
      kdf = 'SHA256-LEGACY';
    }

    const newUser: User = {
      id: 'usr_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      name: cleanName,
      phone: cleanPhone,
      pinHash,
      pinSalt,
      ledgerSalt,
      kdf,
      email: email?.trim() || undefined,
      createdAt: new Date().toISOString()
    };

    const updated = [...registeredUsers, newUser];
    setRegisteredUsers(updated);
    try {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updated));
      localStorage.setItem(REMEMBERED_ID_KEY, newUser.phone);
      setRememberedIdentifier(newUser.phone);
    } catch {
      // ignore
    }

    activeAesKeyRef.current = derivedAesKey;
    setIsLedgerEncrypted(Boolean(derivedAesKey && hasWebCryptoSubtle()));
    setLedger(EMPTY_LEDGER);
    setLastSavedAt(null);
    hydratedUserIdRef.current = newUser.id;
    setCurrentUser(newUser);

    return { success: true };
  };

  const logout = () => {
    stopSpeaking();
    activeAesKeyRef.current = null;
    hydratedUserIdRef.current = null;
    setCurrentUser(null);
    setLedger(EMPTY_LEDGER);
    setLastSavedAt(null);
    setIsLedgerEncrypted(false);
  };

  const loginWithGoogle = async (
    googleEmail: string,
    googleName?: string,
    phone?: string,
    pin?: string
  ): Promise<AuthAttemptResult> => {
    const cleanEmail = googleEmail.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      return { success: false, message: t.googleLoginError };
    }

    const name = googleName?.trim() || cleanEmail.split('@')[0] || 'Google User';
    const cleanPhone = phone ? normalizePhoneDigits(phone) : ('082' + Math.floor(1000000 + Math.random() * 9000000));
    const cleanPin = pin?.trim() || '123456';

    let user = registeredUsers.find(
      u => u.email?.toLowerCase() === cleanEmail || (phone && normalizePhoneDigits(u.phone) === cleanPhone)
    );

    if (!user) {
      if (cleanPhone.length < 9) {
        return { success: false, message: t.authErrInvalidPhone };
      }
      if (!/^\d{4,8}$/.test(cleanPin)) {
        return { success: false, message: t.authErrInvalidPinFormat };
      }

      const pinSalt = hasWebCryptoSubtle() ? generateRandomSaltHex(16) : undefined;
      const ledgerSalt = hasWebCryptoSubtle() ? generateRandomSaltHex(16) : undefined;
      const pinHash = hasWebCryptoSubtle()
        ? await derivePbkdf2PinHash(cleanPin, pinSalt!)
        : legacySha256Hex(cleanPhone + cleanPin);
      const derivedAesKey = hasWebCryptoSubtle() ? await deriveLedgerAesKey(cleanPin, ledgerSalt!) : null;

      user = {
        id: 'usr_g_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
        name,
        phone: cleanPhone,
        email: cleanEmail,
        pinHash,
        pinSalt,
        ledgerSalt,
        kdf: hasWebCryptoSubtle() ? 'PBKDF2-SHA256-100K' : 'SHA256-LEGACY',
        createdAt: new Date().toISOString()
      };

      const updated = [...registeredUsers, user];
      setRegisteredUsers(updated);
      try {
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updated));
        localStorage.setItem(REMEMBERED_ID_KEY, user.phone);
        setRememberedIdentifier(user.phone);
      } catch {
        // ignore
      }
      activeAesKeyRef.current = derivedAesKey;
      setIsLedgerEncrypted(Boolean(derivedAesKey && hasWebCryptoSubtle()));
      setLedger(EMPTY_LEDGER);
      setLastSavedAt(new Date().toISOString());
      hydratedUserIdRef.current = user.id;
      setCurrentUser(user);

      return { success: true };
    } else {
      let derivedAesKey: CryptoKey | null = null;
      if (hasWebCryptoSubtle() && user.ledgerSalt) {
        derivedAesKey = await deriveLedgerAesKey(cleanPin, user.ledgerSalt);
      }

      let loadedSnapshot: LedgerStateSnapshot = EMPTY_LEDGER;
      let loadedUpdatedAt: string | null = null;
      try {
        const rawV3 = localStorage.getItem(getLedgerStorageKey(user.id));
        const rawLegacy = localStorage.getItem(getLegacyLedgerStorageKey(user.id));
        const rawSource = rawV3 ?? rawLegacy;
        if (rawSource) {
          const parsed = JSON.parse(rawSource);
          if (isEncryptedLedgerEnvelope(parsed) && derivedAesKey) {
            const decrypted = await decryptLedgerEnvelope(parsed, derivedAesKey);
            loadedSnapshot = {
              startingBalance: typeof decrypted.startingBalance === 'number' ? roundMoney(decrypted.startingBalance) : 0,
              emergencyBuffer: typeof decrypted.emergencyBuffer === 'number' ? roundMoney(decrypted.emergencyBuffer) : 0,
              burnRate: typeof decrypted.burnRate === 'number' ? roundMoney(decrypted.burnRate) : 250,
              pots: Array.isArray(decrypted.pots) ? decrypted.pots : [],
              transactions: Array.isArray(decrypted.transactions) ? decrypted.transactions : []
            };
            loadedUpdatedAt = typeof decrypted.updatedAt === 'string' ? decrypted.updatedAt : null;
          } else if (parsed && typeof parsed === 'object') {
            loadedSnapshot = {
              startingBalance: typeof parsed.startingBalance === 'number' ? roundMoney(parsed.startingBalance) : 0,
              emergencyBuffer: typeof parsed.emergencyBuffer === 'number' ? roundMoney(parsed.emergencyBuffer) : 0,
              burnRate: typeof parsed.burnRate === 'number' ? roundMoney(parsed.burnRate) : 250,
              pots: Array.isArray(parsed.pots) ? parsed.pots : [],
              transactions: Array.isArray(parsed.transactions) ? parsed.transactions : []
            };
            loadedUpdatedAt = typeof parsed.updatedAt === 'string' ? parsed.updatedAt : null;
          }
        }
      } catch {
        loadedSnapshot = EMPTY_LEDGER;
      }

      activeAesKeyRef.current = derivedAesKey;
      setIsLedgerEncrypted(Boolean(derivedAesKey && hasWebCryptoSubtle()));
      setLedger(loadedSnapshot);
      setLastSavedAt(loadedUpdatedAt || new Date().toISOString());
      hydratedUserIdRef.current = user.id;
      setCurrentUser(user);
    }

    try {
      const backupPayload = {
        app: 'MoniBuddy',
        version: '3.0',
        userEmail: cleanEmail,
        backedUpAt: new Date().toISOString(),
        financialState: ledger
      };
      localStorage.setItem(`monibuddy_google_backup_${user.id}`, JSON.stringify(backupPayload));
      setLastSavedAt(new Date().toISOString());
    } catch {
      // ignore
    }

    return { success: true, message: t.googleLoginSuccess };
  };

  const syncGoogleBackup = async () => {
    if (!currentUser) return;
    try {
      const backupPayload = {
        app: 'MoniBuddy',
        version: '3.0',
        userEmail: currentUser.email || 'user@gmail.com',
        backedUpAt: new Date().toISOString(),
        financialState: ledger
      };
      localStorage.setItem(`monibuddy_google_backup_${currentUser.id}`, JSON.stringify(backupPayload));
      setLastSavedAt(new Date().toISOString());
    } catch {
      // ignore
    }
  };

  // Ledger Handlers (Exact cent arithmetic + reversal + cash validation)
  const setStartingBalance = (val: number) => {
    const clean = roundMoney(Math.max(0, Number.isFinite(val) ? val : 0));
    setLedger(prev => ({ ...prev, startingBalance: clean }));
  };

  const setBurnRate = (val: number) => {
    const clean = roundMoney(Math.max(10, Number.isFinite(val) ? val : 250));
    setLedger(prev => ({ ...prev, burnRate: clean }));
  };

  const addTransaction = (tx: Omit<Transaction, 'id' | 'timestamp' | 'synced'>) => {
    setLedger(prev => {
      const res = applyAddTransaction(prev, tx, networkMode !== 'offline');
      return res.ok ? res.nextState : prev;
    });
  };

  const deleteTransaction = (id: string) => {
    setLedger(prev => applyDeleteTransaction(prev, id));
  };

  const mapOutcomeToActionResult = (errorCode?: string): LedgerActionResult => {
    if (!errorCode) return { ok: true };
    if (errorCode === 'INSUFFICIENT_SAFE_CASH') {
      return { ok: false, error: t.insufficientSafeCashError };
    }
    if (errorCode === 'INSUFFICIENT_BUFFER') {
      return { ok: false, error: t.insufficientBufferError };
    }
    if (errorCode === 'INSUFFICIENT_POT') {
      return { ok: false, error: t.insufficientPotError };
    }
    return { ok: false, error: t.insufficientSafeCashError };
  };

  const addToBuffer = (amount: number, note?: string): LedgerActionResult => {
    const outcome = applyBufferDeposit(ledger, amount, {
      note,
      synced: networkMode !== 'offline'
    });
    if (!outcome.ok) {
      return mapOutcomeToActionResult(outcome.errorCode);
    }
    setLedger(outcome.nextState);
    return { ok: true };
  };

  const withdrawFromBuffer = (amount: number, note?: string): LedgerActionResult => {
    const outcome = applyBufferWithdraw(ledger, amount, {
      note,
      synced: networkMode !== 'offline'
    });
    if (!outcome.ok) {
      return mapOutcomeToActionResult(outcome.errorCode);
    }
    setLedger(outcome.nextState);
    return { ok: true };
  };

  const createPot = (potData: Omit<GoalPot, 'id' | 'createdAt' | 'currentAmount'>) => {
    const newPot: GoalPot = {
      ...potData,
      targetAmount: roundMoney(Math.max(1, potData.targetAmount)),
      id: 'pot_' + Date.now() + '_' + Math.random().toString(36).substring(2, 5),
      currentAmount: 0,
      createdAt: new Date().toISOString()
    };
    setLedger(prev => ({ ...prev, pots: [...prev.pots, newPot] }));
  };

  const depositToPot = (potId: string, amount: number): LedgerActionResult => {
    const outcome = applyPotDeposit(ledger, potId, amount, {
      synced: networkMode !== 'offline'
    });
    if (!outcome.ok) {
      return mapOutcomeToActionResult(outcome.errorCode);
    }
    if (outcome.goalJustReached) {
      triggerMilestoneConfetti();
    }
    setLedger(outcome.nextState);
    return { ok: true };
  };

  const withdrawFromPot = (potId: string, amount: number): LedgerActionResult => {
    const outcome = applyPotWithdraw(ledger, potId, amount, {
      synced: networkMode !== 'offline'
    });
    if (!outcome.ok) {
      return mapOutcomeToActionResult(outcome.errorCode);
    }
    setLedger(outcome.nextState);
    return { ok: true };
  };

  const deletePot = (potId: string): LedgerActionResult => {
    const outcome = applyDeletePot(ledger, potId, { synced: networkMode !== 'offline' });
    if (!outcome.ok) {
      return mapOutcomeToActionResult(outcome.errorCode);
    }
    setLedger(outcome.nextState);
    return { ok: true };
  };

  const syncLedger = async () => {
    setIsReconciling(true);
    await new Promise(resolve => setTimeout(resolve, 180));
    const syncedSnapshot: LedgerStateSnapshot = {
      ...ledger,
      transactions: ledger.transactions.map(tx => ({ ...tx, synced: true }))
    };
    setLedger(syncedSnapshot);
    if (currentUser) {
      await persistEncryptedLedger(currentUser.id, syncedSnapshot, activeAesKeyRef.current);
    }
    setIsReconciling(false);
  };

  // Audio Guide Web Speech with multilingual locale selection
  const speakText = (text: string, langOverride?: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    setIsSpeaking(true);
    setActiveSpeechText(text);

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    const langMap: Record<string, string> = {
      en: 'en-ZA',
      zu: 'zu-ZA',
      xh: 'xh-ZA',
      st: 'st-ZA',
      af: 'af-ZA',
      nso: 'nso-ZA'
    };
    const desiredBcp47 = langOverride
      ? langMap[langOverride] ?? langOverride
      : langMap[language] ?? 'en-ZA';
    utterance.lang = desiredBcp47;

    const voices = window.speechSynthesis.getVoices();
    const prefix = desiredBcp47.split('-')[0].toLowerCase();
    const matchedVoice =
      voices.find(v => v.lang.toLowerCase() === desiredBcp47.toLowerCase()) ??
      voices.find(v => v.lang.toLowerCase().startsWith(prefix)) ??
      voices.find(
        v =>
          v.lang.startsWith('en') &&
          (v.name.includes('South Africa') || v.name.includes('Natural'))
      );

    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    utterance.onend = () => {
      setIsSpeaking(false);
      setActiveSpeechText(null);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      setActiveSpeechText(null);
    };

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    setActiveSpeechText(null);
  };

  const resetAllData = () => {
    setLedger(EMPTY_LEDGER);
    setLastSavedAt(null);
    if (currentUser) {
      try {
        localStorage.removeItem(getLedgerStorageKey(currentUser.id));
        localStorage.removeItem(getLegacyLedgerStorageKey(currentUser.id));
      } catch {
        // ignore
      }
    }
  };

  const importBackupData = (rawJson: string): { success: boolean; message: string } => {
    try {
      const parsed = JSON.parse(rawJson) as BackupPayload;
      const fin = parsed?.financialState;
      if (!fin || typeof fin !== 'object') {
        return {
          success: false,
          message: t.backupInvalidMsg
        };
      }

      setLedger(prev => ({
        startingBalance:
          typeof fin.startingBalance === 'number' && Number.isFinite(fin.startingBalance)
            ? roundMoney(Math.max(0, fin.startingBalance))
            : prev.startingBalance,
        emergencyBuffer:
          typeof fin.emergencyBuffer === 'number' && Number.isFinite(fin.emergencyBuffer)
            ? roundMoney(Math.max(0, fin.emergencyBuffer))
            : prev.emergencyBuffer,
        burnRate:
          typeof fin.burnRate === 'number' && Number.isFinite(fin.burnRate)
            ? roundMoney(Math.max(10, fin.burnRate))
            : prev.burnRate,
        pots: Array.isArray(fin.pots) ? fin.pots : prev.pots,
        transactions: Array.isArray(fin.transactions) ? fin.transactions : prev.transactions
      }));

      return {
        success: true,
        message: t.backupRestoredMsg
      };
    } catch {
      return {
        success: false,
        message: t.backupInvalidMsg
      };
    }
  };

  const isOnline = networkMode !== 'offline';

  return (
    <AppContext.Provider
      value={{
        currentUser,
        isAuthenticated: Boolean(currentUser),
        isLedgerEncrypted,
        hasRegisteredAccounts: registeredUsers.length > 0,
        rememberedIdentifier,
        login,
        register,
        loginWithGoogle,
        syncGoogleBackup,
        logout,
        language,
        setLanguage,
        largeText,
        toggleLargeText,
        networkMode,
        isOnline,
        lastSavedAt,
        isReconciling,
        syncLedger,
        startingBalance: ledger.startingBalance,
        setStartingBalance,
        emergencyBuffer: ledger.emergencyBuffer,
        addToBuffer,
        withdrawFromBuffer,
        burnRate: ledger.burnRate,
        setBurnRate,
        pots: ledger.pots,
        createPot,
        depositToPot,
        withdrawFromPot,
        deletePot,
        transactions: ledger.transactions,
        addTransaction,
        deleteTransaction,
        totalIncome,
        totalExpenses,
        totalGoalSavings,
        safeToSpend,
        isOverspent,
        weeksBufferCovers,
        estimatedMonthEndSafe,
        isSpeaking,
        activeSpeechText,
        speakText,
        stopSpeaking,
        resetAllData,
        importBackupData,
        t
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
