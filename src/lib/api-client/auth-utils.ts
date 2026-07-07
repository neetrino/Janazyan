const AUTH_TOKEN_KEY = 'auth_token';
const AUTH_USER_KEY = 'auth_user';

type StoredAuthUserPatch = Partial<{
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
}>;

/**
 * Get auth token from localStorage
 */
export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  } catch {
    return null;
  }
}

/**
 * Handle 401 Unauthorized errors - clear auth and redirect
 */
/** Merge profile fields into persisted auth user (header, checkout prefill, etc.). */
export function patchStoredAuthUser(updates: StoredAuthUserPatch): void {
  if (typeof window === 'undefined') return;

  try {
    const stored = localStorage.getItem(AUTH_USER_KEY);
    if (!stored) return;

    const parsed = JSON.parse(stored) as Record<string, unknown>;
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify({ ...parsed, ...updates }));
    window.dispatchEvent(new Event('auth-updated'));
  } catch {
    // Ignore corrupted storage
  }
}

export function handleUnauthorized() {
  if (typeof window === 'undefined') return;
  
  console.warn('⚠️ [API CLIENT] Unauthorized (401) - clearing auth data');
  localStorage.removeItem('auth_token');
  localStorage.removeItem('auth_user');
  
  // Trigger auth update event to notify AuthContext
  window.dispatchEvent(new Event('auth-updated'));
  
  // Redirect to login if not already there
  if (!window.location.pathname.includes('/login')) {
    const currentPath = window.location.pathname + window.location.search;
    window.location.href = '/login?redirect=' + encodeURIComponent(currentPath);
  }
}




