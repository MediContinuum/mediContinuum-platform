import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api, authTokens } from '@/api/client';

const AuthContext = createContext(null);

function splitName(fullName = '') {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  return { firstName: parts.shift() || '', lastName: parts.join(' ') || 'Patient' };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const clearSession = useCallback(() => {
    authTokens.clear();
    setUser(null);
  }, []);

  const applyAuth = useCallback((result) => {
    authTokens.save(result);
    setUser(result.user);
    return result.user;
  }, []);

  const login = useCallback(async (email, password) => {
    const result = await api.login({ email: email.trim(), password });
    return applyAuth(result);
  }, [applyAuth]);

  const register = useCallback(async ({ fullName, email, phone, password }) => {
    const result = await api.register({
      ...splitName(fullName),
      email: email.trim(),
      phoneNumber: phone.trim(),
      password,
    });
    return applyAuth(result);
  }, [applyAuth]);

  const logout = useCallback(async () => {
    const refreshToken = authTokens.getRefresh();
    try {
      if (authTokens.getAccess()) await api.logout(refreshToken);
    } finally {
      clearSession();
    }
  }, [clearSession]);

  useEffect(() => {
    let active = true;
    const restore = async () => {
      if (!authTokens.getAccess()) {
        if (active) setLoading(false);
        return;
      }
      try {
        const currentUser = await api.me();
        if (active) setUser(currentUser);
      } catch {
        if (active) clearSession();
      } finally {
        if (active) setLoading(false);
      }
    };
    restore();
    return () => { active = false; };
  }, [clearSession]);

  const value = useMemo(() => ({
    user, loading, isAuthenticated: Boolean(user), login, register, logout, clearSession,
  }), [user, loading, login, register, logout, clearSession]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}
