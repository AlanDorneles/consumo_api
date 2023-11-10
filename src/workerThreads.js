import { Worker, isMainThread, parentPort } from 'worker_threads';
import { fileURLToPath } from 'url';
import path from 'path';

if (isMainThread) {
  // Este é o thread principal
  const __filename = fileURLToPath(import.meta.url);
  const worker = new Worker(__filename);
  worker.on('message', (message) => {
    console.log(`Thread secundária enviou: ${message}`);
  });
  worker.postMessage('Hello, Thread Secundária!');
} else {
  // Este é o thread secundário
  parentPort.on('message', (message) => {
    console.log(`Thread principal enviou: ${message}`);
    parentPort.postMessage('Hello, Thread Principal!');
  });
}

