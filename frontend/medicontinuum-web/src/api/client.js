const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/$/, '');
const ACCESS_KEY = 'mc.auth.access';
const REFRESH_KEY = 'mc.auth.refresh';
let refreshPromise;

function notifyAuthExpired() {
  if (typeof window !== 'undefined') window.dispatchEvent(new Event('mc:auth-expired'));
}

export const authTokens = {
  getAccess: () => sessionStorage.getItem(ACCESS_KEY),
  getRefresh: () => sessionStorage.getItem(REFRESH_KEY),
  save: ({ accessToken, refreshToken }) => {
    sessionStorage.setItem(ACCESS_KEY, accessToken);
    sessionStorage.setItem(REFRESH_KEY, refreshToken);
  },
  clear: () => {
    sessionStorage.removeItem(ACCESS_KEY);
    sessionStorage.removeItem(REFRESH_KEY);
  },
};

async function readBody(response) {
  if (response.status === 204) return null;
  const text = await response.text();
  if (!text) return null;
  try { return JSON.parse(text); } catch { return text; }
}

function messageFrom(body, status) {
  if (body && typeof body === 'object') {
    return body.message || body.detail || body.error || body.title || `Request failed (${status})`;
  }
  return typeof body === 'string' && body.trim() ? body : `Request failed (${status})`;
}

async function refreshAccessToken() {
  if (!authTokens.getRefresh()) return null;
  if (!refreshPromise) {
    refreshPromise = (async () => {
      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: authTokens.getRefresh() }),
      });
      const body = await readBody(response);
      if (!response.ok || !body?.accessToken || !body?.refreshToken) {
        authTokens.clear();
        notifyAuthExpired();
        return null;
      }
      authTokens.save(body);
      return body.accessToken;
    })().finally(() => { refreshPromise = null; });
  }
  return refreshPromise;
}

export async function apiRequest(path, options = {}) {
  const {
    headers: suppliedHeaders = {},
    body,
    auth = true,
    retryAuth = true,
    ...rest
  } = options;

  const send = async (token) => {
    const headers = new Headers(suppliedHeaders);
    if (body !== undefined && !(body instanceof FormData) && !headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }
    if (auth && token) headers.set('Authorization', `Bearer ${token}`);
    const requestBody = body === undefined || body instanceof FormData || typeof body === 'string'
      ? body
      : JSON.stringify(body);
    return fetch(`${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`, {
      ...rest,
      headers,
      body: requestBody,
    });
  };

  let response = await send(authTokens.getAccess());
  if (response.status === 401 && auth && retryAuth && authTokens.getRefresh()) {
    const refreshed = await refreshAccessToken();
    if (refreshed) response = await send(refreshed);
  }

  const result = await readBody(response);
  if (!response.ok) {
    if (response.status === 401 && auth) {
      authTokens.clear();
      notifyAuthExpired();
    }
    const error = new Error(messageFrom(result, response.status));
    error.status = response.status;
    error.body = result;
    throw error;
  }
  return result;
}

export const api = {
  health: () => apiRequest('/health', { auth: false }),
  login: (credentials) => apiRequest('/auth/login', { method: 'POST', body: credentials, auth: false }),
  register: (details) => apiRequest('/auth/register', { method: 'POST', body: details, auth: false }),
  me: () => apiRequest('/auth/me'),
  logout: (refreshToken) => apiRequest('/auth/logout', { method: 'POST', body: { refreshToken } }),
  medicines: (params = {}) => apiRequest(`/medicines${Object.keys(params).length ? `?${new URLSearchParams(params)}` : ''}`, { auth: false }),
  inventory: () => apiRequest('/inventory/me'),
  inventorySummary: () => apiRequest('/inventory/me/summary'),
  lowStock: () => apiRequest('/inventory/me/low-stock'),
  expiring: (withinDays = 30) => apiRequest(`/inventory/me/expiring?withinDays=${withinDays}`),
  addStock: (payload) => apiRequest('/inventory/me/batches', { method: 'POST', body: payload }),
  consumeStock: (id, payload) => apiRequest(`/inventory/me/items/${id}/consume`, { method: 'POST', body: payload }),
  updateThreshold: (id, lowStockThreshold) => apiRequest(`/inventory/me/items/${id}/threshold`, { method: 'PATCH', body: { lowStockThreshold } }),
  appointments: (params = {}) => apiRequest(`/appointments${Object.keys(params).length ? `?${new URLSearchParams(params)}` : ''}`),
  createAppointment: (payload) => apiRequest('/appointments', { method: 'POST', body: payload }),
  familyConnections: () => apiRequest('/family/connections'),
  familyReceived: () => apiRequest('/family/connections/requests/received'),
  familySent: () => apiRequest('/family/connections/requests/sent'),
  familySend: (payload) => apiRequest('/family/connections', { method: 'POST', body: payload }),
  familyAccept: (id) => apiRequest(`/family/connections/${id}/accept`, { method: 'PATCH' }),
  familyReject: (id) => apiRequest(`/family/connections/${id}/reject`, { method: 'PATCH' }),
  familyCancel: (id) => apiRequest(`/family/connections/${id}/cancel`, { method: 'PATCH' }),
  familyRemove: (id) => apiRequest(`/family/connections/${id}`, { method: 'DELETE' }),
  vendors: () => apiRequest('/vendors'),
  doctors: (params = {}) => apiRequest(`/doctors${Object.keys(params).length ? `?${new URLSearchParams(params)}` : ''}`),
  notifications: (params = {}) => apiRequest(`/notifications/me?${new URLSearchParams(params)}`),
  notificationSummary: () => apiRequest('/notifications/me/summary'),
  markNotificationRead: (id) => apiRequest(`/notifications/me/${id}/read`, { method: 'PATCH' }),
  markAllNotificationsRead: () => apiRequest('/notifications/me/read-all', { method: 'PATCH' }),
  deleteNotification: (id) => apiRequest(`/notifications/me/${id}`, { method: 'DELETE' }),
  dashboardAnalytics: (params = {}) => apiRequest(`/analytics/dashboard${Object.keys(params).length ? `?${new URLSearchParams(params)}` : ''}`),
  inventoryAnalytics: (period = '30d') => apiRequest(`/analytics/inventory?period=${encodeURIComponent(period)}`),
  adherenceAnalytics: (period = '30d') => apiRequest(`/analytics/adherence?period=${encodeURIComponent(period)}`),
  forecastAnalytics: (period = '30d') => apiRequest(`/analytics/forecast?period=${encodeURIComponent(period)}`),
  geminiStatus: () => apiRequest('/ai/status', { auth: false, cache: 'no-store' }),
  geminiDemoChat: (payload) => apiRequest('/ai/demo-chat', { method: 'POST', body: payload, auth: false }),
  geminiChat: (payload) => apiRequest('/ai/chat', { method: 'POST', body: payload }),
};

export const isBackendAuthenticated = () => Boolean(authTokens.getAccess());
