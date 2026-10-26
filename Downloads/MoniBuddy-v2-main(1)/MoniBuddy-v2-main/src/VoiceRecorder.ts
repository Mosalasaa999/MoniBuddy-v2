import { NetworkMode } from './types';
import type { WorkerInboundMessage, WorkerOutboundMessage } from './whisper.worker';

export type VoiceRecognitionLanguage =
  | 'en-ZA'
  | 'zu-ZA'
  | 'xh-ZA'
  | 'st-ZA'
  | 'af-ZA'
  | 'nso-ZA';

export type SpeechTier =
  | 'tier1-cloud'
  | 'tier2-ondevice'
  | 'tier3-wasm'
  | 'tier4-touch';

export type OfflineModelStatus =
  | 'uncached'
  | 'queued-wifi'
  | 'downloading'
  | 'ready'
  | 'error';

export type ConnectionProfile = 'wifi' | 'cellular' | 'save-data' | 'offline';

export interface SpeechCapabilities {
  hasNativeWebSpeech: boolean;
  supportsProcessLocally: boolean;
  hasGetUserMedia: boolean;
  hasWebWorker: boolean;
  hasWebAssembly: boolean;
}

export interface WasmVoicePackSnapshot {
  status: OfflineModelStatus;
  progress: number;
  downloadedMB: number;
  totalMB: number;
  error: string | null;
}

export class VoicePackNeededError extends Error {
  readonly code = 'VOICE_PACK_NEEDED' as const;
  constructor(
    message = 'Offline voice pack (35 MB) is required to transcribe speech without internet.'
  ) {
    super(message);
    this.name = 'VoicePackNeededError';
  }
}

export class Tier4FallbackError extends Error {
  readonly code = 'TIER4_FALLBACK' as const;
  readonly reason: 'mic-denied' | 'no-mic' | 'unsupported' | 'wasm-failed';
  constructor(
    reason: 'mic-denied' | 'no-mic' | 'unsupported' | 'wasm-failed',
    message: string
  ) {
    super(message);
    this.name = 'Tier4FallbackError';
    this.reason = reason;
  }
}

interface SpeechRecognitionAlternativeLike {
  transcript: string;
}

interface SpeechRecognitionResultLike {
  readonly 0: SpeechRecognitionAlternativeLike;
}

interface SpeechRecognitionEventLike {
  readonly results: ArrayLike<SpeechRecognitionResultLike>;
}

interface SpeechRecognitionErrorEventLike {
  readonly error: string;
}

interface SpeechRecognitionLike {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  processLocally?: boolean;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEventLike) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
}

interface SpeechRecognitionConstructor {
  new (): SpeechRecognitionLike;
  available?: (options: { langs: string[]; processLocally?: boolean }) => Promise<string>;
}

interface SpeechRecognitionWindow extends Window {
  SpeechRecognition?: SpeechRecognitionConstructor;
  webkitSpeechRecognition?: SpeechRecognitionConstructor;
}

interface NetworkInformationLike extends EventTarget {
  readonly type?: 'bluetooth' | 'cellular' | 'ethernet' | 'none' | 'wifi' | 'wimax' | 'other' | 'unknown';
  readonly effectiveType?: 'slow-2g' | '2g' | '3g' | '4g';
  readonly saveData?: boolean;
}

interface NavigatorWithConnection extends Navigator {
  connection?: NetworkInformationLike;
  mozConnection?: NetworkInformationLike;
  webkitConnection?: NetworkInformationLike;
}

const STORAGE_MODEL_READY_KEY = 'monibuddy_wasm_voice_pack_ready_v1';
const STORAGE_WIFI_QUEUE_KEY = 'monibuddy_wasm_voice_pack_wifi_queue_v1';

export const getNetworkInformation = (): NetworkInformationLike | null => {
  if (typeof navigator === 'undefined') return null;
  const nav = navigator as NavigatorWithConnection;
  return nav.connection ?? nav.mozConnection ?? nav.webkitConnection ?? null;
};

