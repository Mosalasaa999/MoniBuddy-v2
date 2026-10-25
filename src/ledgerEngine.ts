import { GoalPot, Transaction } from './types';
import {
  addMoney,
  fromCents,
  getLocalIsoDate,
  roundMoney,
  subMoney,
  sumMoney,
  toCents
} from './cryptoLedger';

export interface LedgerStateSnapshot {
  startingBalance: number;
  emergencyBuffer: number;
  burnRate: number;
  pots: GoalPot[];
  transactions: Transaction[];
}

export type LedgerErrorCode =
  | 'INVALID_AMOUNT'
  | 'INSUFFICIENT_SAFE_CASH'
  | 'INSUFFICIENT_BUFFER'
  | 'INSUFFICIENT_POT'
  | 'POT_NOT_FOUND';

export interface LedgerTransitionOutcome {
  ok: boolean;
  errorCode?: LedgerErrorCode;
  goalJustReached?: boolean;
  nextState: LedgerStateSnapshot;
}

export interface ComputedLedgerTotals {
  totalIncome: number;
  totalExpenses: number;
  totalGoalSavings: number;
  /** Unclamped: negative values indicate overspending into ring-fenced pots or beyond cash in. */
  safeToSpend: number;
  isOverspent: boolean;
}

const makeTxId = (): string =>
  'tx_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6);

export const computeLedgerTotals = (
  state: Pick<
    LedgerStateSnapshot,
    'startingBalance' | 'emergencyBuffer' | 'pots' | 'transactions'
  >
): ComputedLedgerTotals => {
  const totalIncome = sumMoney(
    state.transactions.filter(tx => tx.type === 'income').map(tx => tx.amount)
  );
  const totalExpenses = sumMoney(
    state.transactions.filter(tx => tx.type === 'expense').map(tx => tx.amount)
  );
  const totalGoalSavings = sumMoney(state.pots.map(p => p.currentAmount));

  const safeCents =
    toCents(state.startingBalance) +
    toCents(totalIncome) -
    toCents(totalExpenses) -
    toCents(totalGoalSavings) -
    toCents(state.emergencyBuffer);

  const safeToSpend = fromCents(safeCents);

  return {
    totalIncome,
    totalExpenses,
    totalGoalSavings,
    safeToSpend,
    isOverspent: safeCents < 0
  };
};

export const applyAddTransaction = (
  state: LedgerStateSnapshot,
  tx: Omit<Transaction, 'id' | 'timestamp' | 'synced'>,
  synced: boolean
): LedgerTransitionOutcome => {
  const cleanAmount = roundMoney(tx.amount);
  if (toCents(cleanAmount) <= 0) {
    return { ok: false, errorCode: 'INVALID_AMOUNT', nextState: state };
  }

  const newTx: Transaction = {
    ...tx,
    amount: cleanAmount,
    id: makeTxId(),
    timestamp: Date.now(),
    synced
  };

  return {
    ok: true,
    nextState: {
      ...state,
      transactions: [newTx, ...state.transactions]
    }
  };
};

export const applyBufferDeposit = (
  state: LedgerStateSnapshot,
  amount: number,
  options: { note?: string; synced: boolean; dateStr?: string }
): LedgerTransitionOutcome => {
  const cleanAmount = roundMoney(amount);
  if (toCents(cleanAmount) <= 0) {
    return { ok: false, errorCode: 'INVALID_AMOUNT', nextState: state };
  }

  const { safeToSpend } = computeLedgerTotals(state);
  if (toCents(cleanAmount) > toCents(safeToSpend)) {
    return { ok: false, errorCode: 'INSUFFICIENT_SAFE_CASH', nextState: state };
  }

  const note = options.note || '';
  const newTx: Transaction = {
    id: makeTxId(),
    type: 'buffer_deposit',
    title: note ? `Buffer deposit: ${note}` : 'Emergency buffer deposit',
    titleKey: 'txBufferDeposit',
    titleParams: { note },
    amount: cleanAmount,
    category: 'Buffer',
    date: options.dateStr ?? getLocalIsoDate(),
    timestamp: Date.now(),
    synced: options.synced
  };

  return {
    ok: true,
    nextState: {
      ...state,
      emergencyBuffer: addMoney(state.emergencyBuffer, cleanAmount),
      transactions: [newTx, ...state.transactions]
    }
  };
};

