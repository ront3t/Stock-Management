// apps/frontend/src/stores/PortfolioStore.ts
import { makeAutoObservable, runInAction } from 'mobx';
import API from '../services/api';

class PortfolioStore {
  stocks    = [];
  analytics = null;

  constructor() {
    makeAutoObservable(this);
    this.fetchPortfolio();
  }

  async fetchPortfolio() {
    try {
      const response = await API.get('/portfolio');
      runInAction(() => {
        this.stocks = response.data.stocks;
      });
    } catch (error) {
      console.error('Failed to fetch portfolio', error);
    }
  }

  async addStock(ticker: string) {
    try {
      const response = await API.post('/portfolio/add', { ticker });
      runInAction(() => {
        this.stocks = response.data.stocks;
      });
    } catch (error) {
      console.error('Failed to add stock', error);
    }
  }

  async removeStock(ticker: string) {
    try {
      const response = await API.delete(`/portfolio/remove/${ticker}`);
      runInAction(() => {
        this.stocks = response.data.stocks;
      });
    } catch (error) {
      console.error('Failed to remove stock', error);
    }
  }

  async fetchAnalytics() {
    try {
      const response = await API.get('/portfolio/analytics');
      runInAction(() => {
        this.analytics = response.data;
      });
    } catch (error) {
      console.error('Failed to fetch analytics', error);
    }
  }
}

export const portfolioStore = new PortfolioStore();
