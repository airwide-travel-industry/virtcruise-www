export class RepositoryError extends Error {
  constructor(message, {
    cause,
    code = 'REPOSITORY_ERROR',
    retryable = false,
    status = 0,
    violations = [],
    requestId = '',
    queued = null
  } = {}) {
    super(message, { cause });
    this.name = 'RepositoryError';
    this.code = code;
    this.retryable = retryable;
    this.status = status;
    this.violations = violations;
    this.requestId = requestId;
    this.queued = queued;
  }
}

const wait = milliseconds => new Promise(resolve => setTimeout(resolve, milliseconds));

export async function withRetry(operation, {
  retries = 2,
  baseDelay = 250,
  shouldRetry = error => error?.retryable !== false
} = {}) {
  let lastError;
  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      return await operation(attempt);
    } catch (error) {
      lastError = error;
      if (attempt === retries || !shouldRetry(error)) break;
      await wait(baseDelay * (2 ** attempt));
    }
  }
  throw lastError;
}

export function createMemoryCache({ ttl = 5 * 60 * 1000 } = {}) {
  const entries = new Map();
  return {
    get(key) {
      const entry = entries.get(key);
      if (!entry || entry.expiresAt < Date.now()) {
        entries.delete(key);
        return undefined;
      }
      return entry.value;
    },
    set(key, value) {
      entries.set(key, { value, expiresAt: Date.now() + ttl });
      return value;
    },
    clear(key) {
      if (key) entries.delete(key);
      else entries.clear();
    }
  };
}
