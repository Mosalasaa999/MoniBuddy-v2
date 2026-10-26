import { pipeline, env } from '@huggingface/transformers';

// Persist ONNX model weights in browser Cache Storage and never look for local /models/ paths
env.allowLocalModels = false;
env.useBrowserCache = true;

export type WorkerInboundMessage =
  | { type: 'LOAD'; requestId: string }
  | {
      type: 'TRANSCRIBE';
      requestId: string;
      audio: Float32Array;
      language: 'en' | 'af';
    };

export type WorkerOutboundMessage =
  | {
      type: 'PROGRESS';
      requestId: string;
      progress: number;
      downloadedMB: number;
      totalMB: number;
      file?: string;
    }
  | { type: 'READY'; requestId: string }
  | { type: 'TRANSCRIBING'; requestId: string }
  | { type: 'RESULT'; requestId: string; text: string }
  | { type: 'ERROR'; requestId: string; message: string };

interface WorkerGlobalLike {
  postMessage: (message: WorkerOutboundMessage) => void;
  addEventListener: (
    type: 'message',
    listener: (event: MessageEvent<WorkerInboundMessage>) => void
  ) => void;
}

const workerScope = self as unknown as WorkerGlobalLike;

const MODEL_ID = 'onnx-community/whisper-tiny';
const ESTIMATED_TOTAL_BYTES = 35 * 1024 * 1024;

type AsrCallable = (
  audio: Float32Array,
  options?: Record<string, unknown>
) => Promise<{ text?: string } | Array<{ text?: string }>>;

let asrInstancePromise: Promise<AsrCallable> | null = null;

interface TransformersProgressEvent {
  status?: string;
  file?: string;
  loaded?: number;
  total?: number;
  progress?: number;
}

function getOrLoadPipeline(requestId: string): Promise<AsrCallable> {
  if (!asrInstancePromise) {
    const fileBytes = new Map<string, { loaded: number; total: number }>();

    asrInstancePromise = (
      pipeline('automatic-speech-recognition', MODEL_ID, {
        dtype: 'q8',
        device: 'wasm',
        progress_callback: (info: TransformersProgressEvent) => {
          if (info.file && typeof info.loaded === 'number') {
            const total =
              typeof info.total === 'number' && info.total > 0
                ? info.total
                : Math.max(info.loaded, 1024 * 1024);
            fileBytes.set(info.file, { loaded: info.loaded, total });

            let sumLoaded = 0;
            let sumTotal = 0;
            for (const entry of fileBytes.values()) {
              sumLoaded += entry.loaded;
              sumTotal += entry.total;
            }

            const effectiveTotal = Math.max(sumTotal, ESTIMATED_TOTAL_BYTES);
            const pct = Math.min(99, Math.max(1, Math.round((sumLoaded / effectiveTotal) * 100)));
            workerScope.postMessage({
              type: 'PROGRESS',
              requestId,
              progress: pct,
              downloadedMB: Number((sumLoaded / (1024 * 1024)).toFixed(1)),
              totalMB: Number((effectiveTotal / (1024 * 1024)).toFixed(1)),
              file: info.file
            });
          } else if (typeof info.progress === 'number') {
            const pct = Math.min(99, Math.max(1, Math.round(info.progress)));
            workerScope.postMessage({
              type: 'PROGRESS',
              requestId,
              progress: pct,
              downloadedMB: Number(((pct / 100) * 35).toFixed(1)),
              totalMB: 35,
              file: info.file
            });
          }
        }
      }) as unknown as Promise<AsrCallable>
    ).catch(err => {
      asrInstancePromise = null;
      throw err;
    });
  }

  return asrInstancePromise;
}

workerScope.addEventListener('message', async (event: MessageEvent<WorkerInboundMessage>) => {
  const payload = event.data;
  if (!payload) return;

  if (payload.type === 'LOAD') {
    try {
      await getOrLoadPipeline(payload.requestId);
      workerScope.postMessage({
        type: 'PROGRESS',
        requestId: payload.requestId,
        progress: 100,
        downloadedMB: 35,
        totalMB: 35
      });
      workerScope.postMessage({ type: 'READY', requestId: payload.requestId });
    } catch (err) {
      workerScope.postMessage({
        type: 'ERROR',
        requestId: payload.requestId,
        message:
          err instanceof Error
            ? err.message
            : 'Unable to load offline WASM voice model on this device.'
      });
    }
    return;
  }

  if (payload.type === 'TRANSCRIBE') {
    try {
      const transcriber = await getOrLoadPipeline(payload.requestId);
      workerScope.postMessage({ type: 'TRANSCRIBING', requestId: payload.requestId });

      const result = await transcriber(payload.audio, {
        chunk_length_s: 20,
        stride_length_s: 4,
        return_timestamps: false,
        language: payload.language === 'af' ? 'afrikaans' : 'english',
        task: 'transcribe'
      });

      const text = Array.isArray(result)
        ? result.map(item => item.text ?? '').join(' ').trim()
        : (result?.text ?? '').trim();

      workerScope.postMessage({
        type: 'RESULT',
        requestId: payload.requestId,
        text
      });
    } catch (err) {
      workerScope.postMessage({
        type: 'ERROR',
        requestId: payload.requestId,
        message:
          err instanceof Error
            ? err.message
            : 'Local offline transcription failed on this device.'
      });
    }
  }
});
