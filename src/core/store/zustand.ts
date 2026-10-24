import { create } from 'zustand';
import { getDB } from '../db/sqlite';

interface LedgerState {
  balanceCents: number;
  addIncome: (amountCents: number, source: string) => Promise<void>;
}

export const useLedgerStore = create<LedgerState>((set) => ({
  balanceCents: 0,
  
  addIncome: async (amountCents: number, source: string) => {
    if (!Number.isInteger(amountCents) || amountCents <= 0) throw new Error("Cents only.");

    const db = getDB();
    const id = crypto.randomUUID();
    const nowUtc = new Date().toISOString();

    const query = `
      INSERT INTO income_events (id, user_id, amount_cents, received_at, source, confidence, created_at, updated_at, device_id)
      VALUES (?, 'temp_user', ?, ?, ?, 'CONFIRMED', ?, ?, 'device_01');
    `;
    
    await db.run(query, [id, amountCents, nowUtc, source, nowUtc, nowUtc]);
    set((state) => ({ balanceCents: state.balanceCents + amountCents }));
  }
}));
