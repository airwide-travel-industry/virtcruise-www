import { createId } from '../quote-domains/shared.js';

const STORAGE_KEY = 'virtcruise.offline.quoteQueue.v1';
let memoryQueue = [];

function readQueue() {
  try {
    const value = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(value) ? value : [];
  } catch {
    return [...memoryQueue];
  }
}

function writeQueue(queue) {
  memoryQueue = [...queue];
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(queue));
  } catch {
    // The in-memory queue remains available for the current page session.
  }
}

export function createOfflineQuoteQueue() {
  return {
    list: readQueue,
    enqueue({ clientReference, idempotencyKey, payload }) {
      const queue = readQueue();
      const existing = queue.find(entry =>
        entry.idempotencyKey === idempotencyKey || entry.clientReference === clientReference);
      if (existing) {
        existing.payload = payload;
        existing.idempotencyKey = idempotencyKey;
        existing.clientReference = clientReference;
        writeQueue(queue);
        return existing;
      }
      const entry = {
        id: createId('queued-quote'),
        clientReference,
        idempotencyKey,
        payload,
        queuedAt: new Date().toISOString()
      };
      queue.push(entry);
      writeQueue(queue);
      return entry;
    },
    remove(id) {
      writeQueue(readQueue().filter(entry => entry.id !== id));
    },
    clearForQuote(clientReference) {
      writeQueue(readQueue().filter(entry => entry.clientReference !== clientReference));
    }
  };
}