export const applyBufferWithdraw = (
  state: LedgerStateSnapshot,
  amount: number,
  options: { note?: string; synced: boolean; dateStr?: string }
): LedgerTransitionOutcome => {
  const cleanAmount = roundMoney(amount);
  if (toCents(cleanAmount) <= 0) {
    return { ok: false, errorCode: 'INVALID_AMOUNT', nextState: state };
  }

  if (toCents(cleanAmount) > toCents(state.emergencyBuffer)) {
    return { ok: false, errorCode: 'INSUFFICIENT_BUFFER', nextState: state };
  }

  const note = options.note || '';
  const newTx: Transaction = {
    id: makeTxId(),
    type: 'buffer_withdraw',
    title: note ? `Buffer emergency withdrawal: ${note}` : 'Buffer emergency withdrawal',
    titleKey: 'txBufferWithdraw',
    titleParams: { note },
    amount: cleanAmount,
    category: 'Buffer',
    date: options.dateStr ?? getLocalIsoDate(),
    timestamp: Date.now(),
    synced: options.synced
  };

  return {
    ok: true,
    nextState: {
      ...state,
      emergencyBuffer: Math.max(0, subMoney(state.emergencyBuffer, cleanAmount)),
      transactions: [newTx, ...state.transactions]
    }
  };
};

export const applyPotDeposit = (
  state: LedgerStateSnapshot,
  potId: string,
  amount: number,
  options: { synced: boolean; dateStr?: string }
): LedgerTransitionOutcome => {
  const cleanAmount = roundMoney(amount);
  if (toCents(cleanAmount) <= 0) {
    return { ok: false, errorCode: 'INVALID_AMOUNT', nextState: state };
  }

  const targetPot = state.pots.find(p => p.id === potId);
  if (!targetPot) {
    return { ok: false, errorCode: 'POT_NOT_FOUND', nextState: state };
  }

  const { safeToSpend } = computeLedgerTotals(state);
  if (toCents(cleanAmount) > toCents(safeToSpend)) {
    return { ok: false, errorCode: 'INSUFFICIENT_SAFE_CASH', nextState: state };
  }

  let goalJustReached = false;
  const nextPots = state.pots.map(p => {
    if (p.id !== potId) return p;
    const updatedAmount = addMoney(p.currentAmount, cleanAmount);
    if (
      toCents(updatedAmount) >= toCents(p.targetAmount) &&
      toCents(p.currentAmount) < toCents(p.targetAmount)
    ) {
      goalJustReached = true;
    }
    return { ...p, currentAmount: updatedAmount };
  });

  const newTx: Transaction = {
    id: makeTxId(),
    type: 'pot_deposit',
    title: `Deposit to ${targetPot.name}`,
    titleKey: 'txPotDeposit',
    titleParams: { potName: targetPot.name },
    amount: cleanAmount,
    category: 'Pots',
    potId,
    date: options.dateStr ?? getLocalIsoDate(),
    timestamp: Date.now(),
    synced: options.synced
  };

  return {
    ok: true,
    goalJustReached,
    nextState: {
      ...state,
      pots: nextPots,
      transactions: [newTx, ...state.transactions]
    }
  };
};

export const applyPotWithdraw = (
  state: LedgerStateSnapshot,
  potId: string,
  amount: number,
  options: { synced: boolean; dateStr?: string }
): LedgerTransitionOutcome => {
  const cleanAmount = roundMoney(amount);
  if (toCents(cleanAmount) <= 0) {
    return { ok: false, errorCode: 'INVALID_AMOUNT', nextState: state };
  }

  const targetPot = state.pots.find(p => p.id === potId);
  if (!targetPot) {
    return { ok: false, errorCode: 'POT_NOT_FOUND', nextState: state };
  }

  const actualWithdraw = Math.min(cleanAmount, targetPot.currentAmount);
  if (toCents(actualWithdraw) <= 0) {
    return { ok: false, errorCode: 'INSUFFICIENT_POT', nextState: state };
  }

  const remainingPots = state.pots.map(p =>
    p.id === potId
      ? { ...p, currentAmount: subMoney(p.currentAmount, actualWithdraw) }
      : p
  );

  const reversalTx: Transaction = {
    id: makeTxId(),
    type: 'pot_withdraw',
    title: `Pot closed & returned to cash: ${targetPot.name}`,
    titleKey: 'txPotWithdraw',
    titleParams: { potName: targetPot.name },
    amount: actualWithdraw,
    category: 'Pots',
    potId,
    date: options.dateStr ?? getLocalIsoDate(),
    timestamp: Date.now(),
    synced: options.synced
  };

  return {
    ok: true,
    nextState: {
      ...state,
      pots: remainingPots,
      transactions: [reversalTx, ...state.transactions]
    }
  };
};

