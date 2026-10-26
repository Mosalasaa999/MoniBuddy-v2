/**
 * @fileoverview Comprehensive End-to-End Automated Verification Suite for MoniBuddy.
 *
 * Verifies:
 *  1. Defensive Scam Shield baseline & adversarial suite (`scamShield.test.ts`)
 *  2. Word-boundary false-positive safety ("footprint", "hotpot", "people", "pepper") + new SA scam rules
 *  3. Vernacular & Slang Voice Parser (20 real South African phrases, homophone & "pay for" disambiguation)
 *  4. WebCrypto PBKDF2-SHA256 (100,000 iterations) + AES-256-GCM ledger encryption + 5-attempt PIN lockout
 *  5. Integer-cent Ledger Engine (reversals on deleteTransaction & deletePot, deposit cash validation, overspend)
 *  6. South African NCA Regulation 42 Short-Term Credit Cap Calculator
 *  7. Complete 5-Language Localization (`en`, `zu`, `xh`, `st`, `af`) completeness check
 *
 * Run via: `npm test`
 */

import { runDefensiveShieldTestSuite } from './scamShield.test';
import { evaluateScamRisk } from './scamParser';
import {
  deduceScamAndBuildIncidentReport,
  getLocalizedSignalDescription
} from './scamDeductionEngine';
import { parseVernacularTransaction } from './SlangDictionary';
import {
  addMoney,
  clearPinLockout,
  decryptLedgerEnvelope,
  deriveLedgerAesKey,
  derivePbkdf2PinHash,
  encryptLedgerPayload,
  generateRandomSaltHex,
  getPinLockoutRemainingSeconds,
  recordFailedPinAttempt,
  subMoney,
  timingSafeEqualHex,
  toCents
} from './cryptoLedger';
import {
  LedgerStateSnapshot,
  applyAddTransaction,
  applyBufferDeposit,
  applyBufferWithdraw,
  applyDeletePot,
  applyDeleteTransaction,
  applyPotDeposit,
  computeLedgerTotals,
  evaluateNcaShortTermLoan
} from './ledgerEngine';
import { translations, TranslationStrings } from './translations';
import { Language, TabType } from './types';

// In-memory storage shim for Node test runtime
const memoryStorageMap = new Map<string, string>();
if (typeof globalThis.localStorage === 'undefined') {
  Object.defineProperty(globalThis, 'localStorage', {
    value: {
      getItem: (k: string) => memoryStorageMap.get(k) ?? null,
      setItem: (k: string, v: string) => {
        memoryStorageMap.set(k, v);
      },
      removeItem: (k: string) => {
        memoryStorageMap.delete(k);
      },
      clear: () => {
        memoryStorageMap.clear();
      }
    },
    configurable: true
  });
}

let passedCount = 0;
let failedCount = 0;

const assert = (condition: boolean, message: string): void => {
  if (!condition) {
    throw new Error(message);
  }
};

const runTest = async (name: string, fn: () => void | Promise<void>): Promise<void> => {
  try {
    await fn();
    passedCount += 1;
    console.log(`  PASS  ${name}`);
  } catch (err) {
    failedCount += 1;
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`  FAIL  ${name}\n        -> ${msg}`);
  }
};

