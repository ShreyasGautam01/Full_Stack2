import { jwtDecode } from 'jwt-decode';

const TOKEN_KEY = 'notelink_token';
const USER_KEY  = 'notelink_user';

export const saveToken = (token) => localStorage.setItem(TOKEN_KEY, token);
export const getToken  = ()      => localStorage.getItem(TOKEN_KEY);
export const removeToken = ()    => localStorage.removeItem(TOKEN_KEY);

export const saveUser  = (user)  => localStorage.setItem(USER_KEY, JSON.stringify(user));
export const getUser   = ()      => {
  const raw = localStorage.getItem(USER_KEY);
  return raw ? JSON.parse(raw) : null;
};
export const removeUser = () => localStorage.removeItem(USER_KEY);

export const clearSession = () => {
  removeToken();
  removeUser();
};

/**
 * Returns true if a token exists AND has not expired.
 */
export const isTokenValid = () => {
  const token = getToken();
  if (!token) return false;
  try {
    const { exp } = jwtDecode(token);
    return Date.now() < exp * 1000;
  } catch {
    return false;
  }
};
