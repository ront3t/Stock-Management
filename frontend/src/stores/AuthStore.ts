import { makeAutoObservable, runInAction } from 'mobx';
import API from '../services/api';
import { jwtDecode } from 'jwt-decode';


interface JwtPayload {
  username: string;
  // include other properties if needed
}

class AuthStore {
  accessToken = '';
  refreshToken = '';
  isAuthenticated = false;
  username = '';

  constructor() {
    makeAutoObservable(this);
    this.loadTokens();
  }

  loadTokens() {
    const token = localStorage.getItem('accessToken');
    const refresh = localStorage.getItem('refreshToken');
    if (token && refresh) {
      runInAction(() => {
        this.accessToken = token;
        this.refreshToken = refresh;
        this.isAuthenticated = true;
        try {
          const decoded = jwtDecode<JwtPayload>(token);
          this.username = decoded.username;
        } catch (error) {
          console.error('Error decoding token', error);
        }
      });
    }
  }

  async login(username: string, password: string) {
    try {
      const response = await API.post('/auth/login', { username, password });
      runInAction(() => {
        this.accessToken = response.data.access_token;
        this.refreshToken = response.data.refreshToken;
        this.isAuthenticated = true;
        try {
          const decoded = jwtDecode<JwtPayload>(response.data.accessToken);
          this.username = decoded.username;
        } catch (error) {
          console.error('Error decoding token', error);
        }
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
        this.username = '';
      });
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
  }
}

export const authStore = new AuthStore();
