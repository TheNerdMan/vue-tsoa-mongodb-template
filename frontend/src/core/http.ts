import { client } from '@vue-tsoa-mongodb-template-api/client.gen';

export function getApiBaseUrl() {
  return import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
}

// Configure basic client config (baseUrl). The generated client will use global fetch,
// which we patch below to add Authorization only for API requests.
client.setConfig({
  baseUrl: getApiBaseUrl(),
});

// --- Lightweight token manager + fetch interceptor ---
const PERSIST_KEY = 'vue-tsoa-mongodb-template:auth-token';
let currentToken: string | null = null;
let onUnauthorizedHandler: ((invalidToken: boolean) => void) | null = null;

/** Set a handler that will be called when an API response returns 401. */
export function setOnUnauthorizedHandler(handler: ((invalidToken: boolean) => void) | null) {
  onUnauthorizedHandler = handler;
}

/**
 * Set the bearer token used for authenticated requests. If persist is true (default)
 * the token will be saved to localStorage so it survives reloads.
 */
export function setAuthToken(token: string, { persist = true } = {}) {
  currentToken = token;
  try {
    if (persist) localStorage.setItem(PERSIST_KEY, token);
  } catch {
    // ignore (SSR or storage disabled)
  }
}

/** Clear the current token and (optionally) the persisted token. */
export function clearAuthToken({ clearPersist = true } = {}) {
  currentToken = null;
  try {
    if (clearPersist) localStorage.removeItem(PERSIST_KEY);
  } catch {
    // ignore
  }
}

/** Returns true when a token is currently set in memory. And has not expired. */
export function isAuthenticated() {
  return !!currentToken && Date.now() / 1000 < JSON.parse(atob(currentToken.split('.')[1])).exp;
}

/** Load a persisted token from localStorage (if any) into memory. */
export function loadPersistedToken() {
  try {
    const t = localStorage.getItem(PERSIST_KEY);
    if (t) currentToken = t;
    return t;
  } catch {
    return null;
  }
}

client.interceptors.request.use((req) => {
  // Add auth header if we have a token and the request is to our API
  if (currentToken && req.url.startsWith(getApiBaseUrl())) {
    req.headers.set('Authorization', `Bearer ${currentToken}`);
  }
  return req;
});

client.interceptors.response.use((response) => {
  if (
    response.status === 401 &&
    response.url.startsWith(getApiBaseUrl()) &&
    onUnauthorizedHandler
  ) {
    onUnauthorizedHandler(true);
  }
  return response;
});

try {
  loadPersistedToken();
} catch {
  /* ignore */
}

const apiClient = client;

export default apiClient;