/**
 * Determines current data profile using navigator.connection + MoniBuddy's networkMode.
 * Defaults conservatively to 'cellular' when connection type is unknown so prepaid
 * mobile data is NEVER consumed automatically unless explicitly on unmetered Wi-Fi/Ethernet.
 */
export const getConnectionProfile = (networkMode: NetworkMode = '4g'): ConnectionProfile => {
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    return 'offline';
  }
  if (networkMode === 'offline') {
    return 'offline';
  }

  const conn = getNetworkInformation();
  if (conn?.saveData === true) {
    return 'save-data';
  }

  if (networkMode === '2g') {
    return 'cellular';
  }

  if (conn?.type === 'wifi' || conn?.type === 'ethernet') {
    return 'wifi';
  }

  return 'cellular';
};

export const detectSpeechCapabilities = (): SpeechCapabilities => {
  if (typeof window === 'undefined') {
    return {
      hasNativeWebSpeech: false,
      supportsProcessLocally: false,
      hasGetUserMedia: false,
      hasWebWorker: false,
      hasWebAssembly: false
    };
  }

  const speechWindow = window as SpeechRecognitionWindow;
  const Recognition = speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition;
  let supportsProcessLocally = false;

  if (Recognition) {
    if (typeof Recognition.available === 'function') {
      supportsProcessLocally = true;
    } else {
      try {
        const probe = new Recognition();
        supportsProcessLocally = 'processLocally' in probe;
      } catch {
        supportsProcessLocally = false;
      }
    }
  }

  return {
    hasNativeWebSpeech: Boolean(Recognition),
    supportsProcessLocally,
    hasGetUserMedia: Boolean(navigator.mediaDevices?.getUserMedia),
    hasWebWorker: typeof Worker !== 'undefined',
    hasWebAssembly: typeof WebAssembly !== 'undefined'
  };
};

/**
 * Resolves which Speech Tier will handle voice input given current capabilities,
 * network state, and local WASM cache status.
 */
export const resolveActiveSpeechTier = (
  networkMode: NetworkMode,
  modelStatus: OfflineModelStatus
): SpeechTier => {
  const caps = detectSpeechCapabilities();
  if (!caps.hasGetUserMedia) {
    return 'tier4-touch';
  }

  const isOnline = typeof navigator !== 'undefined' && navigator.onLine && networkMode !== 'offline';

  if (isOnline && caps.hasNativeWebSpeech) {
    return 'tier1-cloud';
  }

  if (!isOnline && caps.hasNativeWebSpeech && caps.supportsProcessLocally) {
    return 'tier2-ondevice';
  }

  if (caps.hasWebWorker && caps.hasWebAssembly) {
    // Tier 3 is selected; if modelStatus !== 'ready', invoking voice opens the opt-in modal
    void modelStatus;
    return 'tier3-wasm';
  }

  return 'tier4-touch';
};

/**
 * Singleton coordinator managing the Web Worker WASM Whisper voice pack,
 * Cache API verification, Wi-Fi silent background download, and cellular opt-in.
 */
class WasmVoicePackCoordinator {
  private worker: Worker | null = null;
  private snapshot: WasmVoicePackSnapshot = {
    status: 'uncached',
    progress: 0,
    downloadedMB: 0,
    totalMB: 35,
    error: null
  };
  private listeners = new Set<(snap: WasmVoicePackSnapshot) => void>();
  private pendingRequests = new Map<
    string,
    {
      resolve: (value: string) => void;
      reject: (reason: Error) => void;
    }
  >();
  private loadPromise: Promise<void> | null = null;
  private cacheChecked = false;

  constructor() {
    if (typeof window !== 'undefined') {
      try {
        const readyFlag = localStorage.getItem(STORAGE_MODEL_READY_KEY) === 'true';
        const queuedFlag = localStorage.getItem(STORAGE_WIFI_QUEUE_KEY) === 'true';
        if (readyFlag) {
          this.snapshot = {
            status: 'ready',
            progress: 100,
            downloadedMB: 35,
            totalMB: 35,
            error: null
          };
        } else if (queuedFlag) {
          this.snapshot = {
            ...this.snapshot,
            status: 'queued-wifi'
          };
        }
      } catch {
        // ignore storage errors
      }
      void this.verifyBrowserCache();
    }
  }

