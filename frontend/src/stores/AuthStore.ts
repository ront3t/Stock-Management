// apps/frontend/src/stores/AuthStore.ts
import { makeAutoObservable, runInAction } from 'mobx';
import API from '../services/api';

class AuthStore {
  accessToken   = '';
  refreshToken  = '';
  isAuthenticated = false;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
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
      runInAction(() => {
        this.accessToken = response.data.accessToken;
        this.refreshToken = response.data.refreshToken;
        this.isAuthenticated = true;
      });
      localStorage.setItem('accessToken', this.accessToken);
      localStorage.setItem('refreshToken', this.refreshToken);
    } catch (error) {
      console.error('Login failed', error);
      throw error;
    }
  }

  async logout() {
    try {
      await API.post('/auth/logout');
    } catch (error) {
      console.error('Logout endpoint returned error, clearing tokens anyway', error);
    } finally {
      runInAction(() => {
        this.accessToken = '';
        this.refreshToken = '';
        this.isAuthenticated = false;
      });
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
  }
}

export const authStore = new AuthStore();
