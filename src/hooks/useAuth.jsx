import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { api, APIError } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Verificar sesión al cargar
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    setIsLoading(true);
    try {
      await api.auth.verify();
      setIsAuthenticated(true);
      setError(null);
    } catch (err) {
      setIsAuthenticated(false);
      // No mostrar error si simplemente no está autenticado
      if (err.status !== 401) {
        setError(err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const login = useCallback(async (password) => {
    setIsLoading(true);
    setError(null);

    try {
      await api.auth.login(password);
      setIsAuthenticated(true);
      return true;
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión');
      setIsAuthenticated(false);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);

    try {
      await api.auth.logout();
    } catch (err) {
      console.error('Error al cerrar sesión:', err);
    } finally {
      setIsAuthenticated(false);
      setError(null);
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value = {
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    clearError,
    checkAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
}

export default useAuth;
