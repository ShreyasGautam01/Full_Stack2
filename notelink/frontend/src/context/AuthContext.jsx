import { createContext, useState, useCallback } from 'react';
import AuthService from '../api/AuthService';
import { getUser, isTokenValid, clearSession } from '../utils/tokenHelper';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => (isTokenValid() ? getUser() : null));

  const login = useCallback(async (username, password) => {
    const data = await AuthService.login(username, password);
    setUser({ id: data.id, username: data.username, email: data.email, roles: data.roles });
    return data;
  }, []);

  const register = useCallback(async (username, email, password) => {
    return AuthService.register(username, email, password);
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}
