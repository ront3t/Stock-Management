// apps/frontend/src/stores/PortfolioStore.ts
import { makeAutoObservable, runInAction } from 'mobx';
import API from '../services/api';

class PortfolioStore {
  // Now, stocks is an array of stock objects: { _id: string, ticker: string, ... }
  stocks = [];
  analytics = null;

  constructor() {
    makeAutoObservable(this);
    this.fetchPortfolio();
  }

  async fetchPortfolio() {
    try {
      // Updated endpoint to use '/stocks/portfolio'
      const response = await API.get('/stocks/portfolio');
      runInAction(() => {
        // Assume response.data is an array of stock objects
        this.stocks = response.data;
      });
    } catch (error) {
      console.error('Failed to fetch portfolio', error);
    }
  }

  async addStock(ticker: string) {
    try {
      // Updated endpoint for adding stock
      await API.post('/stocks/portfolio', { ticker });
      // Refresh the portfolio after adding
      this.fetchPortfolio();
    } catch (error) {
      console.error('Failed to add stock', error);
    }
  }

  async removeStock(stockId: string) {
    try {
      // Updated endpoint to pass stockId instead of ticker
      await API.delete(`/stocks/portfolio/${stockId}`);
      // Refresh the portfolio after removal
      this.fetchPortfolio();
    } catch (error) {
      console.error('Failed to remove stock', error);
    }
  }

  async fetchAnalytics() {
    try {
      const response = await API.get('/stocks/portfolio/analytics');
      runInAction(() => {
        this.analytics = response.data;
      });
    } catch (error) {
      console.error('Failed to fetch analytics', error);
    }
  }
}

export const portfolioStore = new PortfolioStore();