  getSnapshot(): WasmVoicePackSnapshot {
    return this.snapshot;
  }

  subscribe(listener: (snap: WasmVoicePackSnapshot) => void): () => void {
    this.listeners.add(listener);
    listener(this.snapshot);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private emit(patch: Partial<WasmVoicePackSnapshot>) {
    this.snapshot = { ...this.snapshot, ...patch };
    for (const listener of this.listeners) {
      listener(this.snapshot);
    }
  }

  async verifyBrowserCache(): Promise<void> {
    if (this.cacheChecked || typeof window === 'undefined' || !('caches' in window)) {
      return;
    }
    this.cacheChecked = true;
    try {
      const cacheNames = await caches.keys();
      let hasWhisperWeights = false;
      for (const name of cacheNames) {
        if (name.includes('transformers') || name.includes('monibuddy-wasm-voice-pack')) {
          const cache = await caches.open(name);
          const keys = await cache.keys();
          if (keys.some(req => req.url.includes('whisper-tiny') && req.url.includes('.onnx'))) {
            hasWhisperWeights = true;
            break;
          }
        }
      }

      if (hasWhisperWeights) {
        localStorage.setItem(STORAGE_MODEL_READY_KEY, 'true');
        localStorage.removeItem(STORAGE_WIFI_QUEUE_KEY);
        this.emit({
          status: 'ready',
          progress: 100,
          downloadedMB: 35,
          totalMB: 35,
          error: null
        });
      } else if (this.snapshot.status === 'ready') {
        // Cache was evicted by browser; reset ready flag honestly
        localStorage.removeItem(STORAGE_MODEL_READY_KEY);
        const queued = localStorage.getItem(STORAGE_WIFI_QUEUE_KEY) === 'true';
        this.emit({
          status: queued ? 'queued-wifi' : 'uncached',
          progress: 0,
          downloadedMB: 0,
          error: null
        });
      }
    } catch {
      // Cache inspection optional fallback
    }
  }

  private ensureWorker(): Worker {
    if (!this.worker) {
      this.worker = new Worker(new URL('./whisper.worker.ts', import.meta.url), {
        type: 'module'
      });

      this.worker.onmessage = (event: MessageEvent<WorkerOutboundMessage>) => {
        const msg = event.data;
        if (!msg) return;

        if (msg.type === 'PROGRESS') {
          this.emit({
            status: 'downloading',
            progress: msg.progress,
            downloadedMB: msg.downloadedMB,
            totalMB: msg.totalMB,
            error: null
          });
        } else if (msg.type === 'READY') {
          try {
            localStorage.setItem(STORAGE_MODEL_READY_KEY, 'true');
            localStorage.removeItem(STORAGE_WIFI_QUEUE_KEY);
          } catch {
            // ignore
          }
          this.emit({
            status: 'ready',
            progress: 100,
            downloadedMB: 35,
            totalMB: 35,
            error: null
          });
          const pending = this.pendingRequests.get(msg.requestId);
          if (pending) {
            this.pendingRequests.delete(msg.requestId);
            pending.resolve('ready');
          }
        } else if (msg.type === 'RESULT') {
          const pending = this.pendingRequests.get(msg.requestId);
          if (pending) {
            this.pendingRequests.delete(msg.requestId);
            pending.resolve(msg.text);
          }
        } else if (msg.type === 'ERROR') {
          const pending = this.pendingRequests.get(msg.requestId);
          if (pending) {
            this.pendingRequests.delete(msg.requestId);
            pending.reject(new Error(msg.message));
          }
          if (this.snapshot.status === 'downloading') {
            this.emit({
              status: 'error',
              error: msg.message
            });
          }
        }
      };

      this.worker.onerror = err => {
        const message = err.message || 'Offline speech Web Worker encountered an error.';
        for (const [, req] of this.pendingRequests) {
          req.reject(new Error(message));
        }
        this.pendingRequests.clear();
        this.loadPromise = null;
        this.emit({
          status: 'error',
          error: message
        });
      };
    }

    return this.worker;
  }

  /**
   * Silent Auto-Download on unmetered Wi-Fi (when saveData is false).
   * Never auto-downloads on cellular, 2G, Save-Data, or Offline modes.
   */
  evaluateAutoWifiPrefetch(networkMode: NetworkMode): void {
    if (this.snapshot.status === 'ready' || this.snapshot.status === 'downloading') {
      return;
    }

    const caps = detectSpeechCapabilities();
    if (!caps.hasWebWorker || !caps.hasWebAssembly) {
      return;
    }

    const profile = getConnectionProfile(networkMode);
    if (profile === 'wifi') {
      void this.downloadVoicePack().catch(() => {
        // Silent background fail on Wi-Fi drop; keeps uncached/queued state cleanly
      });
    }
  }

  queueForWifi(): void {
    if (this.snapshot.status === 'ready') return;
    try {
      localStorage.setItem(STORAGE_WIFI_QUEUE_KEY, 'true');
    } catch {
      // ignore
    }
    this.emit({
      status: 'queued-wifi',
      error: null
    });
  }

  cancelDownload(): void {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }
    for (const [, req] of this.pendingRequests) {
      req.reject(new DOMException('Download cancelled by user.', 'AbortError'));
    }
    this.pendingRequests.clear();
    this.loadPromise = null;

    let queued = false;
    try {
      queued = localStorage.getItem(STORAGE_WIFI_QUEUE_KEY) === 'true';
    } catch {
      queued = false;
    }

    this.emit({
      status: queued ? 'queued-wifi' : 'uncached',
      progress: 0,
      downloadedMB: 0,
      error: null
    });
  }

