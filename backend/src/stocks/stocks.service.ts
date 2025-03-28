import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Stock, StockDocument } from './stock.schema';
import { Model } from 'mongoose';

@Injectable()
export class StocksService {
  constructor(
    @InjectModel(Stock.name) private stockModel: Model<StockDocument>
  ) {}

  async getPortfolio(userId: string): Promise<Stock[]> {
    return this.stockModel.find({ user: userId }).exec();
  }

  async addStock(userId: string, ticker: string): Promise<Stock> {
    const existing = await this.stockModel.findOne({ user: userId, ticker }).exec();
    if (existing) {
      throw new HttpException('Stock already exists in portfolio', HttpStatus.BAD_REQUEST);
    }
    const createdStock = new this.stockModel({ ticker, user: userId });
    return createdStock.save();
  }

  async removeStock(userId: string, id: string): Promise<Stock> {
    // Verify the stock exists for the user
    const stock = await this.stockModel.findOne({ _id: id, user: userId }).exec();
    if (!stock) {
      throw new HttpException('Stock not found', HttpStatus.NOT_FOUND);
    }
    const removedStock = await this.stockModel.findByIdAndDelete(id).exec();
    if (!removedStock) {
      throw new HttpException('Failed to remove stock', HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return removedStock;
  }
  

  async getStockQuote(ticker: string): Promise<any> {
    const apiKey = process.env.FMP_API_KEY;
    const url = `https://financialmodelingprep.com/api/v3/quote/${ticker}?apikey=${apiKey}`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new HttpException('Error fetching stock data', HttpStatus.BAD_GATEWAY);
      }
      const data = await response.json();
      if (data && data.length > 0) {
        return data[0];
      } else {
        throw new HttpException('Stock data not found', HttpStatus.NOT_FOUND);
      }
    } catch (error) {
      throw new HttpException('Error fetching stock data', HttpStatus.BAD_GATEWAY);
    }
  }
}