export const applyDeleteTransaction = (
  state: LedgerStateSnapshot,
  txId: string
): LedgerStateSnapshot => {
  const tx = state.transactions.find(t => t.id === txId);
  if (!tx) return state;

  let nextEmergencyBuffer = state.emergencyBuffer;
  let nextPots = state.pots;

  if (tx.type === 'buffer_deposit') {
    nextEmergencyBuffer = Math.max(0, subMoney(state.emergencyBuffer, tx.amount));
  } else if (tx.type === 'buffer_withdraw') {
    nextEmergencyBuffer = addMoney(state.emergencyBuffer, tx.amount);
  } else if (tx.type === 'pot_deposit' && tx.potId) {
    nextPots = state.pots.map(p =>
      p.id === tx.potId ? { ...p, currentAmount: Math.max(0, subMoney(p.currentAmount, tx.amount)) } : p
    );
  } else if (tx.type === 'pot_withdraw' && tx.potId) {
    nextPots = state.pots.map(p =>
      p.id === tx.potId ? { ...p, currentAmount: addMoney(p.currentAmount, tx.amount) } : p
    );
  }

  return {
    ...state,
    emergencyBuffer: nextEmergencyBuffer,
    pots: nextPots,
    transactions: state.transactions.filter(t => t.id !== txId)
  };
};

export const applyDeletePot = (
  state: LedgerStateSnapshot,
  potId: string,
  options: { synced: boolean; dateStr?: string }
): LedgerTransitionOutcome => {
  const targetPot = state.pots.find(p => p.id === potId);
  if (!targetPot) {
    return { ok: false, errorCode: 'POT_NOT_FOUND', nextState: state };
  }

  let currentState = state;
  if (targetPot.currentAmount > 0) {
    const withdrawOutcome = applyPotWithdraw(currentState, potId, targetPot.currentAmount, options);
    if (!withdrawOutcome.ok) {
      return withdrawOutcome;
    }
    currentState = withdrawOutcome.nextState;
  }

  return {
    ok: true,
    nextState: {
      ...currentState,
      pots: currentState.pots.filter(p => p.id !== potId)
    }
  };
};


// ============================================================================
// South African National Credit Act (NCA) Regulation 42 Short-Term Credit Caps
// ============================================================================

export interface NcaCaps {
  readonly monthlyInterestFirstLoan: number; // TO VERIFY against current regulation text
  readonly monthlyInterestRepeatLoan: number; // TO VERIFY against current regulation text
  readonly initiationBase: number; // TO VERIFY against current regulation text
  readonly initiationPctAboveThreshold: number; // TO VERIFY against current regulation text
  readonly initiationThreshold: number; // TO VERIFY against current regulation text
  readonly initiationMax: number; // TO VERIFY against current regulation text
  readonly initiationMaxPctOfPrincipal: number; // TO VERIFY against current regulation text
  readonly monthlyServiceFee: number; // TO VERIFY against current regulation text
  readonly source: string;
  readonly lastVerified: string;
  readonly verified: boolean;
}

export const NCA_SHORT_TERM_CAPS: NcaCaps = {
  monthlyInterestFirstLoan: 0.05, // TO VERIFY against current regulation text
  monthlyInterestRepeatLoan: 0.03, // TO VERIFY against current regulation text
  initiationBase: 165, // TO VERIFY against current regulation text
  initiationPctAboveThreshold: 0.10, // TO VERIFY against current regulation text
  initiationThreshold: 1000, // TO VERIFY against current regulation text
  initiationMax: 1050, // TO VERIFY against current regulation text
  initiationMaxPctOfPrincipal: 0.15, // TO VERIFY against current regulation text
  monthlyServiceFee: 60, // TO VERIFY against current regulation text
  source: 'National Credit Act (NCA) 34 of 2005, Reg 42 Table B (GN R1080, GG 39379)',
  lastVerified: 'UNVERIFIED',
  verified: false
};

export interface LoanQuoteInput {
  principalZar: number;
  mode: 'repayment' | 'monthly_rate';
  quotedTotalRepaymentZar?: number;
  quotedMonthlyRatePercent?: number;
  extraFeesZar?: number;
  termDays: number;
  isFirstShortTermLoanThisYear: boolean;
}

export interface NcaLoanEvaluation {
  principalZar: number;
  termDays: number;
  quoteTotalRepaymentZar: number;
  quoteTotalCostZar: number;
  effectiveAprPercent: number;
  ncaMaxInterestZar: number;
  ncaMaxInitiationFeeZar: number;
  ncaMaxServiceFeeZar: number;
  ncaMaxTotalCostZar: number;
  ncaMaxTotalRepaymentZar: number;
  ncaAprPercent: number;
  exceedsNcaCap: boolean;
  overchargeVsNcaZar: number;
  savedUsingSelfBufferZar: number;
  validationError?: string;
}

