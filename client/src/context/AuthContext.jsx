import { createContext, useState, useEffect, useCallback } from 'react';
import { loginApi, logoutApi, getMeApi } from '../services/authService';
import { useIdleTimeout } from '../hooks/useIdleTimeout';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(async () => {
    try {
      await logoutApi();
    } catch {
      // Proceed with local logout even if API call fails
    }
    setUser(null);
  }, []);

  const checkAuth = useCallback(async () => {
    try {
      const data = await getMeApi();
      if (data.success) {
        setUser(data.data);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (email, password) => {
    const data = await loginApi(email, password);
    if (data.success) {
      setUser(data.data.user);
      return data.data;
    }
    throw new Error(data.error);
  };

  // Idle timeout — auto-logout after 15 minutes of inactivity
  const { showWarning, dismissWarning } = useIdleTimeout(logout);

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
    role: user ? user.role : null,
    showIdleWarning: showWarning,
    dismissIdleWarning: dismissWarning
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
      {/* Idle timeout warning modal */}
      {user && showWarning && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999
        }}>
          <div style={{
            backgroundColor: 'var(--color-surface)',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--space-xl)',
            maxWidth: '400px',
            textAlign: 'center',
            boxShadow: 'var(--shadow-lg)',
            border: '1px solid var(--color-border)'
          }}>
            <div style={{ fontSize: '32px', marginBottom: 'var(--space-md)', color: 'var(--color-warning)' }}>⏰</div>
            <h3 style={{ marginBottom: 'var(--space-sm)' }}>Sesión por expirar</h3>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '13px', marginBottom: 'var(--space-lg)' }}>
              Su sesión expirará en 2 minutos por inactividad.
            </p>
            <button
              onClick={dismissWarning}
              style={{
                padding: 'var(--space-sm) var(--space-lg)',
                backgroundColor: 'var(--color-primary)',
                color: 'var(--color-text-on-primary)',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 500
              }}
            >
              Continuar sesión
            </button>
          </div>
        </div>
      )}
    </AuthContext.Provider>
  );
}