  downloadVoicePack(): Promise<void> {
    if (this.snapshot.status === 'ready' && this.worker) {
      return Promise.resolve();
    }
    if (this.loadPromise) {
      return this.loadPromise;
    }

    const worker = this.ensureWorker();
    const requestId = 'load_' + Date.now();
    this.emit({
      status: 'downloading',
      progress: Math.max(1, this.snapshot.progress),
      error: null
    });

    this.loadPromise = new Promise<void>((resolve, reject) => {
      this.pendingRequests.set(requestId, {
        resolve: () => {
          this.loadPromise = null;
          resolve();
        },
        reject: err => {
          this.loadPromise = null;
          reject(err);
        }
      });

      const msg: WorkerInboundMessage = { type: 'LOAD', requestId };
      worker.postMessage(msg);
    });

    return this.loadPromise;
  }

  async transcribePcm16k(
    audio16k: Float32Array,
    language: VoiceRecognitionLanguage
  ): Promise<string> {
    const worker = this.ensureWorker();
    const requestId = 'asr_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6);

    return new Promise<string>((resolve, reject) => {
      this.pendingRequests.set(requestId, { resolve, reject });
      const msg: WorkerInboundMessage = {
        type: 'TRANSCRIBE',
        requestId,
        audio: audio16k,
        language: language === 'af-ZA' ? 'af' : 'en'
      };
      worker.postMessage(msg, [audio16k.buffer]);
    });
  }
}

export const wasmVoicePackManager = new WasmVoicePackCoordinator();

const abortError = () => new DOMException('Voice recording was cancelled.', 'AbortError');

/**
 * Decodes recorded MediaRecorder audio Blob and resamples to 16kHz mono Float32Array
 * required by Whisper ONNX models.
 */