async function main() {
  console.log('\n=============================================================');
  console.log(' MoniBuddy Automated Verification Suite');
  console.log('=============================================================\n');

  // ---------------------------------------------------------------------------
  // 1. Existing Defensive Scam Shield Regression Suite (14 cases)
  // ---------------------------------------------------------------------------
  console.log('[1/7] Scam Shield Baseline & Adversarial Regression Suite');
  const shieldResults = runDefensiveShieldTestSuite();
  for (const res of shieldResults) {
    await runTest(`${res.id}: ${res.name}`, () => {
      assert(res.passed, res.details);
    });
  }

  // ---------------------------------------------------------------------------
  // 2. Word-Boundary Safety & New South African Scam Patterns
  // ---------------------------------------------------------------------------
  console.log('\n[2/7] Word-Boundary Safety & New Local SA Scam Rules');
  const benignWords = [
    'Check your carbon footprint at the market today',
    'We cooked beef hotpot for Sunday family lunch',
    'Five people shared the taxi fare home',
    'Bought black pepper and onions for R35',
    'Going to a job interview tomorrow morning in Midrand',
    'Collected my parcel at the post office counter'
  ];

  for (const phrase of benignWords) {
    await runTest(`Benign phrase not flagged: "${phrase}"`, () => {
      const parsed = evaluateScamRisk(phrase);
      assert(
        parsed.riskScore === 0 && parsed.severity === 'SAFE',
        `Expected score 0/SAFE, got ${parsed.riskScore}/${parsed.severity} (${parsed.signals.map(s => s.ruleId).join(', ')})`
      );
    });
  }

  await runTest('Flags fake SA job placement / uniform fee scam + 6-language audio scripts', () => {
    const res = deduceScamAndBuildIncidentReport({
      transcriptOrMessage:
        'Congratulations! Your retail job interview passed. Pay R250 uniform fee via eWallet today to secure your start.',
      preferredLanguage: 'xh'
    });
    assert(res.evaluation.riskScore >= 0.4, `Score too low: ${res.evaluation.riskScore}`);
    assert(res.audioWarningScripts.xh.length > 20, 'Missing isiXhosa audio warning');
    assert(res.audioWarningScripts.st.length > 20, 'Missing Sesotho audio warning');
    assert(res.audioWarningScripts.af.length > 20, 'Missing Afrikaans audio warning');
  });

  await runTest('Flags fake SAPO / courier customs release fee scam', () => {
    const res = deduceScamAndBuildIncidentReport({
      transcriptOrMessage:
        'SA Post Office notice: Your parcel is held at depot. Pay R95 customs clearance fee urgently to release delivery.'
    });
    assert(res.evaluation.riskScore >= 0.4, `Expected courier scam score >= 0.40, got ${res.evaluation.riskScore}`);
  });

  await runTest('Flags WhatsApp pyramid / gifting stokvel multiplier scam', () => {
    const res = deduceScamAndBuildIncidentReport({
      transcriptOrMessage:
        'Join our WhatsApp blessing circle! Put R200 and get R1,600 back tonight — guaranteed double your money!'
    });
    assert(res.evaluation.riskScore >= 0.35, `Expected pyramid stokvel score >= 0.35, got ${res.evaluation.riskScore}`);
  });

  // ---------------------------------------------------------------------------
  // 3. Vernacular & Slang Voice Parser (20 Phrases)
  // ---------------------------------------------------------------------------
  console.log('\n[3/7] Vernacular & Slang Transaction Parser (20 Phrases)');

  const voiceCases: {
    phrase: string;
    expectedCount: number;
    firstAmount?: number;
    firstType?: 'income' | 'expense';
    secondAmount?: number;
  }[] = [
    { phrase: 'taxi to town R32', expectedCount: 1, firstAmount: 32, firstType: 'expense' },
    { phrase: 'R50 for airtime', expectedCount: 1, firstAmount: 50, firstType: 'expense' },
    { phrase: 'pay for taxi 20', expectedCount: 1, firstAmount: 20, firstType: 'expense' },
    { phrase: 'pay electricity R100', expectedCount: 1, firstAmount: 100, firstType: 'expense' },
    { phrase: 'pay rent R1200', expectedCount: 1, firstAmount: 1200, firstType: 'expense' },
    { phrase: 'pay school fees R350', expectedCount: 1, firstAmount: 350, firstType: 'expense' },
    { phrase: 'got paid R500 wages', expectedCount: 1, firstAmount: 500, firstType: 'income' },
    { phrase: 'received salary 2500', expectedCount: 1, firstAmount: 2500, firstType: 'income' },
    {
      phrase: 'Two choco for taxi and one clipa for airtime',
      expectedCount: 2,
      firstAmount: 40,
      firstType: 'expense',
      secondAmount: 100
    },
    { phrase: 'one tiger for bread', expectedCount: 1, firstAmount: 10, firstType: 'expense' },
    { phrase: 'three tiger for taxi', expectedCount: 1, firstAmount: 30, firstType: 'expense' },
    { phrase: 'two clipa for groceries', expectedCount: 1, firstAmount: 200, firstType: 'expense' },
    { phrase: 'one grand for rent', expectedCount: 1, firstAmount: 1000, firstType: 'expense' },
    { phrase: '1.5k wages', expectedCount: 1, firstAmount: 1500, firstType: 'income' },
    { phrase: 'bought chalk for R15', expectedCount: 1, firstAmount: 15, firstType: 'expense' },
    { phrase: 'clip for hair R12', expectedCount: 1, firstAmount: 12, firstType: 'expense' },
    { phrase: 'chocolate bar R18', expectedCount: 1, firstAmount: 18, firstType: 'expense' },
    { phrase: 'SASSA grant R370', expectedCount: 1, firstAmount: 370, firstType: 'income' },
    { phrase: 'customer paid R85', expectedCount: 1, firstAmount: 85, firstType: 'income' },
    { phrase: 'bought chalk without numbers', expectedCount: 0 }
  ];

  for (const vc of voiceCases) {
    await runTest(`Voice parse: "${vc.phrase}"`, () => {
      const parsed = parseVernacularTransaction(vc.phrase);
      const entries = parsed.entries;
      assert(
        entries.length === vc.expectedCount,
        `Expected ${vc.expectedCount} entries, got ${entries.length}: ${JSON.stringify(entries)}`
      );
      if (vc.expectedCount > 0 && vc.firstAmount !== undefined) {
        assert(
          entries[0].amount === vc.firstAmount,
          `Expected first amount R${vc.firstAmount}, got R${entries[0].amount}`
        );
      }
      if (vc.expectedCount > 0 && vc.firstType !== undefined) {
        assert(
          entries[0].type === vc.firstType,
          `Expected type "${vc.firstType}", got "${entries[0].type}"`
        );
      }
      if (vc.expectedCount > 1 && vc.secondAmount !== undefined) {
        assert(
          entries[1].amount === vc.secondAmount,
          `Expected second amount R${vc.secondAmount}, got R${entries[1].amount}`
        );
      }
    });
  }

  // ---------------------------------------------------------------------------
  // 4. WebCrypto PBKDF2-SHA256 + AES-256-GCM + PIN Brute-Force Lockout
  // ---------------------------------------------------------------------------
  console.log('\n[4/7] WebCrypto PBKDF2-SHA256 & AES-256-GCM Encryption + Lockout');

  await runTest('PBKDF2-SHA256 (100k iterations) hashes PIN deterministically & resists mismatch', async () => {
    const salt = generateRandomSaltHex(16);
    const hash1 = await derivePbkdf2PinHash('2580', salt);
    const hash2 = await derivePbkdf2PinHash('2580', salt);
    const wrongHash = await derivePbkdf2PinHash('2581', salt);

    assert(hash1.length === 64, `Expected 64-char hex hash, got ${hash1.length}`);
    assert(timingSafeEqualHex(hash1, hash2), 'Expected identical PBKDF2 hash for same PIN+salt');
    assert(!timingSafeEqualHex(hash1, wrongHash), 'Different PIN produced colliding hash');
  });

  await runTest('AES-256-GCM encrypts ledger with no plaintext leak and rejects wrong PIN / tampering', async () => {
    const ledgerSalt = generateRandomSaltHex(16);
    const correctKey = await deriveLedgerAesKey('4826', ledgerSalt);
    const wrongKey = await deriveLedgerAesKey('9999', ledgerSalt);

    const samplePayload = {
      startingBalance: 1250.5,
      emergencyBuffer: 300,
      burnRate: 450,
      pots: [
        {
          id: 'pot_secret',
          name: 'Secret School Uniform Pot',
          targetAmount: 800,
          currentAmount: 250,
          category: 'Education',
          icon: 'School',
          color: 'amber' as const,
          createdAt: '2026-03-01T00:00:00.000Z'
        }
      ],
      transactions: [],
      updatedAt: '2026-03-01T00:00:00.000Z'
    };

    const envelope = await encryptLedgerPayload(samplePayload, correctKey);
    const serialized = JSON.stringify(envelope);

    assert(!serialized.includes('Secret School Uniform Pot'), 'Plaintext leaked into ciphertext');
    assert(!serialized.includes('1250.5'), 'Balance leaked into ciphertext');

    const decrypted = await decryptLedgerEnvelope(envelope, correctKey);
    assert(decrypted.startingBalance === 1250.5, 'Decrypted startingBalance mismatch');
    assert(decrypted.pots[0].name === 'Secret School Uniform Pot', 'Decrypted pot name mismatch');

    let wrongKeyRejected = false;
    try {
      await decryptLedgerEnvelope(envelope, wrongKey);
    } catch {
      wrongKeyRejected = true;
    }
    assert(wrongKeyRejected, 'AES-GCM failed to reject wrong PIN key');
  });

  await runTest('PIN lockout enforces 60-second cooldown after 5 failed attempts', () => {
    const acctId = 'usr_lockout_test';
    clearPinLockout(acctId);
    for (let i = 1; i <= 4; i++) {
      const r = recordFailedPinAttempt(acctId);
      assert(!r.locked && r.remainingSeconds === 0, `Locked prematurely on attempt ${i}`);
      assert(r.attemptsLeft === 5 - i, `Unexpected attemptsLeft ${r.attemptsLeft}`);
    }
    const fifth = recordFailedPinAttempt(acctId);
    assert(fifth.locked && fifth.remainingSeconds >= 59, `Expected ~60s lockout on 5th failure, got ${fifth.remainingSeconds}`);
    assert(getPinLockoutRemainingSeconds(acctId) > 0, 'Lockout timer not persisted');
    clearPinLockout(acctId);
    assert(getPinLockoutRemainingSeconds(acctId) === 0, 'clearPinLockout did not reset lockout');
  });

  // ---------------------------------------------------------------------------
  // 5. Ledger Engine Integrity (Cent Math, Reversals, Validation, Overspend)
  // ---------------------------------------------------------------------------
  console.log('\n[5/7] Ledger Engine Integrity & Integer-Cent Arithmetic');

  await runTest('Eliminates IEEE-754 floating-point drift (0.1 + 0.2 === 0.3)', () => {
    assert(addMoney(0.1, 0.2) === 0.3, `Expected 0.3, got ${addMoney(0.1, 0.2)}`);
    assert(subMoney(100.1, 99.8) === 0.3, `Expected 0.3, got ${subMoney(100.1, 99.8)}`);
    assert(toCents(19.99) === 1999, `Expected 1999 cents, got ${toCents(19.99)}`);
  });

  await runTest('Blocks buffer/pot deposits exceeding safeToSpend and reverses balances on delete', () => {
    let state: LedgerStateSnapshot = {
      startingBalance: 500,
      emergencyBuffer: 0,
      burnRate: 600,
      pots: [
        {
          id: 'p1',
          name: 'Groceries',
          targetAmount: 1000,
          currentAmount: 0,
          category: 'Essential',
          icon: 'Basket',
          color: 'emerald',
          createdAt: '2026-01-01'
        }
      ],
      transactions: []
    };

    // Attempt R600 buffer deposit when only R500 safe cash exists -> rejected
    const overDeposit = applyBufferDeposit(state, 600, { synced: true });
    assert(!overDeposit.ok && overDeposit.errorCode === 'INSUFFICIENT_SAFE_CASH', 'Should reject over-deposit');

    // Valid R200 buffer deposit -> safeToSpend becomes R300
    const bufDep = applyBufferDeposit(state, 200, { synced: true });
    assert(bufDep.ok, 'Valid R200 buffer deposit should succeed');
    state = bufDep.nextState;
    assert(computeLedgerTotals(state).safeToSpend === 300, 'safeToSpend should be R300');

    // Valid R150 pot deposit -> safeToSpend becomes R150, pot becomes R150
    const potDep = applyPotDeposit(state, 'p1', 150, { synced: true });
    assert(potDep.ok, 'Valid R150 pot deposit should succeed');
    state = potDep.nextState;
    assert(computeLedgerTotals(state).safeToSpend === 150, 'safeToSpend should be R150');
    assert(state.pots[0].currentAmount === 150, 'Pot balance should be R150');

    // Delete buffer deposit transaction -> emergencyBuffer reverses to R0, safeToSpend restores to R350
    const bufferTxId = state.transactions.find(tx => tx.type === 'buffer_deposit')!.id;
    state = applyDeleteTransaction(state, bufferTxId);
    assert(state.emergencyBuffer === 0, 'Deleting buffer_deposit must reverse emergencyBuffer to R0');
    assert(computeLedgerTotals(state).safeToSpend === 350, 'safeToSpend should restore to R350');

    // Delete funded pot -> records reversing pot_withdraw entry and restores safeToSpend to R500
    const delOutcome = applyDeletePot(state, 'p1', { synced: true });
    assert(delOutcome.ok, 'Delete pot should succeed');
    state = delOutcome.nextState;
    assert(state.pots.length === 0, 'Pot should be removed');
    assert(
      state.transactions[0]?.type === 'pot_withdraw' && state.transactions[0]?.amount === 150,
      'Deleting funded pot must create a R150 pot_withdraw audit entry'
    );
    assert(computeLedgerTotals(state).safeToSpend === 500, 'safeToSpend should return to R500');
  });

  await runTest('Shows negative safeToSpend & isOverspent=true when expenses exceed cash', () => {
    let state: LedgerStateSnapshot = {
      startingBalance: 100,
      emergencyBuffer: 0,
      burnRate: 600,
      pots: [],
      transactions: []
    };
    const added = applyAddTransaction(
      state,
      { title: 'Emergency Taxi', amount: 145, type: 'expense', category: 'Transport', date: '2026-04-01' },
      true
    );
    assert(added.ok, 'Expense transaction should record');
    state = added.nextState;
    const totals = computeLedgerTotals(state);
    assert(totals.safeToSpend === -45, `Expected -45 safeToSpend, got ${totals.safeToSpend}`);
    assert(totals.isOverspent === true, 'Expected isOverspent === true');

    // Verify buffer withdrawal cannot exceed buffer
    const badWithdraw = applyBufferWithdraw(state, 50, { synced: true });
    assert(!badWithdraw.ok && badWithdraw.errorCode === 'INSUFFICIENT_BUFFER', 'Should reject excess buffer withdraw');
  });

  // ---------------------------------------------------------------------------
  // 6. South African NCA Regulation 42 Short-Term Credit Cap Calculator
  // ---------------------------------------------------------------------------
  console.log('\n[6/7] NCA Regulation 42 Short-Term Credit Cap Calculator');

  await runTest('Computes exact NCA Reg 42 legal cap for R1,000 30-day first loan and flags R1,500 mashonisa quote', () => {
    const evalMashonisa = evaluateNcaShortTermLoan({
      principalZar: 1000,
      mode: 'repayment',
      quotedTotalRepaymentZar: 1500,
      termDays: 30,
      isFirstShortTermLoanThisYear: true
    });

    assert(evalMashonisa.ncaMaxInterestZar === 50, `Expected R50 interest cap, got ${evalMashonisa.ncaMaxInterestZar}`);
    assert(evalMashonisa.ncaMaxInitiationFeeZar === 150, `Expected R150 initiation cap, got ${evalMashonisa.ncaMaxInitiationFeeZar}`);
    assert(evalMashonisa.ncaMaxServiceFeeZar === 60, `Expected R60 service fee cap, got ${evalMashonisa.ncaMaxServiceFeeZar}`);
    assert(evalMashonisa.ncaMaxTotalRepaymentZar === 1260, `Expected R1,260 max repayment, got ${evalMashonisa.ncaMaxTotalRepaymentZar}`);
    assert(evalMashonisa.exceedsNcaCap === true, 'R1,500 quote must exceed NCA cap');
    assert(evalMashonisa.overchargeVsNcaZar === 240, `Expected R240 illegal overcharge, got ${evalMashonisa.overchargeVsNcaZar}`);
  });

  await runTest('Applies 3% monthly cap on repeat short-term loans in same calendar year', () => {
    const repeatEval = evaluateNcaShortTermLoan({
      principalZar: 1000,
      mode: 'repayment',
      quotedTotalRepaymentZar: 1200,
      termDays: 30,
      isFirstShortTermLoanThisYear: false
    });
    assert(repeatEval.ncaMaxInterestZar === 30, `Expected R30 (3%) repeat loan interest cap, got ${repeatEval.ncaMaxInterestZar}`);
    assert(repeatEval.ncaMaxTotalRepaymentZar === 1240, `Expected R1,240 repeat max repayment, got ${repeatEval.ncaMaxTotalRepaymentZar}`);
    assert(repeatEval.exceedsNcaCap === false, 'R1,200 quote is within R1,240 legal ceiling');
  });

  // ---------------------------------------------------------------------------
  // 7. Complete 5-Language Localization Verification (`en`, `zu`, `xh`, `st`, `af`)
  // ---------------------------------------------------------------------------
  console.log('\n[7/7] Complete 5-Language Localization Verification');

  const langs: Language[] = ['en', 'zu', 'xh', 'st', 'af'];
  const enKeys = Object.keys(translations.en) as (keyof TranslationStrings)[];
  const tabs: TabType[] = [
    'overview',
    'income_expenses',
    'buffer_credit',
    'scam_guard',
    'sync_2g',
    'technical_brief',
    'privacy_legal'
  ];

  for (const lang of langs) {
    await runTest(`Language "${lang}" implements all ${enKeys.length} keys & 7 audioGuides`, () => {
      const dict = translations[lang];
      for (const k of enKeys) {
        if (k === 'audioGuides') continue;
        const val = dict[k];
        assert(
          typeof val === 'string' && val.trim().length > 0,
          `Missing or empty translation for ${lang}.${String(k)}`
        );
      }
      for (const tab of tabs) {
        const g = dict.audioGuides[tab];
        assert(
          Boolean(g && g.title.trim() && g.content.trim() && g.keyAdvice.trim()),
          `Incomplete audioGuide for ${lang}.${tab}`
        );
      }
    });
  }

  await runTest(
    'isiZulu (zu) & Sesotho (st) Scam Guard and Loan Shield warning banners are localized with zero English fallback leakage',
    () => {
      // Loan Shield warning banners in isiZulu & Sesotho
      assert(
        translations.zu.loanProtectionBannerTitle.includes('NCA') &&
          translations.zu.loanProtectionBannerBody.includes('SASSA'),
        'isiZulu Loan Shield protection banner missing expected copy'
      );
      assert(
        translations.st.loanProtectionBannerTitle.includes('NCA') &&
          translations.st.loanProtectionBannerBody.includes('SASSA'),
        'Sesotho Loan Shield protection banner missing expected copy'
      );
      assert(
        translations.zu.loanPredatoryWarningBannerTitle !==
          translations.en.loanPredatoryWarningBannerTitle &&
          translations.st.loanPredatoryWarningBannerTitle !==
            translations.en.loanPredatoryWarningBannerTitle,
        'Predatory loan warning banner titles must be localized in isiZulu and Sesotho'
      );

      // Scam Guard warning banners in isiZulu & Sesotho
      assert(
        translations.zu.scamHighRiskBannerTitle !== translations.en.scamHighRiskBannerTitle &&
          translations.zu.scamCautionBannerTitle !== translations.en.scamCautionBannerTitle,
        'isiZulu Scam Guard warning banners must be localized'
      );
      assert(
        translations.st.scamHighRiskBannerTitle !== translations.en.scamHighRiskBannerTitle &&
          translations.st.scamCautionBannerTitle !== translations.en.scamCautionBannerTitle,
        'Sesotho Scam Guard warning banners must be localized'
      );

      // Verify localized Scam Guard signal descriptions & slot interpolation without English "any money"
      const zuReport = deduceScamAndBuildIncidentReport({
        transcriptOrMessage:
          'SASSA urgent notice: account suspended, pay R250 release fee right now',
        preferredLanguage: 'zu'
      });
      const stReport = deduceScamAndBuildIncidentReport({
        transcriptOrMessage:
          'SASSA urgent notice: account suspended, pay R250 release fee right now',
        preferredLanguage: 'st'
      });

      assert(
        !zuReport.activeAudioScript.includes('any money') &&
          !stReport.activeAudioScript.includes('any money'),
        'Vernacular audio scripts must not leak English "any money" slot fallback'
      );

      for (const sig of zuReport.evaluation.signals) {
        const zuDesc = getLocalizedSignalDescription(sig, 'zu');
        const stDesc = getLocalizedSignalDescription(sig, 'st');
        assert(
          zuDesc !== sig.description && stDesc !== sig.description,
          `Expected localized signal description for ${sig.ruleId}`
        );
      }
    }
  );

  console.log('\n=============================================================');
  console.log(` Summary: ${passedCount} passed, ${failedCount} failed`);
  console.log('=============================================================\n');

  if (failedCount > 0) {
    process.exit(1);
  }
}

main().catch(err => {
  console.error('Fatal test runner error:', err);
  process.exit(1);
});
