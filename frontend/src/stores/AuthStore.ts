// apps/frontend/src/stores/AuthStore.ts
import { makeAutoObservable } from 'mobx';
import API from '../services/api';

class AuthStore {
  accessToken   = '';
  refreshToken  = '';
  isAuthenticated = false;

  constructor() {
    makeAutoObservable(this);
    this.loadTokens();
  }

  loadTokens() {
    const token   = localStorage.getItem('accessToken');
    const refresh = localStorage.getItem('refreshToken');
    if (token && refresh) {
      this.accessToken = token;
      this.refreshToken = refresh;
      this.isAuthenticated = true;
    }
  }

  async login(username: string, password: string) {
    try {
      const response = await API.post('/auth/login', { username, password });
      this.accessToken  = response.data.accessToken;
      this.refreshToken = response.data.refreshToken;
      this.isAuthenticated = true;
      localStorage.setItem('accessToken', this.accessToken);
      localStorage.setItem('refreshToken', this.refreshToken);
    } catch (error) {
      console.error('Login failed', error);
      throw error;
    }
  }

  logout() {
    API.post('/auth/logout').then(() => {
      this.accessToken = '';
      this.refreshToken = '';
      this.isAuthenticated = false;
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    });
  }

  async refreshAccessToken() {
    try {
      const response = await API.post('/auth/refresh', { refreshToken: this.refreshToken });
      this.accessToken  = response.data.accessToken;
      this.refreshToken = response.data.refreshToken;
      localStorage.setItem('accessToken', this.accessToken);
      localStorage.setItem('refreshToken', this.refreshToken);
    } catch (error) {
      console.error('Refresh token failed', error);
      this.logout();
    }
  }
}

export const authStore = new AuthStore();
