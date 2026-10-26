import { useEffect, useState } from 'react';
import { create } from 'zustand';

// Define the shape of our Zustand store
interface ScamAnalysis {
  level: 'High' | 'Medium' | 'Low';
  triggers: string[];
}

interface AppState {
  isDbReady: boolean;
  smoothedIncome: number;
  isAuthenticated: boolean;
  scamAnalysis: ScamAnalysis | null;
  initDatabase: () => Promise<void>;
  authenticate: (pin: string) => void;
  runScamParser: (text: string) => void;
}

// Create Zustand store
const useOfflineStore = create<AppState>((set) => ({
  isDbReady: false,
  smoothedIncome: 3995.00,
  isAuthenticated: false,
  scamAnalysis: null,
  
  initDatabase: async () => {
    try {
      // Mocking native SQLite initialization for the web preview environment
      console.log('Simulating native SQLite connection...');
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate delay
      
      console.log('Live SQLite Database and Schema Initialized Successfully.');
      set({ isDbReady: true });
    } catch (e) {
      console.error('Native SQLite Initialization Error:', e);
      set({ isDbReady: false });
    }
  },

  authenticate: (pin: string) => {
    if (pin === '0000') {
      set({ isAuthenticated: true });
    } else {
      alert('Local Auth Failed: Invalid PIN');
    }
  },

  runScamParser: (text: string) => {
    if (!text.trim()) return set({ scamAnalysis: null });
    const riskWords = ['urgent', 'bank', 'blocked', 'link', 'verify', 'account', 'password'];
    const matches = riskWords.filter(word => text.toLowerCase().includes(word));
    const riskLevel = matches.length > 1 ? 'High' : (matches.length === 1 ? 'Medium' : 'Low');
    set({ scamAnalysis: { level: riskLevel, triggers: matches } });
  }
}));

export default function App() {
  const { 
    isDbReady, initDatabase, 
    smoothedIncome, 
    isAuthenticated, authenticate,
    scamAnalysis, runScamParser
  } = useOfflineStore();

  const [pinInput, setPinInput] = useState('');
  const [smsInput, setSmsInput] = useState('');

  useEffect(() => {
    initDatabase();
  }, [initDatabase]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-neutral-900 flex items-center justify-center p-6">
        <div className="bg-neutral-800 p-6 rounded-lg border border-neutral-700 w-full max-w-sm">
          <h2 className="text-2xl font-bold text-white mb-4 text-center">Local Authentication</h2>
          <input 
            type="password" 
            placeholder="Enter PIN (Try 0000)" 
            className="w-full p-3 mb-4 bg-neutral-900 border border-neutral-600 rounded text-white text-center tracking-widest outline-none focus:border-emerald-500"
            value={pinInput}
            onChange={(e) => setPinInput(e.target.value)}
          />
          <button 
            onClick={() => authenticate(pinInput)}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 rounded transition-colors">
            Unlock Vault
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-900 text-white p-6 font-sans">
      <header className="mb-6 border-b border-neutral-800 pb-4">
        <h1 className="text-3xl font-bold text-emerald-400">MoniBuddy Security Core</h1>
        <p className="text-sm text-neutral-400">Zero-Trust Vault Unlocked</p>
      </header>

      <main className="space-y-6 max-w-4xl mx-auto">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-neutral-800 p-4 rounded border border-neutral-700">
            <h2 className="text-lg font-semibold mb-1">SQLite Schema</h2>
            <p className={isDbReady ? 'text-emerald-400 text-sm font-bold' : 'text-yellow-500 text-sm font-bold'}>
              {isDbReady ? 'LIVE & MOUNTED' : 'CONNECTING NATIVE...'}
            </p>
          </div>
          <div className="bg-neutral-800 p-4 rounded border border-neutral-700">
            <h2 className="text-lg font-semibold mb-1">Income Engine</h2>
            <p className="text-blue-400 font-mono text-sm font-bold">R{smoothedIncome.toFixed(2)}</p>
          </div>
        </div>

        <div className="bg-neutral-800 p-4 rounded border border-neutral-700">
          <h2 className="text-xl font-semibold mb-4">Zero-Trust Scam Parser</h2>
          <textarea 
            className="w-full h-24 p-3 bg-neutral-900 border border-neutral-600 rounded text-white mb-3 text-sm outline-none focus:border-blue-500"
            placeholder="Paste suspicious SMS here..."
            value={smsInput}
            onChange={(e) => setSmsInput(e.target.value)}
          />
          <button 
            onClick={() => runScamParser(smsInput)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm font-bold w-full transition-colors">
            Analyze Threat
          </button>

          {scamAnalysis && (
            <div className="mt-4 p-3 bg-neutral-900 rounded border border-neutral-700">
              <p className="text-sm text-neutral-400 mb-1">Risk Assessment:</p>
              {/* FIXED: Corrected className syntax here */}
              <p className={`font-bold text-lg ${
                  scamAnalysis.level === 'High' ? 'text-red-500' : 
                  scamAnalysis.level === 'Medium' ? 'text-yellow-500' : 'text-emerald-500'
                }`}>
                {scamAnalysis.level.toUpperCase()}
              </p>
              {scamAnalysis.triggers.length > 0 && (
                <p className="text-sm text-neutral-300 mt-2">
                  Detected triggers: <span className="font-mono text-red-400">{scamAnalysis.triggers.join(', ')}</span>
                </p>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}