export const evaluateNcaShortTermLoan = (
  input: LoanQuoteInput
): NcaLoanEvaluation => {
  const P = Number.isFinite(input.principalZar) ? input.principalZar : 1000;
  const termDays = Math.round(input.termDays || 30);

  if (P < 100) {
    return {
      principalZar: P,
      termDays,
      quoteTotalRepaymentZar: P,
      quoteTotalCostZar: 0,
      effectiveAprPercent: 0,
      ncaMaxInterestZar: 0,
      ncaMaxInitiationFeeZar: 0,
      ncaMaxServiceFeeZar: 0,
      ncaMaxTotalCostZar: 0,
      ncaMaxTotalRepaymentZar: P,
      ncaAprPercent: 0,
      exceedsNcaCap: false,
      overchargeVsNcaZar: 0,
      savedUsingSelfBufferZar: 0,
      validationError: 'loanPrincipalMinError'
    };
  }

  if (termDays < 1 || termDays > 180) {
    return {
      principalZar: P,
      termDays,
      quoteTotalRepaymentZar: P,
      quoteTotalCostZar: 0,
      effectiveAprPercent: 0,
      ncaMaxInterestZar: 0,
      ncaMaxInitiationFeeZar: 0,
      ncaMaxServiceFeeZar: 0,
      ncaMaxTotalCostZar: 0,
      ncaMaxTotalRepaymentZar: P,
      ncaAprPercent: 0,
      exceedsNcaCap: false,
      overchargeVsNcaZar: 0,
      savedUsingSelfBufferZar: 0,
      validationError: 'loanTermMinError'
    };
  }

  const extraFees = roundMoney(Math.max(0, input.extraFeesZar ?? 0));

  const monthlyInterestCapRate = input.isFirstShortTermLoanThisYear
    ? NCA_SHORT_TERM_CAPS.monthlyInterestFirstLoan
    : NCA_SHORT_TERM_CAPS.monthlyInterestRepeatLoan;
  const ncaMaxInterestZar = roundMoney(P * monthlyInterestCapRate * (termDays / 30));

  const baseInitiation =
    P > NCA_SHORT_TERM_CAPS.initiationThreshold
      ? NCA_SHORT_TERM_CAPS.initiationBase +
        NCA_SHORT_TERM_CAPS.initiationPctAboveThreshold *
          (P - NCA_SHORT_TERM_CAPS.initiationThreshold)
      : NCA_SHORT_TERM_CAPS.initiationBase;

  const ncaMaxInitiationFeeZar = roundMoney(
    Math.min(
      NCA_SHORT_TERM_CAPS.initiationMax,
      baseInitiation,
      P * NCA_SHORT_TERM_CAPS.initiationMaxPctOfPrincipal
    )
  );

  const ncaMaxServiceFeeZar = roundMoney(
    NCA_SHORT_TERM_CAPS.monthlyServiceFee * (termDays / 30)
  );

  const ncaMaxTotalCostZar = sumMoney([
    ncaMaxInterestZar,
    ncaMaxInitiationFeeZar,
    ncaMaxServiceFeeZar
  ]);
  const ncaMaxTotalRepaymentZar = addMoney(P, ncaMaxTotalCostZar);

  let quoteTotalRepaymentZar: number;
  if (input.mode === 'repayment') {
    const rawRepay = roundMoney(Math.max(P, input.quotedTotalRepaymentZar ?? P));
    quoteTotalRepaymentZar = addMoney(rawRepay, extraFees);
  } else {
    const monthlyRate = Math.max(0, input.quotedMonthlyRatePercent ?? 0) / 100;
    const interest = roundMoney(P * monthlyRate * (termDays / 30));
    quoteTotalRepaymentZar = sumMoney([P, interest, extraFees]);
  }

  const quoteTotalCostZar = Math.max(0, subMoney(quoteTotalRepaymentZar, P));
  const effectiveAprPercent = Number(
    ((quoteTotalCostZar / P) * (365 / termDays) * 100).toFixed(1)
  );
  const ncaAprPercent = Number(
    ((ncaMaxTotalCostZar / P) * (365 / termDays) * 100).toFixed(1)
  );

  const exceedsNcaCap = toCents(quoteTotalCostZar) > toCents(ncaMaxTotalCostZar);
  const overchargeVsNcaZar = exceedsNcaCap
    ? subMoney(quoteTotalCostZar, ncaMaxTotalCostZar)
    : 0;

  return {
    principalZar: P,
    termDays,
    quoteTotalRepaymentZar,
    quoteTotalCostZar,
    effectiveAprPercent,
    ncaMaxInterestZar,
    ncaMaxInitiationFeeZar,
    ncaMaxServiceFeeZar,
    ncaMaxTotalCostZar,
    ncaMaxTotalRepaymentZar,
    ncaAprPercent,
    exceedsNcaCap,
    overchargeVsNcaZar,
    savedUsingSelfBufferZar: quoteTotalCostZar
  };
};
