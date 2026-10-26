export type Language = 'en' | 'zu' | 'xh' | 'st' | 'af';

export type NetworkMode = '2g' | '4g' | 'offline';

export type TabType =
  | 'overview'
  | 'income_expenses'
  | 'buffer_credit'
  | 'scam_guard'
  | 'sync_2g'
  | 'technical_brief'
  | 'privacy_legal';

export interface User {
  id: string;
  name: string;
  phone: string;
  email?: string;
  pinHash: string;
  pinSalt?: string;
  ledgerSalt?: string;
  kdf?: 'PBKDF2-SHA256-100K' | 'SHA256-LEGACY';
  createdAt: string;
}

export interface LedgerActionResult {
  ok: boolean;
  error?: string;
}

export interface Transaction {
  id: string;
  type:
    | 'income'
    | 'expense'
    | 'pot_deposit'
    | 'pot_withdraw'
    | 'buffer_deposit'
    | 'buffer_withdraw';
  title: string;
  titleKey?: string;
  titleParams?: Record<string, string | number>;
  source?: string;
  amount: number;
  category: string;
  date: string; // YYYY-MM-DD
  timestamp: number;
  synced: boolean;
  potId?: string;
  notes?: string;
  tags?: string[];
  transcript?: string;
}

export interface GoalPot {
  id: string;
  name: string;
  icon: string;
  targetAmount: number;
  currentAmount: number;
  category: string;
  color: string;
  createdAt: string;
}

export interface ScamCheckResult {
  riskLevel: 'safe' | 'medium' | 'high' | 'critical';
  score: number; // 0 - 100
  title: string;
  flags: string[];
  matchedKeywords: string[];
  explanation: string;
  advice: string;
  hotlineRecommendation?: string;
}