async function decodeBlobTo16kHzMono(blob: Blob): Promise<Float32Array> {
  const arrayBuffer = await blob.arrayBuffer();
  const AudioCtx =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;

  const tempContext = new AudioCtx();
  let decodedBuffer: AudioBuffer;
  try {
    decodedBuffer = await tempContext.decodeAudioData(arrayBuffer.slice(0));
  } finally {
    void tempContext.close();
  }

  const targetSampleRate = 16000;
  const targetLength = Math.max(1, Math.ceil(decodedBuffer.duration * targetSampleRate));
  const offlineContext = new OfflineAudioContext(1, targetLength, targetSampleRate);
  const bufferSource = offlineContext.createBufferSource();
  bufferSource.buffer = decodedBuffer;
  bufferSource.connect(offlineContext.destination);
  bufferSource.start(0);

  const rendered = await offlineContext.startRendering();
  // Copy into a dedicated Float32Array so its ArrayBuffer can be transferred cleanly
  return new Float32Array(rendered.getChannelData(0));
}

function selectSupportedRecorderMimeType(): string | undefined {
  if (typeof MediaRecorder === 'undefined' || typeof MediaRecorder.isTypeSupported !== 'function') {
    return undefined;
  }
  const candidates = [
    'audio/webm;codecs=opus',
    'audio/webm',
    'audio/ogg;codecs=opus',
    'audio/mp4'
  ];
  return candidates.find(type => MediaRecorder.isTypeSupported(type));
}

export interface WasmRecordingController {
  stopAndTranscribe: () => void;
  cancel: () => void;
  result: Promise<{ transcript: string; tierUsed: SpeechTier }>;
}

/**
 * Starts Tier 3 offline microphone capture -> 16kHz PCM resampling -> WASM Whisper Worker.
 */
