import { create } from 'zustand';
import { getDB } from '../db/sqlite';

export interface IncomeRecord {
  id: string;
  amountCents: number;
  source: string;
  receivedAt: string;
}

interface LedgerState {
  balanceCents: number;
  transactions: IncomeRecord[];
  isHydrated: boolean;
  hydrate: () => Promise<void>;
  addIncome: (amountCents: number, source: string) => Promise<void>;
}

export const useLedgerStore = create<LedgerState>((set) => ({
  balanceCents: 0,
  transactions: [],
  isHydrated: false,

  hydrate: async () => {
    const db = getDB();
    const query = `
      SELECT id, amount_cents as amountCents, source, received_at as receivedAt
      FROM income_events
      WHERE deleted_at IS NULL
      ORDER BY received_at DESC;
    `;
    const res = await db.query(query);
    const records: IncomeRecord[] = (res.values || []).map((row: any) => ({
      id: row.id,
      amountCents: Number(row.amountCents),
      source: row.source,
      receivedAt: row.receivedAt,
    }));

    const totalCents = records.reduce((acc, curr) => acc + curr.amountCents, 0);

    set({ balanceCents: totalCents, transactions: records, isHydrated: true });
    console.log('[STORE] Hydrated state from SQLite:', { totalCents, count: records.length });
  },

  addIncome: async (amountCents: number, source: string) => {
    if (!Number.isInteger(amountCents) || amountCents <= 0) {
      throw new Error('Fatal: Monetary amounts must be positive integer cents.');
    }

    const db = getDB();
    const id = crypto.randomUUID();
    const nowUtc = new Date().toISOString();

    // Synchronous native flush before UI resolution (guarantees survival on OS eviction)
    const sql = `
      INSERT INTO income_events (id, user_id, amount_cents, received_at, source, confidence, created_at, updated_at, device_id)
      VALUES (?, 'usr_offline_primary', ?, ?, ?, 'CONFIRMED', ?, ?, 'dev_local_primary');
    `;

    await db.run(sql, [id, amountCents, nowUtc, source, nowUtc, nowUtc]);

    set((state) => ({
      balanceCents: state.balanceCents + amountCents,
      transactions: [{ id, amountCents, source, receivedAt: nowUtc }, ...state.transactions],
    }));
  },
}));
