import api from './axiosConfig';
import { saveToken, saveUser, clearSession } from '../utils/tokenHelper';

const AuthService = {
  async login(username, password) {
    const { data } = await api.post('/auth/signin', { username, password });
    saveToken(data.token);
    saveUser({ id: data.id, username: data.username, email: data.email, roles: data.roles });
    return data;
  },

  async register(username, email, password) {
    const { data } = await api.post('/auth/signup', { username, email, password });
    return data;
  },

  logout() {
    clearSession();
  },
};

export default AuthService;