export function startTier3WasmCapture(
  language: VoiceRecognitionLanguage,
  signal: AbortSignal,
  callbacks?: {
    onAudioLevel?: (level: number) => void;
    onTranscribing?: () => void;
  }
): WasmRecordingController {
  if (wasmVoicePackManager.getSnapshot().status !== 'ready') {
    const rejected = Promise.reject(new VoicePackNeededError());
    rejected.catch(() => {});
    return {
      stopAndTranscribe: () => {},
      cancel: () => {},
      result: rejected
    };
  }

  if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') {
    const rejected = Promise.reject(
      new Tier4FallbackError(
        'unsupported',
        'Audio recording is unavailable on this browser. Switched to Manual Touch Pad.'
      )
    );
    rejected.catch(() => {});
    return {
      stopAndTranscribe: () => {},
      cancel: () => {},
      result: rejected
    };
  }

  let recorder: MediaRecorder | null = null;
  let stream: MediaStream | null = null;
  let audioCtx: AudioContext | null = null;
  let levelTimer: number | null = null;
  let maxDurationTimer: number | null = null;
  let cancelled = false;

  const cleanupMedia = () => {
    if (levelTimer !== null) {
      window.clearInterval(levelTimer);
      levelTimer = null;
    }
    if (maxDurationTimer !== null) {
      window.clearTimeout(maxDurationTimer);
      maxDurationTimer = null;
    }
    stream?.getTracks().forEach(t => t.stop());
    stream = null;
    if (audioCtx) {
      void audioCtx.close();
      audioCtx = null;
    }
    callbacks?.onAudioLevel?.(0);
  };

  const stopAndTranscribe = () => {
    if (recorder && recorder.state === 'recording') {
      recorder.stop();
    }
  };

  const cancel = () => {
    cancelled = true;
    if (recorder && recorder.state === 'recording') {
      recorder.stop();
    } else {
      cleanupMedia();
    }
  };

  signal.addEventListener('abort', cancel, { once: true });

  const result = new Promise<{ transcript: string; tierUsed: SpeechTier }>((resolve, reject) => {
    if (signal.aborted) {
      reject(abortError());
      return;
    }

    navigator.mediaDevices
      .getUserMedia({
        audio: {
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      })
      .then(rawStream => {
        if (signal.aborted || cancelled) {
          rawStream.getTracks().forEach(t => t.stop());
          reject(abortError());
          return;
        }

        stream = rawStream;

        // Live audio level meter for clear tactile feedback
        try {
          const AudioCtx =
            window.AudioContext ||
            (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
          audioCtx = new AudioCtx();
          const source = audioCtx.createMediaStreamSource(rawStream);
          const analyser = audioCtx.createAnalyser();
          analyser.fftSize = 256;
          source.connect(analyser);
          const dataArray = new Uint8Array(analyser.frequencyBinCount);

          levelTimer = window.setInterval(() => {
            analyser.getByteTimeDomainData(dataArray);
            let sumSquares = 0;
            for (let i = 0; i < dataArray.length; i++) {
              const normalized = (dataArray[i] - 128) / 128;
              sumSquares += normalized * normalized;
            }
            const rms = Math.sqrt(sumSquares / dataArray.length);
            callbacks?.onAudioLevel?.(Math.min(1, rms * 4));
          }, 90);
        } catch {
          // Level meter is non-critical
        }

        const chunks: BlobPart[] = [];
        const mimeType = selectSupportedRecorderMimeType();
        recorder = mimeType
          ? new MediaRecorder(rawStream, { mimeType })
          : new MediaRecorder(rawStream);

        recorder.ondataavailable = e => {
          if (e.data && e.data.size > 0) {
            chunks.push(e.data);
          }
        };

        recorder.onerror = () => {
          cleanupMedia();
          reject(
            new Tier4FallbackError(
              'wasm-failed',
              'Microphone stream interrupted. Switched to Manual Touch Pad.'
            )
          );
        };

        recorder.onstop = async () => {
          cleanupMedia();
          if (cancelled || signal.aborted) {
            reject(abortError());
            return;
          }

          if (chunks.length === 0) {
            reject(new Error('No speech audio was captured. Tap Speak Transaction and try again.'));
            return;
          }

          try {
            callbacks?.onTranscribing?.();
            const blob = new Blob(chunks, { type: recorder?.mimeType || 'audio/webm' });
            const pcm16k = await decodeBlobTo16kHzMono(blob);
            const text = await wasmVoicePackManager.transcribePcm16k(pcm16k, language);
            if (!text.trim()) {
              reject(
                new Error(
                  'No clear words were heard. Speak closer to the phone or use the Manual Touch Pad.'
                )
              );
              return;
            }
            resolve({ transcript: text.trim(), tierUsed: 'tier3-wasm' });
          } catch (err) {
            reject(
              new Tier4FallbackError(
                'wasm-failed',
                err instanceof Error
                  ? `${err.message} Switched to Manual Touch Pad.`
                  : 'Local voice model could not process audio on this phone. Switched to Manual Touch Pad.'
              )
            );
          }
        };

        recorder.start(250);

        // Cap single utterance at 15 seconds to protect RAM on 1GB-2GB Android Go devices
        maxDurationTimer = window.setTimeout(() => {
          stopAndTranscribe();
        }, 15000);
      })
      .catch(error => {
        cleanupMedia();
        if (error instanceof DOMException && error.name === 'NotAllowedError') {
          reject(
            new Tier4FallbackError(
              'mic-denied',
              'Microphone permission was denied. Switched to Manual Touch Pad so you can log right away.'
            )
          );
          return;
        }
        if (error instanceof DOMException && error.name === 'NotFoundError') {
          reject(
            new Tier4FallbackError(
              'no-mic',
              'No microphone was detected on this device. Switched to Manual Touch Pad.'
            )
          );
          return;
        }
        reject(
          new Tier4FallbackError(
            'unsupported',
            'Microphone access is unavailable. Switched to Manual Touch Pad.'
          )
        );
      });
  });

  return {
    stopAndTranscribe,
    cancel,
    result
  };
}

/**
 * Internal helper for Tier 1 (cloud-assisted) and Tier 2 (on-device processLocally = true)
 * native Web Speech recognition.
 */
function runNativeSpeechTier(
  language: VoiceRecognitionLanguage,
  processLocally: boolean,
  signal: AbortSignal,
  onStopRef?: (stopper: () => void) => void
): Promise<string> {
  const speechWindow = window as SpeechRecognitionWindow;
  const Recognition = speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition;

  if (!Recognition) {
    return Promise.reject(new Error('UNSUPPORTED_WEB_SPEECH'));
  }

  if (signal.aborted) {
    return Promise.reject(abortError());
  }

  return new Promise((resolve, reject) => {
    let recognition: SpeechRecognitionLike | null = null;
    let settled = false;
    let transcript = '';

    const cleanup = () => {
      signal.removeEventListener('abort', handleAbort);
      if (recognition) {
        recognition.onresult = null;
        recognition.onerror = null;
        recognition.onend = null;
      }
    };

    const finish = (error?: Error, resultText?: string) => {
      if (settled) return;
      settled = true;
      cleanup();
      if (error) {
        reject(error);
      } else if (resultText && resultText.trim()) {
        resolve(resultText.trim());
      } else {
        reject(
          new Error('No speech was detected. Move closer to the microphone or tap Touch Pad.')
        );
      }
    };

    const handleAbort = () => {
      try {
        recognition?.stop();
      } finally {
        finish(abortError());
      }
    };

    signal.addEventListener('abort', handleAbort, { once: true });

    try {
      recognition = new Recognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = language;
      if (processLocally) {
        recognition.processLocally = true;
      }

      onStopRef?.(() => {
        try {
          recognition?.stop();
        } catch {
          // ignore
        }
      });

      recognition.onresult = event => {
        transcript = event.results[0]?.[0]?.transcript.trim() ?? '';
        finish(undefined, transcript);
      };

      recognition.onerror = event => {
        finish(new Error(`SPEECH_ERR:${event.error}`));
      };

      recognition.onend = () => {
        if (!settled) {
          finish(undefined, transcript);
        }
      };

      recognition.start();
    } catch (err) {
      finish(
        err instanceof Error
          ? new Error(`SPEECH_START_ERR:${err.message}`)
          : new Error('SPEECH_START_ERR:unknown')
      );
    }
  });
}

export interface ProgressiveSpeechSession {
  activeTier: SpeechTier;
  requiresManualStop: boolean;
  stopRecording: () => void;
  cancel: () => void;
  result: Promise<{ transcript: string; tierUsed: SpeechTier }>;
}

/**
 * Strategy C: Hybrid 4-Tier Progressive Speech Pipeline
 * - Tier 1 (Online): Native Web Speech API
 * - Tier 2 (Offline & Supported Browser): Native Web Speech with recognition.processLocally = true
 * - Tier 3 (Offline / Unsupported Browser / Firefox): Cached Whisper WASM inside Web Worker
 * - Tier 4 (Hard Fallback): Throws Tier4FallbackError so UI switches to Slang & Numeric Touch Pad
 */
export function startProgressiveSpeechCapture(options: {
  language: VoiceRecognitionLanguage;
  networkMode: NetworkMode;
  signal: AbortSignal;
  onTierChange?: (tier: SpeechTier) => void;
  onAudioLevel?: (level: number) => void;
  onTranscribing?: () => void;
}): ProgressiveSpeechSession {
  const { language, networkMode, signal, onTierChange, onAudioLevel, onTranscribing } = options;
  const caps = detectSpeechCapabilities();
  const modelStatus = wasmVoicePackManager.getSnapshot().status;
  const initialTier = resolveActiveSpeechTier(networkMode, modelStatus);

  let currentStopFn: () => void = () => {};
  let currentCancelFn: () => void = () => {};

  const stopRecording = () => currentStopFn();
  const cancel = () => currentCancelFn();

  if (initialTier === 'tier4-touch') {
    const rejected = Promise.reject(
      new Tier4FallbackError(
        caps.hasGetUserMedia ? 'unsupported' : 'no-mic',
        'Voice capture is not supported on this browser. Switched to Manual Touch Pad.'
      )
    );
    rejected.catch(() => {});
    return {
      activeTier: 'tier4-touch',
      requiresManualStop: false,
      stopRecording,
      cancel,
      result: rejected
    };
  }

  if (initialTier === 'tier3-wasm') {
    const wasmSession = startTier3WasmCapture(language, signal, {
      onAudioLevel,
      onTranscribing
    });
    currentStopFn = wasmSession.stopAndTranscribe;
    currentCancelFn = wasmSession.cancel;
    return {
      activeTier: 'tier3-wasm',
      requiresManualStop: true,
      stopRecording,
      cancel,
      result: wasmSession.result
    };
  }

  // Tier 1 or Tier 2 native Web Speech with automatic runtime cascade
  const executeCascade = async (): Promise<{ transcript: string; tierUsed: SpeechTier }> => {
    const tryTier2ThenTier3 = async (): Promise<{ transcript: string; tierUsed: SpeechTier }> => {
      if (caps.hasNativeWebSpeech && caps.supportsProcessLocally) {
        onTierChange?.('tier2-ondevice');
        try {
          const text = await runNativeSpeechTier(language, true, signal, stopper => {
            currentStopFn = stopper;
          });
          return { transcript: text, tierUsed: 'tier2-ondevice' };
        } catch (tier2Err) {
          if (tier2Err instanceof DOMException && tier2Err.name === 'AbortError') {
            throw tier2Err;
          }
          const msg = tier2Err instanceof Error ? tier2Err.message : '';
          if (msg.includes('not-allowed') && !msg.includes('service-not-allowed')) {
            throw new Tier4FallbackError(
              'mic-denied',
              'Microphone permission was denied. Switched to Manual Touch Pad.'
            );
          }
          if (msg.includes('audio-capture')) {
            throw new Tier4FallbackError(
              'no-mic',
              'No microphone is available. Switched to Manual Touch Pad.'
            );
          }
          // Fall through to Tier 3 WASM!
        }
      }

      if (caps.hasWebWorker && caps.hasWebAssembly) {
        onTierChange?.('tier3-wasm');
        const wasmSession = startTier3WasmCapture(language, signal, {
          onAudioLevel,
          onTranscribing
        });
        currentStopFn = wasmSession.stopAndTranscribe;
        currentCancelFn = wasmSession.cancel;
        return wasmSession.result;
      }

      throw new Tier4FallbackError(
        'unsupported',
        'Offline voice is unavailable on this browser. Switched to Manual Touch Pad.'
      );
    };

    if (initialTier === 'tier1-cloud') {
      onTierChange?.('tier1-cloud');
      try {
        const text = await runNativeSpeechTier(language, false, signal, stopper => {
          currentStopFn = stopper;
        });
        return { transcript: text, tierUsed: 'tier1-cloud' };
      } catch (tier1Err) {
        if (tier1Err instanceof DOMException && tier1Err.name === 'AbortError') {
          throw tier1Err;
        }
        const msg = tier1Err instanceof Error ? tier1Err.message : '';
        if (msg.includes('not-allowed') && !msg.includes('service-not-allowed')) {
          throw new Tier4FallbackError(
            'mic-denied',
            'Microphone permission was denied. Switched to Manual Touch Pad.'
          );
        }
        if (msg.includes('audio-capture')) {
          throw new Tier4FallbackError(
            'no-mic',
            'No microphone is available. Switched to Manual Touch Pad.'
          );
        }
        if (msg.includes('no-speech')) {
          throw new Error('No speech was detected. Move closer to the microphone and try again.');
        }
        // Network drop, cloud speech blocked, or unsupported language -> cascade to Tier 2 -> Tier 3
        return tryTier2ThenTier3();
      }
    }

    return tryTier2ThenTier3();
  };

  return {
    activeTier: initialTier,
    requiresManualStop: false,
    stopRecording,
    cancel,
    result: executeCascade()
  };
}

/**
 * Legacy helper preserved for backwards compatibility.
 */
export const recognizeSpeech = async (
  language: VoiceRecognitionLanguage,
  signal: AbortSignal
): Promise<string> => {
  const session = startProgressiveSpeechCapture({
    language,
    networkMode: '4g',
    signal
  });
  const res = await session.result;
  return res.transcript;
};
