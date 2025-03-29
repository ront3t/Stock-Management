import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Stock, StockDocument } from './stock.schema';
import { Model, Types } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { StockQuoteResponse, TickerSearchResponse, StockDto } from './stock.dto';
import { StockNotFoundException, StockAlreadyExistsException, ExternalApiException } from './exceptions/stock.exceptions';

@Injectable()
export class StocksService {
  private readonly apiBaseUrl: string;
  private readonly apiKey: string;

  constructor(
    @InjectModel(Stock.name) private readonly stockModel: Model<StockDocument>,
    private readonly configService: ConfigService,
  ) {
    this.apiKey = this.configService.get<string>('STOCK_API_KEY')!;
    this.apiBaseUrl = this.configService.get<string>('STOCK_API_BASE_URL')!;
    
    if (!this.apiKey || !this.apiBaseUrl) {
      throw new Error('STOCK_API_KEY or STOCK_API_BASE_URL are not configured');
    }
  }

  private toStockDto(stock: StockDocument): StockDto {
    return {
      id: stock._id.toString(),
      ticker: stock.ticker,
      userId: stock.user.toString(),
      createdAt: stock.createdAt,
      updatedAt: stock.updatedAt
    };
  }

  async getPortfolio(userId: Types.ObjectId): Promise<StockDto[]> {
    const stocks = await this.stockModel.find({ user: userId }).exec();
    return stocks.map(stock => this.toStockDto(stock));
  }

  async addStock(userId: Types.ObjectId, ticker: string): Promise<StockDto> {
    const normalizedTicker = ticker.toUpperCase();

    const existing = await this.stockModel
      .findOne({ user: userId, ticker: normalizedTicker })
      .exec();

    if (existing) {
      throw new StockAlreadyExistsException();
    }

    // Verify the stock exists before adding
    await this.getStockQuote(normalizedTicker);

    const createdStock = await new this.stockModel({
      ticker: normalizedTicker,
      user: userId,
    }).save();
    
    return this.toStockDto(createdStock);
  }

  async removeStock(userId: Types.ObjectId, id: string): Promise<void> {
    const result = await this.stockModel
      .findOneAndDelete({ 
        _id: new Types.ObjectId(id), 
        user: userId 
      })
      .exec();

    if (!result) {
      throw new StockNotFoundException();
    }
  }

  async getStockQuote(ticker: string): Promise<StockQuoteResponse> {
    try {
      const response = await fetch(
        `${this.apiBaseUrl}/quote/${ticker.toUpperCase()}?apikey=${this.apiKey}`
      );

      if (!response.ok) {
        if (response.status === 403) {
          throw new ExternalApiException(
            'This stock is not available in the free tier. Only US stocks are supported.'
          );
        }
        throw new ExternalApiException();
      }

      const data = await response.json();
      
      if (!Array.isArray(data) || data.length === 0) {
        throw new StockNotFoundException('Stock quote not found');
      }

      const quote = data[0];
      return {
        symbol: quote.symbol,
        name: quote.name,
        price: quote.price,
        previousClose: quote.previousClose,
        percentageChange: quote.changesPercentage,
        volume: quote.volume,
        marketCap: quote.marketCap,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new ExternalApiException();
    }
  }

  async searchTickers(query: string): Promise<TickerSearchResponse[]> {
    try {
      const response = await fetch(
        `${this.apiBaseUrl}/search?query=${query}&apikey=${this.apiKey}`
      );

      if (!response.ok) {
        throw new ExternalApiException();
      }

      const data = await response.json();
      
      if (!Array.isArray(data)) {
        throw new ExternalApiException('Invalid response format from API');
      }
      // Filter out stocks that are not NYSE, NASDAQ, or AMEX because we only want US stocks in free tier
      return data
        .filter((stock) => ['NYSE', 'NASDAQ', 'AMEX'].includes(stock.exchangeShortName))
        .map(({ symbol, name, exchangeShortName }) => ({
          symbol,
          name,
          exchange: exchangeShortName,
        }));
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new ExternalApiException();
    }
  }
}
